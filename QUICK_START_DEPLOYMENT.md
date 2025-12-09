# Quick Start: Deploy DrPlantes to Railway

Follow these steps to get your app deployed and testable in ~15 minutes.

## Step 1: Push Code to GitHub (if not already done)

```bash
cd /Users/xavi.zanatta/Documents/DrPlantes
git init
git add .
git commit -m "Initial commit - DrPlantes app"
git branch -M main
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/DrPlantes.git
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your repositories
4. Select your "DrPlantes" repository
5. Railway will detect it as a Node.js project

### 2.3 Configure Root Directory
1. In Railway project settings, set **Root Directory** to: `backend`
2. This tells Railway to deploy only the backend folder

### 2.4 Add PostgreSQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create the database

### 2.5 Set Environment Variables
Click on your backend service → Variables tab, and add:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<generate-with-openssl-rand-base64-32>
JWT_REFRESH_EXPIRES_IN=30d
API_PREFIX=api
API_VERSION=v1
CORS_ORIGIN=*
THROTTLE_TTL=60
THROTTLE_LIMIT=100
LOG_LEVEL=info
```

**Generate secure secrets:**
```bash
openssl rand -base64 32
```

Railway automatically provides database variables through `${{Postgres.VARIABLE}}` references.

### 2.6 Deploy!
1. Click "Deploy" (or wait for auto-deploy)
2. Monitor the deploy logs
3. Once deployed, click "Settings" → "Networking" → "Generate Domain"
4. Your API will be live at: `https://your-project.up.railway.app`

### 2.7 Test Your Deployed API
Visit: `https://your-project.up.railway.app/api/docs`

You should see the Swagger documentation!

## Step 3: Update Mobile App API URL

1. Edit `mobile/src/config/env.ts`
2. Update the `prod` configuration with your Railway URL:

```typescript
const ENV = {
  dev: {
    apiUrl: getLocalApiUrl(),
    environment: 'development',
  },
  staging: {
    apiUrl: 'https://your-project.up.railway.app/api/v1',  // Update this
    environment: 'staging',
  },
  prod: {
    apiUrl: 'https://your-project.up.railway.app/api/v1',  // Update this
    environment: 'production',
  },
};
```

3. Commit and push:
```bash
git add mobile/src/config/env.ts
git commit -m "Update API URLs for production"
git push
```

## Step 4: Build Mobile App for Testing

### 4.1 Install EAS CLI
```bash
npm install -g eas-cli
```

### 4.2 Login to Expo
```bash
cd mobile
eas login
```

### 4.3 Configure EAS
```bash
eas build:configure
```

This creates/updates `eas.json` (already created for you).

### 4.4 Update EAS Config with Railway URL
Edit `mobile/eas.json` and replace `PLACEHOLDER_FOR_RAILWAY_URL` with your actual Railway URL.

### 4.5 Build Android APK
```bash
eas build --platform android --profile preview
```

This will:
- Ask you to create an Expo project (say yes)
- Build your app in the cloud (takes ~5-10 minutes)
- Provide a download link for the APK

### 4.6 Share with Testers
1. Download the APK from the link EAS provides
2. Share the APK file with testers
3. They can install it directly on Android devices (may need to enable "Unknown Sources")

## Step 5: Optional - Seed Database

If you want to add plant species data:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed script
railway run npm run seed --path backend
```

## Quick Commands Reference

### Railway CLI
```bash
# View logs
railway logs --path backend

# Connect to database
railway connect Postgres

# Run migrations
railway run npm run migration:run --path backend
```

### EAS CLI
```bash
# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile preview
```

## Troubleshooting

### Build Fails on Railway
- Check logs in Railway dashboard
- Ensure `backend/railway.json` and `backend/nixpacks.toml` are present
- Verify all dependencies are in `package.json`

### Database Connection Issues
- Ensure PostgreSQL service is running
- Check that database variables are set
- Railway automatically configures DATABASE_URL

### Mobile App Build Fails
- Ensure you're logged into Expo: `eas login`
- Check `app.json` for valid bundle identifiers
- Verify `eas.json` configuration

### CORS Errors
- Update `CORS_ORIGIN` in Railway environment variables
- Set to `*` for testing, or specific domain for production

## Support Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- PostgreSQL on Railway: https://docs.railway.app/databases/postgresql

## Estimated Costs

- **Railway**: $5 free credit/month (enough for testing)
- **EAS Build**: Free for limited builds, $29/month for unlimited
- **Expo Account**: Free

Your backend should cost ~$3-5/month with light usage.

---

## Next Steps After Deployment

1. Update CORS to specific domains (not `*`)
2. Set up monitoring/alerts in Railway
3. Configure custom domain (optional)
4. Set up CI/CD for automatic deployments
5. Add error tracking (Sentry, etc.)
6. Set up backup strategy for database

Good luck with your deployment! 🚀
