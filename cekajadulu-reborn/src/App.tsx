import React from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Counselor } from './components/Counselor';
import { Landing } from './components/Landing';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

// Mock User type to replace Firebase User
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'home' | 'dashboard' | 'counselor'>('home');

  React.useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('cekadu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    // Simple mock login
    const mockUser: User = {
      uid: 'mock-user-123',
      email: 'siswa@antigravity.ai',
      displayName: 'Siswa Antigravity',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siswa',
    };
    setUser(mockUser);
    localStorage.setItem('cekadu_user', JSON.stringify(mockUser));
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('cekadu_user');
    setActiveTab('home');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Landing onGetStarted={() => user ? setActiveTab('dashboard') : handleLogin()} />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <Dashboard user={user} onLogin={handleLogin} />
            </motion.div>
          )}

          {activeTab === 'counselor' && (
            <motion.div
              key="counselor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Counselor user={user} onLogin={handleLogin} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
