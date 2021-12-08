const async = require('async');
const gis = require('g-i-s');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require('./models/product');
const Category = require('./models/category');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];
const products = [];

async function getProductImage(name) {
  return await new Promise((resolve, reject) => {
    gis({ searchTerm: name, queryStringAddition: '&tbs=isz:m' }, (err, res) => {
      if (err) {
        console.error(err);
        resolve('/images/product-image-default.jpg');
      } else {
        resolve(res[0].url);
      }
    });
  });
}

async function productCreate(
  name,
  description,
  category,
  price,
  number_in_stock,
  cb,
) {
  try {
    const image = await getProductImage(name);
    const product = new Product({
      name,
      description,
      category,
      price,
      number_in_stock,
      image,
    });

    product.save((err) => {
      if (err) {
        cb(err, null);
        return;
      }
      console.log(`New Product: ${product}`);
      products.push(product);
      cb(null, product);
    });
  } catch (err) {
    console.log(err);
  }
}

function categoryCreate(name, description, cb) {
  const category = new Category({ name, description });

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Category: ${category}`);
    categories.push(category);
    cb(null, category);
  });
}

function createProducts(cb) {
  async.series(
    [
      function (callback) {
        productCreate(
          'Sandisk',
          'A fast pendrive',
          categories[0],
          4.99,
          2,
          callback,
        );
      },
      function (callback) {
        productCreate(
          'Dell Inspiron',
          'A dell laptop',
          categories[1],
          499.99,
          5,
          callback,
        );
      },
    ],
    cb,
  );
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate('Electronics', 'Various PC parts', callback);
      },
      function (callback) {
        categoryCreate('Laptops', 'All portable', callback);
      },
    ],
    cb,
  );
}

async.series([createCategories, createProducts], (err, results) => {
  err ? console.log('FINAL ERR: ' + err) : console.log('All done');
  mongoose.connection.close();
});
