from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class VisitingCard(models.Model):
    CATEGORY_GROUPS = [
        ('shapes', '1. By Shape'),
        ('texture', '2. Texture'),
        ('special', '3. Special'),
        ('holders', '4. Card Holders'),
        ('papers_textures', 'Papers & Textures (Legacy)'),
        ('specialty', 'Specialty (Legacy)'),
    ]

    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='cards', null=True, blank=True)
    category_group = models.CharField(max_length=100, blank=True, default='shapes')
    dimensions = models.CharField(max_length=100, default='8.9 cm x 5.1 cm')
    gsm = models.CharField(max_length=50, default='300-350 GSM')
    finish_type = models.CharField(max_length=100, default='Matte')
    base_price_100 = models.DecimalField(max_digits=10, decimal_places=2, default=270.00)
    min_quantity = models.PositiveIntegerField(default=100)
    rating = models.FloatField(default=4.5)
    reviews_count = models.PositiveIntegerField(default=120)
    badge = models.CharField(max_length=50, blank=True, null=True, default='')
    tagline = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    bullet_points = models.TextField(blank=True, default='')
    specifications = models.TextField(blank=True, default='')
    image_url = models.CharField(max_length=500, blank=True, default='/pdp_card_stack.jpg')
    image_url_2 = models.CharField(max_length=500, blank=True, default='/pdp_card_box.jpg')
    image_url_3 = models.CharField(max_length=500, blank=True, default='/visiting_cards_hero.jpg')
    accent_color = models.CharField(max_length=50, default='#003366')
    image_gradient = models.CharField(max_length=255, default='linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)')
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['-is_featured', 'title']

    def __str__(self):
        return f"{self.title} ({self.gsm})"


class Template(models.Model):
    card = models.ForeignKey(VisitingCard, on_delete=models.CASCADE, related_name='templates', null=True, blank=True)
    title = models.CharField(max_length=150)
    industry = models.CharField(max_length=100, default='Corporate & Business', blank=True)
    orientation = models.CharField(max_length=20, default='horizontal', blank=True)
    primary_color = models.CharField(max_length=50, default='#1e3a8a', blank=True)
    preview_style = models.CharField(max_length=100, default='modern', blank=True)
    layout_type = models.CharField(max_length=50, default='classic_photo', blank=True)
    color_palette = models.CharField(max_length=255, default='#0056b3,#1e293b,#047857,#dc2626', blank=True)
    sample_company = models.CharField(max_length=150, default='Vertex Solutions Pvt Ltd', blank=True)
    sample_tagline = models.CharField(max_length=200, default='Engineering Tomorrow', blank=True)
    sample_name = models.CharField(max_length=150, default='Aditya Sharma', blank=True)
    sample_job_title = models.CharField(max_length=150, default='Managing Director', blank=True)
    sample_phone = models.CharField(max_length=50, default='+91 98765 43210', blank=True)
    sample_email = models.CharField(max_length=100, default='contact@example.in', blank=True)
    background_image = models.TextField(blank=True, default='')
    back_background_image = models.TextField(blank=True, default='')
    text_positions = models.JSONField(default=dict, blank=True)

    def __str__(self):
        card_prefix = f"[{self.card.title}] " if self.card else ""
        return f"{card_prefix}{self.title} - {self.industry}"



class PromoCode(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percent = models.PositiveIntegerField(default=15)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} ({self.discount_percent}% off)"


class CartItem(models.Model):
    session_id = models.CharField(max_length=100)
    card = models.ForeignKey(VisitingCard, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=100)
    corner_style = models.CharField(max_length=50, default='Standard')
    finish = models.CharField(max_length=50, default='Matte')
    backside = models.CharField(max_length=50, default='Blank')
    
    # Custom printed details
    custom_name = models.CharField(max_length=100, blank=True)
    custom_title = models.CharField(max_length=100, blank=True)
    custom_company = models.CharField(max_length=150, blank=True)
    custom_phone = models.CharField(max_length=50, blank=True)
    custom_email = models.CharField(max_length=100, blank=True)
    custom_qr_url = models.CharField(max_length=255, blank=True)
    preview_image = models.TextField(blank=True, default='')
    back_preview_image = models.TextField(blank=True, default='')
    template_name = models.CharField(max_length=150, blank=True, default='')
    accent_color = models.CharField(max_length=50, blank=True, default='#0056b3')

    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=2.70)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=270.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity}x {self.card.title} - ₹{self.total_price}"
