import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeWorkers, initializeBookings, initializeVerifications, skillsList } from '../lib/demoData';
import { getAvatarForGender } from '../lib/constants';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';

const DataContext = createContext();

function cleanPhone(val) {
  return (val || '').toString().replace(/\D/g, '');
}

export function DataProvider({ children }) {
  const [workers, setWorkers] = useState(initializeWorkers);
  const [bookings, setBookings] = useState(initializeBookings);
  const [verifications, setVerifications] = useState(initializeVerifications);
  
  const [complaints, setComplaints] = useState(() => {
    try {
      localStorage.removeItem('skillconnect_complaints_v2');
      const saved = localStorage.getItem('skillconnect_complaints_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [profileChangeRequests, setProfileChangeRequests] = useState(() => {
    try {
      localStorage.removeItem('skillconnect_change_requests_v1');
      const saved = localStorage.getItem('skillconnect_change_requests_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Clear legacy mock data once on mount
  useEffect(() => {
    try {
      localStorage.removeItem('skillconnect_workers_v3');
      localStorage.removeItem('skillconnect_workers_v2');
      localStorage.removeItem('skillconnect_bookings_v2');
      localStorage.removeItem('skillconnect_bookings_v1');
      localStorage.removeItem('skillconnect_verifications_v2');
      localStorage.removeItem('skillconnect_complaints_v2');
      localStorage.removeItem('skillconnect_change_requests_v1');
    } catch (e) {}
  }, []);

  // Real-time Firestore Cloud Listener for Workers, Bookings, Verifications & Profile Change Requests
  useEffect(() => {
    if (!db) return;
    try {
      const unsubWorkers = onSnapshot(collection(db, 'workerProfiles'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudWorkers = snapshot.docs
            .map(d => ({ ...d.data(), id: d.id }))
            .filter(cw => cw && cw.name && !cw.name.includes('Cloud Firestore') && cw.skills && cw.skills.length > 0);
          setWorkers(cloudWorkers);
        } else {
          setWorkers([]);
        }
      }, (err) => {
        console.info("Firestore workers sync notice:", err.message);
      });

      const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudBookings = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          setBookings(cloudBookings);
        } else {
          setBookings([]);
        }
      }, (err) => {
        console.info("Firestore bookings sync notice:", err.message);
      });

      const unsubVerifications = onSnapshot(collection(db, 'verificationSubmissions'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudVerifs = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          setVerifications(cloudVerifs);

          // Sync verified status to workers state if any cloud verification is approved
          const approvedWorkerIds = new Set(cloudVerifs.filter(cv => cv.status === 'approved').map(cv => cv.workerId));
          const approvedWorkerNames = new Set(cloudVerifs.filter(cv => cv.status === 'approved').map(cv => (cv.workerName || '').toLowerCase().trim()));
          const approvedWorkerPhones = new Set(cloudVerifs.filter(cv => cv.status === 'approved' && cv.workerPhone).map(cv => cleanPhone(cv.workerPhone)));

          if (approvedWorkerIds.size > 0 || approvedWorkerNames.size > 0 || approvedWorkerPhones.size > 0) {
            setWorkers(prev => prev.map(w => {
              const matches = approvedWorkerIds.has(w.id) ||
                (w.name && approvedWorkerNames.has(w.name.toLowerCase().trim())) ||
                (w.phone && approvedWorkerPhones.has(cleanPhone(w.phone)));
              if (matches) {
                return { ...w, verificationStatus: 'verified' };
              }
              return w;
            }));
          }
        } else {
          setVerifications([]);
        }
      }, (err) => {
        console.info("Firestore verifications listener notice:", err.message);
      });

      const unsubChangeRequests = onSnapshot(collection(db, 'profileChangeRequests'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudRequests = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          setProfileChangeRequests(cloudRequests);
        } else {
          setProfileChangeRequests([]);
        }
      }, (err) => {
        console.info("Firestore change requests listener info:", err.message);
      });

      return () => {
        unsubWorkers();
        unsubBookings();
        unsubVerifications();
        unsubChangeRequests();
      };
    } catch (err) {
      console.warn("Firestore listener setup error:", err);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('skillconnect_workers_v4', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('skillconnect_bookings_v3', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('skillconnect_verifications_v3', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem('skillconnect_complaints_v3', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('skillconnect_change_requests_v2', JSON.stringify(profileChangeRequests));
  }, [profileChangeRequests]);

  // Actions
  const submitProfileChangeRequest = async (reqData) => {
    const newReq = {
      id: `pcr-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      adminRemarks: '',
      ...reqData
    };
    setProfileChangeRequests(prev => [newReq, ...prev]);

    try {
      if (db) {
        await setDoc(doc(db, 'profileChangeRequests', newReq.id), newReq);
      }
    } catch (e) {
      console.warn("Firestore profileChangeRequests sync notice:", e.message);
    }
    return newReq;
  };

  const approveProfileChangeRequest = async (reqId) => {
    const target = profileChangeRequests.find(r => r.id === reqId);
    if (target) {
      setProfileChangeRequests(prev => prev.map(r => {
        if (r.id === reqId) {
          return { ...r, status: 'approved', adminRemarks: 'Approved by AP State Admin.' };
        }
        return r;
      }));

      if (target.userRole === 'worker' && target.fieldKey) {
        setWorkers(prev => prev.map(w => {
          if (w.id === target.userId || w.name === target.userName) {
            let cleanVal = target.requestedVal;
            if (target.fieldKey === 'indicativeWage') {
              cleanVal = parseInt(target.requestedVal.replace(/\D/g, ''), 10) || w.indicativeWage;
            }
            const updated = { ...w, [target.fieldKey]: cleanVal };
            if (db) {
              setDoc(doc(db, 'workerProfiles', w.id), updated, { merge: true }).catch(() => {});
            }
            return updated;
          }
          return w;
        }));
      }

      try {
        if (db) {
          await setDoc(doc(db, 'profileChangeRequests', reqId), { 
            status: 'approved', 
            adminRemarks: 'Approved by AP State Admin.' 
          }, { merge: true });
        }
      } catch (e) {}
    }
  };

  const rejectProfileChangeRequest = async (reqId, remarks) => {
    setProfileChangeRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        return { ...r, status: 'rejected', adminRemarks: remarks || 'Rejected by AP State Admin.' };
      }
      return r;
    }));

    try {
      if (db) {
        await setDoc(doc(db, 'profileChangeRequests', reqId), { 
          status: 'rejected', 
          adminRemarks: remarks || 'Rejected by AP State Admin.' 
        }, { merge: true });
      }
    } catch (e) {}
  };

  const createBooking = async (bookingData) => {
    const bookingId = `b-${Date.now().toString().slice(-5)}`;
    const newBooking = {
      id: bookingId,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'requested',
      quotation: null,
      ...bookingData
    };

    setBookings(prev => [newBooking, ...prev]);

    try {
      if (db) {
        await setDoc(doc(db, 'bookings', bookingId), newBooking);
      }
    } catch (err) {
      console.warn("Firestore booking sync notice:", err.message);
    }

    return newBooking;
  };

  const submitQuotation = async (bookingId, quoteData) => {
    const quotation = {
      id: `q-${Date.now().toString().slice(-4)}`,
      amountINR: quoteData.amountINR,
      estimatedTime: quoteData.estimatedTime,
      notes: quoteData.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'quoted', quotation };
      }
      return b;
    }));

    if (db) {
      try {
        await setDoc(doc(db, 'bookings', bookingId), { status: 'quoted', quotation }, { merge: true });
      } catch (e) {}
    }
  };

  const acceptQuotation = async (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'quote_accepted' };
      }
      return b;
    }));

    if (db) {
      try {
        await setDoc(doc(db, 'bookings', bookingId), { status: 'quote_accepted' }, { merge: true });
      } catch (e) {}
    }
  };

  const declineQuotation = async (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'quote_declined' };
      }
      return b;
    }));

    if (db) {
      try {
        await setDoc(doc(db, 'bookings', bookingId), { status: 'quote_declined' }, { merge: true });
      } catch (e) {}
    }
  };

  const updateJobStatus = async (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    }));

    if (db) {
      try {
        await setDoc(doc(db, 'bookings', bookingId), { status: newStatus }, { merge: true });
      } catch (e) {}
    }
  };

  const confirmCompletion = async (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'completed', completionConfirmedAt: new Date().toISOString() };
      }
      return b;
    }));

    if (db) {
      try {
        await setDoc(doc(db, 'bookings', bookingId), { status: 'completed', completionConfirmedAt: new Date().toISOString() }, { merge: true });
      } catch (e) {}
    }
  };

  const approveVerification = async (verifId) => {
    let targetWorkerId = null;
    let targetWorkerName = null;
    let targetWorkerPhone = null;

    setVerifications(prev => prev.map(v => {
      if (v.id === verifId) {
        targetWorkerId = v.workerId;
        targetWorkerName = v.workerName;
        targetWorkerPhone = v.workerPhone;
        return { ...v, status: 'approved' };
      }
      return v;
    }));

    setWorkers(prev => prev.map(w => {
      const isMatch = (targetWorkerId && w.id === targetWorkerId) ||
        (targetWorkerName && w.name && w.name.toLowerCase().trim() === targetWorkerName.toLowerCase().trim()) ||
        (targetWorkerPhone && cleanPhone(w.phone) === cleanPhone(targetWorkerPhone));

      if (isMatch) {
        return { ...w, verificationStatus: 'verified' };
      }
      return w;
    }));

    try {
      const cur = JSON.parse(localStorage.getItem('skillconnect_current_user_v2') || 'null');
      if (cur) {
        const matchesCur = (targetWorkerId && (cur.workerId === targetWorkerId || cur.uid === targetWorkerId)) ||
          (targetWorkerName && cur.name && cur.name.toLowerCase().trim() === targetWorkerName.toLowerCase().trim()) ||
          (targetWorkerPhone && cleanPhone(cur.phone || cur.name) === cleanPhone(targetWorkerPhone));
        if (matchesCur) {
          cur.verificationStatus = 'verified';
          localStorage.setItem('skillconnect_current_user_v2', JSON.stringify(cur));
        }
      }
    } catch (e) {}

    try {
      if (db) {
        await setDoc(doc(db, 'verificationSubmissions', verifId), { status: 'approved' }, { merge: true });
        if (targetWorkerId) {
          await setDoc(doc(db, 'workerProfiles', targetWorkerId), { verificationStatus: 'verified' }, { merge: true });
        }
      }
    } catch (err) {
      console.warn("Firestore verification approval sync notice:", err.message);
    }
  };

  const rejectVerification = async (verifId, notes) => {
    setVerifications(prev => prev.map(v => {
      if (v.id === verifId) {
        return { ...v, status: 'rejected', notes: notes || 'Rejected by AP State Admin.' };
      }
      return v;
    }));

    try {
      if (db) {
        await setDoc(doc(db, 'verificationSubmissions', verifId), { status: 'rejected', notes: notes || 'Rejected by AP State Admin.' }, { merge: true });
      }
    } catch (e) {}
  };

  const registerWorker = async (newWorker) => {
    const workerId = `w-${Date.now().toString().slice(-6)}`;
    const avatar = newWorker.avatar || getAvatarForGender(newWorker.gender || 'male', workers.length);

    const fullWorker = {
      id: workerId,
      userId: workerId,
      name: newWorker.fullName,
      gender: newWorker.gender || "male",
      phone: newWorker.phone,
      email: newWorker.email || `${newWorker.fullName.toLowerCase().replace(/\s+/g, '')}@skillconnect.ap`,
      bio: newWorker.bio || `Certified local professional providing high quality reliable services in ${newWorker.serviceArea || 'Vijayawada'}.`,
      experienceYears: (newWorker.experienceYears !== undefined && newWorker.experienceYears !== '') ? parseInt(newWorker.experienceYears, 10) : 0,
      serviceArea: newWorker.serviceArea || "Vijayawada",
      availability: "available",
      verificationStatus: "pending",
      skills: newWorker.skills || [{ id: 2, nameEn: "Plumbing", nameTe: "ప్లంబింగ్" }],
      rating: 5.0,
      reviewCount: 0,
      indicativeWage: (newWorker.indicativeWage !== undefined && newWorker.indicativeWage !== '') ? parseInt(newWorker.indicativeWage, 10) : null,
      avatar: avatar
    };

    setWorkers(prev => [fullWorker, ...prev]);

    const newVerif = {
      id: `verif-${Date.now().toString().slice(-4)}`,
      workerId: workerId,
      workerName: newWorker.fullName,
      workerPhone: newWorker.phone,
      trade: newWorker.skills?.map(s => s.nameEn).join(', ') || "General Labour",
      area: newWorker.serviceArea || "Vijayawada",
      documentType: "Masked Aadhaar Proof",
      submittedDate: new Date().toISOString().split('T')[0],
      status: "pending",
      filePreview: avatar,
      notes: "Newly submitted registration document."
    };
    setVerifications(prev => [newVerif, ...prev]);

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
      console.warn("Firestore cloud sync notice:", err.message);
    }

    return fullWorker;
  };

  return (
    <DataContext.Provider value={{
      workers,
      bookings,
      verifications,
      complaints,
      profileChangeRequests,
      skillsList,
      createBooking,
      submitQuotation,
      acceptQuotation,
      declineQuotation,
      updateJobStatus,
      confirmCompletion,
      approveVerification,
      rejectVerification,
      registerWorker,
      submitProfileChangeRequest,
      approveProfileChangeRequest,
      rejectProfileChangeRequest
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
