"use client";
import { ChatForm } from "@/components/ChatForm";
import { ChatMessage } from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [room, setroom] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState<{ sender: string; message: string }[]>(
    []
  );
  useEffect(() => {
    socket.on("message", (data) => {
      setMessage((prev) => [...prev, data]);
    });
    socket.on("user_joined", (message: string) => {
      setMessage((prev) => [...prev, { sender: "system", message }]);
    });
    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);
  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, userName });
      setIsJoined(true);
    }
  };
  const [userName, setuserName] = useState("");
  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessage((prev) => [
      ...prev,
      { sender: userName, message },
    ]);
    socket.emit('message',data)
  };
  return (
    <div className="flex mt-24 w-full justify-center">
      {!isJoined ? (
        <div className="flex justify-center flex-col items-center">
          <label htmlFor="room">Join a Room</label>
          {/* Input enter username and room id */}
          <div className="flex flex-col gap-2">
            <input
              id="username"
              className="w-full p-2 border-2 rounded-lg focus:outline-none"
              type="text"
              placeholder="Enter Username"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
            />
            <input
              id="room"
              className="w-full p-2 border-2 rounded-lg focus:outline-none"
              type="text"
              placeholder="Enter Room ID"
              value={room}
              onChange={(e) => setroom(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 text-white rounded-lg bg-blue-500 mt-2"
            onClick={handleJoinRoom}
          >
            Join
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room: {room}</h1>
          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
            {message.map((m, index) => (
              <ChatMessage
                key={index}
                message={m.message}
                sender={m.sender}
                isOwnMessage={m.sender === userName}
              />
            ))}
          </div>
          <ChatForm onsendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
