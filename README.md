# Charging Stations Management System

A full-stack application for managing electric vehicle charging stations with user authentication, CRUD operations, and interactive map view for Evoltsoft Technologies assignment.

## 🚀 Deployment

- **Frontend URL:** https://evoltsoft-ui.onrender.com
- **Backend API URL:** https://evoltsoft-api.onrender.com

## 🏗️ Setup Instructions

### 1. Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/charging-stations.git
cd charging-stations/backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
PORT=5000
FRONTEND_URL=https://evoltsoft-ui.onrender.com" > .env

# Start server
npm start
```

### 2. Frontend Setup

```
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📚 API Endpoints

| Method | Endpoint           | Description        | Auth Required |
| ------ | ------------------ | ------------------ | ------------- |
| POST   | /api/auth/register | User registration  | No            |
| POST   | /api/auth/login    | User login         | No            |
| GET    | /api/stations      | Get all stations   | Yes           |
| POST   | /api/stations      | Create new station | Yes           |
| PUT    | /api/stations/:id  | Update station     | Yes           |
| DELETE | /api/stations/:id  | Delete station     | Yes           |

## 🧪 Testing API

**Postman Collection:**
Download Postman Collection (attach JSON file in repo)

Example requests:

**Register User**

```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Create Charging Station**

```
POST /api/stations
Body: {
  "name": "Downtown Charger",
  "location": { "lat": 40.7128, "lng": -74.0060 },
  "status": "active",
  "powerOutput": 50,
  "connectorType": "CCS"
}
```

## 📷 Screenshots in Dark theme

![Login Screen](https://i.postimg.cc/YC6m0BRp/image.png)
_Login Page_

![Stations List](https://i.postimg.cc/9Ft7FjJc/image.png)
_Stations List with Filters_

![Map View](https://i.postimg.cc/vmDgzxMm/image.png)
_Interactive Map View_

## 🛠️ Tech Stack

- Vue.js 3
- Tailwind CSS
- Leaflet/OpenStreetMap
- Node.js
- Express
- MongoDB (database)
- JWT (for auth)
- Pinia (vue.js state management)
- Vue Router

## 🌟 Features

### Backend (Node.js/Express)

- ✅ REST API with full CRUD operations for charging stations
- 🔐 JWT authentication (register/login)
- 🛡️ Protected routes for station management
- 📍 Station details: name, location (lat/long), status, power output, connector type
- 🍪 Secure JWT storage in HTTP-only cookies

### Frontend (Vue.js)

- 👤 Login/Signup pages
- 🏡 Beautiful, modern, and performant UI/UX
- 📋 Charger listing with filters (status, connector type, power output)
- ✏️ Add/Edit/Delete functionality
- 🗺️ Interactive map view (OpenStreetMap) with station markers
- 🔍 Click markers to view station details

Looking forward to your feedback. Thank you!
