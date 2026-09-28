import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [250, 'Blog title cannot exceed 250 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    excerpt: {
      type: String,
      required: [true, 'Short summary or excerpt is required'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    featuredImage: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' }
    },
    author: {
      name: { type: String, default: 'IHF Editorial Team' },
      avatar: { type: String, default: '' }
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    metaTitle: {
      type: String,
      default: ''
    },
    metaDescription: {
      type: String,
      default: ''
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    readTimeMinutes: {
      type: Number,
      default: 5
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

blogSchema.index({ tags: 1, isPublished: 1, isDeleted: 1 });

blogSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (!this.metaTitle && this.title) {
    this.metaTitle = this.title;
  }
  if (!this.metaDescription && this.excerpt) {
    this.metaDescription = this.excerpt;
  }
  next();
});

blogSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
