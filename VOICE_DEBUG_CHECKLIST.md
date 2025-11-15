# Voice AI Debug Checklist

## What to Check in Flutter Logs

When you tap the mic button, you should see this sequence:

### 1. Initialization (Should See)
```
🔄 Reinitializing Agora for clean state...
🎙️ Creating Agora RTC Engine...
📝 Setting log level to INFO for debugging...
🔊 Enabling audio...
👤 Setting client role to broadcaster...
🎵 Setting audio profile to MUSIC_STANDARD for better quality...
✅ Agora RTC Engine initialized successfully
✅ Event handler registered
```

### 2. Session Start (Should See)
```
🎙️ Starting voice session...
📡 Requesting voice session from backend...
✅ Backend response received
Channel: study_ai_xxx
Session ID: xxx
Agent ID: xxx
```

### 3. Joining Channel (Should See)
```
🔗 Joining Agora channel...
🔊 Audio route set to speakerphone
🎤 Enabling local audio...
✅ Local audio enabled and remote audio subscription enabled
✅ Successfully joined channel
🔊 Unmute attempt 1 for UID 999
```

### 4. Agent Joins (CRITICAL - Must See This)
```
✅ Successfully joined channel: study_ai_xxx
🔊 Setting up audio for AI agent...
✅ USER JOINED EVENT: UID=999
🔊 Unmuting UID 999 immediately...
✅ Audio fully enabled for UID 999
```

### 5. Audio State Changes (Should See)
```
🔊 REMOTE AUDIO STATE CHANGED:
   UID: 999
   State: remoteAudioStateDecoding
✅ AI IS SPEAKING! Audio decoding...
```

## Common Issues

### Issue 1: No "USER JOINED EVENT: UID=999"
**Problem**: Agent not joining the channel
**Causes**:
- Channel name mismatch
- Token invalid
- Agent failed to start on backend

**Check**:
1. Backend logs show "Agent created successfully"
2. Channel names match exactly
3. Agent UID is 999

### Issue 2: "USER JOINED" but no audio
**Problem**: Audio routing or volume issue
**Causes**:
- Device volume too low
- Audio route not set to speaker
- Remote audio muted

**Check**:
1. Device volume at maximum
2. Look for "Audio route set to speakerphone"
3. Look for "Unmuting UID 999"

### Issue 3: "remoteAudioStateStopped"
**Problem**: Agent not sending audio
**Causes**:
- TTS not working
- LLM not responding
- Agent configuration error

**Check**:
1. Backend shows "Agent is fully operational"
2. ElevenLabs API key valid
3. Gemini API key valid

## Quick Diagnostic Commands

### Check if Agent Joined
Look for in Flutter logs:
```
USER JOINED EVENT: UID=999
```

If NOT found:
- Agent didn't join the channel
- Check backend logs
- Verify channel name matches

### Check Audio State
Look for in Flutter logs:
```
REMOTE AUDIO STATE CHANGED:
   State: remoteAudioStateDecoding
```

If NOT found:
- Agent joined but not speaking
- Check TTS configuration
- Check LLM configuration

### Check Volume
Look for in Flutter logs:
```
Audio detected! Volume: XX
```

If volume is 0:
- No audio being received
- Check unmute attempts
- Check playback volume settings

## What to Share for Debugging

Please share these Flutter log sections:

1. **Initialization logs** (from "Reinitializing" to "initialized")
2. **Join channel logs** (from "Joining Agora channel" to "Successfully joined")
3. **User joined events** (any "USER JOINED EVENT")
4. **Audio state changes** (any "REMOTE AUDIO STATE CHANGED")
5. **Any errors** (lines with ❌)

## Expected vs Actual

### Expected Flow
```
1. Initialize ✓
2. Join channel ✓
3. Agent joins (UID=999) ✓
4. Audio state: Starting ✓
5. Audio state: Decoding ✓
6. Hear greeting ✓
```

### If Stuck at Step 3
- Agent not joining
- Check backend
- Check channel/token

### If Stuck at Step 4
- Agent joined but silent
- Check TTS config
- Check audio routing

### If Stuck at Step 5
- Audio starting but not decoding
- Check device volume
- Check speaker route

## Manual Tests

### Test 1: Check Device Audio
1. Play any other audio (YouTube, music)
2. Verify device speakers work
3. Volume should be audible

### Test 2: Check Microphone
1. Record voice memo
2. Play it back
3. Verify mic works

### Test 3: Check Network
1. Ensure WiFi/4G connected
2. Test with: ping api.agora.io
3. Should have < 100ms latency

### Test 4: Check Permissions
1. Settings > Apps > Your App
2. Verify Microphone permission granted
3. Verify Storage permission granted

## Critical Flutter Code Points

### 1. Audio Route (agora_service.dart line ~105)
```dart
await _engine!.setDefaultAudioRouteToSpeakerphone(true);
```
Must succeed. If fails, audio goes to earpiece.

### 2. Unmute Agent (agora_service.dart line ~145)
```dart
await _engine!.muteRemoteAudioStream(uid: 999, mute: false);
```
Must be called when agent joins.

### 3. Volume Boost (agora_service.dart line ~147)
```dart
await _engine!.adjustPlaybackSignalVolume(400);
```
Boosts volume to 400% for better audibility.

### 4. Event Handler (voice_provider.dart line ~60)
```dart
onUserJoined: (connection, remoteUid, elapsed) async {
  debugPrint('✅ USER JOINED EVENT: UID=$remoteUid');
```
Must fire when agent joins.

## Next Steps

1. **Run the app**
2. **Tap mic button**
3. **Copy ALL Flutter console logs**
4. **Share the logs**
5. **I'll identify the exact issue**

The logs will show exactly where the flow breaks.
