# Task Manager Backend - Render Deployment

## Deploy to Render (Recommended for Backend)

### Step 1: Prepare Your Repository
Ensure your code is pushed to GitHub with the correct structure:
```
backend/
├── package.json
├── tsconfig.json
├── src/
│   └── server.ts
└── .env (for local development only)
```

### Step 2: Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the deployment:

**Basic Settings:**
- Name: `task-manager-backend`
- Region: `Oregon (US West)`
- Branch: `master` (or your main branch)
- Root Directory: `backend`

**Build & Deploy Settings:**
- Runtime: `Node`
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`

**Environment Variables:**
Add these in Render dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://taskmanager_user:HQLhtOYc6a4uUys0@clusterchinmay.subcr1f.mongodb.net/?retryWrites=true&w=majority&appName=ClusterChinmay
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 3: Health Check
Once deployed, test: `https://your-app.onrender.com/api/health`

## Common Issues & Solutions

### Issue 1: "package.json not found"
- **Cause**: Render is looking in wrong directory
- **Solution**: Set Root Directory to `backend` in Render settings

### Issue 2: "Module not found" errors
- **Cause**: Dependencies not installed properly
- **Solution**: Use `npm ci` instead of `npm install` in build command

### Issue 3: TypeScript compilation errors
- **Cause**: Missing dev dependencies in production
- **Solution**: Ensure TypeScript is in dependencies, not devDependencies
