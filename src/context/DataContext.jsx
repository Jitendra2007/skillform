import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeWorkers, initializeBookings, initializeVerifications, skillsList } from '../lib/demoData';
import { getAvatarForGender } from '../lib/constants';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [workers, setWorkers] = useState(initializeWorkers);
  const [bookings, setBookings] = useState(initializeBookings);
  const [verifications, setVerifications] = useState(initializeVerifications);
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('skillconnect_complaints_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "comp-1",
        bookingId: "b-102",
        customerName: "Keerthana Rao",
        workerName: "Sravani Kumar",
        subject: "Delay in arriving at scheduled slot",
        details: "Worker requested a 1-hour delay due to traffic and previous site overrun.",
        status: "under_review",
        filedAt: "2026-10-21"
      }
    ];
  });

  // Real-time Firestore Cloud Listener for Workers (Syncs across phones & laptops)
  useEffect(() => {
    if (!db) return;
    try {
      const unsubWorkers = onSnapshot(collection(db, 'workerProfiles'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudWorkers = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          setWorkers(prev => {
            const cloudIds = new Set(cloudWorkers.map(cw => cw.id));
            const localOnly = prev.filter(w => !cloudIds.has(w.id));
            return [...cloudWorkers, ...localOnly];
          });
        }
      }, (err) => {
        console.info("Firestore workers sync using local persistence:", err.message);
      });

      const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudBookings = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          setBookings(prev => {
            const cloudIds = new Set(cloudBookings.map(cb => cb.id));
            const localOnly = prev.filter(b => !cloudIds.has(b.id));
            return [...cloudBookings, ...localOnly];
          });
        }
      }, (err) => {
        console.info("Firestore bookings sync using local persistence:", err.message);
      });

      return () => {
        unsubWorkers();
        unsubBookings();
      };
    } catch (err) {
      console.warn("Firestore listener setup error:", err);
    }
  }, []);

  // Sync to local storage with v2 key
  useEffect(() => {
    localStorage.setItem('skillconnect_workers_v2', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('skillconnect_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('skillconnect_verifications_v2', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem('skillconnect_complaints_v2', JSON.stringify(complaints));
  }, [complaints]);

  // Actions
  const createBooking = async (bookingData) => {
    const bookingId = `b-${Date.now().toString().slice(-4)}`;
    const newBooking = {
      id: bookingId,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'requested',
      quotation: null,
      ...bookingData
    };
    setBookings(prev => [newBooking, ...prev]);

    // Sync to Cloud Firestore
    try {
      if (db) {
        await setDoc(doc(db, 'bookings', bookingId), newBooking);
      }
    } catch (err) {
      console.warn("Firestore booking sync notice:", err.message);
    }

    return newBooking;
  };

  const submitQuotation = (bookingId, quoteDetails) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'quoted',
          quotation: {
            id: `q-${Date.now().toString().slice(-4)}`,
            createdAt: new Date().toISOString().split('T')[0],
            ...quoteDetails
          }
        };
      }
      return b;
    }));
  };

  const acceptQuotation = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'quote_accepted' };
      }
      return b;
    }));
  };

  const declineQuotation = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' };
      }
      return b;
    }));
  };

  const updateJobStatus = (bookingId, status) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status };
      }
      return b;
    }));
  };

  const confirmCompletion = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'completed', completionConfirmedAt: new Date().toISOString() };
      }
      return b;
    }));
  };

  const approveVerification = (verifId) => {
    let targetWorkerId = null;
    setVerifications(prev => prev.map(v => {
      if (v.id === verifId) {
        targetWorkerId = v.workerId;
        return { ...v, status: 'approved' };
      }
      return v;
    }));

    if (targetWorkerId) {
      setWorkers(prev => prev.map(w => {
        if (w.id === targetWorkerId) {
          return { ...w, verificationStatus: 'verified' };
        }
        return w;
      }));
    }
  };

  const rejectVerification = (verifId, notes) => {
    let targetWorkerId = null;
    setVerifications(prev => prev.map(v => {
      if (v.id === verifId) {
        targetWorkerId = v.workerId;
        return { ...v, status: 'rejected', notes: notes || v.notes };
      }
      return v;
    }));

    if (targetWorkerId) {
      setWorkers(prev => prev.map(w => {
        if (w.id === targetWorkerId) {
          return { ...w, verificationStatus: 'rejected' };
        }
        return w;
      }));
    }
  };

  const registerWorker = async (newWorker) => {
    const workerId = `w-${Date.now().toString().slice(-4)}`;
    const gender = newWorker.gender || 'male';
    const avatar = newWorker.avatar || getAvatarForGender(gender, Date.now());

    const fullWorker = {
      id: workerId,
      userId: `u-${Date.now().toString().slice(-4)}`,
      name: newWorker.fullName,
      gender: gender,
      phone: newWorker.phone,
      email: newWorker.email || `${newWorker.fullName.toLowerCase().replace(/\s+/g, '')}@skillconnect.test`,
      bio: newWorker.bio,
      experienceYears: parseInt(newWorker.experienceYears || '2', 10),
      serviceArea: newWorker.serviceArea || "Vijayawada",
      availability: "available",
      verificationStatus: "pending",
      skills: newWorker.skills || [{ id: 2, nameEn: "Plumbing", nameTe: "ప్లంబింగ్" }],
      rating: 5.0,
      reviewCount: 0,
      indicativeWage: parseInt(newWorker.indicativeWage || '650', 10),
      avatar: avatar
    };

    setWorkers(prev => [fullWorker, ...prev]);

    // Create verification submission
    const newVerif = {
      id: `verif-${Date.now().toString().slice(-4)}`,
      workerId: workerId,
      workerName: newWorker.fullName,
      trade: newWorker.skills?.map(s => s.nameEn).join(', ') || "General Labour",
      area: newWorker.serviceArea || "Vijayawada",
      documentType: "Masked Aadhaar Proof",
      submittedDate: new Date().toISOString().split('T')[0],
      status: "pending",
      filePreview: avatar,
      notes: "Newly submitted registration document."
    };
    setVerifications(prev => [newVerif, ...prev]);

    // Save to Firestore (graceful cloud sync)
    try {
      if (db) {
        await setDoc(doc(db, 'workerProfiles', workerId), {
          ...fullWorker,
          createdAt: new Date().toISOString()
        });
        await setDoc(doc(db, 'verificationSubmissions', newVerif.id), {
          ...newVerif,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn("Firestore cloud sync notice (saved locally in persistent storage):", err.message);
    }

    return fullWorker;
  };

  return (
    <DataContext.Provider value={{
      workers,
      bookings,
      verifications,
      complaints,
      skillsList,
      createBooking,
      submitQuotation,
      acceptQuotation,
      declineQuotation,
      updateJobStatus,
      confirmCompletion,
      approveVerification,
      rejectVerification,
      registerWorker
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
