/* eslint-disable no-unused-vars */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useParallax } from "react-scroll-parallax";
import { Button } from "@/components/ui/button";
import { Shield, Zap, BarChart, PieChart } from "lucide-react";

const HeroSection = ({ features }) => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const parallaxHero = useParallax({ speed: -10 });

  const isHeroInView = useInView(heroRef, { once: false, amount: 0.3 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const stats = [
    { value: "98%", label: "Accuracy Rate", icon: <Shield className="h-6 w-6" /> },
    { value: "24/7", label: "Market Monitoring", icon: <Zap className="h-6 w-6" /> },
    { value: "10K+", label: "Active Users", icon: <BarChart className="h-6 w-6" /> },
    { value: "50+", label: "Stocks Analyzed", icon: <PieChart className="h-6 w-6" /> },
  ];

  // Background and particle effects
  const renderBackground = () => (
    <div className="absolute inset-0 z-0">
      <div
        ref={parallaxHero.ref}
        className="absolute inset-0 bg-[url('/assets/StockBg.png')] bg-cover bg-center"
        style={{
          backgroundAttachment: "fixed",
          filter: "brightness(0.4) saturate(1.2)",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );

  // Hero content
  const renderHeroContent = () => (
    <div className="relative z-10 container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text"
        >
          Where Analytics
        </motion.h1>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text"
        >
          Becomes Assets
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white mb-8"
        >
          Unlock the power of artificial intelligence to make smarter investment
          decisions. Get real-time market analysis, predictive insights, and personalized
          recommendations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <Button size="lg" className="text-lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="text-lg">
            Learn More
          </Button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden py-32 md:py-40 min-h-[90vh] flex items-center"
      >
        {renderBackground()}
        {renderHeroContent()}
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-16 bg-gradient-to-r from-background via-background/95 to-background relative z-10"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-card/30 p-6 rounded-xl border border-primary/10"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <motion.h3
                  className="text-3xl md:text-4xl font-bold text-primary mb-1"
                  initial={{ opacity: 0 }}
                  animate={isStatsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Staggered Animation */}
      <section ref={featuresRef} className="py-24 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-70"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to analyze the market and make informed investment
              decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-background/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <motion.div
                  className="mb-6 text-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
