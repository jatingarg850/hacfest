# Study AI Backend

Backend server for Study AI conversational application with Agora integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`

3. Start MongoDB:
```bash
mongod
```

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Voice AI
- POST `/api/voice/start` - Start voice session with AI
- POST `/api/voice/stop` - Stop voice session
- GET `/api/voice/session/:id` - Get session details

### Intent Classification
- POST `/api/intent/classify` - Classify user intent

### Study Plan
- POST `/api/study-plan` - Create study plan
- GET `/api/study-plan` - Get user's study plan
- PATCH `/api/study-plan/:id` - Update study plan
- PATCH `/api/study-plan/:id/complete-day` - Mark day as completed

### Quiz
- GET `/api/quizzes` - Get all quizzes
- GET `/api/quizzes/:id` - Get quiz by ID
- POST `/api/quizzes/submit` - Submit quiz answers

### Flashcards
- POST `/api/flashcards` - Create flashcard
- GET `/api/flashcards` - Get user's flashcards
- PATCH `/api/flashcards/:id/review` - Review flashcard
- DELETE `/api/flashcards/:id` - Delete flashcard

### News
- GET `/api/news` - Get educational news
- POST `/api/news/summarize` - Summarize news article

## WebSocket Events (Community Chat)

- `join-room` - Join chat room
- `send-message` - Send message
- `new-message` - Receive new message
- `previous-messages` - Get chat history
