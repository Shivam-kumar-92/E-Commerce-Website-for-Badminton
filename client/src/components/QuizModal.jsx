import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Zap, RotateCcw } from 'lucide-react';

export default function QuizModal({
  options,
  onClose,
  onSelectProduct
}) {
  const questions = options?.quizQuestions || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    skill_level: 'intermediate',
    court_preference: 'all_around',
    playstyle_goal: 'heavy_smash',
    weight_preference: '4u'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const currentQ = questions[currentStep];

  const handleSelectOption = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Compute recommendations
      setLoading(true);
      try {
        const res = await fetch('/api/quiz/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers)
        });
        const data = await res.json();
        setResults(data.recommendations || []);
      } catch (err) {
        console.error('Quiz recommendation error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setResults(null);
    setCurrentStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl glass-panel bg-dark-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan/20 border border-cyan/40 flex items-center justify-center text-cyan">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Racket Matchmaker Algorithm
              </h2>
              <p className="text-xs text-slate-400">
                {results ? 'Your Ideal Racket Matches' : `Step ${currentStep + 1} of ${questions.length}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-900 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (if in quiz) */}
        {!results && (
          <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan to-volt h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / (questions.length || 4)) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-volt border-t-transparent animate-spin mx-auto" />
              <h3 className="text-lg font-black text-white">Analyzing Your Swing DNA...</h3>
              <p className="text-xs text-slate-400">Matching aerodynamic frames, flex ratings, and tournament specs</p>
            </div>
          ) : results ? (
            
            /* Results View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-volt block">
                    Tailored Recommendation
                  </span>
                  <h3 className="text-xl font-black text-white">
                    Top Weapons Matching Your Playstyle
                  </h3>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 p-2 rounded-xl bg-dark-950 border border-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(({ product, matchScore, matchReasons }) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-dark-950 border border-slate-800 hover:border-volt/40 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                          {product.brand}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-volt/20 text-volt text-xs font-black border border-volt/30">
                          {matchScore}% MATCH
                        </span>
                      </div>

                      <div className="flex gap-3 items-center mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-xl border border-slate-800"
                        />
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{product.name}</h4>
                          <span className="text-xs text-slate-400 block">{product.specs?.balance}</span>
                          <span className="text-base font-black text-white font-mono mt-1 block">
                            Rs {product.price}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-300">
                        {matchReasons.map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-volt shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-volt to-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1 hover:shadow-glow-volt transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" /> Configure This Racket
                    </button>
                  </div>
                ))}
              </div>
            </div>

          ) : currentQ ? (
            
            /* Step Questions View */
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{currentQ.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{currentQ.subtitle}</p>
              </div>

              <div className="space-y-3">
                {currentQ.options.map(opt => {
                  const isSelected = answers[currentQ.id] === opt.value;

                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelectOption(currentQ.id, opt.value)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-dark-950 border-volt shadow-glow-volt text-white'
                          : 'bg-dark-950/60 border-slate-800 text-slate-300 hover:bg-dark-950 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm">{opt.label}</h4>
                        <p className="text-xs text-slate-400">{opt.desc}</p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                        isSelected ? 'border-volt bg-volt text-dark-950' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-dark-950" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Navigation Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {currentStep > 0 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                ) : <div />}

                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-volt to-cyan text-dark-950 font-black text-xs uppercase tracking-wide flex items-center gap-2 hover:shadow-glow-volt transition-all"
                >
                  <span>{currentStep === questions.length - 1 ? 'Calculate Matches' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          ) : null}

        </div>

      </div>
    </div>
  );
}
