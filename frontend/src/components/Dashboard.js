import React, { useState, useEffect } from 'react';
import { candidateAPI } from '../api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [statusFilter, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }

      const [candidatesRes, statsRes] = await Promise.all([
        candidateAPI.getAll(params),
        candidateAPI.getStats()
      ]);

      setCandidates(candidatesRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      await candidateAPI.updateStatus(candidateId, newStatus);
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await candidateAPI.delete(candidateId);
        toast.success('Candidate deleted successfully');
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete candidate');
      }
    }
  };

  if (loading && !candidates.length) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Manage and track candidate referrals</p>
        </div>

        {stats && (
          <div className="stats-grid">
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="stat-label">Total Candidates</div>
              <div className="stat-value">{stats.total}</div>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-label">Pending</div>
              <div className="stat-value">{stats.byStatus.pending}</div>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-label">Reviewed</div>
              <div className="stat-value">{stats.byStatus.reviewed}</div>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="stat-label">Hired</div>
              <div className="stat-value">{stats.byStatus.hired}</div>
            </motion.div>
          </div>
        )}

        <div className="search-filter">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {candidates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No candidates found</h3>
            <p>Try adjusting your filters or add a new candidate</p>
          </div>
        ) : (
          <div className="candidates-grid">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate._id}
                className="candidate-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="candidate-header">
                  <div>
                    <h3 className="candidate-name">{candidate.name}</h3>
                    <p className="candidate-job">{candidate.jobTitle}</p>
                  </div>
                  <span className={`status-badge ${candidate.status.toLowerCase()}`}>
                    {candidate.status}
                  </span>
                </div>

                <div className="candidate-details">
                  <div className="detail-row">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{candidate.email}</span>
                  </div>
                  <div className="detail-row">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{candidate.phone}</span>
                  </div>
                  {candidate.resumeUrl && (
                    <div className="detail-row">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <a href={`http://localhost:5000${candidate.resumeUrl}`} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent)'}}>
                        View Resume
                      </a>
                    </div>
                  )}
                </div>

                <div className="candidate-actions">
                  <select
                    className="status-select"
                    value={candidate.status}
                    onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => handleDelete(candidate._id)}
                    title="Delete candidate"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
