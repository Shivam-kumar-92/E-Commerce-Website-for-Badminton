import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  ArrowUpRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AdminDashboard({
  isOpen,
  onClose,
  onProductChanged
}) {
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'add'
  const [loading, setLoading] = useState(false);

  // New product state
  const [newProd, setNewProd] = useState({
    name: '',
    brand: 'Yonex',
    series: 'Pro Series',
    tagline: 'High Performance Tournament Racket',
    price: 199.99,
    originalPrice: 229.99,
    stock: 15,
    specs: {
      playstyle: 'Head Heavy',
      playstyleCategory: 'power',
      balance: 'Head Heavy (300mm)',
      flex: 'Stiff',
      weightClass: ['4U (83g)'],
      gripSize: ['G5'],
      maxTension: '28 lbs',
      frame: 'HM Carbon Graphite',
      shaft: 'Slim Carbon Shaft',
      color: 'Obsidian / Volt'
    },
    radar: {
      power: 92,
      speed: 85,
      control: 90,
      durability: 88,
      forgiveness: 82
    },
    description: 'Engineered for tournament competitors needing balanced power and swift recoveries.',
    highlights: ['Aerodynamic frame design', 'Reinforced T-Joint', 'High tension string bed support']
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [metRes, prodRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/products')
      ]);
      const metData = await metRes.json();
      const prodData = await prodRes.json();
      setMetrics(metData);
      setProducts(prodData.products || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  const handleUpdateStock = async (id, newStock) => {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: Number(newStock) })
      });
      fetchAdminData();
      if (onProductChanged) onProductChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this racket from inventory?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchAdminData();
      if (onProductChanged) onProductChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      alert('New tournament racket added successfully!');
      setActiveTab('inventory');
      fetchAdminData();
      if (onProductChanged) onProductChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdvanceOrderStatus = async (orderId, stepIndex) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepIndex })
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-5xl glass-panel bg-dark-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/70">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-volt" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                SMASHPRO HQ Management Portal
              </h2>
              <p className="text-xs text-slate-400">Inventory control, order fulfillment, and metrics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-dark-900 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics KPI Cards */}
        {metrics && (
          <div className="p-6 pb-2 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-volt" /> Total Revenue
              </span>
              <p className="text-xl font-black text-white font-mono">${metrics.revenue?.toFixed(2)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-cyan" /> Total Orders
              </span>
              <p className="text-xl font-black text-white font-mono">{metrics.totalOrders}</p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-emerald-400" /> Active Rackets
              </span>
              <p className="text-xl font-black text-white font-mono">{metrics.totalProducts}</p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Low Stock Alerts
              </span>
              <p className="text-xl font-black text-amber-400 font-mono">{metrics.lowStockCount}</p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="px-6 pt-2 flex gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
              activeTab === 'inventory' ? 'border-volt text-volt' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
              activeTab === 'orders' ? 'border-volt text-volt' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Orders & Stringing Queue ({metrics?.recentOrders?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
              activeTab === 'add' ? 'border-volt text-volt' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            + Add New Racket
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: Inventory Table */}
          {activeTab === 'inventory' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800">
                  <thead className="bg-dark-950 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Racket Model</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3">Playstyle</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-dark-950/60 transition-colors">
                        <td className="p-3 font-sans font-bold text-white flex items-center gap-2">
                          <img src={prod.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <span className="truncate max-w-xs">{prod.name}</span>
                        </td>
                        <td className="p-3 font-sans font-semibold text-volt">{prod.brand}</td>
                        <td className="p-3 font-sans text-slate-400">{prod.specs?.balance}</td>
                        <td className="p-3 text-white font-bold">${prod.price}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            defaultValue={prod.stock}
                            onBlur={(e) => handleUpdateStock(prod.id, e.target.value)}
                            className="w-16 bg-dark-950 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-volt"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-crimson hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Orders & Stringing Queue */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {(metrics?.recentOrders || []).map(ord => (
                <div key={ord.id} className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <span className="font-mono font-bold text-volt text-sm">{ord.id}</span>
                      <span className="text-slate-400 ml-2 font-semibold">{ord.customer?.name} ({ord.customer?.email})</span>
                    </div>
                    <span className="font-mono font-black text-white text-sm">${ord.total?.toFixed(2)}</span>
                  </div>

                  <div className="space-y-1 text-slate-300">
                    {ord.items?.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span>🏸 {it.productName} ({it.string ? `${it.string.name} @ ${it.string.tension} LBS` : 'Unstrung'})</span>
                        <span className="font-mono">${((it.itemTotal || it.basePrice) * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stepper Status Changer Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-400 text-[11px]">Advance Workshop Step:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ord.statusSteps?.map((st, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleAdvanceOrderStatus(ord.id, sIdx)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            st.done 
                              ? 'bg-volt/20 text-volt border border-volt/30' 
                              : 'bg-dark-900 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {st.done ? '✓ ' : ''}{st.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Add New Racket Form */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddProductSubmit} className="space-y-4 max-w-2xl mx-auto text-xs">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Add New Tournament Racket to Catalog
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Racket Model Name</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Victor Thruster F Enhanced"
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Brand Manufacturer</label>
                  <select
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  >
                    <option value="Yonex">Yonex</option>
                    <option value="Victor">Victor</option>
                    <option value="Li-Ning">Li-Ning</option>
                    <option value="Mizuno">Mizuno</option>
                    <option value="Apacs">Apacs</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Retail Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-volt"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Initial Stock Units</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: parseInt(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-volt"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1 font-semibold">Tagline / Key Selling Point</label>
                  <input
                    type="text"
                    required
                    value={newProd.tagline}
                    onChange={(e) => setNewProd({ ...newProd, tagline: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-volt text-dark-950 font-black text-xs uppercase hover:shadow-glow-volt transition-all"
              >
                Save and Publish Racket
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
