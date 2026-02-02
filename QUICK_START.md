# نظام كاشير - دليل الاستخدام السريع

## 🚀 البدء السريع

### 1. تشغيل Backend

```bash
# الانتقال لمجلد البيكند
cd backend

# تثبيت الحزم
npm install

# تشغيل الخادم
npm run dev
```

سيعمل الخادم على: `http://localhost:5000`

### 2. تشغيل Frontend

افتح ملف `frontend/pages/login.html` في المتصفح مباشرة، أو استخدم:

```bash
# باستخدام Python
cd frontend
python -m http.server 3000

# أو باستخدام Live Server في VS Code
```

### 3. إنشاء حساب المدير الأول

استخدم أي HTTP Client (Postman, Thunder Client, أو curl):

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@pos.com",
  "password": "admin123",
  "role": "admin"
}
```

### 4. تسجيل الدخول

افتح الصفحة واستخدم:

- **اسم المستخدم**: admin
- **كلمة المرور**: admin123

---

## 📋 الملفات الأساسية

### Backend

- `server.js` - نقطة البداية
- `.env` - إعدادات البيئة
- `models/` - نماذج قاعدة البيانات
- `routes/` - مسارات API
- `controllers/` - منطق العمل

### Frontend

- `pages/login.html` - صفحة تسجيل الدخول
- `pages/dashboard.html` - لوحة التحكم
- `js/api.js` - معالج API
- `css/main.css` - الأنماط الأساسية

---

## 🔑 بيانات تسجيل الدخول الافتراضية

| المستخد | كلمة المرور | الصلاحية |
| ------- | ----------- | -------- |
| admin   | admin123    | مدير     |

---

## 📱 الصفحات المتاحة

1. **Login** - `pages/login.html`
2. **Dashboard** - `pages/dashboard.html`
3. **POS** - `pages/pos.html`
4. **Products** - `pages/products.html`
5. **Customers** - `pages/customers.html`
6. **Employees** - `pages/employees.html`
7. **Reports** - `pages/reports.html`

---

## ⚙️ إعدادات مهمة

### تغيير المنفذ (Port)

في ملف `.env`:

```
PORT=5000
```

### تغيير اتصال قاعدة البيانات

في ملف `.env`:

```
MONGODB_URI=mongodb://localhost:27017/pos_system
```

### تغيير سر JWT

في ملف `.env`:

```
JWT_SECRET=your_secret_key_here
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة: Cannot connect to database

**الحل**: تأكد من تشغيل MongoDB

```bash
mongod
```

### المشكلة: Port already in use

**الحل**: غيّر المنفذ في `.env` أو أوقف التطبيق الآخر

### المشكلة: Token invalid

**الحل**: قم بتسجيل الدخول مرة أخرى

---

## 📞 الدعم

للمساعدة أو الإبلاغ عن مشاكل، افتح Issue في GitHub.
