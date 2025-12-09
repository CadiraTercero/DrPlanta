# DrPlantes Deployment Guide

## Railway Backend Deployment

### Prerequisites
1. Create a Railway account at https://railway.app
2. Install Railway CLI (optional): `npm install -g @railway/cli`
3. Push your code to GitHub (Railway will connect to your repo)

### Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select the `DrPlantes` repository
5. Railway will detect it's a Node.js project

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database and set the `DATABASE_URL` variable

### Step 3: Configure Environment Variables

In your Railway backend service, add these environment variables:

```
NODE_ENV=production
PORT=3000

# Railway automatically provides DATABASE_URL, but you can also set individual vars:
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# JWT Configuration (IMPORTANT: Change these!)
JWT_SECRET=your-production-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-production-refresh-secret-minimum-32-characters
JWT_REFRESH_EXPIRES_IN=30d

# API Configuration
API_PREFIX=api
API_VERSION=v1

# CORS Configuration - Update with your deployed mobile app URL
CORS_ORIGIN=*

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=info
```

**Important Security Notes:**
- Generate strong JWT secrets using: `openssl rand -base64 32`
- Update CORS_ORIGIN with your actual mobile app URL once deployed
- Never commit these secrets to Git

### Step 4: Deploy Backend

1. Railway will automatically deploy from your `main` branch
2. Click "Deploy" if it doesn't start automatically
3. Wait for the build to complete (usually 2-5 minutes)
4. Once deployed, Railway will provide you with a public URL like:
   `https://drplantes-backend-production.up.railway.app`

### Step 5: Run Database Migrations (if needed)

If you have migrations, you can run them using Railway CLI:

```bash
railway login
railway link
railway run npm run migration:run
```

Or add a migration command in Railway's deploy settings.

### Step 6: Seed Database (Optional)

To add plant species data:

```bash
railway run npm run seed
```

### Step 7: Test Your Deployed API

Visit your API documentation at:
```
https://your-railway-url.up.railway.app/api/docs
```

Test the health endpoint:
```
https://your-railway-url.up.railway.app/api/v1/health
```

---

## Mobile App Configuration

### Update API URL in Mobile App

1. Open `mobile/src/config/api.ts` (or wherever your API URL is configured)
2. Update the base URL to your Railway deployment:

```typescript
export const API_BASE_URL = 'https://your-railway-url.up.railway.app/api/v1';
```

3. Commit and push these changes

---

## Expo Mobile App Deployment

### Option 1: Expo Go (Quick Testing)

For quick testing with Expo Go app:

```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas update
```

Then share the QR code with testers who have Expo Go installed.

### Option 2: EAS Build (Recommended)

Build standalone apps for Android/iOS:

#### Configure EAS

```bash
cd mobile
eas build:configure
```

This creates `eas.json` with build configurations.

#### Build Android APK

```bash
eas build --platform android --profile preview
```

This will:
- Build your app in the cloud
- Generate an APK file
- Provide a download link

Share the APK with testers (they can install directly on Android devices).

#### Build for iOS (requires Apple Developer account - $99/year)

```bash
eas build --platform ios --profile preview
```

### Option 3: Over-The-Air (OTA) Updates

After initial build, push updates without rebuilding:

```bash
cd mobile
eas update --branch preview
```

---

## Monitoring & Maintenance

### Railway Dashboard

- View logs in real-time
- Monitor CPU/Memory usage
- Set up usage alerts
- Configure custom domains

### Useful Railway Commands

```bash
# View logs
railway logs

# Connect to PostgreSQL
railway connect Postgres

# Run commands in production
railway run <command>

# Restart service
railway restart
```

---

## Troubleshooting

### Build Fails

1. Check Railway logs for specific errors
2. Ensure all dependencies are in `package.json` (not just `devDependencies`)
3. Verify Node version compatibility

### Database Connection Issues

1. Verify DATABASE_URL is set correctly
2. Check SSL configuration (should be enabled for Railway)
3. Ensure PostgreSQL service is running

### CORS Errors from Mobile App

1. Update `CORS_ORIGIN` environment variable
2. Add your deployed mobile app URL
3. Redeploy the backend

---

## Estimated Costs

### Railway Free Tier
- $5 free credit per month
- Shared CPU/512MB RAM
- Enough for testing and small user base

### Railway Pro (if needed)
- $20/month
- Better performance
- More resources

---

## Next Steps

1. Deploy backend to Railway
2. Get Railway URL
3. Update mobile app API configuration
4. Build mobile app with EAS
5. Share APK with testers
6. Monitor usage and errors
7. Set up proper JWT secrets
8. Configure CORS properly
9. Set up monitoring/alerts

## Support

- Railway Docs: https://docs.railway.app
- Expo EAS Docs: https://docs.expo.dev/eas/
- Railway Discord: https://discord.gg/railway
