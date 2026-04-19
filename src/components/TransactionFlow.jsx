import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, HapticButton, GlassNumpad } from './Atomic';
import { CATEGORIES, CAT_GROUPS, COLORS } from '../constants';
import { inr } from '../utils';
import { ChevronLeft, Camera, X, CheckCircle2 } from 'lucide-react';

export const TransactionFlow = ({ step, setStep, form, setForm, photoRef, handlePhoto, onSave, onCancel }) => {
  const isLending = form.category === "lending";
  const totalSteps = isLending ? 5 : 4;
  
  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const Progress = () => (
    <div className="flex gap-2 px-1 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
        <div 
          key={i} 
          className="flex-1 h-1.5 rounded-full transition-all duration-300"
          style={{ background: i <= step ? COLORS.primary : COLORS.border }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="flex items-center gap-4 mb-2">
        <HapticButton 
          onClick={step > 1 ? () => setStep(step - 1) : onCancel}
          className="w-12 h-12 rounded-full glass-card p-0 flex items-center justify-center"
        >
          <ChevronLeft />
        </HapticButton>
        <h1 className="text-2xl font-black text-neutral-900">New Transaction</h1>
      </div>

      <Progress />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" {...stepVariants}>
            <GlassCard>
              <label className="text-xs font-black tracking-widest text-[#B49070] uppercase mb-4 block">
                💰 How much did you spend?
              </label>
              <div className="text-5xl font-black text-neutral-900 min-h-[80px] flex items-center tracking-tight">
                {inr(form.amount || "0")}
              </div>
              <GlassNumpad 
                value={form.amount} 
                onChange={(val) => setForm(f => ({ ...f, amount: val }))} 
              />
            </GlassCard>
            <HapticButton 
              disabled={!form.amount || parseFloat(form.amount) <= 0}
              onClick={() => setStep(2)}
              className="fixed bottom-8 left-4 right-4 h-16 rounded-3xl bg-[#FF8C42] text-white text-lg font-black shadow-lg shadow-orange-200"
            >
              Next →
            </HapticButton>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" {...stepVariants}>
            <GlassCard>
              <label className="text-xs font-black tracking-widest text-[#B49070] uppercase mb-4 block">
                📍 How did you pay?
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "online", emoji: "📱", label: "Online", sub: "UPI / Card" },
                  { id: "offline", emoji: "💵", label: "Cash", sub: "Physical" }
                ].map(type => (
                  <HapticButton
                    key={type.id}
                    onClick={() => setForm(f => ({ ...f, type: type.id }))}
                    className={`h-32 rounded-3xl flex flex-col gap-1 transition-all border-2 ${
                      form.type === type.id ? 'bg-[#FF8C42] border-[#FF8C42]' : 'bg-white/40 border-transparent'
                    }`}
                  >
                    <span className="text-5xl mb-1">{type.emoji}</span>
                    <span className={`text-lg font-black ${form.type === type.id ? 'text-white' : 'text-neutral-900'}`}>
                      {type.label}
                    </span>
                    <span className={`text-xs font-bold ${form.type === type.id ? 'text-white/80' : 'text-neutral-500'}`}>
                      {type.sub}
                    </span>
                  </HapticButton>
                ))}
              </div>
            </GlassCard>
            <HapticButton 
              disabled={!form.type}
              onClick={() => setStep(3)}
              className="fixed bottom-8 left-4 right-4 h-16 rounded-3xl bg-[#FF8C42] text-white text-lg font-black shadow-lg shadow-orange-200"
            >
              Next →
            </HapticButton>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" {...stepVariants} className="pb-12">
            <div className="glass-card rounded-[32px] p-6 max-h-[65vh] overflow-y-auto no-scrollbar">
              <label className="text-xs font-black tracking-widest text-[#B49070] uppercase mb-6 block">
                🏷️ What was it for?
              </label>
              {CAT_GROUPS.map(group => (
                <div key={group.key} className="mb-8">
                  <h3 className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-4 pl-1">
                    {group.label}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {CATEGORIES.filter(c => c.group === group.key).map(c => {
                      const Icon = c.icon;
                      const isSelected = form.category === c.id;
                      return (
                        <HapticButton
                          key={c.id}
                          onClick={() => setForm(f => ({ ...f, category: c.id }))}
                          className={`h-24 rounded-2xl flex flex-col gap-2 p-2 border-2 transition-all ${
                            isSelected ? 'bg-[#FF8C42] border-[#FF8C42]' : 'bg-white/40 border-transparent'
                          }`}
                          style={{ background: isSelected ? COLORS.primary : c.bg }}
                        >
                          <span className="text-3xl">{c.emoji}</span>
                          <span className={`text-[10px] font-black text-center leading-tight ${
                            isSelected ? 'text-white' : 'text-neutral-700'
                          }`}>
                            {c.label}
                          </span>
                        </HapticButton>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <HapticButton 
              disabled={!form.category}
              onClick={() => setStep(4)}
              className="fixed bottom-8 left-4 right-4 h-16 rounded-3xl bg-[#FF8C42] text-white text-lg font-black shadow-lg shadow-orange-200"
            >
              Next →
            </HapticButton>
          </motion.div>
        )}

        {step === 4 && isLending && (
          <motion.div key="step4" {...stepVariants}>
            <GlassCard>
              <label className="text-xs font-black tracking-widest text-[#B49070] uppercase mb-4 block">
                🤝 Who did you lend to?
              </label>
              <input 
                autoFocus 
                placeholder="Enter their name..." 
                value={form.lentTo} 
                onChange={e => setForm(f => ({ ...f, lentTo: e.target.value }))}
                className="w-full h-16 rounded-2xl border-2 border-transparent bg-white/40 px-6 text-xl font-bold text-neutral-900 outline-none focus:border-[#FF8C42]"
              />
              <div className="mt-4 p-4 bg-orange-50 rounded-2xl text-orange-800 text-sm font-bold leading-relaxed">
                💡 Shows in your "Owes Me" list so you never forget!
              </div>
            </GlassCard>
            <HapticButton 
              disabled={!form.lentTo.trim()}
              onClick={() => setStep(5)}
              className="fixed bottom-8 left-4 right-4 h-16 rounded-3xl bg-[#FF8C42] text-white text-lg font-black shadow-lg shadow-orange-200"
            >
              Next →
            </HapticButton>
          </motion.div>
        )}

        {((step === 4 && !isLending) || (step === 5 && isLending)) && (
          <motion.div key="final" {...stepVariants}>
            <GlassCard>
               <label className="text-xs font-black tracking-widest text-[#B49070] uppercase mb-4 block">
                📝 Add a note (optional)
              </label>
              <textarea 
                placeholder="e.g. 'Electricity bill' or 'Kirana'"
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                className="w-full h-24 rounded-2xl border-2 border-transparent bg-white/40 p-6 text-lg font-bold text-neutral-900 outline-none focus:border-[#FF8C42] resize-none"
              />

              <div className="mt-6">
                <label className="text-xs font-black tracking-widest text-[#B49070] uppercase mb-4 block">
                  📷 Bill Photo (optional)
                </label>
                {form.photo ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video">
                    <img src={form.photo} alt="bill" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setForm(f => ({ ...f, photo: null }))}
                      className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <HapticButton 
                    onClick={() => photoRef.current?.click()}
                    className="w-full h-16 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 text-orange-600 font-bold"
                  >
                    <Camera className="mr-2" /> Take bill photo
                  </HapticButton>
                )}
                <input ref={photoRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-3xl font-black text-neutral-900">{inr(parseFloat(form.amount) || 0)}</span>
                  <span className="text-sm font-bold text-neutral-500">{form.type === 'online' ? '📱 Online' : '💵 Cash'}</span>
                </div>
                <div className="text-lg font-bold text-orange-600">
                  {CATEGORIES.find(c => c.id === form.category)?.emoji} {CATEGORIES.find(c => c.id === form.category)?.label}
                </div>
              </div>
            </GlassCard>

            <HapticButton 
              onClick={onSave}
              className="fixed bottom-8 left-4 right-4 h-16 rounded-3xl bg-[#FF8C42] text-white text-lg font-black shadow-lg shadow-orange-200"
            >
              <CheckCircle2 className="mr-2" /> Save Expense
            </HapticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
