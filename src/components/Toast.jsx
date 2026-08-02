const Toast = ({ toast }) => {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-[fadeIn_0.2s_ease-out] ${
        isError
          ? "bg-danger/10 border-danger/40 text-danger"
          : "bg-success/10 border-success/40 text-success"
      }`}
      role="status"
    >
      {toast.message}
    </div>
  );
};

export default Toast;
