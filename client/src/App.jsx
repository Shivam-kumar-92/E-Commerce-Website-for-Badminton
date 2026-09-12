import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProductCard from './components/ProductCard.jsx';
import ProductDetailModal from './components/ProductDetailModal.jsx';
import CompareModal from './components/CompareModal.jsx';
import QuizModal from './components/QuizModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import OrderTrackingModal from './components/OrderTrackingModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import FiltersSidebar from './components/FiltersSidebar.jsx';
import Footer from './components/Footer.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';
import fallbackProducts from './data/products.json';
import fallbackOptions from './data/options.json';
import { 
  Sparkles, 
  Layers, 
  Zap, 
  Flame, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ShoppingBag,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // Data States
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedPlaystyle, setSelectedPlaystyle] = useState('all');
  const [selectedFlex, setSelectedFlex] = useState('all');
  const [selectedWeight, setSelectedWeight] = useState('all');
  const [priceRange, setPriceRange] = useState(350);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'power' | 'speed' | 'price-asc' | 'price-desc' | 'rating'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Computed Active Filter Count for Mobile Indicator
  const activeFilterCount = [
    selectedBrand !== 'all',
    selectedPlaystyle !== 'all',
    selectedFlex !== 'all',
    selectedWeight !== 'all',
    priceRange < 350,
    searchQuery.trim().length > 0
  ].filter(Boolean).length;

  // App Navigation & Modals
  const [activeTab, setActiveTab] = useState('shop');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('SMASH-98241');

  // Interactive User States (Cart & Compare)
  const [compareList, setCompareList] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('smashpro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('smashpro_cart', JSON.stringify(cart));
  }, [cart]);

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Options & Initial Data
  useEffect(() => {
    const initData = async () => {
      try {
        const [optRes, featRes, brandRes] = await Promise.all([
          fetch('/api/options'),
          fetch('/api/featured'),
          fetch('/api/brands')
        ]);
        if (optRes.ok && featRes.ok && brandRes.ok) {
          const optData = await optRes.json();
          const featData = await featRes.json();
          const brandData = await brandRes.json();
          setOptions(optData);
          setFeaturedProducts(featData);
          setBrands(brandData);
          return;
        }
        throw new Error('API unavailable');
      } catch (err) {
        // Resilient fallback for Vercel / static hosting
        setOptions(fallbackOptions);
        setFeaturedProducts(fallbackProducts.filter(p => p.featured || p.badge));
        const uniqueBrands = [...new Set(fallbackProducts.map(p => p.brand))];
        setBrands(uniqueBrands);
      }
    };
    initData();
  }, []);

  // Fetch Products on Filter / Search Change
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedBrand !== 'all') params.append('brand', selectedBrand);
      if (selectedPlaystyle !== 'all') params.append('playstyle', selectedPlaystyle);
      if (selectedFlex !== 'all') params.append('flex', selectedFlex);
      if (selectedWeight !== 'all') params.append('weight', selectedWeight);
      if (priceRange < 350) params.append('maxPrice', priceRange.toString());
      if (sortBy) params.append('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        return;
      }
      throw new Error('Using fallback filtering');
    } catch (err) {
      // Resilient client-side filtering fallback for Vercel
      let filtered = [...fallbackProducts];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.brand.toLowerCase().includes(q) ||
          p.specs?.playstyle?.toLowerCase().includes(q)
        );
      }
      if (selectedBrand !== 'all') {
        filtered = filtered.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
      }
      if (selectedPlaystyle !== 'all') {
        filtered = filtered.filter(p => p.specs?.playstyleCategory === selectedPlaystyle);
      }
      if (selectedFlex !== 'all') {
        filtered = filtered.filter(p => p.specs?.flex?.toLowerCase().includes(selectedFlex.toLowerCase()));
      }
      if (selectedWeight !== 'all') {
        filtered = filtered.filter(p => p.specs?.weightClass?.includes(selectedWeight));
      }
      if (priceRange < 350) {
        filtered = filtered.filter(p => p.price <= priceRange);
      }
      if (sortBy === 'power') {
        filtered.sort((a, b) => (b.radar?.power || 0) - (a.radar?.power || 0));
      } else if (sortBy === 'speed') {
        filtered.sort((a, b) => (b.radar?.speed || 0) - (a.radar?.speed || 0));
      } else if (sortBy === 'control') {
        filtered.sort((a, b) => (b.radar?.control || 0) - (a.radar?.control || 0));
      } else if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedBrand, selectedPlaystyle, selectedFlex, selectedWeight, priceRange, sortBy]);

  // Handle Cart Operations
  const handleAddToCart = (customItem) => {
    setCart(prev => {
      // Look for identical configuration
      const existingIndex = prev.findIndex(item => 
        item.productId === customItem.productId &&
        item.weightClass === customItem.weightClass &&
        item.string?.id === customItem.string?.id &&
        item.string?.tension === customItem.string?.tension &&
        item.grip?.id === customItem.grip?.id &&
        item.stencil?.id === customItem.stencil?.id
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      } else {
        return [...prev, customItem];
      }
    });

    showToast(`🏸 ${customItem.productName} (${customItem.string ? `${customItem.string.tension} LBS` : 'Unstrung'}) added to cart!`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
    } else {
      setCart(prev => {
        const copy = [...prev];
        copy[index].quantity = newQty;
        return copy;
      });
    }
  };

  const handleRemoveFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Compare Operations
  const handleToggleCompare = (product) => {
    const exists = compareList.some(p => p.id === product.id);
    if (exists) {
      setCompareList(prev => prev.filter(p => p.id !== product.id));
      showToast(`Removed ${product.name} from comparison.`);
    } else {
      if (compareList.length >= 4) {
        showToast(`⚠️ You can compare a maximum of 4 rackets simultaneously.`);
        return;
      }
      setCompareList(prev => [...prev, product]);
      showToast(`⚡ ${product.name} added to comparison list!`);
    }
  };

  const handleRemoveFromCompare = (productId) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedBrand('all');
    setSelectedPlaystyle('all');
    setSelectedFlex('all');
    setSelectedWeight('all');
    setPriceRange(350);
    setSearchQuery('');
    setSortBy('featured');
  };

  // Add Review
  const handleAddReview = async (productId, reviewData) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        showToast('🌟 Your verified player review has been published!');
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cartTotal = cart.reduce((sum, it) => sum + ((it.itemTotal || it.basePrice) * it.quantity), 0);
  const cartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 font-sans selection:bg-volt selection:text-dark-950 pb-20 lg:pb-0">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-2xl glass-panel bg-dark-900 border border-volt/50 shadow-glow-volt text-xs font-bold text-white flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-volt text-dark-950 flex items-center justify-center font-black">
            ✓
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        compareCount={compareList.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero
        onOpenQuiz={() => setIsQuizOpen(true)}
        onSelectFeatured={(prod) => setSelectedProduct(prod)}
        featuredProducts={featuredProducts}
      />

      {/* Quick Brand Selector Ribbon */}
      <section className="border-b border-slate-800 bg-dark-900/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 shrink-0">
            Tournament Brands:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedBrand === 'all' 
                  ? 'bg-volt text-dark-950 shadow-glow-volt font-black' 
                  : 'bg-dark-950 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              All Series ({products.length})
            </button>
            {['Yonex', 'Victor', 'Li-Ning', 'Mizuno', 'Apacs'].map(b => (
              <button
                key={b}
                onClick={() => setSelectedBrand(selectedBrand === b ? 'all' : b)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedBrand === b
                    ? 'bg-volt text-dark-950 shadow-glow-volt font-black'
                    : 'bg-dark-950 text-slate-300 border border-slate-800 hover:border-slate-600'
                }`}
              >
                <span>{b}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsQuizOpen(true)}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-cyan hover:underline shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Quiz Matchmaker
          </button>
        </div>
      </section>

      {/* Main Catalog & Filter Section */}
      <main id="catalog" className="flex-1 max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Playstyle Quick Filter Category Pills & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          
          {/* Quick Playstyle Tabs + Mobile Filter Trigger */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
            {/* Mobile Filter Sheet Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-volt" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-volt text-dark-950 font-black text-[10px] px-1.5 py-0.2 rounded-full shadow-glow-volt">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {[
              { id: 'all', label: 'All Weapons' },
              { id: 'power', label: '💥 Head Heavy' },
              { id: 'speed', label: '⚡ Head Light' },
              { id: 'control', label: '🎯 Even Balance' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedPlaystyle(tab.id)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all ${
                  selectedPlaystyle === tab.id
                    ? 'bg-white text-dark-950 font-black shadow-lg'
                    : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto pt-1 md:pt-0">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase">Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:flex-initial bg-dark-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-volt"
            >
              <option value="featured">Featured / Spotlight</option>
              <option value="power">💥 Highest Power</option>
              <option value="speed">⚡ Highest Speed</option>
              <option value="control">🎯 Highest Control</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>

        </div>

        {/* Content Layout: Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block shrink-0">
            <FiltersSidebar
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedPlaystyle={selectedPlaystyle}
              setSelectedPlaystyle={setSelectedPlaystyle}
              selectedFlex={selectedFlex}
              setSelectedFlex={setSelectedFlex}
              selectedWeight={selectedWeight}
              setSelectedWeight={setSelectedWeight}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onResetFilters={handleResetFilters}
              brands={brands}
              totalResults={products.length}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileFiltersOpen && (
            <FiltersSidebar
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileFiltersOpen(false)}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedPlaystyle={selectedPlaystyle}
              setSelectedPlaystyle={setSelectedPlaystyle}
              selectedFlex={selectedFlex}
              setSelectedFlex={setSelectedFlex}
              selectedWeight={selectedWeight}
              setSelectedWeight={setSelectedWeight}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onResetFilters={handleResetFilters}
              brands={brands}
              totalResults={products.length}
            />
          )}

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-volt border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Calibrating racket listings...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center glass-panel rounded-3xl p-8 space-y-4 border border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-dark-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Flame className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-white">No Matching Rackets Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try broadening your search query or reset your stiffness and balance filters to see all tournament series.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-volt text-dark-950 font-black text-xs uppercase"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProduct(p)}
                    isCompared={compareList.some(item => item.id === prod.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Floating Comparison Tray (Offset on mobile so bottom bar doesn't block it) */}
      {compareList.length > 0 && !isCompareOpen && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 glass-panel bg-dark-900/95 border border-volt/40 shadow-glow-volt rounded-2xl p-3 px-5 flex items-center gap-4 animate-in slide-in-from-bottom-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-volt" />
            <span className="text-xs font-black text-white">
              {compareList.length} Racket{compareList.length > 1 ? 's' : ''} in Spec Matrix
            </span>
          </div>

          <div className="flex items-center -space-x-2">
            {compareList.map(item => (
              <img
                key={item.id}
                src={item.image}
                alt={item.name}
                className="w-8 h-8 rounded-full border-2 border-dark-950 object-cover"
                title={item.name}
              />
            ))}
          </div>

          <button
            onClick={() => setIsCompareOpen(true)}
            className="py-1.5 px-4 rounded-xl bg-volt text-dark-950 font-black text-xs uppercase hover:shadow-glow-volt"
          >
            View Matrix
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onFilterBrand={(brand) => {
          setSelectedBrand(brand);
          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* MODALS */}
      {/* 1. Product Detail & Customizer Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          options={options}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onAddReview={handleAddReview}
        />
      )}

      {/* 2. Side-by-Side Comparison Modal */}
      {isCompareOpen && (
        <CompareModal
          compareList={compareList}
          onClose={() => setIsCompareOpen(false)}
          onRemoveFromCompare={handleRemoveFromCompare}
          onClearCompare={handleClearCompare}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* 3. Matchmaker Quiz Modal */}
      {isQuizOpen && (
        <QuizModal
          options={options}
          onClose={() => setIsQuizOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* 4. Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        appliedVoucher={appliedVoucher}
        onApplyVoucher={(v) => {
          setAppliedVoucher(v);
          showToast(`🎟️ Voucher '${v.code}' applied!`);
        }}
        onRemoveVoucher={() => setAppliedVoucher(null)}
      />

      {/* 5. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        appliedVoucher={appliedVoucher}
        onOrderSuccess={() => {
          setCart([]);
          setAppliedVoucher(null);
        }}
        onOpenTracking={(ordId) => {
          setTrackingOrderId(ordId);
          setIsTrackingOpen(true);
        }}
      />

      {/* 6. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={trackingOrderId}
      />

      {/* 7. Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductChanged={() => fetchProducts()}
      />

      {/* 8. Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        compareCount={compareList.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

    </div>
  );
}
