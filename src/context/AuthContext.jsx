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
      localStorage.removeItem('skillconnect_current_user_v2');
      localStorage.removeItem('skillconnect_current_user');
      const saved = localStorage.getItem('skillconnect_current_user_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      localStorage.removeItem('skillconnect_registered_users_v2');
      localStorage.removeItem('skillconnect_registered_users');
      localStorage.removeItem('skillconnect_current_user');
      const saved = localStorage.getItem('skillconnect_registered_users_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillconnect_current_user_v3', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skillconnect_current_user_v3');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skillconnect_registered_users_v3', JSON.stringify(registeredUsers));
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
    const found = registeredUsers.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      return found;
    }
    return null;
  };

  const registerUser = (userData) => {
    const cleanDigits = (v) => (v || '').toString().replace(/\D/g, '');
    const userRole = userData.role || "customer";
    const newUser = {
      uid: userData.uid || (userRole === 'worker' ? `w-${Date.now().toString().slice(-6)}` : `u-${Date.now().toString().slice(-6)}`),
      workerId: userData.workerId || (userRole === 'worker' ? (userData.uid || userData.workerId) : undefined),
      name: userData.name || (userRole === 'worker' ? "Skilled Worker" : "Customer User"),
      phone: userData.phone || "+91 98765 43210",
      email: (userData.email || "").toLowerCase().trim(),
      password: userData.password || "password123",
      role: userRole,
      serviceArea: userData.serviceArea || "Vijayawada",
      verificationStatus: userData.verificationStatus || (userRole === 'worker' ? 'pending' : undefined),
      avatar: userData.avatar
    };

    setRegisteredUsers(prev => {
      const filtered = prev.filter(u => {
        if (newUser.email && u.email === newUser.email) return false;
        if (cleanDigits(newUser.phone) && cleanDigits(u.phone) === cleanDigits(newUser.phone)) return false;
        return true;
      });
      const updated = [newUser, ...filtered];
      localStorage.setItem('skillconnect_registered_users_v3', JSON.stringify(updated));
      return updated;
    });

    setCurrentUser(newUser);
    return newUser;
  };

  const loginWithCredentials = (email, password, roleHint = 'customer') => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPass = (password || '').trim();
    const cleanDigits = (v) => (v || '').toString().replace(/\D/g, '');
    const inputDigits = cleanDigits(cleanEmail);

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

    // 2. Check saved workers from localStorage
    let savedWorkers = [];
    try {
      savedWorkers = JSON.parse(localStorage.getItem('skillconnect_workers_v5') || '[]');
    } catch (e) {}

    const matchedWorker = savedWorkers.find(w => 
      (inputDigits && cleanDigits(w.phone) === inputDigits) ||
      (w.email && w.email.toLowerCase().trim() === cleanEmail) ||
      (w.name && w.name.toLowerCase().trim() === cleanEmail)
    );

    // 3. Check registered users list
    const foundRegistered = registeredUsers.find(u => 
      (u.email && u.email === cleanEmail) ||
      (inputDigits && cleanDigits(u.phone) === inputDigits) ||
      (u.name && u.name.toLowerCase() === cleanEmail)
    );

    // If matches a WORKER (either in workers collection or registered as worker)
    if (matchedWorker || (foundRegistered && foundRegistered.role === 'worker')) {
      const source = matchedWorker || foundRegistered;
      if (cleanPass && foundRegistered?.password && foundRegistered.password !== cleanPass && foundRegistered.password !== 'password123') {
        return { success: false, message: 'Incorrect password for this worker account.' };
      }

      const workerUser = {
        uid: source.userId || source.id || foundRegistered?.uid || `w-${Date.now().toString().slice(-6)}`,
        workerId: source.id || foundRegistered?.workerId || source.userId,
        name: source.name || foundRegistered?.name || 'Skilled Worker',
        phone: source.phone || foundRegistered?.phone || cleanEmail,
        email: source.email || foundRegistered?.email || `${cleanEmail}@skillconnect.ap`,
        password: cleanPass || foundRegistered?.password || 'password123',
        role: 'worker',
        serviceArea: source.serviceArea || foundRegistered?.serviceArea || 'Vijayawada',
        verificationStatus: source.verificationStatus || foundRegistered?.verificationStatus || 'pending',
        avatar: source.avatar || foundRegistered?.avatar
      };

      // Ensure any stale customer record for this phone is eliminated
      setRegisteredUsers(prev => {
        const filtered = prev.filter(u => cleanDigits(u.phone) !== cleanDigits(workerUser.phone) && u.email !== workerUser.email);
        const updated = [workerUser, ...filtered];
        localStorage.setItem('skillconnect_registered_users_v3', JSON.stringify(updated));
        return updated;
      });

      setCurrentUser(workerUser);
      return { success: true, role: 'worker', user: workerUser };
    }

    // 4. If matches a CUSTOMER in registered accounts
    if (foundRegistered && foundRegistered.role === 'customer') {
      if (cleanPass && foundRegistered.password && foundRegistered.password !== cleanPass && foundRegistered.password !== 'password123') {
        return { success: false, message: 'Incorrect password for this customer account.' };
      }
      setCurrentUser(foundRegistered);
      return { success: true, role: 'customer', user: foundRegistered };
    }

    // 5. New user login fallback (strictly role-separated based on active role tab)
    if (roleHint === 'worker') {
      const newWorkerUser = {
        uid: `w-${Date.now().toString().slice(-6)}`,
        workerId: `w-${Date.now().toString().slice(-6)}`,
        name: cleanEmail ? cleanEmail.split('@')[0].replace('.', ' ') : 'Skilled Worker',
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@skillconnect.ap`,
        password: cleanPass || 'password123',
        role: 'worker',
        phone: inputDigits ? cleanEmail : "+91 98480 12345",
        serviceArea: "Vijayawada",
        verificationStatus: 'pending'
      };
      setRegisteredUsers(prev => [newWorkerUser, ...prev.filter(u => u.email !== newWorkerUser.email && cleanDigits(u.phone) !== cleanDigits(newWorkerUser.phone))]);
      setCurrentUser(newWorkerUser);
      return { success: true, role: 'worker', user: newWorkerUser };
    } else {
      const fallbackCustomer = {
        uid: `u-${Date.now().toString().slice(-6)}`,
        name: cleanEmail ? cleanEmail.split('@')[0].replace('.', ' ') : 'Citizen Customer',
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@skillconnect.ap`,
        password: cleanPass || 'password123',
        role: 'customer',
        phone: inputDigits ? cleanEmail : "+91 98765 43210",
        serviceArea: "Vijayawada"
      };
      setRegisteredUsers(prev => [fallbackCustomer, ...prev.filter(u => u.email !== fallbackCustomer.email && cleanDigits(u.phone) !== cleanDigits(fallbackCustomer.phone))]);
      setCurrentUser(fallbackCustomer);
      return { success: true, role: 'customer', user: fallbackCustomer };
    }
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
