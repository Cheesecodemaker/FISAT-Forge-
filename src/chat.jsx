import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./chat.css";

// Create socket connection outside component to avoid reconnecting on re-renders
const socket = io("http://localhost:5000");

const Chat = () => {
  const { userId, recipientId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientDetails, setRecipientDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch recipient details
  useEffect(() => {
    const fetchRecipientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${recipientId}`);
        setRecipientDetails(response.data);
      } catch (err) {
        console.error("Error fetching recipient details:", err);
        setError("Could not load recipient details");
      }
    };

    fetchRecipientDetails();
  }, [recipientId]);

  // Fetch messages and set up socket connection
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/messages/${userId}/${recipientId}`);
        setMessages(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Join the chat room (sorted to ensure both users join the same room)
    const chatRoom = [userId, recipientId].sort().join("-");
    socket.emit("joinRoom", chatRoom);

    // Listen for new messages
    const handleReceiveMessage = (message) => {
      // Only add message if it's relevant to this chat
      if ((message.senderId === userId && message.recipientId === recipientId) || 
          (message.senderId === recipientId && message.recipientId === userId)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Clean up socket listeners when component unmounts
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [userId, recipientId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Emit the message through socket
      socket.emit("sendMessage", { 
        senderId: userId, 
        recipientId, 
        message: newMessage 
      });

      // Add the message locally
      // Note: We'll get the message back through the socket, but adding it immediately improves UX
      setMessages([...messages, { 
        senderId: userId, 
        recipientId, 
        message: newMessage,
        createdAt: new Date()
      }]);
      
      // Clear the input
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) return <div className="loading">Loading messages...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <div className="recipient-info">
          <h2>{recipientDetails?.Name || "Chat"}</h2>
          <p>{recipientDetails?.Email || ""}</p>
        </div>
      </div>
      
      <div className="chat-box">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-message ${msg.senderId === userId ? "sent" : "received"}`}
            >
              <p>{msg.message}</p>
              <span className="timestamp">{formatTime(msg.createdAt)}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;