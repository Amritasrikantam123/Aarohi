# Setup & Deployment Instructions for Aarohi (आरोही)

Aarohi is a full-stack social impact platform designed to empower post-Class 10 girls by dynamically matching educational scholarships, internships, government schemes, professional mentors, and skill-development workshops.

---

## Local Setup Instructions

Follow these instructions to run the frontend and backend of Aarohi on your local development machine.

### Prerequisites
- Node.js (v18 or above recommended)
- npm (v9 or above)
- MongoDB (Running locally or a MongoDB Atlas connection string)

### 1. Database Configuration
Ensure MongoDB is running locally on:
`mongodb://localhost:27017/aarohi`

Alternatively, you can provide an Atlas cloud cluster string in the environment configurations.

### 2. Backend Server Setup
Navigate into the `backend` folder and follow these steps:

```bash
cd backend
# Install dependencies
npm install

# Start development server
npm run dev
```

The Express server will initialize on [http://localhost:5000](http://localhost:5000) and automatically seed initial courses, scholarships, schemes, and career guides into MongoDB.

**Backend Environment Variables (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aarohi
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Frontend App Setup
Navigate back to the project root directory:

```bash
# Install root package dependencies
npm install

# Start Vite server
npm run dev
```

The frontend application will spin up at [http://localhost:5173](http://localhost:5173).

---

## Production Deployment Steps

Follow these steps to deploy Aarohi to production.

### Database Deployment (MongoDB Atlas)
1. Register/Login on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster.
3. Add a database user with password credentials and allow access from anywhere (`0.0.0.0/0` IP whitelist).
4. Fetch your connection string and swap the template variables (`<db_username>`, `<db_password>`, `<cluster_domain>`).

### Backend Deployment (Render)
1. Create a free account on [Render](https://render.com).
2. Create a new **Web Service** and link your GitHub repository.
3. Configure settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Under **Environment Variables**, define:
   - `MONGO_URI`: (Your MongoDB Atlas connection URI)
   - `PORT`: `5000`
   - `JWT_SECRET`: (A secure cryptographic key)
5. Deploy the web service.

### Frontend Deployment (Vercel)
1. Create a free account on [Vercel](https://vercel.com).
2. Click **Add New** -> **Project** and import your GitHub repository.
3. Leave build settings as default (Vite preset).
4. Under environment variables, ensure `API_URL` points to your Render backend domain endpoint.
5. Click **Deploy**.
