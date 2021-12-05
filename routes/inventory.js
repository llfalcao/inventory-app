const express = require('express');
const router = express.Router();

// Require controller modules
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');

// Category Routes

// GET request for creating a Category
router.get('/category/new', categoryController.categoryCreateGET);

// POST request for creating a Category
router.post('/category/new', categoryController.categoryCreatePOST);

// GET request to delete Category
router.get('/category/:id/delete', categoryController.categoryDeleteGET);

// POST request to delete Category
router.post('/category/:id/delete', categoryController.categoryDeletePOST);

// GET request to update Category
router.get('/category/:id/edit', categoryController.categoryUpdateGET);

// POST request to update Category
router.post('/category/:id/edit', categoryController.categoryUpdatePOST);

// GET request for one Category
router.get('/category/:id', categoryController.categoryDetail);

// GET request for list of all Categories
router.get('/', categoryController.categoryList);

// Product Routes

// GET request for creating a Product
router.get('/product/new', productController.productCreateGET);

// POST request for creating a Product
router.post('/product/new', productController.productCreatePOST);

// GET request to delete Product
router.get('/product/:id/delete', productController.productDeleteGET);

// POST request to delete Product
router.post('/product/:id/delete', productController.productDeletePOST);

// GET request to update Product
router.get('/product/:id/edit', productController.productUpdateGET);

// POST request to upd ate Product
router.post('/product/:id/edit', productController.productUpdatePOST);

// GET request for one Product
router.get('/product/:id', productController.productDetail);

// GET request for list of all Products
router.get('/products', productController.productList);

module.exports = router;
