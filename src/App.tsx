import React, { useState } from 'react';
import { 
  Search, MapPin, Star, Phone, ShieldCheck, Wrench, Zap, 
  Stethoscope, Scissors, Car, PlusCircle, Home, MessageSquare, 
  Bot, ShieldAlert, X, Send, Grid, Briefcase, Building2,
  User, Package, CheckCircle, TrendingUp, CreditCard, Sparkles, Flame, Copy, Check, Lock, HelpCircle
} from 'lucide-react';

interface ListingItem {
  id: number;
  title: string;
  type: 'service' | 'product';
  category: string;
  provider: string;
  city: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  verified: boolean;
  experience?: string;
  description?: string;
  isUserListing?: boolean;
  isSold?: boolean;
  createdAt: number;
}

const initialServices: ListingItem[] = [
  {
    id: 1,
    title: 'Ustad Ali Plumber & Pipe Specialist',
    type: 'service',
    category: 'Plumbing',
    provider: 'Ali Hassan',
    city: 'Sargodha',
    rating: 4.9,
    reviews: 28,
    price: 'Rs. 800 / visit',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    verified: true,
    experience: '5 Years',
    description: 'All types of sanitary and water pipeline leakage fixing.',
    isUserListing: false,
    isSold: false,
    createdAt: Date.now() - 100000,
  },
  {
    id: 2,
    title: 'Full Stack React & Web Developer',
    type: 'service',
    category: 'Digital / IT',
    provider: 'Adeel Developer',
    city: 'Online / Remote',
    rating: 5.0,
    reviews: 54,
    price: '$15 / hr',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
    verified: true,
    experience: '3 Years',
    description: 'Building custom React, Next.js apps, Shopify stores & APIs.',
    isUserListing: false,
    isSold: false,
    createdAt: Date.now() - 200000,
  },
  {
    id: 3,
    title: 'Brand New Inverter AC 1.5 Ton',
    type: 'product',
    category: 'Electronics',
    provider: 'Electro Shop',
    city: 'Lahore',
    rating: 4.8,
    reviews: 12,
    price: 'Rs. 145,000',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    verified: true,
    description: 'Energy saving inverter AC with 10 years compressor warranty.',
    isUserListing: false,
    isSold: true,
    createdAt: Date.now() - 300000,
  }
];

const categories = [
  { name: 'Plumbing', icon: Wrench },
  { name: 'Electrician', icon: Zap },
  { name: 'Digital / IT', icon: Briefcase },
  { name: 'Medical', icon: Stethoscope },
  { name: 'Salon / Beauty', icon: Scissors },
  { name: 'Auto Mechanic', icon: Car },
  { name: 'Other Services', icon: Grid },
];

const citiesList = [
  'Sargodha', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 
  'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Other City'
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'messages' | 'ai' | 'escrow'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'service' | 'product'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hasAddedFirstListing, setHasAddedFirstListing] = useState(false);
  const [listings, setListings] = useState<ListingItem[]>(initialServices);
  const [userUploadCount, setUserUploadCount] = useState(0);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Form State
  const [listingType, setListingType] = useState<'service' | 'product'>('service');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Plumbing');
  const [newPrice, setNewPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState('Sargodha');
  const [customCity, setCustomCity] = useState('');
  const [newExp, setNewExp] = useState('');
  const [newImg, setNewImg] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [txnId, setTxnId] = useState('');

  // AI Chat State
  const [aiChat, setAiChat] = useState([
    { sender: 'bot', text: 'Assalam-o-Alaikum! Main Dukan AI hoon. Main aap ki service prices, marketplace rules ya hiring me kya madad kar sakta hoon?' }
  ]);
  const [aiInput, setAiInput] = useState('');

  // User Messages State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'provider', text: 'Assalam-o-Alaikum! Direct WhatsApp Support par click kar ke bhi aap contact kar sakte hain.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const supportWhatsAppUrl = "https://wa.me/923284725083?text=Hello%20Dukan.ai%20Support!%20I%20need%20help.";

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiChat(prev => [...prev, { sender: 'user', text: userText }]);
    setAiInput('');

    setTimeout(() => {
      let botReply = "Aap ki request samajh aa gayi hai. Dukan.ai par Escrow System ke zariye aap safely payment receive aur send kar sakte hain!";
      if (userText.toLowerCase().includes('plumber') || userText.toLowerCase().includes('rate')) {
        botReply = "Pakistan me Plumber visit charges normally Rs. 800 se Rs. 1500 tak hote hain. Escrow use karein taake payment safe rahe.";
      } else if (userText.toLowerCase().includes('hi') || userText.toLowerCase().includes('hello')) {
        botReply = "Hello! Kaise madad kar sakta hoon aap ki Dukan.ai marketplace par?";
      }
      setAiChat(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: inputMsg }]);
    setInputMsg('');
  };

  const handleOpenAddModal = () => {
    if (userUploadCount >= 5) {
      setIsPaymentModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const processListingCreation = () => {
    const finalCity = selectedCity === 'Other City' ? (customCity || 'Custom Location') : selectedCity;

    const newListingObj: ListingItem = {
      id: Date.now(),
      title: newTitle,
      type: listingType,
      category: newCategory,
      provider: 'My Profile (You)',
      city: finalCity,
      rating: 5.0,
      reviews: 0,
      price: newPrice,
      image: newImg || (listingType === 'service' 
        ? 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'),
      verified: true,
      experience: listingType === 'service' ? (newExp || '1+ Year') : undefined,
      description: newDesc || 'Quality product/service guaranteed.',
      isUserListing: true,
      isSold: false,
      createdAt: Date.now()
    };

    if (!hasAddedFirstListing) {
      setListings([newListingObj]);
      setHasAddedFirstListing(true);
    } else {
      setListings([newListingObj, ...listings]);
    }

    setUserUploadCount(prev => prev + 1);
    setIsModalOpen(false);
    setIsPaymentModalOpen(false);
    setNewTitle('');
    setNewPrice('');
    setCustomCity('');
    setNewExp('');
    setNewImg('');
    setNewDesc('');
    setTxnId('');
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    processListingCreation();
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId) return;
    alert("Payment Transaction Received! Verification in progress.");
    setIsPaymentModalOpen(false);
    setIsModalOpen(true);
  };

  const sortedAndFilteredListings = [...listings]
    .sort((a, b) => {
      if (a.isSold === b.isSold) {
        return b.createdAt - a.createdAt;
      }
      return a.isSold ? 1 : -1;
    })
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });

  const myListings = listings.filter(item => item.isUserListing);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white shadow-md shadow-blue-500/20">
              D
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Dukan<span className="text-blue-600">.ai</span>
              </span>
              <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={supportWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp Support</span>
            </a>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Item ({5 - userUploadCount > 0 ? `${5 - userUploadCount} Free` : 'Rs. 100'})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      {activeTab === 'profile' ? (
        <section className="mx-auto max-w-3xl px-4 py-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-md">
                U
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  My Profile Dashboard <CheckCircle className="h-4 w-4 text-emerald-600" />
                </h2>
                <p className="text-xs text-slate-500">Verified Merchant</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="h-3.5 w-3.5 fill-amber-400" /> 5.0 Rating</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-blue-600 font-semibold">{myListings.length} Active Items</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 text-center">
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-semibold text-slate-500">Free Uploads</p>
                <p className="text-base font-black text-emerald-600 mt-0.5">{Math.max(0, 5 - userUploadCount)} / 5</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-semibold text-slate-500">Orders / Chats</p>
                <p className="text-base font-black text-blue-600 mt-0.5">14</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-semibold text-slate-500">Ranking Priority</p>
                <p className="text-base font-black text-amber-600 mt-0.5">HIGH</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" /> My Published Items
            </h3>

            {myListings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 text-xs">
                Aap ne abhi tak koi Item add nahi kiya. Plus (+) button par click kar ke add karein!
              </div>
            ) : (
              <div className="space-y-3">
                {myListings.map(item => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <img src={item.image} alt={item.title} className="h-14 w-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.type === 'service' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {item.type.toUpperCase()}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{item.title}</h4>
                      <p className="text-[10px] text-slate-500">{item.city} • {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : activeTab === 'ai' ? (
        <section className="mx-auto max-w-3xl px-4 py-6">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[520px]">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">Dukan AI Assistant</h3>
                <span className="text-[10px] font-semibold text-emerald-600">Online & Ready to Help</span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {aiChat.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input 
                type="text"
                placeholder="Ask AI anything..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded-xl text-white font-semibold text-xs flex items-center gap-1">
                <Send className="h-3.5 w-3.5" /> Send
              </button>
            </form>
          </div>
        </section>
      ) : activeTab === 'messages' ? (
        <section className="mx-auto max-w-3xl px-4 py-6">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Live Customer Chat</h3>
                <span className="text-[10px] font-semibold text-emerald-600">Active Support</span>
              </div>
              <a 
                href={supportWhatsAppUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Phone className="h-3 w-3" /> Direct WhatsApp
              </a>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input 
                type="text"
                placeholder="Type message..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded-xl text-white font-semibold text-xs">
                Send
              </button>
            </form>
          </div>
        </section>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-slate-100 to-slate-100 py-8 text-center">
            <div className="mx-auto max-w-4xl px-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700 border border-blue-200 mb-3">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Verified Escrow Platform
              </span>
              <h1 className="text-2xl font-black text-slate-900 sm:text-4xl leading-tight">
                Pakistan's Premium Local Marketplace
              </h1>

              {/* Filter Switcher */}
              <div className="mt-4 flex justify-center gap-2">
                <button 
                  onClick={() => setFilterType('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${filterType === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  All Items
                </button>
                <button 
                  onClick={() => setFilterType('service')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${filterType === 'service' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  <Wrench className="h-3 w-3" /> Services
                </button>
                <button 
                  onClick={() => setFilterType('product')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${filterType === 'product' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  <Package className="h-3 w-3" /> Products
                </button>
              </div>

              {/* Search Bar */}
              <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-md sm:flex">
                <div className="flex flex-1 items-center px-3 py-1.5">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by city, service or product name..."
                    className="w-full bg-transparent px-3 text-xs text-slate-900 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="mx-auto max-w-7xl px-4 py-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Browse Categories</h2>
              <button onClick={() => setSelectedCategory('All')} className="text-[11px] font-semibold text-blue-600 hover:underline">
                Reset Filter
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-2 rounded-2xl border p-2.5 text-left transition ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`rounded-xl p-1.5 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px]">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Cards Grid */}
          <section className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Featured Listings</h2>
              <span className="text-[11px] font-semibold text-slate-500">{sortedAndFilteredListings.length} Active</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedAndFilteredListings.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-blue-300 relative"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${
                      item.type === 'service' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.type.toUpperCase()}
                    </span>

                    {!item.isSold ? (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-black text-white flex items-center gap-1 shadow-sm">
                        <Flame className="h-3 w-3 fill-white" /> UNSOLD PRIORITY
                      </span>
                    ) : (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                        SOLD OUT
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span className="text-xs font-bold">{item.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">{item.provider}</span>
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                      {item.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{item.city}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">Rate / Price</p>
                        <p className="text-xs font-black text-blue-600">{item.price}</p>
                      </div>

                      <a 
                        href={supportWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        <Phone className="h-3 w-3" /> Contact
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ALL BANKS & WALLETS PAYMENT DRAWER / MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Merchant Payment Gateway</h3>
                  <p className="text-[11px] text-slate-500">Fast Bank Transfer & Mobile Wallet Checkout</p>
                </div>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Price Summary */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-3 border border-slate-200 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">Listing Fee (1 Item):</span>
              <span className="text-base font-black text-slate-900">RS. 100</span>
            </div>

            {/* Bank Accounts Section */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-bold text-slate-900">Choose Any Payment Option:</p>

              {/* 1. MCB Bank Card */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold text-orange-800 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> MCB Bank Limited
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">Account No:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900">167908906100</span>
                      <button onClick={() => copyToClipboard('167908906100', 'mcb_acc')} className="text-orange-700 p-0.5">
                        {copiedAccount === 'mcb_acc' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">IBAN:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900 text-[10px]">PK82MUCB1679089061004089</span>
                      <button onClick={() => copyToClipboard('PK82MUCB1679089061004089', 'mcb_iban')} className="text-orange-700 p-0.5">
                        {copiedAccount === 'mcb_iban' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">Title: Adeel Abbas / Dukan.ai</p>
                </div>
              </div>

              {/* 2. Askari Bank Card */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Askari Bank
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">Account No:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900">000265090000</span>
                      <button onClick={() => copyToClipboard('000265090000', 'askari_acc')} className="text-blue-700 p-0.5">
                        {copiedAccount === 'askari_acc' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">IBAN:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900 text-[10px]">PK60ASCM0002650900004565</span>
                      <button onClick={() => copyToClipboard('PK60ASCM0002650900004565', 'askari_iban')} className="text-blue-700 p-0.5">
                        {copiedAccount === 'askari_iban' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">Title: Adeel Abbas / Dukan.ai</p>
                </div>
              </div>

              {/* 3. JazzCash Card */}
              <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/50 p-3">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">JazzCash Account</span>
                  <p className="text-sm font-black text-slate-900 font-mono">0328-4725083</p>
                  <p className="text-[10px] text-slate-500">Title: Adeel Abbas / Dukan.ai</p>
                </div>
                <button 
                  onClick={() => copyToClipboard('03284725083', 'jazzcash')}
                  className="flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-amber-800 border border-amber-200 shadow-sm hover:bg-amber-100"
                >
                  {copiedAccount === 'jazzcash' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedAccount === 'jazzcash' ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* 4. EasyPaisa Card */}
              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">EasyPaisa Account</span>
                  <p className="text-sm font-black text-slate-900 font-mono">0312-3632821</p>
                  <p className="text-[10px] text-slate-500">Title: Adeel Abbas / Dukan.ai</p>
                </div>
                <button 
                  onClick={() => copyToClipboard('03123632821', 'easypaisa')}
                  className="flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 shadow-sm hover:bg-emerald-100"
                >
                  {copiedAccount === 'easypaisa' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedAccount === 'easypaisa' ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* 5. SadaPay Card (Corrected) */}
              <div className="flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50/50 p-3">
                <div>
                  <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider block">SadaPay Account</span>
                  <p className="text-sm font-black text-slate-900 font-mono">0328-4725083</p>
                  <p className="text-[10px] text-slate-500">Title: Adeel Abbas / Dukan.ai</p>
                </div>
                <button 
                  onClick={() => copyToClipboard('03284725083', 'sadapay')}
                  className="flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-teal-800 border border-teal-200 shadow-sm hover:bg-teal-100"
                >
                  {copiedAccount === 'sadapay' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedAccount === 'sadapay' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-3 border-t border-slate-100 pt-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Enter Transaction ID (Trx ID / Ref ID):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 849382019 or Bank Reference No"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" /> Verify Transaction & Proceed
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Listing</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddListing} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setListingType('service')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold ${
                      listingType === 'service' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Wrench className="h-4 w-4" /> Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingType('product')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold ${
                      listingType === 'product' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Package className="h-4 w-4" /> Product
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">{listingType === 'service' ? 'Service Name' : 'Product Title'}</label>
                <input
                  type="text"
                  required
                  placeholder={listingType === 'service' ? "e.g., Plumber or Electrician" : "e.g., Inverter AC or Mobile Phone"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Select City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {citiesList.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {selectedCity === 'Other City' && (
                <div>
                  <label className="font-bold text-blue-600">Write Your City Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your city name..."
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-blue-500 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Price / Rate</label>
                  <input
                    type="text"
                    required
                    placeholder="Rs. 1000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                {listingType === 'service' && (
                  <div>
                    <label className="font-bold text-slate-700">Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 Years"
                      value={newExp}
                      onChange={(e) => setNewExp(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700">Image Link / URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newImg}
                  onChange={(e) => setNewImg(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-2.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Publish Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-2 backdrop-blur-md shadow-lg">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition ${
              activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition ${
              activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px]">Profile</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="-mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition hover:scale-105 active:scale-95"
          >
            <PlusCircle className="h-6 w-6" />
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition ${
              activeTab === 'messages' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition ${
              activeTab === 'ai' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="h-5 w-5" />
            <span className="text-[10px]">AI Bot</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
