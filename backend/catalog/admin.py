from django.contrib import admin
from .models import Category, VisitingCard, Template, PromoCode, CartItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    ordering = ('display_order', 'name')

@admin.register(VisitingCard)
class VisitingCardAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug', 'category', 'category_group', 'gsm', 'base_price_100', 'badge', 'is_featured')
    list_filter = ('category', 'category_group', 'is_featured', 'badge')
    search_fields = ('title', 'description', 'tagline')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('base_price_100', 'is_featured')

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'industry', 'orientation', 'preview_style')
    list_filter = ('industry', 'orientation')
    search_fields = ('title', 'sample_company')

@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percent', 'min_order_value', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'description')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'session_id', 'card', 'quantity', 'total_price', 'created_at')
    list_filter = ('card', 'finish')
    search_fields = ('session_id', 'custom_name', 'custom_company', 'custom_phone')

