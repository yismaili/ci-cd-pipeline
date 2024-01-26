import React, { useState, useEffect, useRef } from 'react';
import '../UserProfile.css';
import socketIOClient from 'socket.io-client'; 

const UserProfile = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const socketRef = useRef(null); 

  useEffect(() => {
    const token = document.cookie.split("authorization=")[1];
    const socket = socketIOClient('http://localhost:3001',{
      extraHeaders:  { authorization: `Bearer ${token}` }
    });

    socketRef.current = socket; 
    socketRef.current.on('newPost', (createdPost) => {
      setPosts(prevPosts => [...prevPosts, createdPost]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handlePostSubmit = () => {
    if (newPost.trim() !== '') {
      socketRef.current.emit('createUserPost', { post: newPost, userId: user.id });
      setNewPost('');
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="user-info">
        <p>
          <strong>Name:</strong> {user.firstName + ' ' + user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
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
              <li key={post.id}>{post.text}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
