const { body, validationResult } = require('express-validator');
const gis = require('g-i-s');

const Product = require('../models/product');
const Category = require('../models/category');

async function getCategories() {
  const categories = await Category.find({})
    .sort({ name: 1 })
    .then((data) => data);
  return categories;
}

// Display list of all Products
exports.productList = (req, res, next) => {
  Product.find({})
    .populate('category')
    .sort({ name: 1 })
    .exec((err, products) => {
      if (err) return next(err);
      res.render('productList', { title: 'Products', products });
    });
};

// Display detail page for a specific Product
exports.productDetail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .exec();
    res.render('productDetail', { product });
  } catch (err) {
    return next(err);
  }
};

// Display Product create form on GET
exports.productCreateGET = async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.render('productForm', { title: 'New Product', categories });
  } catch (err) {
    return next(err);
  }
};

async function getProductImage(name) {
  return await new Promise((resolve, reject) => {
    gis({ searchTerm: name, queryStringAddition: '&tbs=isz:m' }, (err, res) => {
      if (err) {
        console.log(err);
        resolve('/images/product-image-default.jpg');
      } else {
        resolve(res[0].url);
      }
    });
  });
}

// Handle Product create form on POST
exports.productCreatePOST = [
  // Validate fields
  body('name', 'Product name required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('description', 'Product description required')
    .trim()
    .isLength({ min: 1, max: 250 })
    .escape(),
  body('category', 'Product category required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('price', 'Price must be a number').trim().isNumeric(),
  body('number_in_stock', 'Stock must be a number').trim().isNumeric(),
  // Process request
  async (req, res, next) => {
    const errors = validationResult(req);
    // Create Product object
    const category = await Category.findOne({ name: req.body.category }).exec();
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      image: await getProductImage(req.body.name),
    });
    // Render form again if there are errors
    if (!errors.isEmpty()) {
      try {
        const categories = await getCategories();
        res.render('productForm', {
          title: 'New Product',
          product,
          categories,
          errors: errors.array(),
        });
      } catch (err) {
        return next(err);
      }
      return;
    } else {
      // Data from form is valid;
      // Redirect to the PDP if it already exists
      Product.findOne({ name: req.body.name }).exec((err, foundProduct) => {
        if (err) return next(err);
        if (foundProduct) {
          res.redirect(foundProduct.url);
        } else {
          product.save((err) => {
            if (err) return next(err);
            res.redirect(product.url);
          });
        }
      });
    }
  },
];

// Display Product delete form on GET
exports.productDeleteGET = (req, res, next) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) return next(err);
    if (product === null) res.redirect('/inventory/products');
    else res.render('productDelete', { title: 'Delete product', product });
  });
};

// Handle Product delete on POST
exports.productDeletePOST = (req, res, next) => {
  Product.findByIdAndRemove(req.body.productid, (err) => {
    if (err) return next(err);
    res.redirect('/inventory/products');
  });
};

// Display Product update form on GET
exports.productUpdateGET = (req, res, next) => {
  // Get list of categories and the product that's being updated
  Promise.all([
    getCategories().then((categories) => categories),
    Product.findById(req.params.id)
      .populate('category')
      .then((product) => product),
  ])
    .then(([categories, product]) =>
      res.render('productForm', {
        title: 'Update product',
        product,
        categories,
      }),
    )
    .catch((err) => next(err));
};

// Handle Product update on POST
exports.productUpdatePOST = [
  body('name', 'Product name required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('description', 'Product description required')
    .trim()
    .isLength({ min: 1, max: 250 })
    .escape(),
  body('category', 'Product category required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('price', 'Price must be a number').trim().isNumeric(),
  body('number_in_stock', 'Stock must be a number').trim().isNumeric(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const { name, description, price, number_in_stock } = req.body;
    const { id: _id } = req.params;
    const category = await Category.findOne({ name: req.body.category });
    const product = new Product({
      _id,
      name,
      description,
      category,
      price,
      number_in_stock,
    });

    if (!errors.isEmpty()) {
      res.render('productForm', {
        title: 'Update product',
        product,
        errors: errors.array(),
      });
    } else {
      Product.findByIdAndUpdate(_id, product, {}, (err, updatedProduct) => {
        if (err) return next(err);
        res.redirect(updatedProduct.url);
      });
    }
  },
];
