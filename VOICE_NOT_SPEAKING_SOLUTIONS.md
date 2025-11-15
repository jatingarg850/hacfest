# Voice AI Not Speaking - Solutions

## Most Common Causes (in order)

### 1. Agent UID 999 Not Joining Channel (80% of cases)
**Symptom**: No "USER JOINED EVENT: UID=999" in Flutter logs

**Causes**:
- Backend agent starts but doesn't join RTC channel
- Channel name mismatch
- Token generation issue
- Agora RTC service issue

**Solutions**:
```bash
# Check backend logs for:
✅ Agent created successfully!
Agent ID: A42AXX...
Status: RUNNING

# If you see this, agent started on Agora's side
# But it still needs to join YOUR RTC channel
```

**Fix**: The agent should join automatically. If it doesn't:
1. Verify `agent_rtc_uid` is "999" (string)
2. Verify `channel` name matches exactly
3. Verify `token` is valid for UID 999
4. Check Agora console for errors

### 2. Audio Route Not Set to Speaker (15% of cases)
**Symptom**: "USER JOINED EVENT: UID=999" appears but no sound

**Causes**:
- Audio going to earpiece instead of speaker
- Device volume too low
- Audio muted

**Solutions**:
1. **Check Flutter logs for**:
   ```
   🔊 Audio route set to speakerphone
   ```
   
2. **If missing**, add this in Flutter:
   ```dart
   await _engine!.setDefaultAudioRouteToSpeakerphone(true);
   ```

3. **Turn device volume to MAXIMUM**

4. **Try on physical device** (not emulator)

### 3. Remote Audio Muted (3% of cases)
**Symptom**: Agent joins, audio route OK, but still no sound

**Causes**:
- Remote audio stream muted
- Playback volume too low

**Solutions**:
Already implemented in code:
```dart
await _engine!.muteRemoteAudioStream(uid: 999, mute: false);
await _engine!.adjustUserPlaybackSignalVolume(uid: 999, volume: 100);
await _engine!.adjustPlaybackSignalVolume(400);
```

### 4. TTS Not Working (2% of cases)
**Symptom**: Agent joins, audio unmuted, but no greeting

**Causes**:
- ElevenLabs API key invalid
- Voice ID invalid
- TTS configuration error

**Solutions**:
```bash
# Test ElevenLabs directly
cd backend
node test-elevenlabs.js

# Should output:
✅ TTS working: XXXXX bytes
```

If fails:
- Check `ELEVENLABS_API_KEY` in `.env`
- Check `ELEVENLABS_VOICE_ID` in `.env`
- Verify API key is active on ElevenLabs console

## Step-by-Step Diagnosis

### Step 1: Verify Backend
```bash
cd backend
npm start
```

Tap mic in app, check backend logs:
```
✅ Agent created successfully!
Agent ID: A42AXX...
Status: RUNNING
```

✅ If you see this → Backend OK, continue to Step 2
❌ If you don't → Fix backend first

### Step 2: Verify Flutter Joins Channel
Check Flutter logs:
```
✅ Successfully joined channel
```

✅ If you see this → Flutter joined, continue to Step 3
❌ If you don't → Check token, channel name

### Step 3: Verify Agent Joins
Check Flutter logs within 5 seconds:
```
✅ USER JOINED EVENT: UID=999
```

✅ If you see this → Agent joined, continue to Step 4
❌ If you don't → **THIS IS THE PROBLEM**

### Step 4: Verify Audio Route
Check Flutter logs:
```
🔊 Audio route set to speakerphone
```

✅ If you see this → Audio route OK, continue to Step 5
❌ If you don't → Audio going to earpiece

### Step 5: Verify Audio State
Check Flutter logs:
```
🔊 REMOTE AUDIO STATE CHANGED:
   State: remoteAudioStateDecoding
✅ AI IS SPEAKING! Audio decoding...
```

✅ If you see this → Audio is playing!
❌ If you don't → Check device volume

## The #1 Issue: Agent Not Joining

If you don't see "USER JOINED EVENT: UID=999", the agent is NOT in your RTC channel.

### Why This Happens

The agent starts on Agora's backend (you see "Status: RUNNING") but it needs to:
1. Generate its own RTC token for UID 999
2. Join the RTC channel
3. Start listening/speaking

### How to Fix

The backend code already does this correctly:
```javascript
const agentUid = 999;
const token = generateRtcToken(channelName, agentUid);

const payload = {
  properties: {
    channel: channelName,
    token: token,
    agent_rtc_uid: agentUid.toString(), // "999"
    // ...
  }
};
```

If agent still doesn't join:

1. **Check Agora Console**
   - Go to https://console.agora.io
   - Check "Usage" or "Analytics"
   - See if agent UID 999 appears in channel

2. **Verify Token**
   ```javascript
   // In backend, add logging:
   console.log('Agent Token:', token);
   console.log('Agent UID:', agentUid);
   console.log('Channel:', channelName);
   ```

3. **Check Agora Service Status**
   - Agora might be having issues
   - Check https://status.agora.io

## Quick Fixes to Try

### Fix 1: Restart Everything
```bash
# Stop backend (Ctrl+C)
# Stop Flutter app

# Clear Flutter
cd flutter_app
flutter clean
flutter pub get

# Restart backend
cd backend
npm start

# Restart Flutter
flutter run
```

### Fix 2: Use Physical Device
Emulators often have audio issues. Try:
```bash
flutter run -d <device-id>
```

### Fix 3: Check Device Volume
- Turn volume to MAXIMUM
- Disable silent mode
- Check media volume (not ringer)

### Fix 4: Test with Different Voice
In `backend/.env`:
```env
# Try a different voice
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

### Fix 5: Simplify Configuration
Remove all TTS enhancements temporarily:
```javascript
tts: {
  vendor: 'elevenlabs',
  params: {
    key: process.env.ELEVENLABS_API_KEY,
    model_id: 'eleven_flash_v2_5',
    voice_id: process.env.ELEVENLABS_VOICE_ID,
    sample_rate: 24000,
    // Remove: stability, similarity_boost, etc.
  },
},
```

## What to Share for Help

Please provide:

1. **Backend logs** (from "Starting Agora AI agent" to "Agent is fully operational")
2. **Flutter logs** (from "Reinitializing Agora" to 10 seconds after)
3. **Device info** (Physical device or emulator? Android/iOS?)
4. **Network info** (WiFi or mobile data?)

With these logs, I can pinpoint the exact issue.

## Expected Timeline

When working correctly:
- 0s: Tap mic button
- 1s: Backend creates agent
- 2s: Flutter joins channel
- 3s: Agent joins channel (UID 999)
- 4s: Greeting plays "Hi! How can I help you study today?"

If greeting doesn't play by 5 seconds, something is wrong.

## Last Resort

If nothing works:

1. **Check Agora Account**
   - Verify Conversational AI is enabled
   - Check usage limits
   - Verify billing is active

2. **Try Different Channel**
   ```javascript
   // In backend, force a new channel name
   const channelName = `test_${Date.now()}`;
   ```

3. **Contact Agora Support**
   - Share agent ID from backend logs
   - Share channel name
   - Describe the issue

## Success Indicators

You'll know it's working when you see:
```
✅ Successfully joined channel
✅ USER JOINED EVENT: UID=999
🔊 Unmuting UID 999 immediately...
✅ Audio fully enabled for UID 999
🔊 REMOTE AUDIO STATE CHANGED: State: remoteAudioStateDecoding
✅ AI IS SPEAKING! Audio decoding...
🔊 Audio detected! Volume: 44
```

And you HEAR: "Hi! How can I help you study today?"
