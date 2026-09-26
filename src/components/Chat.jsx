import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);

  const userId = user?._id;
  const [message, setMessage] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  // UI-only: shows a loading state instead of a blank box while the chat history loads
  const [isLoading, setIsLoading] = useState(true);

  // UI-only: reflects THIS browser's own socket connection to the server —
  // it says nothing about whether targetUserId is online, since the server
  // isn't sending any presence info about the other person right now.
  const [isConnected, setIsConnected] = useState(false);

  // UI-only: marks the bottom of the message list so we can auto-scroll to it
  const messagesEndRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      console.log(chat.data.messages);

      const chatMessages = chat?.data?.messages.map((msg) => {
        return {
          firstName: msg?.senderId?.firstName,
          lastName: msg?.senderId?.lastName,
          text: msg?.text,
        };
      });
      setMessage(chatMessages);
    } catch (err) {
      console.error(err);
    } finally {
      // UI-only: the request has settled (success or failure), so stop showing the loader
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    // Wait until the logged-in user's ID is available
    if (!userId) {
      console.log("Waiting for userId...");
      return;
    }
    // Make sure the chat target exists in the URL
    if (!targetUserId) {
      console.log("targetUserId missing");
      return;
    }
    const socket = createSocketConnection();
    socket.on("connect", () => {
      //as soon as page load the socket connection is made and joinChat event is emitted
      socket.emit("joinChat", {
        firstName: user?.firstName,
        userId,
        targetUserId,
      });
      setIsConnected(true); // UI-only: flips the header status dot to "connected"
    });

    socket.on("messageReceived", ({ firstName, text }) => {
      console.log(firstName + ":" + text);
      setMessage((message) => [...message, { firstName, text }]);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
      setIsConnected(false); // UI-only: reflects the failed connection in the header
    });

    // UI-only: keeps the header status dot accurate if the socket ever drops
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // UI-only: auto-scrolls to the newest message whenever the list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  // UI-only: lets Enter send the message too, same as clicking the Send button
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      sendMessage();
    }
  };

  return (
    // Outer wrapper: full width with a comfortable max-width so it doesn't
    // stretch edge-to-edge on large screens or feel cramped on mobile.
    // mb-28 leaves clearance above your fixed footer — tweak that number
    // to match its actual height so the input bar is never hidden behind it.
    <div className="w-full max-w-2xl mx-auto px-4 mt-6 mb-28">
      <div className="flex flex-col h-[70vh] rounded-2xl border border-base-300 bg-base-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300 bg-base-200">
          <h1 className="font-semibold text-lg">Chat</h1>
          <div className="flex items-center gap-2">
            <span
              className={
                "inline-block w-2 h-2 rounded-full " +
                (isConnected ? "bg-success" : "bg-error")
              }
            ></span>
            <span className="text-xs text-base-content/60">
              {isConnected ? "You're online" : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-dots loading-md text-primary"></span>
            </div>
          ) : message.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-base-content/50 gap-2">
              <span className="text-3xl">👋</span>
              <p>No messages yet — say hello!</p>
            </div>
          ) : (
            message.map((msg, index) => {
              const isOwnMessage = user.firstName === msg.firstName;
              return (
                <div
                  key={index}
                  className={
                    "chat " + (isOwnMessage ? "chat-end" : "chat-start")
                  }
                >
                  {/* avatar + avatar-placeholder covers daisyUI v5; placeholder covers v4 */}
                  <div className="chat-image avatar placeholder avatar-placeholder">
                    <div
                      className={
                        "w-8 rounded-full flex items-center justify-center " +
                        (isOwnMessage
                          ? "bg-primary text-primary-content"
                          : "bg-neutral text-neutral-content")
                      }
                    >
                      <span className="text-xs">
                        {msg.firstName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="chat-header text-xs opacity-70">
                    {msg.firstName}
                  </div>
                  <div
                    className={
                      "chat-bubble wrap-break-word max-w-xs sm:max-w-md " +
                      (isOwnMessage ? "chat-bubble-primary" : "")
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          {/* UI-only: invisible anchor used to scroll the list into view */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-base-300 bg-base-200">
          <div className="join w-full">
            <input
              className="input input-bordered join-item flex-1 min-w-0"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn btn-primary join-item"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
