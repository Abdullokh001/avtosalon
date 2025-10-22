# Setup Guide - Ishga tushirish bo'yicha qo'llanma

## 1. Dependencies o'rnatish

Terminalni oching va loyihaning asosiy papkasida quyidagi komandani bajaring:

```bash
npm install
```

## 2. .env faylini sozlash

`.env` faylidagi quyidagi qiymatlarni o'zgartiring:

### Email sozlamalari (Gmail misoli):

1. Gmail hisobingizga kiring
2. Account Settings > Security > 2-Step Verification yoqing
3. App passwords bo'limiga o'ting
4. Yangi app password yarating
5. `.env` faylida quyidagilarni o'zgartiring:

```env
EMAIL_USER=sizning-email@gmail.com
EMAIL_PASSWORD=gmail-app-password
```

**Muhim:** EMAIL_PASSWORD bu oddiy parolingiz emas, Gmail app password bo'lishi kerak!

### JWT Secrets o'zgartirish (ixtiyoriy):

Xavfsizlik uchun JWT secretlarni o'zgartirishingiz mumkin:

```env
JWT_ACCESS_SECRET=o'zingizning_maxfiy_kalitingiz
JWT_REFRESH_SECRET=o'zingizning_boshqa_maxfiy_kalitingiz
```

## 3. MongoDB Atlas ulanishi tekshirish

`.env` faylida MongoDB URI allaqachon mavjud:

```env
MONGO_URI=mongodb+srv://abdulloh_developer:90J164na@abdulloh.int0zbp.mongodb.net/exam5thMonth?retryWrites=true&w=majority&appName=Abdulloh
```

## 4. Serverni ishga tushirish

### Development rejimida (nodemon bilan):

```bash
npm run dev
```

### Production rejimida:

```bash
npm start
```

Server `http://localhost:5000` da ishga tushadi.

## 5. Test qilish

### API test qilish uchun qadamlar:

#### 1. Admin foydalanuvchi yaratish:

**POST** `http://localhost:5000/api/auth/register`

```json
{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### 2. Email tasdiqlash:

Emailingizga kelgan 6 raqamli kodni kiriting:

**POST** `http://localhost:5000/api/auth/verify`

```json
{
  "email": "admin@example.com",
  "code": "123456"
}
```

#### 3. MongoDB da admin qilish:

MongoDB Compass yoki MongoDB Atlas veb saytida:
- `exam5thMonth` databasega kiring
- `users` collectionni oching
- Admin foydalanuvchini toping
- `role` maydonini `"user"` dan `"admin"` ga o'zgartiring

#### 4. Login qilish:

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response'dan `accessToken` ni oling.

#### 5. Category yaratish (Admin):

**POST** `http://localhost:5000/api/categories`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Body:**
```json
{
  "name": "Sedan",
  "description": "Sedan mashinalar"
}
```

#### 6. Mashina yaratish (Admin):

**POST** `http://localhost:5000/api/mashinas`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Body:**
```json
{
  "name": "Toyota Camry",
  "model": "Camry",
  "year": 2023,
  "price": 25000,
  "color": "Black",
  "mileage": 5000,
  "description": "Zo'r mashina",
  "category": "CATEGORY_ID"
}
```

#### 7. Profile ko'rish:

**GET** `http://localhost:5000/api/profile`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 6. Loglarni ko'rish

Loglar `logs/` papkasida saqlanadi:

- `combined.log` - Barcha loglar
- `error.log` - Faqat error loglar
- `warning.log` - Faqat warning loglar

MongoDB'da ham loglar `logs` collectionda saqlanadi.

## 7. Muammolarni hal qilish

### MongoDB ulanish xatosi:

1. Internet ulanishini tekshiring
2. MongoDB Atlas'da IP whitelist'ga IP manzilingizni qo'shing
3. MongoDB URI to'g'ri ekanligini tekshiring

### Email yuborilmadi:

1. EMAIL_USER va EMAIL_PASSWORD to'g'ri ekanligini tekshiring
2. Gmail'da 2-Step Verification va App password to'g'ri sozlanganligini tekshiring
3. Less secure app access o'chirilgan bo'lishi kerak (App password ishlatayotgan bo'lsangiz)

### Token xatosi:

1. Token muddati tugagan bo'lishi mumkin - refresh token yordamida yangilang
2. Yangi login qiling

## 8. Postman Collection (ixtiyoriy)

Barcha endpointlarni test qilish uchun Postman Collection yarating yoki API_DOCUMENTATION.md faylidan foydalaning.

## 9. Production Deploy

Production'ga deploy qilishdan oldin:

1. `.env` faylini server'ga ko'chiring (lekin git'ga qo'shmang!)
2. JWT secretlarni kuchli qiymatlar bilan almashtiring
3. `NODE_ENV=production` qo'ying
4. CORS sozlamalarini production URL'ga moslashtiring

## Savol-javoblar

### Q: Admin qanday yaratish kerak?
A: Oddiy user yaratib, MongoDB'da role'ni "admin" ga o'zgartiring.

### Q: Email kelmayapti?
A: Gmail App Password to'g'ri sozlanganligini tekshiring.

### Q: Token muddati qancha?
A: Access token - 15 daqiqa, Refresh token - 7 kun.

### Q: Categoryni o'chirish mumkin emasmi?
A: Agar categoryga mashinalar tegishli bo'lsa, avval mashinalarni o'chirish kerak.

## Yordam

Agar muammolar yuzaga kelsa:
1. `logs/error.log` faylini ko'ring
2. MongoDB'da `logs` collectionni tekshiring
3. Console'dagi xatolarni o'qing
