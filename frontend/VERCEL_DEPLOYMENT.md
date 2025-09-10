# Task Manager Frontend - Vercel Deployment

## Deploy to Vercel (Recommended for Frontend)

### Step 1: Prepare Your Repository
Ensure your code is pushed to GitHub with the correct structure:
```
frontend/
├── package.json
├── vite.config.ts
├── vercel.json
├── index.html
└── src/
    └── main.tsx
```

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the deployment:

**Project Settings:**
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm ci`

**Environment Variables:**
Add these in Vercel dashboard:
```
VITE_API_URL=https://your-render-backend.onrender.com
VITE_APP_NAME=Task Manager
```

### Step 3: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS settings as instructed

### Step 4: Update Backend CORS
After deployment, update your backend environment variables:
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Troubleshooting 404 Errors

### Issue 1: Router 404s (Page Refresh)
- **Cause**: SPA routing not configured for Vercel
- **Solution**: Ensure `vercel.json` has correct rewrites (already fixed)

### Issue 2: API 404s
- **Cause**: Incorrect API URL
- **Solution**: Update `VITE_API_URL` environment variable

### Issue 3: Build Failures
- **Cause**: TypeScript errors or missing dependencies
- **Solution**: Fix TypeScript errors locally first

## Testing Your Deployment
1. Visit your Vercel URL
2. Test login/register functionality
3. Check browser console for errors
4. Verify API calls are reaching your backend
