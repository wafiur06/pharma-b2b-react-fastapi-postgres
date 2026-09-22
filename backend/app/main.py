from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

# Database and Base imports
from app.db.session import engine
from app.db.base import Base

# Router imports
from app.modules.auth.router import router as auth_router
from app.modules.organizations.router import router as organizations_router
from app.modules.companies.router import router as companies_router
from app.modules.depots.router import router as depots_router
from app.modules.catalog.router import router as catalog_router
from app.modules.inventory.router import router as inventory_router
from app.modules.cart.router import router as cart_router
from app.modules.orders.router import router as orders_router
from app.modules.users import router as users_router
from app.modules.client_services.router import router as client_services_router
from app.modules.invoices.router import router as invoices_router

# Model imports (MUST be imported before create_all)
from app.modules.invoices.model import Invoice
from app.modules.client_services.model import ReturnRequest, Offer, SupportTicket

# Create missing tables in the PostgreSQL database automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pharma B2B API",
    description="B2B pharmaceutical procurement and consolidated delivery platform",
    version="0.1.0",
)

# === ফ্রন্টএন্ডের জন্য CORS কনফিগারেশন ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # প্রোডাকশনে এখানে শুধু ফ্রন্টএন্ডের ডোমেইন দিতে হবে
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==========================================

# Include all routers
app.include_router(auth_router)
app.include_router(organizations_router)
app.include_router(companies_router)
app.include_router(depots_router)
app.include_router(catalog_router)
app.include_router(inventory_router)
app.include_router(cart_router)
app.include_router(orders_router)
app.include_router(users_router.router)
app.include_router(client_services_router)
app.include_router(invoices_router)


@app.get("/")
def root():
    return {
        "message": "Pharma B2B API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/db-health")
def database_health_check():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))

            return {
                "status": "ok",
                "database": "connected",
                "result": result.scalar(),
            }

    except Exception as error:
        return {
            "status": "error",
            "database": "not connected",
            "detail": str(error),
        }