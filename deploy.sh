#!/bin/bash

# 🚀 AI Todo App Backend Deployment Script
# This script helps prepare and deploy the backend to Render

echo "🚀 AI Todo App Backend Deployment Script"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Tests passed!"

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ .env.example file not found. Please create it with your environment variables."
    exit 1
fi

echo "✅ Environment file found!"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy to Render - $(date)"
git push origin master

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub. Please check your git configuration."
    exit 1
fi

echo "✅ Code pushed to GitHub!"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://render.com"
echo "2. Sign in with your GitHub account"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your repository"
echo "5. Configure environment variables (see DEPLOYMENT.md)"
echo "6. Deploy!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔗 Your app will be available at: https://your-app-name.onrender.com"
