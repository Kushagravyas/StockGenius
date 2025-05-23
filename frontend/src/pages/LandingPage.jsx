/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  BarChart3,
  BellRing,
  Bot,
  LineChart,
  ArrowRight,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SplashScreen from "@/components/ui/SplashScreen";
import HeroSection from "@/components/ui/HeroSection";

const LandingPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const features = [
    {
      icon: <BarChart3 className="h-10 w-10 text-[#35b0ab]" />,
      title: "Real-time Market Data",
      description:
        "Access live stock prices, charts, and market indicators to make informed decisions.",
    },
    {
      icon: <Bot className="h-10 w-10 text-destructive" />,
      title: "AI-Powered Analysis",
      description:
        "Get personalized stock recommendations and insights powered by advanced AI algorithms.",
    },
    {
      icon: <BellRing className="h-10 w-10 text-secondary" />,
      title: "Custom Watchlists",
      description:
        "Create and manage personalized watchlists to track your favorite stocks.",
    },
    {
      icon: <LineChart className="h-10 w-10 text-primary" />,
      title: "UI/UX at its Peak!",
      description:
        "Experience a sleek, modern interface with fluid animations, and responsive design for seamless trading across all devices.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Connect Your Account",
      description:
        "Create an account and set your investment preferences to personalize your experience.",
    },
    {
      step: "02",
      title: "Explore Market Data",
      description:
        "Access real-time stock data, charts, and market indicators to stay informed.",
    },
    {
      step: "03",
      title: "Get AI Recommendations",
      description:
        "Receive personalized stock recommendations and insights based on your preferences.",
    },
  ];

  const testimonials = [
    {
      name: "Hemant Tandan",
      role: "Day Trader",
      content:
        "StockGenius has completely transformed my trading strategy. The AI insights have helped me identify opportunities I would have otherwise missed.",
      avatar: "/assets/StockImage.png",
    },
    {
      name: "Aditya Raut",
      role: "Long-term Investor",
      content:
        "As someone who invests for the long term, the analysis provided by StockGenius gives me confidence in my investment decisions.",
      avatar: "/assets/StockImage1.png",
    },
    {
      name: "Mr. Bihari Ji",
      role: "Financial Advisor",
      content:
        "I recommend StockGenius to all my clients. The intuitive interface and powerful tools make it accessible for investors of all experience levels.",
      avatar: "/assets/StockImage2.png",
    },
  ];

  const faqs = [
    {
      question: "How does StockGenius generate stock recommendations?",
      answer:
        "StockGenius uses a combination of machine learning algorithms, technical analysis, and fundamental data to generate personalized stock recommendations. Our AI analyzes market trends, company financials, and news sentiment to provide insights tailored to your investment goals.",
    },
    {
      question: "Is StockGenius suitable for beginners?",
      answer:
        "StockGenius is designed to be user-friendly for investors of all experience levels. Beginners can benefit from our educational resources and simplified analysis, while experienced traders can dive deeper into advanced technical indicators and custom strategies.",
    },
    {
      question: "How accurate are the AI predictions?",
      answer:
        "While no prediction system is perfect, StockGenius has demonstrated strong performance in identifying market trends and opportunities. Our AI models are continuously trained on the latest market data and refined to improve accuracy over time. We recommend using our insights as one of several tools in your investment decision process.",
    },
    {
      question: "Can I connect my brokerage account?",
      answer:
        "Currently, StockGenius operates as an analysis and research platform without direct brokerage integration. However, we're working on partnerships with major brokerages to enable seamless trading in future updates.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {!showSplash && (
        <div className="min-h-screen overflow-hidden">
          <HeroSection features={features} />

          {/* How It Works Section with Animated Steps */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text-alt">
                  How It Works
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  StockGenius simplifies the process of stock analysis and investment
                  decision-making.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                {/* Connecting line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary hidden lg:block"></div>

                {steps.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="relative z-10"
                  >
                    <div className="bg-card border border-primary/20 rounded-xl p-8 h-full flex flex-col items-center text-center relative">
                      <motion.div
                        className="absolute -top-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {item.step}
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-4 mt-6">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section with Card Flip Animation */}
          <section className="py-24 bg-card/50">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text-alt">
                  What Our Users Say
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  Join thousands of investors who trust StockGenius for their investment
                  decisions.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ y: -10 }}
                    className="bg-background rounded-xl p-8 shadow-lg border border-primary/10 h-full flex flex-col"
                  >
                    <div className="mb-6">
                      {/* Stars */}
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.svg
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                            className="w-5 h-5 text-yellow-500 fill-current mr-1"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </motion.svg>
                        ))}
                      </div>
                      <p className="text-gray-300 italic mb-6">"{testimonial.content}"</p>
                    </div>
                    <div className="mt-auto flex items-center">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section with Accordion Animation */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  Find answers to common questions about StockGenius.
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="mb-4"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className={`w-full text-left p-6 rounded-lg flex justify-between items-center transition-all duration-300 ${
                        activeAccordion === index
                          ? "bg-primary/20 border-primary/30"
                          : "bg-card hover:bg-card/80"
                      } border border-primary/10`}
                    >
                      <h3 className="text-lg font-semibold">{faq.question}</h3>
                      <motion.div
                        animate={{ rotate: activeAccordion === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-5 w-5 text-primary" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {activeAccordion === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-background/50 border border-t-0 border-primary/10 rounded-b-lg">
                            <p className="text-gray-400">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section with Floating Elements */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-30"></div>

            {/* Floating elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-primary/10"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  zIndex: 0,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            ))}

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-card border border-primary/20 rounded-2xl p-12 max-w-4xl mx-auto text-center shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Transform Your Investment Strategy?
                  </h2>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    Join thousands of investors who are already using StockGenius to make
                    smarter investment decisions.
                  </p>
                  <Link to={token ? "/dashboard" : "/auth"}>
                    <Button
                      size="lg"
                      variant="gradient"
                      className="hover:opacity-90 font-bold text-lg px-10 py-6"
                    >
                      {token ? "Go to Dashboard" : "Get Started Now"}{" "}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-background border-t border-primary/10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-6 md:mb-0">
                  <TrendingUp className="h-8 w-8 text-primary mr-2" />
                  <span className="text-2xl font-bold gradient-text">StockGenius</span>
                </div>
                <div className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} StockGenius. All rights reserved.
                </div>
                <div className="flex gap-2">
                <div className="text-primary">Created with ❤️</div>
                <div className="text-primary/50">By</div>
                <div className="text-foreground">Kushagra Shukla & Kushagra Vyas</div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default LandingPage;
