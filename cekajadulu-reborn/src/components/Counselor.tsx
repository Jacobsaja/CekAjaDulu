import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Sparkles, User as UserIcon, Bot, BrainCircuit } from 'lucide-react';
import { chatWithCounselor } from '@/src/lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export function Counselor({ user, onLogin }: { user: User | null, onLogin: () => void }) {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('cekadu_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Save messages to localStorage whenever they change
    if (messages.length > 0) {
      localStorage.setItem('cekadu_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageContent = input;
    const userMessage = { 
      role: 'user', 
      content: userMessageContent,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const aiResponse = await chatWithCounselor(history, userMessageContent);
      
      const botMessage = {
        role: 'model',
        content: aiResponse,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (e) {
      console.error('Chat Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto border border-border/50 rounded-[40px] bg-card overflow-hidden shadow-2xl shadow-primary/5">
      {!user && (
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-2 flex items-center justify-between">
           <p className="text-[10px] font-black uppercase text-primary italic tracking-widest">Guest Mode: Conversations will not be saved</p>
           <Button variant="link" onClick={onLogin} className="text-[10px] h-auto p-0 text-primary font-black uppercase italic hover:no-underline opacity-80 hover:opacity-100">Login to save history →</Button>
        </div>
      )}
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-primary/20 rounded-2xl">
              <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=Counselor" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-card rounded-full" />
          </div>
          <div>
            <h3 className="font-black italic text-lg leading-tight uppercase tracking-tighter">Counselor <span className="text-primary italic">AI</span></h3>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest leading-none mt-1">Status: Operational</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 border border-border/50 rounded-2xl bg-background/50 text-[10px] font-black italic text-muted-foreground uppercase tracking-[0.2em]">
           <BrainCircuit className="w-3 h-3 text-primary" /> Gemini Pro 1.5
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 bg-muted/5" ref={scrollRef}>
        <div className="space-y-8 flex flex-col mb-4">
          {messages.length === 0 && (
            <div className="text-center py-16 space-y-4">
               <div className="bg-primary/10 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto text-primary border border-primary/20">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black italic uppercase text-lg tracking-tight">System Initialization Complete</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto italic leading-relaxed uppercase tracking-widest font-mono">
                  Ready to provide higher education consultation.
                </p>
              </div>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-5 rounded-[28px] text-sm italic leading-loose shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-card rounded-tl-none border border-border/60'
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none font-medium">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex gap-3">
                  <div className="p-5 rounded-[28px] rounded-tl-none bg-muted/40 border border-border/50 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                  </div>
               </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border/50 bg-muted/10">
        <form onSubmit={handleSend} className="flex gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about PTN..." 
              className="h-16 rounded-2xl bg-background border-border/50 px-6 focus-visible:ring-primary shadow-inner"
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || loading}
            className="w-16 h-16 rounded-2xl bg-primary hover:bg-primary/90 transition-all active:scale-90 shadow-xl shadow-primary/20"
          >
            <Send className="w-6 h-6" />
          </Button>
        </form>
      </div>
    </div>
  );
}
