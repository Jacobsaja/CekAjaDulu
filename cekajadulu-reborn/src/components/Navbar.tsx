import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, MessageCircle, LogOut, GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navbar({ user, activeTab, setActiveTab, onLogin, onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setActiveTab('home')}
        >
          <h1 className="text-2xl font-black tracking-tighter text-white">Cekadu</h1>
          <div className="hidden md:flex items-center gap-6 ml-8 text-[11px] font-medium text-zinc-400">
             <span className="hover:text-white transition-colors">Beranda</span>
             <span className="hover:text-white transition-colors">Cek SNBP</span>
             <span className="hover:text-white transition-colors">Cek SNBT</span>
             <span className="hover:text-white transition-colors">Tes Minat</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-2xl border border-border/50">
            <Button 
              variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
              size="sm"
              className="rounded-xl gap-2 h-10 px-4 italic"
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'counselor' ? 'secondary' : 'ghost'} 
              size="sm"
              className="rounded-xl gap-2 h-10 px-4 italic"
              onClick={() => setActiveTab('counselor')}
            >
              AI Chat
            </Button>
          </div>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-border/50">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-muted-foreground leading-none mb-1">Authenticated as</p>
                <p className="text-[11px] font-black italic uppercase leading-none">{user.displayName?.split(' ')[0]}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button onClick={onLogin} className="rounded-xl px-6 h-12 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Join the Vibe</span>
              <span className="sm:hidden">Login</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
