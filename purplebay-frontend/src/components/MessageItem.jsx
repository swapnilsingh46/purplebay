import React from "react";
export default function MessageItem({ message }) {
  const fromMe = message.from === "me" || message.fromMe;
  return (
    <div className={`p-2 mb-2 rounded ${fromMe ? "bg-primary text-white ms-auto" : "bg-light"}`} style={{ maxWidth: "80%" }}>
      <div>{message.text || message.message}</div>
      <small className="text-muted">{new Date(message.createdAt).toLocaleString()}</small>
    </div>
  );
}

