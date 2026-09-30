# Pharma B2B Management Platform 🏥

A robust, full-stack Business-to-Business (B2B) application designed to streamline pharmaceutical cataloging, inventory management, and ordering processes.

## ✨ Key Features

*   **Dynamic Pricing Engine:** Real-time auto-calculation of Unit Buying Price, Box Price, and Discount Percentages directly from the admin panel.
*   **Comprehensive Catalog Management:** Complete capabilities for administrators to manage medicine data, including generic names, companies, categories, and stock limits.
*   **Role-Based Access Control (RBAC):** Distinct portals and dynamic layouts for Administrators and Pharmacy Users, secured via JWT authentication.
*   **Optimized UI/UX:** Responsive, modern interface with professional modal-driven workflows for inventory updates, ensuring seamless data entry without full-page reloads.

## 🛠️ Technology Stack

**Frontend:**
*   React.js (built with Vite)
*   React Router DOM (for protected routing)
*   Tailwind CSS (for styling)
*   Lucide React (for modern iconography)
*   Axios (for API communication)

**Backend:**
*   FastAPI (High-performance Python web framework)
*   PostgreSQL (Primary relational database)
*   SQLAlchemy (ORM for database interactions)
*   Pydantic (Data validation and schema management)
*   Uvicorn (ASGI web server)

## 🚀 Local Environment Setup (Windows)

### Prerequisites
*   Node.js & npm installed
*   Python 3.8+ installed
*   PostgreSQL installed and running

### Backend Setup
1. Open your terminal and navigate to the backend directory:
   ```cmd
   cd backend



2. Create and activate a Python virtual environment:
```cmd
python -m venv .venv
.\.venv\Scripts\activate

```


3. Install the required Python packages:
```cmd
pip install -r requirements.txt

```


4. Start the FastAPI server:
```cmd
uvicorn app.main:app --reload

```


*The backend API will run on: `http://127.0.0.1:8000*`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```cmd
cd frontend

```


2. Install Node dependencies:
```cmd
npm install

```


3. Start the Vite development server:
```cmd
npm run dev

```


*The frontend application will run on: `http://localhost:5173*`

```
