const sdk = require('node-appwrite');
require('dotenv').config();

const client = new sdk.Client();

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
    console.error('❌ Error: Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env file');
    process.exit(1);
}

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new sdk.Databases(client);

const DB_NAME = 'POS_System_DB';
let DB_ID = '';

async function setup() {
    try {
        console.log('🚀 Starting Appwrite Setup...');

        if (process.env.APPWRITE_DATABASE_ID && process.env.APPWRITE_DATABASE_ID !== 'pos_system') {
            DB_ID = process.env.APPWRITE_DATABASE_ID;
            console.log(`ℹ️ Using existing Database ID from .env: ${DB_ID}`);
        } else {
            // 1. Create Database
            try {
                const db = await databases.create(sdk.ID.unique(), DB_NAME);
                DB_ID = db.$id;
                console.log(`✅ Database Created: ${DB_NAME} (${DB_ID})`);
                console.log(`👉 Please update APPWRITE_DATABASE_ID in your .env with: ${DB_ID}`);
            } catch (e) {
               // ... existing warning logic could remain or be simplified
               console.log('⚠️ Warning creating DB:', e.message);
            }
        }

        // 2. Create Collections & Attributes

        // --- Products ---
        const productsCol = await databases.createCollection(DB_ID, sdk.ID.unique(), 'Products');
        console.log(`✅ Collection Created: Products (${productsCol.$id})`);
        
        await databases.createStringAttribute(DB_ID, productsCol.$id, 'name', 255, true);
        await databases.createStringAttribute(DB_ID, productsCol.$id, 'description', 1000, false);
        await databases.createStringAttribute(DB_ID, productsCol.$id, 'barcode', 100, false);
        await databases.createStringAttribute(DB_ID, productsCol.$id, 'category', 100, true);
        await databases.createFloatAttribute(DB_ID, productsCol.$id, 'price', true);
        await databases.createFloatAttribute(DB_ID, productsCol.$id, 'cost', true);
        await databases.createIntegerAttribute(DB_ID, productsCol.$id, 'stock', true);
        await databases.createIntegerAttribute(DB_ID, productsCol.$id, 'minStock', true);
        console.log('   Attributes added to Products');

        // --- Customers ---
        const customersCol = await databases.createCollection(DB_ID, sdk.ID.unique(), 'Customers');
        console.log(`✅ Collection Created: Customers (${customersCol.$id})`);
        
        await databases.createStringAttribute(DB_ID, customersCol.$id, 'name', 255, true);
        await databases.createStringAttribute(DB_ID, customersCol.$id, 'phone', 50, true);
        await databases.createStringAttribute(DB_ID, customersCol.$id, 'email', 255, false);
        await databases.createStringAttribute(DB_ID, customersCol.$id, 'address', 500, false);
        await databases.createIntegerAttribute(DB_ID, customersCol.$id, 'points', false, 0);
        console.log('   Attributes added to Customers');

        // --- Invoices ---
        let invoicesColId;
        if (process.env.APPWRITE_COLLECTION_INVOICES && process.env.APPWRITE_COLLECTION_INVOICES !== 'invoices') {
            invoicesColId = process.env.APPWRITE_COLLECTION_INVOICES;
            console.log(`ℹ️ Using existing Invoices Collection: ${invoicesColId}`);
        } else {
            const invoicesCol = await databases.createCollection(DB_ID, sdk.ID.unique(), 'Invoices');
            invoicesColId = invoicesCol.$id;
            console.log(`✅ Collection Created: Invoices (${invoicesColId})`);
        }

        // Add Attributes one by one with delay to avoid 500 errors
        const addAttr = async (fn) => {
             try { await fn(); } catch(e) { console.log('   ⚠️ Attribute exists or error: ' + e.message); }
             await new Promise(r => setTimeout(r, 1000)); // 1s delay
        };

        await addAttr(() => databases.createIntegerAttribute(DB_ID, invoicesColId, 'invoiceNumber', true));
        await addAttr(() => databases.createStringAttribute(DB_ID, invoicesColId, 'customerName', 255, false));
        await addAttr(() => databases.createStringAttribute(DB_ID, invoicesColId, 'customerId', 100, false));
        await addAttr(() => databases.createFloatAttribute(DB_ID, invoicesColId, 'subtotal', true));
        await addAttr(() => databases.createFloatAttribute(DB_ID, invoicesColId, 'discount', false, 0));
        await addAttr(() => databases.createFloatAttribute(DB_ID, invoicesColId, 'tax', false, 0));
        await addAttr(() => databases.createFloatAttribute(DB_ID, invoicesColId, 'total', true));
        await addAttr(() => databases.createStringAttribute(DB_ID, invoicesColId, 'paymentMethod', 50, true));
        await addAttr(() => databases.createStringAttribute(DB_ID, invoicesColId, 'status', 50, false, 'completed'));
        await addAttr(() => databases.createStringAttribute(DB_ID, invoicesColId, 'itemsJson', 10000, true)); 
        console.log('   Attributes added to Invoices (Slow Mode)');

        // --- Sales ---
        let salesColId;
         if (process.env.APPWRITE_COLLECTION_SALES && process.env.APPWRITE_COLLECTION_SALES !== 'sales') {
            salesColId = process.env.APPWRITE_COLLECTION_SALES;
             console.log(`ℹ️ Using existing Sales Collection: ${salesColId}`);
        } else {
            const salesCol = await databases.createCollection(DB_ID, sdk.ID.unique(), 'Sales');
            salesColId = salesCol.$id;
            console.log(`✅ Collection Created: Sales (${salesColId})`);
        }

        await addAttr(() => databases.createFloatAttribute(DB_ID, salesColId, 'total', true));
        await addAttr(() => databases.createFloatAttribute(DB_ID, salesColId, 'profit', true));
        await addAttr(() => databases.createDatetimeAttribute(DB_ID, salesColId, 'date', true));
        console.log('   Attributes added to Sales');
        
        console.log(`APPWRITE_COLLECTION_SALES=${salesColId}`);

        console.log('\n🎉 Setup Complete!');
        console.log('\n--- UPDATE YOUR .ENV FILE WITH THESE VALUES ---');
        console.log(`APPWRITE_DATABASE_ID=${DB_ID}`);
        console.log(`APPWRITE_COLLECTION_PRODUCTS=${productsCol.$id}`);
        console.log(`APPWRITE_COLLECTION_CUSTOMERS=${customersCol.$id}`);
        console.log(`APPWRITE_COLLECTION_INVOICES=${invoicesCol.$id}`);
        console.log(`APPWRITE_COLLECTION_SALES=${salesCol.$id}`);
        console.log('-----------------------------------------------');

    } catch (error) {
        console.error('❌ Setup Failed:', error);
    }
}

setup();
