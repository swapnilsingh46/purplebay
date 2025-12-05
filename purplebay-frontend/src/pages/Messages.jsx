// This page shows a chat conversation with a specific user and lets you send messages.
// It loads messages repeatedly using polling and updates the UI in real time.

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getMessagesWithUser, sendMessage } from "../services/messageService";
import { chatValidator } from "../utils/validators";
import MessageItem from "../components/MessageItem";

export default function Messages() {
  const { userId } = useParams(); // Get the user ID from the URL

  // Store messages, text input, and validation errors
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [errors, setErrors] = useState({});

  // Keep reference to polling interval
  const pollRef = useRef(null);

  // Fetch conversation messages from API
  const fetchMessages = async () => {
    try {
      const res = await getMessagesWithUser(userId);
      setMessages(res || []); // Update messages
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  // Run when the component loads or userId changes
  useEffect(() => {
    fetchMessages(); // Load messages immediately

    // Poll messages every 2.5 seconds to simulate real-time chat
    pollRef.current = setInterval(fetchMessages, 2500);

    // Clear interval when leaving the page
    return () => clearInterval(pollRef.current);
  }, [userId]);

  // Handle sending a message
  const submit = async (e) => {
    e.preventDefault();
    try {
      // Validate message text
      await chatValidator.validate({ text }, { abortEarly: false });

      // Send message to backend
      const res = await sendMessage(userId, text);

      // Add new message to chat
      setMessages(prev => [...prev, res.message]);

      setText(""); // Clear input box
      setErrors({}); // Clear errors
    } catch (err) {
      // If validator sends multiple errors
      if (err.inner) {
        const errs = {};
        err.inner.forEach(e => (errs[e.path] = e.message));
        setErrors(errs);
      } else {
        alert("Failed to send message");
      }
    }
  };

  return (
    <div>
      <h3>Messages</h3>

      {/* Message container with scroll */}
      <div className="mb-3" style={{ maxHeight: 400, overflowY: "auto" }}>
        {messages.map(m => (
          <MessageItem key={m._id} message={m} />
        ))}
      </div>

      {/* Send message form */}
      <form className="d-flex" onSubmit={submit}>
        <input
          className="form-control me-2"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message"
        />

        {/* Display validation error */}
        {errors.text && <small className="text-danger">{errors.text}</small>}

        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}
