import Consultation from '../models/Consultation.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendConsultationConfirmationEmail } from '../utils/email.js';

/**
 * Public: Book a Complimentary Consultation
 * POST /api/consultations
 */
export const createConsultation = catchAsync(async (req, res, next) => {
  const { name, email, phone, room, date, time, notes } = req.body;

  if (!name || !email || !phone || !date) {
    return next(new AppError('Please provide full name, email, phone number, and preferred date', 400));
  }

  // Create Consultation record in MongoDB
  const consultation = await Consultation.create({
    name,
    email,
    phone,
    room: room || 'Living Room',
    date,
    time: time || '11:00 AM',
    type: 'phone',
    notes: notes || '',
    status: 'pending',
    isArchived: false
  });

  // Asynchronously dispatch confirmation email without blocking user response
  sendConsultationConfirmationEmail({
    to: consultation.email,
    name: consultation.name,
    consultationNumber: consultation.consultationNumber,
    date: consultation.date,
    time: consultation.time,
    room: consultation.room,
    type: 'phone'
  }).catch((err) => console.warn('[Email Warning] Consultation confirmation email skipped:', err.message));

  res.status(201).json({
    status: 'success',
    message: 'Complimentary consultation booked successfully',
    data: {
      consultation
    }
  });
});

/**
 * Admin: Get All Consultations with Search & Filtering
 * GET /api/admin/consultations or GET /api/consultations
 */
export const adminGetConsultations = catchAsync(async (req, res, next) => {
  const filter = {};

  // Status Filter
  if (req.query.status && req.query.status !== 'all') {
    filter.status = req.query.status;
  }

  // Archive Filter: default to active (non-archived) unless specified
  if (req.query.isArchived === 'true') {
    filter.isArchived = true;
  } else if (req.query.isArchived === 'all') {
    // Show all
  } else {
    filter.isArchived = { $ne: true };
  }

  // Text / Keyword Search
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { room: searchRegex },
      { consultationNumber: searchRegex }
    ];
  }

  const consultations = await Consultation.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: consultations.length,
    data: {
      consultations
    }
  });
});

/**
 * Admin: Get Consultation By ID
 * GET /api/admin/consultations/:id
 */
export const adminGetConsultationById = catchAsync(async (req, res, next) => {
  const consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    return next(new AppError('Consultation inquiry not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      consultation
    }
  });
});

/**
 * Admin: Update Consultation Status / Notes
 * PATCH /api/admin/consultations/:id
 */
export const adminUpdateConsultation = catchAsync(async (req, res, next) => {
  const { status, internalNotes, assignedDesigner, room, date, time } = req.body;

  const updateFields = {};
  if (status) updateFields.status = status;
  if (internalNotes !== undefined) updateFields.internalNotes = internalNotes;
  if (assignedDesigner) updateFields.assignedDesigner = assignedDesigner;
  if (room) updateFields.room = room;
  if (date) updateFields.date = date;
  if (time) updateFields.time = time;

  const consultation = await Consultation.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true
  });

  if (!consultation) {
    return next(new AppError('Consultation inquiry not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Consultation updated successfully',
    data: {
      consultation
    }
  });
});

/**
 * Admin: Soft Delete / Archive Consultation
 * DELETE /api/admin/consultations/:id
 */
export const adminSoftDeleteConsultation = catchAsync(async (req, res, next) => {
  const consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    {
      isArchived: true,
      isDeleted: true,
      deletedAt: new Date()
    },
    { new: true }
  );

  if (!consultation) {
    return next(new AppError('Consultation inquiry not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Consultation archived successfully',
    data: {
      consultation
    }
  });
});

/**
 * Admin: Restore Archived Consultation
 * PATCH /api/admin/consultations/:id/restore
 */
export const adminRestoreConsultation = catchAsync(async (req, res, next) => {
  const consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    {
      isArchived: false,
      isDeleted: false,
      deletedAt: null
    },
    { new: true }
  );

  if (!consultation) {
    return next(new AppError('Consultation inquiry not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Consultation restored successfully',
    data: {
      consultation
    }
  });
});
