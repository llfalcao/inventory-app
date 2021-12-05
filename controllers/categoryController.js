const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Category = require('../models/category');
const Product = require('../models/product');

// Display list of all categories
exports.categoryList = (req, res) => {
  Category.find({})
    .then((data) =>
      res.render('index', { title: 'Categories', categories: data }),
    )
    .catch((err) => next(err));
};

// Display detail page for a specific category
exports.categoryDetail = (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  let products;
  let category;

  Promise.all([
    Category.findById(id).then((data) => (category = data)),
    Product.find({ category: id })
      .sort({ name: 1 })
      .then((data) => (products = data)),
  ])
    .then(() => res.render('categoryDetail', { category, products }))
    .catch((err) => next(err));
};

// Display Category create form on GET
exports.categoryCreateGET = (req, res, next) => {
  res.render('categoryForm', { title: 'Create Category' });
};

// Handle Category  create on POST
exports.categoryCreatePOST = [
  // Validade and sanitize fields
  body('name', 'Category name required').isLength({ min: 1 }).escape(),
  body('description', 'Category description required')
    .isLength({ min: 1 })
    .escape(),
  // Process request
  (req, res, next) => {
    // Extract errors
    const errors = validationResult(req);
    // Create category object with escaped and trimmed data
    const { name, description } = req.body;
    const category = new Category({ name, description });
    // Render form again if any errors are found
    if (!errors.isEmpty()) {
      res.render('categoryForm', {
        title: 'Create Category',
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      Category.findOne({ name })
        .then((foundCategory) => {
          if (foundCategory) {
            // Redirect to category page if it already exists
            res.redirect(foundCategory.url);
          } else {
            category.save((err) => {
              if (err) return next(err);
              res.redirect(category.url);
            });
          }
        })
        .catch((err) => next(err));
    }
  },
];

// Display Category delete form on GET
exports.categoryDeleteGET = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle Category delete on POST
exports.categoryDeletePOST = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete POST');
};

// Display Category update on GET
exports.categoryUpdateGET = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle Category update on POST
exports.categoryUpdatePOST = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update POST');
};
