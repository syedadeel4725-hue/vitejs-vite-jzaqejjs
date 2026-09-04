import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  Plus,
  MapPin,
  X,
  Home,
  Bot,
  User,
  Phone,
  ShieldCheck,
  Send,
  LogIn,
  LogOut
} from 'lucide-react';

// SUPABASE & GROQ SETUP
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

async function fetchGroqChatResponse(userMessage: string) {
  if (!GROQ_API_KEY) return "Groq API Key missing hai. Netlify variables me add karein.";
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
    return data.choices?.[0]?.message?.content || "No AI response";
  } catch (err) {
    return "AI Error: Server respond nahi kar raha.";
  }
}

const citiesList = ['All Cities', 'Sargodha', 'Faisalabad', 'Lahore', 'Karachi', 'Islamabad'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'profile'>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Payment State
  const [trxId, setTrxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'easypaisa' | 'jazzcash'>('easypaisa');

  // New Ad Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Sargodha');

  // Listings Feed
  const [listings, setListings] = useState([
    {
      id: '1',
      title: 'AC & Fridge Repair Service',
      price: 'Rs. 1,500',
      city: 'Sargodha',
      phone: '03001234567',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
      isVerified: true,
      desc: 'Expert technical staff available 24/7.'
    }
  ]);

  // AI Chat Messages
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { sender: 'bot', text: 'Assalam-o-Alaikum! Dukan.ai me khushamdeed. Main aap ki kya madad kar sakta hoon?' }
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user || null);
    });
    return () => authListener.subscription?.unsubscribe();
  }, []);

  // Auth Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      if (error) alert(error.message);
      else alert("Account ban gaya! Ab login karein.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) alert(error.message);
      else setIsAuthOpen(false);
    }
  };

  // Multiple Images Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Create Ad
  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAd = {
      id: Date.now().toString(),
      title: newTitle,
      price: `Rs. ${newPrice}`,
      city: selectedCity,
      phone: newPhone,
      image: imagePreviews[0] || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
      isVerified: false,
      desc: newDesc
    };
    setListings([newAd, ...listings]);
    setIsModalOpen(false);
    alert('Ad successfully post ho chuka hai!');
  };

  // AI Send
  const handleSendAi = async () => {
    if (!aiInput.trim()) return;
    const txt = aiInput;
    setAiMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setAiInput('');
    const res = await fetchGroqChatResponse(txt);
    setAiMessages(prev => [...prev, { sender: 'bot', text: res }]);
  };

  const filteredListings = listings.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCity === 'All Cities' || item.city === selectedCity)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center">D</div>
            <h1 className="text-base font-extrabold">Dukan<span className="text-blue-600">.ai</span></h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsPaymentOpen(true)} className="flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold">
              <ShieldCheck className="h-4 w-4" /> Verify (Rs 500)
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

      {/* BODY */}
      <main className="mx-auto max-w-4xl px-4 pt-4">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border px-4 py-2 text-xs bg-white"
              />
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="rounded-2xl border px-3 py-2 text-xs bg-white font-bold">
                {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredListings.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border p-4 shadow-sm space-y-3">
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
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
                      <MapPin className="h-3 w-3" /> {item.city}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{item.desc}</p>

                  <a
                    href={`https://wa.me/92${item.phone.replace(/^0/, '')}?text=Assalam-o-Alaikum, mujhe aapki ad "${item.title}" ke baare me baat karni hai.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5" /> Order via WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI TAB */}
        {activeTab === 'ai' && (
          <div className="flex h-[70vh] flex-col rounded-3xl border bg-white p-4 shadow-sm">
            <div className="flex-1 overflow-y-auto space-y-2">
              {aiMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
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
                className="flex-1 border rounded-xl px-3 py-2 text-xs"
              />
              <button onClick={handleSendAi} className="bg-blue-600 text-white p-2 rounded-xl">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            {currentUser ? (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400">Logged in email:</p>
                <p className="text-sm font-black">{currentUser.email}</p>
                <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-bold">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <User className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 mb-3">Please login to post ads and manage profile.</p>
                <button onClick={() => setIsAuthOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Login / Sign Up</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* PAYMENT MODAL */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm">Easypaisa / Jazzcash Verification</h3>
              <button onClick={() => setIsPaymentOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 space-y-3 text-xs">
              <p>Rs 500 send karein aur Transaction ID enter karein:</p>
              <div className="p-3 bg-slate-100 rounded-xl space-y-1">
                <p><strong>Account Name:</strong> Dukan AI</p>
                <p><strong>Easypaisa/Jazzcash:</strong> 0300-1234567</p>
              </div>
              <input
                type="text"
                placeholder="Enter TRX ID"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full border rounded-xl p-2.5"
              />
              <button onClick={() => { alert("Verification request submitted!"); setIsPaymentOpen(false); }} className="w-full bg-amber-500 text-white font-bold py-2.5 rounded-xl">Submit TRX ID</button>
            </div>
          </div>
        </div>
      )}

      {/* POST AD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm">Post New Listing</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateAd} className="mt-3 space-y-3 text-xs">
              <input type="text" required placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full border rounded-xl p-2" />
              <input type="text" required placeholder="Price (Rs)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full border rounded-xl p-2" />
              <input type="text" required placeholder="WhatsApp Number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full border rounded-xl p-2" />
              <textarea placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full border rounded-xl p-2 h-16" />
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full text-[11px]" />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl">Publish Ad</button>
            </form>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm">{isSignUp ? 'Sign Up' : 'Login'}</h3>
              <button onClick={() => setIsAuthOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleAuth} className="mt-3 space-y-3 text-xs">
              <input type="email" required placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full border rounded-xl p-2.5" />
              <input type="password" required placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full border rounded-xl p-2.5" />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl">{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} className="mt-2 text-[11px] text-blue-600 font-bold w-full text-center">
              {isSignUp ? 'Already have account? Login' : "Don't have account? Sign Up"}
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

