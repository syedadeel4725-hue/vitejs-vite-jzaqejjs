import React, { useState } from 'react';
import { 
  Search, MapPin, Star, Phone, ShieldCheck, Wrench, Zap, 
  Stethoscope, Scissors, Car, PlusCircle, Home, MessageSquare, 
  Bot, Briefcase, X, Send, Sparkles
} from 'lucide-react';

interface Service {
  id: number;
  title: string;
  category: string;
  type: 'local' | 'freelance';
  provider: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  verified: boolean;
}

const mockServices: Service[] = [
  {
    id: 1,
    title: 'Ustad Ali Plumber & Pipe Specialist',
    category: 'Plumbing',
    type: 'local',
    provider: 'Ali Hassan',
    location: 'Satellite Town, Sargodha',
    rating: 4.9,
    reviews: 28,
    price: 'Rs. 800 / visit',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    verified: true,
  },
  {
    id: 2,
    title: 'Full Stack React & Web Developer',
    category: 'Freelancing',
    type: 'freelance',
    provider: 'Adeel Developer',
    location: 'Remote / Online',
    rating: 5.0,
    reviews: 54,
    price: '$15 / hr',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
    verified: true,
  },
  {
    id: 3,
    title: 'Professional Home Electrician & Wiring',
    category: 'Electrician',
    type: 'local',
    provider: 'Shahid Mehmood',
    location: 'University Road, Sargodha',
    rating: 4.8,
    reviews: 42,
    price: 'Rs. 1,000 / visit',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    verified: true,
  },
];

const categories = [
  { name: 'Plumbing', icon: Wrench },
  { name: 'Electrician', icon: Zap },
  { name: 'Freelancing', icon: Briefcase },
  { name: 'Medical', icon: Stethoscope },
  { name: 'Salon / Beauty', icon: Scissors },
  { name: 'Auto Mechanic', icon: Car },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'freelance' | 'messages' | 'ai'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>(mockServices);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Plumbing');
  const [newPrice, setNewPrice] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newServiceObj: Service = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      type: newCategory === 'Freelancing' ? 'freelance' : 'local',
      provider: 'Current User',
      location: newLocation || 'Sargodha, Pakistan',
      rating: 5.0,
      reviews: 1,
      price: newPrice,
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600',
      verified: true,
    };

    setServices([newServiceObj, ...services]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewPrice('');
    setNewLocation('');
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesTab = activeTab === 'freelance' ? service.type === 'freelance' : true;
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow-lg shadow-blue-500/30">
              D
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                Dukan<span className="text-blue-500">.ai</span>
              </span>
              <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                Universal Marketplace
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Service / Product</span>
          </button>
        </div>
      </header>

      {/* Main Content Area based on Active Tab */}
      {activeTab === 'ai' ? (
        <section className="mx-auto max-w-3xl px-4 py-12 text-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-8 backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Dukan AI Assistant</h2>
            <p className="mt-2 text-sm text-slate-400">Ask anything! AI can help you find local plumbers, generate proposals for freelancing, or estimate repair costs.</p>
            
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-2">
              <input 
                type="text" 
                placeholder="How much does pipe leakage repair cost in Sargodha?" 
                className="w-full bg-transparent px-4 text-sm text-white focus:outline-none"
              />
              <button className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-500">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      ) : activeTab === 'messages' ? (
        <section className="mx-auto max-w-3xl px-4 py-12 text-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-8">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-500 mb-2" />
            <h2 className="text-xl font-bold">Your Messages</h2>
            <p className="mt-1 text-xs text-slate-400">No active conversations right now. Click "Contact" on any service to start chatting.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 py-12 text-center">
            <div className="mx-auto max-w-4xl px-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20 mb-4">
                <Sparkles className="h-3.5 w-3.5" /> Next-Gen Services & Freelance Platform
              </span>
              <h1 className="text-3xl font-black text-white sm:text-5xl">
                Find Local Experts & <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                  Freelance Talent Near You
                </span>
              </h1>

              {/* Search Bar */}
              <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-slate-700 bg-slate-800/80 p-2 shadow-2xl backdrop-blur sm:flex">
                <div className="flex flex-1 items-center px-3 py-2">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search plumbers, electricians, developers..."
                    className="w-full bg-transparent px-3 text-sm text-white focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="w-full rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 sm:w-auto">
                  Search
                </button>
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Categories</h2>
              <button onClick={() => setSelectedCategory('All')} className="text-xs text-blue-400 hover:underline">Reset Filter</button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-lg shadow-blue-500/10' 
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`rounded-xl p-2 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Service Cards Grid */}
          <section className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Featured Marketplace Listings</h2>
              <span className="text-xs text-slate-400">{filteredServices.length} Items</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-800/50 shadow-xl transition hover:border-blue-500/50 hover:bg-slate-800"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1 text-[10px] font-bold text-blue-400 border border-slate-700">
                      {service.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-4 w-4 fill-amber-400" />
                        <span className="text-xs font-bold">{service.rating}</span>
                        <span className="text-[10px] text-slate-500">({service.reviews})</span>
                      </div>
                      {service.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-base font-bold text-white line-clamp-1 group-hover:text-blue-400 transition">
                      {service.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{service.location}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Rate</p>
                        <p className="text-sm font-extrabold text-blue-400">{service.price}</p>
                      </div>

                      <button className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-blue-500">
                        <Phone className="h-3.5 w-3.5" /> Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Add Service Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Add New Service / Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-xl p-1 text-slate-400 hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Expert Electrician or Web Design"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Price / Rate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rs. 1000 / Visit or $20 / hr"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Location</label>
                <input
                  type="text"
                  placeholder="Sargodha, Pakistan"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom App Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-900/95 p-2 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition ${
              activeTab === 'home' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('freelance')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition ${
              activeTab === 'freelance' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-[10px] font-bold">Freelance</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 transition hover:scale-105 active:scale-95"
          >
            <PlusCircle className="h-6 w-6" />
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition ${
              activeTab === 'messages' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[10px] font-bold">Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition ${
              activeTab === 'ai' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="h-5 w-5" />
            <span className="text-[10px] font-bold">AI Assistant</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
