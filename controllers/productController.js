const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Product = require('../models/product');
const Category = require('../models/category');

async function getCategories() {
  const results = Category.find({})
    .sort({ name: 1 })
    .then((data) => data);
  return results;
}

// Display list of all Products
exports.productList = (req, res) => {
  Product.find({})
    .populate('category')
    .sort({ name: 1 })
    .then((products) =>
      res.render('productList', { title: 'Products', products }),
    )
    .catch((err) => next(err));
};

// Display detail page for a specific Product
exports.productDetail = (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  Product.findById(id)
    .populate('category')
    .then((product) => res.render('productDetail', { product }))
    .catch((err) => next(err));
};

// Display Product create form on GET
exports.productCreateGET = (req, res, next) => {
  getCategories()
    .then((categories) =>
      res.render('productForm', { title: 'New Product', categories }),
    )
    .catch((err) => next(err));
};

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
    // Extract errors
    const errors = validationResult(req);
    // Create Product object
    const { name, description, category, price, number_in_stock } = req.body;
    const foundCategory = await Category.findOne({ name: category });
    const product = new Product({
      name,
      description,
      category: foundCategory,
      price,
      number_in_stock,
    });
    // Render form again if there are errors
    if (!errors.isEmpty()) {
      getCategories().then((categories) =>
        res.render('productForm', {
          title: 'New Product',
          product,
          categories,
          errors: errors.array(),
        }),
      );
      return;
    } else {
      // Data from form is valid;
      // Redirect to the PDP if it already exists
      Product.findOne({ name })
        .then((foundProduct) => {
          if (foundProduct) {
            res.redirect(foundProduct.url);
          } else {
            product.save((err) => {
              if (err) return next(err);
              res.redirect(product.url);
            });
          }
        })
        .catch((err) => next(err));
    }
  },
];

// Display Product delete form on GET
exports.productDeleteGET = (req, res) => {
  res.send('NOT IMPLEMENTED: Product delete GET');
};

// Handle Product delete on POST
exports.productDeletePOST = (req, res) => {
  res.send('NOT IMPLEMENTED: Product delete POST');
};

// Display Product update form on GET
exports.productUpdateGET = (req, res) => {
  res.send('NOT IMPLEMENTED: Product update GET');
};

// Handle Product update on POST
exports.productUpdatePOST = (req, res) => {
  res.send('NOT IMPLEMENTED: Product update POST');
};
