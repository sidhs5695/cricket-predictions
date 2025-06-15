# 🏏 Cricket Predictions App

A full-stack web application for collecting and tracking cricket predictions from friends.

## 🚀 Features

- Submit cricket predictions with 6 different categories
- Real-time predictions display with expandable details
- Mobile-responsive design
- Admin outcome tracking (correct/incorrect/pending)
- MongoDB Atlas cloud database
- Duplicate prevention (one prediction per Twitter handle)

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript, Vite, CSS
- **Backend**: Node.js + Express, JavaScript
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)

## 📱 Local Development

### Backend Setup
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## 🌐 Deployment Guide

### 1. Deploy Backend (Railway - Recommended)

1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Link your GitHub account
3. **Create New Project**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder
4. **Environment Variables**: Add these in Railway dashboard:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://cricketpredictions:gUc1ki2yvjT3G4Ft@cluster0.yleo2aj.mongodb.net/predictions?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=production
   ```
5. **Deploy**: Railway will automatically deploy your backend

### 2. Deploy Frontend (Vercel - Recommended)

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)
2. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Set **Root Directory** to `frontend`
3. **Environment Variables**: Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app
   ```
4. **Build Settings**: Vercel auto-detects Vite settings
5. **Deploy**: Vercel will build and deploy your frontend

### 3. Update Frontend API URL

After backend deployment, update the API URL in your frontend:

```typescript
// In frontend/src/App.tsx, replace:
const API_URL = 'http://localhost:5000';
// With:
const API_URL = process.env.VITE_API_URL || 'https://your-railway-backend-url.railway.app';
```

## 🔧 Alternative Deployment Options

### Backend Alternatives:
- **Render**: Similar to Railway, free tier available
- **Heroku**: Paid plans only
- **DigitalOcean App Platform**: $5/month minimum

### Frontend Alternatives:
- **Netlify**: Similar to Vercel, free tier
- **GitHub Pages**: Free but requires build setup
- **Firebase Hosting**: Free tier available

## 📊 Database

Using MongoDB Atlas free tier (512MB storage):
- **Cluster**: Already configured
- **Connection**: Included in environment variables
- **Collections**: `cricketpredictions`

## 🔐 Security Notes

- No user authentication (by design for simplicity)
- Edit/delete functionality removed from frontend
- Admin outcome updates available via API
- MongoDB credentials in environment variables

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- iOS zoom prevention
- Mobile-first layout on small screens

## 🎯 Usage

1. Users visit the deployed frontend URL
2. Fill out cricket prediction form
3. Submit predictions (one per Twitter handle)
4. View all predictions in expandable cards
5. Admin can mark outcomes via API calls

## 🚀 Quick Deploy Commands

```bash
# Backend (Railway CLI)
railway login
railway link
railway up

# Frontend (Vercel CLI)
npm i -g vercel
vercel --cwd frontend
```

## 📞 Support

For deployment issues:
- Check Railway/Vercel logs
- Verify environment variables
- Ensure MongoDB Atlas network access
- Test API endpoints manually 