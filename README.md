# Pharma B2B Management Platform 🏥

A robust, full-stack Business-to-Business (B2B) application designed to streamline pharmaceutical cataloging, inventory management, and ordering processes.

## ✨ Key Features
- **Dynamic Pricing Engine**: Real-time auto-calculation of Unit Buying Price, Box Price, and Discount Percentages directly from the admin panel.
- **Comprehensive Catalog Management**: Complete capabilities for administrators to manage medicine data, including generic names, companies, categories, and stock limits.
- **Role-Based Access Control (RBAC)**: Distinct portals and dynamic layouts for Administrators and Pharmacy Users, secured via JWT authentication.
- **Optimized UI/UX**: Responsive, modern interface with professional modal-driven workflows for inventory updates, ensuring seamless data entry without full-page reloads.
- **Automated CI/CD Pipeline**: Fully containerized setup with automated builds using GitHub Actions and Docker Hub.

## 🛠️ Technology Stack
**Frontend**:
- React.js (built with Vite)
- React Router DOM (for protected routing)
- Tailwind CSS (for styling)
- Lucide React (for modern iconography)
- Axios (for API communication)

**Backend**:
- FastAPI (High-performance Python web framework)
- PostgreSQL (Primary relational database)
- SQLAlchemy & Alembic (ORM and migrations)
- Pydantic (Data validation and schema management)
- Uvicorn (ASGI web server)

**DevOps & Deployment**:
- Docker & Docker Compose
- GitHub Actions (CI/CD workflows)

## 🚀 Local Environment Setup (Dockerized)

This project uses Docker to make the local setup process completely seamless. You do not need to install Python, Node.js, or PostgreSQL directly on your host machine.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed and running.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Quick Start
1. **Clone the repository**:
   ```bash
   git clone [https://github.com/wafiur06/pharma-b2b-react-fastapi-postgres.git](https://github.com/wafiur06/pharma-b2b-react-fastapi-postgres.git)
   cd pharma-b2b-react-fastapi-postgres

```
```

2. **Run the entire stack (Database, Backend, Frontend)**:
```bash
docker compose up -d

```


*(Note: Linux users may need to prefix commands with `sudo`)*
3. **Access the application**:
* **Frontend (React UI)**: [http://localhost:5173](http://localhost:5173)
* **Backend API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)



### Stopping the Application

To stop and remove all running containers and networks, run:

```bash
docker compose down

```
