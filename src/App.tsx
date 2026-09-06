import React, { useState } from 'react';
import './App.css';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  sellerName: string;
  isEscrowProtected: boolean;
}

interface EscrowOrder {
  orderId: string;
  productTitle: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED_HOLD' | 'RELEASED' | 'REFUNDED';
  holdHoursRemaining: number;
}

export default function App() {
  // Modal Visibility States
  const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
  const [showEscrowModal, setShowEscrowModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  
  // Selected Product / Order
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Sample Products Data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      title: 'iPhone 13 Mini - 128GB Clean',
      price: 135000,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      sellerName: 'Usman Electronics',
      isEscrowProtected: true,
    },
    {
      id: '2',
      title: 'UI/UX Design Service (Landing Page)',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400',
      sellerName: 'Creative Agency',
      isEscrowProtected: true,
    }
  ]);

  // Active Escrow Order
  const [activeOrder, setActiveOrder] = useState<EscrowOrder>({
    orderId: 'ORD-98214',
    productTitle: 'UI/UX Design Service (Landing Page)',
    amount: 15000,
    status: 'COMPLETED_HOLD',
    holdHoursRemaining: 24
  });

  // Handle Edit or Create Listing
  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    alert('پوسٹ کامیابی سے محفوط کر لی گئی ہے!');
    setShowAddEditModal(false);
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="header">
        <div className="logo-brand">Dukan.ai</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a 
            href="https://wa.me/923284725083" 
            target="_blank" 
            rel="noreferrer" 
            className="support-badge"
          >
            💬 WhatsApp Support (03284725083)
          </a>
          <button className="btn btn-secondary" onClick={() => setShowWithdrawModal(true)}>
            💸 Withdraw Earnings
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingProduct(null); setShowAddEditModal(true); }}>
            + Create Listing (Free)
          </button>
        </div>
      </header>

      {/* Pricing / Fees Policy Ribbon */}
      <div style={{ background: '#fef3c7', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fde68a', marginBottom: '20px', fontSize: '13px', color: '#92400e' }}>
        <strong>📢 مناسب ریٹس:</strong> پہلی 3 پوسٹس مفت! | Post Renewal (30 دن بعد): <strong>PKR 100</strong> | Featured Tag: <strong>PKR 500/Month</strong>
      </div>

      {/* Escrow Orders Banner Section */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '15px' }}>🔒 Active Escrow Order: {activeOrder.orderId}</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{activeOrder.productTitle} - PKR {activeOrder.amount}</p>
          </div>
          <button className="btn btn-success" style={{ width: 'auto' }} onClick={() => setShowEscrowModal(true)}>
            View Escrow Details
          </button>
        </div>
      </div>

      {/* Product List */}
      <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Available Products & Services</h2>
      <div className="products-grid">
        {products.map((prod) => (
          <div key={prod.id} className="card">
            <img src={prod.image} alt={prod.title} className="card-image" />
            <div className="card-body">
              <div className="card-title">{prod.title}</div>
              <div className="card-price">PKR {prod.price.toLocaleString()}</div>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>Seller: {prod.sellerName}</p>
              
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={() => { setEditingProduct(prod); setShowAddEditModal(true); }}>
                  Edit
                </button>
                <button className="btn btn-primary" onClick={() => setShowEscrowModal(true)}>
                  Buy via Escrow
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODAL 1: ADD / EDIT LISTING ---------------- */}
      {showAddEditModal && (
        <div className="modal-overlay" onClick={() => setShowAddEditModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Listing' : 'Create New Listing'}</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowAddEditModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveListing}>
                <div className="input-group">
                  <label>Title *</label>
                  <input type="text" defaultValue={editingProduct?.title || ''} required />
                </div>
                <div className="input-group">
                  <label>Price (PKR) *</label>
                  <input type="number" defaultValue={editingProduct?.price || ''} required />
                </div>
                <div className="input-group">
                  <label>Image URL *</label>
                  <input type="text" defaultValue={editingProduct?.image || ''} required />
                </div>
                <div className="input-group">
                  <label>Featured Promotion Option</label>
                  <select>
                    <option value="free">Standard Post (Free)</option>
                    <option value="featured">Featured Top Post - PKR 500/Month</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  Save Listing
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: ESCROW & PAYMENT DETAILS ---------------- */}
      {showEscrowModal && (
        <div className="modal-overlay" onClick={() => setShowEscrowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🛡️ Escrow Protection & Payments</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowEscrowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              
              <div className="escrow-banner">
                <strong>🔒 24-Hour Time Hold Active:</strong> Payment is held safely by Admin. Once buyer checks and clicks "Accept", funds are released to the seller.
              </div>

              {/* Admin Deposit Accounts Display */}
              <h4 style={{ fontSize: '13px', marginBottom: '8px' }}>Send Payments To Admin Accounts:</h4>
              <div className="payment-box">
                <div className="payment-row">
                  <span>JazzCash / SadaPay / WhatsApp:</span>
                  <strong>03284725083</strong>
                </div>
                <div className="payment-row">
                  <span>Easypaisa:</span>
                  <strong>03123632821</strong>
                </div>
                <div className="payment-row">
                  <span>MCB IBAN:</span>
                  <strong>PK82MUCB1679089061004089</strong>
                </div>
                <div className="payment-row">
                  <span>MCB Account:</span>
                  <strong>1679089061004089</strong>
                </div>
                <div className="payment-row">
                  <span>Askari IBAN:</span>
                  <strong>PK60ASCM0002650900004565</strong>
                </div>
                <div className="payment-row">
                  <span>Askari Account:</span>
                  <strong>000265090000</strong>
                </div>
              </div>

              {/* Escrow Release Controls */}
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Hold Time Remaining: <strong>{activeOrder.holdHoursRemaining} Hours</strong></p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-success" onClick={() => { alert('Order Complete! Money released to seller.'); setShowEscrowModal(false); }}>
                    Accept & Release Money
                  </button>
                  <button className="btn btn-danger" onClick={() => { alert('Dispute Requested! Admin will inspect and process refund within 24 hours.'); setShowEscrowModal(false); }}>
                    Request Refund
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: SELLER WITHDRAWAL ---------------- */}
      {showWithdrawModal && (
        <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💸 Seller Withdraw Request</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowWithdrawModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); alert('Withdrawal request sent to Admin!'); setShowWithdrawModal(false); }}>
                <div className="input-group">
                  <label>Select Payout Method *</label>
                  <select required>
                    <option value="jazzcash">JazzCash (03284725083)</option>
                    <option value="easypaisa">Easypaisa (03123632821)</option>
                    <option value="mcb">MCB Bank</option>
                    <option value="askari">Askari Bank</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Account Title *</label>
                  <input type="text" placeholder="e.g. Account Holder Name" required />
                </div>
                <div className="input-group">
                  <label>Account Number / IBAN *</label>
                  <input type="text" placeholder="Enter Account / IBAN Number" required />
                </div>
                <button type="submit" className="btn btn-success" style={{ marginTop: '10px' }}>
                  Submit Withdrawal Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

