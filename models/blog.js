// models/blog.js
const { Schema, models, model } = require("mongoose");

const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: String, required: true },
  status: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

// ✅ Always use 'Blog' (capitalized) to match Mongoose's internal model name
const Blog = models.Blog || model('Blog', BlogSchema);

// ✅ Export properly
module.exports = { Blog };
