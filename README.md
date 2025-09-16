# 🎮 Crushd - Gamified Dating App

**The world's first team-based dating competition app where strategy meets romance!**

Crushd revolutionizes online dating by introducing team mechanics, competitive elements, and strategic gameplay to help users find meaningful connections while having fun with friends.

## 🚀 Overview

Crushd transforms dating from a solo activity into an engaging team sport. Users can join teams, participate in dating competitions, strategize with teammates, and compete against other teams while finding genuine romantic connections. Think dating app meets battle royale - but for love!

### Key Features
- **Team Formation**: Create or join teams with friends
- **Dating Competitions**: Participate in timed matching challenges
- **Strategic Swiping**: Coordinate with teammates for optimal matches
- **Leaderboards**: Compete for the most successful matches
- **Team Chat**: Strategize and celebrate victories together
- **Match Analytics**: Track team and individual performance
- **Seasonal Events**: Special themed competitions and challenges

---

## 🏗️ Project Structure

### Frontend (React Native + Expo)
```
frontend/app/
├── index.tsx                 # App entry point
├── _layout.tsx              # Root navigation layout
├── AuthScreen.tsx           # Authentication (login)
├── SignupScreen.tsx         # User registration
├── HomeScreen.tsx           # Main dashboard with stats
├── ProfileScreen.tsx        # User profile display
├── EditProfileScreen.tsx    # Profile editing interface
├── SwipeScreen.tsx          # Swiping/matching interface
├── ChatScreen.tsx           # Messaging system
└── about.tsx               # App information

contexts/
├── ProfileContexts.tsx      # User profile state management
├── TeamContext.tsx         # Team state management (In Progress)
├── GameContext.tsx         # Competition state management (In Progress)
└── AuthContext.tsx         # Authentication state (In Progress)

constants/
├── ProfileData.ts          # Test user profile data
├── app_config.ts          # API endpoints configuration
├── GameConfig.ts          # Game rules and settings (In Progress)
└── TeamData.ts            # Test team data (In Progress)

services/
├── ApiService.ts          # REST API communication layer
├── TeamService.ts         # Team management APIs (In Progress)
├── GameService.ts         # Competition APIs (In Progress)
├── MatchService.ts        # Matching algorithm APIs (In Progress)
└── WebSocketService.ts    # Real-time updates (In Progress)

components/
├── ui/                    # Reusable UI components (In Progress)
├── game/                  # Game-specific components (In Progress)
├── team/                  # Team management components (In Progress)
└── profile/               # Profile-related components (In Progress)
```

### Backend (Node.js + TypeScript + Express)
```
backend/
├── src/
│   ├── index.ts             # Express server entry point
│   ├── routes/              # API route handlers
│   │   ├── auth.ts          # Authentication endpoints
│   │   ├── users.ts         # User management
│   │   ├── teams.ts         # Team management
│   │   ├── matches.ts       # Matching system
│   │   └── competitions.ts  # Competition system
│   ├── controllers/         # Business logic layer
│   ├── models/              # Database models & types
│   ├── middleware/          # Express middleware
│   ├── services/            # External service integrations
│   ├── utils/               # Helper functions
│   └── config/              # Configuration files
├── docker-compose.yml       # PostgreSQL database setup
└── package.json            # Node.js dependencies
```

---

## 🔧 Tech Stack

### Frontend
- **Framework**: React Native with Expo SDK
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **UI/Styling**: React Native StyleSheet + Custom Components
- **Real-time**: WebSocket connections (In Progress)
- **Push Notifications**: Expo Notifications (In Progress)

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Docker
- **ORM**: pg (node-postgres) for database queries
- **Authentication**: JWT tokens with bcryptjs
- **Real-time**: Socket.IO for live competitions
- **Caching**: Redis and ioredis for session management
- **Security**: Helmet.js, CORS middleware
- **Logging**: Morgan for request logging
- **Development**: Nodemon with ts-node for hot reload

### Database Schema (In Progress)
```sql
-- Core Tables
users              # User profiles and authentication
teams              # Team information and settings
team_members       # User-team relationships
competitions       # Active and past competitions
matches            # User matches and connections
messages           # Chat messages
swipe_history      # Tracking user swipe patterns

-- Analytics Tables
team_stats         # Team performance metrics
user_stats         # Individual user statistics
competition_results # Competition outcomes and rankings
```

---

## 🔌 API Endpoints

### Current Implementation
```typescript
// Base configuration
BASE_URL: 'http://localhost:3000/api'

// Authentication (In Progress)
POST   /auth/login
POST   /auth/signup
POST   /auth/refresh
POST   /auth/logout

// User Profiles
GET    /profiles/:id
PUT    /profiles/:id
POST   /profiles
DELETE /profiles/:id
POST   /profiles/:id/photos
```

### Planned API Endpoints (In Progress)
```typescript
// Team Management
GET    /teams
POST   /teams
GET    /teams/:id
PUT    /teams/:id
POST   /teams/:id/join
DELETE /teams/:id/leave
GET    /teams/:id/members

// Competition System
GET    /competitions
POST   /competitions
GET    /competitions/:id
POST   /competitions/:id/join
GET    /competitions/active
GET    /competitions/:id/leaderboard

// Matching & Swiping
POST   /swipe
GET    /matches
GET    /matches/:id/messages
POST   /matches/:id/messages
GET    /potential-matches

// Analytics & Stats
GET    /stats/user/:id
GET    /stats/team/:id
GET    /leaderboards/global
GET    /leaderboards/team/:id
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Docker and Docker Compose
- Expo CLI (for frontend)
- iOS Simulator (Mac) or Android Emulator

### Database Setup
1. **Start PostgreSQL database**
   ```bash
   cd backend
   npm run db:start
   ```

2. **Database will be available at:**
   ```
   postgresql://crushed:dev_password@localhost:5432/crushed_dev
   ```

3. **Useful database commands:**
   ```bash
   npm run db:stop    # Stop database
   npm run db:logs    # View database logs
   npm run db:reset   # Reset database (removes all data)
   ```

### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Backend will be running at:**
   ```
   http://localhost:3000
   ```

### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Expo development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### Full Development Setup
```bash
# Terminal 1 - Database
cd backend && npm run db:start

# Terminal 2 - Backend API
cd backend && npm run dev

# Terminal 3 - Frontend
cd frontend && npx expo start
```

### Environment Setup (In Progress)
```bash
# Backend environment
cd backend
cp .env.example .env

# Configure database and API settings
DATABASE_URL=postgresql://crushed:dev_password@localhost:5432/crushed_dev
JWT_SECRET=your_jwt_secret_here
REDIS_URL=redis://localhost:6379
```

---

## 🎮 Game Mechanics (In Progress)

### Team Competitions
- **Team Size**: 2-6 players
- **Competition Duration**: 1-7 days
- **Scoring System**: Points based on match quality and success
- **Team Strategy**: Coordinate swiping patterns for maximum efficiency

### Competition Types
- **Speed Dating**: Quick-fire matching rounds
- **Strategic Swiping**: Long-form competitions with team coordination
- **Themed Events**: Holiday and seasonal competitions
- **Tournament Mode**: Bracket-style team vs team competitions

### Scoring Algorithm
```
Match Score = Base Points + Compatibility Bonus + Team Coordination Bonus
Team Score = Sum of all member scores + Team synergy multiplier
```

---

## 🗄️ Backend Architecture

### Express Application Structure
```typescript
// src/index.ts - Server setup
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Middleware stack
app.use(helmet());           # Security headers
app.use(cors());            # Cross-origin requests
app.use(morgan('combined')); # Request logging
app.use(express.json());    # JSON parsing

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
```

### Key Features
- **TypeScript**: Full type safety across the application
- **Docker Database**: Consistent PostgreSQL setup for all developers
- **JWT Authentication**: Secure token-based auth with bcryptjs
- **Real-time Communication**: Socket.IO for live features
- **Redis Caching**: Fast session storage and leaderboards
- **Security**: Helmet.js and CORS protection
- **Development Experience**: Hot reload with nodemon + ts-node

---

## 📱 Development Status

### ✅ Completed
- Basic app structure and navigation
- User profile system (view/edit)
- Profile photo management
- Home dashboard with stats
- Authentication screens (UI only)
- API service layer boilerplate
- Backend project structure with TypeScript
- Dockerized PostgreSQL database setup
- Database management scripts

### 🚧 In Progress
- Backend API development (Express + PostgreSQL)
- Team management system
- Competition mechanics
- Real-time matching system
- Socket.IO integration
- Push notifications

### 📋 Planned Features
- Advanced matching algorithms
- Video profile support
- In-app purchases and premium features
- Social media integration
- Advanced analytics dashboard
- Admin panel for competition management

---

## 🤝 Contributing

This project is currently in active development. Contribution guidelines will be established once the core features are implemented.

### Development Workflow (In Progress)
1. Feature branch creation
2. Code review process
3. Automated testing
4. Staging deployment
5. Production release

---

## 🛠️ Troubleshooting

### Database Issues
- **Port 5432 in use**: Stop local PostgreSQL with `sudo systemctl stop postgresql`
- **Docker not found**: Install Docker and Docker Compose
- **Permission denied**: Add user to docker group: `sudo usermod -aG docker $USER`

### Backend Issues
- **Module not found**: Run `npm install` in backend directory
- **TypeScript errors**: Check `tsconfig.json` configuration
- **Port conflicts**: Change port in Express server configuration

### Frontend Issues
- **Expo CLI not found**: Install globally with `npm install -g @expo/cli`
- **Metro bundler issues**: Clear cache with `npx expo start -c`
- **Device connection**: Ensure devices are on same network

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Contact

For questions about the project or collaboration opportunities:
- **Project Lead**: [Your Name]
- **Email**: [your-email]
- **Discord**: [server-invite] (In Progress)

---

*Built with ❤️ and competitive spirit - because finding love should be a team sport!*