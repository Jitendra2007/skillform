import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';

const AuthContext = createContext();

export const DEMO_USERS = {
  customer: {
    uid: "cust-demo-1",
    name: "Keerthana Rao",
    email: "keerthana@example.com",
    password: "password123",
    role: "customer",
    serviceArea: "Vijayawada",
    phone: "+91 98765 43210"
  },
  worker: {
    uid: "61750a2a-c9ff-56e2-87f2-ab5fca4a64d2",
    name: "Aarav Reddy",
    email: "aarav.masonry@example.com",
    password: "password123",
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
    password: "APADMIN@2026",
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

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('skillconnect_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        uid: "cust-demo-1",
        name: "Keerthana Rao",
        email: "keerthana@example.com",
        password: "password123",
        role: "customer",
        phone: "+91 98765 43210",
        serviceArea: "Vijayawada"
      },
      {
        uid: "61750a2a-c9ff-56e2-87f2-ab5fca4a64d2",
        name: "Aarav Reddy",
        email: "aarav.masonry@example.com",
        password: "password123",
        role: "worker",
        phone: "+91 90000 00001",
        serviceArea: "Vijayawada"
      }
    ];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillconnect_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skillconnect_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skillconnect_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Optional Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
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
    if (role === 'admin') {
      setIsAdminUnlocked(true);
      try { sessionStorage.setItem('skillconnect_admin_unlocked', 'true'); } catch (e) {}
    }
    setCurrentUser(user);
    return user;
  };

  const registerUser = (userData) => {
    const newUser = {
      uid: `u-${Date.now().toString().slice(-6)}`,
      name: userData.name || "Customer User",
      phone: userData.phone || "+91 98765 43210",
      email: (userData.email || "").toLowerCase().trim(),
      password: userData.password || "password123",
      role: userData.role || "customer",
      serviceArea: userData.serviceArea || "Vijayawada"
    };

    setRegisteredUsers(prev => {
      const filtered = prev.filter(u => u.email !== newUser.email);
      const updated = [newUser, ...filtered];
      localStorage.setItem('skillconnect_registered_users', JSON.stringify(updated));
      return updated;
    });

    setCurrentUser(newUser);
    return newUser;
  };

  const loginWithCredentials = (email, password, roleHint = 'customer') => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPass = (password || '').trim();

    // 1. Check Admin
    if (
      cleanEmail === 'admin@skillconnect.gov.in' ||
      cleanPass.toUpperCase() === 'APADMIN@2026' ||
      cleanPass === '9848' ||
      cleanPass === 'admin123'
    ) {
      unlockAdmin(cleanPass || 'APADMIN@2026');
      return { success: true, role: 'admin', user: DEMO_USERS.admin };
    }

    // 2. Check registered accounts
    const foundRegistered = registeredUsers.find(u => u.email === cleanEmail);
    if (foundRegistered) {
      if (cleanPass && foundRegistered.password && foundRegistered.password !== cleanPass) {
        return { success: false, message: 'Incorrect password for this registered email.' };
      }
      setCurrentUser(foundRegistered);
      return { success: true, role: foundRegistered.role, user: foundRegistered };
    }

    // 3. Check demo customer
    if (cleanEmail === 'keerthana@example.com' || cleanEmail.includes('keerthana')) {
      const cust = { ...DEMO_USERS.customer, email: cleanEmail };
      setCurrentUser(cust);
      return { success: true, role: 'customer', user: cust };
    }

    // 4. Check demo worker
    if (cleanEmail === 'aarav.masonry@example.com' || cleanEmail.includes('aarav')) {
      const wrk = { ...DEMO_USERS.worker, email: cleanEmail };
      setCurrentUser(wrk);
      return { success: true, role: 'worker', user: wrk };
    }

    // 5. Default login by role (Flexible demo credentials)
    const fallbackUser = {
      uid: `u-${Date.now().toString().slice(-6)}`,
      name: cleanEmail ? cleanEmail.split('@')[0].replace('.', ' ') : (roleHint === 'worker' ? 'Skilled Worker' : 'Citizen Customer'),
      email: cleanEmail || `${roleHint}@skillconnect.ap`,
      password: cleanPass || 'password123',
      role: roleHint,
      phone: "+91 98765 43210",
      serviceArea: "Vijayawada"
    };

    // Save newly entered account so it persists
    setRegisteredUsers(prev => [fallbackUser, ...prev.filter(u => u.email !== fallbackUser.email)]);
    setCurrentUser(fallbackUser);
    return { success: true, role: roleHint, user: fallbackUser };
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {}
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
      registeredUsers,
      registerUser,
      loginWithCredentials,
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
