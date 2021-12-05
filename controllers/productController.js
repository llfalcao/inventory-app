const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Product = require('../models/product');
const Category = require('../models/category');

// Display list of all Products
exports.productList = (req, res) => {
  Product.find({})
    .populate('category')
    .sort({ name: 1 })
    .then((data) =>
      res.render('productList', { title: 'Products', products: data }),
    )
    .catch((err) => next(err));
};

// Display detail page for a specific Product
exports.productDetail = (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  Product.findById(id)
    .then((data) => res.render('productDetail', { product: data }))
    .catch((err) => next(err));
};

// Display Product create form on GET
exports.productCreateGET = (req, res, next) => {
  Category.find({})
    .sort({ name: 1 })
    .then((data) =>
      res.render('productForm', { title: 'Add New Product', categories: data }),
    )
    .catch((err) => next(err));
};

// Handle Product create form on POST
exports.productCreatePOST = (req, res) => {
  res.send('NOT IMPLEMENTED: Product create POST');
};

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
