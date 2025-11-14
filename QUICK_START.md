# Quick Start Guide

## 🚀 Start the Application

### Step 1: Start MongoDB
```bash
# Open a new terminal
mongod
```

### Step 2: Start Backend Server
```bash
# Open a new terminal
cd backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 3000
```

### Step 3: Seed Sample Data (Optional)
```bash
# In backend directory
npm run seed
```

### Step 4: Run Flutter App
```bash
# Open a new terminal
cd flutter_app
flutter pub get
flutter run
```

## 📱 Using the App

### First Time Setup
1. App opens to Login screen
2. Click "Don't have an account? Register"
3. Enter:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
4. Click "Register"

### Test Voice AI
1. Tap the large blue microphone button (bottom right)
2. Button turns red when connected
3. Say: "Hello, can you help me?"
4. AI responds with voice

### Test Navigation
1. Say: "Go to quiz"
2. App navigates to quiz section
3. Try other commands:
   - "Open flashcards"
   - "Show me news"
   - "Take me to community"

## 🔧 Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 3000 is available
- Verify .env file exists

### Flutter build errors
```bash
cd flutter_app
flutter clean
flutter pub get
flutter run
```

### Can't connect to backend
- Using physical device? Update IP in `lib/config/constants.dart`
- Using emulator? Should work with `192.168.0.116`

### Voice not working
- Grant microphone permission
- Check Agora credentials in backend/.env
- Verify internet connection

## 📝 Test Accounts

After registration, you can login with:
- Email: test@example.com
- Password: test123

## 🎯 Next Steps

1. Explore all features
2. Create flashcards
3. Take quizzes
4. Chat in community
5. Create study plan

Enjoy your AI study companion! 🎓
