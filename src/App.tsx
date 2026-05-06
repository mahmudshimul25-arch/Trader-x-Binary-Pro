import React, { useState, useEffect } from 'react';
import { Activity, Zap, ChevronDown, Check, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_PAIRS = [
  { value: 'EUR/USD', label: 'EUR/USD', type: 'Real Market' },
  { value: 'GBP/USD', label: 'GBP/USD', type: 'Real Market' },
  { value: 'USD/JPY', label: 'USD/JPY', type: 'Real Market' },
  { value: 'AUD/USD', label: 'AUD/USD', type: 'Real Market' },
  { value: 'USD/CHF', label: 'USD/CHF', type: 'Real Market' },
  { value: 'NZD/USD', label: 'NZD/USD', type: 'Real Market' },
  { value: 'USD/CAD', label: 'USD/CAD', type: 'Real Market' },
  { value: 'EUR/GBP', label: 'EUR/GBP', type: 'Real Market' },
  { value: 'EUR/JPY', label: 'EUR/JPY', type: 'Real Market' },
  { value: 'GBP/JPY', label: 'GBP/JPY', type: 'Real Market' },
  { value: 'EUR/USD (OTC)', label: 'EUR/USD (OTC)', type: 'OTC Market' },
  { value: 'GBP/USD (OTC)', label: 'GBP/USD (OTC)', type: 'OTC Market' },
  { value: 'USD/JPY (OTC)', label: 'USD/JPY (OTC)', type: 'OTC Market' },
  { value: 'AUD/USD (OTC)', label: 'AUD/USD (OTC)', type: 'OTC Market' },
  { value: 'USD/CHF (OTC)', label: 'USD/CHF (OTC)', type: 'OTC Market' },
  { value: 'NZD/USD (OTC)', label: 'NZD/USD (OTC)', type: 'OTC Market' },
  { value: 'USD/CAD (OTC)', label: 'USD/CAD (OTC)', type: 'OTC Market' },
];

const STRATEGIES = [
  { value: 'RSI + MACD', label: 'RSI + MACD' },
  { value: 'Candle Master', label: 'Candle Master' },
  { value: 'Price Action', label: 'Price Action' },
  { value: 'Bollinger Breakout', label: 'Bollinger Breakout' },
];

type AppState = 'IDLE' | 'ANALYZING' | 'READY';

const BackgroundParticles = () => {
  const [particles, setParticles] = useState<{id: number, top: string, left: string, size: number, duration: number, delay: number}[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30 z-0">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute bg-[#1AF3D6] rounded-full"
          style={{
            top: p.top, left: p.left, width: p.size, height: p.size,
            boxShadow: `0 0 ${p.size * 3}px #1AF3D6`
          }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const DummyChart = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 40;
  const width = 300;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 -5 ${width} ${height + 10}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        className="transition-all duration-300"
      />
    </svg>
  );
};

const CircularProgress = ({ progress, status, percentage, pair, signal }: { progress: number, status: string, percentage: number, pair: string, signal?: string | null }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let fillPercentage = 100;
  if (status === 'ANALYZING') fillPercentage = progress;
  if (status === 'READY') fillPercentage = 100;
  if (status === 'IDLE') fillPercentage = 0;

  const strokeDashoffset = circumference - (fillPercentage / 100) * circumference;

  let mainColor = '#1AF3D6';
  let glowClass = 'neon-text-cyan';
  let innerStroke = "rgba(26, 243, 214, 0.1)";

  if (status === 'READY') {
    if (signal === 'BUY') {
      mainColor = '#1cf354';
      glowClass = 'neon-text-green';
      innerStroke = "rgba(28, 243, 84, 0.15)";
    } else if (signal === 'SELL') {
      mainColor = '#ff4d4d';
      glowClass = 'neon-text-red';
      innerStroke = "rgba(255, 77, 77, 0.15)";
    }
  }

  return (
    <div className="relative w-48 h-48 flex items-center justify-center mx-auto my-6">
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 40px ${mainColor}15`, background: `radial-gradient(circle, ${mainColor}0A 0%, transparent 60%)` }} />

      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
         <circle
           cx="96" cy="96" r={radius}
           stroke={innerStroke}
           strokeWidth="8"
           fill="none"
           className="transition-colors duration-500"
         />
         <circle
           cx="96" cy="96" r={radius}
           stroke={mainColor}
           strokeWidth="8"
           fill="none"
           strokeDasharray={circumference}
           strokeDashoffset={strokeDashoffset}
           strokeLinecap="round"
           className="transition-all duration-300 ease-out"
           style={{ filter: `drop-shadow(0 0 6px ${mainColor}B3)` }}
         />
      </svg>

      <div className="flex flex-col items-center justify-center z-10 text-center relative mt-1">
         <AnimatePresence mode="wait">
           {status === 'IDLE' && (
             <motion.div key="idle" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center">
               <span className={`text-2xl font-bold tracking-widest text-[#1AF3D6] ${glowClass}`}>WAIT</span>
               <span className="text-xs text-gray-500 mt-1 font-mono">--%</span>
               <span className="text-[10px] text-gray-600 tracking-wider">{pair}</span>
             </motion.div>
           )}
           {status === 'ANALYZING' && (
             <motion.div key="analyzing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center">
               <span className={`text-2xl font-bold tracking-widest text-[#1AF3D6] animate-pulse ${glowClass}`}>...</span>
               <span className="text-xs text-gray-400 mt-1 font-mono">{Math.floor(progress)}%</span>
               <span className="text-[10px] text-gray-600 tracking-wider">{pair}</span>
             </motion.div>
           )}
           {status === 'READY' && (
             <motion.div key="ready" initial={{opacity:0, scale: 0.8}} animate={{opacity:1, scale: 1}} exit={{opacity:0}} className="flex flex-col items-center">
               <span className={`text-3xl font-bold ${glowClass}`} style={{ color: mainColor }}>{signal}</span>
               <span className="text-sm font-bold mt-1 font-mono" style={{ color: mainColor }}>{percentage}%</span>
               <span className="text-[10px] text-gray-500 tracking-wider">{pair}</span>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
};

const AnalysisRow = ({ label, progress, value, status, statusColor, bgColor, barColor }: any) => (
  <div className="flex items-center text-[10px] font-mono">
    <span className="w-16 text-gray-500 whitespace-nowrap">{label}</span>
    <div className="flex-1 h-1.5 bg-[#081220] rounded-full mx-2 overflow-hidden flex items-center">
      <motion.div
         initial={{ width: 0 }}
         animate={{ width: `${progress}%` }}
         transition={{ duration: 1, ease: "easeOut" }}
         className={cn(`h-full rounded-full`, barColor)}
      />
    </div>
    <div className="w-12 text-right font-bold text-gray-300">{value}</div>
    <div className={cn("ml-2 px-1.5 py-0.5 rounded text-[8px] font-bold w-10 text-center", bgColor, statusColor)}>{status}</div>
  </div>
);

const StatBox = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
  <div className="bg-[#0b1626] border border-[#1a3852] rounded-xl p-3 flex flex-col items-center justify-center text-center">
    <span className="text-[10px] text-gray-500 tracking-wider mb-1 uppercase">{label}</span>
    <span className="text-sm font-bold text-white font-mono">{value}</span>
    <span className="text-[10px] text-gray-600 mt-0.5 lowercase">{sub}</span>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [appState, setAppState] = useState<AppState>('IDLE');
  const [pair, setPair] = useState('EUR/USD');
  const [strategy, setStrategy] = useState('RSI + MACD');
  const [duration, setDuration] = useState(1);
  const [isPairOpen, setIsPairOpen] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [price, setPrice] = useState(1.1749);
  const [basePrice, setBasePrice] = useState(1.1749);
  const [progress, setProgress] = useState(0);
  const [signal, setSignal] = useState<'BUY' | 'SELL' | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [terminalText, setTerminalText] = useState('> Waiting for initiation...');
  const [chartData, setChartData] = useState([45, 48, 42, 50, 48, 55, 52, 60, 58, 65]);

  const [currentTime, setCurrentTime] = useState<string>('--:-- --');
  const [rsiVal, setRsiVal] = useState<string>('--');
  const [rsiSub, setRsiSub] = useState<string>('neutral');
  const [trendVal, setTrendVal] = useState<string>('--');

  useEffect(() => {
    // Initial time and interval
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
      setCurrentTime(strTime);
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    // Determine base price roughly based on pair
    const generateBase = () => {
      if (pair.includes('JPY')) return parseFloat((Math.random() * 40 + 120).toFixed(3)); // e.g. 150.123
      return parseFloat((Math.random() * 0.4 + 0.9).toFixed(5)); // e.g. 1.08234
    };
    const newBase = generateBase();
    setBasePrice(newBase);
    setPrice(newBase);
  }, [pair]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => {
        const volatility = pair.includes('JPY') ? 0.05 : 0.0002;
        const move = (Math.random() - 0.5) * volatility;
        const decimals = pair.includes('JPY') ? 3 : 5;
        return parseFloat((prev + move).toFixed(decimals));
      });
      // Slightly update chart when IDLE to make it look alive
      if (appState === 'IDLE' || appState === 'READY') {
         setChartData(prev => {
            const last = prev[prev.length - 1];
            const next = last + (Math.random() - 0.5) * 5;
            return [...prev.slice(1), Math.max(10, Math.min(90, next))];
         });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [appState]);

  const handleGenerate = () => {
    setAppState('ANALYZING');
    setIsPairOpen(false);
    setIsStrategyOpen(false);
    setIsDurationOpen(false);
    setProgress(0);
    setTerminalText('> Initiating connection to server...');

    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);

      if (p === 10) setTerminalText('> Fetching live candlestick data...');
      if (p === 30) setTerminalText('> Calculating RSI and MACD indicators...');
      if (p === 50) setTerminalText('> Scanning for reversal patterns...');
      if (p === 70) setTerminalText('> Cross-referencing historical data...');
      if (p === 90) setTerminalText('> Finalizing signal accuracy...');

      if (p % 5 === 0) {
         setChartData(prev => {
            const next = prev[prev.length - 1] + (Math.random() - 0.5) * 15;
            return [...prev.slice(1), Math.max(10, Math.min(100, next))];
         });
      }

      if (p >= 100) {
        clearInterval(interval);
        finishAnalysis();
      }
    }, 60); // approx 3 seconds total
  };

  const finishAnalysis = () => {
    setAppState('READY');
    const isBuy = Math.random() > 0.5;
    setSignal(isBuy ? 'BUY' : 'SELL');
    setAccuracy(Math.floor(Math.random() * 15) + 80); // 80-95%
    
    // Generate signal values
    const rsi = isBuy ? (Math.random() * 15 + 35) : (Math.random() * 15 + 50);
    setRsiVal(rsi.toFixed(1));
    setRsiSub(rsi > 60 ? 'overbought' : rsi < 40 ? 'oversold' : 'neutral');
    setTrendVal(isBuy ? 'BULLISH' : 'BEARISH');
  };

  const handleReset = () => {
    setAppState('IDLE');
    setTerminalText('> Waiting for initiation...');
  };

  const percentChange = (((price - basePrice) / basePrice) * 100).toFixed(2);
  const isPositiveChange = parseFloat(percentChange) >= 0;
  const priceDisplay = pair.includes('JPY') ? price.toFixed(3) : price.toFixed(5);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'traderx09') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Access Denied. Invalid Credentials.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 relative font-sans">
        <BackgroundParticles />
        <div className="w-full max-w-[360px] z-10 glass-panel rounded-3xl border border-[#1a3852] p-8 flex flex-col items-center relative overflow-hidden shadow-[0_0_50px_rgba(26,243,214,0.05),inset_0_0_20px_rgba(26,243,214,0.02)]">
          
          <div className="w-16 h-16 rounded-2xl bg-[#0b1626] border border-[#1a3852] flex items-center justify-center mb-6 shadow-[#1AF3D6]/20 shadow-[0_0_20px_rgba(26,243,214,0.2)]">
            <Lock className="text-[#1AF3D6] w-8 h-8" />
          </div>

          <h2 className="text-white text-xl font-bold tracking-widest mb-1">SECURE ACCESS</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-8 text-center">Authentication Required</p>
          
          <form onSubmit={handleLogin} className="w-full relative z-20">
            <div className="relative">
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="ENTER PASSWORD"
                className={cn(
                  "w-full bg-[#0b1626] border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#1AF3D6] text-center tracking-widest font-mono transition-colors shadow-inner",
                  authError ? "border-red-500/50" : "border-[#1a3852]"
                )}
              />
            </div>
            {authError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[9px] mt-3 text-center uppercase tracking-widest font-bold bg-red-500/10 py-1.5 rounded-lg border border-red-500/20"
              >
                {authError}
              </motion.p>
            )}
            
            <button 
              type="submit" 
              className="w-full mt-6 py-4 rounded-xl gradient-btn font-bold tracking-widest text-[#030a14] text-xs flex justify-center items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(26,243,214,0.4)]"
            >
              UNLOCK TERMINAL <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-[#1a3852]/50 w-full text-center">
            <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest flex items-center justify-center gap-1">
              developer by <a href="https://t.me/traderx009" target="_blank" rel="noopener noreferrer" className="text-[#1AF3D6] hover:text-white transition-colors font-bold">@traderx009</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center sm:p-4 relative font-sans">
      <BackgroundParticles />
      
      <div className="w-full sm:max-w-[400px] h-[100dvh] sm:h-[820px] sm:max-h-[calc(100vh-2rem)] z-10 glass-panel rounded-none sm:rounded-[2.5rem] border-0 sm:border border-[#1a3852] relative overflow-y-auto overflow-x-hidden flex flex-col p-5 sm:p-6 mx-auto sm:shadow-[0_0_50px_rgba(26,243,214,0.05),inset_0_0_20px_rgba(26,243,214,0.02)] custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center flex-shrink-0">
              <Activity size={20} className="text-[#030a14]" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">TRADER X BINARY PRO</h1>
              <p className="text-[8px] text-[#1AF3D6]/70 uppercase tracking-widest mt-0.5">ADVANCED SIGNAL ENGINE</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-green-500/30 bg-green-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-green-500 font-bold tracking-wider">LIVE</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mt-8 relative z-20">
          <div className="relative">
            <label className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 block">Currency Pair</label>
            <div 
              onClick={() => { setIsPairOpen(!isPairOpen); setIsStrategyOpen(false); }}
              className={cn(
                "bg-[#0b1626] border rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors",
                isPairOpen ? 'border-[#1AF3D6]' : 'border-[#1a3852] hover:border-[#1AF3D6]/50'
              )}
            >
              <span className="text-[13px] font-medium text-gray-300 truncate pr-2">{pair}</span>
              <ChevronDown size={14} className={cn("text-gray-500 transition-transform flex-shrink-0", isPairOpen && "rotate-180 text-[#1AF3D6]")} />
            </div>
            <AnimatePresence>
              {isPairOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[100%] mt-2 left-0 w-[180px] sm:w-[220px] bg-[#0b1626] border border-[#1a3852] rounded-xl shadow-[0_10px_40px_rgba(3,10,20,0.8)] overflow-hidden z-50 flex flex-col max-h-[250px]"
                >
                  <div className="overflow-y-auto custom-scrollbar">
                    {['Real Market', 'OTC Market'].map(type => (
                      <div key={type} className="py-2">
                        <div className="px-3 mb-1 text-[9px] uppercase tracking-widest text-[#1AF3D6]/70 font-bold">
                          {type}
                        </div>
                        {CURRENCY_PAIRS.filter(p => p.type === type).map(p => (
                          <div
                            key={p.value}
                            onClick={() => { setPair(p.value); setIsPairOpen(false); }}
                            className="px-3 py-2 text-xs text-gray-300 hover:bg-[#1AF3D6]/10 hover:text-white cursor-pointer flex justify-between items-center transition-colors"
                          >
                            <span>{p.label}</span>
                            {pair === p.value && <Check size={12} className="text-[#1cf354]" />}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <label className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 block">Strategy</label>
            <div 
              onClick={() => { setIsStrategyOpen(!isStrategyOpen); setIsPairOpen(false); }}
              className={cn(
                "bg-[#0b1626] border rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors",
                isStrategyOpen ? 'border-[#1AF3D6]' : 'border-[#1a3852] hover:border-[#1AF3D6]/50'
              )}
            >
              <span className="text-[13px] font-medium text-gray-300 truncate pr-2">{strategy}</span>
              <ChevronDown size={14} className={cn("text-gray-500 transition-transform flex-shrink-0", isStrategyOpen && "rotate-180 text-[#1AF3D6]")} />
            </div>
            <AnimatePresence>
              {isStrategyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[100%] mt-2 left-0 sm:right-0 w-[180px] sm:w-[220px] bg-[#0b1626] border border-[#1a3852] rounded-xl shadow-[0_10px_40px_rgba(3,10,20,0.8)] overflow-hidden z-50 flex flex-col"
                >
                  <div className="py-1">
                    {STRATEGIES.map(s => (
                      <div
                        key={s.value}
                        onClick={() => { setStrategy(s.value); setIsStrategyOpen(false); }}
                        className="px-3 py-2 text-xs text-gray-300 hover:bg-[#1AF3D6]/10 hover:text-white cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <span className="truncate">{s.label}</span>
                        {strategy === s.value && <Check size={12} className="text-[#1cf354] flex-shrink-0 ml-2" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Price Display */}
        <div className="mt-4 bg-[#0b1626] border border-[#1a3852] rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1AF3D6] opacity-5 blur-[50px] rounded-full"></div>
          <div className="relative z-10">
            <div className="text-[10px] text-[#1AF3D6] uppercase tracking-widest font-semibold neon-text-cyan flex items-center gap-1">
              {pair}
            </div>
            <div className="text-3xl font-bold text-white font-mono mt-0.5 tracking-tight">{priceDisplay}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5 relative z-10">
            <div className={cn(
              "text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-mono font-bold tracking-wider border",
              isPositiveChange ? "bg-green-500/20 text-green-400 border-green-500/10" : "bg-red-500/20 text-red-400 border-red-500/10"
            )}>
              <span className={cn("w-1 h-1 rounded-full", isPositiveChange ? "bg-green-400" : "bg-red-400")}></span>
              {isPositiveChange ? '+' : ''}{percentChange}%
            </div>
            <div className="text-[9px] text-gray-500 font-mono uppercase">{currentTime}</div>
          </div>
        </div>

        {/* Dynamic Center Area */}
        <div className="flex-1 flex flex-col justify-center min-h-[360px]">
          <CircularProgress progress={progress} status={appState} percentage={accuracy} pair={pair} signal={signal} />

          <AnimatePresence mode="wait">
            {appState === 'ANALYZING' ? (
              <motion.div
                 key="analysis"
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 transition={{ duration: 0.3 }}
                 className="overflow-hidden mb-4"
              >
                <div className="bg-[#0b1626] border border-[#1a3852] rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 mb-4">
                    <Zap size={12} className="text-[#1AF3D6] fill-current" />
                    <h3 className="text-[9px] font-bold text-[#1AF3D6] uppercase tracking-widest">Live Market Analysis</h3>
                  </div>
                  <div className="space-y-3">
                    <AnalysisRow label="RSI (14)" progress={Math.min(100, progress * 1.5)} value={Math.floor(progress * 0.6)} status="OK" statusColor="text-[#1cf354]" bgColor="bg-[#1cf354]/10" barColor="bg-[#2D9CDB] shadow-[0_0_8px_#2D9CDB]" />
                    <AnalysisRow label="MACD" progress={Math.min(100, progress * 1.2)} value={(progress * 0.00004).toFixed(4)} status="SCAN" statusColor="text-[#1cf354]" bgColor="bg-[#1cf354]/10" barColor="bg-[#9b51e0] shadow-[0_0_8px_#9b51e0]" />
                    <AnalysisRow label="EMA (20)" progress={Math.min(100, progress * 1.8)} value={Math.floor(progress * 0.69)} status="SCAN" statusColor="text-[#1cf354]" bgColor="bg-[#1cf354]/10" barColor="bg-[#F2994A] shadow-[0_0_8px_#F2994A]" />
                    <AnalysisRow label="TREND" progress={Math.min(100, progress * 0.9)} value="--" status="SCAN" statusColor="text-[#F2C94C]" bgColor="bg-[#F2C94C]/10" barColor="bg-[#1AF3D6] shadow-[0_0_8px_#1AF3D6]" />
                    <AnalysisRow label="SIGNAL" progress={Math.min(100, progress * 0.5)} value="--" status="SCAN" statusColor="text-[#F2C94C]" bgColor="bg-[#F2C94C]/10" barColor="bg-[#1AF3D6] shadow-[0_0_8px_#1AF3D6]" />
                  </div>
                  <div className="mt-4 text-[9px] font-mono text-gray-400 border-t border-[#1a3852] pt-3 flex">
                    <span className="text-[#1AF3D6] mr-2">{">"}</span> 
                    {terminalText} 
                    <span className="inline-block w-1.5 h-3 bg-[#1AF3D6] ml-1 animate-pulse"></span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                 key="stats"
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 transition={{ duration: 0.3 }}
                 style={{ overflow: isDurationOpen ? 'visible' : 'hidden' }}
                 className="mb-4 grid grid-cols-3 gap-3"
              >
                 <StatBox label="RSI" value={appState === 'READY' ? rsiVal : '--'} sub={appState === 'READY' ? rsiSub : 'neutral'} />
                 <StatBox label="TREND" value={appState === 'READY' ? trendVal : '--'} sub={appState === 'READY' ? strategy.toLowerCase() : '--'} />
                 
                 <div className="relative">
                   <div onClick={() => setIsDurationOpen(!isDurationOpen)} className={cn("bg-[#0b1626] border rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-full", isDurationOpen ? 'border-[#1AF3D6]' : 'border-[#1a3852] hover:border-[#1AF3D6]/50')}>
                     <span className="text-[10px] text-gray-500 tracking-wider mb-1 uppercase">DURATION</span>
                     <span className="text-sm font-bold text-white font-mono flex items-center justify-center gap-1 w-full">{duration}m <ChevronDown size={12} className={cn("text-gray-500 transition-transform", isDurationOpen && "rotate-180 text-[#1AF3D6]")} /></span>
                     <span className="text-[10px] text-gray-600 mt-0.5 lowercase">{currentTime}</span>
                   </div>
                   <AnimatePresence>
                     {isDurationOpen && (
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[120%] bg-[#0b1626] border border-[#1a3852] rounded-xl shadow-[0_10px_40px_rgba(3,10,20,0.8)] overflow-hidden z-50 flex flex-col"
                       >
                         {[1, 2, 3, 4, 5].map(m => (
                           <div
                             key={m}
                             onClick={() => { setDuration(m); setIsDurationOpen(false); }}
                             className="px-3 py-2 text-[13px] text-gray-300 hover:bg-[#1AF3D6]/10 hover:text-white cursor-pointer flex justify-center items-center transition-colors font-mono"
                           >
                             {m}m
                           </div>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Chart Area */}
          <div className="bg-[#0b1626] border border-[#1a3852] rounded-2xl p-4 h-20 relative overflow-hidden flex items-end mt-4">
             {/* grid lines */}
             <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
               <div className="border-t border-[#1AF3D6] w-full"></div>
               <div className="border-t border-[#1AF3D6] w-full"></div>
               <div className="border-t border-[#1AF3D6] w-full"></div>
             </div>
             <DummyChart data={chartData} color={appState === 'READY' ? (signal === 'BUY' ? '#1cf354' : '#ff4d4d') : '#1AF3D6'} />
          </div>

          {/* Signal Subtext */}
          <div className="text-center mt-3 h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {appState === 'READY' ? (
                 <motion.div key="ready-text" initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:5}} className={cn("flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border", signal === 'BUY' ? "text-[#1cf354] bg-[#1cf354]/10 border-[#1cf354]/30" : "text-[#ff4d4d] bg-[#ff4d4d]/10 border-[#ff4d4d]/30")}>
                   {signal} SIGNAL <span className={cn("w-1 h-1 rounded-full animate-pulse", signal === 'BUY' ? "bg-[#1cf354]" : "bg-[#ff4d4d]")}></span> {currentTime}
                 </motion.div>
              ) : appState === 'IDLE' ? (
                 <motion.span key="idle-text" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">No signals yet</motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-auto">
          {appState === 'READY' ? (
            <button
              onClick={handleReset}
              className={cn(
                "w-full mt-2 py-4 rounded-xl font-bold tracking-widest text-xs transition-all duration-300 flex justify-center items-center gap-2 border shadow-lg hover:brightness-110",
                signal === 'BUY' 
                  ? "bg-[#00171d] text-[#1cf354] border-[#1cf354]/50 shadow-[#1cf354]/10 hover:bg-[#002f2a]"
                  : "bg-[#1d0000] text-[#ff4d4d] border-[#ff4d4d]/50 shadow-[#ff4d4d]/10 hover:bg-[#2f0000]"
              )}
            >
              Checking trend...
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={appState === 'ANALYZING'}
              className={cn(
                "w-full mt-2 py-4 rounded-xl font-bold tracking-widest text-xs transition-all duration-300 flex justify-center items-center gap-2",
                appState === 'IDLE' 
                  ? 'gradient-btn text-[#030a14]' 
                  : 'bg-[#002f3a] text-[#1AF3D6] border border-[#1AF3D6]/30'
              )}
            >
              {appState === 'IDLE' && <><Zap size={14} className="text-[#FF9D00] fill-current" /> GENERATE SIGNAL</>}
              {appState === 'ANALYZING' && 'Processing data...'}
            </button>
          )}

          <div className="flex justify-between items-center mt-4 text-[9px] text-gray-600 font-mono px-1">
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1AF3D6]/50"></div>
              powered by <a href="https://t.me/traderx009" target="_blank" rel="noopener noreferrer" className="text-[#1AF3D6] hover:text-white transition-colors">@traderx009</a>
            </div>
            <div className="tracking-wider">
              {appState === 'IDLE' && 'Ready'}
              {appState === 'ANALYZING' && 'Analyzing...'}
              {appState === 'READY' && 'Signal ready'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
