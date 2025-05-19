import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // default to 0 if not specified
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  feedbacks: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
});

const Products = mongoose.model("Product", productSchema);

export default Products;
