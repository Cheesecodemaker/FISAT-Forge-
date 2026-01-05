import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CreatePost.css';
import logo from "./assets/logos.png";
import { useNavigate } from "react-router-dom";

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = localStorage.getItem('studentId');

    // ✅ Debugging: Check if userId is available
    if (!userId) {
      alert("Error: User not logged in. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    const postData = {
      author_id: userId,
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    console.log("Submitting post:", postData);

    try {
      const response = await axios.post('http://localhost:5000/posts', postData);

      if (response.status === 201) {
        console.log("Post created successfully:", response.data);
        setTitle('');
        setContent('');
        setTags('');
        onPostCreated();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error('Error creating post:', error.response ? error.response.data : error);
      alert(`Failed to create post: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <nav className="navbar1x">
              <div className="navbar1-containerx">
                <div className="logox">
                <img 
                    src={logo} 
                    alt="FISAT Forge Logo" 
                    className="logo-imagex" 
                    style={{ cursor: "pointer" }} 
                    onClick={() => navigate("/dashboard")} 
                />
      
                  <div className="site-titlex">
                    <h1>FISAT Forge</h1>
                    <p className="subtitlex">Together For Tomorrow</p>
                  </div>
                </div>
              </div>
            </nav>
      <h2 className="create-post-title">Create New Post</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Enter your post title"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
            placeholder="Write your post content..."
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="form-input tags-input"
            placeholder="Enter tags separated by commas (e.g., technology, discussion)"
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

CreatePost.propTypes = {
  onPostCreated: PropTypes.func.isRequired
};

export default CreatePost;
