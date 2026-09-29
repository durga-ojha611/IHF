import CustomizerFlow from '../models/CustomizerFlow.js';
import CustomizerStep from '../models/CustomizerStep.js';
import OptionLayer from '../models/OptionLayer.js';
import CustomizerRule from '../models/CustomizerRule.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import slugify from 'slugify';

// ============================================================================
// 1. FLOW MANAGEMENT CONTROLLERS
// ============================================================================

/**
 * @desc    Fetch all configurator flows (with stats & status badges)
 * @route   GET /api/v1/admin/customizer/flows
 * @access  Private [Admin, Super Admin, Staff]
 */
export const adminGetAllFlows = catchAsync(async (req, res, next) => {
  const { status, includeArchived } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (includeArchived === 'true') filter.includeArchived = true;

  const flows = await CustomizerFlow.find(filter).sort({ createdAt: -1 });

  // Dynamically compute current stats for each flow
  const enrichedFlows = await Promise.all(
    flows.map(async (flow) => {
      const flowObj = flow.toObject ? flow.toObject() : flow;
      const stepCount = await CustomizerStep.countDocuments({
        flowRef: flow._id,
        isArchived: { $ne: true }
      });
      const layerCount = await OptionLayer.countDocuments({
        flowRef: flow._id,
        isArchived: { $ne: true }
      });

      return {
        ...flowObj,
        totalSteps: stepCount || flow.totalSteps || 0,
        totalLayers: layerCount || 0,
        statusBadge: flow.status === 'published' ? `Published v${flow.version}` : (flow.status ? flow.status.toUpperCase() : 'DRAFT')
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: enrichedFlows.length,
    data: {
      flows: enrichedFlows
    }
  });
});

/**
 * @desc    Create a new made-to-measure configurator flow
 * @route   POST /api/v1/admin/customizer/flows
 * @access  Private [Admin, Super Admin]
 */
export const adminCreateFlow = catchAsync(async (req, res, next) => {
  const { name, description, status, version, categoryRef, isDefault } = req.body;

  if (!name || !name.trim()) {
    return next(new AppError('Flow title is required', 400));
  }

  // Generate URL slug
  let slug = slugify(name, { lower: true, strict: true });
  const existingSlug = await CustomizerFlow.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const flow = await CustomizerFlow.create({
    name: name.trim(),
    slug,
    description: description || '',
    status: status || 'draft',
    version: version || 1,
    categoryRef: categoryRef || null,
    isDefault: Boolean(isDefault)
  });

  res.status(201).json({
    status: 'success',
    message: 'New customizer flow created successfully',
    data: {
      flow
    }
  });
});

/**
 * @desc    Get single flow by ID with details
 * @route   GET /api/v1/admin/customizer/flows/:id
 * @access  Private [Admin, Super Admin, Staff]
 */
export const adminGetFlowById = catchAsync(async (req, res, next) => {
  const flow = await CustomizerFlow.findById(req.params.id);
  if (!flow) {
    return next(new AppError('Customizer flow not found', 404));
  }

  const steps = await CustomizerStep.find({
    flowRef: flow._id,
    isArchived: { $ne: true }
  }).sort({ displayOrder: 1 });

  res.status(200).json({
    status: 'success',
    data: {
      flow,
      steps
    }
  });
});

/**
 * @desc    Update flow metadata, publish status, or increment version
 * @route   PUT /api/v1/admin/customizer/flows/:id
 * @access  Private [Admin, Super Admin]
 */
export const adminUpdateFlow = catchAsync(async (req, res, next) => {
  const { name, description, status, version, isDefault } = req.body;
  const flow = await CustomizerFlow.findById(req.params.id);

  if (!flow) {
    return next(new AppError('Customizer flow not found', 404));
  }

  if (name) flow.name = name.trim();
  if (description !== undefined) flow.description = description;
  if (status) flow.status = status;
  if (version !== undefined) flow.version = version;
  if (isDefault !== undefined) flow.isDefault = isDefault;

  await flow.save();

  res.status(200).json({
    status: 'success',
    message: 'Flow updated successfully',
    data: {
      flow
    }
  });
});

/**
 * @desc    Soft-delete / Archive flow (Preserves order integrity)
 * @route   DELETE /api/v1/admin/customizer/flows/:id
 * @access  Private [Admin, Super Admin]
 */
export const adminSoftDeleteFlow = catchAsync(async (req, res, next) => {
  const flow = await CustomizerFlow.findById(req.params.id);
  if (!flow) {
    return next(new AppError('Customizer flow not found', 404));
  }

  flow.isArchived = true;
  flow.status = 'archived';
  await flow.save();

  // Cascade soft-archive associated steps & layers
  await CustomizerStep.updateMany({ flowRef: flow._id }, { isArchived: true });
  await OptionLayer.updateMany({ flowRef: flow._id }, { isArchived: true });

  res.status(200).json({
    status: 'success',
    message: 'Customizer flow and associated steps archived safely.'
  });
});

// ============================================================================
// 2. STEP MANAGEMENT & DRAG-AND-DROP REORDER CONTROLLERS
// ============================================================================

/**
 * @desc    Fetch all steps for a flow sorted by displayOrder with option layers
 * @route   GET /api/v1/admin/customizer/steps/:flowId
 * @access  Private [Admin, Super Admin, Staff]
 */
export const adminGetStepsByFlow = catchAsync(async (req, res, next) => {
  const { flowId } = req.params;

  const flow = await CustomizerFlow.findById(flowId);
  if (!flow) {
    return next(new AppError('Customizer flow not found', 404));
  }

  const steps = await CustomizerStep.find({
    flowRef: flowId,
    isArchived: { $ne: true }
  }).sort({ displayOrder: 1 });

  // Enrich each step with its Option Layers
  const enrichedSteps = await Promise.all(
    steps.map(async (step) => {
      const layers = await OptionLayer.find({
        stepRef: step._id,
        isArchived: { $ne: true }
      }).sort({ displayOrder: 1 });

      const stepObj = step.toObject ? step.toObject() : step;
      return {
        ...stepObj,
        layers: layers || []
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: enrichedSteps.length,
    data: {
      flowId,
      flowTitle: flow.name,
      versionBadge: `Published v${flow.version}`,
      steps: enrichedSteps
    }
  });
});

/**
 * @desc    Create a new customizer step in a flow
 * @route   POST /api/v1/admin/customizer/steps
 * @access  Private [Admin, Super Admin]
 */
export const adminCreateStep = catchAsync(async (req, res, next) => {
  const { flowRef, internalName, stepNumber, heading, description, stepType, isEnabled } = req.body;

  if (!flowRef || !internalName || !heading) {
    return next(new AppError('flowRef, internalName, and heading are required', 400));
  }

  // Calculate next display order
  const highestStep = await CustomizerStep.findOne({ flowRef })
    .sort({ displayOrder: -1 })
    .select('displayOrder');
  const nextOrder = highestStep ? highestStep.displayOrder + 1 : 1;

  const step = await CustomizerStep.create({
    flowRef,
    internalName: internalName.trim(),
    stepNumber: stepNumber || String(nextOrder).padStart(2, '0'),
    displayOrder: nextOrder,
    heading: heading.trim(),
    description: description || 'Guide the customer with concise, reassuring atelier expertise.',
    stepType: stepType || 'custom',
    isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true
  });

  // Automatically create a default "Primary selection" option layer for the new step
  const defaultLayer = await OptionLayer.create({
    stepRef: step._id,
    flowRef,
    layerName: 'Primary selection',
    layerType: 'selection',
    displayOrder: 1,
    visibilityCondition: {
      type: 'always',
      description: 'Always visible'
    },
    optionsArray: []
  });

  res.status(201).json({
    status: 'success',
    message: 'Step created with primary selection layer',
    data: {
      step: {
        ...(step.toObject ? step.toObject() : step),
        layers: [defaultLayer]
      }
    }
  });
});

/**
 * @desc    Update step ordering via Drag-and-Drop payload
 * @route   PUT /api/v1/admin/customizer/steps/reorder
 * @access  Private [Admin, Super Admin]
 * @payload Array of objects: [{ stepId: string, displayOrder: number, stepNumber?: string }]
 */
export const adminReorderSteps = catchAsync(async (req, res, next) => {
  const { reorderedSteps } = req.body;

  if (!Array.isArray(reorderedSteps) || reorderedSteps.length === 0) {
    return next(new AppError('reorderedSteps must be a non-empty array of { stepId, displayOrder }', 400));
  }

  // Execute bulk updates in parallel
  const updatePromises = reorderedSteps.map((item, index) => {
    const newOrder = item.displayOrder !== undefined ? item.displayOrder : index + 1;
    const formattedStepNum = item.stepNumber || String(newOrder).padStart(2, '0');

    return CustomizerStep.findByIdAndUpdate(
      item.stepId,
      {
        displayOrder: newOrder,
        stepNumber: formattedStepNum
      },
      { new: true }
    );
  });

  const results = await Promise.all(updatePromises);

  res.status(200).json({
    status: 'success',
    message: 'Step display sequence updated successfully',
    data: {
      reorderedCount: results.filter(Boolean).length
    }
  });
});

/**
 * @desc    Update step metadata (names, headings, descriptions, status toggle)
 * @route   PUT /api/v1/admin/customizer/steps/:stepId
 * @access  Private [Admin, Super Admin]
 */
export const adminUpdateStep = catchAsync(async (req, res, next) => {
  const { stepId } = req.params;
  const { internalName, stepNumber, heading, description, isEnabled, stepType, metadata } = req.body;

  const step = await CustomizerStep.findById(stepId);
  if (!step) {
    return next(new AppError('Customizer step not found', 404));
  }

  if (internalName !== undefined) step.internalName = internalName.trim();
  if (stepNumber !== undefined) step.stepNumber = stepNumber.trim();
  if (heading !== undefined) step.heading = heading.trim();
  if (description !== undefined) step.description = description;
  if (isEnabled !== undefined) step.isEnabled = Boolean(isEnabled);
  if (stepType !== undefined) step.stepType = stepType;
  if (metadata !== undefined) step.metadata = metadata;

  await step.save();

  res.status(200).json({
    status: 'success',
    message: 'Step metadata updated successfully',
    data: {
      step
    }
  });
});

/**
 * @desc    Soft-delete / Archive a step
 * @route   DELETE /api/v1/admin/customizer/steps/:stepId
 * @access  Private [Admin, Super Admin]
 */
export const adminSoftDeleteStep = catchAsync(async (req, res, next) => {
  const { stepId } = req.params;

  const step = await CustomizerStep.findById(stepId);
  if (!step) {
    return next(new AppError('Customizer step not found', 404));
  }

  step.isArchived = true;
  await step.save();

  // Cascade soft-archive child layers
  await OptionLayer.updateMany({ stepRef: step._id }, { isArchived: true });

  res.status(200).json({
    status: 'success',
    message: 'Step archived successfully without breaking order history.'
  });
});

// ============================================================================
// 3. OPTION LAYERS & CONDITIONAL VISIBILITY CONTROLLERS
// ============================================================================

/**
 * @desc    Add / Configure option layers inside a step
 * @route   POST /api/v1/admin/customizer/layers
 * @access  Private [Admin, Super Admin]
 */
export const adminCreateOptionLayer = catchAsync(async (req, res, next) => {
  const { stepRef, layerName, layerType, visibilityCondition, optionsArray, layerConfigTrigger } = req.body;

  if (!stepRef || !layerName) {
    return next(new AppError('stepRef and layerName are required', 400));
  }

  const step = await CustomizerStep.findById(stepRef);
  if (!step) {
    return next(new AppError('Parent customizer step not found', 404));
  }

  // Compute next layer order inside this step
  const highestLayer = await OptionLayer.findOne({ stepRef })
    .sort({ displayOrder: -1 })
    .select('displayOrder');
  const nextOrder = highestLayer ? highestLayer.displayOrder + 1 : 1;

  const layer = await OptionLayer.create({
    stepRef,
    flowRef: step.flowRef,
    layerName: layerName.trim(),
    layerType: layerType || 'selection',
    displayOrder: nextOrder,
    layerConfigTrigger: layerConfigTrigger || '',
    visibilityCondition: visibilityCondition || {
      type: 'always',
      description: 'Always visible'
    },
    optionsArray: Array.isArray(optionsArray) ? optionsArray : []
  });

  res.status(201).json({
    status: 'success',
    message: 'Option layer configured successfully',
    data: {
      layer
    }
  });
});

/**
 * @desc    Update option layer (options array, visibility rules, layer name)
 * @route   PUT /api/v1/admin/customizer/layers/:layerId
 * @access  Private [Admin, Super Admin]
 */
export const adminUpdateOptionLayer = catchAsync(async (req, res, next) => {
  const { layerId } = req.params;
  const { layerName, layerType, visibilityCondition, optionsArray, layerConfigTrigger, displayOrder } = req.body;

  const layer = await OptionLayer.findById(layerId);
  if (!layer) {
    return next(new AppError('Option layer not found', 404));
  }

  if (layerName !== undefined) layer.layerName = layerName.trim();
  if (layerType !== undefined) layer.layerType = layerType;
  if (displayOrder !== undefined) layer.displayOrder = displayOrder;
  if (visibilityCondition !== undefined) layer.visibilityCondition = visibilityCondition;
  if (optionsArray !== undefined && Array.isArray(optionsArray)) layer.optionsArray = optionsArray;
  if (layerConfigTrigger !== undefined) layer.layerConfigTrigger = layerConfigTrigger;

  await layer.save();

  res.status(200).json({
    status: 'success',
    message: 'Option layer updated successfully',
    data: {
      layer
    }
  });
});

/**
 * @desc    Soft-delete / Archive an option layer
 * @route   DELETE /api/v1/admin/customizer/layers/:layerId
 * @access  Private [Admin, Super Admin]
 */
export const adminSoftDeleteOptionLayer = catchAsync(async (req, res, next) => {
  const { layerId } = req.params;

  const layer = await OptionLayer.findById(layerId);
  if (!layer) {
    return next(new AppError('Option layer not found', 404));
  }

  layer.isArchived = true;
  await layer.save();

  res.status(200).json({
    status: 'success',
    message: 'Option layer archived successfully.'
  });
});

// ============================================================================
// 4. CLIENT LIVE PREVIEW PAYLOAD SYNC
// ============================================================================

/**
 * @desc    Client & Mobile Live-Preview Endpoint
 *          Emits compiled JSON payload to render step choices in real-time
 * @route   GET /api/v1/client/customizer/live-preview/:flowId
 * @access  Public
 */
export const clientGetLivePreview = catchAsync(async (req, res, next) => {
  const { flowId } = req.params;

  let flow;
  if (flowId === 'default' || flowId === 'active') {
    flow = await CustomizerFlow.findOne({ status: 'published', isDefault: true }) ||
           await CustomizerFlow.findOne({ status: 'published' }) ||
           await CustomizerFlow.findOne();
  } else {
    flow = await CustomizerFlow.findById(flowId);
  }

  if (!flow) {
    return next(new AppError('Configurator flow not found or published', 404));
  }

  // Fetch only active, non-archived steps sorted by displayOrder
  const steps = await CustomizerStep.find({
    flowRef: flow._id,
    isEnabled: true,
    isArchived: { $ne: true }
  }).sort({ displayOrder: 1 });

  // Compile active layers and choices
  const compiledSteps = await Promise.all(
    steps.map(async (step) => {
      const layers = await OptionLayer.find({
        stepRef: step._id,
        isArchived: { $ne: true }
      }).sort({ displayOrder: 1 });

      return {
        id: step._id,
        stepNumber: step.stepNumber,
        internalName: step.internalName,
        heading: step.heading,
        description: step.description,
        stepType: step.stepType,
        layers: layers.map((layer) => ({
          layerId: layer._id,
          name: layer.layerName,
          type: layer.layerType,
          visibility: layer.visibilityCondition,
          options: layer.optionsArray.filter((opt) => opt.isEnabled !== false)
        }))
      };
    })
  );

  // Fetch standard global rules (dimensional limits, allowances, formulas)
  const globalRules = await CustomizerRule.findOne({ isActive: true }) || {};

  res.status(200).json({
    status: 'success',
    data: {
      flow: {
        id: flow._id,
        title: flow.name,
        slug: flow.slug,
        version: flow.version,
        statusBadge: `Published v${flow.version}`
      },
      constraints: globalRules.constraints || {
        minWidthInches: 24,
        maxWidthInches: 240,
        minHeightInches: 36,
        maxHeightInches: 200,
        allowedFractions: ['', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8']
      },
      steps: compiledSteps,
      syncedAt: new Date().toISOString()
    }
  });
});
