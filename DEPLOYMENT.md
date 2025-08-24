# 🚀 Deployment Guide for Render

This guide will help you deploy the AI Todo App backend to Render.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Database**: You'll need a MongoDB database (MongoDB Atlas recommended)
4. **Email Service**: Configure email credentials (Gmail recommended)

## 🔧 Step 1: Prepare Your Environment Variables

Create a `.env` file locally with these variables (you'll add them to Render later):

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-todo-app
JWT_ACCESS_SECRET=your-super-secure-access-secret-key
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
APP_URL=https://your-app-name.onrender.com
FRONTEND_URL=https://your-frontend-url.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Step 2: Set Up MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Replace `username`, `password`, and `cluster` in the MONGODB_URI

## 📧 Step 3: Configure Email Service (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this password in `EMAIL_PASS`

## 🚀 Step 4: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Sign in to Render**:
   - Go to [render.com](https://render.com)
   - Sign in with your GitHub account

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this backend

3. **Configure the Service**:
   - **Name**: `ai-todo-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid for better performance)

4. **Add Environment Variables**:
   - Click on "Environment" tab
   - Add all the variables from your `.env` file
   - Make sure to update `APP_URL` to your Render URL once deployed

5. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your app

### Option B: Using render.yaml (Blue-Green Deployment)

1. **Push your code** with the `render.yaml` file to GitHub
2. **Create Blueprint**:
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect and use the `render.yaml` configuration

## 🔍 Step 5: Verify Deployment

Once deployed, test these endpoints:

- **Health Check**: `https://your-app-name.onrender.com/health`
- **API Documentation**: `https://your-app-name.onrender.com/api-docs`
- **Landing Page**: `https://your-app-name.onrender.com/`

## 🔄 Step 6: Configure Auto-Deploy

1. **Automatic Deploys**: Render automatically deploys when you push to your main branch
2. **Manual Deploys**: You can manually deploy from the Render dashboard
3. **Preview Deploys**: For pull requests, Render creates preview environments

## 🛠️ Step 7: Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain
   - Update DNS records as instructed

2. **Update Environment Variables**:
   - Update `APP_URL` to your custom domain
   - Update `FRONTEND_URL` if needed

## 📊 Step 8: Monitoring and Logs

1. **View Logs**: Go to your service → "Logs" tab
2. **Monitor Performance**: Check "Metrics" tab for performance data
3. **Health Checks**: Render automatically monitors your `/health` endpoint

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Environment Variables**:
   - Double-check all environment variables are set
   - Ensure no typos in variable names
   - Verify MongoDB connection string

3. **Email Issues**:
   - Check Gmail App Password is correct
   - Ensure 2FA is enabled on Gmail
   - Verify email credentials in environment variables

4. **Database Connection**:
   - Verify MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
   - Check database user permissions
   - Ensure connection string is correct

### Performance Tips:

1. **Upgrade Plan**: Consider upgrading from free plan for better performance
2. **Database Optimization**: Use MongoDB Atlas for better database performance
3. **Caching**: Implement Redis for session caching (requires paid plan)

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **JWT Secrets**: Use strong, unique secrets for JWT tokens
3. **Database Security**: Use MongoDB Atlas with proper network security
4. **Rate Limiting**: Configure appropriate rate limits for your use case

## 📈 Scaling

1. **Vertical Scaling**: Upgrade your Render plan for more resources
2. **Horizontal Scaling**: Add multiple instances (paid plans only)
3. **Database Scaling**: Upgrade MongoDB Atlas plan as needed

## 🎉 Success!

Your AI Todo App backend is now deployed and ready to use! 

**Next Steps**:
- Test all API endpoints
- Deploy your frontend application
- Set up monitoring and alerts
- Configure CI/CD pipelines

---

**Need Help?**
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
