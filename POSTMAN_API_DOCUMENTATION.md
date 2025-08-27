# 🚀 Placify Backend API Documentation for Postman Testing

## 📋 Base Configuration

**Base URL:** `http://localhost:5000` (or your deployed URL)
**Content-Type:** `application/json` (unless specified otherwise)

---

## 🔐 Authentication APIs

### 1. Health Check

```
GET /api/health
```

**Description:** Check server health status
**Headers:** None required
**Response:**

```json
{
  "status": "OK",
  "timestamp": "2025-08-26T...",
  "database": "Connected"
}
```

### 2. User Registration

```
POST /api/auth/register
```

**Headers:**

- `Content-Type: application/json`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "...",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. User Login

```
POST /api/auth/login
```

**Headers:**

- `Content-Type: application/json`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 📄 Resume Management APIs

### 4. Create Resume

```
POST /api/resume
```

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "summary": "Experienced software developer with 5+ years...",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "education": [
    {
      "institution": "University of Example",
      "degree": "Bachelor of Computer Science",
      "startDate": "2018",
      "endDate": "2022",
      "description": "Graduated with honors..."
    }
  ],
  "workExperience": [
    {
      "company": "Tech Corp",
      "role": "Software Developer",
      "startDate": "2022-01",
      "endDate": "Present",
      "description": "Developed web applications using React..."
    }
  ],
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built a full-stack e-commerce solution...",
      "techStack": ["React", "Node.js", "MongoDB"],
      "link": "https://github.com/johndoe/ecommerce"
    }
  ]
}
```

### 5. Get User's Resumes

```
GET /api/resume
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

### 6. Get Specific Resume

```
GET /api/resume/{resumeId}
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

### 7. Update Resume

```
PUT /api/resume/{resumeId}
```

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:** Same as create resume (partial updates allowed)

### 8. Delete Resume

```
DELETE /api/resume/{resumeId}
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 🎯 ATS (Resume Analysis) APIs

### 9. Analyze Resume (Optional Authentication)

```
POST /api/ats/upload
```

**Headers:**

- `Content-Type: multipart/form-data`
- `Authorization: Bearer YOUR_JWT_TOKEN` (optional - for score saving)

**Body (Form Data):**

- `resume`: File (PDF or TXT)
- `jobDescription`: Text (required)
- `jobTitle`: Text (optional)
- `companyName`: Text (optional)
- `resumeId`: String (optional)

**Response:**

```json
{
  "message": "Resume analyzed successfully",
  "resumeChars": 2500,
  "overallScore": 85,
  "multiFactor": {
    "keywordMatch": 90,
    "skillsRelevance": 85,
    "experienceRelevance": 80,
    "educationRelevance": 75,
    "formatAndStructure": 95
  },
  "geminiAnalysis": {
    "feedback": "Strong technical background...",
    "suggestions": ["Add more quantified achievements"],
    "strengths": ["Strong React skills"],
    "improvements": ["Include certifications"]
  },
  "scoreSaved": true
}
```

---

## 📊 Resume Score APIs

### 10. Save Resume Score (Manual)

```
POST /api/resume/score
```

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**

```json
{
  "score": 85,
  "scoreBreakdown": {
    "keywordMatch": {
      "score": 90,
      "details": {
        "matched": ["react", "node", "javascript"],
        "total": 10,
        "percentage": 90
      }
    },
    "skillsRelevance": {
      "score": 80,
      "details": {
        "relevant": 8,
        "total": 10
      }
    },
    "experienceRelevance": {
      "score": 85,
      "details": {
        "relevantYears": 3,
        "requiredYears": 3
      }
    },
    "educationRelevance": {
      "score": 75,
      "details": {
        "degree": "Bachelor",
        "required": "Bachelor"
      }
    },
    "formatAndStructure": {
      "score": 95,
      "details": {
        "sections": 5,
        "completeness": 0.9
      }
    }
  },
  "jobTitle": "Full Stack Developer",
  "companyName": "Tech Corp",
  "resumeFileName": "john_doe_resume.pdf",
  "resumeId": "optional_resume_id",
  "aiAnalysis": {
    "feedback": "Strong technical background with relevant experience...",
    "suggestions": [
      "Add more quantified achievements",
      "Include cloud technologies"
    ],
    "strengths": ["Strong React skills", "Good project portfolio"],
    "improvements": ["Add leadership experience", "Include certifications"]
  }
}
```

### 11. Get Score History

```
GET /api/resume/score?limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

**Query Parameters:**

- `limit`: Number (max 100, default 20)
- `page`: Number (default 1)
- `sortBy`: String (default 'createdAt')
- `sortOrder`: String ('asc' or 'desc', default 'desc')

### 12. Get Latest Score

```
GET /api/resume/score/latest
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

### 13. Get Score Analytics

```
GET /api/resume/score/analytics
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalScores": 15,
      "averageScore": 78.5,
      "bestScore": 95,
      "worstScore": 60,
      "latestScore": 85,
      "firstScore": 65
    },
    "recentProgress": [...],
    "improvementTrend": {
      "current": 85,
      "previous": 80,
      "difference": 5,
      "percentageChange": "6.3",
      "isImprovement": true
    },
    "categoryAnalytics": {
      "avgKeywordMatch": 82.5,
      "avgSkillsRelevance": 78.2,
      "avgExperienceRelevance": 75.8,
      "avgEducationRelevance": 80.1,
      "avgFormatStructure": 88.9
    },
    "jobInsights": [...]
  }
}
```

### 14. Delete Score Entry

```
DELETE /api/resume/score/{scoreId}
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

### 15. Admin Score Analytics (Admin Only)

```
GET /api/resume/score/admin/analytics
```

**Headers:**

- `Authorization: Bearer ADMIN_JWT_TOKEN`

---

## 🎓 Student Management APIs

### 16. Get Students (Institution/Admin)

```
GET /api/students
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

### 17. Create Student Progress

```
POST /api/students
```

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@university.edu",
  "university": "Tech University",
  "major": "Computer Science",
  "year": "3rd",
  "semester": "6th",
  "attendance": 95,
  "interviewAttended": 3,
  "passedInterviews": 2,
  "failedInterviews": 1,
  "placementStatus": "Not Placed"
}
```

---

## 📝 Interview Management APIs

### 18. Create Interview

```
POST /api/interviews
```

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**

```json
{
  "companyName": "Tech Corp",
  "position": "Software Developer",
  "interviewDate": "2025-09-01",
  "interviewType": "online",
  "round": 1,
  "notes": "Technical interview focusing on React"
}
```

### 19. Get User Interviews

```
GET /api/interviews
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

### 20. Update Interview Status

```
PUT /api/interviews/{interviewId}
```

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**

```json
{
  "status": "completed",
  "notes": "Interview went well, waiting for feedback"
}
```

---

## 💬 Feedback APIs

### 21. Submit Feedback

```
POST /api/feedback
```

**Headers:**

- `Content-Type: application/json`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Platform Feedback",
  "message": "Great platform! Would love to see more features..."
}
```

### 22. Get Feedback (Admin)

```
GET /api/feedback
```

**Headers:**

- `Authorization: Bearer ADMIN_JWT_TOKEN`

---

## ⚙️ Settings APIs

### 23. Get User Settings

```
GET /api/settings
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

### 24. Update Settings

```
PUT /api/settings
```

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**

```json
{
  "notifications": {
    "emailNotifications": true,
    "smsNotifications": false,
    "placementUpdates": true,
    "studentRegistrations": true
  },
  "integrations": {
    "resumeParserApi": "your-api-key",
    "thirdPartyApiKey": "another-key"
  }
}
```

---

## 🔄 Performance APIs

### 25. Get Performance Metrics

```
GET /api/performance
```

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 🏢 Institution APIs

### 26. Register Institution

```
POST /api/institution/register
```

**Headers:**

- `Content-Type: application/json`

**Body:**

```json
{
  "name": "Tech University",
  "email": "admin@techuni.edu",
  "password": "securePassword123",
  "website": "https://techuni.edu",
  "contactPerson": "Dr. Smith",
  "phone": "+1234567890",
  "address": "123 University Ave",
  "establishedYear": 1985,
  "description": "Leading technology university",
  "accreditation": "ABET",
  "totalStudents": 5000
}
```

### 27. Get Institution Profile

```
GET /api/institution/profile
```

**Headers:**

- `Authorization: Bearer INSTITUTION_JWT_TOKEN`

---

## 🧪 Testing Guidelines

### Environment Setup

1. Set up environment variables:

   ```
   JWT_SECRET=your-secret-key
   MONGO_URI=your-mongodb-connection-string
   PORT=5000
   ```

2. Install dependencies:

   ```bash
   cd server
   npm install
   ```

3. Start server:
   ```bash
   npm start
   ```

### Testing Flow

1. **Health Check** - Verify server is running
2. **Register** - Create a test user
3. **Login** - Get JWT token
4. **Create Resume** - Test resume creation
5. **ATS Analysis** - Upload resume for analysis
6. **View Scores** - Check saved scores and analytics
7. **Test Other APIs** - Use the JWT token for authenticated endpoints

### Error Responses

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

---

## 📱 File Upload Testing

For ATS upload testing, use form-data in Postman:

1. Set method to POST
2. Choose Body → form-data
3. Add key `resume` with type File
4. Add key `jobDescription` with type Text
5. Add optional keys: `jobTitle`, `companyName`, `resumeId`

---

## 🔐 JWT Token Usage

Add to Postman Authorization tab:

- Type: Bearer Token
- Token: `{your_jwt_token_from_login_response}`

Or add to Headers:

- Key: `Authorization`
- Value: `Bearer {your_jwt_token}`

---

## 🎯 Advanced Testing Scenarios

### Score Persistence Testing

1. Upload resume without authentication → No score saved
2. Login and upload resume → Score saved automatically
3. View score history → See all saved scores
4. Check analytics → View trends and insights

### Role-Based Testing

1. Test with different user roles (student, admin, institution)
2. Verify access restrictions for admin-only endpoints
3. Test role-specific features and permissions

### Error Handling Testing

1. Test with invalid tokens
2. Test with malformed request bodies
3. Test file upload limits and invalid file types
4. Test database connection errors
