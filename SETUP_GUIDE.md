# Complete Setup Guide - Study AI

## Step-by-Step Installation

### 1. Prerequisites Installation

#### Install Node.js
```bash
# Download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

#### Install MongoDB
```bash
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

#### Install Flutter
```bash
# Download from https://flutter.dev/docs/get-started/install
# Verify installation
flutter doctor
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Your .env file is already configured with:
# - Agora credentials
# - Gemini API key
# - ElevenLabs API key
# - MongoDB connection string

# Start the server
npm run dev

# Server should start on http://localhost:3000
# You should see: "✅ MongoDB connected successfully"
```

### 3. Test Backend

```bash
# Test health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

### 4. Flutter App Setup

```bash
# Navigate to Flutter app
cd flutter_app

# Install dependencies
flutter pub get

# Check for issues
flutter doctor

# Connect device or start emulator
flutter devices

# Run the app
flutter run
```

### 5. Configure Network Access

#### For Android Emulator
Update `flutter_app/lib/config/constants.dart`:
```dart
static const String baseUrl = 'http://192.168.0.116:3000/api';
```

#### For Physical Device
1. Find your computer's IP address:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

2. Update `flutter_app/lib/config/constants.dart`:
```dart
static const String baseUrl = 'http://YOUR_IP:3000/api';
```

3. Ensure device and computer are on same network

### 6. Test the Application

1. **Register Account**
   - Open app
   - Click "Register"
   - Enter name, email, password
   - Click "Register"

2. **Test Voice AI**
   - Tap the large microphone button
   - Wait for connection (button turns red)
   - Speak: "Hello, can you help me?"
   - AI should respond with voice

3. **Test Navigation**
   - Say: "Go to quiz"
   - App should navigate to quiz section

4. **Test Features**
   - Navigate through bottom tabs
   - Try quiz, flashcards, news, community

### 7. Troubleshooting

#### Backend Issues

**MongoDB Connection Error**
```bash
# Make sure MongoDB is running
mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/student_app
```

**Port Already in Use**
```bash
# Change port in .env
PORT=3001

# Or kill process using port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
```

#### Flutter Issues

**Agora SDK Error**
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

**Network Error**
- Check API endpoint in constants.dart
- Verify backend is running
- Check firewall settings

**Microphone Permission**
- Grant microphone permission in device settings
- Check AndroidManifest.xml / Info.plist

### 8. Development with ngrok (Optional)

For testing with public URL:

```bash
# Install ngrok
# Download from https://ngrok.com/

# Start ngrok
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)

# Update .env
PUBLIC_SERVER_URL=https://abc123.ngrok.io

# Update Flutter constants.dart
static const String baseUrl = 'https://abc123.ngrok.io/api';

# Restart backend
npm run dev
```

### 9. Create Sample Data

#### Add Sample Quiz
```bash
# Use MongoDB Compass or mongo shell
# Connect to: mongodb://localhost:27017/student_app

# Insert sample quiz
db.quizzes.insertOne({
  title: "Physics - Motion",
  subject: "Physics",
  year: 2023,
  difficulty: "medium",
  questions: [
    {
      question: "What is Newton's First Law?",
      options: [
        "F = ma",
        "An object at rest stays at rest",
        "E = mc²",
        "V = IR"
      ],
      correctAnswer: 1,
      explanation: "Newton's First Law states that an object at rest stays at rest unless acted upon by an external force."
    }
  ]
})
```

### 10. Verify Everything Works

✅ Backend running on port 3000
✅ MongoDB connected
✅ Flutter app running on device/emulator
✅ Can register and login
✅ Voice button connects to AI
✅ Can navigate between screens
✅ Community chat works
✅ Quiz/Flashcards/News load

## Common Commands

### Backend
```bash
npm run dev          # Start development server
npm start            # Start production server
```

### Flutter
```bash
flutter run          # Run app
flutter build apk    # Build Android APK
flutter clean        # Clean build files
flutter pub get      # Install dependencies
```

### MongoDB
```bash
mongod               # Start MongoDB
mongo                # Open MongoDB shell
```

## Next Steps

1. **Customize AI Prompts**
   - Edit `backend/src/controllers/agoraController.js`
   - Modify `generateSystemPrompt()` function

2. **Add More Quizzes**
   - Create quiz management admin panel
   - Import question banks

3. **Enhance Study Planner**
   - Add more AI intelligence
   - Integrate calendar sync

4. **Deploy to Production**
   - Deploy backend to cloud
   - Publish app to Play Store/App Store

## Support

If you encounter issues:
1. Check console logs (backend and Flutter)
2. Verify all credentials in .env
3. Test API endpoints with Postman
4. Check Agora console for voice session logs
5. Review MongoDB for data issues

Happy coding! 🚀
