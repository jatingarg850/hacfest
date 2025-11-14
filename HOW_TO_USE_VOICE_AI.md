# How to Use Voice AI - Complete Guide

## ⚠️ IMPORTANT: AI Won't Speak First!

**The AI will NOT greet you automatically!**

Agora Conversational AI works like this:
1. You speak → AI hears → AI responds
2. **NOT**: AI greets → You respond

## Step-by-Step Usage

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start App
```bash
cd flutter_app
flutter run
```

### 3. Login
- Open app
- Login or register

### 4. Start Voice Session
1. Tap the large blue microphone button
2. Wait for button to turn **RED**
3. You should see in logs:
   ```
   ✅ Successfully joined channel
   ✅ AI Agent joined: 999
   🎤 Enabling local audio...
   ✅ Local audio enabled
   🎤 Local audio state: Recording
   ```

### 5. **YOU MUST SPEAK FIRST!**

Say clearly:
```
"Hello, can you help me?"
```

### 6. Wait for Response

- Wait 3-5 seconds
- AI will process your speech
- AI will respond with voice
- You'll hear: "Hello! I am your Study AI assistant..."

### 7. Continue Conversation

You can now have a conversation:
- Ask questions
- Request navigation
- Get explanations

## Example Conversations

### Conversation 1: Greeting
```
YOU: "Hello"
[Wait 3-5 seconds]
AI: "Hello! I am your Study AI assistant. How can I help you today?"
```

### Conversation 2: Question
```
YOU: "What is photosynthesis?"
[Wait 3-5 seconds]
AI: [Explains photosynthesis in detail]
```

### Conversation 3: Navigation
```
YOU: "Go to quiz"
[Wait 2-3 seconds]
AI: "Sure, navigating to quiz section"
[App navigates to quiz]
```

## Troubleshooting

### Issue: No Response After Speaking

**Check Logs:**

Backend should show:
```
🎙️ Starting Agora AI agent...
✅ Agent created successfully!
```

Flutter should show:
```
✅ Successfully joined channel
✅ AI Agent joined: 999
🎤 Local audio state: Recording
```

**If you see "Recording"**, the mic is working!

### Issue: Can't Hear AI

1. **Check device volume** - Turn UP media volume
2. **Try headphones** - Better audio quality
3. **Check speaker** - Play music to test

### Issue: AI Says "I didn't catch that"

1. **Speak louder** - Get closer to mic
2. **Speak clearly** - Enunciate words
3. **Reduce noise** - Find quiet place
4. **Try simple phrases** - "Hello", "Help me"

## Testing Checklist

- [ ] Backend running (npm run dev)
- [ ] App installed and running
- [ ] Microphone permission granted
- [ ] Button turns RED when tapped
- [ ] Logs show "AI Agent joined: 999"
- [ ] Logs show "Local audio state: Recording"
- [ ] **YOU SPEAK FIRST** (don't wait for AI!)
- [ ] Wait 3-5 seconds
- [ ] Hear AI response
- [ ] Can continue conversation

## Common Mistakes

❌ **Waiting for AI to speak first** - AI won't speak until you do!
❌ **Not speaking loud enough** - Speak clearly
❌ **Not waiting long enough** - First response takes 3-5 seconds
❌ **Wrong volume setting** - Check MEDIA volume, not ringer
❌ **Background noise** - Too much noise confuses AI

## Expected Timeline

```
0s  - Tap microphone button
1s  - Button turns RED
2s  - Agent joins (UID 999)
3s  - Local audio starts recording
4s  - YOU SPEAK: "Hello"
7s  - AI processes speech
8s  - AI RESPONDS: "Hello! I am..."
10s - Conversation continues
```

## Voice Commands

### Navigation
- "Go to quiz"
- "Open flashcards"
- "Show me news"
- "Take me to community"
- "Go back home"

### Questions
- "What is [topic]?"
- "Explain [concept]"
- "Help me with [subject]"
- "How do I [task]?"

### Study Planning
- "Create a study plan"
- "What should I study today?"
- "Help me prepare for exam"

## Debug Mode

### Check if Microphone is Working

Look for this in logs:
```
🎤 Local audio state: Recording
```

If you see this, mic is working!

### Check if AI is Hearing You

Backend logs should show activity when you speak.

### Check if AI is Responding

You should hear audio output after 3-5 seconds.

## Pro Tips

✅ **Speak naturally** - Normal conversation tone
✅ **Wait patiently** - First response is slower
✅ **Use headphones** - Better audio quality
✅ **Quiet environment** - Less background noise
✅ **Close to microphone** - Within 30cm
✅ **Speak first** - Don't wait for AI greeting!

## Success Indicators

When everything is working:

1. ✅ Button turns RED
2. ✅ Agent joins (UID 999)
3. ✅ Local audio recording
4. ✅ You speak
5. ✅ AI hears you
6. ✅ AI processes
7. ✅ AI responds
8. ✅ You hear response
9. ✅ Conversation flows

## Still Not Working?

### 1. Verify All APIs
```bash
cd backend
node test-agora.js
```

Should show all ✅

### 2. Check Permissions
```bash
adb shell dumpsys package com.studyai.app | grep RECORD_AUDIO
```

Should show: `granted=true`

### 3. Test Microphone
Record a voice memo on your device to verify mic works.

### 4. Test Speaker
Play music to verify speaker works.

### 5. Restart Everything
1. Stop backend
2. Stop app
3. Restart backend
4. Restart app
5. Try again

## Remember!

🎤 **YOU MUST SPEAK FIRST!**

The AI is listening and waiting for you to say something. It won't greet you automatically. Just tap the button and start talking!

Your Voice AI is ready! 🎉
