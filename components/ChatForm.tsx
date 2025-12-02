"use client";
import React, { useState } from "react";

export const ChatForm = ({
  onsendMessage,
}: {
  onsendMessage: (message: string) => void;
}) => {
  const [message, SetMessage] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onsendMessage(message);
      SetMessage("");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          onChange={(e) => SetMessage(e.target.value)}
          className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none"
          type="text"
          placeholder="Type your message here ..."
        />
        <button
          type="submit"
          className="px-4 py-2 text-white rounded-lg bg-blue-500 "
        >
          Send
        </button>
      </form>
    </div>
  );
};
