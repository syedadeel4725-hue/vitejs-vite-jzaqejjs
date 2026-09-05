<!DOCTYPE html>
<html lang="ur">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service & Product Platform</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

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

  <!-- Sign Up / OTP Modal -->
  <div id="signupModal" class="modal">
    <div class="modal-content auth-box">
      <span class="close-btn" onclick="closeModal('signupModal')">&times;</span>
      
      <!-- Step 1: Role & Basic Info -->
      <form id="signupForm" onsubmit="handleSignupSubmit(event)">
        <h3>Create Account</h3>
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

  <script src="script.js"></script>
</body>
</html>
          * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

body {
  background-color: #f5f6f8;
  color: #333;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 15px 30px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav-links .nav-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.nav-links .nav-btn.active {
  border-color: #007bff;
  color: #007bff;
  font-weight: bold;
}

.container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 15px;
}

.content-section {
  display: none;
}

.content-section.active {
  display: block;
}

/* 2-column or 3-column Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
}

.card-title {
  font-size: 18px;
  margin: 10px 0 5px;
}

.badge {
  display: inline-block;
  background: #e1f5fe;
  color: #0288d1;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.center-btn {
  text-align: center;
  margin-top: 30px;
}

.view-all-btn, .submit-btn, .chat-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.chat-btn {
  background: #28a745;
  width: 100%;
  margin-top: 15px;
  font-size: 16px;
}

/* Modals & Forms */
.modal {
  display: none;
  position: fixed;
  top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px; right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.hidden { display: none; }

.role-selector {
  margin: 15px 0;
  display: flex;
  gap: 15px;
}

form input, form select, form textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
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
      
