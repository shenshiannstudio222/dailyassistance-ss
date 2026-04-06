import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Calendar, 
  ChevronRight, 
  Brain, 
  Target, 
  Settings as SettingsIcon,
  PlusCircle,
  History,
  BarChart2,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Award
} from 'lucide-react';
import { CaseStudy, Decision, Critique, UserProgress, Difficulty } from './types';
import { MOCK_CASES, DOMAINS } from './constants';
import { generateCritique, generateNewCase } from './services/aiService';

// --- Components ---

const ProgressBar = ({ score, label }: { score: number, label: string }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium text-slate-600">{label}</span>
      <span className="text-blue-600 font-bold">{score}/10</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        className="h-full bg-blue-500"
      />
    </div>
  </div>
);

const Dashboard = ({ progress, onStartCase, onViewHistory }: { progress: UserProgress, onStartCase: () => void, onViewHistory: (id: string) => void }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 text-orange-500 mb-2">
          <Flame size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Streak</span>
        </div>
        <div className="text-3xl font-bold">{progress.streak} Days</div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 text-blue-500 mb-2">
          <Target size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Total</span>
        </div>
        <div className="text-3xl font-bold">{progress.totalCasesCompleted} Cases</div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 text-emerald-500 mb-2">
          <Trophy size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Avg Score</span>
        </div>
        <div className="text-3xl font-bold">
          {progress.history.length > 0 
            ? (progress.history.reduce((acc, h) => acc + h.score, 0) / progress.history.length).toFixed(1)
            : '0.0'}
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 text-purple-500 mb-2">
          <Calendar size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Next Case</span>
        </div>
        <div className="text-sm font-medium text-slate-500">Available Now</div>
      </div>
    </div>

    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-4">Ready for today's challenge?</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Sharpen your strategic edge with a new case study. 15 minutes to better decisions.
        </p>
        <button 
          onClick={onStartCase}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 group"
        >
          Start Daily Case
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <History size={24} className="text-slate-400" />
          Recent History
        </h3>
        <div className="space-y-4">
          {progress.history.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
              No cases completed yet. Start your first challenge!
            </div>
          ) : (
            progress.history.slice().reverse().slice(0, 5).map((item) => (
              <button 
                key={item.id}
                onClick={() => onViewHistory(item.id)}
                className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all flex items-center justify-between group text-left"
              >
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{item.caseStudy.domain}</div>
                  <h4 className="font-bold text-slate-900">{item.caseStudy.title}</h4>
                  <div className="text-sm text-slate-400 mt-1">{item.date}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900">{item.score.toFixed(1)}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart2 size={24} className="text-slate-400" />
          Domain Mastery
        </h3>
        <div className="space-y-4">
          {DOMAINS.map(domain => (
            <div key={domain} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <ProgressBar label={domain} score={progress.domainMastery[domain] || 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CaseView = ({ caseStudy, onBack }: { caseStudy: CaseStudy, onBack: () => void }) => (
  <div className="space-y-8">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
      <ArrowLeft size={20} />
      Back to Dashboard
    </button>

    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
          {caseStudy.domain}
        </span>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
          {caseStudy.difficulty}
        </span>
      </div>
      <h1 className="text-4xl font-bold mb-2">{caseStudy.title}</h1>
      <p className="text-slate-500 text-lg mb-8">Company: <span className="text-slate-900 font-medium">{caseStudy.company}</span></p>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">The Situation</h3>
            <p className="text-slate-700 leading-relaxed">{caseStudy.situation}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">The Problem</h3>
            <p className="text-slate-700 leading-relaxed font-medium">{caseStudy.problem}</p>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BarChart2 size={16} />
            Partial Data
          </h3>
          <p className="text-slate-700 whitespace-pre-line leading-relaxed italic">
            "{caseStudy.partialData}"
          </p>
        </div>
      </div>
    </div>
  </div>
);

const DecisionForm = ({ onSubmit }: { onSubmit: (decision: Decision) => void }) => {
  const [decision, setDecision] = useState<Decision>({
    problemDefinition: '',
    metric: '',
    rootCauses: '',
    hypotheses: '',
    action: ''
  });

  const questions = [
    { key: 'problemDefinition', label: '1. Problem Definition', placeholder: 'What is the core strategic issue here?' },
    { key: 'metric', label: '2. Key Metric', placeholder: 'What single metric defines success for this decision?' },
    { key: 'rootCauses', label: '3. Root Causes', placeholder: 'Why is this happening? (Use 5 Whys)' },
    { key: 'hypotheses', label: '4. Hypotheses', placeholder: 'What are 2-3 potential solutions?' },
    { key: 'action', label: '5. Recommended Action', placeholder: 'What is your final recommendation and first step?' }
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
      <h2 className="text-2xl font-bold mb-4">Your Strategic Decision</h2>
      <div className="space-y-6">
        {questions.map(q => (
          <div key={q.key}>
            <label className="block text-sm font-bold text-slate-700 mb-2">{q.label}</label>
            <textarea 
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[100px]"
              placeholder={q.placeholder}
              value={(decision as any)[q.key]}
              onChange={(e) => setDecision({ ...decision, [q.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <button 
        onClick={() => onSubmit(decision)}
        disabled={Object.values(decision).some(v => !v)}
        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold transition-all"
      >
        Submit for AI Critique
      </button>
    </div>
  );
};

const CritiqueView = ({ critique, onDone, isHistory = false }: { critique: Critique, onDone: () => void, isHistory?: boolean }) => (
  <div className="space-y-8">
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">{isHistory ? 'Historical Critique' : 'AI Critique'}</h2>
        <div className="text-center">
          <div className="text-4xl font-black text-blue-600">{critique.overallScore.toFixed(1)}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Score</div>
        </div>
      </div>

      {/* Correctness Analysis Section */}
      {critique.correctnessAnalysis && (
        <div className={`p-6 rounded-2xl mb-8 border ${critique.correctnessAnalysis.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-center gap-3 mb-4">
            {critique.correctnessAnalysis.isCorrect ? (
              <CheckCircle2 className="text-emerald-600" size={24} />
            ) : (
              <AlertCircle className="text-amber-600" size={24} />
            )}
            <h3 className={`text-lg font-bold ${critique.correctnessAnalysis.isCorrect ? 'text-emerald-900' : 'text-amber-900'}`}>
              {critique.correctnessAnalysis.isCorrect ? 'Strategically Sound' : 'Strategic Guidance Needed'}
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Analysis</h4>
              <p className="text-slate-700 leading-relaxed">{critique.correctnessAnalysis.explanation}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Suggestions & Guidance</h4>
              <p className="text-slate-700 leading-relaxed">{critique.correctnessAnalysis.suggestions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mastery Impact Section */}
      {critique.masteryImpact && (
        <div className="bg-white p-6 rounded-2xl mb-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="text-purple-600" size={20} />
            Mastery Impact
          </h3>
          <div className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              <span className="font-bold text-purple-600">{critique.masteryImpact.domain}:</span> {critique.masteryImpact.impactDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Frameworks Applied</h4>
                <div className="flex flex-wrap gap-2">
                  {critique.masteryImpact.frameworksUsed.map(f => (
                    <span key={f} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider border border-slate-200">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills Developed</h4>
                <div className="flex flex-wrap gap-2">
                  {critique.masteryImpact.skillsDeveloped.map(s => (
                    <span key={s} className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md uppercase tracking-wider border border-purple-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <ProgressBar label="Structural Integrity" score={critique.structural.score} />
          <p className="text-sm text-slate-600 italic">"{critique.structural.feedback}"</p>
          
          <ProgressBar label="Evidence & Logic" score={critique.evidence.score} />
          <p className="text-sm text-slate-600 italic">"{critique.evidence.feedback}"</p>
          
          <ProgressBar label="Bias Awareness" score={critique.bias.score} />
          <p className="text-sm text-slate-600 italic">"{critique.bias.feedback}"</p>
        </div>
        <div className="space-y-6">
          <ProgressBar label="Strategic Alignment" score={critique.strategic.score} />
          <p className="text-sm text-slate-600 italic">"{critique.strategic.feedback}"</p>
          
          <ProgressBar label="Implementation Clarity" score={critique.implementation.score} />
          <p className="text-sm text-slate-600 italic">"{critique.implementation.feedback}"</p>
        </div>
      </div>

      <div className="bg-blue-900 text-white p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Brain size={16} />
            The Top 1% Perspective
          </h3>
          <p className="text-lg leading-relaxed font-medium">
            {critique.topOnePercent}
          </p>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-10 -mr-10" />
      </div>
    </div>

    <button 
      onClick={onDone}
      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all"
    >
      {isHistory ? 'Back to Dashboard' : 'Complete Session'}
    </button>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'case' | 'critique' | 'history'>('dashboard');
  const [currentCase, setCurrentCase] = useState<CaseStudy | null>(null);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [critique, setCritique] = useState<Critique | null>(null);
  const [historyItem, setHistoryItem] = useState<{caseStudy: CaseStudy, decision: Decision, critique: Critique} | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({
    streak: 0,
    lastCompletedDate: null,
    totalCasesCompleted: 0,
    domainMastery: {},
    history: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('strategy_agent_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration for old history format if needed
        if (parsed.history && parsed.history.length > 0 && !parsed.history[0].caseStudy) {
          parsed.history = []; // Reset if old format to avoid crashes
        }
        setProgress(parsed);
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('strategy_agent_progress', JSON.stringify(newProgress));
  };

  const handleStartCase = async () => {
    setLoading(true);
    try {
      const randomDomain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
      const newCase = await generateNewCase(randomDomain, 'Intermediate');
      setCurrentCase(newCase);
    } catch (e) {
      setCurrentCase(MOCK_CASES[Math.floor(Math.random() * MOCK_CASES.length)]);
    }
    setLoading(false);
    setView('case');
  };

  const handleSubmitDecision = async (decision: Decision) => {
    if (!currentCase) return;
    setLoading(true);
    setCurrentDecision(decision);
    const result = await generateCritique(currentCase, decision);
    setCritique(result);
    setLoading(false);
    setView('critique');
  };

  const handleComplete = () => {
    if (!critique || !currentCase || !currentDecision) return;

    const today = new Date().toISOString().split('T')[0];
    const isConsecutive = progress.lastCompletedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const newProgress: UserProgress = {
      ...progress,
      streak: isConsecutive ? progress.streak + 1 : (progress.lastCompletedDate === today ? progress.streak : 1),
      lastCompletedDate: today,
      totalCasesCompleted: progress.totalCasesCompleted + 1,
      domainMastery: {
        ...progress.domainMastery,
        [currentCase.domain]: Math.min(10, (progress.domainMastery[currentCase.domain] || 0) + 0.5)
      },
      history: [
        ...progress.history,
        { 
          id: Math.random().toString(36).substr(2, 9),
          caseStudy: currentCase,
          decision: currentDecision,
          critique: critique,
          date: today, 
          score: critique.overallScore 
        }
      ]
    };

    saveProgress(newProgress);
    setView('dashboard');
    setCurrentCase(null);
    setCurrentDecision(null);
    setCritique(null);
  };

  const handleViewHistory = (id: string) => {
    const item = progress.history.find(h => h.id === id);
    if (item) {
      setHistoryItem({
        caseStudy: item.caseStudy,
        decision: item.decision,
        critique: item.critique
      });
      setView('history');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic">
              DS
            </div>
            <span className="font-bold text-xl tracking-tight">Daily Strategy Agent</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-900 transition-colors">
              <SettingsIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 space-y-4"
            >
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="text-slate-500 font-medium">AI is crafting your challenge...</p>
            </motion.div>
          ) : view === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Dashboard progress={progress} onStartCase={handleStartCase} onViewHistory={handleViewHistory} />
            </motion.div>
          ) : view === 'case' && currentCase ? (
            <motion.div 
              key="case"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <CaseView caseStudy={currentCase} onBack={() => setView('dashboard')} />
              <DecisionForm onSubmit={handleSubmitDecision} />
            </motion.div>
          ) : view === 'critique' && critique ? (
            <motion.div 
              key="critique"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CritiqueView critique={critique} onDone={handleComplete} />
            </motion.div>
          ) : view === 'history' && historyItem ? (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
              <CaseView caseStudy={historyItem.caseStudy} onBack={() => setView('dashboard')} />
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold">Your Submitted Decision</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Problem Definition', value: historyItem.decision.problemDefinition },
                    { label: 'Key Metric', value: historyItem.decision.metric },
                    { label: 'Root Causes', value: historyItem.decision.rootCauses },
                    { label: 'Hypotheses', value: historyItem.decision.hypotheses },
                    { label: 'Recommended Action', value: historyItem.decision.action },
                  ].map(d => (
                    <div key={d.label}>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{d.label}</h4>
                      <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <CritiqueView critique={historyItem.critique} onDone={() => setView('dashboard')} isHistory />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
