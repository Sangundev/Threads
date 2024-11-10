import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import io from "socket.io-client";

// Create a context to hold the socket and online users state
const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userAtom);
  const [onlineUser, setOnlineUser] = useState([]);

  useEffect(() => {
    // Check if user._id is available before initializing the socket connection
    if (user?._id) {
      // Create and connect the socket
      const socketInstance = io("http://localhost:5000", {
        query: {
          userId: user._id,
        },
      });

      setSocket(socketInstance);

      // Listen for online users and update the state
      socketInstance.on("getOnlineUser", (users) => {
        setOnlineUser(users);
      });

      // Clean up the socket connection and listeners when the component unmounts or user._id changes
      return () => {
        socketInstance.off("getOnlineUser"); // Remove event listener
        socketInstance.close(); // Close socket connection
      };
    }
  }, [user?._id]); // Dependency on user._id to re-run when user changes

  // Debugging - log online users
  useEffect(() => {
    if (onlineUser.length > 0) {
      console.log("Online users:", onlineUser);
    }
  }, [onlineUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
