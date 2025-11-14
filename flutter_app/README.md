# Study AI Flutter App

AI-powered study assistant with voice interaction using Agora Conversational AI.

## Features

- 🎤 **Voice AI Assistant** - Talk to your AI study companion
- 📝 **Quiz Module** - Practice with previous year questions
- 🎴 **Flashcards** - Spaced repetition learning
- 📰 **News Feed** - Educational news and updates
- 💬 **Community Chat** - Connect with fellow students
- 📅 **Study Planner** - AI-generated personalized study plans

## Setup

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Android Studio / Xcode
- Node.js backend running

### Installation

1. Install dependencies:
```bash
flutter pub get
```

2. Update API endpoint in `lib/config/constants.dart`:
```dart
static const String baseUrl = 'http://YOUR_IP:3000/api';
```

3. Run the app:
```bash
flutter run
```

### Android Permissions

Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### iOS Permissions

Add to `ios/Runner/Info.plist`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice chat</string>
```

## Architecture

```
lib/
├── config/          # App configuration
├── models/          # Data models
├── providers/       # State management
├── screens/         # UI screens
├── services/        # API & external services
└── widgets/         # Reusable widgets
```

## Voice AI Features

The app uses Agora Conversational AI with:
- **ARES ASR** for speech-to-text
- **Google Gemini** for conversational intelligence
- **ElevenLabs** for natural text-to-speech

### Voice Commands

- "Go to quiz" - Navigate to quiz section
- "Open flashcards" - Navigate to flashcards
- "Show me news" - Navigate to news
- "Explain [topic]" - Get explanations
- "Create study plan" - Start study planning

## State Management

Uses Provider for state management:
- `AuthProvider` - Authentication state
- `VoiceProvider` - Voice session management
- `NavigationProvider` - App navigation

## Testing

Run tests:
```bash
flutter test
```

## Build

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```
