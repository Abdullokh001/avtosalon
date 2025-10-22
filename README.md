# Exam 5th Month - Express.js Backend

## Talablar ro'yxati

### Asosiy funksiyalar (100 ball):
- ✅ Category va mashinalar CRUD operatsiyalari (30 ball)
- ✅ Category'ga tegishli mashinalar uchun GET API (5 ball)
- ✅ Authentication: register, login, verify, logout, refreshToken, accessToken, forgot password, change password (35 ball)
- ✅ Authorization: Admin va User rollari (5 ball)
- ✅ Joi validation (5 ball)
- ✅ Profile API (10 ball)
- ✅ Winston logging (file va database) (5 ball)
- ✅ Error handler middleware (5 ball)

## O'rnatish

```bash
npm install
```

## .env faylini sozlash

`.env` faylida quyidagilarni sozlang:
- EMAIL_USER va EMAIL_PASSWORD - email yuborish uchun

## Ishga tushirish

```bash
# Development rejim
npm run dev

# Production rejim
npm start
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Ro'yxatdan o'tish
- POST `/api/auth/login` - Tizimga kirish
- POST `/api/auth/verify` - Email tasdiqlash
- POST `/api/auth/logout` - Tizimdan chiqish
- POST `/api/auth/refresh-token` - Token yangilash
- POST `/api/auth/forgot-password` - Parolni unutgan
- POST `/api/auth/change-password` - Parolni o'zgartirish

### Profile
- GET `/api/profile` - Foydalanuvchi profili

### Category (Admin only)
- GET `/api/categories` - Barcha categorylar
- GET `/api/categories/:id` - Bitta category
- POST `/api/categories` - Category yaratish
- PUT `/api/categories/:id` - Category yangilash
- DELETE `/api/categories/:id` - Category o'chirish

### Mashina (Admin only)
- GET `/api/mashinas` - Barcha mashinalar
- GET `/api/mashinas/:id` - Bitta mashina
- GET `/api/mashinas/category/:categoryId` - Category bo'yicha mashinalar
- POST `/api/mashinas` - Mashina yaratish
- PUT `/api/mashinas/:id` - Mashina yangilash
- DELETE `/api/mashinas/:id` - Mashina o'chirish

## Texnologiyalar

- Express.js
- MongoDB Atlas
- JWT Authentication
- Joi Validation
- Winston Logger
- Bcrypt
- Nodemailer
