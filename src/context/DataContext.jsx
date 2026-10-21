import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeWorkers, initializeBookings, initializeVerifications, skillsList } from '../lib/demoData';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [workers, setWorkers] = useState(initializeWorkers);
  const [bookings, setBookings] = useState(initializeBookings);
  const [verifications, setVerifications] = useState(initializeVerifications);
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('skillconnect_complaints_v1');
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

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('skillconnect_workers_v1', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('skillconnect_bookings_v1', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('skillconnect_verifications_v1', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem('skillconnect_complaints_v1', JSON.stringify(complaints));
  }, [complaints]);

  // Actions
  const createBooking = (bookingData) => {
    const newBooking = {
      id: `b-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'requested',
      quotation: null,
      ...bookingData
    };
    setBookings(prev => [newBooking, ...prev]);
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

  const registerWorker = (newWorker) => {
    const workerId = `w-${Date.now().toString().slice(-4)}`;
    const fullWorker = {
      id: workerId,
      userId: `u-${Date.now().toString().slice(-4)}`,
      name: newWorker.fullName,
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
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
    };

    setWorkers(prev => [fullWorker, ...prev]);

    // Create verification submission
    const newVerif = {
      id: `verif-${Date.now().toString().slice(-4)}`,
      workerId: workerId,
      workerName: newWorker.fullName,
      trade: newWorker.skills?.map(s => s.nameEn).join(', ') || "General Labour",
      area: newWorker.serviceArea,
      documentType: "Masked Aadhaar Proof",
      submittedDate: new Date().toISOString().split('T')[0],
      status: "pending",
      filePreview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      notes: "Newly submitted registration document."
    };
    setVerifications(prev => [newVerif, ...prev]);

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
