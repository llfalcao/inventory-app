const Product = require('../models/product');

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
  res.send(`NOT IMPLEMENTED: Product detail: ${req.params.id}`);
};

// Display Product create form on GET
exports.productCreateGET = (req, res) => {
  res.send('NOT IMPLEMENTED: Product create GET');
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
