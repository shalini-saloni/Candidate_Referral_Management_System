# Candidate Referral Management System

A full-stack web application for managing candidate referrals with a modern, intuitive interface. Built with React, Node.js, Express, and MongoDB.

## Features Implemented

### Core Features
- **Dashboard**: View all referred candidates with real-time statistics
- **Candidate Cards**: Display name, job title, status, email, phone, and resume
- **Search & Filter**: Search by name/email/job title and filter by status
- **Referral Form**: Submit new candidate referrals with validation
- **Status Management**: Update candidate status (Pending → Reviewed → Hired/Rejected)
- **Resume Upload**: Accept and store PDF resumes (max 5MB)
- **Delete Candidates**: Remove candidate records

### Bonus Features
- **Authentication**: JWT-based user authentication (login/register)
- **Metrics Dashboard**: Real-time stats (Total, Pending, Reviewed, Hired)
- **Modern UI/UX**: Sleek, responsive design with animations
- **Form Validation**: Email, phone, and file format validation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Rate Limiting**: API rate limiting for security
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload
- **Bcrypt** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd candidate_referral_management_system
```

#### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# PORT=5001
# MONGODB_URI=mongodb://localhost:27017/candidate_referral
# JWT_SECRET=your_secret_key
# NODE_ENV=development

# Start MongoDB (if not running)
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod
# On Windows: net start MongoDB

# Seed the database with sample data (optional)
npm run seed

# Start the backend server
npm run dev
```

The backend server will start on http://localhost:5001

#### 3. Setup Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on http://localhost:3000

### Default Login Credentials (After Seeding)
```
Email: admin@example.com
Password: admin123
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Candidates
- `GET /api/candidates` - Get all candidates (with optional filters)
- `GET /api/candidates/stats` - Get candidate statistics
- `GET /api/candidates/:id` - Get single candidate
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id/status` - Update candidate status
- `PUT /api/candidates/:id` - Update candidate details
- `DELETE /api/candidates/:id` - Delete candidate

### Query Parameters for GET /api/candidates
- `status` - Filter by status (Pending, Reviewed, Hired, Rejected)
- `jobTitle` - Filter by job title (partial match)
- `search` - Search across name, email, and job title

## Testing with Postman

Import the provided `postman_collection.json` file into Postman to test all API endpoints.

### Testing Flow
1. **Register/Login**: Get authentication token
2. **Create Candidate**: Submit a new referral
3. **Get All Candidates**: View all candidates with filters
4. **Update Status**: Change candidate status
5. **Get Statistics**: View dashboard metrics
6. **Delete Candidate**: Remove a candidate

## Assumptions & Limitations

### Assumptions
- One user can refer multiple candidates
- Email is unique per candidate
- Resumes are stored locally (not cloud storage)
- Basic role-based access (user/admin)
- No email notifications implemented

### Limitations
- Local file storage (not production-ready)
- No pagination (suitable for small datasets)
- Single file upload per candidate
- No advanced search/sorting
- No candidate history tracking

