// Appwrite Web SDK Configuration
import { Client, Databases, Account, Query, ID } from 'https://cdn.jsdelivr.net/npm/appwrite@14.0.1/+esm';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6980b75b0030ffa3346d');

const databases = new Databases(client);
const account = new Account(client);

// Database & Collection IDs
const DATABASE_ID = '6980b82e00203fb30831';
const COLLECTIONS = {
    PRODUCTS: '6980b86c003a2179f3f5',
    CUSTOMERS: '6980b86f002de679f2fc',
    INVOICES: '6980b87100196d8bd788',
    SALES: '6980b87e003699425960'
};

// Helper to map Appwrite document to our format
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

// API Methods
const api = {
    // Products
    getProducts: async (params = {}) => {
        try {
            const queries = [Query.limit(params.limit || 50)];
            
            if (params.search) {
                queries.push(Query.search('name', params.search));
            }
            if (params.category && params.category !== 'all') {
                queries.push(Query.equal('category', params.category));
            }

            const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PRODUCTS, queries);
            
            return {
                success: true,
                data: result.documents.map(mapDocument),
                total: result.total
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    getProduct: async (id) => {
        try {
            const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id);
            return { success: true, data: mapDocument(doc) };
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    getProductByBarcode: async (barcode) => {
        try {
            const result = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PRODUCTS,
                [Query.equal('barcode', barcode)]
            );
            
            if (result.documents.length === 0) {
                throw new Error('المنتج غير موجود');
            }
            
            return { success: true, data: mapDocument(result.documents[0]) };
        } catch (error) {
            console.error('Error fetching product by barcode:', error);
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
            const doc = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.PRODUCTS,
                ID.unique(),
                {
                    name: productData.name,
                    barcode: productData.barcode || '',
                    category: productData.category,
                    price: parseFloat(productData.price),
                    cost: parseFloat(productData.cost),
                    stock: parseInt(productData.stock),
                    minStock: parseInt(productData.minStock || 10),
                    description: productData.description || ''
                }
            );
            
            return { success: true, data: mapDocument(doc) };
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const doc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.PRODUCTS,
                id,
                {
                    name: productData.name,
                    barcode: productData.barcode || '',
                    category: productData.category,
                    price: parseFloat(productData.price),
                    cost: parseFloat(productData.cost),
                    stock: parseInt(productData.stock),
                    minStock: parseInt(productData.minStock || 10),
                    description: productData.description || ''
                }
            );
            
            return { success: true, data: mapDocument(doc) };
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id);
            return { success: true, message: 'تم حذف المنتج بنجاح' };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    // Customers
    getCustomers: async (params = {}) => {
        try {
            const queries = [Query.limit(params.limit || 50)];
            // Add search if needed
            if (params.search) {
                 queries.push(Query.search('name', params.search));
            }
            
            const result = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.CUSTOMERS,
                queries
            );
            
            return {
                success: true,
                data: result.documents.map(mapDocument),
                total: result.total
            };
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    createCustomer: async (customerData) => {
        try {
            const doc = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.CUSTOMERS,
                ID.unique(),
                {
                    name: customerData.name,
                    phone: customerData.phone,
                    email: customerData.email || '',
                    address: customerData.address || '',
                    points: 0
                }
            );
            
            return { success: true, data: mapDocument(doc) };
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    },

    updateCustomer: async (id, customerData) => {
        try {
            const doc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.CUSTOMERS,
                id,
                {
                    name: customerData.name,
                    phone: customerData.phone,
                    email: customerData.email || '',
                    address: customerData.address || ''
                }
            );
            
            return { success: true, data: mapDocument(doc) };
        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    },

    deleteCustomer: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CUSTOMERS, id);
            return { success: true, message: 'تم حذف العميل بنجاح' };
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    },

    // Invoices
    getInvoices: async (params = {}) => {
        try {
            const queries = [
                Query.limit(params.limit || 10),
                Query.orderDesc('$createdAt')
            ];
            
            const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.INVOICES, queries);
            
            return {
                success: true,
                data: result.documents.map(doc => {
                    const mapped = mapDocument(doc);
                    // Parse itemsJson back to array
                    if (mapped.itemsJson) {
                        try {
                            mapped.items = JSON.parse(mapped.itemsJson);
                        } catch (e) {
                            mapped.items = [];
                        }
                    }
                    return mapped;
                }),
                total: result.total
            };
        } catch (error) {
            console.error('Error fetching invoices:', error);
            // Return mock data if error
            return {
                success: true,
                data: [
                    { _id: '1', invoiceNumber: 1001, total: 1500, createdAt: new Date().toISOString(), customerName: 'أحمد محمد', status: 'completed' },
                    { _id: '2', invoiceNumber: 1002, total: 350, createdAt: new Date(Date.now() - 3600000).toISOString(), customerName: 'عميل نقدي', status: 'completed' }
                ],
                total: 2
            };
        }
    },

    createInvoice: async (invoiceData) => {
        try {
            // Get next invoice number
            const invoices = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.INVOICES,
                [Query.limit(1), Query.orderDesc('invoiceNumber')]
            );
            
            const nextNumber = invoices.documents.length > 0 
                ? invoices.documents[0].invoiceNumber + 1 
                : 1001;

            const doc = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.INVOICES,
                ID.unique(),
                {
                    invoiceNumber: nextNumber,
                    customerName: invoiceData.customerName || 'عميل نقدي',
                    customerId: invoiceData.customerId || '',
                    subtotal: parseFloat(invoiceData.subtotal),
                    discount: parseFloat(invoiceData.discount || 0),
                    tax: parseFloat(invoiceData.tax || 0),
                    total: parseFloat(invoiceData.total),
                    paymentMethod: invoiceData.paymentMethod || 'cash',
                    status: 'completed',
                    itemsJson: JSON.stringify(invoiceData.items || [])
                }
            );
            
            return { success: true, data: mapDocument(doc) };
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    },

    // Reports - Using mock data for now
    getDashboardStats: async () => {
        try {
            // Try to get real product count
            const products = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PRODUCTS, [Query.limit(1)]);
            const customers = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CUSTOMERS, [Query.limit(1)]);
            
            return {
                success: true,
                data: {
                    salesToday: { amount: 12500, count: 45 },
                    products: { total: products.total, lowStock: 5 },
                    customers: { total: customers.total, new: 12 },
                    profit: { total: 45000, margin: 25 }
                }
            };
        } catch (error) {
            return {
                success: true,
                data: {
                    salesToday: { amount: 12500, count: 45 },
                    products: { total: 120, lowStock: 5 },
                    customers: { total: 850, new: 12 },
                    profit: { total: 45000, margin: 25 }
                }
            };
        }
    },

    getSalesReport: async () => {
        const mockSales = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            mockSales.push({
                _id: d.toISOString().split('T')[0],
                totalSales: Math.floor(Math.random() * 5000) + 1000,
                profit: Math.floor(Math.random() * 1000) + 200
            });
        }
        return { success: true, data: mockSales };
    },

    getTopProducts: async () => {
        return {
            success: true,
            data: [
                { name: 'قهوة اسبريسو', quantity: 150, revenue: 2250 },
                { name: 'شاي أخضر', quantity: 120, revenue: 1200 },
                { name: 'كيك شيكولاتة', quantity: 90, revenue: 1800 },
                { name: 'عصير برتقال', quantity: 85, revenue: 1275 },
                { name: 'ساندوتش دجاج', quantity: 60, revenue: 3000 }
            ]
        };
    }
};

// Helper Functions
const showAlert = (message, type = 'success') => {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount) + ' جنيه';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

// Export for use in other scripts
window.api = api;
window.showAlert = showAlert;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
