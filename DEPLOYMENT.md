# 🚀 Hướng Dẫn Triển Khai Hệ Thống Quản Lý Thư Viện PTIT

## 📋 Yêu Cầu Hệ Thống

### Phần Cứng
- **CPU**: Intel i3 hoặc tương đương
- **RAM**: 4GB trở lên
- **Ổ cứng**: 10GB trống
- **Kết nối**: Internet ổn định

### Phần Mềm
- **Node.js**: v16.0.0 trở lên
- **npm**: v8.0.0 trở lên
- **Git**: Để clone repository
- **Browser**: Chrome, Firefox, Safari (phiên bản mới)

## 🔧 Cài Đặt Môi Trường Phát Triển

### 1. Clone Repository
```bash
git clone <repository-url>
cd NCKH
```

### 2. Cài Đặt Dependencies
```bash
# Nếu có package.json
npm install

# Hoặc sử dụng Live Server extension trong VS Code
# Install "Live Server" extension
```

### 3. Cấu Hình Firebase

#### 3.1 Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Đặt tên project: `nckh-ptit-library`
4. Bật Google Analytics (tùy chọn)

#### 3.2 Thiết Lập Authentication
```javascript
// Trong Firebase Console
1. Vào Authentication > Sign-in method
2. Bật Email/Password
3. Cấu hình Authorized domains
```

#### 3.3 Tạo Firestore Database
```javascript
// Trong Firebase Console
1. Vào Firestore Database
2. Click "Create database"
3. Chọn "Start in test mode"
4. Chọn location: asia-southeast1 (Singapore)
```

#### 3.4 Tạo Realtime Database
```javascript
// Trong Firebase Console
1. Vào Realtime Database
2. Click "Create database"
3. Chọn "Start in test mode"
4. Chọn location: asia-southeast1
```

#### 3.5 Cấu Hình Firebase Config
Cập nhật file `Web/firebase/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## 🌐 Triển Khai Lên Firebase Hosting

### 1. Cài Đặt Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Đăng Nhập Firebase
```bash
firebase login
```

### 3. Khởi Tạo Firebase Project
```bash
firebase init
```

Chọn các tính năng:
- ✅ Hosting
- ✅ Firestore
- ✅ Realtime Database

### 4. Cấu Hình Hosting
```javascript
// firebase.json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/Web/index.html"
      }
    ]
  }
}
```

### 5. Deploy
```bash
firebase deploy
```

## 🔒 Cấu Hình Bảo Mật

### 1. Firestore Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Books collection
    match /books/{bookId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // History collection
    match /history/{historyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Realtime Database Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "books": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "history": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## 📱 Cấu Hình Mobile

### 1. Responsive Design
Đảm bảo CSS responsive đã được implement:
```css
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (max-width: 480px) {
  /* Small mobile styles */
}
```

### 2. Touch Events
```javascript
// Thêm touch events cho mobile
document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);
document.addEventListener('touchend', handleTouch);
```

## 🔧 Cấu Hình Production

### 1. Environment Variables
```javascript
// config.js
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    firebaseConfig: {
      // Development config
    }
  },
  production: {
    apiUrl: 'https://your-domain.com',
    firebaseConfig: {
      // Production config
    }
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

### 2. Error Handling
```javascript
// errorHandler.js
export const handleError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  
  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    // Log to Sentry, LogRocket, etc.
  }
};
```

### 3. Performance Optimization
```javascript
// Lazy loading
const loadComponent = async (componentName) => {
  const module = await import(`./components/${componentName}.js`);
  return module.default;
};

// Code splitting
const routes = {
  '/admin': () => import('./pages/Admin.js'),
  '/student': () => import('./pages/Student.js')
};
```

## 📊 Monitoring & Analytics

### 1. Firebase Analytics
```javascript
// analytics.js
import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics(app);

export const trackEvent = (eventName, parameters) => {
  logEvent(analytics, eventName, parameters);
};
```

### 2. Error Monitoring
```javascript
// monitoring.js
export const trackError = (error, context) => {
  // Log to Firebase Crashlytics
  // Log to external monitoring service
};
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: 'your-project-id'
```

### 2. Automated Testing
```javascript
// tests/integration.test.js
import { test, expect } from '@jest/globals';

test('User can login successfully', async () => {
  // Test login functionality
});

test('Admin can add books', async () => {
  // Test book addition
});
```

## 📈 Performance Optimization

### 1. Image Optimization
```javascript
// imageOptimizer.js
export const optimizeImage = (imageUrl, width, height) => {
  return `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&w=${width}&h=${height}&f=webp`;
};
```

### 2. Caching Strategy
```javascript
// cache.js
export const cache = {
  set: (key, value, ttl = 3600000) => {
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.value;
  }
};
```

## 🛡️ Security Checklist

- [ ] Firebase Security Rules configured
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] CSRF protection configured
- [ ] HTTPS enforced
- [ ] Authentication required for sensitive operations
- [ ] Role-based access control implemented
- [ ] Error messages don't expose sensitive information

## 📋 Testing Checklist

### Functional Testing
- [ ] User registration works
- [ ] User login works
- [ ] Admin can add books
- [ ] Student can borrow books
- [ ] Return book functionality works
- [ ] Search functionality works
- [ ] Chatbot responds correctly

### Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Database queries optimized
- [ ] Images compressed
- [ ] JavaScript minified

## 🚨 Troubleshooting

### Common Issues

#### 1. Firebase Connection Error
```javascript
// Check Firebase config
console.log('Firebase config:', firebaseConfig);

// Check network connectivity
fetch('https://firebase.googleapis.com')
  .then(response => console.log('Firebase reachable:', response.ok))
  .catch(error => console.error('Firebase unreachable:', error));
```

#### 2. Authentication Issues
```javascript
// Check authentication state
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User signed in:', user.uid);
  } else {
    console.log('User signed out');
  }
});
```

#### 3. Database Permission Denied
```javascript
// Check Firestore rules
// Ensure user is authenticated
// Verify user role for admin operations
```

## 📞 Support

### Development Team
- **Lead Developer**: [Name] - [email]
- **Backend Developer**: [Name] - [email]
- **Frontend Developer**: [Name] - [email]

### Documentation
- **API Documentation**: `/docs/api.md`
- **User Manual**: `/docs/user-manual.md`
- **Admin Guide**: `/docs/admin-guide.md`

### Contact
- **Email**: support@ptit.edu.vn
- **Phone**: +84-xxx-xxx-xxxx
- **Office**: PTIT Library, Room 101

---

**Last Updated**: December 2024
**Version**: 1.0.0

