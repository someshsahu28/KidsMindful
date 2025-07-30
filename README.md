# KidsMindful - Mental Health App for Kids 🌈

A comprehensive mental health application designed specifically for children, featuring mood tracking, interactive stories with AI-powered story generation, fun games, and calming activities.

## 🌟 Features

- 😊 **Mood Tracking** - Help kids identify and track their emotions
- 📚 **Interactive Stories** - Engaging stories with animations and AI-powered custom story creation
- 🎮 **Educational Games** - Fun memory games and activities
- 🧘‍♂️ **Calming Activities** - Breathing exercises and relaxation techniques
- 💭 **Resource Center** - Educational content and mental health resources
- 🤖 **AI Story Generator** - Create personalized stories based on user input
## 🛠️ Tech Stack

- **Frontend**: React, Vite, Material-UI, Framer Motion, React Markdown
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL (production)
- **AI Integration**: Google Gemini AI for story generation
- **Deployment**: 
  - Frontend: Vercel
  - Backend: Render

## 📁 Project Structure

```
KidsMindful/
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── games/
│   │   │   ├── stories/
│   │   │   ├── activities/
│   │   │   └── mood/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
│       └── sounds/   # Audio files for games and activities
└── backend/          # Node.js backend API
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── middleware/
    │   └── config/
    └── prisma/
        └── schema.prisma
```

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git
- PostgreSQL (for production)

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/kidsmindful.git
   cd kidsmindful
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "PORT=5000
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   GEMINI_API_KEY=your-gemini-api-key
   DATABASE_URL=postgresql://username:password@localhost:5432/kidsmindful" > .env
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   
   # Start frontend server
   npm run dev
   ```

4. **Start both servers (alternative)**:
   ```bash
   # From root directory
   npm install
   npm start
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Frontend (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Environment Variables in Vercel**:
   ```
   VITE_API_URL=https://kidsmindful.onrender.com/api
   ```

### Backend (Render)

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Build Settings**:
   - Build Command: `cd backend && npm install && npx prisma generate`
   - Start Command: `cd backend && npm start`
4. **Environment Variables**:
   ```
   PORT=10000
   NODE_ENV=production
   JWT_SECRET=your-production-secret
   GEMINI_API_KEY=your-gemini-api-key
   DATABASE_URL=your-postgresql-url
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=postgresql://username:password@localhost:5432/kidsmindful
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Mood Tracking
- `GET /api/moods` - Get user's mood history
- `POST /api/moods` - Record new mood entry

### AI Story Generation
- `POST /api/ai/generate-story` - Generate custom story using Google Gemini AI

### Activities
- `GET /api/activities` - Get available activities
- `POST /api/activities` - Create new activity

## 🎯 Key Features Explained

### Interactive Stories
- Pre-built animated stories with sound effects
- AI-powered custom story generation using Google Gemini AI
- Markdown support for rich text formatting in AI responses
- Character animations and visual effects
- Voice narration support

### Mood Tracking
- Visual mood selection interface
- Historical mood data with Prisma ORM
- Personalized insights and recommendations

### Educational Games
- Memory matching games
- Animal sound recognition
- Progress tracking and scoring

### Calming Activities
- Guided breathing exercises
- Nature sounds and ambient music
- Meditation and relaxation techniques

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion for engaging interactions
- **Material Design** - Clean and child-friendly interface
- **Sound Effects** - Audio feedback for better engagement
- **Dark/Light Mode** - Comfortable viewing experience

## 🔒 Security Features

- JWT Authentication with automatic token refresh
- Password hashing with bcryptjs
- CORS protection
- Rate limiting
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Mental health resources from reputable organizations
- Sound effects from [Pixabay](https://pixabay.com)
- Icons and animations from Material-UI and Framer Motion
- AI story generation powered by Google Gemini AI
- Database management with Prisma ORM
- Special thanks to all contributors and supporters

## 📞 Support

For support, email support@kidsmindful.com or create an issue in this repository.

## 🔗 Links

- **Live Application**: [https://kids-mindful.vercel.app](https://kids-mindful.vercel.app)
- **API Documentation**: [https://kidsmindful.onrender.com/api](https://kidsmindful.onrender.com/api)
- **GitHub Repository**: [https://github.com/yourusername/kidsmindful](https://github.com/yourusername/kidsmindful)

---

Made with ❤️ for children's mental health and wellbeing.
