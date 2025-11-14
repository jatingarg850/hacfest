# Complete Voice AI Test Guide

## Understanding How It Works

The Agora Conversational AI works like this:

1. **User speaks** → ARES captures audio
2. **ARES converts** speech to text
3. **Gemini processes** the text and generates response
4. **ElevenLabs converts** response to speech
5. **User hears** the AI response

**IMPORTANT**: The AI will NOT speak first! You must speak to it first.

## Step-by-Step Test

### 1. Start Backend
```bash
cd backend
npm run dev
```

Wait for:
```
✅ MongoDB connected successfully
🚀 Server running on port 3000
```

### 2. Start Flutter App
```bash
cd flutter_app
flutter run
```

### 3. Login/Register
- Open app
- Login or register
- Go to home screen

### 4. Start Voice Session
1. **Tap** the large blue microphone button
2. **Wait** for button to turn RED
3. **See** logs show:
   ```
   ✅ Successfully joined channel
   ✅ AI Agent joined: 999
   ```

### 5. SPEAK TO THE AI

**This is the critical step!**

Say clearly and loudly:
```
"Hello, can you help me?"
```

**Wait 3-5 seconds** for response.

### 6. What Should Happen

1. Your voice is captured
2. Sent to ARES (speech-to-text)
3. Text sent to Gemini
4. Gemini generates response
5. Response sent to ElevenLabs
6. You HEAR the AI speak back

## Troubleshooting

### Issue: No Response After Speaking

**Check Backend Logs:**
Should show agent activity when you speak.

**Check Flutter Logs:**
```bash
adb logcat | grep flutter
```

Look for audio volume indicators.

### Issue: Can't Hear AI

**Check Device Volume:**
- Turn up media volume
- Not ringer volume!

**Check Audio Output:**
- Make sure speaker is working
- Try with headphones

### Issue: AI Says "I didn't catch that"

**Speak Louder:**
- Get closer to microphone
- Speak clearly
- Reduce background noise

**Try Simple Phrases:**
- "Hello"
- "Help me"
- "What is your name"

## Test Commands

### Test 1: Simple Greeting
```
YOU: "Hello"
AI: "Hello! I am your Study AI assistant. How can I help you today?"
```

### Test 2: Question
```
YOU: "What is photosynthesis?"
AI: [Explains photosynthesis]
```

### Test 3: Navigation
```
YOU: "Go to quiz"
AI: [Confirms and app navigates]
```

## Debug Mode

### Enable Verbose Logging

In backend, add this to see all activity:
```javascript
// In agoraService.js
console.log('📊 Full payload:', JSON.stringify(payload, null, 2));
```

### Check Agent Status

While voice session is active, run:
```bash
cd backend
node test-voice-simple.js
```

This will show if agent is actually running.

## Common Mistakes

❌ **Waiting for AI to speak first** - AI won't speak until you do!
❌ **Speaking too quietly** - Speak clearly and loudly
❌ **Not waiting long enough** - First response takes 3-5 seconds
❌ **Wrong volume** - Check media volume, not ringer
❌ **Background noise** - Find quiet place

## Success Checklist

- [ ] Backend running
- [ ] App installed with permissions
- [ ] Microphone button turns RED
- [ ] Agent joins (UID 999)
- [ ] YOU SPEAK FIRST
- [ ] Wait 3-5 seconds
- [ ] Hear AI response
- [ ] Can have conversation

## Expected Timeline

```
0s  - Tap button
1s  - Button turns red
2s  - Agent joins
3s  - YOU SPEAK: "Hello"
6s  - AI RESPONDS: "Hello! I am..."
8s  - Conversation continues
```

## Still Not Working?

### Test Microphone
Record a voice memo on your device to verify mic works.

### Test Speaker
Play music to verify speaker works.

### Test Backend
```bash
cd backend
node test-agora.js
```

Should show all APIs working.

### Check API Keys
Verify in `.env`:
- GEMINI_API_KEY is valid
- ELEVENLABS_API_KEY is valid
- AGORA credentials are correct

### Restart Everything
1. Stop backend (Ctrl+C)
2. Stop app (Ctrl+C)
3. Restart backend
4. Restart app
5. Try again

## Pro Tips

✅ **Speak naturally** - Don't shout, just speak clearly
✅ **Wait patiently** - First response is slower
✅ **Use headphones** - Better audio quality
✅ **Quiet room** - Less background noise
✅ **Close to mic** - Within 30cm of device

Your Voice AI should now work! 🎉🎤
