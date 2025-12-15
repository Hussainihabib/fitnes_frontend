import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [token, setToken] = useState("");

useEffect(() => {
const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");
if (savedUser && savedToken) {
setUser(JSON.parse(savedUser));
setToken(savedToken);



}





}, []);

const updateUser = (updatedUser) => {
  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
};

const login = ({ user, token }) => {
setUser(user);
setToken(token);
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("token", token);
localStorage.setItem("userId", user._id);
};

const logout = () => {
setUser(null);
setToken("");
localStorage.removeItem("user");
localStorage.removeItem("token");
localStorage.removeItem("userId");
};

return (
<AuthContext.Provider value={{ user, token, login, logout,  updateUser }}>
{children}
</AuthContext.Provider>
);
}
