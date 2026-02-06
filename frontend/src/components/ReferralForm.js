import React, { useState } from 'react';
import { candidateAPI } from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ReferralForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    notes: '',
    resume: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        e.target.value = '';
        return;
      }
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.jobTitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await candidateAPI.create(formData);
      toast.success('Candidate referred successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to refer candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header">
          <h1 className="page-title">Refer a Candidate</h1>
          <p className="page-subtitle">Help us find great talent</p>
        </div>

        <motion.form
          className="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="form-group">
            <label className="form-label required">Candidate Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="candidate@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+1-555-0123"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              className="form-input"
              placeholder="e.g., Senior Software Engineer"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              className="form-textarea"
              placeholder="Additional information about the candidate..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Resume (PDF only)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="resume" className="file-input-label">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{formData.resume ? formData.resume.name : 'Click to upload PDF'}</span>
              </label>
            </div>
            {formData.resume && (
              <div className="file-name">
                ✓ {formData.resume.name} ({(formData.resume.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Submit Referral</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ReferralForm;
