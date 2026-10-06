from rest_framework import serializers
from .models import Category, VisitingCard, Template, PromoCode, CartItem

class CategorySerializer(serializers.ModelSerializer):
    cards_count = serializers.IntegerField(source='cards.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'display_order', 'cards_count']


class VisitingCardSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)
    templates_count = serializers.IntegerField(source='templates.count', read_only=True)

    class Meta:
        model = VisitingCard
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_group',
            'dimensions', 'gsm', 'finish_type', 'base_price_100', 'min_quantity',
            'rating', 'reviews_count', 'badge', 'tagline', 'description',
            'bullet_points', 'specifications', 'image_url', 'image_url_2', 'image_url_3',
            'accent_color', 'image_gradient', 'is_featured', 'templates_count'
        ]


    def create(self, validated_data):
        if not validated_data.get('category'):
            group = validated_data.get('category_group', 'shapes')
            cat = Category.objects.filter(slug=group).first() or Category.objects.first()
            validated_data['category'] = cat
        if not validated_data.get('slug'):
            from django.utils.text import slugify
            base_slug = slugify(validated_data['title'])
            slug = base_slug
            counter = 1
            while VisitingCard.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            validated_data['slug'] = slug
        return super().create(validated_data)


class TemplateSerializer(serializers.ModelSerializer):
    card_title = serializers.CharField(source='card.title', read_only=True)
    card = serializers.PrimaryKeyRelatedField(queryset=VisitingCard.objects.all(), required=False, allow_null=True)

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        card_val = data.get('card')
        if card_val is not None:
            try:
                card_id = int(card_val)
                if not VisitingCard.objects.filter(id=card_id).exists():
                    first_card = VisitingCard.objects.first()
                    data['card'] = first_card.id if first_card else None
            except (ValueError, TypeError):
                first_card = VisitingCard.objects.first()
                data['card'] = first_card.id if first_card else None
        else:
            first_card = VisitingCard.objects.first()
            data['card'] = first_card.id if first_card else None
        return super().to_internal_value(data)

    class Meta:
        model = Template
        fields = '__all__'
        extra_kwargs = {
            'sample_company': {'required': False, 'allow_blank': True},
            'sample_tagline': {'required': False, 'allow_blank': True},
            'sample_name': {'required': False, 'allow_blank': True},
            'sample_job_title': {'required': False, 'allow_blank': True},
            'sample_phone': {'required': False, 'allow_blank': True},
            'sample_email': {'required': False, 'allow_blank': True},
            'industry': {'required': False, 'allow_blank': True},
            'orientation': {'required': False, 'allow_blank': True},
            'primary_color': {'required': False, 'allow_blank': True},
            'preview_style': {'required': False, 'allow_blank': True},
            'layout_type': {'required': False, 'allow_blank': True},
            'color_palette': {'required': False, 'allow_blank': True},
            'background_image': {'required': False, 'allow_blank': True},
            'back_background_image': {'required': False, 'allow_blank': True},
        }


class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = ['id', 'code', 'discount_percent', 'min_order_value', 'description', 'is_active']


class CartItemSerializer(serializers.ModelSerializer):
    card_title = serializers.CharField(source='card.title', read_only=True)
    card_gsm = serializers.CharField(source='card.gsm', read_only=True)

    class Meta:
        model = CartItem
        fields = '__all__'
