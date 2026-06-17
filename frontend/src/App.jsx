import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  Plus, 
  Minus, 
  RotateCcw, 
  ListFilter, 
  ChevronRight, 
  Check, 
  Terminal, 
  Folder, 
  FileCode, 
  ChevronDown, 
  BookOpen, 
  Sparkles, 
  Send, 
  AlertCircle, 
  Code, 
  Download, 
  Layers,
  ShoppingBag,
  ExternalLink,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductService from './services/ProductService';

const DEPARTMENTS = [
  { id: 'all', name: 'All Departments' },
  { id: 'produce', name: 'Fresh Produce' },
  { id: 'dairy', name: 'Dairy & Eggs' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'meat', name: 'Meat & Seafood' },
  { id: 'pantry', name: 'Pantry' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'frozen', name: 'Frozen Foods' }
];

export default function App() {
  // General State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    searchQuery: '',
    department: 'all',
    isOrganic: false,
    isSale: false,
    isGlutenFree: false,
    priceRange: [0, 20],
    sortBy: 'relevance'
  });


  // Pre-populate with initial log and load first products list
  useEffect(() => {
    console.log('Albertsons REST API simulation successfully initialized.');
    executeBackendQuery(filters);
  }, []);

  // Run search when filters update
  useEffect(() => {
    executeBackendQuery(filters);
  }, [filters.department, filters.isOrganic, filters.isSale, filters.isGlutenFree, filters.sortBy]);

  // Handle Fetch Operations mirroring Spring Boot Controller
  const executeBackendQuery = async (currentFilters) => {
    setLoading(true);
    try {
      const data = await ProductService.getProducts(currentFilters);
      setProducts(data);
    } catch (err) {
      console.warn(`Connection failed: ${err.message}`);
      setProducts([]); // Clear on failure as we don't have mock fallbacks
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeBackendQuery(filters);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      searchQuery: '',
      department: 'all',
      isOrganic: false,
      isSale: false,
      isGlutenFree: false,
      priceRange: [0, 20],
      sortBy: 'relevance'
    };
    setFilters(defaultFilters);
    console.log('Reset all query filters.');
    executeBackendQuery(defaultFilters);
  };

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    console.log(`Added "${product.name}" to cart.`);
  };

  const updateCartQuantity = (productId, amount) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + amount;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);





  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      
      {/* CORE ALBERTSONS CONSUMER HEADER PORTAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div id="albertsons-logo" className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-sm tracking-tighter">
                <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center">A</div>
              </div>
              <div>
                <span className="text-blue-600 text-xl font-bold tracking-tight uppercase block leading-none">Albertsons</span>
                <span className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">Product Search System</span>
              </div>
            </div>

            {/* Main Search Input Form */}
            <div className="flex-1 max-w-2xl relative hidden md:flex items-center">
              <div className="absolute left-4 text-slate-400">
                <Search size={18} />
              </div>
              <input 
                id="search-input-main"
                type="text" 
                placeholder="Search fresh groceries (e.g. Organic Milk, Lucerne, Bread, Bananas, Apples...)" 
                className="w-full pl-11 pr-20 py-2.5 bg-slate-100 border-none rounded-full py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                value={filters.searchQuery}
                onKeyPress={handleSearchKeyPress}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
              <button 
                id="search-go-button" 
                onClick={() => executeBackendQuery(filters)}
                className="absolute right-1 px-5 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-full text-xs font-bold transition cursor-pointer"
              >
                GO
              </button>
            </div>

            {/* Location and Shopping Cart Status */}
            <div className="flex items-center gap-5">
              <div className="hidden lg:flex items-center gap-2 border-r border-slate-200 pr-5 text-right font-sans">
                <div className="text-slate-400"><MapPin size={18} className="text-blue-600" /></div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold leading-tight uppercase tracking-wider">My Store</span>
                  <span className="text-xs font-bold text-slate-800">Pleasanton HQ (94566)</span>
                </div>
              </div>

              {/* Shopping Cart Trigger */}
              <button 
                id="shopping-cart-trigger"
                onClick={() => setIsCartOpen(true)}
                className="relative h-11 w-11 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition shadow-sm cursor-pointer"
              >
                <ShoppingCart size={18} />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      id="cart-badge-count"
                      className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-extrabold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>

          {/* Search Input for Mobile View */}
          <div className="relative md:hidden flex items-center">
            <div className="absolute left-4 text-slate-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search groceries..." 
              className="w-full pl-11 pr-20 py-2.5 bg-slate-100 border-none rounded-full py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
              value={filters.searchQuery}
              onKeyPress={handleSearchKeyPress}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
            <button 
              onClick={() => executeBackendQuery(filters)}
              className="absolute right-1 px-4 py-1 bg-blue-600 text-white rounded-full text-xs font-bold cursor-pointer"
            >
              GO
            </button>
          </div>

        </div>
      </header>

      {/* REACTIONAL BENTO GRID CONTENT SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Refine Search Left Sidebar Filters */}
        <section className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs h-fit self-start">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
              <ListFilter size={16} className="text-blue-600" /> Refine Search
            </h2>
            <button 
              id="reset-filters-button"
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 transition font-semibold cursor-pointer"
            >
              <LockReloadIcon /> Reset
            </button>
          </div>

          {/* Department Hierarchies */}
          <div className="mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Departments</h3>
            <div className="space-y-1">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setFilters(prev => ({ ...prev, department: dept.id }))}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition font-medium text-left cursor-pointer ${
                    filters.department === dept.id 
                      ? 'bg-blue-50 text-blue-600 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{dept.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Badges Toggles Filter Block */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nutritional & Sale Options</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-600 hover:text-blue-600 transition">
                <input 
                  type="checkbox"
                  checked={filters.isOrganic}
                  onChange={(e) => setFilters(prev => ({ ...prev, isOrganic: e.target.checked }))}
                  className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Organic Ingredients Only</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-600 hover:text-blue-600 transition">
                <input 
                  type="checkbox"
                  checked={filters.isSale}
                  onChange={(e) => setFilters(prev => ({ ...prev, isSale: e.target.checked }))}
                  className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Active Store Sales</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-600 hover:text-blue-600 transition">
                <input 
                  type="checkbox"
                  checked={filters.isGlutenFree}
                  onChange={(e) => setFilters(prev => ({ ...prev, isGlutenFree: e.target.checked }))}
                  className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="flex items-center gap-1.5">
                  Gluten-Free <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 rounded-sm font-bold uppercase">GF</span>
                </span>
              </label>
            </div>
          </div>


        </section>

        {/* MAIN PRODUCT GRID COLUMN */}
        <section className="lg:col-span-9 flex flex-col gap-6">
          




          {/* RESULTS STATISTICS BAR */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl py-3 px-5 shadow-xs font-sans">
            <div>
              <h1 className="font-bold text-sm text-slate-800 uppercase tracking-wide">All Groceries</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {products.length} Items found in Pleasanton HQ
              </p>
            </div>

            {/* REST sorting option */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Sort By</span>
              <select 
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="border border-slate-200 rounded-lg p-1.5 pr-8 bg-white font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none flex items-center"
              >
                <option value="relevance">Highly Rated (Relevance)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">A-Z Alphabetical</option>
              </select>
            </div>
          </div>

          {/* ACTUAL PRODUCT CARD RENDERED GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            
            {products.map(product => (
              <article 
                key={product.id}
                className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col relative group"
              >
                {/* Badges container */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  {product.isOrganic && (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider block">
                      Organic
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-rose-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider block">
                      ★ Sale
                    </span>
                  )}
                </div>

                {/* Image Holder */}
                <div className="h-48 bg-slate-50 relative overflow-hidden border-b border-slate-100 p-2">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg group-hover:scale-103 transition duration-500"
                  />
                </div>

                {/* Metadata Content */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.brand}</span>
                    <h4 className="font-bold text-slate-900 text-[14px] leading-snug group-hover:text-blue-600 transition">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                    
                    {/* Sub-metadata line */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500 font-semibold">{product.size}</span>
                      {product.isGlutenFree && (
                        <span className="bg-amber-100 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase">GF</span>
                      )}
                    </div>

                    {/* Ratings stars */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Price and Add button section */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex flex-col">
                      {product.originalPrice ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-lg text-rose-600">${product.price.toFixed(2)}</span>
                          <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-lg text-slate-900">${product.price.toFixed(2)}</span>
                      )}
                      {product.originalPrice && (
                        <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm block w-fit mt-0.5 uppercase tracking-wide">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition shadow-sm cursor-pointer"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                </div>
              </article>
            ))}

            {/* HANDLE NOT FOUND CASE */}
            {products.length === 0 && (
              <div id="no-products-found" className="col-span-3 bg-white border border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center py-16">
                <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wide">No Groceries Found</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-md">
                  We couldn't find any products matching your search term or filters. Try reset matching query configurations.
                </p>
                
                {/* Smart Suggested Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                  <button 
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer animate-pulse"
                  >
                    <RotateCcw size={14} /> Reset All Search Filters
                  </button>
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: 'bananas', department: 'all' }))}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition cursor-pointer"
                  >
                    Search "Bananas" instead
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 font-medium font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Albertsons Case Study Assessment Portal. Built for interview evaluation in 2026.</span>
          <div className="flex items-center gap-4 text-blue-600 font-bold">
            <span className="text-slate-300">Grocery Portal</span>
          </div>
        </div>
      </footer>

      {/* FLYOUT SHOPPING CART PANEL OVERLAY DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto cursor-pointer"
            />

            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col select-none font-sans"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600">
                  <ShoppingCart size={20} />
                  <span className="font-bold text-base uppercase">My Shopping Cart</span>
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full select-none">
                    {cartItemCount}
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="h-8 w-8 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-3 border-b border-slate-50 pb-4 last:border-b-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="h-14 w-14 object-cover rounded-md border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.product.brand} - {item.product.size}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold text-xs text-blue-600">${(item.product.price * item.quantity).toFixed(2)}</span>
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded-md">
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, -1)}
                            className="p-1 text-slate-500 hover:bg-slate-50"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-600">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, 1)}
                            className="p-1 text-slate-500 hover:bg-slate-50"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {cart.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 font-sans">
                    <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                      <ShoppingBag size={24} />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm uppercase">Your Cart is Empty</h4>
                    <p className="text-xs text-slate-400 max-w-xs font-sans">Browse fresh organic products to quickly fill your bag!</p>
                  </div>
                )}
              </div>

              {/* Box checkout */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400">Subtotal Order:</span>
                  <span className="font-bold text-base text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-600 font-bold uppercase tracking-wider">
                  <span>Standard Grocery Shipping:</span>
                  <span>FREE</span>
                </div>
                <button 
                  onClick={() => {
                    alert(`Order Submitted Successfully! Total amount: $${cartTotal.toFixed(2)}`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  disabled={cart.length === 0}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Check size={14} /> Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple Helper Component placeholders
function LockReloadIcon() {
  return <RotateCcw size={12} className="shrink-0" />;
}


