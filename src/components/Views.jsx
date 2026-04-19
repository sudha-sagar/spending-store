import React from 'react';
import { GlassCard, HapticButton } from './Atomic';
import { inr, periodStart, getExportMessage } from '../utils';
import { CATEGORIES, COLORS } from '../constants';
import { Share2, CheckCircle2 } from 'lucide-react';

export const Breakdown = ({ txns }) => {
  const catStats = CATEGORIES.map(c => ({
    ...c,
    total: txns.filter(t => t.category === c.id).reduce((s, t) => s + t.amount, 0),
    today: txns.filter(t => t.category === c.id && t.timestamp >= periodStart('today')).reduce((s, t) => s + t.amount, 0),
    month: txns.filter(t => t.category === c.id && t.timestamp >= periodStart('month')).reduce((s, t) => s + t.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const grandTotal = catStats.reduce((s, c) => s + c.total, 0);

  return (
    <div className="pb-24">
      <div className="bg-indigo-600 pt-12 pb-10 px-6 rounded-b-[40px] shadow-2xl shadow-indigo-100">
        <label className="text-xs font-black tracking-widest text-white/70 uppercase mb-1 block">Total History</label>
        <h1 className="text-5xl font-black text-white tracking-tighter">{inr(grandTotal)}</h1>
        <div className="text-xs font-bold text-white/60 mt-2">{txns.length} Transactions Recorded</div>
      </div>

      <div className="px-5 mt-8">
        {catStats.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <span className="text-7xl mb-4 block">📊</span>
            <span className="text-lg font-black">No reports yet</span>
          </div>
        ) : (
          catStats.map((c) => {
            const pct = (c.total / grandTotal) * 100;
            return (
              <GlassCard key={c.id} className="mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: c.bg }}>
                    {c.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-black text-neutral-900">{c.label}</span>
                      <span className="text-xl font-black text-neutral-900">{inr(c.total)}</span>
                    </div>
                    <div className="text-[10px] font-black text-neutral-400 tracking-wide uppercase">
                      {pct.toFixed(1)}% of all spending
                    </div>
                  </div>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-50 p-2 rounded-xl text-center">
                    <div className="text-[8px] font-black text-neutral-400 uppercase">Today</div>
                    <div className="text-xs font-black text-neutral-900">{inr(c.today)}</div>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded-xl text-center">
                    <div className="text-[8px] font-black text-neutral-400 uppercase">This Month</div>
                    <div className="text-xs font-black text-neutral-900">{inr(c.month)}</div>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export const OwesMe = ({ txns, onSettle }) => {
  const lentTxns = txns.filter(t => t.category === 'lending');
  const byPerson = lentTxns.reduce((acc, t) => {
    const name = t.lentTo || "Friend";
    if (!acc[name]) acc[name] = { owed: 0, settled: 0, entries: [] };
    t.settled ? acc[name].settled += t.amount : acc[name].owed += t.amount;
    acc[name].entries.push(t);
    return acc;
  }, {});

  const people = Object.entries(byPerson).sort((a, b) => b[1].owed - a[1].owed);
  const totalOwed = people.reduce((s, p) => s + p[1].owed, 0);

  return (
    <div className="pb-24">
      <div className="bg-rose-600 pt-12 pb-10 px-6 rounded-b-[40px] shadow-2xl shadow-rose-100">
        <label className="text-xs font-black tracking-widest text-white/70 uppercase mb-1 block">Owes Me</label>
        <h1 className="text-5xl font-black text-white tracking-tighter">{inr(totalOwed)}</h1>
        <div className="text-xs font-bold text-white/60 mt-2">Money pending to receive back</div>
      </div>

      <div className="px-5 mt-8">
        {people.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <span className="text-7xl mb-4 block">🤝</span>
            <span className="text-lg font-black">Nobody owes you</span>
          </div>
        ) : (
          people.map(([name, data]) => (
            <GlassCard key={name} className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-3xl">🧑</div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">{name}</h3>
                    {data.settled > 0 && <div className="text-[10px] font-black text-green-600">✓ Settled {inr(data.settled)}</div>}
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600">{inr(data.owed)}</div>
              </div>

              {data.entries.filter(t => !t.settled).map(t => (
                <div key={t.id} className="flex justify-between items-center py-4 border-t border-neutral-100 first:border-t-0">
                  <div className="flex-1">
                    <div className="text-sm font-black text-neutral-700">{t.note || "Lent money"}</div>
                    <div className="text-[10px] font-bold text-neutral-400 mt-0.5">{t.date} · {t.time}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-neutral-900">{inr(t.amount)}</span>
                    <HapticButton 
                      onClick={() => onSettle(t.id)}
                      className="bg-green-50 text-green-600 h-9 px-4 rounded-xl text-[10px] font-black uppercase border border-green-100"
                    >
                      Got Check ✓
                    </HapticButton>
                  </div>
                </div>
              ))}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

export const Export = ({ txns }) => {
  const handleWhatsApp = () => {
    const msg = getExportMessage(txns, CATEGORIES);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="pb-24">
      <div className="bg-emerald-600 pt-12 pb-10 px-6 rounded-b-[40px] shadow-2xl shadow-emerald-100">
        <label className="text-xs font-black tracking-widest text-white/70 uppercase mb-1 block">Share to family</label>
        <h1 className="text-3xl font-black text-white tracking-tighter">Export Summary</h1>
      </div>

      <div className="px-5 mt-8">
        <GlassCard className="mb-6 border-indigo-100 bg-indigo-50/20">
          <label className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase mb-6 block">Family Summary</label>
          <div className="p-4 bg-white/60 rounded-2xl mb-6">
            <p className="text-sm font-bold text-neutral-600 leading-relaxed italic">
              "Hi family, here's my spending summary for this month..."
            </p>
          </div>
          <HapticButton 
            onClick={handleWhatsApp}
            className="w-full h-16 rounded-3xl bg-[#25D366] text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-100"
          >
           <Share2 /> Send to WhatsApp
          </HapticButton>
        </GlassCard>
        
        <GlassCard className="p-6">
          <h3 className="text-sm font-black text-neutral-800 mb-2">💡 Parent Guide</h3>
          <p className="text-xs font-bold text-neutral-500 leading-relaxed">
            Taking a screenshot of your history or sending this WhatsApp report helps the whole family stay updated on household medicine and grocery bills.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
