const sdk = require('node-appwrite');

// تهيئة العميل
const client = new sdk.Client();

const setupAppwrite = () => {
    if (!process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
        console.warn('⚠️ تحذير: بيانات Appwrite ناقصة في ملف .env');
        return null;
    }

    client
        .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    console.log('✅ تم الاتصال بـ Appwrite Client');
    return client;
};

const databases = new sdk.Databases(client);

// Helper function to map Appwrite document to our model format
const mapDocument = (doc) => {
    if (!doc) return null;
    const { $id, $createdAt, $updatedAt, ...rest } = doc;
    return {
        _id: $id,
        createdAt: $createdAt,
        updatedAt: $updatedAt,
        ...rest
    };
};

module.exports = {
    client,
    databases,
    setupAppwrite,
    mapDocument,
    // Database IDs (Helper to get from env or use default)
    DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
    COLLECTIONS: {
        PRODUCTS: process.env.APPWRITE_COLLECTION_PRODUCTS,
        INVOICES: process.env.APPWRITE_COLLECTION_INVOICES,
        CUSTOMERS: process.env.APPWRITE_COLLECTION_CUSTOMERS,
        EMPLOYEES: process.env.APPWRITE_COLLECTION_EMPLOYEES,
        SALES: process.env.APPWRITE_COLLECTION_SALES
    }
};
