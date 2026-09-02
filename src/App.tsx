import { useState, FormEvent } from 'react';

interface Listing {
  id: number;
  title: string;
  category: string;
  price: number;
  city: string;
  town: string;
  description: string;
  mediaUrl: string;
  sellerName: string;
  phone: string;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [contactModal, setContactModal] = useState<Listing | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      title: 'Expert Home & Commercial Plumbing & Sanitary Fitting',
      category: 'Plumber & Sanitary Work',
      price: 1500,
      city: 'Sargodha',
      town: 'Satellite Town',
      description: 'Professional plumber available for bathroom fittings, pipe leakages & sanitary work.',
      mediaUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80',
      sellerName: 'Ustad Ali Plumber',
      phone: '923001234567'
    },
    {
      id: 2,
      title: 'Senior Medical Specialist Doctor Online / Clinic Consultation',
      category: 'Doctor & Healthcare Consultation',
      price: 2000,
      city: 'Sialkot',
      town: 'Khawaja Safdar Road',
      description: 'MBBS certified doctor for general medical checkups, digital reports, and prescriptions.',
      mediaUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      sellerName: 'Dr. Shahbaz',
      phone: '923009876543'
    },
    {
      id: 3,
      title: 'Single Niche High-Converting Shopify Store Setup',
      category: 'Shopify & E-commerce',
      price: 15000,
      city: 'Sargodha',
      town: 'University Road',
      description: 'Complete Shopify store creation, winning products research, custom themes, and Meta Pixel configuration.',
      mediaUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf40955?auto=format&fit=crop&w=600&q=80',
      sellerName: 'Adeel Abbas',
      phone: '923001112233'
    }
  ]);

  const [newForm, setNewForm] = useState({
    title: '',
    category: 'Plumber & Sanitary Work',
    price: '',
    city: 'Sargodha',
    town: '',
    description: '',
    sellerName: '',
    phone: '',
    mediaUrl: ''
  });

  const handleAddListing = (e: FormEvent) => {
    e.preventDefault();
    const item: Listing = {
      id: Date.now(),
      title: newForm.title,
      category: newForm.category,
      price: Number(newForm.price),
      city: newForm.city,
      town: newForm.town,
      description: newForm.description,
      sellerName: newForm.sellerName,
      phone: newForm.phone,
      mediaUrl: newForm.mediaUrl || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80'
    };
    setListings([item, ...listings]);
    setShowAddModal(false);
    setNewForm({
      title: '',
      category: 'Plumber & Sanitary Work',
      price: '',
      city: 'Sargodha',
      town: '',
      description: '',
      sellerName: '',
      phone: '',
      mediaUrl: ''
    });
  };

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    const matchesCity = selectedCity === 'All' || item.city === selectedCity;
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCity && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-12 font-sans">
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 font-extrabold text-xl px-3 py-1 rounded-xl">D</div>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                Dukan.ai
                <span className="text-xs font-normal bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  dukanpak.shop
                </span>
              </h1>
              <p className="text-xs text-slate-400">Pakistan&apos;s Universal Service Marketplace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + Add Service
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 mt-2">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search services, doctors, plumbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Cities</option>
            <option value="Sargodha">Sargodha</option>
            <option value="Sialkot">Sialkot</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Plumber & Sanitary Work">Plumber & Sanitary Work</option>
            <option value="Doctor & Healthcare Consultation">Doctor Consultation</option>
            <option value="Shopify & E-commerce">Shopify & E-commerce</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span className="font-semibold text-blue-600">Location: {item.city}, {item.town}</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-md">{item.sellerName}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-600">{item.description}</p>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <span className="text-xs text-slate-400 block">Starting from</span>
                    <span className="font-bold text-base text-slate-900">PKR {item.price}</span>
                  </div>
                  <button
                    onClick={() => setContactModal(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">No services found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      {contactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">{contactModal.title}</h3>
            <p className="text-xs text-slate-500">Provided by: <strong className="text-slate-800">{contactModal.sellerName}</strong></p>
            <div className="bg-slate-50 p-3 rounded-xl border text-sm space-y-1">
              <p><strong>Location:</strong> {contactModal.town}, {contactModal.city}</p>
              <p><strong>Price:</strong> PKR {contactModal.price}</p>
              <p><strong>Contact:</strong> +{contactModal.phone}</p>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setContactModal(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-100"
              >
                Close
              </button>
              <a
                href={'https://wa.me/' + contactModal.phone}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold text-center"
              >
                Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Post New Service Listing</h3>
            <form onSubmit={handleAddListing} className="space-y-3">
              <input
                type="text"
                placeholder="Service Title"
                required
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                className="w-full text-xs p-3 border rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newForm.category}
                  onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                >
                  <option value="Plumber & Sanitary Work">Plumber & Sanitary Work</option>
                  <option value="Doctor & Healthcare Consultation">Doctor Consultation</option>
                  <option value="Shopify & E-commerce">Shopify & E-commerce</option>
                </select>
                <input
                  type="number"
                  placeholder="Price (PKR)"
                  required
                  value={newForm.price}
                  onChange={(e) => setNewForm({ ...newForm, price: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newForm.city}
                  onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                >
                  <option value="Sargodha">Sargodha</option>
                  <option value="Sialkot">Sialkot</option>
                </select>
                <input
                  type="text"
                  placeholder="Town / Area (e.g. Satellite Town)"
                  required
                  value={newForm.town}
                  onChange={(e) => setNewForm({ ...newForm, town: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name / Business Name"
                  required
                  value={newForm.sellerName}
                  onChange={(e) => setNewForm({ ...newForm, sellerName: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="WhatsApp Number (e.g. 923001234567)"
                  required
                  value={newForm.phone}
                  onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                />
              </div>
              <input
                type="text"
                placeholder="Image URL (Optional)"
                value={newForm.mediaUrl}
                onChange={(e) => setNewForm({ ...newForm, mediaUrl: e.target.value })}
                className="w-full text-xs p-3 border rounded-xl"
              />
              <textarea
                placeholder="Service Description..."
                rows={3}
                required
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                className="w-full text-xs p-3 border rounded-xl"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-bold text-slate-900">
                {authMode === 'login' ? 'Sign In to Dukan.ai' : 'Create Account'}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 text-sm">✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Success!'); setShowAuthModal(false); }} className="space-y-3">
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full text-xs p-3 border rounded-xl"
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full text-xs p-3 border rounded-xl"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                {authMode === 'login' ? 'Sign In' : 'Register Account'}
              </button>
            </form>
            <div className="text-center pt-2 border-t">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                {authMode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}