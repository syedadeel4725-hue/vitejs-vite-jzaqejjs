import React from 'react';

export default function App() {
  return (
    <>
      {/* YAHAN AAPKA BAQI SAARA HTML CODE AAYEGA */}
      {/* Example: <nav className="navbar"> ... </nav> vagairah */}
    </>
  );
}

  <!-- Navigation Bar -->
  <nav class="navbar">
    <div class="logo">MyPlatform</div>
    <div class="nav-links">
      <button class="nav-btn active" onclick="switchTab('services')">Services</button>
      <button class="nav-btn" onclick="switchTab('products')">Products</button>
    </div>
    <div class="auth-buttons">
      <button onclick="openModal('signupModal')">Sign Up</button>
    </div>
  </nav>

  <!-- Homepage / Main Container -->
  <main class="container">
    
    <!-- Services Section (Default View) -->
    <section id="servicesSection" class="content-section active">
      <div class="section-header">
        <h2>Top Services</h2>
        <p>Expert Doctors, Lawyers, Technicians & Freelancers</p>
      </div>
      <!-- Grid Layout for 10-15 Items -->
      <div class="grid-container" id="servicesGrid">
        <!-- Javascript will render max 12 items here -->
      </div>
      <div class="center-btn">
        <button class="view-all-btn">View All Services</button>
      </div>
    </section>

    <!-- Products Section -->
    <section id="productsSection" class="content-section">
      <div class="section-header">
        <h2>Featured Products</h2>
        <p>Quality items direct from verified sellers</p>
      </div>
      <div class="grid-container" id="productsGrid">
        <!-- Javascript will render product items here -->
      </div>
      <div class="center-btn">
        <button class="view-all-btn">View All Products</button>
      </div>
    </section>

  </main>

  <!-- Detail View Modal -->
  <div id="detailModal" class="modal">
    <div class="modal-content">
      <span class="close-btn" onclick="closeModal('detailModal')">&times;</span>
      <div id="detailContent"></div>
    </div>
  </div>

  {/* Sign Up / OTP Modal */}
<div id="signupModal" className="modal">
  <div className="modal-content auth-box">
    <span className="close-btn" onClick={() => closeModal('signupModal')}>&times;</span>

    {/* Step 1: Role & Basic Info */}
    <form id="signupForm" onSubmit={(event) => handleSignupSubmit(event)}>
      
        <div class="role-selector">
          <label><input type="radio" name="userRole" value="buyer" checked onclick="toggleSellerFields(false)"> Join as Buyer</label>
          <label><input type="radio" name="userRole" value="seller" onclick="toggleSellerFields(true)"> Join as Seller</label>
        </div>

        <input type="text" placeholder="Full Name *" required>
        <input type="email" id="userEmail" placeholder="Email Address *" required>
        <input type="tel" id="userPhone" placeholder="Mobile Number *" required>
        
        <!-- Optional Profile Picture -->
        <label class="file-label">Profile Picture (Optional)</label>
        <input type="file" accept="image/*">

        <!-- Mandatory Seller Fields -->
        <div id="sellerFields" class="hidden">
          <h4>Seller Info (Mandatory)</h4>
          <select required>
            <option value="">Select Profession / Skills *</option>
            <option value="doctor">Doctor</option>
            <option value="lawyer">Lawyer</option>
            <option value="technician">Technician</option>
            <option value="freelancer">Other Skills</option>
          </select>
          <input type="text" placeholder="Experience (e.g. 5 Years) *">
          <input type="text" placeholder="License / Registration No. *">
          <textarea placeholder="Address / Office Location *"></textarea>
        </div>

        <button type="submit" class="submit-btn">Send OTP</button>
      </form>

      <!-- Step 2: OTP Verification -->
      <div id="otpForm" class="hidden">
        <h3>OTP Verification</h3>
        <p>SMS & Email par OTP code bhaija gaya hai</p>
        <input type="text" placeholder="Enter Mobile OTP" maxlength="6" required>
        <input type="text" placeholder="Enter Email OTP" maxlength="6" required>
        <button class="submit-btn" onclick="verifyOTP()">Verify & Complete</button>
      </div>
    </div>
  </div>

  // Sample Data (10 to 15 items maximum on load)
const servicesData = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Professional Service ${i + 1}`,
  category: i % 2 === 0 ? "Doctor" : "Lawyer",
  experience: `${i + 2} Years Experience`,
  image: "https://via.placeholder.com/250x160",
  description: "Ye service complete information ke sath available hai. Doctor/Lawyer details yahan dikhayi dengi."
}));

const productsData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Quality Product ${i + 1}`,
  price: `$${(i + 1) * 20}`,
  image: "https://via.placeholder.com/250x160",
  description: "Ye product verified seller ki taraf se upload kiya gaya hai."
}));

// Page Load Handling
document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderProducts();
});

// Switch Tab between Services & Products
function switchTab(tab) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));

  if (tab === 'services') {
    document.getElementById('servicesSection').classList.add('active');
    event.target.classList.add('active');
  } else {
    document.getElementById('productsSection').classList.add('active');
    event.target.classList.add('active');
  }
}

// Render Services in 2-column/3-column Grid (10-15 Limit)
function renderServices() {
  const container = document.getElementById('servicesGrid');
  container.innerHTML = servicesData.map(item => `
    <div class="card" onclick="openDetail('service', ${item.id})">
      <img src="${item.image}" alt="${item.title}">
      <span class="badge">${item.category}</span>
      <h3 class="card-title">${item.title}</h3>
      <p>${item.experience}</p>
    </div>
  `).join('');
}

function renderProducts() {
  const container = document.getElementById('productsGrid');
  container.innerHTML = productsData.map(item => `
    <div class="card" onclick="openDetail('product', ${item.id})">
      <img src="${item.image}" alt="${item.title}">
      <h3 class="card-title">${item.title}</h3>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  `).join('');
}

// Open Detail Modal with Direct Chat Option
function openDetail(type, id) {
  const data = type === 'service' ? servicesData.find(s => s.id === id) : productsData.find(p => p.id === id);
  const detailBox = document.getElementById('detailContent');

  detailBox.innerHTML = `
    <h2>${data.title}</h2>
    <img src="${data.image}" style="width:100%; border-radius:8px; margin: 15px 0;">
    <p>${data.description}</p>
    <button class="chat-btn" onclick="initiateChat('${data.title}')">💬 Direct Chat with Seller</button>
  `;
  openModal('detailModal');
}

function initiateChat(title) {
  alert(`Chat initialized for: ${title}`);
}

// Handle Form & OTP Visiblity
function toggleSellerFields(isSeller) {
  const sellerBox = document.getElementById('sellerFields');
  if (isSeller) {
    sellerBox.classList.remove('hidden');
  } else {
    sellerBox.classList.add('hidden');
  }
}

function handleSignupSubmit(e) {
  e.preventDefault();
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('otpForm').classList.remove('hidden');
}

function verifyOTP() {
  alert("OTP Verified Successfully! Profile Created.");
  closeModal('signupModal');
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
          // server.js (Node.js Express + Nodemailer + Twilio Logic)
const express = require('express');
const app = express();
app.use(express.json());

// 1. Send Mobile & Email OTP API
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone, email, role } = req.body;
  
  // Generate Random OTPs
  const mobileOTP = Math.floor(100000 + Math.random() * 900000);
  const emailOTP = Math.floor(100000 + Math.random() * 900000);

  // Send SMS via Twilio / Local SMS Gateway
  // Send Email via Nodemailer

  res.status(200).json({ message: "OTP sent to both Mobile and Email." });
});

// 2. Complete Profile API
app.post('/api/auth/register', async (req, res) => {
  const { role, name, email, phone, sellerDetails } = req.body;

  if (role === 'buyer') {
    // Save basic buyer info (Skip experience, skills, etc.)
  } else if (role === 'seller') {
    // Validate mandatory seller fields (Skills, Qualifications, License, Questions)
  }

  res.status(200).json({ status: "success", message: "User registered successfully!" });
});
      {
  "UsersCollection": {
    "user_id": "ObjectId",
    "role": "buyer | seller",
    "name": "String",
    "email": "String",
    "phone": "String",
    "is_verified": true,
    "seller_profile": {
      "profession": "Doctor | Lawyer | Technician",
      "experience_years": "Number",
      "skills": ["Array"],
      "license_number": "String",
      "mandatory_answers": {
        "clinic_address": "String",
        "availability_hours": "String"
      }
    }
  },
  "PostsCollection": {
    "post_id": "ObjectId",
    "type": "service | product",
    "title": "String",
    "category": "String",
    "description": "String",
    "price": "Number",
    "created_by": "User_ObjectId"
  }
      }
      /* ==========================================
   RESET & GLOBAL VARIABLES
   ========================================== */
:root {
  --primary-color: #007bff;
  --primary-hover: #0056b3;
  --secondary-color: #28a745;
  --secondary-hover: #218838;
  --dark-color: #1a1a1a;
  --light-bg: #f8f9fa;
  --card-bg: #ffffff;
  --border-color: #e0e0e0;
  --text-primary: #212529;
  --text-muted: #6c757d;
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --transition: all 0.3s ease-in-out;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
}

body {
  background-color: var(--light-bg);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ==========================================
   HEADER & NAVIGATION BAR
   ========================================== */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

.logo-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 2px solid transparent;
}

.nav-btn:hover {
  color: var(--primary-color);
  background-color: rgba(0, 123, 255, 0.05);
}

.nav-btn.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.auth-group {
  display: flex;
  gap: 0.75rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 1.5px solid var(--primary-color);
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-secondary:hover {
  background-color: var(--primary-color);
  color: #fff;
}

/* ==========================================
   HERO & SEARCH BANNER
   ========================================== */
.hero-banner {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 3rem 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.search-box-container {
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--text-primary);
}

.search-select {
  border: none;
  border-left: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  outline: none;
  font-size: 0.95rem;
  color: var(--text-muted);
}

/* ==========================================
   GRID LAYOUTS & CARDS
   ========================================== */
.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem 1.5rem;
  flex: 1;
}

.section-title-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.section-heading {
  font-size: 1.5rem;
  color: var(--dark-color);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card-media {
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #eee;
  overflow: hidden;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.card:hover .card-media img {
  transform: scale(1.05);
}

.badge-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
}

.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
}

.card-info {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.price-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.view-all-wrapper {
  text-align: center;
  margin-top: 2.5rem;
}

/* ==========================================
   MODAL & FORM SYSTEM
   ========================================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  display: none;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-card {
  background-color: var(--card-bg);
  width: 100%;
  max-width: 550px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlide 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modalSlide {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--text-primary);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

.radio-tile-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.radio-tile {
  flex: 1;
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.radio-tile input {
  display: none;
}

.radio-tile.selected {
  border-color: var(--primary-color);
  background-color: rgba(0, 123, 255, 0.05);
  color: var(--primary-color);
  font-weight: 600;
}

.hidden {
  display: none !important;
}

/* ==========================================
   FOOTER SECTION
   ========================================== */
.footer {
  background-color: var(--dark-color);
  color: #aaa;
  padding: 2.5rem 1.5rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-column h4 {
  color: white;
  margin-bottom: 1rem;
}

.footer-column ul {
  list-style: none;
}

.footer-column ul li {
  margin-bottom: 0.5rem;
}

.footer-column ul li a {
  color: #aaa;
  text-decoration: none;
}

.footer-column ul li a:hover {
  color: white;
}
  /* ==========================================
   APPLICATION STATE & MOCK DATA
   ========================================== */
const AppState = {
  activeTab: 'services',
  user: null,
  limitPerPage: 12,
  services: [],
  products: []
};

// Expanded Service Mock Generator
for (let i = 1; i <= 30; i++) {
  const categories = ['Doctor', 'Lawyer', 'Electrician', 'Plumber', 'Software Developer', 'Tutor'];
  const cat = categories[i % categories.length];
  AppState.services.push({
    id: `srv_${i}`,
    title: `${cat} Professional Service #${i}`,
    category: cat,
    rating: (4.0 + (i % 10) * 0.1).toFixed(1),
    experience: `${(i % 15) + 1} Years Experience`,
    location: i % 2 === 0 ? 'Lahore, Pakistan' : 'Karachi, Pakistan',
    price: `PKR ${1500 + (i * 200)}`,
    image: `https://picsum.photos/seed/srv${i}/400/250`,
    description: `Experienced ${cat} available for urgent consultation and full-time hiring. Verified background and certifications.`
  });
}

// Expanded Product Mock Generator
for (let i = 1; i <= 30; i++) {
  const productTypes = ['Medical Kit', 'Legal Documents Kit', 'Tool Set', 'Textbook Bundle', 'Hardware Component'];
  const prod = productTypes[i % productTypes.length];
  AppState.products.push({
    id: `prd_${i}`,
    title: `${prod} Item #${i}`,
    category: 'Equipment',
    price: `PKR ${500 + (i * 350)}`,
    stock: (i * 3) + 2,
    image: `https://picsum.photos/seed/prd${i}/400/250`,
    description: `High quality ${prod} supplied directly from authorized distributor. Warranty and immediate dispatch available.`
  });
}

/* ==========================================
   DOM INITIALIZATION & LISTENERS
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderProducts();
  setupEventListeners();
});

function setupEventListeners() {
  // Radio Selection Handling for Role Toggle
  document.querySelectorAll('.radio-tile').forEach(tile => {
    tile.addEventListener('click', function() {
      document.querySelectorAll('.radio-tile').forEach(t => t.classList.remove('selected'));
      this.classList.add('selected');
      const radio = this.querySelector('input[type="radio"]');
      radio.checked = true;
      toggleSellerFields(radio.value === 'seller');
    });
  });
}

/* ==========================================
   VIEW RENDER FUNCTIONS
   ========================================== */
function switchTab(tabName) {
  AppState.activeTab = tabName;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.remove('active');
  });

  if (tabName === 'services') {
    document.getElementById('servicesNavBtn').classList.add('active');
    document.getElementById('servicesSection').classList.add('active');
  } else {
    document.getElementById('productsNavBtn').classList.add('active');
    document.getElementById('productsSection').classList.add('active');
  }
}

function renderServices(limit = AppState.limitPerPage) {
  const container = document.getElementById('servicesGrid');
  const itemsToDisplay = AppState.services.slice(0, limit);

  container.innerHTML = itemsToDisplay.map(srv => `
    <div class="card" onclick="openDetailView('service', '${srv.id}')">
      <div class="card-media">
        <img src="${srv.image}" alt="${srv.title}" loading="lazy">
        <span class="badge-tag">${srv.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${srv.title}</h3>
        <p class="card-info">📍 ${srv.location} • ⭐ ${srv.rating}</p>
        <p class="card-info">${srv.experience}</p>
        <div class="card-footer">
          <span class="price-text">${srv.price}</span>
          <button class="btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 0.85rem;">Details</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderProducts(limit = AppState.limitPerPage) {
  const container = document.getElementById('productsGrid');
  const itemsToDisplay = AppState.products.slice(0, limit);

  container.innerHTML = itemsToDisplay.map(prd => `
    <div class="card" onclick="openDetailView('product', '${prd.id}')">
      <div class="card-media">
        <img src="${prd.image}" alt="${prd.title}" loading="lazy">
        <span class="badge-tag">Product</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${prd.title}</h3>
        <p class="card-info">In Stock: ${prd.stock} units</p>
        <div class="card-footer">
          <span class="price-text">${prd.price}</span>
          <button class="btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.85rem;">Buy Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function showAllServices() {
  renderServices(AppState.services.length);
  document.getElementById('viewAllServicesBtn').style.display = 'none';
}

function showAllProducts() {
  renderProducts(AppState.products.length);
  document.getElementById('viewAllProductsBtn').style.display = 'none';
}

/* ==========================================
   MODALS & INTERACTION LOGIC
   ========================================== */
function openDetailView(type, id) {
  const modal = document.getElementById('detailModal');
  const container = document.getElementById('detailContent');
  let item = type === 'service' 
    ? AppState.services.find(s => s.id === id) 
    : AppState.products.find(p => p.id === id);

  if (!item) return;

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <img src="${item.image}" style="width: 100%; max-height: 250px; object-fit: cover; border-radius: var(--radius-md);">
    </div>
    <h2>${item.title}</h2>
    <p style="color: var(--text-muted); margin-bottom: 1rem;">Category: ${item.category}</p>
    <p style="margin-bottom: 1rem;">${item.description}</p>
    <div style="background: var(--light-bg); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
      <strong>Pricing / Charges:</strong> <span class="price-text">${item.price}</span>
    </div>
    <button class="btn-primary" style="width: 100%; padding: 0.8rem; background-color: var(--secondary-color);" onclick="startDirectChat('${item.title}')">
      💬 Direct Chat with ${type === 'service' ? 'Provider' : 'Seller'}
    </button>
  `;

  modal.style.display = 'flex';
}

function startDirectChat(title) {
  alert(`Initiating secure direct messaging room for: ${title}`);
}

function toggleSellerFields(show) {
  const fields = document.getElementById('sellerFields');
  if (show) {
    fields.classList.remove('hidden');
    fields.querySelectorAll('input, select, textarea').forEach(el => el.required = true);
  } else {
    fields.classList.add('hidden');
    fields.querySelectorAll('input, select, textarea').forEach(el => el.required = false);
  }
}

function handleSignupSubmit(event) {
  event.preventDefault();
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('otpForm').classList.remove('hidden');
}

function verifyOTP() {
  const mob = document.getElementById('mobileOtpInput').value;
  const em = document.getElementById('emailOtpInput').value;

  if (mob.length === 6 && em.length === 6) {
    alert("Phone and Email successfully authenticated!");
    closeModal('signupModal');
    // Reset forms
    document.getElementById('signupForm').reset();
    document.getElementById('otpForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
  } else {
    alert("Please enter valid 6-digit OTP codes.");
  }
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
      /* ==========================================
   EXPRESS SERVER & API CONTROLLERS
   ========================================== */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-Memory Database Mock
const DB = {
  users: [],
  otps: new Map(),
  posts: []
};

/* ==========================================
   AUTHENTICATION ENDPOINTS
   ========================================== */

// 1. Request OTP (Mobile + Email)
app.post('/api/v1/auth/request-otp', (req, res) => {
  const { phone, email } = req.body;

  if (!phone || !email) {
    return res.status(400).json({ success: false, message: "Phone and Email are required." });
  }

  const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in Memory with expiration
  DB.otps.set(email, { phoneOTP, emailOTP, expiresAt: Date.now() + 300000 });

  console.log(`[SMS Gateway Mock] Sent OTP ${phoneOTP} to ${phone}`);
  console.log(`[SMTP Mailer Mock] Sent OTP ${emailOTP} to ${email}`);

  return res.status(200).json({
    success: true,
    message: "OTP codes dispatched to mobile number and email address."
  });
});

// 2. Verify OTP & Register Account
app.post('/api/v1/auth/verify-and-register', (req, res) => {
  const { role, name, email, phone, phoneOTP, emailOTP, sellerData } = req.body;

  const record = DB.otps.get(email);
  if (!record) {
    return res.status(400).json({ success: false, message: "OTP expired or not requested." });
  }

  if (record.phoneOTP !== phoneOTP || record.emailOTP !== emailOTP) {
    return res.status(400).json({ success: false, message: "Invalid OTP credentials." });
  }

  // Create User Object
  const newUser = {
    id: `usr_${Date.now()}`,
    role: role || 'buyer',
    name,
    email,
    phone,
    createdAt: new Date().toISOString()
  };

  if (role === 'seller') {
    if (!sellerData || !sellerData.profession || !sellerData.licenseNumber) {
      return res.status(400).json({ success: false, message: "Missing mandatory seller credentials." });
    }
    newUser.sellerProfile = {
      profession: sellerData.profession,
      experience: sellerData.experience,
      licenseNumber: sellerData.licenseNumber,
      officeAddress: sellerData.officeAddress,
      isVerified: false // Admin review pending
    };
  }

  DB.users.push(newUser);
  DB.otps.delete(email);

  return res.status(201).json({
    success: true,
    message: "Registration successfully completed.",
    user: newUser
  });
});

/* ==========================================
   FEED & POST ENDPOINTS
   ========================================== */

// Get Services Grid (Filtered & Limited)
app.get('/api/v1/services', (req, res) => {
  const limit = parseInt(req.query.limit) || 12;
  const page = parseInt(req.query.page) || 1;
  
  const services = DB.posts.filter(p => p.type === 'service');
  const paginated = services.slice((page - 1) * limit, page * limit);

  return res.status(200).json({
    success: true,
    count: paginated.length,
    total: services.length,
    data: paginated
  });
});

// Get Products Grid
app.get('/api/v1/products', (req, res) => {
  const limit = parseInt(req.query.limit) || 12;
  const products = DB.posts.filter(p => p.type === 'product').slice(0, limit);

  return res.status(200).json({
    success: true,
    data: products
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  -- ==========================================
-- PostgreSQL Database Schema Architecture
-- ==========================================

CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE post_type AS ENUM ('service', 'product');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    role user_role DEFAULT 'buyer',
    profile_pic_url TEXT,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seller_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profession_category VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    office_address TEXT NOT NULL,
    is_verified_badge BOOLEAN DEFAULT FALSE,
    skills_tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type post_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    images TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
    
