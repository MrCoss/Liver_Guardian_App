import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// --- ChartJS registration ---
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- Constants & Configuration ---
const violaPalette = {
  deepPurple: '#752092',
  orchid: '#C957BC',
  gold: '#FFC872',
  cream: '#FFE3B3'
};

const recommendationDetails = {
  1: { level: "Low Risk", color: "text-green-400", overview: "Minimal inflammation. Often reversible with lifestyle changes.", suggestions: { Dietary: "Balanced diet rich in fruits/vegetables.", Lifestyle: "Regular exercise.", Medical: "Consult doctor; monitor." } },
  2: { level: "Moderate Risk", color: "text-yellow-400", overview: "Fibrosis forming. Intervention crucial.", suggestions: { Dietary: "Liver-friendly diet; low sodium.", Lifestyle: "Avoid alcohol.", Medical: "Regular follow-ups." } },
  3: { level: "High Risk", color: "text-orange-400", overview: "Advanced scarring (cirrhosis). Intensive care needed.", suggestions: { Dietary: "Low sodium, fluid-restricted.", Lifestyle: "Prioritize rest.", Medical: "Manage complications." } },
  4: { level: "Critical Risk", color: "text-red-500", overview: "Decompensated cirrhosis. Immediate care required.", suggestions: { Dietary: "Clinical nutritional support.", Lifestyle: "Manage symptoms.", Medical: "Hospital intensive care." } }
};

// --- Styling & Assets ---
const WebFont = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&family=Poppins:wght@400;500;600&display=swap'); body { font-family: 'Poppins', sans-serif; color: ${violaPalette.cream}; } .font-exo { font-family: 'Exo 2', sans-serif; }`}</style>
);
const BackgroundStyle = () => (
  <style>{`@keyframes move-aurora {0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }} .aurora-background { background: radial-gradient(ellipse at top, transparent, #120E1E), radial-gradient(ellipse at bottom, #120E1E, transparent), linear-gradient(125deg, ${violaPalette.deepPurple}, #120E1E 40%), linear-gradient(335deg, ${violaPalette.orchid}, #120E1E 50%), radial-gradient(circle at 20% 20%, ${violaPalette.deepPurple}, #120E1E 35%), radial-gradient(circle at 80% 70%, #4c1d95, #120E1E 45%); background-size: 200% 200%; animation: move-aurora 25s ease-in-out infinite;}`}</style>
);
const Logo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke={violaPalette.gold} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M16.5 9.5L12 12M12 12L7.5 14.5M12 12V22M12 12L22 7" stroke={violaPalette.orchid} strokeWidth="1.5"/>
    <path d="M2 7L12 12L22 7" stroke={violaPalette.cream} strokeWidth="1.2" opacity="0.8"/>
  </svg>
);
const Header = () => (
    <div className="flex flex-col items-center justify-center text-center mb-8">
      <Logo />
      <h1 className="text-4xl md:text-5xl font-exo font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white mt-2">
        LiverGuardian AI
      </h1>
      <p className="text-lg text-gray-400 mt-1">Harnessing AI for Cirrhosis Stage Prediction</p>
    </div>
);


// --- Reusable components ---
const Card = React.forwardRef(({ children, className }, ref) => (
  <div ref={ref} className={`bg-[#1A132B]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg shadow-[#752092]/10 transition-all duration-300 hover:border-white/20 hover:shadow-[#C957BC]/20 ${className}`}>
    {children}
  </div>
));
const MotionCard = motion(Card);
const SkeletonCard = ({ className }) => (
  <Card className={`flex-1 ${className}`}>
    <div className="w-full h-full bg-[#752092]/20 rounded-lg animate-pulse"></div>
  </Card>
);
const FormField = ({ name, value, onChange, label, type = "text" }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm text-gray-300 mb-1.5">{label || name}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="p-2.5 rounded-md bg-[#1A132B]/80 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FFC872] transition-all duration-300"
    />
  </div>
);


// --- Main UI Components ---
const RadialProgressBar = ({ stage }) => {
  const config = useMemo(() => ({
    1: { color: "#4ade80", shadow: "0 0 15px #4ade80" },
    2: { color: "#facc15", shadow: "0 0 15px #facc15" },
    3: { color: "#fb923c", shadow: "0 0 15px #fb923c" },
    4: { color: "#f87171", shadow: "0 0 15px #f87171" },
  }[stage] || { color: "#9ca3af", shadow: "none" }), [stage]);
  const circumference = 2 * Math.PI * 56;
  const progress = stage / 4.5;
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  useEffect(() => {
    const controls = animate(count, stage, { duration: 1.5, ease: "easeInOut" });
    return controls.stop;
  }, [stage, count]);

  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center" style={{ filter: `drop-shadow(${config.shadow})` }}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="transparent" stroke="#374151" strokeWidth="8" />
        <motion.circle cx="60" cy="60" r="56" fill="transparent" stroke={config.color} strokeLinecap="round" strokeWidth="8" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span className="text-6xl font-bold" style={{ color: config.color }}>{rounded}</motion.span>
        <motion.span className="text-xl font-semibold text-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}>Stage</motion.span>
      </div>
    </div>
  );
};
const AIRecommendations = ({ stage, onDownload }) => {
  const details = recommendationDetails[stage] || recommendationDetails[3];
  return (
    <div className="text-left space-y-4 h-full flex flex-col justify-between">
      <div>
        <div className={`flex items-center gap-3 p-3 bg-opacity-10 rounded-lg mb-4 ${details.color.replace('text-', 'bg-')}`}>
          <div className={`${details.color.replace('text-', 'bg-')}/20 p-2 rounded-lg text-xl`}>⚠️</div>
          <div>
            <h3 className={`font-semibold text-lg ${details.color}`}>{details.level}</h3>
            <p className="text-sm text-gray-400">{details.overview}</p>
          </div>
        </div>
        {Object.entries(details.suggestions).map(([key, value]) => (
          <div key={key} className="flex items-start gap-3 mt-3">
            <div className="w-1.5 h-1.5 mt-2 rounded-full flex-shrink-0" style={{ backgroundColor: violaPalette.orchid }}></div>
            <div>
              <h4 className="font-semibold capitalize text-gray-200">{key}</h4>
              <p className="text-gray-400 text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onDownload} className="mt-4 w-full py-2.5 bg-[#752092]/60 hover:bg-[#752092]/90 rounded-lg font-semibold transition-colors duration-300">
        Download Report
      </button>
    </div>
  );
};
const KeyPredictiveFactorsChart = ({ factorsData }) => {
  const data = {
    labels: factorsData.labels,
    datasets: [{ data: factorsData.values, backgroundColor: `${violaPalette.gold}33`, borderColor: violaPalette.gold, pointBackgroundColor: '#fff', pointBorderColor: violaPalette.gold, pointHoverBackgroundColor: '#fff', pointHoverBorderColor: violaPalette.gold, borderWidth: 2 }]
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(26, 19, 43, 0.9)' } },
    scales: { r: { angleLines: { color: 'rgba(255,255,255,0.2)' }, grid: { color: 'rgba(255,255,255,0.2)', circular: true }, pointLabels: { font: { size: 12 }, color: violaPalette.cream }, ticks: { display: false, beginAtZero: true, max: 100, backdropColor: 'transparent' } } }
  };
  return <div className="h-64 md:h-full w-full"><Radar data={data} options={options} /></div>;
};
const BiomarkerStatus = ({ biomarkers }) => {
  const getStatus = (name, value) => {
    const thresholds = { Bilirubin: { high: 1.2 }, Albumin: { low: 3.4 }, SGOT: { high: 40 }, Platelets: { low: 150 }, Prothrombin: { high: 11.5 } };
    if (!value || !thresholds[name]) return { color: 'bg-gray-500', shadow: 'none' };
    if ((thresholds[name].high && value > thresholds[name].high) || (thresholds[name].low && value < thresholds[name].low)) return { color: 'bg-red-500', shadow: '0 0 6px #f87171' };
    return { color: 'bg-green-500', shadow: '0 0 6px #4ade80' };
  };
  const relevantBiomarkers = { Bilirubin: biomarkers.Bilirubin, Albumin: biomarkers.Albumin, SGOT: biomarkers.SGOT, Platelets: biomarkers.Platelets, Prothrombin: biomarkers.Prothrombin };

  return (
    <div className="space-y-3 pt-2">
      <h3 className="font-semibold text-lg text-white mb-2">Key Biomarker Status</h3>
      {Object.entries(relevantBiomarkers).map(([name, value]) => {
        const status = getStatus(name, parseFloat(value));
        return (
          <div key={name} className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{name}</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">{value || 'N/A'}</span>
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${status.color}`} style={{ boxShadow: status.shadow }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};


// --- App Component ---
const App = () => {
  const [formData, setFormData] = useState({
    Age: '58', Sex: 'F', Status: 'C', Drug: 'Placebo',
    Ascites: '0', Hepatomegaly: '0', Spiders: '0', Edema: '0',
    Bilirubin: '1.1', Cholesterol: '260', Albumin: '3.9', Copper: '50',
    Alk_Phos: '1700', SGOT: '120', Tryglicerides: '150', Platelets: '250', Prothrombin: '10.5'
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [keyFactorsData, setKeyFactorsData] = useState({ labels: ['Bilirubin','SGOT','Albumin','Age','Copper','Platelets'], values:[0,0,0,0,0,0] });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = useCallback((e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsLoading(true); setPredictionResult(null); setErrorMessage("");
    const payload = Object.entries(formData).reduce((acc,[key,value]) => {
      if(['Sex','Status','Drug'].includes(key)) acc[key]=value; else acc[key]=parseFloat(value)||0;
      return acc;
    }, {});
    try {
      // MOCK API RESPONSE for demonstration without a running backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      const mockStage = Math.floor(Math.random() * 4) + 1; // Random stage 1-4
      setPredictionResult({ predicted_stage: mockStage });
      // const response = await fetch('http://localhost:8080/predict', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      // if(!response.ok){ const errData=await response.json().catch(()=>({error:'Invalid server response'})); throw new Error(errData.error||`HTTP error ${response.status}`); }
      // const result = await response.json();
      // setPredictionResult({ stage: result.predicted_stage });

      setKeyFactorsData({ labels:['Bilirubin','SGOT','Albumin','Age','Copper','Platelets'],
        values:[Math.min(100,payload.Bilirubin*25),Math.min(100,payload.SGOT/2),Math.max(0,100-(payload.Albumin*20)),Math.min(100,payload.Age),Math.min(100,payload.Copper/3),Math.max(0,100-(payload.Platelets/5))] });
    } catch(error){ console.error(error); setErrorMessage(error.message||"Failed to connect to server."); }
    finally{ setIsLoading(false); }
  };

  const handleDownloadReport = () => {
    if(!predictionResult) return;
    const { predicted_stage } = predictionResult;
    const detail = recommendationDetails[predicted_stage];
    const reportContent = `LIVERGUARDIAN AI REPORT\n=========================\n\nPredicted Stage: ${predicted_stage} (${detail.level})\nOverview: ${detail.overview}\n\nRecommendations:\n- Dietary: ${detail.suggestions.Dietary}\n- Lifestyle: ${detail.suggestions.Lifestyle}\n- Medical: ${detail.suggestions.Medical}\n\nInput Data:\n${Object.entries(formData).map(([k,v])=>`- ${k}: ${v}`).join('\n')}`;
    const blob = new Blob([reportContent],{type:'text/plain'});
    const href = URL.createObjectURL(blob);
    const link=document.createElement('a'); link.href=href; link.download=`LiverGuardian_Report_${Date.now()}.txt`; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(href);
  };

  const formPanels = {
    "Patient Information": ["Age", "Sex", "Status", "Drug"],
    "Clinical Observations": ["Ascites", "Hepatomegaly", "Spiders", "Edema"],
    "Lab Results": ["Bilirubin", "Cholesterol", "Albumin", "Copper", "Alk_Phos", "SGOT", "Tryglicerides", "Platelets", "Prothrombin"]
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const renderPanels = () => {
    if (isLoading) {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      );
    }
    if (predictionResult) {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="md:col-span-2"><MotionCard><RadialProgressBar stage={predictionResult.predicted_stage}/></MotionCard></motion.div>
          <motion.div variants={itemVariants} className="flex flex-col"><MotionCard className="flex-grow"><AIRecommendations stage={predictionResult.predicted_stage} onDownload={handleDownloadReport}/></MotionCard></motion.div>
          <motion.div variants={itemVariants} className="flex flex-col"><MotionCard className="flex-grow"><BiomarkerStatus biomarkers={formData}/></MotionCard></motion.div>
          <motion.div variants={itemVariants} className="md:col-span-2"><MotionCard><KeyPredictiveFactorsChart factorsData={keyFactorsData}/></MotionCard></motion.div>
        </motion.div>
      );
    }
    return (
      <Card className="flex items-center justify-center text-center h-full">
        <div>
          <h2 className="text-2xl font-bold text-white">Awaiting Analysis</h2>
          <p className="text-gray-400 mt-2">Please fill in the patient data and click 'Predict' to view the AI-powered results.</p>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen w-full aurora-background p-4 sm:p-6 lg:p-8">
      <WebFont /><BackgroundStyle />
      <div className="max-w-7xl mx-auto">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* --- Form Section --- */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {Object.entries(formPanels).map(([title, fields]) => (
              <fieldset key={title} className="bg-[#1A132B]/50 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <legend className="px-2 font-exo text-lg font-bold text-white">{title}</legend>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {fields.map(key => <FormField key={key} name={key} value={formData[key]} onChange={handleChange} />)}
                </div>
              </fieldset>
            ))}
            <div className="col-span-full sticky bottom-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-bold text-lg text-[#1A132B] transition-all duration-300 ease-in-out disabled:opacity-50"
                style={{ background: violaPalette.gold, boxShadow: `0 0 20px ${violaPalette.gold}50` }}>
                {isLoading ? 'Analyzing...' : 'Predict Stage'}
              </button>
            </div>
          </form>
          
          {/* --- Results Section --- */}
          <div className="lg:col-span-3">
             {errorMessage && <div className="text-red-400 mb-4 p-4 bg-red-900/50 rounded-lg">{errorMessage}</div>}
             <AnimatePresence mode="wait">{renderPanels()}</AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;