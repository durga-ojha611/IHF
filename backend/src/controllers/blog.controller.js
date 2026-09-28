import Blog from '../models/Blog.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

/**
 * Public: Get published editorial blogs
 */
export const getPublishedBlogs = catchAsync(async (req, res, next) => {
  const query = { isPublished: true, isDeleted: false };
  if (req.query.tag) {
    query.tags = req.query.tag.toLowerCase();
  }

  const features = new APIFeatures(Blog.find(query), req.query)
    .search(['title', 'excerpt', 'content'])
    .sort()
    .paginate();

  const blogs = await features.query;
  const total = await Blog.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    total,
    data: {
      blogs
    }
  });
});

/**
 * Public: Get single blog post by slug
 */
export const getBlogBySlug = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    isPublished: true
  });

  if (!blog) {
    return next(new AppError('Blog article not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog
    }
  });
});

/**
 * Admin: Get all blogs
 */
export const adminGetAllBlogs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Blog.find(), req.query)
    .search(['title', 'excerpt'])
    .filter()
    .sort()
    .paginate();

  const blogs = await features.query;
  const total = await Blog.countDocuments();

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    total,
    data: {
      blogs
    }
  });
});

/**
 * Admin: Create blog article
 */
export const adminCreateBlog = catchAsync(async (req, res, next) => {
  const newBlog = await Blog.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      blog: newBlog
    }
  });
});

/**
 * Admin: Update blog
 */
export const adminUpdateBlog = catchAsync(async (req, res, next) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedBlog) {
    return next(new AppError('Blog article not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog: updatedBlog
    }
  });
});

/**
 * Admin: Soft Delete blog
 */
export const adminDeleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: Date.now() },
    { new: true }
  );

  if (!blog) {
    return next(new AppError('Blog article not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Blog article soft-deleted successfully'
  });
});

export default {
  getPublishedBlogs,
  getBlogBySlug,
  adminGetAllBlogs,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog
};
