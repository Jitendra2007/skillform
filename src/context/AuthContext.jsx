import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';

const AuthContext = createContext();

export const DEMO_USERS = {
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
    try {
      const saved = localStorage.getItem('skillconnect_current_user_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      localStorage.removeItem('skillconnect_registered_users');
      localStorage.removeItem('skillconnect_current_user');
      const saved = localStorage.getItem('skillconnect_registered_users_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillconnect_current_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skillconnect_current_user_v2');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skillconnect_registered_users_v2', JSON.stringify(registeredUsers));
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
    if (role === 'admin') {
      setIsAdminUnlocked(true);
      try { sessionStorage.setItem('skillconnect_admin_unlocked', 'true'); } catch (e) {}
      setCurrentUser(DEMO_USERS.admin);
      return DEMO_USERS.admin;
    }

    // Default to the first registered user with this role, or a fresh blank persona
    const found = registeredUsers.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      return found;
    }

    const blankUser = {
      uid: `u-${Date.now().toString().slice(-6)}`,
      name: role === 'worker' ? 'Registered Worker' : 'Citizen Customer',
      email: `${role}@skillconnect.ap`,
      role: role,
      serviceArea: 'Vijayawada',
      phone: '+91 98765 43210'
    };
    setCurrentUser(blankUser);
    return blankUser;
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
      localStorage.setItem('skillconnect_registered_users_v2', JSON.stringify(updated));
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
    const cleanDigits = (v) => (v || '').toString().replace(/\D/g, '');
    const foundRegistered = registeredUsers.find(u => 
      u.email === cleanEmail ||
      (cleanDigits(cleanEmail) && cleanDigits(u.phone) === cleanDigits(cleanEmail)) ||
      (cleanDigits(cleanEmail) && cleanDigits(u.name) === cleanDigits(cleanEmail)) ||
      (u.name && u.name.toLowerCase() === cleanEmail)
    );
    if (foundRegistered) {
      if (cleanPass && foundRegistered.password && foundRegistered.password !== cleanPass) {
        return { success: false, message: 'Incorrect password for this registered account.' };
      }
      setCurrentUser(foundRegistered);
      return { success: true, role: foundRegistered.role, user: foundRegistered };
    }

    // 3. Newly created login dynamically registers if not existing
    const fallbackUser = {
      uid: `u-${Date.now().toString().slice(-6)}`,
      name: cleanEmail ? cleanEmail.split('@')[0].replace('.', ' ') : (roleHint === 'worker' ? 'Skilled Worker' : 'Citizen Customer'),
      email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@skillconnect.ap`,
      password: cleanPass || 'password123',
      role: roleHint,
      phone: cleanDigits(cleanEmail) ? cleanEmail : "+91 98765 43210",
      serviceArea: "Vijayawada"
    };

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
      setCurrentUser(DEMO_USERS.admin);
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
    setCurrentUser(null);
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
