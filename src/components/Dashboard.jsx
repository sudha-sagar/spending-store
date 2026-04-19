import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, HapticButton } from './Atomic';
import { inr, periodStart } from '../utils';
import { CATEGORIES, COLORS } from '../constants';
import { LayoutDashboard, Receipt, Handshake, Share2, Plus, ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';

export const Dashboard = ({ txns, period, setPeriod, total, setView, openAdd, totalOwed, onDelete, onEdit }) => {
  const [expandedTxn, setExpandedTxn] = React.useState(null);
  const PERIODS = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "all", label: "All Time" },
  ];

  const filtered = txns.filter(t => t.timestamp >= periodStart(period));
  
  const getCategoryTotal = (catIds) => 
    filtered.filter(t => catIds.includes(t.category)).reduce((s, t) => s + t.amount, 0);

  const stats = [
    { label: "Food", emoji: "🥗", value: getCategoryTotal(["vegetables", "milk", "kirana", "food", "chai", "cooking_gas"]) },
    { label: "Health", emoji: "💊", value: getCategoryTotal(["medicine", "doctor", "lab_test"]) },
    { label: "Bills", emoji: "💡", value: getCategoryTotal(["electricity", "mobile", "internet", "water"]) },
  ];

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="bg-[#FF8C42] pt-12 pb-8 px-6 rounded-b-[40px] shadow-2xl shadow-orange-200">
        <label className="text-xs font-black tracking-widest text-[#FFF]/70 uppercase mb-1 block">
          Total Spent
        </label>
        <h1 className="text-5xl font-black text-white tracking-tighter mb-6">
          {inr(total)}
        </h1>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {PERIODS.map(p => (
            <HapticButton
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-2xl text-xs font-black transition-all ${
                period === p.id ? 'bg-white text-[#FF8C42]' : 'bg-white/20 text-white'
              }`}
            >
              {p.label}
            </HapticButton>
          ))}
        </div>
      </div>

      <div className="px-5 -mt-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(stat => (
            <GlassCard key={stat.label} className="p-4 text-center">
              <span className="text-2xl mb-1 block">{stat.emoji}</span>
              <span className="text-[10px] font-black tracking-wider text-neutral-400 uppercase mb-1 block">
                {stat.label}
              </span>
              <span className="text-sm font-black text-neutral-900">{inr(stat.value)}</span>
            </GlassCard>
          ))}
        </div>
      </div>

      {totalOwed > 0 && (
        <HapticButton
          onClick={() => setView('owes')}
          className="mx-5 mt-6 h-16 rounded-3xl bg-red-50 border-2 border-red-100 px-6 flex items-center justify-between"
        >
          <span className="text-red-600 font-black text-sm flex items-center gap-2">
            🤝 Someone owes you
          </span>
          <span className="text-red-600 font-black text-lg">{inr(totalOwed)} →</span>
        </HapticButton>
      )}

      {/* Recent Transactions list */}
      <div className="px-5 mt-8 pb-12">
        <h2 className="text-xs font-black tracking-widest text-[#B49070] uppercase mb-4 px-1">
          Recent Spending
        </h2>
        {filtered.length === 0 ? (
          <div className="text-center py-12 opacity-40">
            <span className="text-6xl mb-4 block">📭</span>
            <span className="text-sm font-black">No spending yet</span>
          </div>
        ) : (
          filtered.slice(0, 15).map((t) => {
            const cat = CATEGORIES.find(c => c.id === t.category);
            const isExpanded = expandedTxn === t.id;
            return (
              <GlassCard 
                key={t.id} 
                className="mb-3 p-0 overflow-hidden" 
                onClick={() => setExpandedTxn(isExpanded ? null : t.id)}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: cat?.bg || '#F0F0F0' }}>
                    {cat?.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xl font-black text-neutral-900">{inr(t.amount)}</span>
                      <span className="text-[10px] font-black bg-white/50 px-2 py-0.5 rounded-lg border border-white/50">
                        {t.type === 'online' ? '📱 ONLINE' : '💵 CASH'}
                      </span>
                    </div>
                    <div className="text-sm font-black text-neutral-500 line-clamp-1">
                      {t.note || cat?.label}
                    </div>
                    <div className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-tight">
                      {t.date} · {t.time}
                    </div>
                  </div>
                  <div className="text-neutral-300">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-black/5 bg-black/[0.02]"
                    >
                      <div className="p-4 pt-2">
                        {t.note && (
                          <div className="mb-4">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Note</label>
                            <p className="text-sm font-bold text-neutral-800">{t.note}</p>
                          </div>
                        )}
                        
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-2">Bill Evidence</label>
                        {t.photo ? (
                          <div className="rounded-2xl overflow-hidden shadow-sm border border-black/5">
                            <img 
                              src={t.photo} 
                              alt="bill" 
                              className="w-full h-auto max-h-[300px] object-cover" 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(t.photo, '_blank');
                              }}
                            />
                          </div>
                        ) : (
                          <div className="py-6 px-4 rounded-2xl border-2 border-dashed border-neutral-200 text-center">
                            <span className="text-xs font-bold text-neutral-400">No bill photo attached</span>
                          </div>
                        )}

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <HapticButton 
                            onClick={(e) => { e.stopPropagation(); onEdit(t); }}
                            className="bg-white border-2 border-neutral-100 h-14 rounded-2xl flex items-center justify-center gap-2 text-neutral-600 font-bold"
                          >
                            <Pencil size={18} /> Edit
                          </HapticButton>
                          <HapticButton 
                            onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                            className="bg-red-50 border-2 border-red-100 h-14 rounded-2xl flex items-center justify-center gap-2 text-red-600 font-bold"
                          >
                            <Trash2 size={18} /> Delete
                          </HapticButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })
        )}
        
        <div className="mt-8 flex flex-col items-center justify-center opacity-40 pb-12">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🏠</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Saved on this phone</span>
          </div>
          <p className="text-[8px] font-bold text-center max-w-[200px] leading-relaxed uppercase opacity-60">
            Offline & Private · No data leaves your device
          </p>
        </div>
      </div>

      <HapticButton
        onClick={openAdd}
        className="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-[#FF8C42] text-white shadow-2xl shadow-orange-300 z-50 p-0"
      >
        <Plus size={32} strokeWidth={3} />
      </HapticButton>

    </div>
  );
};

export const BottomNav = ({ view, setView, totalOwed }) => {
  const tabs = [
    { id: "home", icon: LayoutDashboard, label: "Home", emoji: "🏠" },
    { id: "breakdown", icon: Receipt, label: "Report", emoji: "📊" },
    { id: "owes", icon: Handshake, label: "Owes Me", emoji: "🤝" },
    { id: "export", icon: Share2, label: "Share", emoji: "📤" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-3xl border-t border-white/20 flex z-[100] px-4 pb-safe">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = view === tab.id;
        return (
          <HapticButton
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
              isActive ? 'text-[#FF8C42]' : 'text-[#C4A882]'
            }`}
          >
            <div className="relative">
              <span className="text-2xl">{tab.emoji}</span>
              {tab.id === 'owes' && totalOwed > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white" />
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight">{tab.label}</span>
          </HapticButton>
        );
      })}
    </div>
  );
};
