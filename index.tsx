import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Trash2, Download, FileText, Eye, Edit, Share2, Printer, X, Menu, Save, Upload, Cloud, User, Users, Lock, AlertTriangle, ClipboardList, CheckSquare, Home, LogOut, Clock, Activity, Settings, Pen, Terminal, Folder, ChevronRight, FileCheck, Wifi, Server } from 'lucide-react';

// --- ICONS MAPPING ---
const Icons = {
  User: User,
  Users: Users,
  Lock: Lock,
  AlertTriangle: AlertTriangle,
  ClipboardList: ClipboardList,
  CheckSquare: CheckSquare,
  Menu: Menu,
  X: X,
  Home: Home,
  LogOut: LogOut,
  Trash: Trash2,
  Edit: Edit,
  Eye: Eye,
  FileText: FileText,
  Clock: Clock,
  Activity: Activity,
  Settings: Settings,
  Pen: Pen,
  Download: Download,
  Upload: Upload,
  Send: Share2,
  Folder: Folder,
  Terminal: Terminal,
  Printer: Printer,
  Save: Save,
  Cloud: Cloud,
  FileCheck: FileCheck,
  Wifi: Wifi,
  Server: Server
};

// --- CONSTANTS ---
const ALERT_THRESHOLD_HOURS = 20;
const ALERT_THRESHOLD_MS = ALERT_THRESHOLD_HOURS * 60 * 60 * 1000;
// URL pública de um caminhão de mineração (Ex: Cat 777) para o alerta
const TRUCK_IMAGE_URL = "https://s7d2.scene7.com/is/image/Caterpillar/CM20200916-74901-72057"; 

const RISK_LIST_EMERGENCIAL = [
  "Contato com superfícies cortantes/perfurante em ferramentas manuais ou em estruturas.",
  "Prensamento de dedos ou mãos.",
  "Queda de peças/estruturas/equipamentos.",
  "Prensamento ou agarramento do corpo.",
  "Atropelamento/esmagamento por veículos (vias, pátios, ferrovias).",
  "Queda, tropeço ou escorregão no acesso ou local de trabalho.",
  "Animais peçonhentos/insetos/animal selvagem.",
  "Desmoronamentos de pilhas (minério, estéril, etc).",
  "Queda de plataforma ou de escadas durante acesso.",
  "Arco e/ou choque elétrico.",
  "Fontes de energia (hidráulica, pneumática, elétrica, etc).",
  "Exposição a vapores, condensados ou superfícies quentes.",
  "Gases, vapores, poeiras ou fumos.",
  "Produtos químicos ou queimaduras.",
  "Projeção de materiais na face ou nos olhos.",
  "Condições climáticas adversas (sol, chuva, vento).",
  "Queda de homem ao mar ou afogamento.",
  "Interferência entre equipes (trabalho sobreposto, espaço restrito).",
  "Excesso ou deficiência de iluminação.",
  "Outras situações de risco (20)",
  "Outras situações de risco (21)",
  "Outras situações de risco (22)",
  "Outras situações de risco (23)"
];

const SYSTEMS_CHECKLIST = [
  { name: 'MOTOR', items: ['Vazamento de óleo em geral e próximo a partes quentes', 'Vazamento liquido de arrefecimento', 'Interferencias entre tubos, mangueiras e cabos', 'Nível de óleo'] },
  { name: 'SISTEMA HIDRÁULICO', items: ['Vazamento do óleo', 'Nível de óleo', 'Abraçadeiras de fixação', 'Interferencias entre tubos, mangueiras e cabos'] },
  { name: 'TRANSMISSÃO', items: ['Vazamento do óleo', 'Parafusos folgados', 'Abraçadeiras de fixação', 'Interferencias entre tubos, mangueiras e cabos', 'Proteção do cardan', 'Bujão de dreno do diferencial (Fixação)', 'Bujão de dreno e inspeção comando direito (Fixação)', 'Bujão de dreno e inspeção comando esquerdo (Fixação)', 'Nível de óleo do conversor e transmissão'] },
  { name: 'SISTEMA DE DIREÇÃO', items: ['Vazamento do óleo', 'Nível de óleo', 'Parafusos/pinos folgados', 'Abraçadeiras de fixação', 'Interferencias entre tubos, mangueiras e cabos'] },
  { name: 'ILUMINAÇÃO/AR CONDICIONADO', items: ['Farol de Alta e Baixa', 'Setas', 'Buzina', 'Ar Condicionado'] },
  { name: 'ESCADAS, CORRIMÃO, GUARDA CORPO', items: ['Escadas (Principal e de emergência)', 'Guarda Corpo (Plataforma)', "Tag's laterais e traseiro", 'Corrimão das Escadas'] },
  { name: 'CONDIÇÕES DE LIMPEZA E ORGANIZAÇÃO', items: ['Cabine', 'Plataforma', 'Escadas e Corrimões', 'Retrovisores'] },
];

// --- HELPERS ---
const getLocalStorage = (key, initial) => {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  return initial;
};

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- COMPONENTS ---

// 1. SIGNATURE CANVAS & MANAGER
const SignatureCanvas = ({ onSave, onCancel, employeeName, employeeRole, employeeId }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const handleSave = () => {
    const canvas = canvasRef.current;
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    onSave(canvas.toDataURL(), dateStr, timeStr);
  };

  const clear = () => {
     const canvas = canvasRef.current;
     const ctx = canvas.getContext('2d');
     ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h3 className="font-bold mb-2">Assinar como: {employeeName}</h3>
        <div className="border border-gray-300 bg-white">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={clear} className="text-sm text-gray-500 underline">Limpar</button>
          <div className="space-x-2">
            <button onClick={onCancel} className="px-3 py-1 rounded border">Cancelar</button>
            <button onClick={handleSave} className="px-3 py-1 rounded bg-yellow-400 font-bold">Salvar Assinatura</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignatureManager = ({ signatures, setSignatures, employees }) => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setShowCanvas(true);
  };

  const handleSignatureSave = (dataUrl, date, time) => {
    if (signatures.length >= 5) {
      alert("Máximo de 5 assinaturas permitidas.");
      return;
    }
    const newSig = {
      ...selectedEmployee,
      signatureImage: dataUrl,
      date,
      time
    };
    setSignatures([...signatures, newSig]);
    setShowCanvas(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.matricula.includes(searchTerm)
  );

  return (
    <div className="border p-4 rounded bg-gray-50 mt-4">
      <h3 className="font-bold mb-2">Equipe Envolvida e Assinaturas (Max 5)</h3>
      
      <div className="space-y-2 mb-4">
        {signatures.map((sig, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-2 border rounded">
            <div>
              <p className="font-bold text-sm">{sig.name}</p>
              <p className="text-xs text-gray-500">{sig.role} | Mat: {sig.matricula}</p>
              <p className="text-xs text-gray-400">{sig.date} {sig.time}</p>
            </div>
            <img src={sig.signatureImage} alt="Sig" className="h-8 border border-dashed border-gray-300" />
             <button onClick={() => setSignatures(signatures.filter((_, i) => i !== index))} className="text-red-500 text-xs ml-2">Remover</button>
          </div>
        ))}
      </div>

      {signatures.length < 5 && (
        <div className="bg-white border rounded p-2 max-h-60 overflow-y-auto">
            <input 
                type="text" 
                placeholder="Buscar funcionário..." 
                className="w-full p-2 border mb-2 rounded text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-1">
                {filteredEmployees.map(emp => (
                    <button 
                        key={emp.matricula}
                        onClick={() => handleSelectEmployee(emp)}
                        className="text-left p-2 hover:bg-yellow-100 rounded flex justify-between items-center border-b"
                    >
                        <div>
                            <div className="font-bold text-sm">{emp.name}</div>
                            <div className="text-xs text-gray-500">{emp.role}</div>
                        </div>
                        <div className="text-xs bg-gray-200 px-2 py-1 rounded">Mat: {emp.matricula}</div>
                    </button>
                ))}
            </div>
        </div>
      )}

      {showCanvas && selectedEmployee && (
        <SignatureCanvas
          employeeName={selectedEmployee.name}
          employeeRole={selectedEmployee.role}
          employeeId={selectedEmployee.matricula}
          onSave={handleSignatureSave}
          onCancel={() => setShowCanvas(false)}
        />
      )}
    </div>
  );
};

const RiskRadar = ({ risks }: { risks: any }) => {
  const counts: Record<string, number> = {
    'Atrás / Acima': 0,
    'Direita': 0,
    'Frente / Abaixo': 0,
    'Esquerda': 0
  };

  if (risks) {
    Object.values(risks).forEach((quadrant) => {
      const q = quadrant as string;
      if (counts[q] !== undefined) counts[q]++;
    });
  }

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="98" fill="none" stroke="#000" strokeWidth="2"/>
          <line x1="100" y1="2" x2="100" y2="198" stroke="#000" strokeWidth="1"/>
          <line x1="2" y1="100" x2="198" y2="100" stroke="#000" strokeWidth="1"/>
          <circle cx="100" cy="100" r="30" fill="white" stroke="#000" strokeWidth="1"/>
          <g transform="translate(88, 88) scale(0.05)">
             <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" fill="#333"/>
          </g>
        </svg>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-1 text-xs font-bold">Atrás / Acima ({counts['Atrás / Acima']})</div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-1 text-xs font-bold">Frente / Abaixo ({counts['Frente / Abaixo']})</div>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white px-1 text-xs font-bold">Esq. ({counts['Esquerda']})</div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white px-1 text-xs font-bold">Dir. ({counts['Direita']})</div>
      </div>
    </div>
  );
};

const MaintenanceTimer = ({ startTime, endTime }: { startTime: any; endTime?: any }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    if (endTime) {
        setElapsed(new Date(endTime).getTime() - new Date(startTime).getTime());
        return;
    }
    const interval = setInterval(() => {
      setElapsed(new Date().getTime() - new Date(startTime).getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  };

  return (
    <span className={`font-mono font-bold px-2 py-1 rounded ${endTime ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'}`}>
        {formatTime(elapsed)}
    </span>
  );
};

const TruckAlertModal = ({ onClose, alertData }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 animate-fade-in">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full border-8 border-red-600 shadow-[0_0_50px_rgba(255,0,0,0.5)] flex flex-col items-center relative">
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full"><Icons.X /></button>
                </div>
                
                <h2 className="text-3xl font-black text-red-600 mb-2 animate-pulse uppercase tracking-widest text-center">
                    <Icons.AlertTriangle className="inline w-10 h-10 mb-2" /> ALERTA DE MANUTENÇÃO CRÍTICA
                </h2>
                
                <div className="w-full h-64 bg-black mb-4 flex items-center justify-center overflow-hidden rounded border-2 border-yellow-500">
                    <img 
                        src={TRUCK_IMAGE_URL} 
                        alt="Caterpillar Truck Alert" 
                        className="h-full object-contain animate-pulse"
                        onError={(e) => {
                            // Fallback if image fails
                            e.target.style.display='none';
                        }}
                    />
                </div>

                <div className="text-center space-y-2 mb-6 w-full bg-red-50 p-4 rounded">
                    <p className="text-2xl font-bold text-gray-900">TAG: {alertData?.tag}</p>
                    <p className="text-xl font-bold text-gray-700">OM: {alertData?.om}</p>
                    <p className="text-lg text-red-700 font-bold uppercase">Tempo Limite Excedido!</p>
                </div>

                <button 
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl transition-transform hover:scale-105"
                >
                    CIENTE / FECHAR
                </button>
            </div>
        </div>
    );
};

const MaintenanceCard: React.FC<{ maintenance: any; onFinish: any; currentUser: any }> = ({ maintenance, onFinish, currentUser }) => {
  const [elapsed, setElapsed] = useState(0);
  const canFinish = currentUser && maintenance.userId === currentUser.matricula;

  useEffect(() => {
    if (maintenance.status === 'finished') {
        if (maintenance.endTime) {
            setElapsed(new Date(maintenance.endTime).getTime() - new Date(maintenance.startTime).getTime());
        }
        return;
    }
    const start = new Date(maintenance.startTime).getTime();
    const tick = () => {
      const now = new Date().getTime();
      setElapsed(now - start);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [maintenance.startTime, maintenance.status, maintenance.endTime]);

  const isOverdue = elapsed > ALERT_THRESHOLD_MS && maintenance.status !== 'finished';

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  };

  return (
     <div className={`border-l-8 p-4 rounded shadow relative transition-colors duration-500 ${isOverdue ? 'bg-red-50 border-red-600' : 'bg-white border-yellow-500'}`}>
        {isOverdue && (
             <div className="absolute -top-3 left-0 w-full flex justify-center z-10">
                <span className="bg-red-600 text-white px-3 py-1 text-xs rounded-full font-bold animate-pulse shadow-lg border-2 border-white flex items-center">
                   <Icons.AlertTriangle /> <span className="ml-1">ALERTA CRÍTICO</span>
                </span>
             </div>
        )}
        <h4 className="font-bold text-lg mt-2">{maintenance.tag}</h4>
        <p className="text-sm text-gray-600">OM: {maintenance.om}</p>
        <p className="text-sm font-bold mt-1">{maintenance.taskName}</p>
        <p className="text-xs text-gray-500 mt-1">Resp: {maintenance.userName}</p>
        
        <div className="flex items-center justify-between border-t pt-2 mt-2">
            <span className={`font-mono font-bold px-2 py-1 rounded ${isOverdue ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>
                {formatTime(elapsed)}
            </span>
            {maintenance.status !== 'finished' && (
                canFinish ? (
                  <button 
                      onClick={() => onFinish(maintenance)}
                      className="bg-red-600 text-white text-xs px-3 py-2 rounded hover:bg-red-700 font-bold"
                  >
                      ENCERRAR
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400 flex items-center bg-gray-100 px-2 py-1 rounded">
                     <Icons.Lock className="w-3 h-3 mr-1" /> Apenas {maintenance.userId}
                  </span>
                )
            )}
        </div>
    </div>
  );
};

// 5. PRINT TEMPLATE (PDF)
const PrintTemplate = ({ data, type, onClose, settings }) => {
  const isAutoPrint = data.autoPrint === true;

  if (!data) return null;

  const getTitle = () => {
      if (type === 'emergencial') return 'ANÁLISE PRELIMINAR DE RISCO (ART EMERGENCIAL)';
      if (type === 'atividade') return 'ANÁLISE DE RISCO DA TAREFA (ART)';
      if (type === 'checklist') return 'CHECKLIST DE MANUTENÇÃO E ENTREGA';
      return 'DOCUMENTO TÉCNICO';
  };

  const handleWordDownload = () => {
        const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        const postHtml = "</body></html>";
        const content = document.getElementById('print-section').innerHTML;
        const blob = new Blob(['\ufeff', preHtml, content, postHtml], {
            type: 'application/msword'
        });
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(preHtml + content + postHtml);
        const link = document.createElement('a');
        link.href = url;
        link.download =  `${data.fileName || 'documento'}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  };

  const containerClasses = isAutoPrint 
    ? "fixed inset-0 z-50 pointer-events-none opacity-0 flex justify-center overflow-y-auto print-force-show bg-white"
    : "fixed inset-0 z-50 bg-gray-900 bg-opacity-95 flex justify-center overflow-y-auto";

  return (
    <div className={containerClasses}>
       <style>{`
        /* Estilos de Impressão Aprimorados */
        @media print {
            @page { 
                size: A4; 
                margin: 10mm; 
            }
            body { 
                background-color: white; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
            }
            .no-print { display: none !important; }
            
            /* Force visibility for autoPrint mode */
            .print-force-show { 
                opacity: 1 !important; 
                visibility: visible !important; 
                display: block !important;
                position: static !important;
                z-index: auto !important;
                background-color: white !important;
            }
            
            /* Forçar bordas e fundos na impressão */
            .print-border { border: 1px solid #000 !important; }
            .print-bg-gray { background-color: #f3f4f6 !important; color: #000 !important; }
            .print-bg-dark { background-color: #1f2937 !important; color: white !important; }
            
            /* Ajustes de texto para impressão */
            .print-text-sm { font-size: 10pt !important; }
            .print-text-xs { font-size: 8pt !important; }
            
            /* Resetar containers para ocupar a folha toda */
            #print-wrapper {
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                display: block !important;
            }
            #print-section { 
                box-shadow: none !important; 
                width: 100% !important; 
                max-width: none !important;
                min-height: auto !important; 
                padding: 0 !important; 
                margin: 0 !important; 
            }
            
            /* Evitar quebras de página indesejadas */
            tr, .avoid-break { page-break-inside: avoid; }
            table { page-break-inside: auto; }
        }

        /* Estilos para Visualização em Tela */
        .document-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 16px;
        }
        .document-table td, .document-table th {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: middle;
        }
        .document-table th {
            background-color: #f3f4f6;
            font-weight: bold;
            text-transform: uppercase;
            text-align: left;
        }
       `}</style>

       {/* TOOLBAR - Hide if autoPrint */}
       {!isAutoPrint && (
        <div className="no-print fixed top-0 left-0 w-full bg-gray-900 text-white z-50 shadow-2xl flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4 border-b border-gray-700">
           <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-2 rounded-lg text-black">
                <Icons.FileCheck className="w-6 h-6" /> 
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">VISUALIZADOR DE DOCUMENTO</h3>
                <p className="text-xs text-gray-400">Selecione uma opção abaixo</p>
              </div>
           </div>

           <div className="flex gap-3 items-center">
                <div className="bg-gray-800 p-1 rounded-lg border border-gray-600 flex gap-2">
                    <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center transition-colors shadow">
                        <Icons.Download className="w-4 h-4 mr-2" /> BAIXAR PDF
                    </button>
                    <button onClick={handleWordDownload} className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded font-bold text-sm flex items-center transition-colors shadow">
                        <Icons.FileText className="w-4 h-4 mr-2" /> BAIXAR WORD
                    </button>
                </div>
                <button onClick={onClose} className="bg-transparent hover:bg-red-900/30 text-gray-300 hover:text-red-400 px-3 py-2 rounded-md font-bold text-sm transition-colors flex items-center border border-transparent hover:border-red-800">
                    <Icons.X className="w-4 h-4 mr-1" /> FECHAR
                </button>
           </div>
       </div>
       )}

       {/* PAPER A4 SIMULATION WRAPPER */}
       <div id="print-wrapper" className={`${isAutoPrint ? 'print-force-show' : 'pt-24 pb-10'} w-full flex flex-col items-center overflow-x-auto print:pt-0 print:pb-0`}> 
         
         {/* INSTRUCTION BOX */}
         {!isAutoPrint && (
             <div className="no-print bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6 text-sm max-w-[210mm] text-center shadow-sm">
                 <span className="font-bold block mb-1"><Icons.AlertTriangle className="inline w-4 h-4 mb-1 mr-1"/> COMO BAIXAR:</span>
                 Ao clicar em "BAIXAR PDF", a janela de impressão abrirá. No campo <strong>"Destino"</strong> ou <strong>"Impressora"</strong>, selecione a opção <strong>"Salvar como PDF"</strong>.
             </div>
         )}

         <div id="print-section" className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl text-black box-border print:shadow-none print:w-full print:p-0 mx-auto shrink-0">
            
            {/* --- DOCUMENT HEADER --- */}
            <table className="document-table mb-6">
                <tbody>
                    <tr>
                        <td className="w-24 text-center p-2">
                           {/* LOGO PLACEHOLDER */}
                           <div className="flex flex-col items-center justify-center">
                               <Icons.Activity className="w-10 h-10 text-gray-800" />
                               <div className="text-[9px] font-bold mt-1 uppercase tracking-wider">Logo</div>
                           </div>
                        </td>
                        <td className="text-center p-2">
                            <h1 className="text-xl font-bold uppercase tracking-tight">{getTitle()}</h1>
                            <p className="text-xs mt-1 text-gray-600 uppercase">Sistema de Gestão de Segurança e Manutenção</p>
                        </td>
                        <td className="w-32 text-xs p-2 align-top bg-gray-50">
                            <div className="flex justify-between border-b border-gray-300 pb-1 mb-1">
                                <span className="font-bold">DATA:</span> <span>{data.date}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-1 mb-1">
                                <span className="font-bold">HORA:</span> <span>{data.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">ID:</span> <span className="font-mono">{data.maintenanceId ? data.maintenanceId.replace('MNT-', '') : data.id.toString().slice(-6)}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* --- INFO BLOCK --- */}
            <table className="document-table">
                <thead>
                    <tr>
                        <th colSpan={4} className="text-center bg-gray-200 print-bg-gray border-b-2 border-black">DADOS DA TAREFA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="font-bold w-1/5 bg-gray-50">TAREFA:</td>
                        <td className="w-4/5 font-bold text-sm" colSpan={3}>{data.taskName}</td>
                    </tr>
                    <tr>
                        <td className="font-bold bg-gray-50">OM:</td>
                        <td>{data.om}</td>
                        <td className="font-bold bg-gray-50 w-24">TAG:</td>
                        <td>{data.tag}</td>
                    </tr>
                    <tr>
                        <td className="font-bold bg-gray-50">LOCAL:</td>
                        <td>{data.location || '-'}</td>
                        <td className="font-bold bg-gray-50">TIPO:</td>
                        <td>{data.activityType}</td>
                    </tr>
                    <tr>
                        <td className="font-bold bg-gray-50">MANUTENÇÃO:</td>
                        <td className="uppercase">{data.maintenanceType || 'Preventiva'}</td>
                        <td className="font-bold bg-gray-50">DURAÇÃO:</td>
                        <td>{data.maintenanceDuration || '-'}</td>
                    </tr>
                    {data.correctionDescription && (
                        <tr>
                            <td className="font-bold bg-gray-50">DESCRIÇÃO:</td>
                            <td colSpan={3} className="italic text-sm">{data.correctionDescription}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* --- SPECIFIC CONTENT --- */}

            {/* EMERGENCIAL RISKS */}
            {type === 'emergencial' && (
                <div className="mb-4">
                    <div className="bg-gray-800 text-white font-bold p-2 text-center text-sm uppercase border border-black border-b-0 print-bg-dark">
                        Análise de Riscos (Diagnóstico)
                    </div>
                    <div className="border border-black p-0">
                         {Object.keys(data.checkedRisks || {}).length === 0 ? (
                             <p className="text-center italic text-gray-500 p-4">Nenhum risco crítico assinalado.</p>
                         ) : (
                             <table className="w-full text-xs border-collapse">
                                 <thead>
                                     <tr className="bg-gray-100 print-bg-gray">
                                         <th className="border border-gray-300 p-2 text-left w-1/2 font-bold uppercase">Risco Identificado</th>
                                         <th className="border border-gray-300 p-2 text-left font-bold uppercase">Quadrante</th>
                                         <th className="border border-gray-300 p-2 text-left font-bold uppercase">Medida de Controle</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {Object.keys(data.checkedRisks).map(idx => (
                                         <tr key={idx}>
                                             <td className="border border-gray-300 p-2">{RISK_LIST_EMERGENCIAL[idx]}</td>
                                             <td className="border border-gray-300 p-2 text-center">{data.riskLocations?.[idx] || '-'}</td>
                                             <td className="border border-gray-300 p-2 italic">{data.riskControls?.[idx] || 'N/A'}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         )}
                    </div>
                </div>
            )}

            {/* ACTIVITY STEPS & RISKS */}
            {type === 'atividade' && (
                <>
                    <table className="document-table">
                         <thead>
                             <tr>
                                 <th className="bg-gray-200 print-bg-gray">PASSO A PASSO DA ATIVIDADE</th>
                             </tr>
                         </thead>
                         <tbody>
                             {data.steps && data.steps.map((s, i) => (
                                 <tr key={i}>
                                     <td className="p-2 text-sm">
                                         <span className="font-bold mr-2 text-gray-600">{String(i+1).padStart(2, '0')}.</span>
                                         {s}
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                    </table>

                    <table className="document-table">
                         <thead>
                             <tr className="bg-gray-200 print-bg-gray">
                                 <th>Risco Associado</th>
                                 <th className="w-24 text-center">Nível</th>
                             </tr>
                         </thead>
                         <tbody>
                             {data.principalRisks && data.principalRisks.map((r, i) => (
                                 <tr key={i}>
                                     <td>{r.risk}</td>
                                     <td className="text-center font-bold text-xs uppercase">{r.level}</td>
                                 </tr>
                             ))}
                         </tbody>
                    </table>

                    <table className="document-table">
                        <thead>
                            <tr><th className="bg-gray-100">Resumo de Controles</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="h-16 align-top italic text-sm">{data.controlSummary || 'Não preenchido.'}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}

            {/* CHECKLIST ITEMS */}
            {type === 'checklist' && (
                <div className="mb-4 space-y-4">
                    {SYSTEMS_CHECKLIST.map((sys, idx) => (
                        <table key={idx} className="document-table mb-0">
                            <thead>
                                <tr className="bg-gray-800 text-white print-bg-dark">
                                    <th colSpan={3} className="p-1 pl-2 uppercase text-xs tracking-wider border-none text-white">
                                        {sys.name}
                                    </th>
                                </tr>
                                <tr className="bg-gray-100 print-bg-gray text-[10px] uppercase">
                                    <th className="w-2/3 border-black">Item de Verificação</th>
                                    <th className="w-16 text-center border-black">Status</th>
                                    <th className="border-black">Observação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sys.items.map((item, i) => {
                                    const key = `${sys.name}-${item}`;
                                    const status = data.checks?.[key] || 'na';
                                    const obs = data.obs?.[key];
                                    return (
                                        <tr key={i} className="text-[11px]">
                                            <td className="border-gray-300">{item}</td>
                                            <td className="border-gray-300 text-center font-bold">
                                                {status === 'ok' && <span className="text-black">OK</span>}
                                                {status === 'nok' && <span className="text-black font-extrabold">NOK</span>}
                                                {status === 'na' && <span className="text-gray-400">N/A</span>}
                                            </td>
                                            <td className="border-gray-300 text-gray-600 italic">{obs}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ))}
                </div>
            )}

            {/* --- SIGNATURES --- */}
            <div className="mt-8 avoid-break">
                <table className="document-table mb-0">
                    <thead>
                        <tr>
                            <th className="bg-gray-200 print-bg-gray text-center border-b-2 border-black uppercase">
                                Responsáveis e Assinaturas
                            </th>
                        </tr>
                    </thead>
                </table>
                <div className="border border-black border-t-0 p-4 grid grid-cols-2 gap-8">
                    {data.signatures && data.signatures.map((sig, i) => (
                        <div key={i} className="text-center flex flex-col items-center justify-end h-24">
                            {sig.signatureImage ? (
                                <img src={sig.signatureImage} className="h-12 mb-1 object-contain" alt="Assinatura" />
                            ) : (
                                <div className="h-12 mb-1 w-full"></div>
                            )}
                            <div className="border-t border-black w-4/5 pt-1">
                                <div className="font-bold text-xs uppercase">{sig.name}</div>
                                <div className="text-[9px] text-gray-600">{sig.role} | {sig.matricula}</div>
                                <div className="text-[8px] text-gray-400">{sig.date} às {sig.time}</div>
                            </div>
                        </div>
                    ))}
                    {(!data.signatures || data.signatures.length === 0) && (
                        <div className="col-span-2 text-center text-gray-400 italic py-4">Sem assinaturas registradas.</div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-[9px] text-center mt-8 text-gray-400 border-t pt-2">
                Documento gerado eletronicamente pelo sistema ART APP em {new Date().toLocaleString('pt-BR')}. Válido para fins de registro interno.
            </div>
         </div>

         {/* ACTION FOOTER (BOTTOM OF PAGE) */}
         {!isAutoPrint && (
            <div className="no-print mt-8 w-full max-w-[210mm] grid grid-cols-2 gap-4 mb-10">
                <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform hover:scale-105">
                    <Icons.Download className="w-8 h-8 mb-2" />
                    <span className="font-bold text-lg">SALVAR / BAIXAR PDF</span>
                </button>
                <button onClick={handleWordDownload} className="bg-blue-800 hover:bg-blue-900 text-white py-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform hover:scale-105">
                    <Icons.FileText className="w-8 h-8 mb-2" />
                    <span className="font-bold text-lg">BAIXAR WORD (.DOC)</span>
                </button>
            </div>
         )}

       </div>
    </div>
  );
};

// --- SCREENS ---

const ScreenLogin = ({ onLogin, users, setUsers, serverIp, setServerIp }) => {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.matricula === matricula && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      alert('Credenciais inválidas');
    }
  };

  const handleCreateAdmin = () => {
    const newUser = { name: 'Administrador', matricula: 'admin', password: 'admin', role: 'admin' };
    setUsers([newUser]);
    alert('Admin criado! User: admin / Pass: admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-500 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 border-4 border-black">
        <h1 className="text-4xl font-bold text-center mb-6 tracking-tighter">ART <span className="text-yellow-500 bg-black px-2">APP</span></h1>
        <h2 className="text-center text-gray-600 mb-6">Análise Preliminar da Tarefa</h2>
        
        <div className="mb-4 bg-gray-100 p-2 rounded text-xs text-gray-500 flex items-center justify-between">
             <span className="flex items-center"><Icons.Wifi className="w-3 h-3 mr-1"/> Conexão IP:</span>
             <input 
                type="text" 
                value={serverIp} 
                onChange={(e) => setServerIp(e.target.value)} 
                placeholder="Ex: 192.168.0.10"
                className="bg-white border p-1 w-28 text-right font-mono"
             />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Matrícula</label>
            <input 
              type="text" 
              className="w-full p-3 border-2 border-black rounded bg-gray-100 focus:bg-white outline-none" 
              value={matricula} 
              onChange={e => setMatricula(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full p-3 border-2 border-black rounded bg-gray-100 focus:bg-white outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition">
            ENTRAR
          </button>
        </form>
        
        {users.length === 0 && (
          <button onClick={handleCreateAdmin} className="mt-4 w-full text-sm text-blue-600 underline">
            Cadastrar Administrador Inicial
          </button>
        )}
      </div>
    </div>
  );
};

const ScreenDashboard = ({ currentUser, activeMaintenances, onFinishMaintenance, serverIp, refreshData }) => {
  const activeList = activeMaintenances.filter(m => m.status !== 'finished');
  const finishedList = activeMaintenances.filter(m => m.status === 'finished');
  
  // --- AUTO-REFRESH LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Call the refresh function passed from App to reload data from localStorage (simulating network fetch)
      refreshData();
      console.log("Painel atualizado via rede/IP...", new Date().toLocaleTimeString());
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [refreshData]);

  // --- TRUCK ALERT LOGIC ---
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
      // Check for overdue maintenances to trigger alert
      const overdueItem = activeList.find(m => {
          const startTime = new Date(m.startTime).getTime();
          const elapsed = new Date().getTime() - startTime;
          return elapsed > ALERT_THRESHOLD_MS;
      });

      if (overdueItem) {
          setAlertData(overdueItem);
      } else {
          setAlertData(null);
      }
  }, [activeList]);

  return (
    <div className="p-8 h-full flex flex-col relative">
      {alertData && <TruckAlertModal alertData={alertData} onClose={() => setAlertData(null)} />}

      {/* Safety Banner */}
      <div className="bg-black text-yellow-400 p-6 rounded-lg shadow-lg mb-6 border-l-8 border-yellow-500 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold uppercase mb-1 tracking-tighter">SEGURANÇA EM 1º LUGAR</h1>
            <p className="text-lg italic text-white opacity-90">"Nenhum trabalho é tão urgente que não possa ser feito com segurança."</p>
          </div>
          <div className="text-right text-white hidden md:block">
             <p className="text-sm font-bold">{currentUser.name}</p>
             <div className="flex items-center justify-end gap-2 mt-1">
                <p className="text-xs text-green-500 font-bold flex items-center"><Icons.Wifi className="w-3 h-3 mr-1" /> ONLINE: {serverIp}</p>
             </div>
          </div>
      </div>

      {/* SPLIT VIEW DASHBOARD / MONITOR */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          
          {/* LEFT: MONITOR 24H ACTIVE (Big Section) */}
          <div className="lg:col-span-2 bg-white rounded shadow-xl border border-gray-300 flex flex-col">
             <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-red-600 flex items-center animate-pulse">
                    <Icons.Activity /> <span className="ml-2">MONITORAMENTO 24H - EM ANDAMENTO</span>
                 </h2>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 animate-pulse flex items-center"><Icons.Clock className="w-3 h-3 mr-1"/> Atualização: 30s</span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                        {activeList.length} ATIVOS
                    </span>
                 </div>
             </div>
             
             <div className="p-4 overflow-y-auto flex-1 bg-gray-100">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeList.map(m => (
                        <MaintenanceCard key={m.id} maintenance={m} onFinish={onFinishMaintenance} currentUser={currentUser} />
                    ))}
                    {activeList.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400 opacity-50">
                            <Icons.CheckSquare />
                            <p className="mt-2 font-bold">Nenhuma manutenção ativa no momento.</p>
                        </div>
                    )}
                 </div>
             </div>
          </div>

          {/* RIGHT: RECENT HISTORY (Smaller Section) */}
          <div className="bg-white rounded shadow-lg border border-gray-300 flex flex-col">
             <div className="p-4 bg-gray-50 border-b border-gray-200">
                 <h2 className="text-lg font-bold text-green-700 flex items-center">
                    <Icons.ClipboardList /> <span className="ml-2">ENCERRADOS (24H)</span>
                 </h2>
             </div>
             <div className="p-4 overflow-y-auto flex-1">
                 <div className="space-y-3">
                    {finishedList.map(m => (
                         <div key={m.id} className="bg-white border-l-4 border-green-600 p-3 rounded shadow-sm text-sm">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-gray-800">{m.tag}</span>
                                <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">CONCLUÍDO</span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">OM: {m.om}</div>
                            <div className="text-[10px] text-gray-500 uppercase mb-1 truncate">{m.taskName}</div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                                <span className="text-[10px] text-gray-400">{new Date(m.endTime).toLocaleTimeString().slice(0,5)}</span>
                                <MaintenanceTimer startTime={m.startTime} endTime={m.endTime} />
                            </div>
                         </div>
                    ))}
                    {finishedList.length === 0 && <p className="text-center text-gray-400 text-xs italic py-4">Histórico vazio.</p>}
                 </div>
             </div>
          </div>

      </div>
    </div>
  );
};

const ScreenArtEmergencial = ({ onSave, employees, editingDoc, settings, onPreview }) => {
  const [header, setHeader] = useState({ 
      taskName: '', om: '', tag: '', activityType: 'Mecânica', location: '', 
      hasPlanning: false, docVersion: 'PRO 0034346 - Anexo 1 - REV 03 - 20/12/2023',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
  });
  const [checkedRisks, setCheckedRisks] = useState({});
  const [riskLocations, setRiskLocations] = useState({}); 
  const [riskControls, setRiskControls] = useState({});
  const [signatures, setSignatures] = useState([]);
  const [maintenanceType, setMaintenanceType] = useState('preventiva');
  const [correctionDescription, setCorrectionDescription] = useState('');

  useEffect(() => {
    if (editingDoc) {
      setHeader({
        taskName: editingDoc.taskName,
        om: editingDoc.om,
        tag: editingDoc.tag,
        activityType: editingDoc.activityType,
        location: editingDoc.location,
        hasPlanning: editingDoc.hasPlanning,
        docVersion: editingDoc.docVersion || header.docVersion,
        date: editingDoc.date || header.date,
        time: editingDoc.time || header.time
      });
      setCheckedRisks(editingDoc.checkedRisks || {});
      setRiskLocations(editingDoc.riskLocations || {});
      setRiskControls(editingDoc.riskControls || {});
      setSignatures(editingDoc.signatures || []);
      setMaintenanceType(editingDoc.maintenanceType || 'preventiva');
      setCorrectionDescription(editingDoc.correctionDescription || '');
    }
  }, [editingDoc]);

  const handleRiskCheck = (index) => {
    const newState = !checkedRisks[index];
    setCheckedRisks(prev => ({ ...prev, [index]: newState }));
    if (!newState) {
      const newLocs = { ...riskLocations };
      delete newLocs[index];
      setRiskLocations(newLocs);
    }
  };

  const handleQuadrantSelect = (index, quadrant) => {
    setRiskLocations(prev => ({ ...prev, [index]: quadrant }));
  };

  const getDocData = () => {
    return {
      ...header,
      type: 'emergencial',
      checkedRisks,
      riskLocations,
      riskControls,
      signatures,
      maintenanceType,
      correctionDescription,
      id: editingDoc ? editingDoc.id : Date.now()
    };
  };

  const handleSubmit = () => {
    if (!header.om || !header.om.trim()) {
        alert("ERRO: O campo OM (Ordem de Manutenção) é OBRIGATÓRIO.");
        return;
    }
    if (!header.tag || !header.tag.trim()) {
        alert("ERRO: O campo TAG do equipamento é OBRIGATÓRIO.");
        return;
    }
    if (!header.taskName) {
        alert("ERRO: O nome da Tarefa é obrigatório.");
        return;
    }
    if (maintenanceType === 'corretiva' && !correctionDescription) {
        alert("Por favor, descreva a manutenção corretiva.");
        return;
    }
    if (signatures.length === 0) {
        alert("ERRO DE VALIDAÇÃO: A assinatura é OBRIGATÓRIA para salvar este documento.");
        return;
    }
    onSave(getDocData());
  };

  const QUADRANTS = ['Frente / Abaixo', 'Atrás / Acima', 'Esquerda', 'Direita'];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded relative">
        {/* Floating Action Button for Saving */}
        <button 
            onClick={handleSubmit} 
            className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-2xl border-4 border-white hover:bg-green-700 z-50 flex items-center gap-2 transition-transform hover:scale-105"
            title="Salvar Formulário"
        >
            <Icons.Save />
            <span className="font-bold">SALVAR</span>
        </button>

      <div className="text-center mb-4">
          <h2 className="text-2xl font-bold bg-yellow-400 p-2 border-2 border-black">ART DE CAMPO EMERGENCIAL</h2>
          <input 
            className="w-full text-center font-bold text-sm border border-gray-300 p-1 mt-1 bg-gray-50"
            value={header.docVersion}
            onChange={e => setHeader({...header, docVersion: e.target.value})}
            placeholder="Versão do Documento (PRO...)"
          />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 border rounded">
        <input placeholder="Tarefa a ser executada" className="border p-2 w-full" value={header.taskName} onChange={e => setHeader({...header, taskName: e.target.value})} />
        <select className="border p-2 w-full" value={header.activityType} onChange={e => setHeader({...header, activityType: e.target.value})}>
            <option>Mecânica</option>
            <option>Elétrica</option>
            <option>Solda</option>
            <option>Lubrificação</option>
            <option>Outros</option>
        </select>
        <div>
            <label className="text-xs font-bold text-red-600 block">OM (Obrigatório)*</label>
            <input placeholder="Número da OM" className="border p-2 w-full border-l-4 border-red-500" value={header.om} onChange={e => setHeader({...header, om: e.target.value})} />
        </div>
        
        <div className="w-full relative">
            <label className="text-xs font-bold text-red-600 block">TAG (Obrigatório)*</label>
            <input list="tagList" placeholder="TAG Equipamento" className="border p-2 w-full border-l-4 border-red-500" value={header.tag} onChange={e => setHeader({...header, tag: e.target.value})} />
            <datalist id="tagList">
                {settings?.tags?.map(t => <option key={t} value={t} />)}
            </datalist>
        </div>
        
        <select className="border p-2 w-full md:col-span-2" value={header.location} onChange={e => setHeader({...header, location: e.target.value})}>
            <option value="">Selecione o Local...</option>
            {settings?.locations?.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        {/* Date and Time Fields */}
        <div>
            <label className="block text-xs font-bold mb-1">Data:</label>
            <input className="border p-2 w-full" value={header.date} onChange={e => setHeader({...header, date: e.target.value})} />
        </div>
        <div>
            <label className="block text-xs font-bold mb-1">Hora:</label>
            <input className="border p-2 w-full" value={header.time} onChange={e => setHeader({...header, time: e.target.value})} />
        </div>
      </div>

      <div className="mb-6 p-4 border bg-blue-50 rounded">
         <label className="font-bold block mb-2">Tipo de Atividade Realizada:</label>
         <div className="flex gap-4 mb-4">
             <label className="flex items-center"><input type="radio" checked={maintenanceType === 'preventiva'} onChange={() => setMaintenanceType('preventiva')} className="mr-2"/> PREVENTIVA</label>
             <label className="flex items-center"><input type="radio" checked={maintenanceType === 'corretiva'} onChange={() => setMaintenanceType('corretiva')} className="mr-2"/> CORRETIVA</label>
         </div>
         {maintenanceType === 'corretiva' && (
             <textarea 
                className="w-full border p-2" 
                placeholder="Descreva a manutenção realizada..."
                value={correctionDescription}
                onChange={e => setCorrectionDescription(e.target.value)}
             />
         )}
      </div>

      <div className="mb-6 p-4 border rounded bg-gray-50">
        <p className="font-bold mb-2">ETAPA DE EXECUÇÃO: Essa tarefa possui PRO ou ART de planejamento? <span className="font-mono font-bold ml-2">{header.hasPlanning ? '[X] SIM  [ ] NÃO' : '[ ] SIM  [X] NÃO'}</span></p>
        <div className="flex gap-4">
            <label className="flex items-center"><input type="radio" checked={header.hasPlanning} onChange={() => setHeader({...header, hasPlanning: true})} className="mr-2"/> SIM</label>
            <label className="flex items-center"><input type="radio" checked={!header.hasPlanning} onChange={() => setHeader({...header, hasPlanning: false})} className="mr-2"/> NÃO</label>
        </div>
      </div>

      <div className="mb-6 border p-4 rounded">
        <h3 className="font-bold text-center mb-2">ANÁLISE 360º (Radar Automático)</h3>
        <RiskRadar risks={riskLocations} />
        <p className="text-center text-xs text-gray-500">Selecione os riscos abaixo e indique o quadrante para preencher o radar.</p>
      </div>

      <div className="space-y-2 mb-6">
        {RISK_LIST_EMERGENCIAL.map((risk, idx) => (
          <div key={idx} className="border p-3 rounded hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
               <label className="flex items-center font-bold cursor-pointer">
                 <input type="checkbox" className="w-5 h-5 mr-2" checked={!!checkedRisks[idx]} onChange={() => handleRiskCheck(idx)} />
                 {idx + 1}. {risk}
               </label>
               {idx >= 19 && checkedRisks[idx] && (
                  <input 
                    placeholder="Descreva o risco..." 
                    className="border p-1 text-sm ml-2 flex-1"
                   />
               )}
            </div>
            
            {checkedRisks[idx] && (
              <div className="ml-7 grid grid-cols-1 md:grid-cols-2 gap-2 bg-yellow-50 p-2 rounded animate-fade-in">
                <div>
                    <label className="text-xs font-bold block mb-1">Quadrante (360º):</label>
                    <select 
                        className="w-full p-1 border text-sm" 
                        value={riskLocations[idx] || ''} 
                        onChange={(e) => handleQuadrantSelect(idx, e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        {QUADRANTS.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold block mb-1">Medida de Controle:</label>
                    <input 
                        className="w-full p-1 border text-sm" 
                        placeholder="Descreva o controle..." 
                        value={riskControls[idx] || ''}
                        onChange={(e) => setRiskControls(prev => ({...prev, [idx]: e.target.value}))}
                    />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <SignatureManager signatures={signatures} setSignatures={setSignatures} employees={employees} />
      
      <div className="mt-6 flex justify-end">
           <p className="text-sm text-gray-500 italic">Utilize o botão flutuante para salvar.</p>
      </div>
    </div>
  );
};

const ScreenArtAtividade = ({ onSave, employees, editingDoc, settings, externalDocs, onPreview }) => {
  const [header, setHeader] = useState({ 
      taskName: '', om: '', tag: '', activityType: 'Mecânica', location: '',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
  });
  const [steps, setSteps] = useState(['']);
  const [principalRisks, setPrincipalRisks] = useState([{risk: '', total: '', level: 'MÉDIA'}]);
  const [controlSummary, setControlSummary] = useState('');
  const [additionalMeasures, setAdditionalMeasures] = useState('');
  const [signatures, setSignatures] = useState([]);
  const [attachedPdfName, setAttachedPdfName] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('preventiva');
  const [correctionDescription, setCorrectionDescription] = useState('');

  useEffect(() => {
    if (editingDoc) {
        setHeader({
            taskName: editingDoc.taskName,
            om: editingDoc.om,
            tag: editingDoc.tag,
            activityType: editingDoc.activityType,
            location: editingDoc.location,
            date: editingDoc.date || header.date,
            time: editingDoc.time || header.time
        });
        setSteps(editingDoc.steps || ['']);
        setPrincipalRisks(editingDoc.principalRisks || [{risk: '', total: '', level: 'MÉDIA'}]);
        setControlSummary(editingDoc.controlSummary || '');
        setAdditionalMeasures(editingDoc.additionalMeasures || '');
        setSignatures(editingDoc.signatures || []);
        setAttachedPdfName(editingDoc.attachedPdfName || '');
        setMaintenanceType(editingDoc.maintenanceType || 'preventiva');
        setCorrectionDescription(editingDoc.correctionDescription || '');
    }
  }, [editingDoc]);

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (i, val) => { const n = [...steps]; n[i] = val; setSteps(n); };
  const removeStep = (i) => { const n = [...steps]; n.splice(i, 1); setSteps(n); };

  const addRisk = () => setPrincipalRisks([...principalRisks, {risk: '', total: '', level: 'MÉDIA'}]);
  const updateRisk = (i, field, val) => { const n = [...principalRisks]; n[i][field] = val; setPrincipalRisks(n); };

  const getDocData = () => {
     return {
         ...header,
         type: 'atividade',
         steps,
         principalRisks,
         controlSummary,
         additionalMeasures,
         signatures,
         attachedPdfName,
         maintenanceType,
         correctionDescription,
         id: editingDoc ? editingDoc.id : Date.now()
     };
  };

  const handleSubmit = () => {
     if (!header.om || !header.om.trim()) {
        alert("ERRO: O campo OM (Ordem de Manutenção) é OBRIGATÓRIO.");
        return;
     }
     if (!header.tag || !header.tag.trim()) {
        alert("ERRO: O campo TAG do equipamento é OBRIGATÓRIO.");
        return;
     }
     if (!header.taskName) {
        alert("ERRO: O nome da Tarefa é obrigatório.");
        return;
     }
     if (maintenanceType === 'corretiva' && !correctionDescription) {
        alert("Por favor, descreva a manutenção corretiva.");
        return;
     }
     if (signatures.length === 0) {
        alert("ERRO DE VALIDAÇÃO: A assinatura é OBRIGATÓRIA para salvar este documento.");
        return;
    }
     onSave(getDocData());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded relative">
       {/* Floating Action Button for Saving */}
        <button 
            onClick={handleSubmit} 
            className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-2xl border-4 border-white hover:bg-green-700 z-50 flex items-center gap-2 transition-transform hover:scale-105"
            title="Salvar Formulário"
        >
            <Icons.Save />
            <span className="font-bold">SALVAR</span>
        </button>

      <h2 className="text-2xl font-bold mb-4 bg-blue-400 text-white p-2 text-center border-2 border-black">ART - ANÁLISE DA ATIVIDADE</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 border rounded">
        <input placeholder="Tarefa a ser executada" className="border p-2 w-full" value={header.taskName} onChange={e => setHeader({...header, taskName: e.target.value})} />
        <select className="border p-2 w-full" value={header.activityType} onChange={e => setHeader({...header, activityType: e.target.value})}>
            <option>Mecânica</option>
            <option>Elétrica</option>
            <option>Solda</option>
            <option>Lubrificação</option>
        </select>
        <div>
            <label className="text-xs font-bold text-red-600 block">OM (Obrigatório)*</label>
            <input placeholder="Número da OM" className="border p-2 w-full border-l-4 border-red-500" value={header.om} onChange={e => setHeader({...header, om: e.target.value})} />
        </div>
        
        <div className="w-full relative">
            <label className="text-xs font-bold text-red-600 block">TAG (Obrigatório)*</label>
            <input list="tagList" placeholder="TAG Equipamento" className="border p-2 w-full border-l-4 border-red-500" value={header.tag} onChange={e => setHeader({...header, tag: e.target.value})} />
            <datalist id="tagList">
                {settings?.tags?.map(t => <option key={t} value={t} />)}
            </datalist>
        </div>

        <select className="border p-2 w-full md:col-span-2" value={header.location} onChange={e => setHeader({...header, location: e.target.value})}>
            <option value="">Selecione o Local...</option>
            {settings?.locations?.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        {/* Date and Time Fields */}
        <div>
            <label className="block text-xs font-bold mb-1">Data:</label>
            <input className="border p-2 w-full" value={header.date} onChange={e => setHeader({...header, date: e.target.value})} />
        </div>
        <div>
            <label className="block text-xs font-bold mb-1">Hora:</label>
            <input className="border p-2 w-full" value={header.time} onChange={e => setHeader({...header, time: e.target.value})} />
        </div>
      </div>

      <div className="mb-6 p-4 border bg-blue-50 rounded">
         <label className="font-bold block mb-2">Tipo de Atividade Realizada:</label>
         <div className="flex gap-4 mb-4">
             <label className="flex items-center"><input type="radio" checked={maintenanceType === 'preventiva'} onChange={() => setMaintenanceType('preventiva')} className="mr-2"/> PREVENTIVA</label>
             <label className="flex items-center"><input type="radio" checked={maintenanceType === 'corretiva'} onChange={() => setMaintenanceType('corretiva')} className="mr-2"/> CORRETIVA</label>
         </div>
         {maintenanceType === 'corretiva' && (
             <textarea 
                className="w-full border p-2" 
                placeholder="Descreva a manutenção realizada..."
                value={correctionDescription}
                onChange={e => setCorrectionDescription(e.target.value)}
             />
         )}
      </div>

      <div className="mb-6 border p-4">
        <h3 className="font-bold mb-2">Passo a Passo da Tarefa</h3>
        {steps.map((step, i) => (
            <div key={i} className="flex mb-2">
                <span className="p-2 font-bold">{i+1}.</span>
                <input className="border p-2 w-full" value={step} onChange={e => updateStep(i, e.target.value)} placeholder="Descreva o passo..." />
                <button onClick={() => removeStep(i)} className="ml-2 text-red-500"><Icons.Trash /></button>
            </div>
        ))}
        <button onClick={addStep} className="text-blue-600 text-sm underline">+ Adicionar Passo</button>
      </div>

      <div className="mb-6 border p-4">
        <h3 className="font-bold mb-2">Principais Riscos</h3>
        {principalRisks.map((r, i) => (
            <div key={i} className="flex gap-2 mb-2">
                <input className="border p-2 flex-grow" placeholder="Risco" value={r.risk} onChange={e => updateRisk(i, 'risk', e.target.value)} />
                <input className="border p-2 w-16" placeholder="Total" value={r.total} onChange={e => updateRisk(i, 'total', e.target.value)} />
                <select className="border p-2" value={r.level} onChange={e => updateRisk(i, 'level', e.target.value)}>
                    <option>BAIXA</option>
                    <option>MÉDIA</option>
                    <option>ALTA</option>
                </select>
            </div>
        ))}
        <button onClick={addRisk} className="text-blue-600 text-sm underline">+ Adicionar Risco</button>
      </div>

      <div className="mb-6">
        <label className="font-bold block">Resumo das Medidas de Controle</label>
        <textarea className="w-full border p-2 h-24" value={controlSummary} onChange={e => setControlSummary(e.target.value)} />
      </div>

      <div className="mb-6">
        <label className="font-bold block">Medidas Adicionais</label>
        <textarea className="w-full border p-2 h-24" value={additionalMeasures} onChange={e => setAdditionalMeasures(e.target.value)} />
      </div>

      <div className="mb-6 border p-4 bg-gray-50">
        <label className="font-bold block mb-2">Anexar PDF da ART (Vincular ART Cadastrada)</label>
        <select 
            className="w-full p-2 border"
            value={attachedPdfName}
            onChange={(e) => setAttachedPdfName(e.target.value)}
        >
            <option value="">-- Selecione uma ART Externa Cadastrada --</option>
            {externalDocs.map(doc => (
                <option key={doc.id} value={`${doc.fileName} (ART: ${doc.artNumber})`}>
                    {doc.fileName} - ART Nº: {doc.artNumber}
                </option>
            ))}
        </select>
        {externalDocs.length === 0 && <p className="text-xs text-red-500 mt-1">Nenhuma ART PDF cadastrada no sistema. Vá em "Cadastrar ART (PDF)".</p>}
        {attachedPdfName && <p className="text-sm text-green-600 mt-1">Anexo Selecionado: {attachedPdfName}</p>}
      </div>

      <SignatureManager signatures={signatures} setSignatures={setSignatures} employees={employees} />

      <div className="mt-6 flex justify-end">
          <p className="text-sm text-gray-500 italic">Utilize o botão flutuante para salvar.</p>
      </div>
    </div>
  );
};

const ScreenChecklist = ({ onSave, employees, editingDoc, preFill, settings, onPreview }) => {
  const [header, setHeader] = useState({ 
      taskName: '', om: '', tag: '', activityType: 'Mecânica', location: '',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
  });
  const [checks, setChecks] = useState({});
  const [obs, setObs] = useState({});
  const [signatures, setSignatures] = useState([]);
  const [maintenanceType, setMaintenanceType] = useState('preventiva');
  const [correctionDescription, setCorrectionDescription] = useState('');

  useEffect(() => {
      if (preFill) {
        setHeader(prev => ({...prev, ...preFill}));
      }
      if (editingDoc) {
          setHeader({
            taskName: editingDoc.taskName,
            om: editingDoc.om,
            tag: editingDoc.tag,
            activityType: editingDoc.activityType,
            location: editingDoc.location,
            date: editingDoc.date || header.date,
            time: editingDoc.time || header.time
          });
          setChecks(editingDoc.checks || {});
          setObs(editingDoc.obs || {});
          setSignatures(editingDoc.signatures || []);
          setMaintenanceType(editingDoc.maintenanceType || 'preventiva');
          setCorrectionDescription(editingDoc.correctionDescription || '');
      }
  }, [editingDoc, preFill]);

  const handleCheck = (key, val) => setChecks(prev => ({...prev, [key]: val}));
  const handleObs = (key, val) => setObs(prev => ({...prev, [key]: val}));

  const getDocData = () => {
      return {
        ...header,
        type: 'checklist',
        checks,
        obs,
        signatures,
        maintenanceType,
        correctionDescription,
        id: editingDoc ? editingDoc.id : Date.now()
    };
  };

  const handleSubmit = () => {
    if (!header.om || !header.om.trim()) {
        alert("ERRO: O campo OM é OBRIGATÓRIO.");
        return;
    }
    if (!header.tag || !header.tag.trim()) {
        alert("ERRO: O campo TAG é OBRIGATÓRIO.");
        return;
    }
    if (maintenanceType === 'corretiva' && !correctionDescription) {
        alert("Por favor, descreva a correção do problema.");
        return;
    }
    if (signatures.length === 0) {
        alert("ERRO DE VALIDAÇÃO: A assinatura é OBRIGATÓRIA para salvar este documento.");
        return;
    }
    onSave(getDocData());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded relative">
       {/* Floating Action Button for Saving */}
        <button 
            onClick={handleSubmit} 
            className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-2xl border-4 border-white hover:bg-green-700 z-50 flex items-center gap-2 transition-transform hover:scale-105"
            title="Salvar e Encerrar"
        >
            <Icons.Save />
            <span className="font-bold">SALVAR</span>
        </button>

      <h2 className="text-2xl font-bold mb-4 bg-gray-700 text-white p-2 text-center border-2 border-black">CHECKLIST DE ENTREGA</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 border rounded">
        <input placeholder="Tarefa" className="border p-2 w-full" value={header.taskName} onChange={e => setHeader({...header, taskName: e.target.value})} />
        <div>
             <label className="text-xs font-bold text-red-600 block">OM (Obrigatório)*</label>
             <input placeholder="OM" className="border p-2 w-full border-l-4 border-red-500" value={header.om} readOnly={!!preFill} onChange={e => setHeader({...header, om: e.target.value})} />
        </div>
        
        <div className="w-full relative">
            <label className="text-xs font-bold text-red-600 block">TAG (Obrigatório)*</label>
            <input list="tagList" placeholder="TAG Equipamento" className="border p-2 w-full border-l-4 border-red-500" value={header.tag} readOnly={!!preFill} onChange={e => setHeader({...header, tag: e.target.value})} />
            <datalist id="tagList">
                {settings?.tags?.map(t => <option key={t} value={t} />)}
            </datalist>
        </div>
        
        <select className="border p-2 w-full" value={header.location} onChange={e => setHeader({...header, location: e.target.value})}>
            <option value="">Selecione o Local...</option>
            {settings?.locations?.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        {/* Date and Time Fields */}
        <div>
            <label className="block text-xs font-bold mb-1">Data:</label>
            <input className="border p-2 w-full" value={header.date} onChange={e => setHeader({...header, date: e.target.value})} />
        </div>
        <div>
            <label className="block text-xs font-bold mb-1">Hora:</label>
            <input className="border p-2 w-full" value={header.time} onChange={e => setHeader({...header, time: e.target.value})} />
        </div>
      </div>

      <div className="mb-6 p-4 border bg-blue-50 rounded">
         <label className="font-bold block mb-2">Tipo de Atividade Realizada:</label>
         <div className="flex gap-4 mb-4">
             <label className="flex items-center"><input type="radio" name="mtype" checked={maintenanceType === 'preventiva'} onChange={() => setMaintenanceType('preventiva')} className="mr-2"/> PREVENTIVA</label>
             <label className="flex items-center"><input type="radio" name="mtype" checked={maintenanceType === 'corretiva'} onChange={() => setMaintenanceType('corretiva')} className="mr-2"/> CORRETIVA</label>
         </div>
         {maintenanceType === 'corretiva' && (
             <textarea 
                className="w-full border p-2" 
                placeholder="Descreva a correção do problema..."
                value={correctionDescription}
                onChange={e => setCorrectionDescription(e.target.value)}
             />
         )}
      </div>

      <div className="space-y-6">
        {SYSTEMS_CHECKLIST.map((sys, idx) => (
            <div key={idx} className="border p-2 rounded">
                <h3 className="font-bold bg-gray-200 p-1 mb-2">{sys.name}</h3>
                {sys.items.map((item, i) => {
                    const key = `${sys.name}-${item}`;
                    return (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 items-center border-b pb-2">
                            <div className="text-sm">{item}</div>
                            <div className="flex gap-2 justify-center">
                                <button onClick={() => handleCheck(key, 'ok')} className={`px-3 py-1 rounded text-xs ${checks[key] === 'ok' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>OK</button>
                                <button onClick={() => handleCheck(key, 'nok')} className={`px-3 py-1 rounded text-xs ${checks[key] === 'nok' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>NOK</button>
                                <button onClick={() => handleCheck(key, 'na')} className={`px-3 py-1 rounded text-xs ${checks[key] === 'na' ? 'bg-gray-400 text-white' : 'bg-gray-200'}`}>N/A</button>
                            </div>
                            <input className="border p-1 text-xs" placeholder="Observação" value={obs[key] || ''} onChange={e => handleObs(key, e.target.value)} />
                        </div>
                    )
                })}
            </div>
        ))}
      </div>

      <SignatureManager signatures={signatures} setSignatures={setSignatures} employees={employees} />

      <div className="mt-6 flex justify-end">
          <p className="text-sm text-gray-500 italic">Utilize o botão flutuante para salvar.</p>
      </div>
    </div>
  );
};

const ScreenExternalArt = ({ onSave, docs, onDelete, editingDoc }) => {
    const [form, setForm] = useState({ taskName: '', artNumber: '', fileName: '', date: new Date().toLocaleDateString('pt-BR'), fileContent: '' });
    
    const externalDocs = docs.filter(d => d.type === 'external');

    useEffect(() => {
        if (editingDoc) {
            setForm({
                taskName: editingDoc.taskName,
                artNumber: editingDoc.artNumber,
                fileName: editingDoc.fileName,
                date: editingDoc.date,
                fileContent: editingDoc.fileContent
            });
        } else {
            setForm({ taskName: '', artNumber: '', fileName: '', date: new Date().toLocaleDateString('pt-BR'), fileContent: '' });
        }
    }, [editingDoc]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setForm({ 
                    ...form, 
                    fileName: file.name,
                    fileContent: ev.target.result as string 
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!form.taskName || !form.fileName || !form.artNumber) {
            alert("Preencha o nome, número da ART e selecione um arquivo.");
            return;
        }
        onSave({
            ...form,
            type: 'external',
            tag: 'N/A',
            om: 'N/A',
            time: new Date().toLocaleTimeString('pt-BR'),
            id: editingDoc ? editingDoc.id : Date.now()
        });
        if (!editingDoc) {
            setForm({ taskName: '', artNumber: '', fileName: '', date: new Date().toLocaleDateString('pt-BR'), fileContent: '' });
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{editingDoc ? 'Editar ART Externa' : 'Cadastrar ART Externa (PDF)'}</h2>
            
            <div className="bg-white p-6 rounded shadow-lg mb-8">
                <h3 className="font-bold mb-4 border-b pb-2">{editingDoc ? 'Editar Dados' : 'Novo Cadastro'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block font-bold mb-1">Nome/Identificação</label>
                        <input className="w-full border p-2" value={form.taskName} onChange={e => setForm({...form, taskName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Número da ART</label>
                        <input className="w-full border p-2" value={form.artNumber} onChange={e => setForm({...form, artNumber: e.target.value})} />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block font-bold mb-2">Selecionar PDF {editingDoc && '(Opcional - manter atual)'}</label>
                    <div className="border-2 border-dashed border-gray-400 p-6 text-center rounded hover:bg-gray-50 cursor-pointer">
                        <input type="file" accept="application/pdf" className="hidden" id="pdf-upload" onChange={handleFileChange} />
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                            <Icons.Upload />
                            <span className="block mt-2 text-sm text-gray-600">{form.fileName || "Clique para selecionar arquivo PDF"}</span>
                        </label>
                    </div>
                    {form.fileContent && (
                        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-inner bg-gray-100">
                            <div className="bg-gray-200 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
                                <span className="text-xs font-bold uppercase text-gray-600 flex items-center">
                                    <Icons.Eye className="w-3 h-3 mr-1"/> Pré-visualização
                                </span>
                                <span className="text-xs text-gray-500">{form.fileName}</span>
                            </div>
                            <iframe 
                                src={form.fileContent} 
                                className="w-full h-[500px]" 
                                title="PDF Preview"
                            ></iframe>
                        </div>
                    )}
                </div>
                <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 rounded">
                    {editingDoc ? 'ATUALIZAR CADASTRO' : 'SALVAR CADASTRO'}
                </button>
            </div>

            {!editingDoc && (
            <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">ARTs Externas Cadastradas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {externalDocs.map(doc => (
                        <div key={doc.id} className="bg-white p-4 rounded shadow border-l-4 border-purple-500 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold">{doc.taskName}</h4>
                                <p className="text-xs text-gray-800 font-bold">Nº ART: {doc.artNumber}</p>
                                <p className="text-xs text-gray-500">Arquivo: {doc.fileName}</p>
                                <p className="text-xs text-gray-400">{doc.date}</p>
                            </div>
                        </div>
                    ))}
                    {externalDocs.length === 0 && <p className="text-gray-500 text-sm">Nenhuma ART externa cadastrada.</p>}
                </div>
            </div>
            )}
        </div>
    );
};

const ScreenHistory = ({ docs, onDelete, onEdit, onView, onDownload, isAdmin, settings, onClearAll, activeMaintenances }) => {
  const groupedDocs = {};
  
  docs.forEach(doc => {
      if (doc.type !== 'external') {
        const mId = doc.maintenanceId || 'legacy';
        if (!groupedDocs[mId]) groupedDocs[mId] = [];
        groupedDocs[mId].push(doc);
      }
  });

  const activeGroups = {};
  const finishedGroups = {};

  Object.keys(groupedDocs).forEach(mId => {
      const maintenance = activeMaintenances?.find(m => m.id === mId);
      if (maintenance && maintenance.status === 'finished') {
          finishedGroups[mId] = groupedDocs[mId];
      } else {
          activeGroups[mId] = groupedDocs[mId];
      }
  });

  const handleSendToNetwork = (doc) => {
    const network = settings?.registeredNetwork;
    if (!network) {
        alert("Nenhuma rede cadastrada nas configurações. Contate o administrador.");
        return;
    }
    const confirmSend = confirm(`Deseja enviar o documento "${doc.tag}" para a rede cadastrada?\nDestino: ${network}`);
    if (confirmSend) {
        alert(`Iniciando envio para ${network}...\n(Simulação: Arquivo transferido com sucesso!)`);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Histórico de Documentos</h2>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <style>{`
            @media print {
                /* Esconde tudo exceto a tabela principal no relatório */
                nav, .sidebar, button, .no-print { display: none !important; }
                body { background: white; }
                .print-only-table { display: block !important; width: 100%; }
            }
        `}</style>
        
        <div className="flex-1 space-y-6">
             <h3 className="font-bold text-gray-500 text-sm border-b pb-2">EM ABERTO / ATIVOS</h3>
            {Object.keys(activeGroups).map(mId => {
                const group = activeGroups[mId];
                const firstDoc = group[0];
                return (
                    <div key={mId} className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center">
                            <div>
                                <span className="font-bold text-lg">OM: {firstDoc.om} | TAG: {firstDoc.tag}</span>
                                <span className="text-sm text-gray-500 ml-2">({firstDoc.date})</span>
                            </div>
                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ID: {mId.slice(-6)}</div>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {group.map(doc => (
                                <div key={doc.id} className="border border-gray-200 rounded shadow-sm flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
                                    <div className="p-4 border-b border-gray-100">
                                        <h3 className="font-bold text-lg text-yellow-600 mb-1 flex items-center">
                                            {doc.type === 'emergencial' ? <Icons.AlertTriangle /> : doc.type === 'atividade' ? <Icons.ClipboardList /> : <Icons.CheckSquare />}
                                            <span className="ml-2">{doc.type === 'emergencial' ? 'ART Emergencial' : doc.type === 'atividade' ? 'ART Atividade' : 'Checklist'}</span>
                                        </h3>
                                        <p className="text-sm font-semibold text-gray-800">{doc.taskName}</p>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center"><Icons.Clock /> <span className="ml-1">{doc.time}</span></p>
                                    </div>
                                    <div className="bg-gray-50 p-2 grid grid-cols-4 gap-1">
                                        <button onClick={() => onView(doc)} className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 flex flex-col items-center justify-center" title="Visualizar">
                                            <Icons.Eye className="w-4 h-4 mb-1" /> <span className="text-[8px] font-bold">VER</span>
                                        </button>
                                        <button onClick={() => onDownload(doc)} className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200 flex flex-col items-center justify-center" title="Baixar PDF">
                                            <Icons.Download className="w-4 h-4 mb-1" /> <span className="text-[8px] font-bold">PDF</span>
                                        </button>
                                        <button onClick={() => handleSendToNetwork(doc)} className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 flex flex-col items-center justify-center" title="Enviar Rede">
                                            <Icons.Cloud className="w-4 h-4 mb-1" /> <span className="text-[8px] font-bold">REDE</span>
                                        </button>
                                        <button onClick={() => onDelete(doc.id)} className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 flex flex-col items-center justify-center" title="Excluir">
                                            <Icons.Trash className="w-4 h-4 mb-1" /> <span className="text-[8px] font-bold">DEL</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
            {Object.keys(activeGroups).length === 0 && <p className="text-center text-gray-500 py-8 italic">Nenhum documento ativo encontrado.</p>}
        </div>

        <div className="w-full lg:w-1/3 border-l lg:pl-6 space-y-6 bg-gray-50 p-4 rounded">
             <h3 className="font-bold text-red-600 text-sm border-b border-red-200 pb-2 flex items-center">
                 <Icons.Lock className="w-4 h-4 mr-2"/> OMs ENCERRADAS (LISTA LATERAL)
             </h3>
             {Object.keys(finishedGroups).map(mId => {
                const group = finishedGroups[mId];
                const firstDoc = group[0];
                return (
                    <div key={mId} className="bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden opacity-90 hover:opacity-100 transition">
                        <div className="bg-red-50 p-2 border-b border-red-100 flex justify-between items-center">
                            <div>
                                <span className="font-bold text-sm text-red-900">OM: {firstDoc.om}</span>
                                <div className="text-[10px] text-red-700">Encerrada</div>
                            </div>
                            <Icons.CheckSquare className="text-red-400 w-4 h-4" />
                        </div>
                        <div className="p-2 space-y-2">
                             {group.map(doc => (
                                <div key={doc.id} className="border border-gray-100 rounded p-2 flex justify-between items-center bg-gray-50">
                                    <div>
                                        <p className="text-xs font-bold">{doc.type.toUpperCase()}</p>
                                        <p className="text-[10px] text-gray-500">{doc.taskName.slice(0,20)}...</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => onView(doc)} className="text-gray-600 hover:bg-gray-200 p-2 rounded" title="Visualizar"><Icons.Eye className="w-4 h-4"/></button>
                                        <button onClick={() => onDownload(doc)} className="text-green-600 hover:bg-green-100 p-2 rounded" title="Baixar"><Icons.Download className="w-4 h-4"/></button>
                                        <button onClick={() => onEdit(doc)} className="text-yellow-600 hover:bg-yellow-100 p-2 rounded" title="Editar"><Icons.Edit className="w-4 h-4"/></button>
                                        <button onClick={() => onDelete(doc.id)} className="text-red-600 hover:bg-red-100 p-2 rounded" title="Excluir"><Icons.Trash className="w-4 h-4"/></button>
                                    </div>
                                </div>
                             ))}
                        </div>
                        <div className="bg-gray-200 text-gray-500 text-center py-1 text-xs font-bold border-t border-gray-300 cursor-not-allowed flex justify-center items-center">
                             <Icons.Lock className="w-3 h-3 mr-1"/> OM ENCERRADA
                        </div>
                    </div>
                )
             })}
             {Object.keys(finishedGroups).length === 0 && <p className="text-center text-gray-400 text-xs italic">Nenhuma OM encerrada.</p>}
        </div>

      </div>
    </div>
  );
};

const ScreenEmployeeRegister = ({ employees, setEmployees, isAdmin }) => {
  const [form, setForm] = useState({ name: '', matricula: '', role: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSave = () => {
    if (editingId) {
        setEmployees(employees.map(e => e.matricula === editingId ? form : e));
        setEditingId(null);
    } else {
        setEmployees([...employees, form]);
    }
    setForm({ name: '', matricula: '', role: '', phone: '' });
  };

  const handleEdit = (emp) => {
      setForm(emp);
      setEditingId(emp.matricula);
  };

  const handleDelete = (matricula) => {
      if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        setEmployees(employees.filter(e => e.matricula !== matricula));
      }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Funcionários</h2>
      
      <div className="bg-white p-4 rounded shadow mb-6 border-l-4 border-yellow-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Nome Completo" className="border p-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="Matrícula" className="border p-2" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} disabled={!!editingId} />
            <input placeholder="Função" className="border p-2" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
            <input placeholder="Telefone" className="border p-2" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded font-bold">
            {editingId ? 'ATUALIZAR' : 'CADASTRAR'}
        </button>
        {editingId && <button onClick={() => {setEditingId(null); setForm({ name: '', matricula: '', role: '', phone: '' })}} className="ml-2 text-red-500 underline">Cancelar</button>}
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-100 border-b">
                <tr>
                    <th className="p-3 text-left">Nome</th>
                    <th className="p-3 text-left">Matrícula</th>
                    <th className="p-3 text-left">Função</th>
                    <th className="p-3 text-right">Ações</th>
                </tr>
            </thead>
            <tbody>
                {employees.map(emp => (
                    <tr key={emp.matricula} className="border-b hover:bg-gray-50">
                        <td className="p-3">{emp.name}</td>
                        <td className="p-3">{emp.matricula}</td>
                        <td className="p-3">{emp.role}</td>
                        <td className="p-3 text-right space-x-2">
                            <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:bg-blue-100 p-2 rounded"><Icons.Edit /></button>
                            <button onClick={() => handleDelete(emp.matricula)} className="text-red-600 hover:bg-red-100 p-2 rounded"><Icons.Trash /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

const ScreenAdminUsers = ({ users, setUsers }) => {
    const [form, setForm] = useState({ name: '', matricula: '', password: '', role: 'user' });
    
    const handleAdd = () => {
        if (users.some(u => u.matricula === form.matricula)) {
            alert('Matrícula já existe!');
            return;
        }
        setUsers([...users, form]);
        setForm({ name: '', matricula: '', password: '', role: 'user' });
    };

    const handleDelete = (mat) => {
        if (mat === 'admin') { 
            alert('O administrador principal não pode ser excluído por segurança.'); 
            return; 
        }
        if (confirm('Excluir este usuário do sistema?')) {
            setUsers(users.filter(u => u.matricula !== mat));
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Gestão de Usuários do Sistema</h2>
            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-bold mb-2">Novo Usuário</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                    <input placeholder="Nome" className="border p-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input placeholder="Matrícula (Login)" className="border p-2" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} />
                    <input placeholder="Senha" type="password" className="border p-2" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                    <select className="border p-2" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded font-bold">Adicionar Usuário</button>
            </div>

            <div className="bg-white rounded shadow">
                {users.map(u => (
                    <div key={u.matricula} className="p-3 border-b flex justify-between items-center hover:bg-gray-50">
                        <div>
                            <span className="font-bold">{u.name}</span> ({u.matricula}) - <span className="text-xs bg-gray-200 px-1 rounded">{u.role}</span>
                        </div>
                        <button onClick={() => handleDelete(u.matricula)} className="text-red-600 hover:bg-red-100 p-2 rounded"><Icons.Trash /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ScreenAdminSettings = ({ 
    settings, setSettings, 
    employees, setEmployees, 
    users, setUsers,
    docs, onSaveExternal, onDeleteDoc, editingDoc,
    activeTab, setActiveTab,
    serverIp, setServerIp
}) => {
    const [newTag, setNewTag] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [networkPath, setNetworkPath] = useState('');
    const [localIp, setLocalIp] = useState('');

    useEffect(() => {
        if (settings.registeredNetwork) setNetworkPath(settings.registeredNetwork);
        if (serverIp) setLocalIp(serverIp);
    }, [settings, serverIp]);

    const addTag = () => {
        if(newTag && !settings.tags?.includes(newTag)) {
            setSettings({...settings, tags: [...(settings.tags || []), newTag]});
            setNewTag('');
        }
    };
    const removeTag = (tag) => {
        setSettings({...settings, tags: settings.tags.filter(t => t !== tag)});
    };

    const addLocation = () => {
        if(newLocation && !settings.locations?.includes(newLocation)) {
            setSettings({...settings, locations: [...(settings.locations || []), newLocation]});
            setNewLocation('');
        }
    };
    const removeLocation = (loc) => {
        setSettings({...settings, locations: settings.locations.filter(l => l !== loc)});
    };

    const handleSaveNetwork = () => {
        setSettings({...settings, registeredNetwork: networkPath});
        alert("Caminho da Rede Salvo!");
    };
    
    const handleSaveIp = () => {
        setServerIp(localIp);
        alert("IP do Servidor/Rede Atualizado!");
    }

    const tabs = [
        { id: 'general', label: 'Geral / Rede e IP', icon: Icons.Settings },
        { id: 'employees', label: 'Funcionários', icon: Icons.Users },
        { id: 'users', label: 'Usuários', icon: Icons.User },
        { id: 'external_art', label: 'Cadastrar ART (PDF)', icon: Icons.Upload },
    ];

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="mb-6 border-b border-gray-300 flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-6 py-3 font-bold text-sm rounded-t-lg transition-colors ${activeTab === tab.id ? 'bg-black text-yellow-400' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    >
                        <tab.icon className="w-4 h-4 mr-2"/> {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'general' && (
                    <div className="max-w-4xl mx-auto animate-fade-in">
                        
                        {/* Network Config */}
                         <div className="bg-blue-50 border border-blue-200 p-6 rounded shadow mb-6">
                            <h3 className="font-bold mb-4 border-b border-blue-200 pb-2 text-lg text-blue-800 flex items-center">
                                <Icons.Wifi className="mr-2" /> Conectividade e Rede
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">IP do Servidor (Sincronização):</label>
                                    <div className="flex gap-2">
                                        <input 
                                            className="border p-2 flex-1" 
                                            placeholder="Ex: 192.168.0.10" 
                                            value={localIp} 
                                            onChange={e => setLocalIp(e.target.value)} 
                                        />
                                        <button onClick={handleSaveIp} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
                                            SALVAR IP
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Configure o mesmo IP em todos os dispositivos (Celular, Tablet, PC) para simular conexão.</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold mb-1">Caminho de Rede (Backup):</label>
                                    <div className="flex gap-2">
                                        <input 
                                            className="border p-2 flex-1" 
                                            placeholder="Ex: \\servidor\arquivos" 
                                            value={networkPath} 
                                            onChange={e => setNetworkPath(e.target.value)} 
                                        />
                                        <button onClick={handleSaveNetwork} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
                                            SALVAR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded shadow">
                                <h3 className="font-bold mb-2 border-b pb-2">Locais de Trabalho</h3>
                                <div className="flex gap-2 mb-4">
                                    <input 
                                        className="border p-2 flex-1" 
                                        placeholder="Ex: OFICINA, MINA..." 
                                        value={newLocation} 
                                        onChange={e => setNewLocation(e.target.value)} 
                                    />
                                    <button onClick={addLocation} className="bg-green-600 text-white px-3 py-2 rounded">Add</button>
                                </div>
                                <ul className="space-y-1">
                                    {settings.locations?.map(loc => (
                                        <li key={loc} className="flex justify-between bg-gray-50 p-2 rounded">
                                            <span>{loc}</span>
                                            <button onClick={() => removeLocation(loc)} className="text-red-500 font-bold">X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded shadow">
                                <h3 className="font-bold mb-2 border-b pb-2">Tags de Equipamentos (Sugestões)</h3>
                                <div className="flex gap-2 mb-4">
                                    <input 
                                        className="border p-2 flex-1" 
                                        placeholder="Ex: TR-01, ES-05..." 
                                        value={newTag} 
                                        onChange={e => setNewTag(e.target.value)} 
                                    />
                                    <button onClick={addTag} className="bg-green-600 text-white px-3 py-2 rounded">Add</button>
                                </div>
                                <ul className="space-y-1 max-h-60 overflow-y-auto">
                                    {settings.tags?.map(tag => (
                                        <li key={tag} className="flex justify-between bg-gray-50 p-2 rounded">
                                            <span>{tag}</span>
                                            <button onClick={() => removeTag(tag)} className="text-red-500 font-bold">X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'employees' && (
                    <ScreenEmployeeRegister employees={employees} setEmployees={setEmployees} isAdmin={true} />
                )}

                {activeTab === 'users' && (
                    <ScreenAdminUsers users={users} setUsers={setUsers} />
                )}

                {activeTab === 'external_art' && (
                    <ScreenExternalArt onSave={onSaveExternal} docs={docs} onDelete={onDeleteDoc} editingDoc={editingDoc} />
                )}
            </div>
        </div>
    );
};

const ScreenFileDocuments = ({ docs, onView, onDownload, onEdit, onDelete, onSendNetwork }) => {
    const [search, setSearch] = useState('');

    const filtered = docs.filter(d => 
        (d.taskName?.toLowerCase().includes(search.toLowerCase()) ||
        d.om?.toLowerCase().includes(search.toLowerCase()) ||
        d.tag?.toLowerCase().includes(search.toLowerCase()) ||
        d.fileName?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center"><Icons.Folder className="mr-2"/> ARQUIVO DOCUMENTOS</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Pesquisar (OM, TAG, Nome)..." 
                        className="border p-2 rounded w-64 pl-8"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Icons.FileText className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded shadow overflow-hidden flex-1 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3 text-center w-12">Tipo</th>
                            <th className="p-3 text-left">Identificação</th>
                            <th className="p-3 text-left">Detalhes</th>
                            <th className="p-3 text-left">Data/Hora</th>
                            <th className="p-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(doc => (
                            <tr key={doc.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-center">
                                    {doc.type === 'emergencial' && <Icons.AlertTriangle className="text-yellow-600 mx-auto" />}
                                    {doc.type === 'atividade' && <Icons.ClipboardList className="text-blue-600 mx-auto" />}
                                    {doc.type === 'checklist' && <Icons.CheckSquare className="text-green-600 mx-auto" />}
                                    {doc.type === 'external' && <Icons.Upload className="text-purple-600 mx-auto" />}
                                </td>
                                <td className="p-3">
                                    <div className="font-bold">{doc.taskName}</div>
                                    <div className="text-xs text-gray-500">ID: {doc.id}</div>
                                </td>
                                <td className="p-3">
                                    {doc.om !== 'N/A' && <div><span className="font-bold">OM:</span> {doc.om}</div>}
                                    {doc.tag !== 'N/A' && <div><span className="font-bold">TAG:</span> {doc.tag}</div>}
                                    {doc.artNumber && <div><span className="font-bold">ART:</span> {doc.artNumber}</div>}
                                </td>
                                <td className="p-3">
                                    <div>{doc.date}</div>
                                    <div className="text-xs text-gray-500">{doc.time}</div>
                                </td>
                                <td className="p-3 text-center space-x-1">
                                    <button onClick={() => onView(doc)} className="bg-gray-200 hover:bg-gray-300 p-2 rounded" title="Visualizar"><Icons.Eye className="w-4 h-4"/></button>
                                    <button onClick={() => onDownload(doc)} className="bg-green-100 hover:bg-green-200 p-2 rounded text-green-700" title="Baixar PDF"><Icons.Download className="w-4 h-4"/></button>
                                    <button onClick={() => onSendNetwork(doc)} className="bg-purple-100 hover:bg-purple-200 p-2 rounded text-purple-700" title="Enviar Rede"><Icons.Cloud className="w-4 h-4"/></button>
                                    <button onClick={() => onEdit(doc)} className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded" title="Editar"><Icons.Edit className="w-4 h-4"/></button>
                                    <button onClick={() => onDelete(doc.id)} className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded" title="Excluir"><Icons.Trash className="w-4 h-4"/></button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400 italic">Nenhum documento encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Sidebar = ({ user, activeScreen, onNavigate, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início / Monitor', icon: Icons.Home },
    { id: 'art_emergencial', label: 'ART Emergencial', icon: Icons.AlertTriangle },
    { id: 'art_atividade', label: 'ART Atividade', icon: Icons.ClipboardList },
    { id: 'checklist', label: 'Checklist / Encerrar', icon: Icons.CheckSquare },
    { id: 'history', label: 'Histórico Documentos', icon: Icons.FileText },
    { id: 'file_documents', label: 'ARQUIVO DOCUMENTOS', icon: Icons.Folder },
    { id: 'admin_settings', label: 'Configurações', icon: Icons.Settings },
  ];

  return (
    <div className="w-64 bg-zinc-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl print:hidden z-40 md:translate-x-0 transition-transform -translate-x-full md:block hidden">
      <div className="p-6 border-b border-zinc-800 flex items-center justify-center bg-yellow-500 text-black">
        <h1 className="text-2xl font-bold tracking-tighter">ART SYSTEM</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center p-4 hover:bg-zinc-800 transition ${activeScreen === item.id ? 'bg-zinc-800 border-r-4 border-yellow-500' : ''}`}
            >
              <span className="mr-3 text-yellow-500"><item.icon /></span>
              {item.label}
            </button>
          )
        )}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <div className="mb-4">
            <p className="font-bold text-sm">{user.name}</p>
            <p className="text-xs text-gray-400">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 p-2 rounded font-bold text-sm">
          <span className="mr-2"><Icons.LogOut /></span> SAIR
        </button>
      </div>
    </div>
  );
};

// Mobile Sidebar
const MobileSidebar = ({ user, activeScreen, onNavigate, onLogout, isOpen, onClose }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Início / Monitor', icon: Icons.Home },
        { id: 'art_emergencial', label: 'ART Emergencial', icon: Icons.AlertTriangle },
        { id: 'art_atividade', label: 'ART Atividade', icon: Icons.ClipboardList },
        { id: 'checklist', label: 'Checklist / Encerrar', icon: Icons.CheckSquare },
        { id: 'history', label: 'Histórico Documentos', icon: Icons.FileText },
        { id: 'file_documents', label: 'ARQUIVO DOCUMENTOS', icon: Icons.Folder },
        { id: 'admin_settings', label: 'Configurações', icon: Icons.Settings },
    ];

    return (
        <div className={`fixed inset-0 z-50 md:hidden ${isOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="absolute left-0 top-0 w-64 bg-zinc-900 text-white h-full flex flex-col shadow-2xl transition-transform transform translate-x-0">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-yellow-500 text-black">
                     <h1 className="text-xl font-bold tracking-tighter">ART SYSTEM</h1>
                     <button onClick={onClose}><Icons.X className="w-5 h-5"/></button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    {menuItems.map(item => (
                        <button 
                        key={item.id}
                        onClick={() => { onNavigate(item.id); onClose(); }}
                        className={`w-full flex items-center p-4 hover:bg-zinc-800 transition ${activeScreen === item.id ? 'bg-zinc-800 border-r-4 border-yellow-500' : ''}`}
                        >
                        <span className="mr-3 text-yellow-500"><item.icon /></span>
                        {item.label}
                        </button>
                    )
                    )}
                </div>
                <div className="p-4 border-t border-zinc-800">
                    <div className="mb-4">
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 p-2 rounded font-bold text-sm">
                        <span className="mr-2"><Icons.LogOut /></span> SAIR
                    </button>
                </div>
            </div>
        </div>
    );
}

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => getLocalStorage('users', []));
  const [employees, setEmployees] = useState(() => getLocalStorage('employees', []));
  const [docs, setDocs] = useState(() => getLocalStorage('documents', []));
  const [activeMaintenances, setActiveMaintenances] = useState(() => getLocalStorage('active_maintenances', []));
  
  const [settings, setSettings] = useState(() => {
      const initial = getLocalStorage('settings', { 
          locations: ['OFICINA', 'MINA'], 
          tags: [] 
      });
      if (!initial.networkPath) initial.networkPath = '';
      if (!initial.scpTarget) initial.scpTarget = '';
      return initial;
  });

  const [serverIp, setServerIp] = useState(() => getLocalStorage('server_ip', '127.0.0.1'));

  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [editingDoc, setEditingDoc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [settingsTab, setSettingsTab] = useState('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setLocalStorage('users', users), [users]);
  useEffect(() => setLocalStorage('employees', employees), [employees]);
  useEffect(() => setLocalStorage('documents', docs), [docs]);
  useEffect(() => setLocalStorage('active_maintenances', activeMaintenances), [activeMaintenances]);
  useEffect(() => setLocalStorage('settings', settings), [settings]);
  useEffect(() => setLocalStorage('server_ip', serverIp), [serverIp]);

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => setUser(null);

  // Function to refresh data from storage (simulating network sync)
  const refreshData = () => {
      const storedMaintenances = getLocalStorage('active_maintenances', []);
      const storedDocs = getLocalStorage('documents', []);
      // Only update if different to prevent re-renders loop if we were using real state comparison, 
      // but for this mock, setting state triggers re-render which is what we want for timer updates
      setActiveMaintenances(storedMaintenances);
      setDocs(storedDocs);
  };

  const handleSaveDoc = (docData) => {
    // Logic to handle maintenance lifecycle and linking
    let updatedMaintenances = [...activeMaintenances];
    let newMaintenanceId = docData.maintenanceId;

    // If editing, use existing ID. If new, determine if part of active or new maintenance
    if (editingDoc && editingDoc.maintenanceId) {
        // Just update
        newMaintenanceId = editingDoc.maintenanceId;
    } else if (docData.type !== 'external') {
        // Check if there is an active maintenance for this TAG+OM combo?
        // Or simply create a new one if not provided (ART starts maintenance)
        if (docData.type === 'emergencial' || docData.type === 'atividade') {
            // START MAINTENANCE
            // Check for existing active by TAG/OM to prevent duplicates if logic requires, 
            // but here we assume new ART = New Maintenance unless ID passed (not implemented in UI yet to select existing)
            // So for now, ART always creates new maintenance ID based on doc ID
            newMaintenanceId = `MNT-${docData.id}`;
            
            // Create maintenance record
            const maintenanceRecord = {
                id: newMaintenanceId,
                startTime: new Date().toISOString(),
                status: 'active',
                userId: user.matricula,
                userName: user.name,
                tag: docData.tag,
                om: docData.om,
                taskName: docData.taskName,
                type: docData.type
            };
            updatedMaintenances.push(maintenanceRecord);
        } else if (docData.type === 'checklist') {
           // Checklist usually closes maintenance. It should ideally link to an active one.
           // For simplicity, if no ID linked, we treat as standalone or auto-link to last active of same tag?
           // Current simple logic: check if we are editing or if we can find an active one.
           const activeM = activeMaintenances.find(m => m.tag === docData.tag && m.om === docData.om && m.status !== 'finished');
           if (activeM) {
               newMaintenanceId = activeM.id;
           } else {
               newMaintenanceId = `MNT-${docData.id}`; // Standalone checklist
               updatedMaintenances.push({
                   id: newMaintenanceId,
                   startTime: new Date().toISOString(),
                   status: 'active',
                   userId: user.matricula,
                   userName: user.name,
                   tag: docData.tag,
                   om: docData.om,
                   taskName: docData.taskName,
                   type: 'checklist'
               });
           }
        }
    }

    const newDoc = { ...docData, maintenanceId: newMaintenanceId };

    if (editingDoc) {
        setDocs(docs.map(d => d.id === editingDoc.id ? newDoc : d));
        
        // Update maintenance info if header changed
        if (newDoc.maintenanceId) {
             const mIndex = updatedMaintenances.findIndex(m => m.id === newDoc.maintenanceId);
             if (mIndex >= 0) {
                 updatedMaintenances[mIndex] = {
                     ...updatedMaintenances[mIndex],
                     tag: newDoc.tag,
                     om: newDoc.om,
                     taskName: newDoc.taskName
                 };
             }
        }
    } else {
        setDocs([...docs, newDoc]);
    }
    
    setActiveMaintenances(updatedMaintenances);
    setEditingDoc(null);
    setCurrentScreen('dashboard');
    alert("Documento Salvo com Sucesso!");
  };

  const handleFinishMaintenance = (maintenance) => {
      if (maintenance.userId !== user.matricula) {
          alert(`Apenas o responsável (${maintenance.userId}) pode encerrar esta manutenção.`);
          return;
      }
      // Go to checklist screen pre-filled
      setEditingDoc(null); // Clear any edit state
      setCurrentScreen('checklist');
      // We pass pre-fill data via prop to screen, but since state is in App, we can use a temp state or just pass prop
      // We will use a special prop on ScreenChecklist called 'preFill'
  };
  
  // We need a state for pre-fill to pass to Checklist when finishing maintenance
  const [checklistPreFill, setChecklistPreFill] = useState(null);
  
  const triggerFinish = (maintenance) => {
      if (maintenance.userId !== user.matricula) return;
      setChecklistPreFill({
          om: maintenance.om,
          tag: maintenance.tag,
          taskName: maintenance.taskName,
          maintenanceId: maintenance.id // Pass ID to link
      });
      setCurrentScreen('checklist');
  };
  
  // Intercept checklist save to finish maintenance
  const handleChecklistSave = (docData) => {
      // Save doc
      let updatedMaintenances = [...activeMaintenances];
      let mId = docData.maintenanceId;
      
      // Find maintenance and close it
      if (mId) {
          const idx = updatedMaintenances.findIndex(m => m.id === mId);
          if (idx >= 0) {
              updatedMaintenances[idx] = {
                  ...updatedMaintenances[idx],
                  status: 'finished',
                  endTime: new Date().toISOString()
              };
          }
      } else {
          // Check if there is an active maintenance for this TAG+OM combo?
          // or look up by OM/TAG
           const idx = updatedMaintenances.findIndex(m => m.tag === docData.tag && m.om === docData.om && m.status !== 'finished');
           if (idx >= 0) {
               mId = updatedMaintenances[idx].id;
               updatedMaintenances[idx] = { ...updatedMaintenances[idx], status: 'finished', endTime: new Date().toISOString() };
           }
      }
      
      const finalDoc = { ...docData, maintenanceId: mId };
      setDocs([...docs, finalDoc]);
      setActiveMaintenances(updatedMaintenances);
      setChecklistPreFill(null);
      setCurrentScreen('dashboard');
      alert("Manutenção Encerrada com Sucesso!");
  };

  const handleDeleteDoc = (id) => {
      if(confirm("ATENÇÃO: Deseja realmente excluir este documento permanentemente?")) {
          const doc = docs.find(d => d.id === id);
          setDocs(docs.filter(d => d.id !== id));
          
          // If it was the starter of a maintenance, should we delete the maintenance record?
          // Maybe if it's the only doc? For now, keep it simple.
          // If it's an active maintenance, maybe remove it from monitor?
          if (doc && doc.maintenanceId) {
              // Check if any other docs exist for this maintenance
              const others = docs.filter(d => d.maintenanceId === doc.maintenanceId && d.id !== id);
              if (others.length === 0) {
                  setActiveMaintenances(activeMaintenances.filter(m => m.id !== doc.maintenanceId));
              }
          }
      }
  };

  const handleEditDoc = (doc) => {
      if (doc.type === 'external') {
          // Redirect to admin settings tab for external art
          setEditingDoc(doc);
          setSettingsTab('external_art');
          setCurrentScreen('admin_settings');
          return;
      }
      setEditingDoc(doc);
      if (doc.type === 'emergencial') setCurrentScreen('art_emergencial');
      else if (doc.type === 'atividade') setCurrentScreen('art_atividade');
      else if (doc.type === 'checklist') setCurrentScreen('checklist');
  };

  const handleViewDoc = (doc) => {
      setViewingDoc({...doc, autoPrint: false});
  };

  const handleDownloadDoc = (doc) => {
      if (doc.type === 'external' && doc.fileContent) {
          // Direct download for external
          alert("O sistema irá abrir a janela de salvar arquivo.");
           if (doc.fileContent.startsWith('data:')) {
                fetch(doc.fileContent)
                .then(res => res.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = doc.fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch(() => alert('Erro ao processar arquivo.'));
            } else {
                // Legacy support
                const link = document.createElement('a');
                link.href = doc.fileContent;
                link.download = doc.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
      } else {
          // Open viewer to print/save
          setViewingDoc({...doc, autoPrint: false});
      }
  };

  const handleClearAllHistory = () => {
      if (confirm("TEM CERTEZA ABSOLUTA? Isso apagará TODOS os documentos e histórico do sistema.")) {
          if (confirm("Confirmação final: Todos os dados serão perdidos.")) {
              setDocs([]);
              setActiveMaintenances([]);
              alert("Sistema limpo com sucesso.");
          }
      }
  };

  const handleSaveExternal = (doc) => {
      if (editingDoc) {
          setDocs(docs.map(d => d.id === editingDoc.id ? doc : d));
          setEditingDoc(null);
      } else {
          setDocs([...docs, doc]);
      }
      alert("Documento Externo Salvo!");
  };
  
  const handleSendNetwork = (doc) => {
      const net = settings.registeredNetwork;
      if (!net) { alert("Configure a Rede nas Configurações."); return; }
      if(confirm(`Enviar para ${net}?`)) alert("Enviado!");
  }

  if (!user) return <ScreenLogin onLogin={handleLogin} users={users} setUsers={setUsers} serverIp={serverIp} setServerIp={setServerIp} />;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar 
        user={user} 
        activeScreen={currentScreen} 
        onNavigate={(screen) => {
            setCurrentScreen(screen);
            setEditingDoc(null);
            setChecklistPreFill(null);
            if (screen === 'admin_settings') setSettingsTab('general');
        }} 
        onLogout={handleLogout} 
      />
      
      <MobileSidebar 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        activeScreen={currentScreen}
        onNavigate={(screen) => {
            setCurrentScreen(screen);
            setEditingDoc(null);
            setChecklistPreFill(null);
            if (screen === 'admin_settings') setSettingsTab('general');
        }}
        onLogout={handleLogout}
      />

      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-zinc-900 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center">
                <button onClick={() => setMobileMenuOpen(true)} className="mr-4"><Icons.Menu /></button>
                <span className="font-bold text-yellow-500">ART SYSTEM</span>
            </div>
            <span className="text-xs">{user.name}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
            {currentScreen === 'dashboard' && (
                <ScreenDashboard 
                    currentUser={user} 
                    activeMaintenances={activeMaintenances} 
                    onFinishMaintenance={triggerFinish}
                    serverIp={serverIp}
                    refreshData={refreshData}
                />
            )}
            {currentScreen === 'art_emergencial' && (
                <ScreenArtEmergencial 
                    onSave={handleSaveDoc} 
                    employees={employees} 
                    editingDoc={editingDoc}
                    settings={settings}
                    onPreview={handleViewDoc}
                />
            )}
            {currentScreen === 'art_atividade' && (
                <ScreenArtAtividade 
                    onSave={handleSaveDoc} 
                    employees={employees} 
                    editingDoc={editingDoc}
                    settings={settings}
                    externalDocs={docs.filter(d => d.type === 'external')}
                    onPreview={handleViewDoc}
                />
            )}
            {currentScreen === 'checklist' && (
                <ScreenChecklist 
                    onSave={handleChecklistSave} 
                    employees={employees} 
                    editingDoc={editingDoc}
                    preFill={checklistPreFill}
                    settings={settings}
                    onPreview={handleViewDoc}
                />
            )}
            {currentScreen === 'history' && (
                <ScreenHistory 
                    docs={docs} 
                    onDelete={handleDeleteDoc} 
                    onEdit={handleEditDoc}
                    onView={handleViewDoc}
                    onDownload={handleDownloadDoc}
                    isAdmin={true}
                    settings={settings}
                    onClearAll={handleClearAllHistory}
                    activeMaintenances={activeMaintenances}
                />
            )}
            {currentScreen === 'file_documents' && (
                <ScreenFileDocuments 
                    docs={docs}
                    onView={handleViewDoc}
                    onDownload={handleDownloadDoc}
                    onEdit={handleEditDoc}
                    onDelete={handleDeleteDoc}
                    onSendNetwork={handleSendNetwork}
                />
            )}
            {currentScreen === 'admin_settings' && (
                <ScreenAdminSettings 
                    settings={settings} setSettings={setSettings}
                    employees={employees} setEmployees={setEmployees}
                    users={users} setUsers={setUsers}
                    docs={docs} onSaveExternal={handleSaveExternal} onDeleteDoc={handleDeleteDoc} editingDoc={editingDoc}
                    activeTab={settingsTab} setActiveTab={setSettingsTab}
                    serverIp={serverIp} setServerIp={setServerIp}
                />
            )}
        </div>
      </div>

      {viewingDoc && (
        <PrintTemplate 
            data={viewingDoc} 
            type={viewingDoc.type} 
            onClose={() => setViewingDoc(null)} 
            settings={settings}
        />
      )}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);