# Voice AI - Quick Reference

## 🚀 Quick Start

```bash
# 1. Test everything
cd backend
node quick-test.js

# 2. Start backend
npm start

# 3. Run Flutter app (in new terminal)
cd flutter_app
flutter run
```

## 🧪 Test Scripts

| Script | Purpose |
|--------|---------|
| `quick-test.js` | Test all components at once |
| `test-gemini.js` | Test Gemini LLM API |
| `test-elevenlabs.js` | Test ElevenLabs TTS |
| `test-agora-voice.js` | Test Agora agent creation |
| `monitor-voice-session.js` | Monitor live session status |

## 📋 Checklist

Before using voice AI:

- [ ] All test scripts pass (`node quick-test.js`)
- [ ] Backend server running (`npm start`)
- [ ] Flutter app running (`flutter run`)
- [ ] Microphone permission granted
- [ ] Device volume turned up

## 🎤 How to Use

1. **Tap** the microphone button (bottom right)
2. **Wait** 2-3 seconds for greeting
3. **Speak** naturally and clearly
4. **Listen** to AI response
5. **Continue** conversation

## 🔍 Debugging

### Check Backend Logs
Look for:
- ✅ Agent created successfully!
- Status: RUNNING

### Check Flutter Logs
Look for:
- ✅ Successfully joined channel
- ✅ AI Agent joined: 999
- ✅ AI is speaking!

### Common Issues

| Issue | Solution |
|-------|----------|
| No greeting | Check device volume, wait 3 seconds |
| No response to voice | Check mic permission, speak clearly |
| Agent fails to start | Run `node quick-test.js` |
| Audio cuts out | Check network connection |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/.env` | API keys and config |
| `backend/src/services/agoraService.js` | Agent configuration |
| `flutter_app/lib/services/agora_service.dart` | Flutter Agora integration |
| `flutter_app/lib/providers/voice_provider.dart` | Voice state management |

## 🔧 Configuration

### Current Setup
- **LLM**: Gemini 2.0 Flash Exp (v1beta)
- **TTS**: ElevenLabs eleven_flash_v2_5
- **ASR**: ARES (en-US)
- **Sample Rate**: 24kHz
- **Max Tokens**: 100

### API Keys Required
- AGORA_APP_ID
- AGORA_APP_CERTIFICATE
- AGORA_CUSTOMER_ID
- AGORA_CUSTOMER_SECRET
- GEMINI_API_KEY
- ELEVENLABS_API_KEY
- ELEVENLABS_VOICE_ID

## 📚 Documentation

- `VOICE_AI_FIXED.md` - Complete fix summary
- `VOICE_TROUBLESHOOTING_GUIDE.md` - Detailed troubleshooting
- `VOICE_FIX_COMPLETE.md` - What was changed

## ✅ Status

All systems operational:
- ✅ Gemini API working
- ✅ ElevenLabs TTS working
- ✅ Agora Agent working
- ✅ Configuration updated
- ✅ All tests passing

## 🆘 Need Help?

1. Run `node quick-test.js`
2. Check logs (backend + Flutter)
3. See `VOICE_TROUBLESHOOTING_GUIDE.md`
4. Verify all API keys in `.env`
