const sdk = require('node-appwrite');
require('dotenv').config();

const client = new sdk.Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const DB_ID = process.env.APPWRITE_DATABASE_ID;
const collections = [
    process.env.APPWRITE_COLLECTION_PRODUCTS,
    process.env.APPWRITE_COLLECTION_CUSTOMERS,
    process.env.APPWRITE_COLLECTION_INVOICES,
    process.env.APPWRITE_COLLECTION_SALES
];

async function updatePermissions() {
    console.log('🔐 Updating Collection Permissions...\n');
    
    for (const collectionId of collections) {
        try {
            // Update collection to allow any user to read/write
            await databases.updateCollection(
                DB_ID,
                collectionId,
                collectionId, // name stays same
                [
                    sdk.Permission.read(sdk.Role.any()),
                    sdk.Permission.create(sdk.Role.any()),
                    sdk.Permission.update(sdk.Role.any()),
                    sdk.Permission.delete(sdk.Role.any())
                ],
                false, // documentSecurity = false (collection-level permissions)
                true   // enabled
            );
            
            console.log(`✅ Updated permissions for: ${collectionId}`);
        } catch (error) {
            console.error(`❌ Error updating ${collectionId}:`, error.message);
        }
    }
    
    console.log('\n🎉 Permissions update complete!');
    console.log('Now anyone can read/write to these collections.');
}

updatePermissions();
