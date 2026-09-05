import React, { useState } from 'react';
import './App.css';

interface ItemType {
  id: number;
  title: string;
  category: string;
  location?: string;
  rating?: string;
  experience?: string;
  price: string;
  image: string;
  description: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  const [otpStep, setOtpStep] = useState<boolean>(false);

  // Full Expanded Services Dataset
  const servicesData: ItemType[] = [
    { id: 1, title: 'Dr. Ahmad Khan (MBBS, FCPS)', category: 'Doctor', location: 'Lahore', rating: '4.9', experience: '8 Years Exp', price: 'PKR 2,000', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400', description: 'Certified Senior Medical Consultant. Online video consultations and hospital visits available.' },
    { id: 2, title: 'Advocate Ali Raza (High Court)', category: 'Lawyer', location: 'Karachi', rating: '4.8', experience: '12 Years Exp', price: 'PKR 5,000', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', description: 'Expert legal counsel specializing in corporate setup, tax filing, civil, and property matters.' },
    { id: 3, title: 'Smart Home Electrician', category: 'Technician', location: 'Islamabad', rating: '4.7', experience: '5 Years Exp', price: 'PKR 1,500', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400', description: 'Professional electrician for residential electrical repairs, breaker installation, and smart home automation.' },
    { id: 4, title: 'Full Stack Web Developer', category: 'Freelancer', location: 'Remote', rating: '5.0', experience: '6 Years Exp', price: 'PKR 15,000', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', description: 'Custom e-commerce store creation, React/Node development, bug fixing, and web application deployment.' },
    { id: 5, title: 'Dr. Sarah Smith (Pediatrician)', category: 'Doctor', location: 'Rawalpindi', rating: '4.9', experience: '10 Years Exp', price: 'PKR 2,500', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', description: 'Specialized child healthcare expert for urgent consultations and routine checkups.' },
    { id: 6, title: 'Legal Documentation Specialist', category: 'Lawyer', location: 'Multan', rating: '4.6', experience: '7 Years Exp', price: 'PKR 3,000', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400', description: 'Quick drafting for business contracts, rental agreements, and legal notices.' }
  ];

  // Full Expanded Products Dataset
  const productsData: ItemType[] = [
    { id: 101, title: 'Medical First Aid Emergency Kit', category: 'Equipment', price: 'PKR 3,500', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400', description: 'Complete emergency medical kit with certified surgical bandages, antiseptics, and burn relief tools.' },
    { id: 102, title: 'Legal Document Contract Bundle', category: 'Digital', price: 'PKR 1,200', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400', description: 'Ready-to-use editable legal contract templates for freelancers, landlords, and startups.' },
    { id: 103, title: 'Professional Heavy-Duty Tool Set', category: 'Hardware', price: 'PKR 8,500', image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=400', description: '50-piece alloy steel technician toolkit in a portable protective case.' },
    { id: 104, title: 'Medical Reference Textbook Bundle', category: 'Books', price: 'PKR 4,000', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', description: 'Standard clinical medical textbooks for MBBS students and healthcare practitioners.' },
    { id: 105, title: 'Digital Diagnostic Multimeter Kit', category: 'Hardware', price: 'PKR 2,200', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400', description: 'High precision digital multimeter for electrical testing and electronics repair.' }
  ];

  const currentList = activeTab === 'services' ? servicesData : productsData;

  const filteredData = currentList.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...Array.from(new Set(currentList.map(item => item.category)))];

  const openDetail = (item: ItemType) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpStep(true);
  };

  return (
    <div className="app-main-wrapper">
      {/* Navigation Header */}
      <header className="header">
        <nav className="navbar">
          <div className="logo-brand">
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#007bff' }}>MyPlatform</span>
          </div>
          <div className="nav-links">
            <button 
              className={`nav-btn ${activeTab === 'services' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('services'); setSelectedCategory('All'); }}
            >
              Services
            </button>
            <button 
              className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('products'); setSelectedCategory('All'); }}
            >
              Products
            </button>
          </div>
          <div className="auth-group">
            <button 
              className="btn-primary" 
              onClick={() => { setShowSignupModal(true); setOtpStep(false); }}
            >
              Sign Up / Register
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-banner">
        <h1 className="hero-title">Find Verified Experts & Quality Products</h1>
        <p className="hero-subtitle">Connect directly with Doctors, Lawyers, Technicians & Quality Vendors</p>
        
        <div className="search-box-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder={`Search ${activeTab === 'services' ? 'services, doctors, lawyers...' : 'products, tools, books...'}`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container" style={{ padding: '30px 15px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Category Filters */}
        <div className="filter-bar">
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid-container">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="card" onClick={() => openDetail(item)}>
                <div className="card-media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="badge-tag">{item.category}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{item.title}</h3>
                  {item.location && <p className="card-info">📍 {item.location} • ⭐ {item.rating}</p>}
                  {item.experience && <p className="card-info">💼 {item.experience}</p>}
                  <p className="card-info" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>
                <div className="card-footer">
                  <span className="price-text">{item.price}</span>
                  <button className="btn-secondary">
                    {activeTab === 'services' ? 'Book Now' : 'Buy Now'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>No items found matching your filter criteria.</h3>
            </div>
          )}
        </div>
      </main>

      {/* Detail View Modal */}
      {showDetailModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{selectedItem.title}</h3>
              <button className="close-modal-btn" onClick={() => setShowDetailModal(false)}>&times;</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title} 
                style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} 
              />
              <p style={{ color: '#555', marginBottom: '15px', textAlign: 'left' }}>{selectedItem.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className="badge-tag" style={{ position: 'static' }}>{selectedItem.category}</span>
                <h3 style={{ color: '#28a745' }}>{selectedItem.price}</h3>
              </div>
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '12px' }} 
                onClick={() => alert(`Direct Chat started for: ${selectedItem.title}`)}
              >
                Initiate Direct Chat / Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up / OTP Registration Modal */}
      {showSignupModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{otpStep ? 'Verify OTP Code' : 'Create Account'}</h3>
              <button className="close-modal-btn" onClick={() => setShowSignupModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {!otpStep ? (
                <>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <button 
                      className={`btn-secondary`} 
                      style={{ flex: 1, backgroundColor: userRole === 'buyer' ? '#007bff' : 'transparent', color: userRole === 'buyer' ? '#fff' : '#007bff' }}
                      onClick={() => setUserRole('buyer')}
                    >
                      Join as Buyer
                    </button>
                    <button 
                      className={`btn-secondary`} 
                      style={{ flex: 1, backgroundColor: userRole === 'seller' ? '#007bff' : 'transparent', color: userRole === 'seller' ? '#fff' : '#007bff' }}
                      onClick={() => setUserRole('seller')}
                    >
                      Join as Seller
                    </button>
                  </div>

                  <form onSubmit={handleSignupSubmit}>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="Full Name *" required />
                    </div>
                    <div className="form-group">
                      <input type="email" className="form-control" placeholder="Email Address *" required />
                    </div>
                    <div className="form-group">
                      <input type="tel" className="form-control" placeholder="Mobile Number *" required />
                    </div>

                    {userRole === 'seller' && (
                      <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
                        <h5 style={{ marginBottom: '10px' }}>Mandatory Seller Verification</h5>
                        <div className="form-group">
                          <select className="form-control" required defaultValue="">
                            <option value="" disabled>Select Profession / Specialty *</option>
                            <option value="doctor">Doctor</option>
                            <option value="lawyer">Lawyer</option>
                            <option value="technician">Technician</option>
                            <option value="freelancer">Other Skills</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" placeholder="Experience (e.g. 5 Years) *" required />
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" placeholder="License / Registration No. *" required />
                        </div>
                        <div className="form-group">
                          <textarea className="form-control" placeholder="Clinic / Office Address *" required rows={3}></textarea>
                        </div>
                      </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px' }}>
                      Send OTP Code
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); alert('Account Verified Successfully!'); setShowSignupModal(false); }}>
                  <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                    Enter the 6-digit OTP code sent to your Mobile Number and Email Address.
                  </p>
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Enter 6-Digit OTP" required maxLength={6} style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px' }}>
                    Verify & Create Account
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Platform Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} MyPlatform. All rights reserved.</p>
      </footer>
    </div>
  );
                        }
