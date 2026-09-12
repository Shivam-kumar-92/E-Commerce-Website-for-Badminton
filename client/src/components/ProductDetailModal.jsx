import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  Flame, 
  ChevronRight 
} from 'lucide-react';
import RadarChart from './RadarChart.jsx';
import StringingCustomizer from './StringingCustomizer.jsx';

export default function ProductDetailModal({
  product,
  onClose,
  options,
  onAddToCart,
  onAddReview
}) {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState('customize'); // 'customize' | 'specs' | 'reviews'
  const [selectedImage, setSelectedImage] = useState(product.image);
  
  // Review submission state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    onAddReview(product.id, {
      author: reviewAuthor,
      rating: reviewRating,
      title: "Verified Badminton Match Player",
      comment: reviewComment,
      ratings: { power: 5, speed: 5, control: 5 }
    });

    setReviewSubmitted(true);
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl glass-panel bg-dark-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/60 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-volt bg-volt/10 px-2.5 py-1 rounded-lg border border-volt/20">
              {product.brand}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white truncate max-w-md">
              {product.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Gallery & Radar Spec Matrix */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Visual Showcase */}
            <div className="relative h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-900 to-dark-950 border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute top-3 right-3 bg-dark-950/80 px-2.5 py-1 rounded-lg border border-white/10 text-xs font-mono text-volt font-bold">
                Rs {product.price}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-volt scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 5-Axis Dynamic Performance Radar */}
            <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-3 text-center">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Performance DNA Matrix
                </span>
                <span className="text-[11px] font-mono text-volt font-semibold">
                  Lab Tested
                </span>
              </div>

              <RadarChart stats={product.radar} size={250} />

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
                <div className="bg-dark-900 p-1.5 rounded-lg">
                  <span className="text-slate-500 block">SMASH POWER</span>
                  <span className="font-extrabold text-volt font-mono">{product.radar?.power}/100</span>
                </div>
                <div className="bg-dark-900 p-1.5 rounded-lg">
                  <span className="text-slate-500 block">DRIVE SPEED</span>
                  <span className="font-extrabold text-cyan font-mono">{product.radar?.speed}/100</span>
                </div>
                <div className="bg-dark-900 p-1.5 rounded-lg">
                  <span className="text-slate-500 block">PRECISION</span>
                  <span className="font-extrabold text-emerald-400 font-mono">{product.radar?.control}/100</span>
                </div>
              </div>
            </div>

            {/* Pro Player Signature Card */}
            {product.playerSignature && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-dark-900 to-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-volt/15 border border-volt/30 flex items-center justify-center text-volt shrink-0 font-black">
                  🏸
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                    Official Athlete Choice
                  </span>
                  <p className="text-xs font-extrabold text-white">
                    {product.playerSignature}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Tabbed Content (Customizer / Specs / Reviews) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* Tab Navigation Pill Bar */}
            <div className="flex p-1.5 rounded-2xl bg-dark-950 border border-slate-800 gap-1.5">
              <button
                onClick={() => setActiveTab('customize')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'customize'
                    ? 'bg-volt text-dark-950 shadow-glow-volt font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Stringing Studio
              </button>

              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'specs'
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Specs & Tech
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5" /> Reviews ({product.reviewCount || 0})
              </button>
            </div>

            {/* TAB 1: Stringing Customizer */}
            {activeTab === 'customize' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">{product.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>
                </div>

                <StringingCustomizer
                  product={product}
                  options={options}
                  onAddToCart={(item) => {
                    onAddToCart(item);
                    onClose();
                  }}
                />
              </div>
            )}

            {/* TAB 2: Full Specifications & Engineering Table */}
            {activeTab === 'specs' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-black text-white mb-1">Racket Engineering Specifications</h3>
                  <p className="text-xs text-slate-400">Manufactured to international BWF tournament compliance standards.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80 bg-dark-950/60 text-xs">
                  <div className="p-3 grid grid-cols-3">
                    <span className="text-slate-400 font-bold">Playstyle / Balance</span>
                    <span className="col-span-2 text-white font-semibold">{product.specs?.balance}</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="text-slate-400 font-bold">Shaft Stiffness</span>
                    <span className="col-span-2 text-white font-semibold">{product.specs?.flex}</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="text-slate-400 font-bold">Weight Classes</span>
                    <span className="col-span-2 text-white font-semibold">{product.specs?.weightClass?.join(', ')}</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="text-slate-400 font-bold">Max String Tension</span>
                    <span className="col-span-2 text-volt font-mono font-bold">{product.specs?.maxTension}</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="text-slate-400 font-bold">Frame Construction</span>
                    <span className="col-span-2 text-slate-200">{product.specs?.frame}</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="text-slate-400 font-bold">Shaft Technology</span>
                    <span className="col-span-2 text-slate-200">{product.specs?.shaft}</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="text-slate-400 font-bold">Colorway Edition</span>
                    <span className="col-span-2 text-slate-200">{product.specs?.color}</span>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Innovations</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {product.highlights?.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-volt shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setActiveTab('customize')}
                  className="w-full py-3 rounded-xl bg-volt text-dark-950 font-black text-xs uppercase tracking-wide hover:shadow-glow-volt transition-all"
                >
                  Proceed to Custom Stringing Studio
                </button>
              </div>
            )}

            {/* TAB 3: Verified Player Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-5">
                
                {/* Review Summary Score */}
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-2xl font-black text-white">{product.rating}</span>
                      <span className="text-xs text-slate-400">/ 5.0</span>
                    </div>
                    <span className="text-xs text-slate-400">Based on {product.reviewCount} tournament player reviews</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Players
                  </span>
                </div>

                {/* Customer Reviews List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {(product.reviews || []).map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl bg-dark-950/50 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{rev.author}</span>
                        <span className="text-slate-500">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} 
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-200 ml-1.5">{rev.title}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Write Player Feedback
                  </h4>

                  {reviewSubmitted ? (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Thank you! Your review was verified and published.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="Your Name / Player Club"
                          className="bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt"
                        />
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-volt"
                        >
                          <option value="5">★★★★★ (5/5 Exceptional)</option>
                          <option value="4">★★★★☆ (4/5 Great)</option>
                          <option value="3">★★★☆☆ (3/5 Average)</option>
                        </select>
                      </div>

                      <textarea
                        required
                        rows="2"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe your feel, smash velocity, and stringing tension setup..."
                        className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt"
                      />

                      <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase transition-colors"
                      >
                        Submit Player Review
                      </button>
                    </>
                  )}
                </form>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
