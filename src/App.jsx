import React, { useState, useCallback } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- ICONS (SVG components remain unchanged but could be moved to a separate file) ---
const LogoIcon = () => ( <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400"><path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.5 9.5C15.5 12.1667 13.0833 14.5 10 14.5C6.91667 14.5 4.5 12.1667 4.5 9.5C4.5 6.83333 6.91667 4.5 10 4.5C13.0833 4.5 15.5 6.83333 15.5 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const LinkedInIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors duration-300"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> );
const GitHubIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors duration-300"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> );

// --- HELPER COMPONENTS ---

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 max-w-2xl w-full m-4 text-center transform transition-all duration-300 ease-in-out animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <h2 className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">About This Project</h2>
                <p className="text-lg leading-relaxed text-gray-300 mb-6">
                    This application leverages machine learning to provide early-stage predictions for liver cirrhosis, empowering users with actionable health insights.
                </p>
                <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold text-white">Costas Pinto</h3>
                    <p className="text-gray-400">AI & Machine Learning Enthusiast</p>
                    <div className="flex justify-center items-center gap-6 mt-4">
                        <a href="https://www.linkedin.com/in/costaspinto/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"><LinkedInIcon /> LinkedIn</a>
                        <a href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"><GitHubIcon /> GitHub</a>
                    </div>
                </div>
                <button onClick={onClose} className="mt-8 py-2 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95">Close</button>
            </div>
        </div>
    );
};

const RadialProgressBar = ({ stage }) => {
    const stageConfig = {
        1: { text: 'text-green-400', stroke: 'url(#grad1)', shadow: 'drop-shadow(0 0 10px #4ade80)' },
        2: { text: 'text-yellow-400', stroke: 'url(#grad2)', shadow: 'drop-shadow(0 0 10px #facc15)' },
        3: { text: 'text-orange-400', stroke: 'url(#grad3)', shadow: 'drop-shadow(0 0 10px #fb923c)' },
        4: { text: 'text-red-500', stroke: 'url(#grad4)', shadow: 'drop-shadow(0 0 10px #f87171)' },
    };
    const config = stageConfig[stage] || { text: 'text-gray-400', stroke: 'stroke-gray-400', shadow: '' };
    const circumference = 2 * Math.PI * 56;
    const offset = circumference - (stage / 4) * circumference;

    return (
        <div className={`relative w-48 h-48 mx-auto flex items-center justify-center ${config.shadow} transition-all duration-500`}>
            <svg className="w-full h-full transform -rotate-90">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style={{stopColor:'#4ade80', stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#34d399', stopOpacity:1}} /></linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style={{stopColor:'#facc15', stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#f59e0b', stopOpacity:1}} /></linearGradient>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style={{stopColor:'#fb923c', stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#f97316', stopOpacity:1}} /></linearGradient>
                    <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style={{stopColor:'#f87171', stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#ef4444', stopOpacity:1}} /></linearGradient>
                </defs>
                <circle className="stroke-gray-700" strokeWidth="12" fill="transparent" r="56" cx="96" cy="96" />
                <circle
                    className={`transition-all duration-1000 ease-in-out`}
                    strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" stroke={config.stroke} fill="transparent"
                    r="56" cx="96" cy="96"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-6xl font-bold ${config.text}`}>{stage}</span>
                <span className="text-xl font-semibold text-gray-200">Stage</span>
            </div>
        </div>
    );
};

const stageDetails = {
    1: { title: "Stage 1: Inflammation (Low Risk)", overview: "Minimal fibrosis and inflammation is present. This is the earliest stage, often reversible with lifestyle changes and treatment of the underlying cause.", suggestions: { diet: "Focus on a balanced diet rich in fruits, vegetables, and whole grains. Limit processed foods, sugar, and saturated fats. Avoid alcohol completely.", lifestyle: "Engage in regular, moderate exercise like brisk walking or swimming. Aim for a healthy weight and manage stress through techniques like yoga or meditation.", medical: "Consult your doctor to identify and treat the underlying cause (e.g., viral hepatitis, fatty liver disease). Regular monitoring is key." }},
    2: { title: "Stage 2: Fibrosis (Moderate Risk)", overview: "Scar tissue (fibrosis) has begun to form and spread. Liver function is typically still maintained, but intervention is crucial to prevent progression.", suggestions: { diet: "Strict adherence to a liver-friendly diet is essential. A low-sodium diet may be recommended. Work with a dietitian for a personalized plan.", lifestyle: "Avoid all alcohol and non-essential medications that can harm the liver. Prioritize rest and avoid strenuous activities.", medical: "Regular follow-ups with a hepatologist are necessary. Your doctor will monitor liver function and screen for complications." }},
    3: { title: "Stage 3: Cirrhosis (High Risk)", overview: "Widespread, advanced scarring has occurred, disrupting the liver's structure. Liver function may be compromised, and complications can arise.", suggestions: { diet: "A carefully managed diet, often low in sodium and protein, is critical to prevent fluid retention and other complications. Follow your doctor's advice strictly.", lifestyle: "Focus on preventing infections. Get vaccinated as recommended. Lifestyle is centered on managing symptoms and maintaining quality of life.", medical: "Intensive management of complications (like ascites or encephalopathy) is required. Your doctor may discuss advanced therapies or transplant evaluation." }},
    4: { title: "Stage 4: Decompensated Cirrhosis (Very High Risk)", overview: "The most advanced stage, characterized by severe scarring and significant impairment of liver function, leading to major complications.", suggestions: { diet: "Nutritional support is a primary goal. Diet will be highly specialized and managed by a clinical team to support you through severe illness.", lifestyle: "Care is focused on managing severe symptoms and maintaining comfort. This stage requires significant medical support.", medical: "This is a critical stage requiring immediate and intensive medical care, often in a hospital setting. Liver transplant is typically the main consideration." }},
};

const PredictionDetails = ({ stage }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const detail = stageDetails[stage] || {};

    if (!detail.title) return null;

    const suggestionIcons = {
        diet: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        lifestyle: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
        medical: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    };

    return (
        <div className="text-left mt-6 animate-fade-in-up w-full max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-100 text-center">{detail.title}</h3>
            <div className="my-4 border-b border-gray-700 flex justify-center">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Overview {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}</button>
                <button onClick={() => setActiveTab('recovery')} className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'recovery' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Suggestions {activeTab === 'recovery' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}</button>
            </div>
            {activeTab === 'overview' && (
                <p className="text-gray-400 mt-2 text-center px-4">{detail.overview}</p>
            )}
            {activeTab === 'recovery' && (
                <div className="space-y-4 p-4 rounded-lg bg-white/5">
                    {Object.entries(detail.suggestions).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">{suggestionIcons[key]}</div>
                            <div>
                                <h4 className="font-semibold capitalize text-white">{key}</h4>
                                <p className="text-gray-400">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const KeyPredictiveFactorsChart = ({ factorsData }) => {
    const data = { labels: factorsData.labels, datasets: [{ label: 'Factor Importance', data: factorsData.values, backgroundColor: 'rgba(0, 224, 255, 0.2)', borderColor: 'rgba(0, 224, 255, 1)', pointBackgroundColor: 'rgba(0, 224, 255, 1)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgba(0, 224, 255, 1)', borderWidth: 2, }] };
    const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, grid: { color: 'rgba(255, 255, 255, 0.2)' }, pointLabels: { font: { size: 12, family: 'Inter' }, color: '#d1d5db' }, ticks: { display: false, beginAtZero: true, max: 100, backdropColor: 'transparent' }, }, }, };
    return <div className="h-full w-full min-h-[280px]"><Radar data={data} options={options} /></div>;
};

// --- FORM FIELD COMPONENTS ---
const ToggleButton = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300 capitalize">{label.replace(/_/g, ' ')}</label>
        <button type="button" onClick={() => onChange({ target: { name, value: value === '1' ? '0' : '1' } })} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${value === '1' ? 'bg-cyan-500' : 'bg-gray-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${value === '1' ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const SelectInput = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 capitalize">{label.replace(/_/g, ' ')}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="mt-1 w-full bg-gray-800/80 border border-gray-700 rounded-md p-2 text-gray-100 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 appearance-none">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const TextInput = ({ label, name, value, onChange, isFullWidth = false }) => (
    <div className={isFullWidth ? 'col-span-2' : ''}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 capitalize">{name.replace(/_/g, ' ')}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} className="mt-1 w-full bg-gray-800/80 border border-gray-700 rounded-md p-2 text-gray-100 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300" required />
    </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [keyFactorsData, setKeyFactorsData] = useState({ labels: ['Bilirubin', 'SGOT', 'Albumin', 'Age', 'Prothrombin', 'Copper'], values: [0, 0, 0, 0, 0, 0] });
    const [formData, setFormData] = useState({
        'Patient Name': 'John Doe', 'Age': '50.7', 'Sex': 'F', 'Drug': 'Placebo', 'Status': 'C', 'Ascites': '0', 'Hepatomegaly': '1', 'Spiders': '0', 'Edema': '0', 'Bilirubin': '0.5', 'Cholesterol': '149.0', 'Albumin': '4.04', 'Copper': '227.0', 'Alk_Phos': '598.0', 'SGOT': '52.7', 'Tryglicerides': '57.0', 'Platelets': '256.0', 'Prothrombin': '9.9'
    });

    const formConfig = [
        { section: "Patient Details", fields: [
            { name: 'Patient Name', type: 'text', fullWidth: true },
            { name: 'Age', type: 'text' },
            { name: 'Sex', type: 'select', options: [{ value: 'F', label: 'Female' }, { value: 'M', label: 'Male' }] },
            { name: 'Drug', type: 'select', options: [{ value: 'Placebo', label: 'Placebo' }, { value: 'D-penicillamine', label: 'D-penicillamine' }] },
            { name: 'Status', type: 'select', options: [{ value: 'C', label: 'Censored' }, { value: 'CL', label: 'Censored due to liver transplant' }, { value: 'D', label: 'Death' }] },
        ]},
        { section: "Clinical Observations", fields: [
            { name: 'Ascites', type: 'toggle' }, { name: 'Hepatomegaly', type: 'toggle' }, { name: 'Spiders', type: 'toggle' }, { name: 'Edema', type: 'toggle' },
        ]},
        { section: "Lab Results", fields: [
            { name: 'Bilirubin', type: 'text' }, { name: 'Cholesterol', type: 'text' }, { name: 'Albumin', type: 'text' }, { name: 'Copper', type: 'text' }, { name: 'Alk_Phos', type: 'text' }, { name: 'SGOT', type: 'text' }, { name: 'Tryglicerides', type: 'text' }, { name: 'Platelets', type: 'text' }, { name: 'Prothrombin', type: 'text' },
        ]},
    ];

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setPredictionResult(null);
        setErrorMessage('');
      
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            const API_ENDPOINT = "http://127.0.0.1:8080/predict";

            const modelData = Object.keys(formData).reduce((acc, key) => {
                if (key === 'Patient Name') return acc;
                const fieldConfig = formConfig.flatMap(s => s.fields).find(f => f.name === key);
                if (!fieldConfig) return acc;

                if (['text', 'toggle'].includes(fieldConfig.type)) {
                    const value = parseFloat(formData[key]);
                    acc[key] = isNaN(value) ? 0 : value;
                } else { // select
                    acc[key] = formData[key] || "Unknown";
                }
                return acc;
            }, {});

            console.log("📤 Sending payload:", modelData);

            const response = await fetch(API_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modelData) });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Invalid server response' }));
                throw new Error(errorData.error || `Server responded with ${response.status}`);
            }

            const result = await response.json();
            setPredictionResult({ stage: result.predicted_stage });

            const safeValue = (v, max) => Math.min(Math.max(isNaN(v) ? 0 : v, 0), max);
            setKeyFactorsData({
                labels: ['Bilirubin', 'SGOT', 'Albumin', 'Age', 'Prothrombin', 'Copper'],
                values: [
                    safeValue(modelData.Bilirubin * 20, 95),
                    safeValue(modelData.SGOT / 3, 90),
                    safeValue(100 - (modelData.Albumin * 15), 90),
                    safeValue(modelData.Age, 90),
                    safeValue(modelData.Prothrombin * 7, 95),
                    safeValue(modelData.Copper / 3, 85)
                ],
            });
        } catch (error) {
            console.error("❌ Prediction API call failed:", error);
            setErrorMessage(`Prediction failed: ${error.message}. Displaying sample result.`);
            // Show a sample result on error for demo purposes
            setPredictionResult({ stage: 3 }); 
            const sampleModelData = { Bilirubin: 4.8, SGOT: 122.5, Albumin: 2.9, Age: 58, Prothrombin: 12.2, Copper: 155 };
            const safeValue = (v, max) => Math.min(Math.max(isNaN(v) ? 0 : v, 0), max);
            setKeyFactorsData({
                labels: ['Bilirubin', 'SGOT', 'Albumin', 'Age', 'Prothrombin', 'Copper'],
                values: [
                    safeValue(sampleModelData.Bilirubin * 20, 95),
                    safeValue(sampleModelData.SGOT / 3, 90),
                    safeValue(100 - (sampleModelData.Albumin * 15), 90),
                    safeValue(sampleModelData.Age, 90),
                    safeValue(sampleModelData.Prothrombin * 7, 95),
                    safeValue(sampleModelData.Copper / 3, 85)
                ],
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (!predictionResult) return;
        const { stage } = predictionResult;
        const detail = stageDetails[stage];
        const reportContent = `LIVERGUARDIAN PREDICTION REPORT\n=================================\nPatient Name: ${formData['Patient Name']}\nDate: ${new Date().toLocaleString()}\n---------------------------------\nPREDICTION RESULT\n-----------------\nCirrhosis Stage: ${stage} - ${detail.title}\nOverview: ${detail.overview}\n\nRECOVERY & SUGGESTIONS\n----------------------\nDiet: ${detail.suggestions.diet}\nLifestyle: ${detail.suggestions.lifestyle}\nMedical: ${detail.suggestions.medical}\n\nBIOMARKER STATUS\n----------------\n${Object.entries(formData).filter(([k]) => k !== 'Patient Name').map(([k, v]) => `  ${k.padEnd(15)}: ${v}`).join('\n')}\n=================================\nDisclaimer: This report is generated by an AI model and is for informational purposes only. It is not a substitute for professional medical advice.`;
        const blob = new Blob([reportContent.trim()], { type: 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        const patientNameFile = formData['Patient Name'].replace(/\s+/g, '_');
        link.download = `LiverGuardian_Report_${patientNameFile}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-inter antialiased" style={{ backgroundImage: 'radial-gradient(circle at top, #1a202c 0%, #000 70%)'}}>
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
            <header className="sticky top-0 z-20 flex justify-between items-center px-4 md:px-8 py-4 bg-black/50 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center gap-3">
                    <LogoIcon />
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white font-orbitron animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#e2e8f0,45%,#4d5563,55%,#e2e8f0)] bg-[length:250%_100%]">LiverGuardian</h1>
                        <p className="text-sm text-gray-400">AI-Powered Cirrhosis Stage Prediction</p>
                    </div>
                </div>
                <button onClick={() => setAboutModalOpen(true)} className="p-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 transition-colors" aria-label="About">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </button>
            </header>

            <main className="relative z-10 container mx-auto px-4 py-8">
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 opacity-0 animate-fade-in-left" style={{animationDelay: '100ms'}}>
                        <h2 className="text-2xl font-bold mb-6 text-gray-100 font-orbitron">Patient Data</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-6 h-[480px] overflow-y-auto pr-3 -mr-3 scrollbar-thin scrollbar-thumb-gray-600/80 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
                                {formConfig.map(section => (
                                    <div key={section.section}>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{section.section}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {section.fields.map(field => {
                                                switch (field.type) {
                                                    case 'toggle': return <ToggleButton key={field.name} label={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} />;
                                                    case 'select': return <div key={field.name} className="col-span-2"><SelectInput label={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} options={field.options} /></div>;
                                                    default: return <TextInput key={field.name} label={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} isFullWidth={field.fullWidth} />;
                                                }
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errorMessage && <p className="text-red-400 text-sm text-center pt-2">{errorMessage}</p>}
                            <button type="submit" disabled={isLoading} className="w-full py-3 px-6 bg-cyan-500 text-black font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-cyan-400 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center font-orbitron">
                                {isLoading ? <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg><span>Analyzing...</span></> : 'Run Prediction'}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 text-center opacity-0 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-100 font-orbitron">Prediction Result</h2>
                            {isLoading ? (
                                <div className="min-h-[450px] space-y-6 animate-pulse">
                                    <div className="w-48 h-48 mx-auto bg-gray-700 rounded-full"></div>
                                    <div className="h-8 w-3/4 mx-auto bg-gray-700 rounded"></div>
                                    <div className="h-4 w-1/2 mx-auto bg-gray-700 rounded"></div>
                                    <div className="h-4 w-full mx-auto bg-gray-700 rounded"></div>
                                </div>
                            ) : predictionResult ? (
                                <>
                                    <RadialProgressBar stage={predictionResult.stage} />
                                    <PredictionDetails stage={predictionResult.stage} />
                                    <button onClick={handleDownloadReport} className="mt-6 py-2 px-5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        Download Report
                                    </button>
                                </>
                            ) : (
                                <div className="min-h-[450px] flex flex-col items-center justify-center text-gray-500">
                                    <svg className="w-16 h-16 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                    <p className="text-lg">Awaiting patient data for analysis.</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 opacity-0 animate-fade-in-up" style={{animationDelay: '500ms'}}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-100 font-orbitron">Key Predictive Factors</h2>
                            <KeyPredictiveFactorsChart factorsData={keyFactorsData} />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App;