import React, { useState, useRef } from 'react';
import {
  Search,
  Plus,
  MapPin,
  Star,
  Zap,
  Check,
  Copy,
  X,
  Home,
  MessageSquare,
  Bot,
  User,
  ImageIcon,
  Video,
  Send,
  Trash2,
  PhoneCall,
  CheckCircle2,
  Building2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

// ==========================================
// GROQ AI INTEGRATION CONFIGURATION
// ==========================================
// Apni Groq API Key yahan enter karein:
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ListingItem {
  id: number;
  type: 'service' | 'product';
  title: string;
  category: string;
  price: string;
  city: string;
  exp: string;
  rating: number;
  images: string[];
  video: string | null;
  description: string;
  contactNumber: string;
  postedAt: string;
}

async function fetchGroqChatResponse(userMessage: string, previousHistory: Message[]) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
    return "Groq API Key missing hai! Kripya code ke top par `GROQ_API_KEY` set karein ya env variable add karein.";
  }

  try {
    const formattedHistory = previousHistory.slice(-6).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are Dukan.ai's AI assistant in Pakistan. Speak polite Roman Urdu / English. Help users with buying, selling, electrical/plumbing service rates, and ad creation guidance."
          },
          ...formattedHistory,
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Khamaat me takhir k liye mazirat, AI jawab tayyar nahi kar saka.";
  } catch (error) {
    console.error("Groq API Request Failed:", error);
    return "Server connection error! Kripya apna internet connection check karein.";
  }
}

// Preset Data
const CITIES_LIST = ['All Cities', 'Sargodha', 'Faisalabad', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Sialkot', 'Multan', 'Other City'];

const CATEGORIES = [
  { name: 'All Services', icon: '⚡' },
  { name: 'Electrician & Wiring', icon: '🔌' },
  { name: 'Plumbing & Fitting', icon: '🔧' },
  { name: 'Mobile & Laptop Repair', icon: '📱' },
  { name: 'Home Appliances Repair', icon: '📺' },
  { name: 'Fashion & Apparel', icon: '👗' },
  { name: 'Electronics & Mobiles', icon: '💻' },
  { name: 'Solar Installation', icon: '☀️' },
  { name: 'Graphics & Digital Marketing', icon: '🎨' }
];

const INITIAL_LISTINGS: ListingItem[] = [
  {
    id: 1,
    type: 'service',
    title: 'Professional House Wiring, DB Dressing & Electric Repair',
    category: 'Electrician & Wiring',
    price: 'Rs. 1,000 / Visit',
    city: 'Sargodha',
    exp: '6 Years Exp',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
    ],
    video: null,
    description: 'A-Z Home electrical services, short circuit resolution, UPS & Inverter installation, ceiling light fixing with 100% safety guarantee.',
    contactNumber: '03284725083',
    postedAt: '2 hours ago'
  },
  {
    id: 2,
    type: 'product',
    title: 'iPhone 13 Pro Max - 128GB Alpine Green (JTA Verified)',
    category: 'Electronics & Mobiles',
    price: 'Rs. 215,000',
    city: 'Lahore',
    exp: '100% Battery Health',
    rating: 5.0,
    images: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
    ],
    video: null,
    description: 'Pin-pack condition 10/10, non-active PTA / JTA patch option available, original fast charger included in box.',
    contactNumber: '03001234567',
    postedAt: 'Just now'
  },
  {
    id: 3,
    type: 'service',
    title: 'Solar Panel System Installation & Inverter Setup',
    category: 'Solar Installation',
    price: 'Rs. 15,000 / System',
    city: 'Faisalabad',
    exp: '8 Years Exp',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
    ],
    video: null,
    description: 'Complete net-metering solar structure installation, ON-grid & OFF-grid setup with heavy cabling.',
    contactNumber: '03119876543',
    postedAt: '1 day ago'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'ai' | 'profile'>('home');
  const [listingType, setListingType] = useState<'service' | 'product'>('service');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userUploadCount, setUserUploadCount] = useState(0);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [customCity, setCustomCity] = useState('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [txnId, setTxnId] = useState('');

  // Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Electrician & Wiring');
  const [newPrice, setNewPrice] = useState('');
  const [newExp, setNewExp] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Media Previews (Local Uploads)
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Listings List
  const [listings, setListings] = useState<ListingItem[]>(INITIAL_LISTINGS);

  // Chat / AI State
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Assalam-o-Alaikum! Main Dukan.ai ka Smart Assistant hoon. Aap kis cheez ki maloomat chahte hain?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // Direct Ad trigger logic
  const handleOpenAddModal = () => {
    if (userUploadCount >= 1) {
      setIsPaymentModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // Payment Verification Submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId.trim()) return;
    alert(`Aap ka Payment TRX ID "${txnId}" verification request submit ho gaya hai. Ad create karein!`);
    setIsPaymentModalOpen(false);
    setIsModalOpen(true);
  };

  // Handle Image File Selection from Gallery
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imagePreviews.length + files.length > 5) {
      setMediaError("Aap ziyada se ziyada 5 images upload kar sakte hain.");
      return;
    }

    const fileList = Array.from(files);
    const loadedImages: string[] = [];

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setMediaError("Baraye meherbani sirf Image files chunein.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          loadedImages.push(reader.result);
          if (loadedImages.length === fileList.length) {
            setImagePreviews((prev) => [...prev, ...loadedImages].slice(0, 5));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Video File Selection from Gallery
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setMediaError("Baraye meherbani sirf Video file chunein.");
      return;
    }

    // 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      setMediaError("Video file ka size 20MB se kam hona chahiye.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setVideoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideoPreview = () => {
    setVideoPreview(null);
  };

  // Add Listing Form Handler
  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCity = selectedCity === 'Other City' ? customCity || 'Pakistan' : (selectedCity === 'All Cities' ? 'Sargodha' : selectedCity);

    const defaultFallbackImage = listingType === 'service'
      ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

    const newItem: ListingItem = {
      id: Date.now(),
      type: listingType,
      title: newTitle,
      category: newCategory,
      price: newPrice.startsWith('Rs.') ? newPrice : `Rs. ${newPrice}`,
      city: finalCity,
      exp: newExp || (listingType === 'service' ? 'Experienced' : 'New'),
      rating: 5.0,
      images: imagePreviews.length > 0 ? imagePreviews : [defaultFallbackImage],
      video: videoPreview,
      description: newDesc,
      contactNumber: newContact || '03284725083',
      postedAt: 'Just now'
    };

    setListings([newItem, ...listings]);
    setUserUploadCount((prev) => prev + 1);

    // Form Reset
    setNewTitle('');
    setNewPrice('');
    setNewExp('');
    setNewContact('');
    setNewDesc('');
    setImagePreviews([]);
    setVideoPreview(null);
    setIsModalOpen(false);
  };

  // AI Message Send
  const handleSendAiMessage = async () => {
    if (!aiInput.trim() || isAiLoading) return;

    const userText = aiInput;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');
    setIsAiLoading(true);

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const botResponseText = await fetchGroqChatResponse(userText, aiMessages);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: botResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages((prev) => [...prev, botMsg]);
    setIsAiLoading(false);

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Filter Logic
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Services' || item.category === selectedCategory;
    const matchesCity = selectedCity === 'All Cities' || item.city.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* APP HEADER */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25">
              <span className="text-2xl font-black tracking-tight">D</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black tracking-tight text-slate-900">Dukan<span className="text-blue-600">.ai</span></h1>
                <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-700 uppercase">PK Hub</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500">Pakistani Verified Marketplace & Services</p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Ad</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-5xl px-4 pt-5">

        {/* TAB 1: MARKETPLACE */}
        {activeTab === 'home' && (
          <div className="space-y-5">
            
            {/* Search Bar & City Selector */}
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search solar, electrician, mobile, garments, laptops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3 py-1 shadow-sm">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent py-2 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  {CITIES_LIST.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${
                    selectedCategory === cat.name
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-102'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.length > 0 ? (
                filteredListings.map((item) => (
                  <div key={item.id} className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
                    <div>
                      {/* Media Display */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
                        {item.video ? (
                          <video src={item.video} controls className="h-full w-full object-cover" />
                        ) : (
                          <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                        )}
                        
                        <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur-md uppercase tracking-wider">
                          {item.type}
                        </span>

                        {item.images.length > 1 && (
                          <span className="absolute right-3 bottom-3 rounded-lg bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                            +{item.images.length - 1} Photos
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="mt-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.category}</span>
                          <div className="flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-600 text-xs font-black">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            <span>{item.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1 leading-snug">{item.title}</h3>
                        <p className="text-sm font-black text-emerald-600">{item.price}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {/* Footer / Call Button */}
                    <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-400 space-y-0.5">
                        <p className="flex items-center gap-1 text-slate-600"><MapPin className="h-3 w-3 text-blue-600" /> {item.city}</p>
                        <p>{item.exp} • {item.postedAt}</p>
                      </div>

                      <a
                        href={`tel:${item.contactNumber}`}
                        className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-800 transition hover:bg-emerald-600 hover:text-white"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-slate-400">
                  <AlertCircle className="mx-auto h-10 w-10 mb-2 text-slate-300" />
                  <p className="text-sm font-bold">Koi matching listings nahi milay.</p>
                  <p className="text-xs text-slate-400 mt-1">Search or city filter tabdeel karke dekhein.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm max-w-lg mx-auto my-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Direct Customer Messages</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">Buyers aur Service leads ke direct inbox chats yahan show hote hain.</p>
          </div>
        )}

        {/* TAB 3: GROQ AI ASSISTANT CHAT */}
        {activeTab === 'ai' && (
          <div className="flex h-[78vh] flex-col rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden max-w-3xl mx-auto">
            
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold flex items-center gap-1.5">
                    Dukan.ai AI Bot <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-400 border border-emerald-500/30">Online</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Powered by Groq LLM Engine</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {aiMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`mt-1 block text-[9px] text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-400 animate-pulse">
                    AI response tayyar kar raha hai...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <div className="border-t border-slate-200 p-3 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Marketplace ya rate card k bare me pūchein..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
              <button
                onClick={handleSendAiMessage}
                disabled={isAiLoading}
                className="rounded-xl bg-blue-600 p-2.5 text-white hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm max-w-xl mx-auto my-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xl font-black shadow-md">
                AA
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Adeel Abbas</h3>
                <p className="text-xs text-slate-500">dukanpak.shop Authorized Merchant</p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> Verified Partner
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Total Active Ads:</span>
                <span className="font-bold text-slate-900">{listings.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Free Ad Tier Used:</span>
                <span className="font-bold text-blue-600">{userUploadCount} / 1</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Posting Fee Verification</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Aap ka 1 Free Ad limit complete ho chuka hai. Naya Ad publish karne ke liye PKR 200 fee submit karein:
            </p>

            <div className="mt-4 space-y-2.5">
              {/* Meezan Bank */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">1. Meezan Bank</span>
                <div className="text-xs mt-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[10px]">IBAN:</span>
                    <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                      <span>PK08MEZN0002650900000101</span>
                      <button onClick={() => copyToClipboard('PK08MEZN0002650900000101', 'meezan')} className="text-blue-600 p-0.5">
                        {copiedAccount === 'meezan' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">Title: Adeel Abbas / Dukan.ai</p>
                </div>
              </div>

              {/* EasyPaisa / JazzCash */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">2. EasyPaisa / JazzCash</span>
                <div className="text-xs mt-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[10px]">Mobile:</span>
                    <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                      <span>03284725083</span>
                      <button onClick={() => copyToClipboard('03284725083', 'mobile')} className="text-emerald-700 p-0.5">
                        {copiedAccount === 'mobile' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">Title: Adeel Abbas</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase">Transaction ID (TRX ID)</label>
                <input
                  type="text"
                  required
                  placeholder="11-12 digits TRX ID"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-blue-700">
                Verify Payment & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Post New Listing</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddListing} className="mt-4 space-y-3 text-xs">
              
              {/* Type Switcher */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setListingType('service')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${listingType === 'service' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Service Offer
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('product')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${listingType === 'product' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Product Sale
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder={listingType === 'service' ? 'e.g., Expert Electrician & Circuit Repair' : 'e.g., iPhone 13 Pro Max 128GB'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c.name !== 'All Services').map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Price / Rate (PKR)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1500 or 25000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    {CITIES_LIST.filter((c) => c !== 'All Cities').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {selectedCity === 'Other City' ? (
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase">Custom City Name</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase">Experience / Condition</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Years or 10/10"
                      value={newExp}
                      onChange={(e) => setNewExp(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase">Contact WhatsApp / Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="03284725083"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* MEDIA ERROR BANNER */}
              {mediaError && (
                <div className="rounded-xl bg-red-50 p-2.5 text-[11px] font-semibold text-red-600">
                  {mediaError}
                </div>
              )}

              {/* GALLERY MULTIPLE IMAGES UPLOAD */}
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-3">
                <label className="text-[10px] font-bold text-slate-700 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5 text-blue-600" /> Select Photos from Gallery</span>
                  <span className="text-[9px] text-slate-400">Max 5 photos</span>
                </label>
                
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="mt-2 w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />

                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
                        <button
                          type="button"
                          onClick={() => removeImagePreview(i)}
                          className="absolute -top-1.5 -right-1.5 rounded-full bg-red-600 p-0.5 text-white shadow-md hover:bg-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* GALLERY SHORT VIDEO UPLOAD */}
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-3">
                <label className="text-[10px] font-bold text-slate-700 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5 text-emerald-600" /> Select Short Demo Video</span>
                  <span className="text-[9px] text-slate-400">Max 20MB</span>
                </label>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="mt-2 w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />

                {videoPreview && (
                  <div className="relative mt-3 inline-block">
                    <video src={videoPreview} className="h-20 w-36 rounded-xl object-cover border border-slate-200" controls />
                    <button
                      type="button"
                      onClick={removeVideoPreview}
                      className="absolute -top-1.5 -right-1.5 rounded-full bg-red-600 p-0.5 text-white shadow-md hover:bg-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase">Detailed Description</label>
                <textarea
                  rows={2}
                  placeholder="Service scope, specifications, or condition details..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-black text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-98 transition"
              >
                Publish Listing Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-2.5">
        <div className="mx-auto flex max-w-md justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'messages' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'ai' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Bot className="h-5 w-5" />
            <span className="text-[10px]">AI Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
