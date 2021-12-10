const gis = require('g-i-s');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require('../models/product');
const Category = require('../models/category');

const defaultCategories = require('./default-categories.json');
const defaultProducts = require('./default-products.json');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];

async function getProductImage(name) {
  return await new Promise((resolve, reject) => {
    gis({ searchTerm: name, queryStringAddition: '&tbs=isz:m' }, (err, res) => {
      if (err) {
        console.error(err);
        resolve('/images/product-image-default.jpg');
      } else {
        try {
          resolve(res[0].url);
        } catch (err) {
          resolve('/images/product-image-default.jpg');
        }
      }
    });
  });
}

(async function () {
  // Load categories
  await Promise.all(
    defaultCategories.map((el) => {
      return new Promise((resolve, reject) => {
        const category = new Category({
          name: el.name,
          description: el.description,
        });

        category.save((err) => {
          if (err) return console.error(err);
          console.log(`New Category: ${category}`);
          categories.push(category);
          resolve();
        });
      });
    }),
  );

  // Load products
  await Promise.all(
    defaultProducts.map((el) => {
      return new Promise(async (resolve, reject) => {
        const product = new Product({
          name: el.name,
          description: el.name, // temporary, probably
          category: categories.find(
            (category) => category.name === el.category,
          ),
          price: (Math.round(Math.random() * 3) * 100 + 99).toFixed(2),
          number_in_stock: Math.round(Math.random() * 200),
          image: await getProductImage(el.name),
        });

        product.save((err) => {
          if (err) return console.error(err);
          console.log(`New Product: ${product}`);
          resolve();
        });
      });
    }),
  );

  mongoose.connection.close();
})();
