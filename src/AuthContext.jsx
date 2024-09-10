import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user); // Log the actual user, not currentUser
      setLoading(false); // Set loading to false once the user is checked
    });
    return () => unSubscribe(); // Clean up the subscription
  }, []);

  const value = { currentUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when loading is false */}
    </AuthContext.Provider>
  );
}

export { AuthContext };
