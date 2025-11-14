# Complete Reset and Fix

## The Issue

Your voice AI is connecting but not capturing/transmitting audio. This requires a complete reset.

## Complete Fix (Do this in order)

### Step 1: Uninstall Current App

```bash
# Stop the running app
# Press Ctrl+C in the terminal

# Uninstall from device
adb uninstall com.studyai.app
```

### Step 2: Clean Everything

```bash
cd flutter_app

# Clean Flutter
flutter clean

# Clean Gradle
cd android
./gradlew clean
cd ..
```

### Step 3: Get Dependencies

```bash
flutter pub get
```

### Step 4: Rebuild and Install

```bash
flutter run
```

### Step 5: Grant Permissions

When the app opens:
1. It will show permission request screen
2. Tap "Grant Permission"
3. Allow microphone access
4. App will reload

### Step 6: Test Voice AI

1. Login/Register
2. Tap the large blue microphone button
3. Button turns red = connected
4. **Speak clearly**: "Hello, can you help me?"
5. Wait 2-3 seconds
6. AI should respond with voice

## If Still Not Working

### Check Microphone Manually

```bash
# Grant permission manually
adb shell pm grant com.studyai.app android.permission.RECORD_AUDIO

# Verify permission
adb shell dumpsys package com.studyai.app | grep RECORD_AUDIO
```

Should show:
```
android.permission.RECORD_AUDIO: granted=true
```

### Test Microphone on Device

1. Open device Settings
2. Apps → Study AI → Permissions
3. Microphone should be "Allowed"
4. If not, enable it manually

### Check Backend Logs

Backend should show:
```
🎙️ Starting Agora AI agent...
📤 Sending request to Agora...
✅ Agent created successfully!
Agent ID: [ID]
Status: RUNNING
```

### Check Flutter Logs

Flutter should show:
```
✅ Successfully joined channel
✅ AI Agent joined: 999
```

Then you should see audio activity.

## Expected Behavior

When working correctly:

1. **Tap microphone** → Button turns red
2. **Speak** → You see audio volume indicators
3. **Wait 2-3 seconds** → AI processes
4. **Hear response** → AI speaks back
5. **Tap again** → Button turns blue, session ends

## Common Issues

### Issue: "No audio captured"
**Solution**: Uninstall app, reinstall, grant permissions

### Issue: "Agent joins but no response"
**Solution**: Check backend is running, verify API keys

### Issue: "Permission denied"
**Solution**: Grant manually with adb command above

### Issue: "Audio error in logs"
**Solution**: Restart device, try again

## Test Commands

```bash
# Check if app is installed
adb shell pm list packages | grep studyai

# Check permissions
adb shell dumpsys package com.studyai.app | grep permission

# Check audio system
adb shell dumpsys audio | grep "Active"

# View real-time logs
adb logcat | grep flutter
```

## Success Indicators

✅ Permission granted
✅ Agent created
✅ User joined channel
✅ Agent joined (UID 999)
✅ Audio recording active
✅ AI responds with voice

## Final Notes

- Speak clearly and wait for response
- First response may take 3-5 seconds
- Subsequent responses are faster
- Keep device close to mouth
- Quiet environment works best

Your voice AI should now work perfectly! 🎉
