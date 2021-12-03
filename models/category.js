const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 100 },
});

// TODO: Virtual URL
CategorySchema.virtual('url').get(() => `/inventory/category/${this._id}`);

module.exports = mongoose.model('Category', CategorySchema);
