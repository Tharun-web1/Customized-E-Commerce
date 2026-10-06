from django.core.management.base import BaseCommand
from catalog.models import Category, VisitingCard, Template, PromoCode

class Command(BaseCommand):
    help = 'Seeds database with Vistaprint India visiting cards data, categories, and templates'

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing existing catalog data...")
        Category.objects.all().delete()
        VisitingCard.objects.all().delete()
        Template.objects.all().delete()
        PromoCode.objects.all().delete()

        self.stdout.write("Creating Categories...")
        cat_shapes = Category.objects.create(
            name="1. By Shape",
            slug="shapes",
            description="Explore cards crafted in distinct silhouettes: Standard, Classic, and Custom Shape.",
            display_order=1
        )
        cat_texture = Category.objects.create(
            name="2. Texture",
            slug="texture",
            description="Premium textures including Spot UV, Raised Foil, Non-Tearable, Pearl, Kraft, and Transparent.",
            display_order=2
        )
        cat_special = Category.objects.create(
            name="3. Special",
            slug="special",
            description="High-volume enterprise and wholesale printing options.",
            display_order=3
        )
        cat_holders = Category.objects.create(
            name="4. Card Holders",
            slug="holders",
            description="Executive desktop visiting card cases and holders.",
            display_order=4
        )

        self.stdout.write("Creating Visiting Cards...")
        cards_data = [
            # === 1. BY SHAPE (3 items) ===
            {
                "title": "Standard Visiting Cards",
                "slug": "standard",
                "category": cat_shapes,
                "category_group": "shapes",
                "dimensions": "8.9 cm x 5.1 cm (3.5\" x 2\")",
                "gsm": "350 GSM",
                "finish_type": "Matte / Glossy",
                "base_price_100": 200.00,
                "min_quantity": 100,
                "rating": 4.4,
                "reviews_count": 1780,
                "badge": None,
                "tagline": "The universally recognized professional benchmark",
                "description": "The quintessential business card format. Available in smooth matte or vibrant glossy finishes, printed on heavy commercial card stock.",
                "accent_color": "#ea580c",
                "image_gradient": "linear-gradient(135deg, #0a2540 0%, #1a365d 100%)",
                "is_featured": True
            },
            {
                "title": "Classic Visiting Cards",
                "slug": "classic",
                "category": cat_shapes,
                "category_group": "shapes",
                "dimensions": "9.1 cm x 5.5 cm",
                "gsm": "260-300 GSM",
                "finish_type": "Economy Matte",
                "base_price_100": 230.00,
                "min_quantity": 100,
                "rating": 4.5,
                "reviews_count": 244,
                "badge": None,
                "tagline": "Affordable entry cards for high-volume outreach",
                "description": "A slightly wider footprint with an accessible price point. Perfect for high-frequency networking, trade shows, and retail outreach.",
                "accent_color": "#e11d48",
                "image_gradient": "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                "is_featured": True
            },
            {
                "title": "Custom Shape Cards",
                "slug": "custom-shape",
                "category": cat_shapes,
                "category_group": "shapes",
                "dimensions": "Custom Die-Cut",
                "gsm": "350 GSM",
                "finish_type": "Custom Laser Die-Cut",
                "base_price_100": 300.00,
                "min_quantity": 100,
                "rating": 4.6,
                "reviews_count": 31,
                "badge": "New",
                "tagline": "Precision laser-cut to match your unique brand logo",
                "description": "Cut to the exact contours of your mascot, brand emblem, or product silhouette. The ultimate custom statement.",
                "accent_color": "#2563eb",
                "image_gradient": "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                "is_featured": True
            },

            # === 2. TEXTURE (6 items) ===
            # Premium Plus Cards
            {
                "title": "Spot UV Cards",
                "slug": "spot-uv",
                "category": cat_texture,
                "category_group": "texture",
                "dimensions": "8.9 cm x 5.1 cm",
                "gsm": "350-400 GSM",
                "finish_type": "Raised High-Build Clear Lacquer",
                "base_price_100": 480.00,
                "min_quantity": 100,
                "rating": 4.6,
                "reviews_count": 124,
                "badge": "Premium Plus",
                "tagline": "Glossy 3D liquid lacquer overlay on smooth matte stock",
                "description": "High-build glossy lacquer over smooth matte stock for an unforgettable tactile impression.",
                "accent_color": "#4338ca",
                "image_gradient": "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
                "is_featured": True
            },
            {
                "title": "Raised Foil Cards",
                "slug": "raised-foil",
                "category": cat_texture,
                "category_group": "texture",
                "dimensions": "8.9 cm x 5.1 cm",
                "gsm": "350 GSM Velvet Stock",
                "finish_type": "Embossed Gold / Silver Foil",
                "base_price_100": 550.00,
                "min_quantity": 100,
                "rating": 4.8,
                "reviews_count": 92,
                "badge": "Premium Plus",
                "tagline": "Gleaming 3D metallic gold foil that catches every eye",
                "description": "Shimmering real metallic foil raised above a suede velvet background.",
                "accent_color": "#f59e0b",
                "image_gradient": "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)",
                "is_featured": True
            },
            # Textures
            {
                "title": "Non-Tearable Cards",
                "slug": "non-tearable",
                "category": cat_texture,
                "category_group": "texture",
                "dimensions": "8.9 cm x 5.1 cm",
                "gsm": "260 GSM Synthetic PET",
                "finish_type": "Waterproof Plastic Film",
                "base_price_100": 380.00,
                "min_quantity": 100,
                "rating": 4.2,
                "reviews_count": 53,
                "badge": "Waterproof",
                "tagline": "Untearable synthetic substrate built for field resilience",
                "description": "Engineered from resilient poly-film that resists water, oil, grease, and bending.",
                "accent_color": "#06b6d4",
                "image_gradient": "linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)",
                "is_featured": False
            },
            {
                "title": "Pearl Cards",
                "slug": "pearl",
                "category": cat_texture,
                "category_group": "texture",
                "dimensions": "8.9 cm x 5.1 cm",
                "gsm": "250 GSM Pearlized",
                "finish_type": "Iridescent Metallic Shimmer",
                "base_price_100": 410.00,
                "min_quantity": 100,
                "rating": 4.5,
                "reviews_count": 68,
                "badge": "Shimmer",
                "tagline": "Gentle champagne luster that glimmers under lighting",
                "description": "Embedded with pearlescent mica flakes that catch soft room light.",
                "accent_color": "#d946ef",
                "image_gradient": "linear-gradient(135deg, #701a75 0%, #d946ef 100%)",
                "is_featured": False
            },
            {
                "title": "Kraft Cards",
                "slug": "kraft",
                "category": cat_texture,
                "category_group": "texture",
                "dimensions": "8.9 cm x 5.1 cm",
                "gsm": "280 GSM Kraft",
                "finish_type": "Natural Brown Recycled",
                "base_price_100": 340.00,
                "min_quantity": 100,
                "rating": 4.5,
                "reviews_count": 47,
                "badge": "Eco Recycled",
                "tagline": "Organic natural brown rustic recycled fiber board",
                "description": "Real unbleached wood pulp texture delivering an authentic, eco-conscious artisanal vibe.",
                "accent_color": "#b45309",
                "image_gradient": "linear-gradient(135deg, #78350f 0%, #b45309 100%)",
                "is_featured": False
            },
            {
                "title": "Transparent Cards",
                "slug": "transparent",
                "category": cat_texture,
                "category_group": "texture",
                "dimensions": "8.9 cm x 5.1 cm",
                "gsm": "0.38 mm PVC Plastic",
                "finish_type": "Translucent / Clear Frosted",
                "base_price_100": 580.00,
                "min_quantity": 100,
                "rating": 4.1,
                "reviews_count": 26,
                "badge": "Frosted PVC",
                "tagline": "See-through frosted plastic that turns heads instantly",
                "description": "Crafted from durable translucent polymer that lets light pass through your design.",
                "accent_color": "#2dd4bf",
                "image_gradient": "linear-gradient(135deg, #134e4a 0%, #2dd4bf 100%)",
                "is_featured": False
            },

            # === 3. SPECIAL (1 item) ===
            {
                "title": "Bulk Visiting Cards",
                "slug": "bulk",
                "category": cat_special,
                "category_group": "special",
                "dimensions": "8.9 cm x 5.1 cm",
                "gsm": "300 GSM",
                "finish_type": "Commercial Matte / Glossy",
                "base_price_100": 850.00,
                "min_quantity": 1000,
                "rating": 4.7,
                "reviews_count": 420,
                "badge": "Wholesale Tier",
                "tagline": "Economical commercial printing for corporate teams of 5 to 500",
                "description": "High-speed volume runs with multi-name employee badge support and consolidated corporate pricing.",
                "accent_color": "#22c55e",
                "image_gradient": "linear-gradient(135deg, #14532d 0%, #22c55e 100%)",
                "is_featured": True
            },

            # === 4. CARD HOLDERS (1 item) ===
            {
                "title": "Desktop Visiting Card Holder",
                "slug": "engraved-metal-holder",
                "category": cat_holders,
                "category_group": "holders",
                "dimensions": "Holds up to 50 Cards",
                "gsm": "Anodized Aluminum",
                "finish_type": "Precision Laser Engraving",
                "base_price_100": 349.00,
                "min_quantity": 1,
                "rating": 4.8,
                "reviews_count": 312,
                "badge": "Executive",
                "tagline": "Holds up to 50 standard visiting cards crisply on your office desk",
                "description": "Precision laser engraved desktop visiting card case crafted from premium aircraft-grade aluminum.",
                "accent_color": "#64748b",
                "image_gradient": "linear-gradient(135deg, #1e293b 0%, #64748b 100%)",
                "is_featured": True
            }
        ]

        for card in cards_data:
            if card.get('badge') is None:
                card['badge'] = ''
            VisitingCard.objects.create(**card)

        self.stdout.write("Creating Industry Templates...")
        templates_data = [
            {
                "title": "YGR Global Executive Visiting Card",
                "industry": "Corporate & Business",
                "orientation": "horizontal",
                "primary_color": "#1e1b4b",
                "preview_style": "executive_swoosh",
                "layout_type": "executive_swoosh",
                "sample_company": "YGR GLOBAL IT SERVICES",
                "sample_tagline": "We Build • We Launch • We Grow",
                "sample_name": "Y. Suneetha Reddy",
                "sample_job_title": "General Manager & BDM",
                "sample_phone": "7569734433, 7794053340",
                "sample_email": "info@ygrgobalitservices.com",
                "text_positions": {
                    "hasLayout": True,
                    "layoutType": "executive_swoosh",
                    "sampleWebsite": "www.ygrgobalitservices.com",
                    "sampleAddress": "Hyderabad, Telangana, India.",
                    "bullet1": "We Build",
                    "bullet2": "We Launch",
                    "bullet3": "We Grow",
                    "accentColor": "#eab308",
                    "swooshColor": "#004b93",
                }
            },
            {
                "title": "Apex Financial Advisory",
                "industry": "Finance & CA",
                "orientation": "horizontal",
                "primary_color": "#0f2b46",
                "preview_style": "minimal-corporate",
                "sample_company": "Apex Tax & Financial Consultants",
                "sample_tagline": "Registered Chartered Accountants & Wealth Managers"
            },
            {
                "title": "Dr. Aarav Mehta MD",
                "industry": "Healthcare & Doctors",
                "orientation": "horizontal",
                "primary_color": "#0284c7",
                "preview_style": "clean-medical",
                "sample_company": "CarePlus Multispeciality Clinic",
                "sample_tagline": "Senior Consultant Physician & Diabetologist"
            },
            {
                "title": "Advocate R. S. Sharma",
                "industry": "Legal & Advocates",
                "orientation": "horizontal",
                "primary_color": "#18181b",
                "preview_style": "classic-embossed",
                "sample_company": "Sharma & Partners Legal Chambers",
                "sample_tagline": "High Court & Supreme Court Legal Counsel"
            },
            {
                "title": "CloudScale Technologies",
                "industry": "Tech & Software",
                "orientation": "horizontal",
                "primary_color": "#4f46e5",
                "preview_style": "modern-gradient",
                "sample_company": "CloudScale DevOps & AI Labs",
                "sample_tagline": "Building Next-Generation Cloud Systems"
            },
            {
                "title": "Aura Luxury Salon & Spa",
                "industry": "Beauty & Wellness",
                "orientation": "horizontal",
                "primary_color": "#be185d",
                "preview_style": "glamour-suede",
                "sample_company": "Aura Beauty & Wellness Sanctuary",
                "sample_tagline": "Organic Facials, Styling & Wellness Treatments"
            },
            {
                "title": "Prime Realty Properties",
                "industry": "Real Estate",
                "orientation": "horizontal",
                "primary_color": "#b45309",
                "preview_style": "gold-accent",
                "sample_company": "Prime Square Luxury Realty",
                "sample_tagline": "Commercial & High-End Residential Estates"
            },
        ]

        for t in templates_data:
            Template.objects.create(**t)

        self.stdout.write("Creating Promo Codes...")
        PromoCode.objects.create(
            code="NEW15",
            discount_percent=15,
            min_order_value=0.00,
            description="15% discount for first-time orders"
        )
        PromoCode.objects.create(
            code="SAVE5",
            discount_percent=5,
            min_order_value=10000.00,
            description="Flat 5% discount on bulk orders above ₹10,000"
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with all categories, cards, templates, and promo codes!"))
