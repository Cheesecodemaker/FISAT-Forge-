import { useEffect, useState } from 'react';
import axios from 'axios';
import './JobListings.css';
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "./assets/logos.png";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: "",
    postedBy: "",
    status: ""
  });
  const [posters, setPosters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters state changes
    applyFilters();
  }, [filters, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jobs');
      setJobs(response.data || []);
      setFilteredJobs(response.data || []);
      
      // Extract unique posters for the filter dropdown
      const uniquePosters = [...new Set(response.data.map(job => job.posted_by_name))].filter(Boolean);
      setPosters(uniquePosters);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let result = [...jobs];
    
    // Filter by location
    if (filters.location) {
      result = result.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Filter by job type
    if (filters.jobType) {
      result = result.filter(job => 
        job.job_type.toLowerCase() === filters.jobType.toLowerCase()
      );
    }
    
    // Filter by experience level
    if (filters.experience) {
      result = result.filter(job => 
        job.experience_level.toLowerCase() === filters.experience.toLowerCase()
      );
    }
    
    // Filter by posted by
    if (filters.postedBy) {
      result = result.filter(job => 
        job.posted_by_name === filters.postedBy
      );
    }
    
    // Filter by status
    if (filters.status) {
      result = result.filter(job => 
        job.status === filters.status
      );
    }
    
    setFilteredJobs(result);
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      jobType: "",
      experience: "",
      postedBy: "",
      status: ""
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="job-listings-container">
      <nav className="navbar44">
        <div className="navbar44-container">
          <div className="logo">
            <Link to="/dashboard">
              <img src={logo} alt="Logo" />
            </Link>
            <div className="site-title">
              <h1>FISAT Forge</h1>
              <p className="subtitle">Together For Tomorrow</p>
            </div>
          </div>
  
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
      <div className="job-listings-header">
        <h1>Available Job Opportunities</h1>
        <p>Find your next career opportunity</p>
      </div>

      <div className="job-filters">
        <div className="job-filters-grid">
          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <select 
              id="location" 
              name="location" 
              value={filters.location} 
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="jobType">Job Type</label>
            <select 
              id="jobType" 
              name="jobType" 
              value={filters.jobType} 
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="experience">Experience Level</label>
            <select 
              id="experience" 
              name="experience" 
              value={filters.experience} 
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="postedBy">Posted By</label>
            <select 
              id="postedBy" 
              name="postedBy" 
              value={filters.postedBy} 
              onChange={handleFilterChange}
            >
              <option value="">All Posters</option>
              {posters.map((poster, index) => (
                <option key={index} value={poster}>{poster}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="active">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
          <span className="results-count">{filteredJobs.length} jobs found</span>
        </div>
      </div>
      
      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isClosed = job.status === "closed";
            
            return (
              <div key={job._id} className={`job-card ${isClosed ? "closed-job" : ""}`}>
                <div className="job-card-header">
                  <div>
                    <h2 className="job-title">{job.title}</h2>
                    <p className="company-name">{job.company}</p>
                    <p className="posted-by">Posted by: {job.posted_by_name || "Unknown"}</p>
                  </div>
                  <div className="job-card-meta">
                    <span className="post-date">
                      Posted: {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    {isClosed && <span className="status-indicator closed">Closed</span>}
                    {!isClosed && <span className="status-indicator active">Active</span>}
                  </div>
                </div>

                <div className="job-details">
                  <p className="job-description">{job.description}</p>

                  <div className="job-meta">
                    <div className="meta-item">
                      <span className="meta-label">Location</span>
                      <span className="meta-value">{job.location}</span>
                    </div>
                    {job.salary_range && (
                      <div className="meta-item">
                        <span className="meta-label">Salary Range</span>
                        <span className="meta-value">{job.salary_range}</span>
                      </div>
                    )}
                    <div className="meta-item">
                      <span className="meta-label">Application Deadline</span>
                      <span className="meta-value">
                        {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Job Type</span>
                      <span className="meta-value">{job.job_type}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Experience</span>
                      <span className="meta-value">{job.experience_level}</span>
                    </div>
                  </div>

                  <div className="requirements">
                    <h3>Requirements</h3>
                    <p>{job.requirements}</p>
                  </div>
                </div>

                <div className="job-actions">
                  {isClosed ? (
                    <span className="closed-label">Job Closed</span>
                  ) : (
                    <>
                      <button className="apply-button">Apply Now</button>
                      <button className="save-button">Save Job</button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-jobs-message">
            <p>No jobs match your filter criteria. Try adjusting your filters.</p>
            <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}