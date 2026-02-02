// API Configuration
const API_URL = 'http://localhost:5000/api';

// No Auth Needed - Using dummy token for backend compatibility if checking headers
const getToken = () => "dummy_token";

// API Request Handler
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    ...options
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ في الاتصال بالخادم');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API Methods
const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products${query ? '?' + query : ''}`);
  },

  getProduct: (id) => apiRequest(`/products/${id}`),

  getProductByBarcode: (barcode) => apiRequest(`/products/barcode/${barcode}`),

  createProduct: (productData) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),

  updateProduct: (id, productData) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),

  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE'
  }),

  updateStock: (id, stockData) => apiRequest(`/products/${id}/stock`, {
    method: 'PUT',
    body: JSON.stringify(stockData)
  }),

  getLowStockProducts: () => apiRequest('/products/low-stock'),

  // Customers
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/customers${query ? '?' + query : ''}`);
  },

  getCustomer: (id) => apiRequest(`/customers/${id}`),

  createCustomer: (customerData) => apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData)
  }),

  updateCustomer: (id, customerData) => apiRequest(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customerData)
  }),

  deleteCustomer: (id) => apiRequest(`/customers/${id}`, {
    method: 'DELETE'
  }),

  getCustomerPurchases: (id) => apiRequest(`/customers/${id}/purchases`),

  // Employees
  getEmployees: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/employees${query ? '?' + query : ''}`);
  },

  getEmployee: (id) => apiRequest(`/employees/${id}`),

  createEmployee: (employeeData) => apiRequest('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData)
  }),

  updateEmployee: (id, employeeData) => apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData)
  }),

  deleteEmployee: (id) => apiRequest(`/employees/${id}`, {
    method: 'DELETE'
  }),

  // Invoices
  getInvoices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/invoices${query ? '?' + query : ''}`);
  },

  getInvoice: (id) => apiRequest(`/invoices/${id}`),

  createInvoice: (invoiceData) => apiRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoiceData)
  }),

  cancelInvoice: (id) => apiRequest(`/invoices/${id}`, {
    method: 'DELETE'
  }),

  printInvoice: (id) => apiRequest(`/invoices/${id}/print`),

  // Reports
  getDashboardStats: () => apiRequest('/reports/dashboard'),

  getSalesReport: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/reports/sales?${query}`);
  },

  getInventoryReport: () => apiRequest('/reports/inventory'),

  getProfitReport: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/reports/profit?${query}`);
  },

  getTopProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/reports/top-products${query ? '?' + query : ''}`);
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
  alert.style.animation = 'slideDown 0.3s ease-out';

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.style.animation = 'slideUp 0.3s ease-out';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' جنيه';
};

// Format date
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
