# Where to See the Conversation

## Quick Answer

**Backend Console:** Shows agent status only (not conversation)  
**Flutter Console:** Shows audio events (AI speaking, user speaking)  
**Conversation Content:** Not available by default (see workarounds below)

## Backend Console (Node.js)

### What You See ✅

```
🎙️ Starting Agora AI agent...
✅ Agent created successfully!
Agent ID: A42AK68EE47AJ78TV66AC64VM56TD28V
Status: RUNNING

═══════════════════════════════════════════════════════════
🎤 AGENT IS NOW LIVE AND LISTENING
═══════════════════════════════════════════════════════════

What happens next:
  1. User speaks → ASR transcribes to text
  2. Text → Gemini LLM processes
  3. Gemini response → ElevenLabs TTS
  4. TTS audio → Plays to user

⚠️  NOTE: Conversation content is NOT sent to this backend.
   The dialogue happens directly in the Agora RTC channel.

✅ Agent is fully operational and ready!

💬 CONVERSATION IS HAPPENING NOW (if user is speaking)
   Check Flutter app logs to see audio state changes
```

### What You DON'T See ❌

- User speech text
- AI response text
- Conversation history
- Real-time dialogue

## Flutter Console (Dart)

### What You See ✅

```
🔄 Reinitializing Agora for clean state...
✅ Agora RTC Engine initialized successfully
📡 Requesting voice session from backend...
✅ Backend response received
🔗 Joining Agora channel...
✅ Successfully joined channel

🔊 Setting up audio for AI agent...
✅ USER JOINED EVENT: UID=999
🔊 Unmuting UID 999 immediately...
✅ Audio fully enabled for UID 999

🔊 REMOTE AUDIO STATE CHANGED:
   UID: 999
   State: remoteAudioStateDecoding
   
✅ AI IS SPEAKING! Audio decoding...

🔊 Audio detected! Volume: 44
```

### What This Means

- `USER JOINED EVENT: UID=999` → AI agent joined the channel
- `remoteAudioStateDecoding` → AI is speaking
- `Audio detected! Volume: 44` → Audio is playing

## How to See Actual Conversation

### Option 1: Add Flutter Logging (Recommended)

Add this to your Flutter app to log when AI speaks:

```dart
// In voice_provider.dart
onRemoteAudioStateChanged: (connection, remoteUid, state, reason, elapsed) {
  if (state == RemoteAudioState.remoteAudioStateDecoding) {
    debugPrint('🤖 AI is speaking now!');
    // You could send this to your backend:
    // _api.post('/log-event', { type: 'ai_speaking', timestamp: DateTime.now() });
  }
}
```

### Option 2: Create LLM Proxy (Advanced)

Create a proxy server that logs all LLM requests:

```javascript
// proxy-server.js
app.post('/gemini-proxy', async (req, res) => {
  // Log the request
  console.log('👤 USER:', req.body.contents[0].parts[0].text);
  
  // Forward to Gemini
  const response = await axios.post(GEMINI_URL, req.body);
  
  // Log the response
  console.log('🤖 AI:', response.data);
  
  // Return to agent
  res.json(response.data);
});
```

Then update agent config:
```javascript
llm: {
  url: "https://your-proxy.com/gemini-proxy",
  // ...
}
```

**Downside:** Adds latency and complexity

### Option 3: Use Agora Analytics (If Available)

Check if your Agora plan includes conversation analytics:
- Agora Console → Analytics
- May show session metrics
- Usually doesn't include full transcripts

## Recommended Setup

### For Development

**Terminal 1: Backend**
```bash
cd backend
npm start
```
Watch for: Agent status, errors

**Terminal 2: Flutter**
```bash
cd flutter_app
flutter run
```
Watch for: Audio events, user interactions

### For Production

**Track Metrics:**
```javascript
// In your backend
app.post('/api/voice/stop', async (req, res) => {
  const session = await VoiceSession.findById(req.body.sessionId);
  const duration = (Date.now() - session.createdAt) / 1000;
  
  console.log('📊 Session Complete:');
  console.log('  User:', session.userId);
  console.log('  Duration:', duration, 'seconds');
  console.log('  Agent ID:', session.agentId);
  
  // Store metrics in database
  await SessionMetrics.create({
    userId: session.userId,
    duration,
    timestamp: new Date()
  });
});
```

## Visual Guide

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S DEVICE                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Flutter App (Voice Chat)                │   │
│  │                                                  │   │
│  │  🎤 User speaks                                  │   │
│  │  👂 Hears AI response                           │   │
│  │                                                  │   │
│  │  ✅ CAN SEE: Audio events, state changes        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Agora RTC Channel
                          │ (Real-time audio)
                          │
┌─────────────────────────────────────────────────────────┐
│              AGORA CONVERSATIONAL AI                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  AI Agent (UID 999)                             │   │
│  │                                                  │   │
│  │  1. ASR: Speech → Text                          │   │
│  │  2. LLM: Text → Response (Gemini)               │   │
│  │  3. TTS: Response → Speech (ElevenLabs)         │   │
│  │                                                  │   │
│  │  ❌ DOES NOT send conversation to backend       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ REST API
                          │ (Start/Stop only)
                          │
┌─────────────────────────────────────────────────────────┐
│                  YOUR BACKEND                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Node.js Server                                 │   │
│  │                                                  │   │
│  │  ✅ CAN SEE:                                     │   │
│  │    - Agent started                              │   │
│  │    - Agent stopped                              │   │
│  │    - Agent status                               │   │
│  │    - Session metadata                           │   │
│  │                                                  │   │
│  │  ❌ CANNOT SEE:                                  │   │
│  │    - User speech                                │   │
│  │    - AI responses                               │   │
│  │    - Conversation content                       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Summary Table

| Information | Backend | Flutter | Available? |
|------------|---------|---------|------------|
| Agent starts | ✅ Yes | ✅ Yes | Yes |
| Agent stops | ✅ Yes | ✅ Yes | Yes |
| Agent status | ✅ Yes | ✅ Yes | Yes |
| User speaks (audio) | ❌ No | ✅ Yes | Yes |
| User speech (text) | ❌ No | ❌ No | No* |
| AI response (text) | ❌ No | ❌ No | No* |
| AI speaks (audio) | ❌ No | ✅ Yes | Yes |
| Session duration | ✅ Yes | ✅ Yes | Yes |
| Audio quality | ❌ No | ✅ Yes | Yes |

*Unless you implement custom logging or proxy

## Conclusion

**Backend console shows:**
- Agent lifecycle events
- Configuration details
- Status updates

**Flutter console shows:**
- Audio events
- User interactions
- Real-time state changes

**Conversation content:**
- Not available by default
- Happens in Agora RTC channel
- Requires custom implementation to log

For most use cases, monitoring **agent status** (backend) and **audio events** (Flutter) is sufficient.
