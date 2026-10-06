from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, VisitingCardViewSet, TemplateViewSet, PromoCodeViewSet,
    validate_promo, cart_view, remove_cart_item, admin_login_api, upload_design_api,
    admin_stats_api, admin_orders_api
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'cards', VisitingCardViewSet, basename='card')
router.register(r'templates', TemplateViewSet, basename='template')
router.register(r'promocodes', PromoCodeViewSet, basename='promocode')
router.register(r'promos', PromoCodeViewSet, basename='promo')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/login/', admin_login_api, name='admin_login_api'),
    path('admin/stats/', admin_stats_api, name='admin_stats_api'),
    path('admin/orders/', admin_orders_api, name='admin_orders_api'),
    path('admin/orders/<int:order_id>/', admin_orders_api, name='admin_order_detail_api'),
    path('promos/validate/', validate_promo, name='validate_promo'),
    path('cart/', cart_view, name='cart_view'),
    path('cart/<int:item_id>/', remove_cart_item, name='remove_cart_item'),
    path('upload/', upload_design_api, name='upload_design_api'),
]

