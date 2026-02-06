const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const upload = require('../config/multer');
const { protect } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

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

router.post('/', upload.single('resume'), async (req, res, next) => {
  try {
    const { name, email, phone, jobTitle, notes } = req.body;

    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
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
      candidateData.resumeUrl = `/uploads/${req.file.filename}`;
      candidateData.resumeFileName = req.file.originalname;
    }

    if (req.user) {
      candidateData.referredBy = req.user._id;
    }

    const candidate = await Candidate.create(candidateData);

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: candidate
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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

    const candidate = await Candidate.findById(req.params.id);

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
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
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
      if (candidate.resumeUrl) {
        const oldFilePath = path.join(__dirname, '..', candidate.resumeUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      candidate.resumeUrl = `/uploads/${req.file.filename}`;
      candidate.resumeFileName = req.file.originalname;
    }

    await candidate.save();

    res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: candidate
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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

    if (candidate.resumeUrl) {
      const filePath = path.join(__dirname, '..', candidate.resumeUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
