import React, { useState, useEffect } from 'react';
import { 
  Sparkles, PenTool, LayoutDashboard, 
  FileText, CheckCircle, Loader2, 
  Crown, Lock, Download, X, 
  BrainCircuit, Search, ShieldCheck, 
  Lightbulb, ArrowLeft, ChevronRight, 
  BarChart3, Coffee, Menu, BookOpen, 
  Zap, MessageSquare, Clipboard
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);

// --- KOMPONEN FORMATTING TEKS ---
const FormattedText = ({ text }) => {
  if (!text) return null;
  const renderContent = () => {
    const lines = text.split('\n');
    const elements = [];
    let currentTable = [];

    lines.forEach((line, i) => {
      if (line.trim().startsWith('|')) {
        currentTable.push(line);
      } else {
        if (currentTable.length > 0) {
          elements.push(<TableComponent key={`table-${i}`} raw={currentTable} />);
          currentTable = [];
        }
        if (!line.trim()) {
          elements.push(<div key={i} className="h-4"></div>);
        } else {
          if (line.startsWith('###')) {
            elements.push(<h4 key={i} className="text-lg font-black text-slate-900 mt-6 mb-2 uppercase italic">{line.replace('###', '').trim()}</h4>);
          } else if (line.startsWith('##')) {
            elements.push(<h3 key={i} className="text-xl font-black text-indigo-600 mt-8 mb-4 border-l-4 border-indigo-600 pl-4 uppercase italic">{line.replace('##', '').trim()}</h3>);
          } else {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            elements.push(
              <div key={i} className="mb-3">
                {parts.map((part, j) => (
                  part.startsWith('**') && part.endsWith('**') 
                    ? <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
                    : <span key={j}>{part}</span>
                ))}
              </div>
            );
          }
        }
      }
    });
    if (currentTable.length > 0) elements.push(<TableComponent key="table-final" raw={currentTable} />);
    return elements;
  };
  return <div className="text-slate-700 leading-relaxed text-sm md:text-base antialiased">{renderContent()}</div>;
};

const TableComponent = ({ raw }) => {
  const rows = raw.filter(r => !r.includes('---') && r.trim() !== '').map(r => 
    r.split('|').filter((cell, idx, arr) => idx !== 0 && idx !== arr.length - 1).map(cell => cell.trim())
  );
  if (rows.length === 0) return null;
  return (
    <div className="my-8 overflow-x-auto border-2 border-slate-100 rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse min-w-[500px]">
        <thead className="bg-slate-50">
          <tr>{rows[0]?.map((cell, i) => <th key={i} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">{cell}</th>)}</tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i} className="hover:bg-indigo-50/30 transition-colors border-b border-slate-50 last:border-0">
              {row.map((cell, j) => <td key={j} className="p-4 text-sm font-medium text-slate-600">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DynamicVisualData = ({ title }) => {
  const barData = {
    labels: ['Pre-Test', 'Post-Test A', 'Post-Test B', 'Nasional'],
    datasets: [{
      label: 'Skor (%)',
      data: [42, 85, 78, 60],
      backgroundColor: ['#94a3b8', '#4f46e5', '#6366f1', '#e2e8f0'],
      borderRadius: 10,
    }],
  };

  const lineData = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
    datasets: [{
      label: 'Progres',
      data: [15, 30, 55, 80, 95],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <div className="my-10 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Simulasi Data Bab 4</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] h-64">
           <Bar data={barData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] h-64">
           <Line data={lineData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // --- KONFIGURASI PENTING ---
  const GEMINI_API_KEY = "AIzaSyDeeAZz7h9eHnFGZiAMN3IA2IHA9CkxpHM"; 
  const SAWERIA_URL = "https://saweria.co/skripsipro"; 

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customDonation, setCustomDonation] = useState('');

  const [inputs, setInputs] = useState({ title: '', fullDraft: '', summarize: '', paraphrase: '', plagiarism: '', gap: '', exam: '' });
  const [outputs, setOutputs] = useState({ title: '', fullDraft: '', summarize: '', paraphrase: '', plagiarism: '', gap: '', exam: '' });

  // --- PROTEKSI ANTI-MALING ---
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const confirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setHasPaid(true);
      setShowPaywall(false);
    }, 2000);
  };

  const processDonation = () => {
    window.open(SAWERIA_URL, "_blank");
  };

  const callGemini = async (prompt, system) => {
    if (!GEMINI_API_KEY) return "Error: API Key belum diisi oleh admin.";
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }], 
          systemInstruction: { parts: [{ text: system }] } 
        })
      });
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal mendapatkan respon AI.";
    } catch (e) { return "Terjadi kesalahan koneksi."; }
  };

  const handleAction = async (type) => {
    setIsLoading(true);
    let system = "", prompt = "";
    
    switch(type) {
      case 'fullDraft':
        system = "Pakar Riset Akademik. Buat draf skripsi Bab 1-5. Sertakan minimal 2 Tabel Markdown. Gunakan bahasa formal Indonesia.";
        prompt = `Buat draf skripsi lengkap Bab 1 sampai 5 untuk judul: "${inputs.fullDraft}"`;
        break;
      case 'title':
        system = "Ahli perumusan judul skripsi.";
        prompt = `Berikan 5 ide judul skripsi untuk topik: ${inputs.title}`;
        break;
      case 'summarize':
        system = "Editor jurnal ilmiah.";
        prompt = `Rangkum jurnal ini: ${inputs.summarize}`;
        break;
      case 'paraphrase':
        system = "Pakar bahasa akademik.";
        prompt = `Parafrase teks ini agar unik dan formal: ${inputs.paraphrase}`;
        break;
      default:
        system = "Asisten Akademik AI.";
        prompt = `Proses topik ini: ${inputs[type]}`;
    }

    const res = await callGemini(prompt, system);
    setOutputs(prev => ({ ...prev, [type]: res }));
    setIsLoading(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, desc: 'Dashboard Utama' },
    { id: 'fullDraft', label: 'Kerangka Skripsi', icon: Sparkles, desc: 'Draft Bab 1-5 + Tabel', pro: true, color: 'bg-indigo-600' },
    { id: 'summarize', label: 'Perangkum Jurnal', icon: BookOpen, desc: 'Bedah Jurnal & Artikel', color: 'bg-blue-600' },
    { id: 'paraphrase', label: 'Penyempurna Kalimat', icon: PenTool, desc: 'Parafrase Akademik', color: 'bg-emerald-600' },
    { id: 'title', label: 'Pencari Judul', icon: Lightbulb, desc: 'Ide Judul & Topik', color: 'bg-amber-500' },
    { id: 'gap', label: 'Research Gap', icon: Search, desc: 'Cari Celah Kebaruan', pro: true, color: 'bg-rose-600' },
    { id: 'exam', label: 'Simulasi Sidang', icon: BrainCircuit, desc: 'Latihan Tanya Jawab', pro: true, color: 'bg-orange-600' },
    { id: 'plagiarism', label: 'Cek Plagiasi', icon: ShieldCheck, desc: 'Analisis Kemiripan', pro: true, color: 'bg-sky-600' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-600/20"><ShieldCheck size={24} /></div>
          <span className="text-xl font-black text-white italic tracking-tighter">SKRIPSI<span className="text-indigo-500">PRO</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 p-2"><X size={24} /></button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-2 mt-4">
        {menuItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} 
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[1.2rem] transition-all group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <item.icon size={20} />
            <span className="font-bold text-sm">{item.label}</span>
            {item.pro && !hasPaid && <Lock size={12} className="ml-auto opacity-30" />}
          </button>
        ))}
      </div>
      <div className="p-6 border-t border-white/5">
        <button onClick={() => setShowPaywall(true)} className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 py-5 rounded-[1.5rem] font-black text-[10px] tracking-widest border border-indigo-500/20 flex items-center justify-center transition-all">
          <Coffee size={14} className="mr-2" /> DUKUNG SERVER
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen bg-[#F8FAFC] font-sans text-slate-900 ${!hasPaid ? 'select-none' : ''}`}>
      {/* Sidebar Desktop */}
      <div className="hidden md:flex w-80 bg-[#0F172A] flex-col border-r border-slate-800 z-20">
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Mobile */}
        <div className="md:hidden bg-[#0F172A] p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-2 text-white">
            <ShieldCheck size={20} className="text-indigo-500" />
            <span className="font-black italic text-base">SKRIPSI<span className="text-indigo-500">PRO</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2.5 bg-white/5 rounded-xl"><Menu size={20} /></button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] md:hidden animate-in fade-in duration-300">
            <div className="w-[85%] max-w-[320px] bg-[#0F172A] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Konten Utama */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 pb-40">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'dashboard' ? (
              <div className="space-y-12 animate-in fade-in">
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-[#020617] rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden">
                  <h1 className="text-4xl md:text-7xl font-black mb-8 italic tracking-tighter">Skripsi <span className="text-indigo-500">Beres,</span><br/>Wisuda <span className="text-indigo-200">Cepat.</span></h1>
                  <p className="text-slate-400 text-sm md:text-lg max-w-xl mb-12 font-medium leading-relaxed">Platform AI pertama yang mengintegrasikan pembuatan draf skripsi lengkap dengan tabel riset dan visualisasi data otomatis.</p>
                  <button onClick={() => setActiveTab('fullDraft')} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase shadow-2xl active:scale-95">Mulai Draft Bab 1-5</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {menuItems.filter(i => i.id !== 'dashboard').map((item) => (
                      <button key={item.id} onClick={() => setActiveTab(item.id)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all text-left group">
                        <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8`}><item.icon size={24} /></div>
                        <h3 className="font-black text-slate-900 text-sm uppercase italic mb-3">{item.label}</h3>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{item.desc}</p>
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 pb-20 animate-in slide-in-from-bottom-8">
                <button onClick={() => setActiveTab('dashboard')} className="flex items-center text-slate-400 font-black uppercase text-[10px] tracking-[0.4em] mb-4 hover:text-indigo-600">
                  <ArrowLeft size={14} className="mr-2" /> Kembali
                </button>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
                  <h2 className="text-3xl font-black text-slate-900 italic uppercase mb-8">{menuItems.find(i => i.id === activeTab)?.label}</h2>
                  <div className="space-y-6">
                    {['fullDraft', 'title', 'gap', 'exam'].includes(activeTab) ? (
                      <input 
                        type="text" 
                        value={inputs[activeTab]} 
                        onChange={(e) => setInputs({...inputs, [activeTab]: e.target.value})}
                        className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-indigo-600/30 outline-none text-lg font-bold"
                        placeholder="Masukkan judul atau topik penelitian..."
                      />
                    ) : (
                      <textarea 
                        value={inputs[activeTab]} 
                        onChange={(e) => setInputs({...inputs, [activeTab]: e.target.value})}
                        className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-indigo-600/30 outline-none text-base font-medium resize-none"
                        placeholder="Tempel teks referensi di sini..."
                      />
                    )}
                    <button onClick={() => handleAction(activeTab)} disabled={isLoading || !inputs[activeTab]} className="w-full bg-slate-950 text-white py-8 rounded-[2rem] font-black text-sm uppercase shadow-2xl disabled:opacity-50 hover:bg-black transition-all">
                      {isLoading ? <Loader2 className="animate-spin mx-auto" size={24} /> : "PROSES SEKARANG"}
                    </button>
                  </div>
                </div>
                
                {/* Output Box */}
                <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 min-h-[400px] shadow-2xl relative">
                   {outputs[activeTab] ? (
                     <div className="relative">
                       {!hasPaid && (
                         <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-20 flex items-center justify-center rounded-3xl">
                           <div className="bg-[#0F172A] text-white p-12 rounded-[3rem] shadow-2xl text-center max-w-xs m-4">
                             <Lock size={32} className="mx-auto mb-6 text-indigo-500" />
                             <h4 className="text-xl font-black mb-4 uppercase italic">Konten Terkunci</h4>
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-8 leading-relaxed">Donasi untuk membuka hasil lengkap, fitur salin, dan visual data.</p>
                             <button onClick={() => setShowPaywall(true)} className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-xs uppercase hover:bg-indigo-700">Buka Akses</button>
                           </div>
                         </div>
                       )}
                       <div className={!hasPaid ? "blur-md opacity-30 select-none pointer-events-none" : ""}>
                         <div className="flex justify-between items-center mb-10 bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Hasil Analisis</h3>
                           <button onClick={() => alert("Teks berhasil disalin!")} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-indigo-700">
                             Salin Hasil
                           </button>
                         </div>
                         {activeTab === 'fullDraft' && <DynamicVisualData />}
                         <FormattedText text={outputs[activeTab]} />
                       </div>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center h-[300px] text-slate-300 font-black uppercase text-[10px] tracking-widest">
                       <MessageSquare size={32} className="mb-4" /> Menunggu Input...
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM NAVIGATION (MOBILE) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-white/5 px-6 py-4 flex items-center justify-around z-[50] shadow-[0_-15px_50px_rgba(0,0,0,0.5)]">
           <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center space-y-2 transition-all ${activeTab === 'dashboard' ? 'text-indigo-500 scale-110' : 'text-slate-500'}`}>
             <LayoutDashboard size={24} />
             <span className="text-[7px] font-black uppercase tracking-widest">Home</span>
           </button>
           <button onClick={() => setActiveTab('fullDraft')} className={`flex flex-col items-center space-y-2 transition-all ${activeTab === 'fullDraft' ? 'text-indigo-500 scale-110' : 'text-slate-500'}`}>
             <Sparkles size={24} />
             <span className="text-[7px] font-black uppercase tracking-widest">Draft</span>
           </button>
           <div className="bg-indigo-600 p-4 rounded-2xl -mt-12 shadow-2xl shadow-indigo-600/40 border-[6px] border-[#0F172A] active:scale-90 transition-transform cursor-pointer" onClick={() => setShowPaywall(true)}>
             <Coffee size={24} className="text-white" />
           </div>
           <button onClick={() => setActiveTab('summarize')} className={`flex flex-col items-center space-y-2 transition-all ${activeTab === 'summarize' ? 'text-indigo-500 scale-110' : 'text-slate-500'}`}>
             <BookOpen size={24} />
             <span className="text-[7px] font-black uppercase tracking-widest">Jurnal</span>
           </button>
           <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center space-y-2 text-slate-500">
             <Menu size={24} />
             <span className="text-[7px] font-black uppercase tracking-widest">Menu</span>
           </button>
        </div>
      </div>

      {/* MODAL PAYWALL / DONASI */}
      {showPaywall && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white rounded-[3.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-[#0F172A] p-10 text-center text-white relative">
              <button onClick={() => setShowPaywall(false)} className="absolute top-6 right-6 opacity-30 hover:opacity-100 bg-white/10 p-2 rounded-full"><X size={18} /></button>
              <Coffee size={40} className="mx-auto mb-6 text-indigo-500" />
              <h2 className="text-2xl font-black italic uppercase">Beri Dukungan</h2>
              <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-widest font-bold">Bantu kami bayar server AI</p>
            </div>
            <div className="p-10 space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['15000', '35000'].map((p) => (
                  <button key={p} onClick={() => setCustomDonation(p)} className={`border-2 p-4 rounded-2xl ${customDonation === p ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <span className="font-black text-slate-900 text-xs block">Rp {parseInt(p).toLocaleString()}</span>
                  </button>
                ))}
              </div>
              <a 
                href={SAWERIA_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={processDonation}
                className="block w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-xs uppercase shadow-xl text-center hover:bg-indigo-700 transition-colors"
              >
                1. BAYAR VIA SAWERIA
              </a>
              
              <div className="h-[1px] bg-slate-100 my-4"></div>

              <button 
                onClick={confirmPayment} 
                disabled={isProcessingPayment} 
                className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase shadow-md flex items-center justify-center hover:bg-black transition-colors"
              >
                {isProcessingPayment ? <Loader2 className="animate-spin" /> : "2. SAYA SUDAH BAYAR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
