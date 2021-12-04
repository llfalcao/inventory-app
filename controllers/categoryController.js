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
    .then(() => {
      console.log(category, products);
      res.render('categoryDetail', { category, products });
    })
    .catch((err) => next(err));
};

// Display Category create form on GET
exports.categoryCreateGET = (req, res) => {
  res.send('NOT IMPLEMENTED: Category create GET');
};

// Handle Category  create on POST
exports.categoryCreatePOST = (req, res) => {
  res.send('NOT IMPLEMENTED: Category create POST');
};

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
