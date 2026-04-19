import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dashboard, BottomNav } from './components/Dashboard';
import { TransactionFlow } from './components/TransactionFlow';
import { Breakdown, OwesMe, Export } from './components/Views';
import { setupNotification, periodStart, resizeImage } from './utils';
import { CATEGORIES } from './constants';

export default function App() {
  const [view, setView] = useState('home');
  const [txns, setTxns] = useState([]);
  const [period, setPeriod] = useState('week');
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ 
    id: null,
    amount: "", 
    type: null, 
    category: null, 
    lentTo: "", 
    note: "", 
    photo: null 
  });
  const photoRef = useRef();

  // Load Persistence
  useEffect(() => {
    try {
      const savedTxns = localStorage.getItem("p_txns_v3");
      if (savedTxns) setTxns(JSON.parse(savedTxns));
    } catch (e) {
      console.error("Local storage error:", e);
    }
    
    // Setup Reminder
    setupNotification(() => {
      const now = new Date();
      const t = new Date();
      t.setHours(21, 0, 0, 0);
      if (now >= t) t.setDate(t.getDate() + 1);
      setTimeout(() => {
        try {
          new Notification("💰 Daily Reminder", {
            body: "Did you spend anything today? Tap to record it.",
            icon: "/icon-192.png"
          });
        } catch (_) {}
      }, t - now);
    });
  }, []);

  const persist = (data) => {
    try {
      localStorage.setItem("p_txns_v3", JSON.stringify(data));
    } catch (_) {}
  };

  const handleSave = () => {
    if (!form.amount || !form.type || !form.category) return;
    
    const baseTxn = {
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      lentTo: form.lentTo.trim(),
      note: form.note.trim(),
      photo: form.photo,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    let updated;
    if (form.id) {
      // Edit existing
      updated = txns.map(t => t.id === form.id ? { ...t, ...baseTxn } : t);
    } else {
      // New transaction
      const newTxn = { ...baseTxn, id: Date.now(), timestamp: Date.now(), settled: false };
      updated = [newTxn, ...txns];
    }
    
    setTxns(updated);
    persist(updated);
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setView('home');
      setStep(1);
    }, 1500);
  };

  const handleSettle = (id) => {
    const updated = txns.map(t => t.id === id ? { ...t, settled: true } : t);
    setTxns(updated);
    persist(updated);
  };

  const deleteTxn = (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    const updated = txns.filter(t => t.id !== id);
    setTxns(updated);
    persist(updated);
  };

  const editTxn = (t) => {
    setForm({
      id: t.id,
      amount: t.amount.toString(),
      type: t.type,
      category: t.category,
      lentTo: t.lentTo || "",
      note: t.note || "",
      photo: t.photo
    });
    setView('add');
    setStep(1);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      setForm(f => ({ ...f, photo: resized }));
    }
  };

  const total = txns
    .filter(t => t.timestamp >= periodStart(period))
    .reduce((s, t) => s + t.amount, 0);

  const totalOwed = txns
    .filter(t => t.category === 'lending' && !t.settled)
    .reduce((s, t) => s + t.amount, 0);

  if (saved) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="h-screen flex flex-col items-center justify-center bg-white"
      >
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring', damping: 12 }}
          className="text-[120px] mb-4"
        >
          ✅
        </motion.div>
        <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Saved!</h2>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {view === 'add' ? (
          <TransactionFlow
            key="add"
            step={step}
            setStep={setStep}
            form={form}
            setForm={setForm}
            photoRef={photoRef}
            handlePhoto={handlePhotoUpload}
            onSave={handleSave}
            onCancel={() => {
              setView('home');
              setStep(1);
            }}
          />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {view === 'home' && (
              <Dashboard 
                txns={txns} 
                period={period} 
                setPeriod={setPeriod} 
                total={total} 
                setView={setView}
                totalOwed={totalOwed}
                onDelete={deleteTxn}
                onEdit={editTxn}
                openAdd={() => {
                  setForm({ id: null, amount: "", type: null, category: null, lentTo: "", note: "", photo: null });
                  setView('add');
                  setStep(1);
                }}
              />
            )}
            {view === 'breakdown' && <Breakdown txns={txns} />}
            {view === 'owes' && <OwesMe txns={txns} onSettle={handleSettle} />}
            {view === 'export' && <Export txns={txns} />}
            
            <BottomNav view={view} setView={setView} totalOwed={totalOwed} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
