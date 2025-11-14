# Voice AI Troubleshooting & Testing Guide

## ✅ Test Results

All APIs are working correctly:
- ✅ **Gemini API**: Working
- ✅ **ElevenLabs API**: Working (Voice: Sarah)
- ✅ **Agora Conversational AI**: Working

## 🎙️ How Voice AI Works

### Architecture Flow

```
User (Flutter App)
    ↓ Tap Microphone
    ↓ Request /api/voice/start
Backend Server
    ↓ Create AI Agent
Agora Conversational AI Engine
    ├─ ARES ASR (Speech → Text)
    ├─ Gemini LLM (Process & Respond)
    └─ ElevenLabs TTS (Text → Speech)
    ↓ Join RTC Channel
User ← Real-time Voice Conversation
```

### Step-by-Step Process

1. **User taps microphone button**
   - Flutter calls `/api/voice/start`
   - Sends current page context

2. **Backend creates AI agent**
   - Generates unique channel name
   - Creates RTC token for user
   - Calls Agora API to start agent
   - Agent joins channel with UID 999

3. **User joins same channel**
   - Flutter receives channel name & token
   - Joins Agora RTC channel
   - Enables audio

4. **Real-time conversation**
   - User speaks → ARES converts to text
   - Gemini processes & generates response
   - ElevenLabs converts response to speech
   - User hears AI voice

5. **Session ends**
   - User taps button again
   - Backend stops agent
   - User leaves channel

## 🔧 Testing the Voice AI

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 3000
📡 Environment: development
```

### 2. Test Agora API

```bash
node test-agora.js
```

**Expected Output:**
```
✅ Gemini API working!
✅ ElevenLabs API working!
✅ SUCCESS! Agent created
```

### 3. Run Flutter App

```bash
cd flutter_app
flutter run
```

### 4. Test Voice Session

1. **Register/Login** to the app
2. **Tap microphone button** (large blue button)
3. **Watch logs** in both terminals

**Backend Logs (Expected):**
```
🎙️ Starting Agora AI agent...
Channel: study_ai_[userId]_[timestamp]
User ID: [userId]
API URL: https://api.agora.io/api/conversational-ai-agent/v2/projects/[appId]/join
📤 Sending request to Agora...
✅ Agent created successfully!
Agent ID: [agentId]
Status: RUNNING
```

**Flutter Logs (Expected):**
```
🎙️ Initializing Agora RTC Engine...
✅ Agora RTC Engine initialized
🎙️ Starting voice session...
📡 Requesting voice session from backend...
✅ Backend response received
🔗 Joining Agora channel...
✅ Successfully joined channel
✅ AI Agent joined: 999
```

### 5. Speak to AI

Say: **"Hello, can you help me?"**

**Expected:**
- AI responds with voice
- You hear: "Hello! I am your Study AI assistant. How can I help you today?"

### 6. Test Navigation

Say: **"Go to quiz"**

**Expected:**
- App navigates to quiz section
- AI confirms the navigation

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to start AI agent"

**Symptoms:**
- Button doesn't turn red
- Error message appears

**Solutions:**

1. **Check Backend Logs**
   ```bash
   # Look for error messages in backend terminal
   ```

2. **Verify API Keys**
   ```bash
   # In backend/.env
   GEMINI_API_KEY=...
   ELEVENLABS_API_KEY=...
   AGORA_CUSTOMER_ID=...
   AGORA_CUSTOMER_SECRET=...
   ```

3. **Test APIs Individually**
   ```bash
   node test-agora.js
   ```

### Issue 2: "Cannot connect to backend"

**Symptoms:**
- Network error in Flutter
- Connection refused

**Solutions:**

1. **Check Backend is Running**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Update Flutter API Endpoint**
   - For emulator: `http://10.0.2.2:3000/api`
   - For physical device: `http://YOUR_IP:3000/api`

3. **Check Firewall**
   - Allow port 3000
   - Disable antivirus temporarily

### Issue 3: "Microphone permission denied"

**Symptoms:**
- Permission error
- No audio captured

**Solutions:**

1. **Grant Permission**
   - Settings → Apps → Study AI → Permissions
   - Enable Microphone

2. **Check AndroidManifest.xml**
   ```xml
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   ```

### Issue 4: "AI not responding"

**Symptoms:**
- Button turns red
- No voice response

**Solutions:**

1. **Check Agent Status**
   - Look for "AI Agent joined: 999" in logs
   - Verify agent is RUNNING

2. **Check Internet Connection**
   - Stable connection required
   - Minimum 1 Mbps

3. **Verify Gemini API**
   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_KEY" \
     -H 'Content-Type: application/json' \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
   ```

### Issue 5: "Voice quality poor"

**Symptoms:**
- Choppy audio
- Delayed responses

**Solutions:**

1. **Check Network Speed**
   - Test internet speed
   - Use WiFi instead of mobile data

2. **Reduce Background Noise**
   - Quiet environment
   - Use headphones

3. **Adjust Sample Rate**
   ```javascript
   // In backend/src/services/agoraService.js
   sample_rate: 16000, // Lower for slower connections
   ```

## 📊 Monitoring & Debugging

### Backend Monitoring

**Enable Detailed Logs:**
```javascript
// Already enabled in agoraService.js
console.log('🎙️ Starting Agora AI agent...');
console.log('📤 Sending request to Agora...');
console.log('✅ Agent created successfully!');
```

**Check Agent Status:**
```bash
# Query agent status
curl -X GET \
  "https://api.agora.io/api/conversational-ai-agent/v2/projects/[appId]/agents/[agentId]" \
  -H "Authorization: Basic [base64_credentials]"
```

### Flutter Monitoring

**Enable Debug Prints:**
```dart
// Already enabled in voice_provider.dart
debugPrint('🎙️ Starting voice session...');
debugPrint('✅ Voice session started successfully');
```

**Check Agora Events:**
- onJoinChannelSuccess
- onUserJoined (Agent UID: 999)
- onAudioVolumeIndication
- onError

### Agora Console

1. Go to [Agora Console](https://console.agora.io/)
2. Select your project
3. View:
   - Usage statistics
   - Active sessions
   - Error logs
   - Billing

## 🎯 Testing Checklist

### Pre-Flight Checks
- [ ] MongoDB running
- [ ] Backend server running
- [ ] All API keys configured
- [ ] Flutter app built successfully
- [ ] Microphone permission granted

### Voice AI Tests
- [ ] Button turns red when tapped
- [ ] Backend creates agent successfully
- [ ] User joins channel
- [ ] Agent joins channel (UID 999)
- [ ] AI responds to greeting
- [ ] Voice quality is clear
- [ ] Navigation commands work
- [ ] Query responses work
- [ ] Session stops cleanly

### Error Handling Tests
- [ ] Network error handled gracefully
- [ ] Permission denied shows message
- [ ] Backend error displays to user
- [ ] Retry mechanism works
- [ ] Session cleanup on error

## 🚀 Performance Tips

### Optimize Voice Quality
1. Use WiFi connection
2. Close background apps
3. Use headphones
4. Quiet environment

### Reduce Latency
1. Use lower sample rate (16000 Hz)
2. Reduce max_history (16 instead of 32)
3. Use faster Gemini model
4. Enable audio processing

### Save API Costs
1. Set idle_timeout (5 minutes)
2. Stop sessions when not in use
3. Monitor usage in console
4. Use free tier limits wisely

## 📈 Success Metrics

Your Voice AI is working correctly if:

1. **Connection Time** < 3 seconds
2. **Response Latency** < 2 seconds
3. **Voice Quality** Clear and natural
4. **Success Rate** > 95%
5. **Error Rate** < 5%

## 🎓 Advanced Features

### Custom Voice Commands

Add to `backend/src/services/intentClassifier.js`:
```javascript
// Add custom intents
const CUSTOM_INTENTS = {
  START_QUIZ: 'start_quiz',
  CREATE_FLASHCARD: 'create_flashcard',
  // Add more...
};
```

### Personalized Responses

Modify `generateSystemPrompt()` in `agoraController.js`:
```javascript
if (user.studyPlan) {
  prompt += `Today's topics: ${getTodaysTopics(user.studyPlan)}. `;
}
```

### Voice Analytics

Track in `VoiceSession` model:
- Session duration
- Commands used
- Topics discussed
- User satisfaction

## 📚 Resources

- [Agora Conversational AI Docs](https://docs.agora.io/en/conversational-ai/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [ElevenLabs Docs](https://elevenlabs.io/docs)
- [Flutter Agora Plugin](https://pub.dev/packages/agora_rtc_engine)

## 🆘 Still Having Issues?

1. **Check all logs** (backend + Flutter)
2. **Run test script**: `node test-agora.js`
3. **Verify API keys** are valid
4. **Test internet connection**
5. **Try different device/emulator**
6. **Check Agora console** for errors

Your Voice AI should now be working perfectly! 🎉
