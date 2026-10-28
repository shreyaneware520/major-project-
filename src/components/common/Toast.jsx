import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  const { id, type = "success", title, message, duration = 2000, isExiting } = toast;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPercent);

      if (remainingPercent <= 0) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration]);

  const getVariantStyles = () => {
    switch (type) {
      case "success":
        return {
          borderColor: "border-[#53E97F]/40",
          shadowColor: "shadow-[0_12px_32px_rgba(0,0,0,0.65),0_0_25px_rgba(83,233,127,0.15)]",
          iconBg: "bg-[#53E97F]/15 border-[#53E97F]/30 text-[#53E97F]",
          barColor: "bg-[#53E97F]",
          Icon: CheckCircle2,
        };
      case "error":
        return {
          borderColor: "border-red-500/40",
          shadowColor: "shadow-[0_12px_32px_rgba(0,0,0,0.65),0_0_25px_rgba(239,68,68,0.15)]",
          iconBg: "bg-red-500/15 border-red-500/30 text-red-400",
          barColor: "bg-red-500",
          Icon: XCircle,
        };
      case "warning":
        return {
          borderColor: "border-amber-500/40",
          shadowColor: "shadow-[0_12px_32px_rgba(0,0,0,0.65),0_0_25px_rgba(245,158,11,0.15)]",
          iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          barColor: "bg-amber-400",
          Icon: AlertTriangle,
        };
      case "info":
      default:
        return {
          borderColor: "border-sky-500/40",
          shadowColor: "shadow-[0_12px_32px_rgba(0,0,0,0.65),0_0_25px_rgba(56,189,248,0.15)]",
          iconBg: "bg-sky-500/15 border-sky-500/30 text-sky-400",
          barColor: "bg-sky-400",
          Icon: Info,
        };
    }
  };

  const { borderColor, shadowColor, iconBg, barColor, Icon } = getVariantStyles();

  // Handle multi-line strings in message safely
  const messageLines = typeof message === "string" ? message.split("\n") : [message];

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-xl bg-[#0B1522]/95 backdrop-blur-xl border ${borderColor} ${shadowColor} p-4 w-full sm:w-[380px] flex gap-3.5 transition-all duration-300 ${
        isExiting ? "animate-toast-out" : "animate-toast-in"
      }`}
      role="alert"
    >
      {/* Status Icon */}
      <div className={`shrink-0 p-2.5 rounded-lg border flex items-center justify-center self-start ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 pr-4 min-w-0">
        {title && (
          <h4 className="font-sans font-semibold text-[14px] text-white tracking-tight leading-snug">
            {title}
          </h4>
        )}
        {message && (
          <div className="mt-1 font-sans text-[12px] text-[#A1AEB7] leading-relaxed space-y-0.5">
            {messageLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => onClose(id)}
        className="shrink-0 p-1.5 text-[#728392] hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none self-start cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar Timer */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all ease-linear`}
            style={{ width: `${progress}%`, transitionDuration: "16ms" }}
          />
        </div>
      )}
    </div>
  );
}
