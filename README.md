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
app/
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

---

## 🔧 Tech Stack

### Frontend
- **Framework**: React Native with Expo SDK
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **UI/Styling**: React Native StyleSheet + Custom Components
- **Real-time**: WebSocket connections (In Progress)
- **Push Notifications**: Expo Notifications (In Progress)

### Backend (In Progress)
- **API Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with refresh mechanism
- **Real-time**: WebSocket support for live competitions
- **File Storage**: AWS S3 for profile photos
- **Caching**: Redis for session management and leaderboards
- **Queue System**: Celery for background tasks

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
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd crushd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### Environment Setup
```bash
# Copy environment template (In Progress)
cp .env.example .env

# Configure API endpoints
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WS_URL=ws://localhost:3000/ws
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

## 🗄️ Backend Architecture (In Progress)

### FastAPI Application Structure
```python
app/
├── main.py                 # FastAPI application entry
├── config/                 # Configuration and settings
├── models/                 # SQLAlchemy database models
├── schemas/                # Pydantic schemas for API
├── routers/                # API route handlers
├── services/               # Business logic layer
├── utils/                  # Helper functions
├── database/               # Database connection and migrations
└── tests/                  # Test suites
```

### Key Features
- **Async/Await**: Full async support for high performance
- **Database Migrations**: Alembic for schema management
- **API Documentation**: Auto-generated with FastAPI
- **Input Validation**: Pydantic models for type safety
- **Authentication**: JWT with role-based permissions

---

## 📱 Development Status

### ✅ Completed
- Basic app structure and navigation
- User profile system (view/edit)
- Profile photo management
- Home dashboard with stats
- Authentication screens (UI only)
- API service layer boilerplate

### 🚧 In Progress
- Backend API development (FastAPI + PostgreSQL)
- Team management system
- Competition mechanics
- Real-time matching system
- WebSocket integration
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