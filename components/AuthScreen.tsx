import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface AuthScreenProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
}

export function AuthScreen({ onLogin, onRegister }: AuthScreenProps) {
  const [view, setView] = useState<"welcome" | "auth" | "privacy">("welcome");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      onRegister(email, password, name);
    } finally {
      setIsLoading(false);
    }
  };

  const startAuth = () => {
    setView("auth");
  };

  if (view === "privacy") {
    return <PrivacyPolicy onBack={() => setView("auth")} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {view === "welcome" ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center px-4"
          >
            <div className="text-center max-w-md">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <span className="text-3xl text-white font-bold">A</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Добро пожаловать в Aureus
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Современный мессенджер для общения с друзьями и коллегами. 
                  Начните новую эру общения уже сегодня.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Button 
                  onClick={startAuth}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Начать
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex"
          >
            {/* Left Side - Auth Form */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="w-1/2 bg-gray-900 flex items-center justify-center p-8"
            >
              <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">A</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Aureus</h2>
                </div>

                {/* Auth Forms */}
                <AnimatePresence mode="wait">
                  {isLogin ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoginForm
                        onLogin={handleLogin}
                        onSwitchToRegister={() => setIsLogin(false)}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RegisterForm
                        onRegister={handleRegister}
                        onSwitchToLogin={() => setIsLogin(true)}
                        onShowPrivacy={() => setView("privacy")}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mt-8">
                  <p>© 2025 Aureus. Все права защищены.</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Forest Image */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="w-1/2 relative overflow-hidden"
            >
              <div 
                className="h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1731279206366-0374d8fd4d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZGFyayUyMGZvcmVzdCUyMG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTc2OTY4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-900/20 to-gray-900/80"></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center text-white p-8"
                  >
                    <h3 className="text-3xl font-bold mb-4">
                      Присоединяйтесь к сообществу
                    </h3>
                    <p className="text-lg text-gray-200 leading-relaxed max-w-sm">
                      Миллионы людей уже используют Aureus для общения. 
                      Станьте частью нашего растущего сообщества.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}