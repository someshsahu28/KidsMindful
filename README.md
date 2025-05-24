# KidsMindful - Mental Health App for Kids 🌈

A comprehensive mental health application designed specifically for children, featuring mood tracking, fun games, and calming activities.

## Project Structure

```
mental-health-kids-app/
├── frontend/         # React frontend application
└── backend/          # Node.js backend API
```

## Quick Start Guide

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   PORT=3000
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel. Follow these steps:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

3. For production deployment:
   ```bash
   vercel --prod
   ```

### Backend (Render)
The backend is deployed on Render. Follow these steps:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Set up the same variables as in your `.env` file

## Features

- 😊 Mood Tracking
- 🎮 Educational Games
- 🧘‍♂️ Calming Activities
- 💭 Resource Center

## Tech Stack

- Frontend: React, Material-UI, Framer Motion
- Backend: Node.js, Express, Sequelize
- Database: SQLite (development), PostgreSQL (production)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Environment Setup

1. Create a `.env` file in the backend directory:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/kidsmindful
JWT_SECRET=your-secret-key
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kidsmindful.git
cd kidsmindful
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up the database:
```bash
# Create PostgreSQL database
createdb kidsmindful
```

4. Start the development servers:
```bash
# Start both frontend and backend (from root directory)
npm start

# Or start them separately:
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
kidsmindful/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── main.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── index.ts
│   └── package.json
└── package.json
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Mental health resources and information provided by reputable organizations
- Icons and emojis from Material-UI and standard emoji sets
- Special thanks to all contributors and supporters 