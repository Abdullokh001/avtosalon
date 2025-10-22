# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Ko'pchilik endpointlar uchun Bearer token kerak:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### 1. Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ro'yxatdan o'tish muvaffaqiyatli. Emailingizga tasdiqlash kodi yuborildi",
  "data": {
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

---

### 2. Verify Email
**POST** `/auth/verify`

**Request Body:**
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email muvaffaqiyatli tasdiqlandi"
}
```

---

### 3. Login
**POST** `/auth/login`

**Request Body:**
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
  "message": "Tizimga kirish muvaffaqiyatli",
  "data": {
    "user": {
      "id": "123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 4. Refresh Token
**POST** `/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token muvaffaqiyatli yangilandi",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 5. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tizimdan chiqish muvaffaqiyatli"
}
```

---

### 6. Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Parolni tiklash havolasi emailingizga yuborildi"
}
```

---

### 7. Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Parol muvaffaqiyatli tiklandi"
}
```

---

### 8. Change Password
**POST** `/auth/change-password`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Parol muvaffaqiyatli o'zgartirildi"
}
```

---

## Category Endpoints

### 1. Get All Categories
**GET** `/categories`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "123",
      "name": "Sedan",
      "description": "Sedan mashinalar",
      "createdBy": {
        "_id": "456",
        "fullName": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Category
**GET** `/categories/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "123",
    "name": "Sedan",
    "description": "Sedan mashinalar",
    "createdBy": {
      "_id": "456",
      "fullName": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Create Category (Admin only)
**POST** `/categories`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "SUV",
  "description": "Sport Utility Vehicle"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category muvaffaqiyatli yaratildi",
  "data": {
    "_id": "123",
    "name": "SUV",
    "description": "Sport Utility Vehicle",
    "createdBy": {
      "_id": "456",
      "fullName": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Update Category (Admin only)
**PUT** `/categories/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "SUV Updated",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category muvaffaqiyatli yangilandi",
  "data": {
    "_id": "123",
    "name": "SUV Updated",
    "description": "Updated description"
  }
}
```

---

### 5. Delete Category (Admin only)
**DELETE** `/categories/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Category muvaffaqiyatli o'chirildi"
}
```

---

## Mashina Endpoints

### 1. Get All Mashinas
**GET** `/mashinas`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "123",
      "name": "Toyota Camry",
      "model": "Camry",
      "year": 2023,
      "price": 25000,
      "color": "Black",
      "mileage": 5000,
      "description": "Zo'r mashina",
      "category": {
        "_id": "456",
        "name": "Sedan"
      },
      "createdBy": {
        "_id": "789",
        "fullName": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Mashina
**GET** `/mashinas/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "123",
    "name": "Toyota Camry",
    "model": "Camry",
    "year": 2023,
    "price": 25000,
    "color": "Black",
    "mileage": 5000,
    "description": "Zo'r mashina",
    "category": {
      "_id": "456",
      "name": "Sedan",
      "description": "Sedan mashinalar"
    },
    "createdBy": {
      "_id": "789",
      "fullName": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

---

### 3. Get Mashinas by Category
**GET** `/mashinas/category/:categoryId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "category": {
    "id": "456",
    "name": "Sedan"
  },
  "data": [
    {
      "_id": "123",
      "name": "Toyota Camry",
      "model": "Camry",
      "year": 2023,
      "price": 25000
    }
  ]
}
```

---

### 4. Create Mashina (Admin only)
**POST** `/mashinas`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Toyota Camry",
  "model": "Camry",
  "year": 2023,
  "price": 25000,
  "color": "Black",
  "mileage": 5000,
  "description": "Zo'r mashina",
  "category": "category_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mashina muvaffaqiyatli yaratildi",
  "data": {
    "_id": "123",
    "name": "Toyota Camry",
    "model": "Camry",
    "year": 2023,
    "price": 25000,
    "color": "Black",
    "mileage": 5000,
    "description": "Zo'r mashina",
    "category": {
      "_id": "456",
      "name": "Sedan"
    }
  }
}
```

---

### 5. Update Mashina (Admin only)
**PUT** `/mashinas/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Toyota Camry Updated",
  "price": 26000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mashina muvaffaqiyatli yangilandi",
  "data": {
    "_id": "123",
    "name": "Toyota Camry Updated",
    "price": 26000
  }
}
```

---

### 6. Delete Mashina (Admin only)
**DELETE** `/mashinas/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Mashina muvaffaqiyatli o'chirildi"
}
```

---

## Profile Endpoint

### Get Profile
**GET** `/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (User):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Response (Admin):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "fullName": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "statistics": {
      "totalCategories": 5,
      "totalMashinas": 20
    },
    "categories": [...],
    "mashinas": [...]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validatsiya xatosi",
  "errors": [
    {
      "field": "email",
      "message": "Email formati noto'g'ri"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token mavjud emas. Iltimos, tizimga kiring"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Sizda bu amalni bajarish uchun ruxsat yo'q"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resurs topilmadi"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server xatosi"
}
```
