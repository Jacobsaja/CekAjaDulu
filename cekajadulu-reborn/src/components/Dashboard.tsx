import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap, Trophy, BarChart3, Wand2, History, Trash2, User as UserIcon, AlertCircle, Sparkles } from 'lucide-react';
import { getAdmissionPrediction } from '@/src/lib/gemini';
import { motion } from 'motion/react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export function Dashboard({ user, onLogin }: { user: User | null, onLogin: () => void }) {
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const [predictions, setPredictions] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState({
    school: '',
    major: '',
    math: '',
    indo: '',
    eng: '',
    science: '',
    targetPtn: '',
    targetMajor: '',
  });

  React.useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('cekadu_profile');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setProfile(data);
      setFormData(prev => ({
        ...prev,
        school: data.school || '',
        major: data.major || '',
        ...(data.grades || {})
      }));
    }

    // Load predictions from localStorage
    const savedPreds = localStorage.getItem('cekadu_predictions');
    if (savedPreds) {
      setPredictions(JSON.parse(savedPreds));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const grades = {
      math: Number(formData.math),
      indo: Number(formData.indo),
      eng: Number(formData.eng),
      science: Number(formData.science),
    };

    try {
      const newProfile = {
        school: formData.school,
        major: formData.major,
        grades,
        targetPtn: formData.targetPtn,
        targetMajor: formData.targetMajor,
        updatedAt: new Date().toISOString(),
      };
      
      setProfile(newProfile);
      localStorage.setItem('cekadu_profile', JSON.stringify(newProfile));

      const result = await getAdmissionPrediction({
        ...formData,
        grades
      });

      const newPred = {
        id: Math.random().toString(36).substr(2, 9),
        ...result,
        createdAt: new Date().toISOString(),
      };

      const updatedPreds = [newPred, ...predictions].slice(0, 10);
      setPredictions(updatedPreds);
      localStorage.setItem('cekadu_predictions', JSON.stringify(updatedPreds));

    } catch (e) {
      console.error('Analysis Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase italic flex items-center gap-2">
            DASHBOARD <span className="text-primary not-italic lowercase font-medium">siswa</span>
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Real-time Admission Analysis Engine</p>
        </div>
        {user ? (
          <div className="flex items-center gap-3 bg-card/50 p-2 pl-4 rounded-full border border-border/50">
            <div className="text-right">
              <p className="font-bold text-xs uppercase italic leading-none">{user.displayName}</p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tight">{profile?.school || 'Unset'}</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 overflow-hidden">
               <img src={user.photoURL || ''} alt="avatar" className="w-full h-full rounded-full" referrerPolicy="no-referrer" />
            </div>
          </div>
        ) : (
          <Button onClick={onLogin} variant="outline" className="rounded-full border-primary/50 text-primary uppercase text-[10px] font-black h-10 px-6 gap-2">
            <UserIcon size={12} /> Login for Persistent Data
          </Button>
        )}
      </header>

      {!user && (
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-primary/10 p-2 rounded-xl text-primary"><AlertCircle size={20} /></div>
             <div>
                <p className="text-xs font-black uppercase italic leading-none">Guest Mode Active</p>
                <p className="text-[10px] text-muted-foreground italic uppercase tracking-tight">Your analysis data will NOT be saved. Login to sync with cloud.</p>
             </div>
          </div>
          <Button size="sm" onClick={onLogin} className="rounded-xl h-8 text-[10px] uppercase font-black tracking-widest">Login Now</Button>
        </div>
      )}

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl mb-6">
          <TabsTrigger value="input" className="rounded-xl gap-2 font-bold px-6">Input Data</TabsTrigger>
          <TabsTrigger value="result" className="rounded-xl gap-2 font-bold px-6">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-min md:auto-rows-[auto]">
            {/* School & Target Info */}
            <div className="md:col-span-2 bg-card rounded-[32px] border p-8 space-y-6">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                <GraduationCap className="w-3 h-3" /> Informasi Dasar
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pendidikan</Label>
                  <Input 
                    placeholder="Nama SMA" 
                    value={formData.school}
                    onChange={e => setFormData({ ...formData, school: e.target.value })}
                    className="rounded-xl border-border/50 bg-muted/20" 
                  />
                  <Input 
                    placeholder="Jurusan (MIPA/IPS)" 
                    value={formData.major}
                    onChange={e => setFormData({ ...formData, major: e.target.value })}
                    className="rounded-xl border-border/50 bg-muted/20 mt-2" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Target PTN</Label>
                  <Input 
                    placeholder="Universitas" 
                    value={formData.targetPtn}
                    onChange={e => setFormData({ ...formData, targetPtn: e.target.value })}
                    className="rounded-xl border-border/50 bg-muted/20" 
                  />
                  <Input 
                    placeholder="Prodi" 
                    value={formData.targetMajor}
                    onChange={e => setFormData({ ...formData, targetMajor: e.target.value })}
                    className="rounded-xl border-border/50 bg-muted/20 mt-2" 
                  />
                </div>
              </div>
            </div>

            {/* Grades Info */}
            <div className="md:col-span-2 bg-card rounded-[32px] border p-8 space-y-6">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                <Trophy className="w-3 h-3" /> Transkrip Rapor
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'math', label: 'Math' },
                  { id: 'indo', label: 'B. Indo' },
                  { id: 'eng', label: 'B. Eng' },
                  { id: 'science', label: 'Core' },
                ].map((sub) => (
                  <div key={sub.id} className="relative group">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground absolute top-2 right-4 z-10">{sub.label}</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData[sub.id as keyof typeof formData]}
                      onChange={e => setFormData({ ...formData, [sub.id]: e.target.value })}
                      className="rounded-2xl h-14 bg-muted/20 border-border/50 pt-6 text-xl font-black italic focus-visible:ring-primary" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Card */}
            <div className="md:col-span-4 bg-primary rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/20">
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic text-white uppercase leading-none">Execute Analysis</h3>
                <p className="text-xs text-white/70 italic font-medium uppercase tracking-tight">Vibe Coding Engine will calculate your admission probability.</p>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-64 h-16 rounded-2xl text-lg font-black tracking-tight bg-white text-primary hover:bg-zinc-100 transition-transform active:scale-95 shadow-lg"
              >
                {loading ? 'CALCULATING...' : 'GENERATE PREDICTION'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="result">
          <div className="grid grid-cols-1 gap-4">
            {predictions.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[32px] text-muted-foreground">
                <History className="w-12 h-12 mb-4 opacity-20" />
                <p className="italic uppercase tracking-widest text-[10px] font-bold">No predictions found in database</p>
              </div>
            ) : (
              predictions.map((pred, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={pred.id}
                  className="bg-card border border-border rounded-[32px] p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     <div className="md:col-span-1 flex flex-col justify-between border-r border-border/50 pr-4">
                        <div>
                          <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Admission Chance</span>
                          <p className={`text-6xl font-black italic mt-2 ${pred.chance > 70 ? 'text-green-500' : pred.chance > 40 ? 'text-orange-500' : 'text-destructive'}`}>
                            {pred.chance}<span className="text-xl not-italic opacity-30">%</span>
                          </p>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase mt-4">Record ID: {pred.id.slice(0, 8)}</p>
                     </div>

                     <div className="md:col-span-2 space-y-4">
                        <div>
                           <h3 className="text-2xl font-black italic uppercase leading-tight">{pred.targetMajor}</h3>
                           <p className="text-sm font-bold text-muted-foreground uppercase italic">{pred.targetPtn}</p>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                          <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-2 flex items-center gap-2">
                             <Sparkles className="w-3 h-3" /> Counselor Insight
                          </p>
                          <p className="text-xs text-muted-foreground italic leading-loose">"{pred.insights}"</p>
                        </div>
                     </div>

                     <div className="md:col-span-1 space-y-4 flex flex-col">
                        <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Alternatives</span>
                        <div className="space-y-2 flex-grow">
                           {pred.recommendedMajors?.map((major: string, idx: number) => (
                             <div key={idx} className="bg-secondary rounded-xl px-4 py-2 text-[10px] font-bold uppercase italic border border-border/30 truncate">
                                {major}
                             </div>
                           ))}
                        </div>
                        <p className="text-[9px] text-muted-foreground font-mono uppercase text-right">{new Date(pred.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
