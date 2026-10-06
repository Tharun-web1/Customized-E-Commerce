from django.contrib.auth import authenticate, login
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Category, VisitingCard, Template, PromoCode, CartItem
from .serializers import (
    CategorySerializer, VisitingCardSerializer, TemplateSerializer,
    PromoCodeSerializer, CartItemSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class VisitingCardViewSet(viewsets.ModelViewSet):
    serializer_class = VisitingCardSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = VisitingCard.objects.select_related('category').all()
        group = self.request.query_params.get('group')
        category_slug = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if group:
            queryset = queryset.filter(category_group=group)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        queryset = self.filter_queryset(self.get_queryset())
        if lookup and lookup.isdigit():
            obj = get_object_or_404(queryset, id=int(lookup))
        else:
            obj = get_object_or_404(queryset, slug=lookup)
        self.check_object_permissions(self.request, obj)
        return obj


class TemplateViewSet(viewsets.ModelViewSet):
    serializer_class = TemplateSerializer

    def get_queryset(self):
        queryset = Template.objects.select_related('card').all()
        industry = self.request.query_params.get('industry')
        card_id = self.request.query_params.get('card_id') or self.request.query_params.get('card')
        card_slug = self.request.query_params.get('card_slug')
        orientation = self.request.query_params.get('orientation')
        search = self.request.query_params.get('search')

        if industry and industry.lower() != 'all':
            queryset = queryset.filter(industry__icontains=industry)
        if card_id:
            queryset = queryset.filter(card_id=card_id)
        if card_slug:
            queryset = queryset.filter(card__slug=card_slug)
        if orientation and orientation.lower() != 'all':
            queryset = queryset.filter(orientation__iexact=orientation)
        if search:
            queryset = queryset.filter(title__icontains=search)
        return queryset



class PromoCodeViewSet(viewsets.ModelViewSet):
    queryset = PromoCode.objects.all()
    serializer_class = PromoCodeSerializer


@api_view(['POST'])
def validate_promo(request):
    code = request.data.get('code', '').strip().upper()
    order_total = float(request.data.get('order_total', 0))

    try:
        promo = PromoCode.objects.get(code__iexact=code, is_active=True)
        if order_total < float(promo.min_order_value):
            return Response({
                'valid': False,
                'message': f"Order must be at least ₹{promo.min_order_value} to apply {promo.code}"
            }, status=status.HTTP_400_BAD_REQUEST)

        discount_amount = (order_total * promo.discount_percent) / 100.0
        final_total = max(0, order_total - discount_amount)
        return Response({
            'valid': True,
            'code': promo.code,
            'discount_percent': promo.discount_percent,
            'discount_amount': round(discount_amount, 2),
            'final_total': round(final_total, 2),
            'message': f"Coupon {promo.code} applied! {promo.discount_percent}% OFF"
        })
    except PromoCode.DoesNotExist:
        return Response({
            'valid': False,
            'message': 'Invalid coupon code. Try NEW15 or SAVE5.'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
def cart_view(request):
    session_id = (
        request.headers.get('X-Session-ID') or
        (request.data.get('session_id') if hasattr(request, 'data') and isinstance(request.data, dict) else None) or
        request.query_params.get('session_id') or
        'guest_session'
    )

    if request.method == 'GET':
        items = CartItem.objects.filter(session_id=session_id).order_by('-created_at')
        serializer = CartItemSerializer(items, many=True)
        subtotal = sum(item.total_price for item in items)
        return Response({
            'items': serializer.data,
            'count': items.count(),
            'subtotal': round(float(subtotal), 2)
        })

    elif request.method == 'POST':
        card_id = request.data.get('card_id')
        quantity = int(request.data.get('quantity', 100))
        corner_style = request.data.get('corner_style', 'Standard')
        finish = request.data.get('finish', 'Matte')
        backside = request.data.get('backside', 'Blank')

        custom_name = request.data.get('custom_name', '')
        custom_title = request.data.get('custom_title', '')
        custom_company = request.data.get('custom_company', '')
        custom_phone = request.data.get('custom_phone', '')
        custom_email = request.data.get('custom_email', '')
        custom_qr_url = request.data.get('custom_qr_url', '')
        preview_image = request.data.get('preview_image') or request.data.get('uploaded_artwork') or ''
        back_preview_image = request.data.get('back_preview_image') or request.data.get('uploaded_artwork_back') or ''
        template_name = request.data.get('template_name', '')
        accent_color = request.data.get('accent_color', '#0056b3')

        card = None
        if card_id:
            try:
                card = VisitingCard.objects.filter(id=int(card_id)).first()
            except (ValueError, TypeError):
                card = None

        slug = request.data.get('slug') or request.data.get('card_slug')
        if not card and slug:
            card = VisitingCard.objects.filter(slug=slug).first()

        title = request.data.get('title') or request.data.get('card_title')
        if not card and title:
            card = VisitingCard.objects.filter(title__iexact=title).first()

        if not card:
            card = VisitingCard.objects.filter(slug='standard').first() or VisitingCard.objects.first()

        if not card:
            card = VisitingCard.objects.create(
                title=title or 'Standard Visiting Cards',
                slug=slug or 'standard',
                base_price_100=200.0,
                dimensions='8.9 cm x 5.1 cm',
                gsm='350 GSM',
                finish_type='Matte / Glossy'
            )
        
        # Calculate volume price
        client_unit_price = request.data.get('unit_price')
        client_total_price = request.data.get('total_price')

        base_unit = float(card.base_price_100) / 100.0
        if quantity >= 1000:
            discount_factor = 0.65
        elif quantity >= 500:
            discount_factor = 0.75
        elif quantity >= 200:
            discount_factor = 0.85
        else:
            discount_factor = 1.0

        calculated_unit = round(base_unit * discount_factor, 2)
        backside_fee = (0.50 * quantity) if backside in ['Full Color', 'color', 'monochrome'] else 0.0
        calculated_total = round((calculated_unit * quantity) + backside_fee, 2)

        unit_price = float(client_unit_price) if client_unit_price is not None else calculated_unit
        total_price = float(client_total_price) if client_total_price is not None else calculated_total

        cart_item = CartItem.objects.create(
            session_id=session_id,
            card=card,
            quantity=quantity,
            corner_style=corner_style,
            finish=finish,
            backside=backside,
            custom_name=custom_name,
            custom_title=custom_title,
            custom_company=custom_company,
            custom_phone=custom_phone,
            custom_email=custom_email,
            custom_qr_url=custom_qr_url,
            preview_image=preview_image,
            back_preview_image=back_preview_image,
            template_name=template_name,
            accent_color=accent_color,
            unit_price=unit_price,
            total_price=total_price
        )

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def remove_cart_item(request, item_id):
    session_id = request.headers.get('X-Session-ID') or request.query_params.get('session_id') or 'guest_session'
    try:
        item = CartItem.objects.get(id=item_id, session_id=session_id)
        item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def admin_login_api(request):
    """
    Admin authentication API:
    Accepts: { "username": "admin", "password": "yourpassword" }
    Returns user info, staff status, and session authentication.
    """
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '').strip()

    if not username or not password:
        return Response({
            'success': False,
            'message': 'Username and password are required.'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        if user.is_staff or user.is_superuser:
            login(request, user)
            return Response({
                'success': True,
                'message': 'Admin login successful.',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Access denied: User does not have administrator privileges.'
            }, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({
            'success': False,
            'message': 'Invalid username or password.'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def upload_design_api(request):
    """
    Accepts file upload (multipart/form-data) or data_url payload for user uploaded artwork designs.
    """
    file_obj = request.FILES.get('file') or request.FILES.get('artwork')
    if file_obj:
        from django.core.files.storage import default_storage
        saved_path = default_storage.save(f"user_designs/{file_obj.name}", file_obj)
        file_url = default_storage.url(saved_path)
        return Response({
            'success': True,
            'url': file_url,
            'name': file_obj.name,
            'size': file_obj.size,
        }, status=status.HTTP_201_CREATED)

    data_url = request.data.get('data_url')
    if data_url:
        return Response({
            'success': True,
            'url': data_url,
            'name': request.data.get('name', 'user_design.png'),
        }, status=status.HTTP_200_OK)

    return Response({'error': 'No file or data provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def admin_stats_api(request):
    """
    Returns real-time analytics, metrics and recent customer card orders for the admin dashboard.
    """
    total_cards = VisitingCard.objects.count()
    total_categories = Category.objects.count()
    total_templates = Template.objects.count()
    total_promos = PromoCode.objects.count()

    all_orders = CartItem.objects.all()
    total_orders = all_orders.count()
    revenue_sum = sum(float(item.total_price) for item in all_orders) if total_orders > 0 else 0.0

    recent_items = CartItem.objects.order_by('-created_at')[:10]
    recent_serializer = CartItemSerializer(recent_items, many=True)

    group_stats = {}
    for group_key, group_label in VisitingCard.CATEGORY_GROUPS:
        cnt = VisitingCard.objects.filter(category_group=group_key).count()
        if cnt > 0:
            group_stats[group_label] = cnt

    return Response({
        'success': True,
        'stats': {
            'total_cards': total_cards,
            'total_categories': total_categories,
            'total_templates': total_templates,
            'total_promos': total_promos,
            'total_orders': total_orders,
            'total_revenue': round(float(revenue_sum), 2),
        },
        'group_stats': group_stats,
        'recent_orders': recent_serializer.data,
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'DELETE'])
def admin_orders_api(request, order_id=None):
    """
    Admin endpoint to view, search, and manage customer custom orders and designs.
    """
    if request.method == 'GET':
        search = request.query_params.get('search', '').strip()
        queryset = CartItem.objects.order_by('-created_at')
        if search:
            queryset = queryset.filter(
                models.Q(custom_name__icontains=search) |
                models.Q(custom_company__icontains=search) |
                models.Q(custom_phone__icontains=search) |
                models.Q(custom_email__icontains=search) |
                models.Q(card__title__icontains=search) |
                models.Q(template_name__icontains=search)
            )
        serializer = CartItemSerializer(queryset[:60], many=True)
        return Response({
            'success': True,
            'orders': serializer.data,
            'count': queryset.count(),
        }, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        if not order_id:
            return Response({'error': 'Order ID required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = CartItem.objects.get(id=order_id)
            order.delete()
            return Response({'success': True, 'message': f'Order #{order_id} removed.'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)


