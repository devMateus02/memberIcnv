import { AnimatePresence, motion } from "framer-motion";

interface StatusModalProps {
  open: boolean;
  type: "success" | "error";
  title: string;
  message?: string;
  onClose: () => void;
}

export function StatusModal({ open, type, title, message, onClose }: StatusModalProps) {
  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-xl"
          >
            <div className="relative mx-auto mb-4 h-20 w-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className={`absolute inset-0 rounded-full ${
                  isSuccess ? "bg-success/15" : "bg-destructive/15"
                }`}
              />

              <svg viewBox="0 0 52 52" className="absolute inset-0 h-full w-full">
                <motion.circle
                  cx="26"
                  cy="26"
                  r="23"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={isSuccess ? "stroke-success" : "stroke-destructive"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />

                {isSuccess ? (
                  <motion.path
                    d="M14 27l7 7 17-17"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-success"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                  />
                ) : (
                  <>
                    <motion.path
                      d="M18 18l16 16"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="stroke-destructive"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M34 18l-16 16"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="stroke-destructive"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.55, duration: 0.3, ease: "easeOut" }}
                    />
                  </>
                )}
              </svg>
            </div>

            <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
            {message && <p className="mb-5 text-sm text-muted-foreground">{message}</p>}

            <button
              onClick={onClose}
              className={`w-full rounded-lg py-2.5 text-sm font-medium transition ${
                isSuccess
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }`}
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
