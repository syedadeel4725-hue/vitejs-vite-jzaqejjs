import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  Plus,
  MapPin,
  Star,
  X,
  Home,
  MessageSquare,
  Bot,
  User,
  Image as ImageIcon,
  Video,
  Send,
  LogIn,
  LogOut,
  Phone,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Building
} from 'lucide-react';

// SUPABASE CLIENT SETUP
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GROQ AI API HELPER
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY";

async function fetchGroqChatResponse(userMessage: string) {
  if (!GROQ_API_KEY || GROQ_API_KEY.includes("YOUR_")) {
    return "Groq API Key set nahi hai. Environment variables check karein.";
  }
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: userMessage }]
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response from AI.";
  } catch (err) {
    return "AI Error: Connection response nahi de raha.";
  }
}

const citiesList = ['All Cities', 'Sargodha', 'Faisalabad', 'Lahore', 'Karachi', 'Islamabad', 'Sialkot'];
const categories = [
  { name: 'All Services', icon: '⚡' },
  { name: 'Electrician & Wiring', icon: '🔌' },
  { name: 'Plumbing & Repair', icon: '🔧' },
  { name: 'Mobile Repair', icon: '📱' },
  { name: 'Electronics', icon: '💻' }
];

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  price: string;
  city: string;
  provider: string;
  phone: string;
  images: string[];
  video?: string;
  isVerified?: boolean;
  desc?: string;
}
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'ai' | 'profile'>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Auth States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'easypaisa' | 'jazzcash' | 'bank'>('easypaisa');
  const [transactionId, setTransactionId] = useState('');

  // Ad Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Electrician & Wiring');
  const [newPrice, setNewPrice] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [selectedCity, setSelectedCity] = useState('Sargodha');

  // Listings List
  const [listings, setListings] = useState<ServiceItem[]>([
    {
      id: '1',
      title: 'AC & Refrigerator Repairing',
      category: 'Electronics',
      price: 'Rs. 1,500',
      city: 'Sargodha',
      provider: 'Sargodha Cool Services',
      phone: '03001234567',
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500'],
      isVerified: true,
      desc: 'Expert home delivery and maintenance in Sargodha.'
    }
  ]);

  // AI Chat State
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Assalam-o-Alaikum! Main Dukan.ai Assistant hoon. Services, pricing ya post lagane ke hawale se poochein.' }
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      if (error) alert(error.message);
      else alert("Account ban gaya hai! Ab login karein.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) alert(error.message);
      else setIsAuthOpen(false);
    }
  };

  const handleMultipleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selected = Array.from(files).slice(0, 3);
      const urls: string[] = [];
      selected.forEach((f) => {
        const r = new FileReader();
        r.onloadend = () => {
          if (r.result) {
            urls.push(r.result as string);
            if (urls.length === selected.length) setImagePreviews(urls);
          }
        };
        r.readAsDataURL(f);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setVideoPreview(r.result as string);
      r.readAsDataURL(file);
    }
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAd: ServiceItem = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      price: `Rs. ${newPrice}`,
      city: selectedCity,
      provider: currentUser?.email || 'Guest User',
      phone: newPhone,
      images: imagePreviews.length > 0 ? imagePreviews : ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500'],
      video: videoPreview || undefined,
      isVerified: false,
      desc: newDesc
    };
    setListings([newAd, ...listings]);
    setIsModalOpen(false);
    alert('Aapka Ad post ho chuka hai!');
  };

  const handleSendAiMessage = async () => {
    if (!aiInput.trim()) return;
    const txt = aiInput;
    setAiMessages((prev) => [...prev, { sender: 'user', text: txt }]);
    setAiInput('');
    const res = await fetchGroqChatResponse(txt);
    setAiMessages((prev) => [...prev, { sender: 'bot', text: res }]);
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-lg">D</div>
            <h1 className="text-base font-extrabold">Dukan<span className="text-blue-600">.ai</span></h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsPaymentOpen(true)} className="flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              <ShieldCheck className="h-4 w-4" /> Verify (Rs. 500)
            </button>
            {currentUser ? (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">
                <Plus className="h-4 w-4" /> Post Ad
              </button>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-1 border border-blue-600 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                <LogIn className="h-4 w-4" /> Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-4xl px-4 pt-4">
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Search & City Filter */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search services or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-xs bg-white shadow-sm"
              />
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="rounded-2xl border px-3 py-2 text-xs bg-white font-bold shadow-sm">
                {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Category Badges */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 ${selectedCategory === c.name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'}`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>

            {/* Ads Feed */}
            <div className="grid gap-4 sm:grid-cols-2">
              {listings.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-3">
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
                    {item.isVerified && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-sm">{item.title}</h3>
                      <span className="text-blue-600 font-black text-xs">{item.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-slate-400" /> {item.city} • {item.category}
                    </p>
                  </div>

                  {item.desc && <p className="text-xs text-slate-600 line-clamp-2">{item.desc}</p>}

                  {/* WhatsApp Direct Order Button */}
                  <a
                    href={`https://wa.me/92${item.phone.replace(/^0/, '')}?text=Assalam-o-Alaikum, mujhe aapki ad "${item.title}" ke baare mein baat karni hai.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Phone className="h-3.5 w-3.5" /> Order via WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === 'ai' && (
          <div className="flex h-[72vh] flex-col rounded-3xl border bg-white p-4 shadow-sm">
            <div className="flex-1 overflow-y-auto space-y-3 p-2">
              {aiMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2 pt-2 border-t">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask Dukan.ai Assistant..."
                className="flex-1 border rounded-2xl px-3 py-2 text-xs bg-slate-50"
              />
              <button onClick={handleSendAiMessage} className="bg-blue-600 text-white p-2.5 rounded-2xl">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            {currentUser ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400">Account Owner</p>
                  <p className="text-sm font-black">{currentUser.email}</p>
                </div>
                <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-bold">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 mb-3">Please login to access your ads and leads dashboard.</p>
                <button onClick={() => setIsAuthOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold">Login / Sign Up</button>
              </div>
            )}
          </div>
        )}
      </main>
            {/* EASYPAISA / JAZZCASH PAYMENT MODAL */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-amber-500" /> Get Verified Badge</h3>
              <button onClick={() => setIsPaymentOpen(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600">Verification fee **Rs. 500** transfer karke TRX ID enter karein:</p>
              
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setSelectedPaymentMethod('easypaisa')} className={`p-2 rounded-xl border font-bold text-[11px] ${selectedPaymentMethod === 'easypaisa' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'bg-slate-50'}`}>Easypaisa</button>
                <button onClick={() => setSelectedPaymentMethod('jazzcash')} className={`p-2 rounded-xl border font-bold text-[11px] ${selectedPaymentMethod === 'jazzcash' ? 'border-red-500 bg-red-50 text-red-700' : 'bg-slate-50'}`}>JazzCash</button>
                <button onClick={() => setSelectedPaymentMethod('bank')} className={`p-2 rounded-xl border font-bold text-[11px] ${selectedPaymentMethod === 'bank' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'bg-slate-50'}`}>Bank</button>
              </div>

              <div className="p-3 bg-slate-100 rounded-2xl text-[11px] space-y-1">
                <p><strong>Account Title:</strong> Dukan AI Official</p>
                <p><strong>Number:</strong> 0300-1234567</p>
              </div>

              <input
                type="text"
                placeholder="Enter Transaction ID (TRX ID)"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-slate-50 font-mono text-xs"
              />

              <button
                onClick={() => {
                  if(!transactionId) return alert("Pehle TRX ID enter karein!");
                  alert("Aapki payment request submit ho gayi hai. 2 ghante me Badge active ho jayega.");
                  setIsPaymentOpen(false);
                }}
                className="w-full bg-amber-500 text-white font-bold py-2.5 rounded-xl shadow-sm"
              >
                Submit Payment Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST AD MODAL WITH MULTI-IMAGE & VIDEO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-sm">Post New Listing</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateAd} className="mt-4 space-y-3 text-xs">
              <input type="text" required placeholder="Ad Title (e.g. Electrician Service)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full border rounded-xl p-2.5 bg-slate-50" />
              
              <div className="grid grid-cols-2 gap-2">
                <input type="text" required placeholder="Price (e.g. 1000)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full border rounded-xl p-2.5 bg-slate-50" />
                <input type="text" required placeholder="WhatsApp Phone (03xx)" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full border rounded-xl p-2.5 bg-slate-50" />
              </div>

              <textarea placeholder="Service/Product Description..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full border rounded-xl p-2.5 bg-slate-50 h-20" />

              <div>
                <label className="font-bold block mb-1">Select Images (Max 3)</label>
                <input type="file" multiple accept="image/*" onChange={handleMultipleImages} className="w-full text-[11px]" />
              </div>

              <div>
                <label className="font-bold block mb-1">Select Short Video Clip</label>
                <input type="file" accept="video/*" onChange={handleVideoUpload} className="w-full text-[11px]" />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl shadow-sm">Publish Listing</button>
            </form>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-sm">{isSignUp ? 'Create Account' : 'Login'}</h3>
              <button onClick={() => setIsAuthOpen(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAuth} className="mt-4 space-y-3 text-xs">
              <input type="email" required placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full border rounded-xl p-2.5 bg-slate-50" />
              <input type="password" required placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full border rounded-xl p-2.5 bg-slate-50" />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl shadow-sm">{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} className="mt-3 text-[11px] text-blue-600 font-bold w-full text-center">
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white p-2 z-40">
        <div className="flex justify-around max-w-md mx-auto">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center text-[10px] ${activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}><Home className="h-5 w-5" />Home</button>
          <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center text-[10px] ${activeTab === 'ai' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}><Bot className="h-5 w-5" />AI Bot</button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center text-[10px] ${activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}><User className="h-5 w-5" />Profile</button>
        </div>
      </nav>
    </div>
  );
                                                                                                }
