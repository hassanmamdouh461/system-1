const User = require('../models/User');

// تجاوز المصادقة - وتعيين مستخدم افتراضي
exports.protect = async (req, res, next) => {
  try {
    // محاولة العثور على أول مستخدم (Admin) أو إنشاء كائن وهمي
    let user = await User.findOne();
    
    if (!user) {
      // إذا لم يوجد مستخدمين، ننشئ كائن وهمي بـ ID صالح لـ Mongoose
      // هذا ضروري لأن الفواتير والمبيعات تتطلب createdBy
      user = {
        _id: "507f1f77bcf86cd799439011", // ID افتراضي
        username: "System Admin",
        role: "admin",
        isActive: true
      };
    }

    req.user = user;
    next();
  } catch (error) {
    next();
  }
};

// السماح للجميع (تجاوز الصلاحيات)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    next();
  };
};

exports.generateToken = (id) => {
  return "dummy_token";
};
