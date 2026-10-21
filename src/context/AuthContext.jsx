import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';

const AuthContext = createContext();

export const DEMO_USERS = {
  customer: {
    uid: "cust-demo-1",
    name: "Keerthana Rao",
    email: "keerthana@example.com",
    role: "customer",
    serviceArea: "Vijayawada",
    phone: "+91 98765 43210"
  },
  worker: {
    uid: "61750a2a-c9ff-56e2-87f2-ab5fca4a64d2",
    name: "Aarav Reddy",
    email: "aarav.masonry@example.com",
    role: "worker",
    serviceArea: "Vijayawada",
    phone: "+91 90000 00001",
    trade: "Masonry & Civil Works",
    verificationStatus: "verified"
  },
  admin: {
    uid: "admin-master-001",
    name: "Andhra Pradesh State Admin",
    email: "admin@skillconnect.gov.in",
    role: "admin",
    serviceArea: "Andhra Pradesh",
    phone: "+91 866 2445566"
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('skillconnect_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_USERS.customer;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillconnect_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skillconnect_current_user');
    }
  }, [currentUser]);

  // Optional Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        // If logged in via Firebase
        setCurrentUser(prev => ({
          ...prev,
          uid: fbUser.uid,
          email: fbUser.email || prev?.email,
          name: fbUser.displayName || prev?.name || "Firebase User"
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('skillconnect_admin_unlocked') === 'true';
    } catch (e) {
      return false;
    }
  });

  const loginAs = (role) => {
    const user = DEMO_USERS[role] || DEMO_USERS.customer;
    setCurrentUser(user);
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      // Ignored for offline demo
    }
    setCurrentUser(null);
  };

  const unlockAdmin = (passcode) => {
    const clean = (passcode || '').trim();
    if (clean.toUpperCase() === 'APADMIN@2026' || clean === '9848' || clean === 'admin123') {
      setIsAdminUnlocked(true);
      try {
        sessionStorage.setItem('skillconnect_admin_unlocked', 'true');
      } catch (e) {}
      loginAs('admin');
      return { success: true };
    }
    return { 
      success: false, 
      message: 'Access Denied: Invalid Security Passcode. Authorized admin credentials required.' 
    };
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem('skillconnect_admin_unlocked');
    } catch (e) {}
    loginAs('customer');
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      loginAs, 
      logout, 
      loading,
      isAdminUnlocked,
      unlockAdmin,
      lockAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
