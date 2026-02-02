const { databases, mapDocument, DATABASE_ID, COLLECTIONS } = require('../config/appwrite');
const sdk = require('node-appwrite');

// @desc    Get all products
// @route   GET /api/products
// @access  Private/Admin
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const search = req.query.search;
    const category = req.query.category;
    
    // Build Queries
    let queries = [
        sdk.Query.limit(limit),
        sdk.Query.offset((page - 1) * limit),
        sdk.Query.orderDesc('$createdAt')
    ];

    if (search) {
        // Appwrite supports search on string attributes
        queries.push(sdk.Query.search('name', search));
    }

    if (category && category !== 'all') {
        queries.push(sdk.Query.equal('category', category));
    }

    const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        queries
    );

    const products = result.documents.map(mapDocument);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total: result.total,
        pages: Math.ceil(result.total / limit),
        page,
        limit
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private/Admin
exports.getProduct = async (req, res, next) => {
  try {
    const product = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        req.params.id
    );

    if (!product) {
        return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
    }

    res.status(200).json({
      success: true,
      data: mapDocument(product)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by barcode
// @route   GET /api/products/barcode/:barcode
// @access  Private/Admin
exports.getProductByBarcode = async (req, res, next) => {
  try {
    const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        [sdk.Query.equal('barcode', req.params.barcode)]
    );

    if (result.documents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: mapDocument(result.documents[0])
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, barcode, category, price, cost, stock, minStock, description } = req.body;

    const product = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        sdk.ID.unique(),
        {
            name,
            barcode,
            category,
            price: parseFloat(price),
            cost: parseFloat(cost),
            stock: parseInt(stock),
            minStock: parseInt(minStock),
            description
        }
    );

    res.status(201).json({
      success: true,
      data: mapDocument(product)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, barcode, category, price, cost, stock, minStock, description } = req.body;

    const product = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        req.params.id,
        {
            name,
            barcode,
            category,
            price: parseFloat(price),
            cost: parseFloat(cost),
            stock: parseInt(stock),
            minStock: parseInt(minStock),
            description
        }
    );

    res.status(200).json({
      success: true,
      data: mapDocument(product)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'تم حذف المنتج بنجاح',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res, next) => {
  try {
    const { quantity, type } = req.body; // type: 'add' or 'subtract' or 'set'

    const product = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        req.params.id
    );

    let newStock = product.stock;

    if (type === 'add') {
      newStock += parseInt(quantity);
    } else if (type === 'subtract') {
       newStock -= parseInt(quantity);
    } else if (type === 'set') {
       newStock = parseInt(quantity);
    }

    const updatedProduct = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        req.params.id,
        { stock: newStock }
    );

    res.status(200).json({
      success: true,
      data: mapDocument(updatedProduct)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private/Admin
exports.getLowStockProducts = async (req, res, next) => {
  try {
    // Appwrite doesn't support field comparison in query yet (e.g. stock <= minStock)
    // So we fetch products with low stock (e.g. < 10) or filter manually
    // For now, we will just fetch all and filter in memory (not efficient for large DB but works for now)
    
    // Alternatively, you can query stock less than a fixed number:
    // sdk.Query.lessThan('stock', 10)
    
    // Let's list all and filter for accuracy with minStock field
    const limit = 100; // max limit
    const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        [sdk.Query.limit(limit)]
    );

    const lowStockProducts = result.documents
        .filter(p => p.stock <= p.minStock)
        .map(mapDocument);

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};
