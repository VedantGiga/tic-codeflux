import {
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Home,
  LogOut,
  Pill,
  Settings,
  UploadCloud,
  User,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { patientsApi, type Patient, type DashboardData } from "@/lib/api";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function Dashboard() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // 1. Fetch all patients
  const { data: patients, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: patientsApi.getAll,
  });

  // Set first patient as default if none selected
  useEffect(() => {
    if (patients && patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  // 2. Fetch dashboard data for selected patient
  const { 
    data: dashData, 
    isLoading: isLoadingDash,
    isPlaceholderData 
  } = useQuery({
    queryKey: ["dashboard", selectedPatientId],
    queryFn: () => patientsApi.dashboard(selectedPatientId!),
    enabled: !!selectedPatientId,
  });

  const activePatient = patients?.find(p => p.id === selectedPatientId);

  if (isLoadingPatients) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full flex-col font-body transition-colors duration-500">
      <div className="h-[80px]">
        <Navbar />
      </div>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full px-4 lg:px-8 py-6 gap-6 relative">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col gap-8 py-6 liquid-glass rounded-3xl border border-border/50 sticky top-[100px] h-[calc(100vh-120px)] overflow-hidden">
          <div className="px-6 flex items-center justify-between">
            <h2 className="text-xl font-heading tracking-wide italic text-foreground/80 dark:text-foreground/50 uppercase text-[10px] opacity-70 dark:opacity-50">Patient Profiles</h2>
          </div>

          <div className="px-4 flex flex-col gap-2 overflow-y-auto max-h-[40%] scrollbar-hide">
            {patients?.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border ${
                  selectedPatientId === patient.id
                    ? "bg-foreground text-background border-transparent font-medium shadow-lg"
                    : "text-foreground/70 border-border/30 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${selectedPatientId === patient.id ? "bg-background/20" : "bg-foreground/10"}`}>
                  {patient.name.charAt(0)}
                </div>
                <span className="truncate">{patient.name}</span>
              </button>
            ))}
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-border/50 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all text-sm mt-2">
              <Users className="w-4 h-4" />
              Manage All
            </button>
          </div>

          <div className="h-px bg-border/30 mx-6" />

          <nav className="flex-1 px-4 flex flex-col gap-2">
            {[
              { icon: Home, label: "Overview", active: true },
              { icon: Calendar, label: "Schedule", active: false },
              { icon: Pill, label: "Medications", active: false },
              { icon: Activity, label: "Analytics", active: false },
              { icon: Settings, label: "Settings", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  item.active
                    ? "bg-foreground/5 text-foreground font-medium border border-border/50"
                    : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="px-4 pb-4 mt-auto">
            <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">Caregiver</p>
                <p className="text-xs text-foreground/60 dark:text-foreground/50 truncate">Premium Admin</p>
              </div>
              <LogOut className="w-4 h-4 text-foreground/60 dark:text-foreground/50 cursor-pointer hover:text-foreground" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 w-full max-w-full min-w-0">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPatientId}
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-foreground/60 text-sm mb-1">Health Dashboard for</p>
                <h1 className="text-4xl md:text-5xl font-heading text-foreground tracking-tight leading-none uppercase italic">
                  {activePatient?.name || "Select Patient"}
                </h1>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-3">
              <button className="liquid-glass p-3 rounded-full border border-border/50 text-foreground hover:bg-foreground/5 transition-colors relative group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </header>

          {isLoadingDash ? (
            <div className="flex-1 flex flex-col items-center justify-center h-[400px] opacity-50">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-foreground/60">Fetching clinical data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats & Chart */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                  <div className="liquid-glass-strong rounded-3xl p-8 border border-border/50 bg-white/40 dark:bg-transparent flex flex-col relative overflow-hidden group min-h-[300px]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-foreground/60 dark:text-foreground/50 font-medium text-xs uppercase tracking-widest mb-1 italic">Weekly Adherence Trend</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-heading text-foreground italic">{dashData?.adherencePercentage || 0}%</span>
                          <span className="text-green-500 text-sm font-medium flex items-center">
                            ↑ 4% this month
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <Activity className="w-8 h-8 text-primary/30" />
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full h-[180px] -ml-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dashData?.weeklyAdherence || []}>
                          <defs>
                            <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: "hsl(var(--foreground))", opacity: 0.5}}
                            tickFormatter={(val) => val.split("-")[2]} 
                          />
                          <Tooltip 
                            contentStyle={{background: "hsl(var(--card))", borderRadius: "12px", border: "1px solid hsl(var(--border))"}}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="percentage" 
                            stroke="hsl(var(--foreground))" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorAdherence)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Status Column */}
                <div className="flex flex-col gap-6">
                  {/* Next Dose Card */}
                  <div className="liquid-glass rounded-3xl p-8 border border-border/50 flex flex-col items-center justify-center text-center relative overflow-hidden group aspect-square lg:aspect-auto flex-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                    <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform">
                      <div className="absolute inset-0 rounded-full border border-foreground/20 animate-pulse"></div>
                      <Clock className="w-10 h-10 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-heading text-foreground italic mb-1 uppercase tracking-tighter">Next Dose</h3>
                    <p className="text-foreground/50 text-sm font-medium">
                      {dashData?.todayDoses.find(d => d.status === "pending")?.medicineName || "No pending doses"}
                    </p>
                    <div className="mt-4 px-4 py-1.5 rounded-full bg-foreground text-background text-[10px] font-bold uppercase tracking-widest">
                      {dashData?.todayDoses.find(d => d.status === "pending")?.scheduledTime || "Schedule Clear"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-2">
                {/* Today's Schedule */}
                <div className="xl:col-span-2 liquid-glass-strong rounded-3xl border border-border/50 overflow-hidden flex flex-col">
                  <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-heading text-2xl text-foreground italic uppercase italic tracking-tight">Today's Protocol</h3>
                    <button className="text-xs text-foreground/40 hover:text-foreground transition-all flex items-center gap-1 uppercase font-bold tracking-widest">
                      View Calendar <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-4 flex-1">
                    {dashData?.todayDoses.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center py-12 text-foreground/40">
                        <Calendar className="w-10 h-10 mb-2 opacity-20" />
                        <p>No medication scheduled for today.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {dashData?.todayDoses.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-6 p-5 hover:bg-foreground/[0.03] rounded-[2rem] transition-all cursor-pointer group border border-transparent hover:border-border/30"
                          >
                            <div className="w-20 flex-shrink-0 text-left">
                              <p className="text-lg font-heading italic text-foreground tracking-tighter">{item.scheduledTime}</p>
                            </div>
                            
                            <div className="w-px h-12 bg-border/50 relative">
                              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-background shadow-xl ${
                                item.status === 'taken' ? 'bg-green-500' :
                                item.status === 'missed' ? 'bg-red-500' : 'bg-primary'
                              }`}></div>
                            </div>

                            <div className="flex-1">
                              <p className="text-foreground font-medium text-lg leading-tight">{item.medicineName}</p>
                              <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest">{item.dosage}</p>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.status === "taken" && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                              {item.status === "missed" && <XCircle className="w-6 h-6 text-red-500" />}
                              {item.status === "pending" && <div className="px-4 py-1 border border-border/50 text-foreground/60 text-[10px] font-bold uppercase tracking-widest rounded-full">Pending</div>}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Simulation/Insight Feed */}
                <div className="liquid-glass-strong rounded-3xl border border-border/50 overflow-hidden flex flex-col relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none" />
                  <div className="px-8 py-6 border-b border-border/50">
                    <h3 className="font-heading text-2xl text-foreground italic uppercase tracking-tight">Clinical Insights</h3>
                  </div>
                  <div className="p-8 flex-1 flex flex-col gap-8">
                    <div className="flex items-start gap-4 ring-1 ring-border/30 p-4 rounded-2xl bg-foreground/[0.02]">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground italic uppercase tracking-tighter">Smart AI Check-in</p>
                        <p className="text-xs text-foreground/50 leading-relaxed mt-1">
                          Patient responded to "Voice Call" at 08:42 AM. Interaction duration: 42s. 
                          <span className="block mt-2 font-bold text-foreground italic">"I've taken the blue pill, thank you."</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4 className="text-[10px] uppercase font-black text-foreground/30 tracking-[0.2em]">Latest Telemetry</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground/50 font-medium italic">Call Success Rate</span>
                        <span className="text-foreground font-heading italic text-xl">98.2%</span>
                      </div>
                      <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

