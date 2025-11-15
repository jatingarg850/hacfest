# Complete Voice AI Setup Guide

## ✅ Current Status

**All backend tests passing!**
- ✅ Gemini 2.0 Flash API working
- ✅ ElevenLabs TTS working (enhanced quality)
- ✅ Agora Agent starting successfully
- ✅ Flutter build fixed (Gradle 8.9)
- ✅ Flutter audio configuration optimized

## Configuration Details

### Backend (Node.js)

**LLM: Google Gemini**
- Model: `gemini-2.0-flash`
- API: `v1beta` with SSE streaming
- Temperature: 0.8
- Max Tokens: 100
- Style: gemini (parts-based format)

**TTS: ElevenLabs**
- Model: `eleven_flash_v2_5`
- Voice ID: `nPczCjzI2devNBz1zQrb`
- Sample Rate: 24kHz
- **Enhanced Quality Settings:**
  - Stability: 0.85 (consistent voice)
  - Similarity Boost: 0.9 (closer to original voice)
  - Style: 0.6 (moderate expressiveness)
  - Speed: 1.0 (normal speed)
  - Speaker Boost: true (improved clarity)

**ASR: ARES**
- Vendor: ares (Agora built-in)
- Language: en-US

**Agent Configuration:**
- Agent UID: 999 (fixed)
- Idle Timeout: 300 seconds
- Enable Greeting: true
- Greeting Message: "Hi! How can I help you study today?"

### Flutter (Dart)

**Audio Configuration:**
- Audio Profile: MUSIC_STANDARD (high quality)
- Audio Scenario: GAME_STREAMING (optimized for voice)
- Playback Volume: 400% (boosted)
- Log Level: INFO (verbose debugging)

**Unmute Strategy:**
- 10 aggressive unmute attempts over 5 seconds
- Pre-emptive unmuting for UID 999
- Force unmute on every audio state change
- Multiple delayed attempts (1s, 2s, 3s intervals)

**Initialization:**
- Clean engine release before creating new instance
- Leave existing channel before joining new one
- Reinitialize on each session start

## How to Use

### 1. Test Backend

```bash
cd backend
node quick-test.js
```

**Expected output:**
```
✅ All tests passed! Voice AI is ready to use.
```

### 2. Start Backend Server

```bash
cd backend
npm start
```

**Look for:**
```
🚀 Server running on port 3000
✅ MongoDB connected successfully
```

### 3. Run Flutter App

```bash
cd flutter_app
flutter run
```

**On physical device (recommended):**
```bash
flutter run -d <device-id>
```

### 4. Use Voice Chat

1. **Tap** the large microphone button (bottom right)
2. **Grant** microphone permission if prompted
3. **Wait** 2-3 seconds for initialization
4. **Listen** for: "Hi! How can I help you study today?"
5. **Speak** naturally and clearly
6. **Wait** for AI response

## What to Check

### Backend Logs (Should See)

```
🎙️ Starting Agora AI agent...
📤 Sending configuration to Agora...
✅ Agent created successfully!
Status: RUNNING
⏳ Agent is now listening for user speech...
📊 Agent Status (3s): { "status": "RUNNING" }
✅ Agent is fully operational and ready!
```

### Flutter Logs (Should See)

```
🔄 Reinitializing Agora for clean state...
🎙️ Creating Agora RTC Engine...
✅ Agora RTC Engine initialized successfully
📡 Requesting voice session from backend...
✅ Backend response received
🔗 Joining Agora channel...
✅ Successfully joined channel
🔊 Setting up audio for AI agent...
🔊 Force unmuting UID 999 (1s delay)
✅ USER JOINED EVENT: UID=999
🔊 Unmuting UID 999 immediately...
✅ Audio fully enabled for UID 999
🔊 REMOTE AUDIO STATE CHANGED:
   State: remoteAudioStateDecoding
✅ AI IS SPEAKING! Audio decoding...
```

## Troubleshooting

### Issue: No Audio from AI

**Check:**
1. Device volume at maximum
2. Using physical device (not emulator)
3. Flutter logs show "USER JOINED EVENT: UID=999"
4. Flutter logs show "AI IS SPEAKING!"

**Solutions:**
- Restart Flutter app completely
- Try different physical device
- Check device audio output settings
- Verify ElevenLabs API key is valid

### Issue: Agent Doesn't Join (No UID=999)

**Check:**
1. Backend logs show "Agent created successfully"
2. Channel names match exactly
3. Token is valid

**Solutions:**
- Check backend logs for errors
- Verify Agora credentials in `.env`
- Run `node diagnose-audio.js` for detailed diagnosis

### Issue: Error -17 (ERR_NOT_INITIALIZED)

**This is now fixed!** But if it happens:
- Run `flutter clean`
- Delete app from device
- Reinstall with `flutter run`

### Issue: Gradle Build Error

**Fixed!** Gradle updated to 8.9. If issues persist:
```bash
cd flutter_app/android
./gradlew clean
cd ../..
flutter clean
flutter pub get
flutter run
```

## Testing Scripts

All in `backend/` directory:

| Script | Purpose |
|--------|---------|
| `quick-test.js` | Test all components at once |
| `test-gemini.js` | Test Gemini LLM API |
| `test-elevenlabs.js` | Test ElevenLabs TTS |
| `test-agora-voice.js` | Test Agora agent creation |
| `monitor-voice-session.js` | Monitor live session status |
| `diagnose-audio.js` | Diagnose audio issues |

## API Keys Required

In `backend/.env`:

```env
# Agora
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_certificate
AGORA_CUSTOMER_ID=your_customer_id
AGORA_CUSTOMER_SECRET=your_customer_secret

# Google Gemini
GEMINI_API_KEY=your_gemini_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=your_voice_id
```

## Expected Behavior

### Successful Flow

1. **User taps mic** → Flutter initializes Agora
2. **Backend creates agent** → Agent joins channel with UID 999
3. **Agent speaks greeting** → "Hi! How can I help you study today?"
4. **User speaks** → ASR transcribes to text
5. **Gemini processes** → Generates response text
6. **ElevenLabs synthesizes** → Converts to speech
7. **Agent speaks response** → User hears AI voice
8. **Conversation continues** → Back and forth dialogue

### Timing

- **Initialization**: 1-2 seconds
- **Agent join**: 2-3 seconds
- **Greeting**: 3-5 seconds after tap
- **Response time**: 1-2 seconds per exchange

## Performance Tips

### For Best Audio Quality

1. **Use physical device** (not emulator)
2. **Good network** (WiFi or 4G/5G)
3. **Quiet environment** (for ASR accuracy)
4. **Speak clearly** (not too fast)
5. **Wait for response** (don't interrupt)

### For Faster Responses

1. Keep questions brief
2. Speak clearly and directly
3. Wait 1 second after greeting before speaking
4. Good network connection essential

## Advanced Configuration

### Change Voice

Update in `backend/.env`:
```env
ELEVENLABS_VOICE_ID=<new_voice_id>
```

Browse voices: https://elevenlabs.io/voice-library

### Adjust TTS Quality

In `backend/src/services/agoraService.js`:
```javascript
tts: {
  params: {
    stability: 0.85,        // 0.0-1.0 (higher = more consistent)
    similarity_boost: 0.9,  // 0.0-1.0 (higher = closer to original)
    style: 0.6,             // 0.0-1.0 (higher = more expressive)
    speed: 1.0,             // 0.7-1.2 (1.0 = normal speed)
  }
}
```

### Change System Prompt

In `backend/src/controllers/agoraController.js`:
```javascript
function generateSystemPrompt(user, currentPage) {
  return `Your custom prompt here`;
}
```

## Files Modified

### Backend
- `backend/src/services/agoraService.js` - Enhanced TTS config
- `backend/src/controllers/agoraController.js` - Simplified prompts

### Flutter
- `flutter_app/lib/services/agora_service.dart` - Audio optimization
- `flutter_app/lib/providers/voice_provider.dart` - Enhanced unmuting
- `flutter_app/android/gradle/wrapper/gradle-wrapper.properties` - Gradle 8.9

## Documentation

- `VOICE_AI_FIXED.md` - Complete fix summary
- `FINAL_FIX_SUMMARY.md` - Latest changes
- `VOICE_TROUBLESHOOTING_GUIDE.md` - Detailed debugging
- `QUICK_REFERENCE.md` - Quick reference card

## Support

If issues persist after following this guide:

1. Run `node quick-test.js` - All should pass
2. Check backend logs - Look for errors
3. Check Flutter logs - Look for "UID=999" and "AI IS SPEAKING"
4. Run `node diagnose-audio.js` - Detailed diagnosis
5. Try different physical device
6. Verify all API keys are valid

## Next Steps

Your voice AI is fully configured and tested. Just:

1. `cd backend && npm start`
2. `cd flutter_app && flutter run`
3. Tap mic and start talking!

The AI will greet you and respond naturally to your questions.

---

**Status**: ✅ READY TO USE  
**Last Updated**: Now  
**Test Status**: All passing
