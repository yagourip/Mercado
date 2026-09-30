import React, { useState } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { MarketStorefront } from './components/MarketStorefront';
import { SellerDashboard } from './components/SellerDashboard';
import { BuyerOrders } from './components/BuyerOrders';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { StockChatbot } from './components/StockChatbot';
import { Footer } from './components/Footer';
import { Product, UserRole } from './types/market';

const MainApp: React.FC = () => {
  const { currentUser, setIsChatOpen } = useMarket();
  const [currentTab, setCurrentTab] = useState<'market' | 'seller' | 'orders'>('market');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>('buyer');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // If user is not logged in, enforce the initial Login & Password + Buyer/Seller selection screen
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={role => {
          if (role === 'seller') {
            setCurrentTab('seller');
          } else {
            setCurrentTab('market');
          }
        }}
      />
    );
  }

  const handleOpenAuth = (role: UserRole = 'buyer') => {
    setAuthRole(role);
    setIsAuthOpen(true);
  };

  const handleTabChange = (tab: 'market' | 'seller' | 'orders') => {
    if (tab === 'seller') {
      if (!currentUser || currentUser.role !== 'seller') {
        handleOpenAuth('seller');
        return;
      }
    }
    if (tab === 'orders') {
      if (!currentUser) {
        handleOpenAuth('buyer');
        return;
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200">
      {/* 3-Zone Top Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        onOpenAuth={handleOpenAuth}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'market' && (
          <MarketStorefront
            onOpenProductDetails={prod => setSelectedProduct(prod)}
            onOpenAuthForSeller={() => handleOpenAuth('seller')}
          />
        )}

        {currentTab === 'seller' && currentUser?.role === 'seller' && (
          <SellerDashboard />
        )}

        {currentTab === 'orders' && (
          <BuyerOrders onBackToMarket={() => setCurrentTab('market')} />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Shopping Bag Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={() => {
          setCurrentTab('orders');
        }}
      />

      {/* Authentication Modal with separated Buyer/Seller roles */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialRole={authRole}
        onSuccess={() => {
          if (authRole === 'seller') {
            setCurrentTab('seller');
          }
        }}
      />

      {/* Groq AI Stock Chatbot Widget */}
      <StockChatbot />

      {/* Footer */}
      <Footer
        onOpenAuth={role => handleOpenAuth(role)}
        onOpenChat={() => setIsChatOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MainApp />
    </MarketProvider>
  );
}

