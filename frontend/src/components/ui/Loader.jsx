/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="w-full gap-1 py-12 relative flex items-center justify-center">
      <div className="relative">
        {/* Glowing background circle */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            width: "100%",
            height: "100%",
            filter: "blur(8px)",
          }}
        />

        {/* Candlestick chart animation */}
        <div className="flex items-end space-x-2">
          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0,
            }}
          >
            <div className="w-1 h-4 bg-green-500"></div>
            <div className="w-3 h-12 bg-green-500 rounded-sm"></div>
            <div className="w-1 h-4 bg-green-500"></div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.2,
            }}
          >
            <div className="w-1 h-6 bg-[#ff2d55]"></div>
            <div className="w-3 h-16 bg-[#ff2d55] rounded-sm"></div>
            <div className="w-1 h-6 bg-[#ff2d55]"></div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1.3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.4,
            }}
          >
            <div className="w-1 h-5 bg-green-500"></div>
            <div className="w-3 h-14 bg-green-500 rounded-sm"></div>
            <div className="w-1 h-5 bg-green-500"></div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [0, -14, 0] }}
            transition={{
              duration: 1.7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.6,
            }}
          >
            <div className="w-1 h-7 bg-[#ff2d55]"></div>
            <div className="w-3 h-18 bg-[#ff2d55] rounded-sm"></div>
            <div className="w-1 h-7 bg-[#ff2d55]"></div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 1.1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <div className="w-1 h-3 bg-green-500"></div>
            <div className="w-3 h-10 bg-green-500 rounded-sm"></div>
            <div className="w-1 h-3 bg-green-500"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
