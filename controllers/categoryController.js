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
  res.render('categoryForm', { title: 'New Category' });
};

// Handle Category  create on POST
exports.categoryCreatePOST = [
  // Validade and sanitize fields
  body('name', 'Category name required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('description', 'Category description required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  // Process request
  (req, res, next) => {
    // Extract errors
    const errors = validationResult(req);
    // Create Category object with escaped data
    const { name, description } = req.body;
    const category = new Category({ name, description });
    // Render form again if any errors are found
    if (!errors.isEmpty()) {
      res.render('categoryForm', {
        title: 'New Category',
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid;
      // Redirect to the category page if it already exists
      Category.findOne({ name })
        .then((foundCategory) => {
          if (foundCategory) {
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
exports.categoryDeleteGET = (req, res, next) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) return next(err);
    if (category === null) res.redirect('/inventory');
    else res.render('categoryDelete', { title: 'Delete category', category });
  });
};

// Handle Category delete on POST
exports.categoryDeletePOST = (req, res) => {
  Category.findByIdAndRemove(req.body.categoryid, (err) => {
    if (err) return next(err);
    res.redirect('/inventory');
  });
};

// Display Category update on GET
exports.categoryUpdateGET = (req, res, next) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) return next(err);
    if (category === null) res.redirect('/inventory');
    else res.render('categoryForm', { title: 'Update category', category });
  });
};

// Handle Category update on POST
exports.categoryUpdatePOST = [
  body('name', 'Category name required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('description', 'Category description required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const { name, description } = req.body;
    const { id } = req.params;
    const category = new Category({ _id: id, name, description });
    if (!errors.isEmpty()) {
      res.render('categoryForm', {
        title: 'Update category',
        category,
        errors: errors.array(),
      });
    } else {
      Category.findByIdAndUpdate(id, category, {}, (err, updatedCategory) => {
        if (err) return next(err);
        res.redirect(updatedCategory.url);
      });
    }
  },
];
