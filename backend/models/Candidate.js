const mongoose = require('mongoose');
const validator = require('validator');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    minlength: [2, 'Job title must be at least 2 characters long'],
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Reviewed', 'Hired', 'Rejected'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Pending'
  },
  resumeUrl: {
    type: String,
    default: null
  },
  resumeFileName: {
    type: String,
    default: null
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: ''
  }
}, {
  timestamps: true
});

candidateSchema.index({ jobTitle: 1, status: 1 });
candidateSchema.index({ email: 1 });

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
