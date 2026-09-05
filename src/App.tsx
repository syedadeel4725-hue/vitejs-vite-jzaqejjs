import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search, Plus, MapPin, X, Home, Bot, User, Send,
  LogOut, Headphones, HelpCircle, CheckCircle,
  ShoppingBag, AlertCircle, Image as ImageIcon, Video, Paperclip,
  Lock, DollarSign, MessageCircle, Clock, FileText, EyeOff,
  Sparkles, TrendingUp, RefreshCw, Zap
} from 'lucide-react';

// --- RUNTIME ERROR CATCHER ---
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const root = document.getElementById('root');
    if (root && !document.getElementById('error-box')) {
      root.innerHTML = `
        <div id="error-box" style="padding: 20px; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; margin: 20px; border-radius: 8px; font-family: sans-serif;">
          <h3 style="margin-top:0;">Runtime Alert:</h3>
          <p>${event.message}</p>
        </div>
      `;
    }
  });
}

// --- SAFE ENVIRONMENT SETUP ---
const getEnv = (key: string) => {
  try {
    return (import.meta as any).env?.[key] || '';
  } catch {
    return '';
  }
};

const rawUrl = getEnv('VITE_SUPABASE_URL').trim();
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY').trim();

const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const GROQ_API_KEY = getEnv('VITE_GROQ_API_KEY').trim();

export const askAI = async (userMessage: string) => {
  if (!GROQ_API_KEY) return "Groq API Key missing hai. Netlify settings me add karein.";
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
    return data.choices?.[0]?.message?.content || "No AI response.";
  } catch {
    return "AI Assistant offline hai. Koshish jari rakhein.";
  }
};

const citiesList = ['All Cities', 'Sargodha', 'Faisalabad', 'Lahore', 'Karachi', 'Islamabad'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'chats' | 'ai' | 'profile'>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);
  const [isPostFeeOpen, setIsPostFeeOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Auth States
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authType, setAuthType] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');

  // Seller Posting Limits (5 Free, then 100 PKR Fee)
  const [userPostCount, setUserPostCount] = useState(0);
  const [postFeeTrxId, setPostFeeTrxId] = useState('');
  const [postFeeScreenshot, setPostFeeScreenshot] = useState<string | null>(null);

  // Post Ad Form States
  const [adTitle, setAdTitle] = useState('');
  const [adPrice, setAdPrice] = useState('');
  const [adType, setAdType] = useState<'product' | 'service'>('service');
  const [adCity, setAdCity] = useState('Sargodha');
  const [adDescription, setAdDescription] = useState('');
  const [adDeliveryTime, setAdDeliveryTime] = useState('3 Days');
  const [adRequirements, setAdRequirements] = useState('');
  const [adImage, setAdImage] = useState<string | null>(null);

  // Escrow Payment States
  const [paymentMethod, setPaymentMethod] = useState<'easypaisa' | 'jazzcash'>('easypaisa');
  const [trxId, setTrxId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);

  // Filter & Feed States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [filterType, setFilterType] = useState<'all' | 'product' | 'service'>('all');

  // Feed Items (Equal Rotation Feed)
  const [items, setItems] = useState<any[]>([
    {
      id: 1,
      title: 'Shopify Store & Meta Ads Setup',
      price: 12000,
      type: 'service',
      city: 'Sargodha',
      seller: 'Adeel Digital',
      description: 'Complete high-converting e-commerce store with Meta Pixel setup.',
      deliveryTime: '3 Days',
      requirements: 'Product details & store login.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
      boosted: true,
      views: 124
    },
    {
      id: 2,
      title: 'Full Stack Web App Development',
      price: 25000,
      type: 'service',
      city: 'Lahore',
      seller: 'DevStudio',
      description: 'Custom React & Node.js application with Supabase database.',
      deliveryTime: '7 Days',
      requirements: 'Project scope document.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
      boosted: false,
      views: 89
    }
  ]);

  // Escrow Orders
  const [escrowOrders, setEscrowOrders] = useState<any[]>([]);

  // Direct Messaging / Chat
  const [activeChatSeller, setActiveChatSeller] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string, text: string, media?: string, isVideo?: boolean }>>([
    { sender: 'Adeel Digital', text: 'Assalam-o-Alaikum! Aap apna project requirement share karein, main escrow order accept kar leta hoon.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMedia, setChatMedia] = useState<{ url: string, isVideo: boolean } | null>(null);

  // AI Chat States
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'bot', text: string }>>([
    { sender: 'bot', text: 'Assalam-o-Alaikum! Main Dukan.ai Smart Assistant hoon. Listing, 100 PKR posting fee ya Escrow 5% commission ke baaray mein poochein.' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
      useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Image Upload Helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Chat Media Attachment
  const handleChatMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onloadend = () => setChatMedia({ url: reader.result as string, isVideo: isVid });
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (supabaseUrl.includes('placeholder')) {
      setAuthError('Supabase configuration setup hone wali hai.');
      return;
    }

    try {
      const emailTarget = authType === 'email' ? authEmail : `${authPhone}@dukan.local`;
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email: emailTarget, password: authPassword });
        if (error) throw error;
        alert('Account successful create ho gaya!');
        setIsAuthOpen(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: emailTarget, password: authPassword });
        if (error) throw error;
        setIsAuthOpen(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error');
    }
  };

  // Check 5 Free Posts Limit
  const handleOpenPostAd = () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    if (userPostCount >= 5) {
      setIsPostFeeOpen(true); // 100 PKR Fee Modal
    } else {
      setIsPostAdOpen(true);
    }
  };

  // Submit 100 PKR Fee for extra posts
  const handlePostFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postFeeTrxId || !postFeeScreenshot) {
      alert('Trx ID aur Payment Screenshot (SS) upload karna LAZMI hai!');
      return;
    }
    setIsPostFeeOpen(false);
    setIsPostAdOpen(true);
    setPostFeeTrxId('');
    setPostFeeScreenshot(null);
    alert('Rs. 100 Listing Fee verified! Aap apni next post add kar sakte hain.');
  };

  // Create Product / Service Post
  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adPrice) return;

    const newItem = {
      id: Date.now(),
      title: adTitle,
      price: Number(adPrice),
      type: adType,
      city: adCity,
      seller: currentUser?.email || 'Seller User',
      description: adDescription,
      deliveryTime: adDeliveryTime,
      requirements: adRequirements,
      image: adImage || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80',
      boosted: true,
      views: 0
    };

    setItems([newItem, ...items]);
    setUserPostCount(userPostCount + 1);
    setIsPostAdOpen(false);
    setAdTitle('');
    setAdPrice('');
    setAdDescription('');
    setAdRequirements('');
    setAdImage(null);
    alert('Aapki Service/Product post ho gayi hai! Smart AI Boost se sab ko sales milegi.');
  };

  // Smart Auto-Rotate Algorithm (Equal Sales Visibility)
  const handleAutoRotateFeed = () => {
    const rotated = [...items].sort(() => Math.random() - 0.5);
    setItems(rotated);
    alert('Smart Auto-Boost Activated! Listings top feed par rotate ho gayi hain.');
  };

  // Escrow Order Submit
  const handleEscrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId || !paymentScreenshot) {
      alert('Transaction ID aur Payment Screenshot (SS) upload karna LAZMI hai!');
      return;
    }

    const price = selectedItem.price;
    const fee = price * 0.05; // 5% Admin Commission
    const sellerPayout = price - fee;

    const newOrder = {
      id: Date.now(),
      itemTitle: selectedItem.title,
      price: price,
      adminFee: fee,
      sellerPayout: sellerPayout,
      seller: selectedItem.seller,
      trxId: trxId,
      screenshot: paymentScreenshot,
      status: 'In Escrow (Locked Funds)',
      date: new Date().toLocaleDateString()
    };

    setEscrowOrders([newOrder, ...escrowOrders]);
    setIsEscrowOpen(false);
    setTrxId('');
    setPaymentScreenshot(null);
    alert('Payment Escrow me safe ho gayi hai! Seller kaam start kar dega.');
  };

  // Release Payment
  const handleReleasePayment = (orderId: number) => {
    setEscrowOrders(escrowOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Completed (5% Cut Deducted & Released)' };
      }
      return o;
    }));
    alert('Payment Seller ko transfer kar di gayi hai! 5% platform commission cut ho gaya hai.');
  };

  // Direct Chat
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !chatMedia) return;

    const newMsg = {
      sender: currentUser?.email || 'Buyer User',
      text: chatInput,
      media: chatMedia?.url,
      isVideo: chatMedia?.isVideo
    };

    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    setChatMedia(null);
  };

  // AI Chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput;
    setAiInput('');
    setAiMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiLoading(true);

    const reply = await askAI(userMsg);
    setAiMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    setAiLoading(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || item.city === selectedCity;
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* Top Header */}
      <header className="bg-blue-700 text-white p-3.5 sticky top-0 z-40 shadow-md flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-amber-300" />
          <h1 className="text-xl font-black tracking-wide">Dukan.ai</h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenPostAd}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Item / Service
          </button>

          <button 
            onClick={() => setIsSupportOpen(true)}
            className="p-1.5 hover:bg-blue-800 rounded-full transition"
            title="Help & Support"
          >
            <Headphones className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-4 max-w-md mx-auto space-y-4">

        {/* TAB 1: HOME FEED WITH SMART ROTATION */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Search & Auto Boost Control */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products or services..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 bg-slate-50 text-xs p-2 rounded-xl border border-slate-200 outline-none font-medium text-slate-600"
                >
                  {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <div className="flex bg-slate-100 p-0.5 rounded-xl text-[11px] font-semibold">
                  <button onClick={() => setFilterType('all')} className={`px-2.5 py-1 rounded-lg ${filterType === 'all' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>All</button>
                  <button onClick={() => setFilterType('product')} className={`px-2.5 py-1 rounded-lg ${filterType === 'product' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Products</button>
                  <button onClick={() => setFilterType('service')} className={`px-2.5 py-1 rounded-lg ${filterType === 'service' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Services</button>
                </div>
              </div>

              {/* AI Auto-Rotation Button for Equal Sales */}
              <button 
                onClick={handleAutoRotateFeed}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold py-2 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" /> AI Smart Boost (Equal Sales Feed Rotation)
              </button>
            </div>

            {/* Posting Status Indicator */}
            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-xs flex justify-between items-center text-blue-900">
              <span>Your Post Credits: <strong>{5 - userPostCount} Free Left</strong> (5 Free Limit)</span>
              {userPostCount >= 5 && <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-bold">Rs. 100 / Post Active</span>}
            </div>

            {/* Service & Product Cards */}
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden space-y-3 relative">
                  {item.boosted && (
                    <span className="absolute top-2 left-2 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow z-10">
                      <Zap className="w-3 h-3 fill-slate-900" /> Auto Boosted
                    </span>
                  )}

                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
                  )}

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${item.type === 'service' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] space-y-1 text-slate-600 border border-slate-100">
                      <p className="flex items-center gap-1 font-semibold"><Clock className="w-3.5 h-3.5 text-blue-600" /> Delivery: {item.deliveryTime}</p>
                      {item.requirements && (
                        <p className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-slate-400" /> Req: {item.requirements}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-[10px] text-slate-400">Total Price</p>
                        <p className="text-blue-700 font-black text-lg">Rs. {item.price.toLocaleString()}</p>
                      </div>

                      <div className="flex gap-2">
                        {/* Direct Chat */}
                        <button 
                          onClick={() => { setActiveChatSeller(item.seller); setActiveTab('chats'); }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 rounded-xl font-bold text-xs flex items-center gap-1"
                          title="Chat with Seller (Phone Number Hidden)"
                        >
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Escrow Purchase */}
                        <button 
                          onClick={() => { setSelectedItem(item); setIsEscrowOpen(true); }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-300" /> Escrow Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
            {/* TAB 2: DIRECT CHAT (MEDIA & MEDIA SUPPORT) */}
        {activeTab === 'chats' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-[75vh] flex flex-col">
            <div className="p-3.5 border-b bg-slate-50 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  Chat with: {activeChatSeller || 'Seller/Buyer'}
                </h3>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <EyeOff className="w-3 h-3 text-emerald-600" /> Phone Number Hidden for Safety
                </p>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === (currentUser?.email || 'Buyer User') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-2 ${msg.sender === (currentUser?.email || 'Buyer User') ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                    <p className="text-[9px] opacity-75 font-semibold">{msg.sender}</p>

                    {msg.media && (
                      msg.isVideo ? (
                        <video src={msg.media} controls className="rounded-lg w-full max-h-48 object-cover" />
                      ) : (
                        <img src={msg.media} alt="Attachment" className="rounded-lg w-full max-h-48 object-cover" />
                      )
                    )}

                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="p-2 border-t flex flex-col gap-2">
              {chatMedia && (
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl text-xs">
                  {chatMedia.isVideo ? <Video className="w-4 h-4 text-purple-600" /> : <ImageIcon className="w-4 h-4 text-emerald-600" />}
                  <span className="text-[10px] truncate">Media attachment ready</span>
                  <button type="button" onClick={() => setChatMedia(null)} className="ml-auto text-red-500 font-bold">X</button>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <label className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer">
                  <Paperclip className="w-4 h-4 text-slate-600" />
                  <input type="file" accept="image/*,video/*" onChange={handleChatMediaUpload} className="hidden" />
                </label>

                <input 
                  type="text" 
                  placeholder="Type message or attach image/video..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />

                <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-xl">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: AI ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-[75vh] flex flex-col">
            <div className="p-3.5 border-b bg-blue-50/50 rounded-t-2xl flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-xs text-slate-800">Dukan.ai AI Advisor</h3>
                <p className="text-[10px] text-slate-500">Ask marketplace questions or pricing</p>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {aiMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && <div className="text-xs text-slate-400 italic">AI thinking...</div>}
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
              <input 
                type="text" 
                placeholder="Ask AI..." 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <button type="submit" disabled={aiLoading} className="bg-blue-600 text-white p-2.5 rounded-xl">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: PROFILE & ESCROW HISTORY */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center space-y-3">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8" />
              </div>

              {currentUser ? (
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800">{currentUser.email}</h3>
                  <p className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full inline-block">
                    Total Posts Published: {userPostCount}
                  </p>
                  <button onClick={() => supabase.auth.signOut()} className="text-xs text-red-600 font-semibold flex items-center justify-center gap-1 mx-auto pt-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800">Welcome to Dukan.ai</h3>
                  <button onClick={() => setIsAuthOpen(true)} className="bg-blue-600 text-white text-xs px-6 py-2.5 rounded-xl font-bold">
                    Login / Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Escrow Orders & Platform Earnings */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Escrow Orders & 5% Fee Summary
              </h4>

              {escrowOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">Koi active order nahi hai.</p>
              ) : (
                <div className="space-y-2.5">
                  {escrowOrders.map((order) => (
                    <div key={order.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{order.itemTitle}</span>
                        <span className="text-blue-700">Rs. {order.price.toLocaleString()}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <p>5% Platform Fee: <strong className="text-red-500">Rs. {order.adminFee.toLocaleString()}</strong></p>
                        <p>Net Seller Payout: <strong className="text-emerald-600">Rs. {order.sellerPayout.toLocaleString()}</strong></p>
                        <p>Trx ID: <span className="font-mono">{order.trxId}</span></p>
                        <p>Status: <span className="font-bold text-blue-600">{order.status}</span></p>
                      </div>

                      {order.screenshot && (
                        <div>
                          <p className="text-[10px] text-slate-400">Payment Screenshot (SS):</p>
                          <img src={order.screenshot} alt="SS" className="w-20 h-20 object-cover rounded-lg border" />
                        </div>
                      )}

                      {order.status.includes('In Escrow') && (
                        <button 
                          onClick={() => handleReleasePayment(order.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Release Funds to Seller (5% Cut)
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
                        </main>

      {/* AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-2xl p-5 space-y-4 relative">
            <button onClick={() => setIsAuthOpen(false)} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="font-bold text-base text-slate-800">{isSignUp ? 'Create Account' : 'Welcome Back'}</h3>

            <div className="flex border-b text-xs font-bold">
              <button onClick={() => setAuthType('email')} className={`flex-1 py-2 ${authType === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400'}`}>Email</button>
              <button onClick={() => setAuthType('phone')} className={`flex-1 py-2 ${authType === 'phone' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400'}`}>Mobile Number</button>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3">
              {authType === 'email' ? (
                <input type="email" placeholder="Email Address" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl outline-none" />
              ) : (
                <input type="tel" placeholder="Mobile Number (03001234567)" required value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl outline-none" />
              )}
              <input type="password" placeholder="Password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl outline-none" />
              
              <button type="submit" className="w-full bg-blue-600 text-white text-xs py-2.5 rounded-xl font-bold">{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>

            <button onClick={() => setIsSignUp(!isSignUp)} className="text-[11px] text-blue-600 font-semibold w-full text-center block">
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      )}

      {/* 100 PKR POST FEE MODAL (AFTER 5 POSTS) */}
      {isPostFeeOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-2xl p-5 space-y-4 relative">
            <button onClick={() => setIsPostFeeOpen(false)} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5" /></button>

            <div className="text-center space-y-1">
              <DollarSign className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">5 Free Posts Limit Reached</h3>
              <p className="text-xs text-slate-500">Pay Rs. 100 listing fee for posting your 6th+ service or product.</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-700">Payment Account ({paymentMethod.toUpperCase()}):</p>
              <p className="text-slate-600 font-mono">Number: 0300-1234567</p>
              <p className="text-slate-600">Title: Dukan.ai Official</p>
              <p className="text-blue-600 font-bold pt-1">Amount: Rs. 100</p>
            </div>

            <form onSubmit={handlePostFeeSubmit} className="space-y-3">
              <input 
                type="text" 
                placeholder="Transaction ID (Trx ID)" 
                required 
                value={postFeeTrxId} 
                onChange={(e) => setPostFeeTrxId(e.target.value)} 
                className="w-full text-xs p-2.5 border rounded-xl" 
              />

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Upload Payment Screenshot (SS) *Required</label>
                <input type="file" accept="image/*" required onChange={(e) => handleImageUpload(e, setPostFeeScreenshot)} className="w-full text-xs" />
                {postFeeScreenshot && <img src={postFeeScreenshot} alt="SS" className="w-full h-20 object-cover rounded-xl mt-2 border" />}
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white text-xs py-2.5 rounded-xl font-bold">Verify Rs. 100 & Continue</button>
            </form>
          </div>
        </div>
      )}

      {/* POST SERVICE / PRODUCT FORM */}
      {isPostAdOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsPostAdOpen(false)} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="font-bold text-slate-800 text-base">Add Service or Product</h3>

            <form onSubmit={handleCreateAd} className="space-y-3">
              <div className="flex gap-2">
                <button type="button" onClick={() => setAdType('service')} className={`flex-1 py-2 text-xs rounded-xl border font-bold ${adType === 'service' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Service</button>
                <button type="button" onClick={() => setAdType('product')} className={`flex-1 py-2 text-xs rounded-xl border font-bold ${adType === 'product' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Product</button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Upload Picture / Cover</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setAdImage)} className="w-full text-xs" />
                {adImage && <img src={adImage} alt="Preview" className="w-full h-24 object-cover rounded-xl mt-2 border" />}
              </div>

              <input type="text" placeholder="Title (e.g. Web Development or AC Repair)" required value={adTitle} onChange={(e) => setAdTitle(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl" />
              <input type="number" placeholder="Price (PKR)" required value={adPrice} onChange={(e) => setAdPrice(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl" />

              <select value={adCity} onChange={(e) => setAdCity(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl">
                {citiesList.filter(c => c !== 'All Cities').map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <textarea placeholder="Detailed Description..." required value={adDescription} onChange={(e) => setAdDescription(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl h-20" />
              <input type="text" placeholder="Delivery Time (e.g. 2 Days)" required value={adDeliveryTime} onChange={(e) => setAdDeliveryTime(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl" />
              <textarea placeholder="Requirements from Client..." value={adRequirements} onChange={(e) => setAdRequirements(e.target.value)} className="w-full text-xs p-2.5 border rounded-xl h-16" />

              <button type="submit" className="w-full bg-blue-600 text-white text-xs py-2.5 rounded-xl font-bold">Publish Item</button>
            </form>
          </div>
        </div>
      )}

      {/* ESCROW PAYMENT MODAL (WITH MANDATORY SCREENSHOT) */}
      {isEscrowOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEscrowOpen(false)} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5" /></button>

            <div className="text-center space-y-1">
              <Lock className="w-10 h-10 text-blue-600 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Escrow Safe Payment</h3>
              <p className="text-xs text-slate-500">Payment Admin Escrow me hold rahegi jab tak kaam mukammal na ho.</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">{selectedItem.title}</p>
              <p className="text-blue-700 font-black text-sm">Total Price: Rs. {selectedItem.price.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500">5% Platform Cut on Release: Rs. {(selectedItem.price * 0.05).toLocaleString()}</p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setPaymentMethod('easypaisa')} className={`flex-1 py-2 text-xs rounded-xl border font-bold ${paymentMethod === 'easypaisa' ? 'bg-green-50 border-green-600 text-green-700' : 'text-slate-500'}`}>EasyPaisa</button>
              <button type="button" onClick={() => setPaymentMethod('jazzcash')} className={`flex-1 py-2 text-xs rounded-xl border font-bold ${paymentMethod === 'jazzcash' ? 'bg-red-50 border-red-600 text-red-700' : 'text-slate-500'}`}>JazzCash</button>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
              <p className="font-bold text-amber-900">Escrow Details ({paymentMethod.toUpperCase()}):</p>
              <p className="text-amber-800 font-mono">Number: 0300-1234567</p>
              <p className="text-amber-800">Title: Dukan.ai Escrow</p>
            </div>

            <form onSubmit={handleEscrowSubmit} className="space-y-3">
              <input 
                type="text" 
                placeholder="Transaction ID (Trx ID)" 
                required 
                value={trxId} 
                onChange={(e) => setTrxId(e.target.value)} 
                className="w-full text-xs p-2.5 border rounded-xl" 
              />

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4 text-blue-600" /> Payment Screenshot (SS) *Required
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required 
                  onChange={(e) => handleImageUpload(e, setPaymentScreenshot)} 
                  className="w-full text-xs" 
                />
                {paymentScreenshot && (
                  <img src={paymentScreenshot} alt="SS" className="w-full h-24 object-cover rounded-xl mt-2 border" />
                )}
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white text-xs py-2.5 rounded-xl font-bold">Submit Payment to Escrow</button>
            </form>
          </div>
        </div>
      )}

      {/* SUPPORT MODAL */}
      {isSupportOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-2xl p-5 space-y-3 text-center relative">
            <button onClick={() => setIsSupportOpen(false)} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5" /></button>
            <HelpCircle className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">Help & Support</h3>
            <p className="text-xs text-slate-500">Escrow disputes ya issues ke liye support team se rabta karein.</p>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="block bg-emerald-600 text-white text-xs py-2.5 rounded-xl font-bold">
              WhatsApp Support
            </a>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2.5 z-40 max-w-md mx-auto shadow-lg">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Home className="w-5 h-5" /> Home
        </button>
        <button onClick={() => setActiveTab('chats')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'chats' ? 'text-blue-600' : 'text-slate-400'}`}>
          <MessageCircle className="w-5 h-5" /> Direct Chat
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'ai' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Bot className="w-5 h-5" /> AI Bot
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}>
          <User className="w-5 h-5" /> Profile
        </button>
      </nav>
    </div>
  );
                }
        
