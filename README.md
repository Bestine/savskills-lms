# Savskill Platform

## Frontend (Client)

The frontend is a single-page application built with vanilla HTML, CSS, and JavaScript.

### Running the Frontend

Simply open `index.html` in your browser. For best results, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## Backend (Server)

The backend is built with Node.js, Express, MongoDB, JWT authentication, OpenAI, and AWS SES.

### Prerequisites

1. **MongoDB**: Install and run MongoDB locally, or use MongoDB Atlas
2. **Node.js**: Version 16 or higher
3. **AWS Account**: For SES email service
4. **OpenAI API Key**: For AI bot features

### Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

4. Update `.env` with your credentials:
- MongoDB connection string
- JWT secret key
- AWS SES credentials
- OpenAI API key

### Running the Backend

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

### API Endpoints

**Authentication**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify/:token` - Verify email

**Users**
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update profile (auth required)
- `POST /api/users/assessment` - Submit assessment (auth required)
- `POST /api/users/progress` - Update course progress (auth required)

**Bot**
- `POST /api/bot/chat` - Chat with AI bot (auth required)
- `GET /api/bot/nudges` - Get personalized nudges (auth required)
- `POST /api/bot/feedback` - Submit feedback (auth required)

**Community**
- `GET /api/community/tribes` - Get all tribes (auth required)
- `POST /api/community/tribes/:tribeId/join` - Join tribe (auth required)
- `GET /api/community/tribes/:tribeId/messages` - Get tribe messages (auth required)
- `POST /api/community/tribes/:tribeId/messages` - Post message (auth required)

**Challenges**
- `GET /api/challenges/current` - Get current challenge (auth required)
- `POST /api/challenges/complete/:id` - Mark challenge complete (auth required)

### MongoDB Setup

If using MongoDB locally:
```bash
# Start MongoDB
mongod

# The app will create the database and collections automatically
```

If using MongoDB Atlas:
1. Create a cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### Initial Tribe Setup

You may want to seed the database with initial tribes:

```javascript
// Run this in MongoDB shell or create a seed script
db.tribes.insertMany([
  {
    name: "The Visionaries",
    tribeId: "visionaries",
    description: "Strategic thinkers focused on big-picture leadership...",
    color: "#6366f1",
    members: [],
    messages: [],
    resources: []
  },
  // ... add other tribes
]);
```

## Project Structure

```
UBUNIFU101/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── app.js              # Frontend JavaScript
├── assets/
│   └── logo.png        # Savskill logo
└── backend/
    ├── server.js       # Express server
    ├── package.json    # Dependencies
    ├── .env.example    # Environment template
    ├── models/
    │   ├── User.js     # User schema
    │   └── Tribe.js    # Tribe schema
    ├── routes/
    │   ├── auth.js     # Auth endpoints
    │   ├── users.js    # User endpoints
    │   ├── bot.js      # AI bot endpoints
    │   ├── courses.js  # Course endpoints
    │   ├── community.js # Community endpoints
    │   └── challenges.js # Challenge endpoints
    ├── middleware/
    │   └── auth.js     # JWT middleware
    └── services/
        └── emailService.js # AWS SES
```

## Features

✅ Loading screen with animation
✅ Welcome page
✅ Login/Signup with validation
✅ Leadership assessment (12 questions)
✅ Dashboard with stats
✅ Course system with modules
✅ Video playback
✅ Quiz assessments
✅ AI Bot chat (OpenAI integration)
✅ Personalized nudges
✅ Feedback system
✅ Community tribes
✅ Tribe chat
✅ Weekly challenges
✅ Progress tracking
✅ JWT authentication
✅ Email verification (AWS SES)

## Next Steps

1. **Configure AWS SES**: 
   - Verify your email/domain in AWS SES
   - Update credentials in `.env`

2. **Add OpenAI API Key**:
   - Get key from https://platform.openai.com
   - Add to `.env`

3. **Test the Flow**:
   - Run backend server
   - Open frontend in browser
   - Sign up → Assessment → Dashboard → Explore features

4. **Production Deployment**:
   - Frontend: Deploy to Netlify/Vercel
   - Backend: Deploy to Heroku/Railway/AWS
   - Database: Use MongoDB Atlas

## Support

For issues or questions, please refer to the documentation or create an issue.
