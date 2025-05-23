/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

const steps = [
  "A\u00A0I is getting ready",
  "A\u00A0I is fetching the data",
  "A\u00A0I is analyzing stock data",
  "A\u00A0I is forming the report",
];

const StepLoader = ({ currentStep = 0, isLoading = true, debug = false }) => {
  const [displayStep, setDisplayStep] = useState(currentStep);

  useEffect(() => {
    setDisplayStep(currentStep);
  }, [currentStep]);

  // debugging for auto-stepping
  useEffect(() => {
    if (debug) {
      const timer = setInterval(() => {
        setDisplayStep((prev) => (prev + 1) % steps.length);
      }, 3000); // Change step every 3 seconds
      return () => clearInterval(timer);
    }
  }, [debug]);

  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md px-4">
        {/* Candle Stick loader */}
        <Loader />
        {/* Progress bar with gradient */}
        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-8">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#298985] via-[#35b0ab] to-[#4ecac5]"
            initial={{ width: 0 }}
            animate={{ width: `${((displayStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between items-start w-full mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <motion.div
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mb-3 ${
                  index < displayStep
                    ? "bg-green-500 text-white"
                    : index === displayStep
                    ? "bg-secondary border-2 border-accent"
                    : "bg-gray-800 border border-gray-700"
                }`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: index <= displayStep ? 1 : 0.8,
                  opacity: index <= displayStep ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                {index < displayStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${index}-${index <= displayStep ? "active" : "inactive"}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: index <= displayStep ? 1 : 0.5, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <span
                    className={`text-sm font-medium ${
                      index === displayStep
                        ? "text-red-400"
                        : index < displayStep
                        ? "text-green-400"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Current step description with animated typing effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`description-${displayStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-4"
          >
            <TypewriterEffect text={`${steps[displayStep]}...`} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Typewriter effect component
const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayText("");

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="font-mono text-lg text-white tracking-wider font-medium">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        className="inline-block ml-1 w-2 h-5 bg-white"
      />
    </div>
  );
};

export default StepLoader;
