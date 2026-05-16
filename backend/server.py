"""
ArtemCreations API — Backend minimal (post-migration Shopify)

Le site est désormais headless Shopify : les produits, le panier et le checkout
sont gérés directement par le frontend via la Storefront API.
Ce backend ne conserve que :
  - POST /api/contact   : envoi du formulaire de contact via Resend + stockage MongoDB
  - GET  /api/          : health check
  - GET  /api/sitemap.xml et /api/robots.txt : SEO
"""
from fastapi import FastAPI, APIRouter
from fastapi.responses import PlainTextResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="ArtemCreations API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ============== MODELS ==============

class ContactMessage(BaseModel):
    message_id: str = Field(default_factory=lambda: f"msg_{uuid.uuid4().hex[:12]}")
    name: str
    email: str
    subject: str = ""
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str = ""
    message: str


# ============== CONTACT ==============

@api_router.post("/contact")
async def submit_contact(contact_data: ContactCreate):
    import resend

    message = ContactMessage(**contact_data.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)

    resend_key = os.environ.get("RESEND_API_KEY")
    if resend_key:
        try:
            resend.api_key = resend_key
            recipient = os.environ.get("RECIPIENT_EMAIL", "artemcreations2023@gmail.com")
            sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")

            email_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2D2D2D; border-bottom: 2px solid #C97B5D; padding-bottom: 10px;">
                Nouveau message de contact &mdash; ArtemCreations
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;"><strong>De :</strong></td>
                  <td style="padding: 8px 0;">{contact_data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email :</strong></td>
                  <td style="padding: 8px 0;"><a href="mailto:{contact_data.email}">{contact_data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Sujet :</strong></td>
                  <td style="padding: 8px 0;">{contact_data.subject or 'Demande generale'}</td>
                </tr>
              </table>
              <div style="background: #F5F1EA; padding: 20px; border-left: 3px solid #C97B5D; margin: 20px 0;">
                <p style="margin: 0; line-height: 1.6; color: #2D2D2D; white-space: pre-wrap;">{contact_data.message}</p>
              </div>
              <p style="font-size: 12px; color: #999; margin-top: 30px;">
                Message recu via le formulaire de contact du site artemcreations.
              </p>
            </div>
            """

            params = {
                "from": sender,
                "to": [recipient],
                "reply_to": contact_data.email,
                "subject": f"ArtemCreations Contact: {contact_data.subject or 'Nouveau message'}",
                "html": email_content,
            }
            # Run sync SDK in thread to keep FastAPI non-blocking
            result = await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Resend email sent: {result}")
        except Exception as e:
            logger.error(f"Resend error: {e}")
    else:
        logger.warning("RESEND_API_KEY not configured, email not sent (message stored in DB)")

    return {"message": "Merci pour votre message. Nous vous repondrons rapidement.", "message_id": message.message_id}


# ============== ROOT ==============

@api_router.get("/")
async def root():
    return {"message": "ArtemCreations API", "version": "2.0", "mode": "headless-shopify"}


# ============== SEO: SITEMAP & ROBOTS ==============

SITE_URL = os.environ.get("SITE_URL", "https://artemcreations.com")


@api_router.get("/sitemap.xml", response_class=PlainTextResponse)
async def sitemap():
    static_pages = [
        {"loc": "/", "priority": "1.0", "changefreq": "weekly"},
        {"loc": "/shop", "priority": "0.9", "changefreq": "weekly"},
        {"loc": "/about", "priority": "0.7", "changefreq": "monthly"},
        {"loc": "/craftsmanship", "priority": "0.7", "changefreq": "monthly"},
        {"loc": "/contact", "priority": "0.6", "changefreq": "monthly"},
        {"loc": "/pages/mentions-legales", "priority": "0.3", "changefreq": "yearly"},
        {"loc": "/pages/politique-de-confidentialite", "priority": "0.3", "changefreq": "yearly"},
        {"loc": "/pages/cgv", "priority": "0.3", "changefreq": "yearly"},
        {"loc": "/pages/politique-de-livraison", "priority": "0.3", "changefreq": "yearly"},
        {"loc": "/pages/politique-de-remboursement", "priority": "0.3", "changefreq": "yearly"},
    ]

    urls = ""
    for page in static_pages:
        urls += f"""  <url>
    <loc>{SITE_URL}{page['loc']}</loc>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
  </url>\n"""

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}</urlset>"""
    return PlainTextResponse(content=xml, media_type="application/xml")


@api_router.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    content = f"""User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout

Sitemap: {SITE_URL}/api/sitemap.xml"""
    return PlainTextResponse(content=content)


# ============== APP CONFIG ==============

app.include_router(api_router)

# CORS — supports wildcard or comma-separated origins
cors_origins_raw = os.environ.get('CORS_ORIGINS', '*').strip()
if cors_origins_raw == '*':
    app.add_middleware(
        CORSMiddleware,
        allow_credentials=False,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_origins=[o.strip() for o in cors_origins_raw.split(',')],
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
