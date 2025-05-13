const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const verifyRoutes = require('./routes/verifyroutes');
require('dotenv').config(); // تحميل متغيرات البيئة من ملف .env إن وجد

const app = express();

// إعداد CORS
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:4001',
    'http://client-app:3002',
    'http://localhost',
    'http://localhost:4003'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// استيراد المسارات
const adminRoutes = require('./routes/adminroutes');
const clientRoutes = require('./routes/clientroutes');

// استخدام المسارات
app.use('/admin', adminRoutes);
app.use('/clients', clientRoutes);
app.use('/api/auth', verifyRoutes);

// الاتصال بقاعدة البيانات باستخدام MONGO_URI من متغيرات البيئة
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ MongoDB connected');

    const { Admin } = require('./models/user');
    const { hashPassword } = require('./utils/hash');
    
    // إنشاء مسؤول افتراضي إذا لم يوجد
    const adminExists = await Admin.findOne({ login: 'admin' });
    if (!adminExists) {
      await Admin.create({
        nom: "Admin",
        penom: "User",
        login: "admin",
        password: hashPassword("admin123"),
        departement: "information",
        is_super_admin: true
      });
      console.log("👑 Default admin created (login: 'admin', password: 'admin123')");
    }

    // تشغيل الخادم
    app.listen(3001, () => console.log('🚀 Server running on http://localhost:3001'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));