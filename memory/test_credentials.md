# Test Credentials

## Shopify Storefront API
- Domain: artemcreations.myshopify.com
- API Version: 2025-07
- Storefront Token: 53bc2c8b1e61ac7edbd330702ce24d87 (public, configured in frontend/.env)
- Country/Language: FR / FR (EUR)

## Admin
- Le panneau admin local a été supprimé. L'admin Shopify est désormais utilisé:
  https://admin.shopify.com/store/artemcreations

## Backend FastAPI (gardé uniquement pour le formulaire de contact)
- /api/contact (POST) — stocke en DB + envoie email via SendGrid (clé SendGrid à fournir)
