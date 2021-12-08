const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 250 },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
  image: { type: String, required: true },
});

ProductSchema.virtual('url').get(function () {
  return `/inventory/product/${this._id}`;
});

module.exports = mongoose.model('Product', ProductSchema);
