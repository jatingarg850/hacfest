# Deployment Guide

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create study-ai-backend
```

4. **Add MongoDB Atlas**
```bash
heroku addons:create mongolab:sandbox
```

5. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set AGORA_APP_ID=dcec8fd34e6e4144825fe891dab5e89f
heroku config:set AGORA_APP_CERTIFICATE=87f9d15c4d2d451ba72de6f1fd35d080
heroku config:set AGORA_CUSTOMER_ID=f2551165edac4d0e8e13275a0e4aa571
heroku config:set AGORA_CUSTOMER_SECRET=71d77a71920840e5b5a85c302e3a0ee1
heroku config:set GEMINI_API_KEY=AIzaSyDm8rgqo2RszYITrIguWOmARLvj4Zk9dO0
heroku config:set ELEVENLABS_API_KEY=eca558fed6e5d30ae718ef070535ad4c03dbc33fbc4affd28403e013b6596f1e
```

6. **Deploy**
```bash
git push heroku main
```

### Option 2: DigitalOcean

1. **Create Droplet** (Ubuntu 22.04)

2. **SSH into Server**
```bash
ssh root@your_server_ip
```

3. **Install Node.js & MongoDB**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb
```

4. **Clone Repository**
```bash
git clone your_repo_url
cd backend
npm install
```

5. **Setup PM2**
```bash
npm install -g pm2
pm2 start server.js --name study-ai
pm2 startup
pm2 save
```

6. **Configure Nginx**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/study-ai
```

Add:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/study-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Flutter App Deployment

### Android (Google Play Store)

1. **Generate Keystore**
```bash
keytool -genkey -v -keystore ~/study-ai-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias study-ai
```

2. **Configure Signing**
Create `android/key.properties`:
```properties
storePassword=your_password
keyPassword=your_password
keyAlias=study-ai
storeFile=/path/to/study-ai-key.jks
```

3. **Update build.gradle**
```gradle
android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

4. **Build APK**
```bash
flutter build apk --release
```

5. **Build App Bundle**
```bash
flutter build appbundle --release
```

6. **Upload to Play Console**
- Go to Google Play Console
- Create new app
- Upload app bundle
- Fill in store listing
- Submit for review

### iOS (App Store)

1. **Configure Xcode**
```bash
open ios/Runner.xcworkspace
```

2. **Set Bundle Identifier**
- Select Runner in Xcode
- Change Bundle Identifier
- Select Team

3. **Build Archive**
```bash
flutter build ios --release
```

4. **Upload to App Store Connect**
- Open Xcode
- Product → Archive
- Distribute App
- Upload to App Store Connect

5. **Submit for Review**
- Go to App Store Connect
- Fill in app information
- Submit for review

## Environment Configuration

### Production .env
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/study_ai
JWT_SECRET=strong_random_secret_change_this
AGORA_APP_ID=dcec8fd34e6e4144825fe891dab5e89f
AGORA_APP_CERTIFICATE=87f9d15c4d2d451ba72de6f1fd35d080
AGORA_CUSTOMER_ID=f2551165edac4d0e8e13275a0e4aa571
AGORA_CUSTOMER_SECRET=71d77a71920840e5b5a85c302e3a0ee1
AGORA_API_BASE_URL=https://api.agora.io/api/conversational-ai-agent/v2
GEMINI_API_KEY=AIzaSyDm8rgqo2RszYITrIguWOmARLvj4Zk9dO0
ELEVENLABS_API_KEY=eca558fed6e5d30ae718ef070535ad4c03dbc33fbc4affd28403e013b6596f1e
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
ELEVENLABS_MODEL_ID=eleven_flash_v2_5
PUBLIC_SERVER_URL=https://your-domain.com
```

### Flutter Production Config
Update `lib/config/constants.dart`:
```dart
static const String baseUrl = 'https://your-domain.com/api';
static const String socketUrl = 'https://your-domain.com';
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
sudo certbot renew --dry-run
```

## Monitoring

### Backend Monitoring
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs study-ai

# Status
pm2 status
```

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/student_app" --out=/backup/

# Restore
mongorestore --uri="mongodb://localhost:27017/student_app" /backup/
```

## Performance Optimization

### Backend
- Enable gzip compression
- Use Redis for caching
- Implement rate limiting
- Optimize database queries
- Use CDN for static assets

### Flutter
- Enable code splitting
- Optimize images
- Use cached network images
- Implement lazy loading
- Minimize app size

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables
- [ ] Enable firewall
- [ ] Regular security audits

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple backend instances
- Use MongoDB replica set
- Implement Redis for session storage

### Vertical Scaling
- Upgrade server resources
- Optimize database indexes
- Use connection pooling
- Enable caching

## Maintenance

### Regular Tasks
- Monitor server logs
- Check error rates
- Update dependencies
- Backup database
- Review security
- Monitor API usage
- Check Agora usage/billing

### Updates
```bash
# Backend
cd backend
npm update
npm audit fix

# Flutter
cd flutter_app
flutter upgrade
flutter pub upgrade
```

## Troubleshooting

### Common Issues

**Backend not starting**
- Check MongoDB connection
- Verify environment variables
- Check port availability

**Voice not working**
- Verify Agora credentials
- Check microphone permissions
- Test network connectivity

**App crashes**
- Check logs: `pm2 logs`
- Verify API endpoints
- Check database connection

## Support

For deployment issues:
- Check server logs
- Verify environment variables
- Test API endpoints
- Review Agora console
- Check MongoDB Atlas dashboard
