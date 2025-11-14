# Troubleshooting Guide

## Flutter Build Issues

### Gradle Version Errors
**Error**: "Flutter support for your project's Gradle version will soon be dropped"

**Solution**: Already fixed! We're using Gradle 8.7 and AGP 8.1.1

### Package Errors
**Error**: "package attribute in AndroidManifest.xml is no longer supported"

**Solution**: Already fixed! Removed package attribute and using namespace in build.gradle

### Asset Errors
**Error**: "unable to find directory entry in pubspec.yaml"

**Solution**: Already fixed! Removed non-existent asset directories

---

## Backend Issues

### MongoDB Connection Failed
**Error**: "MongoDB connection error"

**Solutions**:
1. Make sure MongoDB is running:
   ```bash
   mongod
   ```

2. Check MongoDB is listening on port 27017:
   ```bash
   # Windows
   netstat -ano | findstr :27017
   ```

3. Verify connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/student_app
   ```

### Port Already in Use
**Error**: "Port 3000 is already in use"

**Solutions**:
1. Kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change port in `.env`:
   ```
   PORT=3001
   ```

### Module Not Found
**Error**: "Cannot find module"

**Solution**:
```bash
cd backend
rm -rf node_modules
npm install
```

---

## Flutter App Issues

### Cannot Connect to Backend
**Error**: "Network error" or "Connection refused"

**Solutions**:

1. **Using Android Emulator**:
   - Use `192.168.0.116` instead of `localhost`
   - Already configured in `lib/config/constants.dart`

2. **Using Physical Device**:
   - Find your computer's IP:
     ```bash
     # Windows
     ipconfig
     # Look for IPv4 Address
     ```
   - Update `lib/config/constants.dart`:
     ```dart
     static const String baseUrl = 'http://YOUR_IP:3000/api';
     ```
   - Make sure device and computer are on same WiFi

3. **Check Backend is Running**:
   ```bash
   curl http://localhost:3000/health
   ```

### Microphone Permission Denied
**Error**: "Microphone permission denied"

**Solutions**:
1. Go to device Settings → Apps → Study AI → Permissions
2. Enable Microphone permission
3. Restart the app

### Agora Connection Failed
**Error**: "Failed to join channel"

**Solutions**:
1. Check internet connection
2. Verify Agora credentials in backend `.env`
3. Check Agora console for any issues
4. Make sure backend is running

---

## Voice AI Issues

### AI Not Responding
**Symptoms**: Button turns red but no voice response

**Solutions**:
1. Check backend logs for errors
2. Verify Gemini API key is valid
3. Check ElevenLabs API key
4. Ensure internet connection is stable

### Voice Quality Issues
**Symptoms**: Choppy or distorted audio

**Solutions**:
1. Check internet speed (minimum 1 Mbps)
2. Close other apps using microphone
3. Try different network
4. Reduce background noise

### Intent Classification Not Working
**Symptoms**: Navigation commands don't work

**Solutions**:
1. Speak clearly and slowly
2. Use exact commands like "Go to quiz"
3. Check backend logs for intent classification
4. Verify Gemini API is responding

---

## Database Issues

### No Quizzes Available
**Solution**: Seed the database
```bash
cd backend
npm run seed
```

### Data Not Saving
**Solutions**:
1. Check MongoDB is running
2. Verify user is authenticated
3. Check backend logs for errors
4. Ensure JWT token is valid

---

## Common Error Messages

### "Failed to apply plugin"
**Solution**: Clean and rebuild
```bash
cd flutter_app
flutter clean
flutter pub get
flutter run
```

### "Execution failed for task"
**Solution**: 
1. Check Android SDK is installed
2. Update Android Studio
3. Run `flutter doctor` to check setup

### "Unable to resolve dependency"
**Solution**:
```bash
cd flutter_app
flutter pub cache repair
flutter pub get
```

### "Gradle build failed"
**Solution**:
```bash
cd android
./gradlew clean
cd ..
flutter run
```

---

## Performance Issues

### App is Slow
**Solutions**:
1. Run in release mode:
   ```bash
   flutter run --release
   ```
2. Clear app cache
3. Restart device
4. Check device storage

### Backend is Slow
**Solutions**:
1. Add database indexes
2. Optimize queries
3. Use caching
4. Check server resources

---

## Development Tips

### Hot Reload Not Working
**Solution**: Press `r` in terminal or restart app

### Changes Not Reflecting
**Solution**:
```bash
flutter clean
flutter pub get
flutter run
```

### Debug Mode
**Enable verbose logging**:
```bash
# Backend
NODE_ENV=development npm run dev

# Flutter
flutter run --verbose
```

---

## Getting Help

### Check Logs

**Backend Logs**:
```bash
cd backend
npm run dev
# Watch console output
```

**Flutter Logs**:
```bash
flutter logs
```

**Agora Logs**:
- Check Agora Console
- View session history
- Check usage statistics

### Verify Setup

**Backend Health Check**:
```bash
curl http://localhost:3000/health
```

**Test API Endpoint**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Flutter Doctor**:
```bash
flutter doctor -v
```

---

## Still Having Issues?

1. Check all environment variables in `.env`
2. Verify all API keys are valid
3. Ensure all dependencies are installed
4. Try on a different device/emulator
5. Check firewall settings
6. Review error logs carefully

## Quick Reset

If nothing works, try a complete reset:

```bash
# Backend
cd backend
rm -rf node_modules
npm install
npm run dev

# Flutter
cd flutter_app
flutter clean
flutter pub get
flutter run
```

This should resolve most issues!
