/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";

const ErrorPage = ({
  title = "Access Denied",
  message = "Sorry, you don't have permission to access this page. This area is restricted to admin users only.",
  code = "403",
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Lock Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-muted/30 flex items-center justify-center"
        >
          <LockKeyhole className="w-12 h-12 text-muted-fg" />
        </motion.div>

        {/* Error Code */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-bold text-primary mb-4"
        >
          {code}
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-semibold mb-4"
        >
          {title}
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-fg mb-8"
        >
          {message}
        </motion.p>

        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-fg rounded-lg font-medium transition-colors hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
