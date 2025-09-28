# MentorLink Setup Instructions

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mentorlink
USE_FILE_DB=false

# JWT
JWT_SECRET=your_jwt_secret_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
APP_NAME=MentorLink
DEV_DISABLE_EMAIL=false

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
```

### 3. Cloudinary Setup
1. Sign up for a free Cloudinary account at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add these credentials to your `.env` file

### 4. Start the Backend Server
```bash
npm start
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd ../
npm install
```

### 2. Start the Frontend
```bash
npm run dev
```

## Features Implemented

### ✅ Role-Based Access Control
- Student Profile page is now restricted to students only
- Event Organizer and Mentor users are redirected to their respective profile pages
- Authentication context manages user state and role checking

### ✅ Student Profile Data Integration
- Student profile data is fetched from MongoDB
- Dynamic display of student information (name, email, bio, etc.)
- Real-time data updates

### ✅ Cloudinary Image Upload
- Profile image upload functionality with Cloudinary
- Image optimization and transformation
- Dynamic profile image display in navbar

### ✅ Placeholder Profile Pages
- Event Organizer profile page (ready for Karthik's design)
- Mentor profile page (ready for future design)
- Modular structure for easy integration

### ✅ Dynamic Navbar
- Profile images are displayed dynamically in the navbar
- Role-based navigation to appropriate profile pages

## API Endpoints

### Student Profile
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile-image` - Update profile image URL
- `POST /api/students/upload-image` - Upload profile image to Cloudinary

## Next Steps

1. **Event Organizer Profile Design**: Karthik and team will provide the design for the Event Organizer profile page
2. **Mentor Profile Design**: Design and implement the Mentor profile page
3. **Testing**: Test all role-based access controls and image upload functionality
4. **Environment Setup**: Configure Cloudinary credentials in production

## File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Authentication context
├── components/
│   └── common/
│       ├── ProtectedRoute.jsx   # Role-based route protection
│       └── HomeNavbar.jsx       # Updated navbar with dynamic images
├── pages/
│   ├── StudentProfile.jsx       # Updated with dynamic data
│   ├── OrganizerProfile.jsx     # Placeholder for Event Organizer
│   └── MentorProfile.jsx        # Placeholder for Mentor
└── services/
    └── api.js                   # Updated API service

backend/
├── config/
│   └── cloudinary.js            # Cloudinary configuration
├── middleware/
│   └── upload.js               # Multer + Cloudinary setup
├── controllers/
│   └── studentController.js    # Updated with profile endpoints
└── routes/
    └── studentRoutes.js        # Updated with new routes
```

