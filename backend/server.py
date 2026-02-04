from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'artem_creations_secret_2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# Admin credentials (in production, store hashed in DB)
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@artemcreations.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

app = FastAPI(title="ArtemCreations API")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class Product(BaseModel):
    product_id: str = Field(default_factory=lambda: f"prod_{uuid.uuid4().hex[:12]}")
    name: str
    description: str
    price: float
    images: List[str] = []
    category: str = "handbag"
    material: str = ""
    craftsmanship_time: str = ""
    limited_pieces: int = 0
    stock: int = 0
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    images: List[str] = []
    category: str = "handbag"
    material: str = ""
    craftsmanship_time: str = ""
    limited_pieces: int = 10
    stock: int = 10
    featured: bool = False

class CartItem(BaseModel):
    product_id: str
    quantity: int = 1

class Cart(BaseModel):
    cart_id: str = Field(default_factory=lambda: f"cart_{uuid.uuid4().hex[:12]}")
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    items: List[CartItem] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image: str = ""

class Order(BaseModel):
    order_id: str = Field(default_factory=lambda: f"order_{uuid.uuid4().hex[:12]}")
    user_id: Optional[str] = None
    email: str
    items: List[OrderItem] = []
    subtotal: float = 0.0
    shipping: float = 0.0
    total: float = 0.0
    status: str = "pending"
    payment_status: str = "pending"
    stripe_session_id: Optional[str] = None
    shipping_address: Optional[Dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

class User(BaseModel):
    user_id: str = Field(default_factory=lambda: f"user_{uuid.uuid4().hex[:12]}")
    email: str
    name: str = ""
    password_hash: Optional[str] = None
    picture: str = ""
    auth_provider: str = "email"  # email or google
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserSession(BaseModel):
    session_id: str = Field(default_factory=lambda: f"sess_{uuid.uuid4().hex[:12]}")
    user_id: str
    session_token: str = Field(default_factory=lambda: uuid.uuid4().hex)
    expires_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=7))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CheckoutRequest(BaseModel):
    email: str
    cart_session_id: str
    shipping_address: Optional[Dict] = None

# ============== AUTH HELPERS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())

def create_jwt_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> Optional[Dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except:
        return None

async def get_current_user(request: Request) -> Optional[Dict]:
    # Check cookie first
    session_token = request.cookies.get("session_token")
    if session_token:
        session = await db.user_sessions.find_one(
            {"session_token": session_token},
            {"_id": 0}
        )
        if session:
            expires_at = session.get("expires_at")
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at > datetime.now(timezone.utc):
                user = await db.users.find_one(
                    {"user_id": session["user_id"]},
                    {"_id": 0, "password_hash": 0}
                )
                return user
    
    # Check Authorization header
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        payload = decode_jwt_token(token)
        if payload:
            user = await db.users.find_one(
                {"user_id": payload["user_id"]},
                {"_id": 0, "password_hash": 0}
            )
            return user
    return None

# ============== PRODUCT ROUTES ==============

@api_router.get("/products", response_model=List[dict])
async def get_products(featured: Optional[bool] = None, category: Optional[str] = None):
    query = {}
    if featured is not None:
        query["featured"] = featured
    if category:
        query["category"] = category
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products", response_model=dict)
async def create_product(product_data: ProductCreate):
    product = Product(**product_data.model_dump())
    doc = product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return {"product_id": product.product_id, "message": "Product created"}

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, product_data: ProductCreate):
    result = await db.products.update_one(
        {"product_id": product_id},
        {"$set": product_data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated"}

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"product_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

# ============== ADMIN ROUTES ==============

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminProductCreate(BaseModel):
    name: str
    description: str
    price: float
    images: List[str] = []
    category: str = "handbag"
    material: str = ""
    craftsmanship_time: str = ""
    limited_pieces: int = 10
    stock: int = 10
    featured: bool = False

async def verify_admin_token(request: Request) -> bool:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Non autorisé")
    
    token = auth_header[7:]
    payload = decode_jwt_token(token)
    if not payload or not payload.get("is_admin"):
        raise HTTPException(status_code=401, detail="Accès admin requis")
    return True

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    if credentials.email == ADMIN_EMAIL and credentials.password == ADMIN_PASSWORD:
        token = jwt.encode({
            "email": credentials.email,
            "is_admin": True,
            "exp": datetime.now(timezone.utc) + timedelta(hours=24)
        }, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return {"token": token, "message": "Connexion réussie"}
    raise HTTPException(status_code=401, detail="Identifiants incorrects")

@api_router.get("/admin/verify")
async def verify_admin(request: Request):
    await verify_admin_token(request)
    return {"valid": True}

@api_router.get("/admin/products")
async def admin_get_products(request: Request):
    await verify_admin_token(request)
    products = await db.products.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return products

@api_router.post("/admin/products")
async def admin_create_product(request: Request, product_data: AdminProductCreate):
    await verify_admin_token(request)
    product = Product(**product_data.model_dump())
    doc = product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return {"product_id": product.product_id, "message": "Produit créé"}

@api_router.put("/admin/products/{product_id}")
async def admin_update_product(request: Request, product_id: str, product_data: AdminProductCreate):
    await verify_admin_token(request)
    update_data = product_data.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.products.update_one(
        {"product_id": product_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return {"message": "Produit mis à jour"}

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(request: Request, product_id: str):
    await verify_admin_token(request)
    result = await db.products.delete_one({"product_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return {"message": "Produit supprimé"}

@api_router.get("/admin/orders")
async def admin_get_orders(request: Request):
    await verify_admin_token(request)
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return orders

@api_router.get("/admin/messages")
async def admin_get_messages(request: Request):
    await verify_admin_token(request)
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return messages

@api_router.get("/admin/stats")
async def admin_get_stats(request: Request):
    await verify_admin_token(request)
    products_count = await db.products.count_documents({})
    orders_count = await db.orders.count_documents({})
    messages_count = await db.contact_messages.count_documents({})
    users_count = await db.users.count_documents({})
    
    # Calculate total revenue from paid orders
    paid_orders = await db.orders.find({"payment_status": "paid"}, {"total": 1}).to_list(100)
    total_revenue = sum(order.get("total", 0) for order in paid_orders)
    
    return {
        "products": products_count,
        "orders": orders_count,
        "messages": messages_count,
        "users": users_count,
        "revenue": total_revenue
    }

# ============== IMAGE UPLOAD ROUTES ==============

@api_router.post("/upload/image")
async def upload_image(request: Request, file: UploadFile = File(...)):
    await verify_admin_token(request)
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Type de fichier non autorisé")
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = UPLOADS_DIR / filename
    
    # Save file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL
    return {"url": f"/api/uploads/{filename}", "filename": filename}

@api_router.get("/uploads/{filename}")
async def get_uploaded_image(filename: str):
    filepath = UPLOADS_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Image non trouvée")
    return FileResponse(filepath)

@api_router.delete("/upload/image/{filename}")
async def delete_image(request: Request, filename: str):
    await verify_admin_token(request)
    filepath = UPLOADS_DIR / filename
    if filepath.exists():
        filepath.unlink()
    return {"message": "Image supprimée"}

# ============== CART ROUTES ==============

@api_router.get("/cart/{session_id}")
async def get_cart(session_id: str):
    cart = await db.carts.find_one({"session_id": session_id}, {"_id": 0})
    if not cart:
        return {"session_id": session_id, "items": [], "total": 0}
    
    # Calculate totals
    items_with_details = []
    total = 0
    for item in cart.get("items", []):
        product = await db.products.find_one({"product_id": item["product_id"]}, {"_id": 0})
        if product:
            item_total = product["price"] * item["quantity"]
            items_with_details.append({
                "product_id": item["product_id"],
                "name": product["name"],
                "price": product["price"],
                "quantity": item["quantity"],
                "image": product["images"][0] if product.get("images") else "",
                "total": item_total
            })
            total += item_total
    
    return {"session_id": session_id, "items": items_with_details, "total": total}

@api_router.post("/cart/{session_id}/add")
async def add_to_cart(session_id: str, item: CartItem):
    cart = await db.carts.find_one({"session_id": session_id})
    
    if not cart:
        cart_doc = {
            "cart_id": f"cart_{uuid.uuid4().hex[:12]}",
            "session_id": session_id,
            "items": [item.model_dump()],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.carts.insert_one(cart_doc)
    else:
        # Check if item exists
        items = cart.get("items", [])
        found = False
        for i, existing in enumerate(items):
            if existing["product_id"] == item.product_id:
                items[i]["quantity"] += item.quantity
                found = True
                break
        if not found:
            items.append(item.model_dump())
        
        await db.carts.update_one(
            {"session_id": session_id},
            {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    return {"message": "Item added to cart"}

@api_router.put("/cart/{session_id}/update")
async def update_cart_item(session_id: str, item: CartItem):
    cart = await db.carts.find_one({"session_id": session_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    items = cart.get("items", [])
    for i, existing in enumerate(items):
        if existing["product_id"] == item.product_id:
            if item.quantity <= 0:
                items.pop(i)
            else:
                items[i]["quantity"] = item.quantity
            break
    
    await db.carts.update_one(
        {"session_id": session_id},
        {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Cart updated"}

@api_router.delete("/cart/{session_id}/remove/{product_id}")
async def remove_from_cart(session_id: str, product_id: str):
    await db.carts.update_one(
        {"session_id": session_id},
        {"$pull": {"items": {"product_id": product_id}}}
    )
    return {"message": "Item removed from cart"}

@api_router.delete("/cart/{session_id}")
async def clear_cart(session_id: str):
    await db.carts.delete_one({"session_id": session_id})
    return {"message": "Cart cleared"}

# ============== CHECKOUT/STRIPE ROUTES ==============

@api_router.post("/checkout/create-session")
async def create_checkout_session(request: Request, checkout_data: CheckoutRequest):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
    
    # Get cart
    cart = await db.carts.find_one({"session_id": checkout_data.cart_session_id})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total
    items = []
    total = 0.0
    for item in cart.get("items", []):
        product = await db.products.find_one({"product_id": item["product_id"]}, {"_id": 0})
        if product:
            item_total = float(product["price"]) * item["quantity"]
            items.append(OrderItem(
                product_id=item["product_id"],
                name=product["name"],
                price=float(product["price"]),
                quantity=item["quantity"],
                image=product["images"][0] if product.get("images") else ""
            ))
            total += item_total
    
    shipping = 15.0 if total < 200 else 0.0
    grand_total = total + shipping
    
    # Create order
    order = Order(
        email=checkout_data.email,
        items=[i.model_dump() for i in items],
        subtotal=total,
        shipping=shipping,
        total=grand_total,
        shipping_address=checkout_data.shipping_address,
        status="pending",
        payment_status="pending"
    )
    
    # Get URLs from request
    origin = request.headers.get("origin", "http://localhost:3000")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    success_url = f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/cart"
    
    try:
        api_key = os.environ.get("STRIPE_API_KEY")
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        checkout_request = CheckoutSessionRequest(
            amount=grand_total,
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "order_id": order.order_id,
                "email": checkout_data.email
            }
        )
        
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Update order with stripe session ID
        order_doc = order.model_dump()
        order_doc['stripe_session_id'] = session.session_id
        order_doc['created_at'] = order_doc['created_at'].isoformat()
        await db.orders.insert_one(order_doc)
        
        # Store payment transaction
        await db.payment_transactions.insert_one({
            "transaction_id": f"txn_{uuid.uuid4().hex[:12]}",
            "order_id": order.order_id,
            "session_id": session.session_id,
            "amount": grand_total,
            "currency": "usd",
            "email": checkout_data.email,
            "payment_status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return {"url": session.url, "session_id": session.session_id, "order_id": order.order_id}
    except Exception as e:
        logger.error(f"Stripe checkout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    try:
        api_key = os.environ.get("STRIPE_API_KEY")
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url="")
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update order and transaction
        if status.payment_status == "paid":
            await db.orders.update_one(
                {"stripe_session_id": session_id},
                {"$set": {"status": "confirmed", "payment_status": "paid"}}
            )
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid"}}
            )
            # Clear the cart
            order = await db.orders.find_one({"stripe_session_id": session_id})
            if order:
                # Find and clear cart based on email or session
                pass
        
        return {
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency
        }
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    body = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    
    try:
        api_key = os.environ.get("STRIPE_API_KEY")
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url="")
        webhook_response = await stripe_checkout.handle_webhook(body, sig)
        
        if webhook_response.payment_status == "paid":
            await db.orders.update_one(
                {"stripe_session_id": webhook_response.session_id},
                {"$set": {"status": "confirmed", "payment_status": "paid"}}
            )
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {"payment_status": "paid"}}
            )
        
        return {"received": True}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"received": True}

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ============== CONTACT ROUTES ==============

@api_router.post("/contact")
async def submit_contact(contact_data: ContactCreate):
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail
    
    message = ContactMessage(**contact_data.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    
    # Send email via SendGrid
    sendgrid_key = os.environ.get("SENDGRID_API_KEY")
    if sendgrid_key:
        try:
            sg = SendGridAPIClient(sendgrid_key)
            recipient = os.environ.get("RECIPIENT_EMAIL", "yanskads@gmail.com")
            
            email_content = f"""
            <h2>New Contact Form Submission - ArtemCreations</h2>
            <p><strong>From:</strong> {contact_data.name} ({contact_data.email})</p>
            <p><strong>Subject:</strong> {contact_data.subject or 'General Inquiry'}</p>
            <hr>
            <p>{contact_data.message}</p>
            """
            
            mail = Mail(
                from_email=os.environ.get("SENDER_EMAIL", "yanskads@gmail.com"),
                to_emails=recipient,
                subject=f"ArtemCreations Contact: {contact_data.subject or 'New Message'}",
                html_content=email_content
            )
            sg.send(mail)
        except Exception as e:
            logger.error(f"SendGrid error: {e}")
    
    return {"message": "Thank you for your message. We'll be in touch soon.", "message_id": message.message_id}

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register")
async def register(user_data: UserRegister, response: Response):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        name=user_data.name or user_data.email.split("@")[0],
        password_hash=hash_password(user_data.password),
        auth_provider="email"
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Create session
    session = UserSession(user_id=user.user_id)
    session_doc = session.model_dump()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    token = create_jwt_token(user.user_id, user.email)
    
    return {
        "user_id": user.user_id,
        "email": user.email,
        "name": user.name,
        "token": token
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin, response: Response):
    user = await db.users.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get("password_hash") or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session = UserSession(user_id=user["user_id"])
    session_doc = session.model_dump()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    token = create_jwt_token(user["user_id"], user["email"])
    
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "token": token
    }

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

# Emergent Google OAuth session handler
@api_router.post("/auth/google/session")
async def google_oauth_session(request: Request, response: Response):
    import httpx
    
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Get user data from Emergent auth
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        oauth_data = resp.json()
    
    # Find or create user
    user = await db.users.find_one({"email": oauth_data["email"]})
    
    if not user:
        new_user = User(
            email=oauth_data["email"],
            name=oauth_data.get("name", ""),
            picture=oauth_data.get("picture", ""),
            auth_provider="google"
        )
        doc = new_user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
        user_id = new_user.user_id
    else:
        user_id = user["user_id"]
        # Update user info
        await db.users.update_one(
            {"email": oauth_data["email"]},
            {"$set": {"name": oauth_data.get("name", ""), "picture": oauth_data.get("picture", "")}}
        )
    
    # Create session
    session = UserSession(user_id=user_id, session_token=oauth_data.get("session_token", uuid.uuid4().hex))
    session_doc = session.model_dump()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password_hash": 0})
    
    return user_doc

# ============== SEED DATA ==============

@api_router.post("/seed")
async def seed_data():
    # Check if products exist
    count = await db.products.count_documents({})
    if count > 0:
        return {"message": "Data already seeded", "products": count}
    
    products = [
        {
            "product_id": "prod_001",
            "name": "Sac Bordeaux Tressé",
            "description": "Un sac élégant en fil bordeaux avec un magnifique motif tressé. La chaîne argentée ajoute une touche de sophistication. Parfait pour les soirées et les occasions spéciales.",
            "price": 89.00,
            "images": [
                "https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/yipqljae_image.png"
            ],
            "category": "shoulder",
            "material": "Fil Premium",
            "craftsmanship_time": "15+ heures",
            "limited_pieces": 1,
            "stock": 1,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "product_id": "prod_002",
            "name": "Pochette Noeud Rose",
            "description": "Une pochette originale avec un superbe noeud décoratif. Le rose fuchsia apporte de la gaieté et du caractère. Un accessoire qui ne passera pas inaperçu.",
            "price": 75.00,
            "images": [
                "https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/f3dygm93_image.png"
            ],
            "category": "clutch",
            "material": "Fil Premium",
            "craftsmanship_time": "12+ heures",
            "limited_pieces": 1,
            "stock": 1,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "product_id": "prod_003",
            "name": "Sac Rond Turquoise",
            "description": "Un sac rond original avec pompon assorti. Le turquoise profond et la chaîne dorée créent un contraste élégant. Le fermoir coeur ajoute une touche romantique.",
            "price": 95.00,
            "images": [
                "https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/x4ci01bv_image.png"
            ],
            "category": "crossbody",
            "material": "Fil Premium",
            "craftsmanship_time": "18+ heures",
            "limited_pieces": 1,
            "stock": 1,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "product_id": "prod_004",
            "name": "Mini Sac Vert Menthe",
            "description": "Un petit sac raffiné en vert menthe pastel. La bandoulière tressée et le fermoir argenté lui confèrent un style chic et intemporel. Idéal pour le quotidien.",
            "price": 65.00,
            "images": [
                "https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/rv18hqet_image.png"
            ],
            "category": "mini",
            "material": "Fil Premium",
            "craftsmanship_time": "10+ heures",
            "limited_pieces": 1,
            "stock": 1,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "product_id": "prod_005",
            "name": "Sac Beige Naturel",
            "description": "Un sac élégant dans un beige naturel et sobre. Le design épuré avec fermoir mousqueton en fait un compagnon parfait pour toutes les occasions.",
            "price": 85.00,
            "images": [
                "https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/xfna0mnj_image.png"
            ],
            "category": "shoulder",
            "material": "Fil Premium",
            "craftsmanship_time": "14+ heures",
            "limited_pieces": 1,
            "stock": 1,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.products.insert_many(products)
    return {"message": "Sample products created", "products": len(products)}

# ============== ROOT ==============

@api_router.get("/")
async def root():
    return {"message": "ArtemCreations API", "version": "1.0"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
