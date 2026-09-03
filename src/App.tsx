import React, { useState } from 'react';
import { Search, MapPin, Star, Phone, ShieldCheck, Wrench, Zap, Stethoscope, Scissors, Car, UserCheck, PlusCircle } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  category: string;
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
    title: 'Professional Home Electrician & Wiring',
    category: 'Electrician',
    provider: 'Shahid Mehmood',
    location: 'University Road, Sargodha',
    rating: 4.8,
    reviews: 42,
    price: 'Rs. 1,000 / visit',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    verified: true,
  },
  {
    id: 3,
    title: 'AC Maintenance & Gas Refilling',
    category: 'AC Repair',
    provider: 'Sargodha Cool Services',
    location: 'Club Road, Sargodha',
    rating: 4.7,
    reviews: 19,
    price: 'Rs. 1,500 / service',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600',
    verified: false,
  },
];

const categories = [
  { name: 'Plumbing', icon: Wrench },
  { name: 'Electrician', icon: Zap },
  { name: 'Medical', icon: Stethoscope },
  { name: 'Salon / Beauty', icon: Scissors },
  { name: 'Auto Mechanic', icon: Car },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-md shadow-blue-500/20">
              D
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Dukan<span className="text-blue-600">.ai</span>
              </span>
              <span className="ml-2 hidden rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 sm:inline-block">
                Pakistan Marketplace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Your Service</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Find Skilled Workers & Services <br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              In Your Local Area
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Connect with verified plumbers, electricians, doctors, and local businesses in Pakistan instantly.
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-2 shadow-2xl sm:flex sm:items-center">
            <div className="flex flex-1 items-center px-3 py-2 text-slate-700">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services, plumber, electrician..."
                className="w-full bg-transparent px-3 text-sm focus:outline-none sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="mt-2 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 sm:mt-0 sm:w-auto">
              Search Now
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Categories Bar */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">Explore Categories</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    selectedCategory === cat.name
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Featured Local Professionals</h2>
            <span className="text-sm text-slate-500">{filteredServices.length} Results found</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                    {service.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span className="text-sm font-bold">{service.rating}</span>
                      <span className="text-xs text-slate-400">({service.reviews})</span>
                    </div>
                    {service.verified && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                    {service.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{service.location}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">Starting Price</p>
                      <p className="text-base font-bold text-blue-600">{service.price}</p>
                    </div>

                    <button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-blue-600">
                      <Phone className="h-3.5 w-3.5" /> Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 Dukan.ai - Universal Service Marketplace Pakistan. All rights reserved.</p>
      </footer>
    </div>
  );
}
