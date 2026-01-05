import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import './PostList.css';
import { Link, useNavigate } from "react-router-dom"; // ✅ Import for navigation
import { FaSignOutAlt } from "react-icons/fa"; // ✅ Import Logout icon
import logo from "./assets/logos.png";


function PostList() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const currentUserId = localStorage.getItem('studentId');
  const navigate = useNavigate(); // ✅ Added for Logout
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    navigate("/login"); // ✅ Redirect to Login
  };
  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/posts/${postId}/like`, {
        userId: currentUserId
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/posts/${postId}/comment`, {
        userId: currentUserId,
        content: newComment
      });
      setNewComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const togglePostExpansion = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="post-list">
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

          {/* ✅ Logout Button */}
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
      <div className="community-heading">
      <h1>Community Posts</h1>
      <p>Stay updated with the latest discussions and shared knowledge!</p>
    </div>
      {posts.map((post) => (
        <div key={post._id} className={`post-card ${expandedPostId === post._id ? 'expanded' : ''}`}>
          
          {/* Post Header */}
          <div className="post-header" onClick={() => togglePostExpansion(post._id)}>
            <img
              src={post.authorProfileImage || '/default-avatar.png'}
              alt="Author"
              className="author-avatar"
            />
            <div className="author-info">
              <h3 className="author-name">{post.authorName}</h3>
              <p className="post-time">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Post Title */}
          <h2 className="post-title" onClick={() => togglePostExpansion(post._id)}>
            {post.title}
          </h2>

          {/* Post Content - Visible only when expanded */}
          {expandedPostId === post._id && (
            <div className="post-content">
              <p>{post.content}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="tags-container">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Post Actions */}
          <div className="post-actions">
            <button onClick={() => handleLike(post._id)} className={`action-button ${post.likes.includes(currentUserId) ? 'liked' : ''}`}>
              <span>{post.likes.length} Likes</span>
            </button>
            <button onClick={() => toggleComments(post._id)} className="action-button">
              <span>{post.comments.length} Comments</span>
            </button>
          </div>

          {/* Comments Section - Visible only when expanded */}
          {expandedComments[post._id] && (
            <div className="comments-section">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
                placeholder="Write a comment..."
              />
              <button onClick={() => handleComment(post._id)} className="comment-button">
                Post Comment
              </button>

              {post.comments.length > 0 && (
                <div className="comments-list">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="comment-card">
                      <div className="comment-header">
                        <img
                          src={comment.authorProfileImage || '/default-avatar.png'}
                          alt="Commenter"
                          className="commenter-avatar"
                        />
                        <span className="commenter-name">{comment.authorName}</span>
                        <span className="comment-time">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostList;
