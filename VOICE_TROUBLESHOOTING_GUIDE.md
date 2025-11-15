# Voice AI Troubleshooting Guide

## Quick Diagnosis

### Test 1: Backend APIs
```bash
cd backend
node test-gemini.js
node test-elevenlabs.js
node test-agora-voice.js
```

All three should pass ✅

### Test 2: Check Backend Logs
When you start a voice session, you should see:
```
🎙️ Starting Agora AI agent...
📤 Sending configuration to Agora...
✅ Agent created successfully!
Status: RUNNING
⏳ Agent is now listening for user speech...
```

### Test 3: Check Flutter Logs
When you tap the mic button, you should see:
```
🎙️ Starting voice session...
📡 Requesting voice session from backend...
✅ Backend response received
🔗 Joining Agora channel...
✅ Successfully joined channel
✅ AI Agent joined: 999
🔊 Unmuting AI agent audio
```

## Common Issues & Solutions

### Issue 1: No Greeting Message (AI doesn't speak)

**Symptoms:**
- Agent starts successfully
- No audio from AI
- No "Hi! How can I help you study today?"

**Solutions:**

1. **Check device volume**
   - Turn up device volume to maximum
   - Check if device is muted

2. **Check audio route (Flutter)**
   - The app sets audio to speakerphone
   - Check Flutter logs for: `🔊 Audio route set to speakerphone`

3. **Check remote audio state**
   - Look for: `🔊 Remote audio (AI): UID=999 state=...`
   - Should see: `✅ AI is speaking!`

4. **Force unmute in Flutter**
   - The app automatically unmutes UID 999
   - Check logs for: `✅ Pre-emptive unmute for agent UID 999 completed`

5. **Check ElevenLabs API**
   ```bash
   cd backend
   node test-elevenlabs.js
   ```
   - Should create `test-elevenlabs-output.mp3`
   - Play the file to verify TTS works

### Issue 2: AI Doesn't Respond to Voice

**Symptoms:**
- You speak but AI doesn't respond
- No transcription in logs

**Solutions:**

1. **Check microphone permissions**
   - Android: Settings > Apps > Your App > Permissions > Microphone
   - iOS: Settings > Your App > Microphone

2. **Check local audio state**
   - Look for: `🎤 Local audio state: ...`
   - Should be enabled

3. **Speak clearly and wait**
   - Wait 1-2 seconds after greeting
   - Speak clearly and not too fast
   - Try: "What can you help me with?"

4. **Check ASR (Speech Recognition)**
   - Backend logs should show transcription
   - ARES ASR is used (built-in to Agora)

### Issue 3: Agent Fails to Start

**Symptoms:**
- Error when starting voice session
- Backend returns error

**Solutions:**

1. **Check API Keys**
   ```bash
   cd backend
   cat .env
   ```
   - Verify all keys are present
   - No extra spaces or quotes

2. **Check Agora Credentials**
   - AGORA_APP_ID
   - AGORA_APP_CERTIFICATE
   - AGORA_CUSTOMER_ID
   - AGORA_CUSTOMER_SECRET

3. **Check Gemini API Key**
   ```bash
   node test-gemini.js
   ```
   - Should return: "Hello there, I hope you're having a great day!"

4. **Check Network**
   - Ensure backend can reach:
     - api.agora.io
     - generativelanguage.googleapis.com
     - api.elevenlabs.io

### Issue 4: Audio Cuts Out or Stutters

**Symptoms:**
- AI starts speaking but stops
- Choppy audio

**Solutions:**

1. **Check network connection**
   - Stable WiFi or 4G/5G required
   - Test with: `ping api.agora.io`

2. **Check device performance**
   - Close other apps
   - Restart device

3. **Reduce audio quality (if needed)**
   - In `agoraService.js`, change:
   ```javascript
   sample_rate: 16000  // Instead of 24000
   ```

### Issue 5: "Remote audio reported as muted"

**Symptoms:**
- Log shows: `⚠️ AI agent reported as muted`

**Solutions:**

This is automatically handled! The app will:
1. Detect the mute state
2. Force unmute the agent
3. Set volume to 100

If it persists:
1. Restart the voice session
2. Check backend logs for TTS errors
3. Verify ElevenLabs API key is valid

## Advanced Debugging

### Monitor Voice Session in Real-Time
```bash
cd backend
node monitor-voice-session.js
```

This will:
- Start an agent
- Monitor status every 5 seconds
- Show real-time updates

### Check Agent Status Manually
```bash
curl -X GET \
  "https://api.agora.io/api/conversational-ai-agent/v2/projects/YOUR_APP_ID/agents/AGENT_ID" \
  -H "Authorization: Basic YOUR_AUTH_HEADER"
```

### Enable Verbose Logging

In `flutter_app/lib/services/agora_service.dart`, all logs are already enabled with `debugPrint`.

In `backend/src/services/agoraService.js`, all logs are already enabled with `console.log`.

## Configuration Checklist

- [ ] Backend `.env` file has all required keys
- [ ] Flutter `constants.dart` has correct backend URL
- [ ] Microphone permissions granted
- [ ] Device volume is up
- [ ] Network connection is stable
- [ ] All test scripts pass

## Still Having Issues?

1. **Restart everything**
   ```bash
   # Stop backend
   # Stop Flutter app
   # Clear Flutter build
   cd flutter_app
   flutter clean
   flutter pub get
   
   # Restart backend
   cd backend
   npm start
   
   # Restart Flutter
   flutter run
   ```

2. **Check logs carefully**
   - Backend console
   - Flutter debug console
   - Look for ❌ error messages

3. **Test with simple prompt**
   - Start voice session
   - Wait for greeting
   - Say: "Hello"
   - AI should respond

## Expected Behavior

1. **Tap mic button** → Agent starts
2. **Wait 2-3 seconds** → Hear "Hi! How can I help you study today?"
3. **Speak** → AI listens (mic icon shows)
4. **Wait** → AI responds with speech
5. **Continue conversation** → Back and forth dialogue

## Key Files

- `backend/src/services/agoraService.js` - Agent configuration
- `backend/src/controllers/agoraController.js` - Session management
- `flutter_app/lib/services/agora_service.dart` - Flutter Agora integration
- `flutter_app/lib/providers/voice_provider.dart` - Voice state management
- `backend/.env` - API keys and configuration

## Support

If you've tried everything and it still doesn't work:
1. Share backend logs
2. Share Flutter logs
3. Share test script results
4. Describe exactly what happens vs what you expect
