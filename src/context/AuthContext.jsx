import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // 🔑 Normalize user so FastSpin always has acctId, userName, currency
  function normalizeUser(u) {
    if (!u) return null;
    return {
      acctId: u.acctId || u.id || u._id || u.email || "guest_" + Date.now(),
      userName: u.userName || u.name || u.email?.split("@")[0] || "Guest",
      currency: u.currency || "BDT", // default to BDT if not set
      ...u, // keep any other fields (email, phone, etc.)
    };
  }

  useEffect(() => {
    if (token && !user) {
      api
        .get("/user/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          const normalized = normalizeUser(res.data.user);
          setUser(normalized);
          localStorage.setItem("user", JSON.stringify(normalized));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  function login(jwt, userObj) {
    const normalized = normalizeUser(userObj);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(normalized));
    setToken(jwt);
    setUser(normalized);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
