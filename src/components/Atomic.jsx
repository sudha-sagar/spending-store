import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const GlassCard = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn("glass-card p-6", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const HapticButton = ({ children, className, onClick, disabled, ...props }) => {
  const handleTap = (e) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      onClick={disabled ? undefined : handleTap}
      className={cn(
        "haptic-press flex items-center justify-center cursor-pointer transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "active:opacity-80",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const GlassNumpad = ({ value, onChange, onNext, enabled }) => {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  const handlePress = (key) => {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
    } else if (key === ".") {
      if (!value.includes(".")) onChange(value + ".");
    } else {
      if (value.length < 9) onChange(value + key);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {keys.map((key) => (
        <HapticButton
          key={key}
          onClick={() => handlePress(key)}
          className={cn(
            "h-16 rounded-2xl text-2xl font-bold glass-pill transition-all",
            key === "⌫" ? "bg-orange-100/50 text-orange-600" : "bg-white/40 text-neutral-800"
          )}
        >
          {key}
        </HapticButton>
      ))}
    </div>
  );
};
