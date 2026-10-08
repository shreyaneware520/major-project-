import { XCircle, Info, CheckCircle2 } from 'lucide-react';

function ToastIcon({ type }) {
  if (type === 'error') {
    return <XCircle size={18} strokeWidth={2} />;
  }
  if (type === 'info') {
    return <Info size={18} strokeWidth={2} />;
  }
  return <CheckCircle2 size={18} strokeWidth={2} />;
}

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast${toast.active ? ' active' : ''}`}>
          <span className="toast-icon">
            <ToastIcon type={toast.type} />
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
