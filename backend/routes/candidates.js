const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const upload = require('../config/multer');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const { status, jobTitle, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (jobTitle) {
      query.jobTitle = { $regex: jobTitle, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const candidates = await Candidate.find(query)
      .select('-resumeData')
      .sort({ createdAt: -1 })
      .populate('referredBy', 'name email');

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const total = await Candidate.countDocuments();
    const pending = await Candidate.countDocuments({ status: 'Pending' });
    const reviewed = await Candidate.countDocuments({ status: 'Reviewed' });
    const hired = await Candidate.countDocuments({ status: 'Hired' });
    const rejected = await Candidate.countDocuments({ status: 'Rejected' });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: {
          pending,
          reviewed,
          hired,
          rejected
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .select('-resumeData')  
      .populate('referredBy', 'name email');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/resume', async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .select('resumeData resumeFileName resumeMimeType');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    if (!candidate.resumeData) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for this candidate'
      });
    }

    const pdfBuffer = Buffer.from(candidate.resumeData, 'base64');

    res.setHeader('Content-Type', candidate.resumeMimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${candidate.resumeFileName || 'resume.pdf'}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

router.post('/', upload.single('resume'), async (req, res, next) => {
  try {
    const { name, email, phone, jobTitle, notes } = req.body;

    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidate with this email already exists'
      });
    }

    const candidateData = {
      name,
      email,
      phone,
      jobTitle,
      notes: notes || ''
    };

    if (req.file) {
      candidateData.resumeData = req.file.buffer.toString('base64');
      candidateData.resumeFileName = req.file.originalname;
      candidateData.resumeMimeType = req.file.mimetype;
    }

    if (req.user) {
      candidateData.referredBy = req.user._id;
    }

    const candidate = await Candidate.create(candidateData);

    const responseData = candidate.toObject();
    delete responseData.resumeData;

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: responseData
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const candidate = await Candidate.findById(req.params.id).select('-resumeData');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    candidate.status = status;
    await candidate.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', upload.single('resume'), async (req, res, next) => {
  try {
    const { name, email, phone, jobTitle, notes } = req.body;

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    if (name) candidate.name = name;
    if (email) candidate.email = email;
    if (phone) candidate.phone = phone;
    if (jobTitle) candidate.jobTitle = jobTitle;
    if (notes !== undefined) candidate.notes = notes;

    if (req.file) {
      candidate.resumeData = req.file.buffer.toString('base64');
      candidate.resumeFileName = req.file.originalname;
      candidate.resumeMimeType = req.file.mimetype;
    }

    await candidate.save();

    const responseData = candidate.toObject();
    delete responseData.resumeData;

    res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: responseData
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    await candidate.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
