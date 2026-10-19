import { useEffect, useMemo, useState } from "react";
import { disconnectSocket, getSocket } from "../lib/socket";

export const useSessionSocket = (sessionId, user) => {
  const socket = useMemo(() => getSocket(), []);
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!sessionId || !user?.id) return;

    socket.connect();
    socket.emit("session:join", {
      sessionId,
      user: {
        id: user.id,
        name: user.fullName || user.username || user.firstName || "Guest",
        image: user.imageUrl || "",
        socketId: socket.id,
      },
    });

    const handlePresence = ({ participants: nextParticipants }) => setParticipants(nextParticipants || []);
    const handleTyping = ({ typingUsers: nextTypingUsers }) => setTypingUsers(nextTypingUsers || []);

    socket.on("session:presence", handlePresence);
    socket.on("session:typing:update", handleTyping);

    return () => {
      socket.emit("session:leave", { sessionId, userId: user.id });
      socket.off("session:presence", handlePresence);
      socket.off("session:typing:update", handleTyping);
      disconnectSocket();
    };
  }, [sessionId, user, socket]);

  const syncCode = (code, language) => {
    if (!sessionId || !user?.id) return;
    socket.emit("code:sync", { sessionId, code, language, userId: user.id });
  };

  const setTyping = (isTyping) => {
    if (!sessionId || !user?.id) return;
    socket.emit("session:typing", { sessionId, userId: user.id, isTyping });
  };

  return { socket, participants, typingUsers, syncCode, setTyping };
};