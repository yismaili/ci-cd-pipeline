import React, { useState } from 'react';
import '../UserProfile.css';

const UserProfile = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = () => {
    if (newPost.trim() !== '') {
      setPosts([...posts, { id: Date.now(), content: newPost }]);
      setNewPost('');
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="user-info">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Age:</strong> {user.age}
        </p>
      </div>

      <div className="post-section">
        <h3>Create a Post</h3>
        <textarea
          rows="4"
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>

      <div className="user-posts">
        <h3>User Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet. Create one!</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>{post.content}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
