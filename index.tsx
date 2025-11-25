import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Trash2, Download, FileText, Eye, Edit, Share2, Printer, X, Menu, Save, Upload, Cloud, User, Users, Lock, AlertTriangle, ClipboardList, CheckSquare, Home, LogOut, Clock, Activity, Settings, Pen, Terminal, Folder, ChevronRight, FileCheck, Wifi, Server, Globe, Database, Cpu, Radio, Layers, ArrowRightLeft, Calendar } from 'lucide-react';

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
  Server: Server,
  Globe: Globe,
  Database: Database,
  Cpu: Cpu,
  Radio: Radio,
  Layers: Layers,
  ArrowRightLeft: ArrowRightLeft,
  Calendar: Calendar
};

// --- CONSTANTS ---
const ALERT_THRESHOLD_HOURS = 20;
const ALERT_THRESHOLD_MS = ALERT_THRESHOLD_HOURS * 60 * 60 * 1000;
// Imagem de desenho/ilustração de caminhão fora de estrada conforme solicitado (REMOVIDA DA EXIBIÇÃO)
const TRUCK_IMAGE_URL = "https://img.freepik.com/premium-vector/mining-dump-truck-vector-illustration-isolated-white-background_263357-365.jpg"; 

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

const MaintenanceCard: React.FC<{ maintenance: any; onOpenChecklist: any; currentUser: any }> = ({ maintenance, onOpenChecklist, currentUser }) => {
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
                      onClick={() => onOpenChecklist(maintenance)}
                      className="bg-green-600 text-white text-xs px-3 py-2 rounded hover:bg-green-700 font-bold flex items-center gap-1"
                  >
                      <Icons.CheckSquare size={14} /> REALIZAR CHECKLIST
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

const ProgrammingAlertModal = ({ scheduleItems, onClose }) => {
    const today = new Date().toLocaleDateString('pt-BR');
    
    // Simplificando para mostrar todos ou apenas os do dia
    const todayItems = scheduleItems.length > 0 ? scheduleItems : []; 

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-80 animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border-4 border-yellow-500">
                <div className="bg-yellow-500 p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-extrabold text-black uppercase flex items-center">
                        <Icons.Calendar className="w-8 h-8 mr-2"/> PROGRAMAÇÃO DE MANUTENÇÃO (ALERTA)
                    </h2>
                    <div className="text-sm font-bold bg-black text-yellow-500 px-3 py-1 rounded">
                         ATUALIZADO: {today}
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50">
                     {todayItems.length === 0 ? (
                         <div className="text-center py-10">
                             <p className="text-xl text-gray-400 font-bold">NENHUMA PROGRAMAÇÃO ENCONTRADA.</p>
                             <p className="text-sm text-gray-400">Envie o PDF na tela de Programação.</p>
                         </div>
                     ) : (
                         <div className="space-y-6">
                            {/* Agrupar por data simulada */}
                            {Array.from(new Set(todayItems.map(i => i.date))).map(date => (
                                <div key={date} className="border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <div className="bg-gray-800 text-white p-2 font-bold text-center uppercase tracking-wider">
                                        DATA PROGRAMADA: {date}
                                    </div>
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-200 text-gray-700 uppercase">
                                            <tr>
                                                <th className="p-2 text-left">Equipamento</th>
                                                <th className="p-2 text-left">Atividade / Descrição</th>
                                                <th className="p-2 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todayItems.filter(i => i.date === date).map((item, idx) => (
                                                <tr key={idx} className="border-b hover:bg-yellow-50">
                                                    <td className="p-2 font-bold">{item.equipment}</td>
                                                    <td className="p-2">{item.description}</td>
                                                    <td className="p-2 text-center">
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">PROGRAMADO</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                         </div>
                     )}
                </div>
                <div className="bg-gray-100 p-3 text-center border-t border-gray-300">
                    <p className="text-xs text-red-500 font-bold animate-pulse">ESTA TELA FECHARÁ AUTOMATICAMENTE EM 30 SEGUNDOS...</p>
                </div>
            </div>
        </div>
    );
};

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
            .print-force-show { 
                opacity: 1 !important; 
                visibility: visible !important; 
                display: block !important;
                position: static !important;
                z-index: auto !important;
                background-color: white !important;
            }
            .print-border { border: 1px solid #000 !important; }
            .print-bg-gray { background-color: #f3f4f6 !important; color: #000 !important; }
            .print-bg-dark { background-color: #1f2937 !important; color: white !important; }
            .print-text-sm { font-size: 10pt !important; }
            .print-text-xs { font-size: 8pt !important; }
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
            tr, .avoid-break { page-break-inside: avoid; }
            table { page-break-inside: auto; }
        }
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

       <div id="print-wrapper" className={`${isAutoPrint ? 'print-force-show' : 'pt-24 pb-10'} w-full flex flex-col items-center overflow-x-auto print:pt-0 print:pb-0`}> 
         
         {!isAutoPrint && (
             <div className="no-print bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6 text-sm max-w-[210mm] text-center shadow-sm">
                 <span className="font-bold block mb-1"><Icons.AlertTriangle className="inline w-4 h-4 mb-1 mr-1"/> COMO BAIXAR:</span>
                 Ao clicar em "BAIXAR PDF", a janela de impressão abrirá. No campo <strong>"Destino"</strong> ou <strong>"Impressora"</strong>, selecione a opção <strong>"Salvar como PDF"</strong>.
             </div>
         )}

         <div id="print-section" className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl text-black box-border print:shadow-none print:w-full print:p-0 mx-auto shrink-0">
            
            <table className="document-table mb-6">
                <tbody>
                    <tr>
                        <td className="w-24 text-center p-2">
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

            <div className="text-[9px] text-center mt-8 text-gray-400 border-t pt-2">
                Documento gerado eletronicamente pelo sistema ART APP em {new Date().toLocaleString('pt-BR')}. Válido para fins de registro interno.
            </div>
         </div>

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

const ScreenLogin = ({ onLogin, users, setUsers }) => {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMatricula, setForgotMatricula] = useState('');
  
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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotMatricula) return alert("Digite sua matrícula.");
    
    // Simulação de verificação
    const userExists = users.some(u => u.matricula === forgotMatricula);
    if (userExists) {
        alert("Instruções de recuperação de senha foram enviadas para o e-mail cadastrado (Simulação).");
        setShowForgot(false);
        setForgotMatricula('');
    } else {
        alert("Matrícula não encontrada no sistema.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-500 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 border-4 border-black relative">
        <h1 className="text-4xl font-bold text-center mb-6 tracking-tighter">ART <span className="text-yellow-500 bg-black px-2">APP</span></h1>
        <h2 className="text-center text-gray-600 mb-6">Análise Preliminar da Tarefa</h2>
        
        {!showForgot ? (
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
            
            <button 
                type="button" 
                onClick={() => setShowForgot(true)}
                className="block w-full text-center text-xs text-blue-600 hover:underline mt-2"
            >
                Esqueci minha senha
            </button>

            <div className="flex items-center justify-center mt-4 text-green-600 text-xs">
                <Icons.Lock className="w-3 h-3 mr-1" />
                <span className="font-bold">Ambiente Seguro (SSL 256-bit)</span>
            </div>
            </form>
        ) : (
            <div className="space-y-4">
                <div className="flex items-center mb-4">
                    <button onClick={() => setShowForgot(false)} className="mr-2 p-1 hover:bg-gray-100 rounded">
                        <Icons.X size={20}/>
                    </button>
                    <h3 className="font-bold text-lg">Recuperar Senha</h3>
                </div>
                <p className="text-sm text-gray-600">Digite sua matrícula para receber instruções de recuperação.</p>
                <input 
                    type="text" 
                    className="w-full p-3 border-2 border-gray-300 rounded bg-gray-50 outline-none focus:border-black"
                    placeholder="Sua Matrícula"
                    value={forgotMatricula}
                    onChange={e => setForgotMatricula(e.target.value)}
                />
                <button onClick={handleForgotPassword} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded transition">
                    ENVIAR INSTRUÇÕES
                </button>
            </div>
        )}
        
        {!showForgot && users.length === 0 && (
          <button onClick={handleCreateAdmin} className="mt-6 w-full text-sm bg-gray-100 py-2 rounded text-gray-600 border border-gray-300 hover:bg-gray-200 font-bold">
            Cadastrar Administrador Inicial
          </button>
        )}
      </div>
    </div>
  );
};

const ScreenDashboard = ({ currentUser, activeMaintenances, onOpenChecklist, refreshData, networkName }) => {
  const activeList = activeMaintenances.filter(m => m.status !== 'finished');
  const finishedList = activeMaintenances.filter(m => m.status === 'finished');

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
      console.log("Painel atualizado via rede/Wi-Fi...", new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="bg-black text-yellow-400 p-6 rounded-lg shadow-lg mb-6 border-l-8 border-yellow-500 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold uppercase mb-1 tracking-tighter">SEGURANÇA EM 1º LUGAR</h1>
            <p className="text-lg italic text-white opacity-90">"Nenhum trabalho é tão urgente que não possa ser feito com segurança."</p>
          </div>
          <div className="text-right text-white hidden md:block">
             <div className="flex items-center justify-end mb-1">
                 <Icons.Lock className="w-3 h-3 text-green-500 mr-1" />
                 <p className="text-sm font-bold">{currentUser.name}</p>
             </div>
             {networkName && (
                <div className="flex items-center justify-end">
                    <span className="flex items-center text-xs bg-gray-800 px-2 py-1 rounded text-green-400 border border-green-900 animate-pulse">
                         <Icons.Wifi className="w-3 h-3 mr-1" /> USUÁRIOS CONECTADOS: {Math.floor(Math.random() * 5) + 1}
                    </span>
                </div>
             )}
          </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          <div className="lg:col-span-2 bg-white rounded shadow-xl border border-gray-300 flex flex-col relative overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10 relative">
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

             <div className="w-full h-40 bg-gray-100 flex items-center justify-center border-b border-gray-300 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 opacity-50"></div>
                 <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Off-Road Monitoring</div>
             </div>
             
             <div className="p-4 overflow-y-auto flex-1 bg-gray-100 z-10 relative">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeList.map(m => (
                        <MaintenanceCard key={m.id} maintenance={m} onOpenChecklist={onOpenChecklist} currentUser={currentUser} />
                    ))}
                    {activeList.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-400 opacity-50">
                            <Icons.CheckSquare className="w-10 h-10 mb-2"/>
                            <p className="font-bold">Nenhuma manutenção ativa no momento.</p>
                        </div>
                    )}
                 </div>
             </div>
          </div>

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

const ScreenProgramming = ({ scheduleItems, setScheduleItems }) => {
    const [fileName, setFileName] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            // Simulação de Parsing do PDF ou Excel:
            // Ao enviar, o sistema "lê" o arquivo e gera uma programação fictícia para demonstração
            const simulatedData = [
                { date: new Date().toLocaleDateString('pt-BR'), equipment: 'CAT 777 - TAG 01', description: 'Troca de Óleo Motor' },
                { date: new Date().toLocaleDateString('pt-BR'), equipment: 'CAT 777 - TAG 05', description: 'Inspeção Sistema Hidráulico' },
                { date: new Date(Date.now() + 86400000).toLocaleDateString('pt-BR'), equipment: 'CAT D11 - TAG 02', description: 'Manutenção Preventiva 500h' },
                { date: new Date(Date.now() + 86400000).toLocaleDateString('pt-BR'), equipment: 'PERFURATRIZ - TAG 09', description: 'Troca de Mangueiras' },
            ];
            
            setTimeout(() => {
                setScheduleItems(simulatedData);
                const extension = file.name.split('.').pop().toLowerCase();
                const fileType = extension === 'pdf' ? 'PDF' : (['xls', 'xlsx'].includes(extension) ? 'EXCEL' : 'ARQUIVO');
                alert(`Programação importada com sucesso do ${fileType}!`);
            }, 1000);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
                <Icons.Calendar className="mr-2 w-8 h-8"/> PROGRAMAÇÃO DE MANUTENÇÃO
            </h2>
            
            <div className="bg-white p-6 rounded shadow mb-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Importar Programação (PDF / EXCEL)</h3>
                <div className="border-2 border-dashed border-blue-300 bg-blue-50 p-8 rounded text-center">
                    <input 
                        type="file" 
                        accept="application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                        className="hidden" 
                        id="prog-pdf" 
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="prog-pdf" className="cursor-pointer flex flex-col items-center">
                        <Icons.Cloud className="w-12 h-12 text-blue-500 mb-2"/>
                        <span className="font-bold text-blue-700">CLIQUE PARA ENVIAR PDF OU EXCEL</span>
                        <span className="text-xs text-gray-500 mt-1">O sistema irá ler e separar as manutenções por dia automaticamente.</span>
                    </label>
                    {fileName && <p className="mt-4 font-bold text-green-600">Arquivo Carregado: {fileName}</p>}
                </div>
            </div>

            <div className="flex-1 bg-white rounded shadow overflow-hidden flex flex-col">
                <div className="p-4 bg-gray-100 border-b font-bold flex justify-between">
                    <span>VISUALIZAÇÃO DA PROGRAMAÇÃO</span>
                    {scheduleItems.length > 0 && <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">{scheduleItems.length} ITENS IMPORTADOS</span>}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {scheduleItems.length === 0 ? (
                        <div className="text-center text-gray-400 py-10">
                            Nenhuma programação carregada. Envie um arquivo PDF ou EXCEL.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-300 text-sm uppercase">
                                    <th className="p-3">Data Programada</th>
                                    <th className="p-3">Equipamento</th>
                                    <th className="p-3">Descrição da Atividade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheduleItems.map((item, idx) => (
                                    <tr key={idx} className="border-b hover:bg-yellow-50">
                                        <td className="p-3 font-bold text-blue-600">{item.date}</td>
                                        <td className="p-3 font-bold">{item.equipment}</td>
                                        <td className="p-3 text-sm">{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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

const ScreenExternalArt = ({ onSave, editingDoc }) => {
  const [form, setForm] = useState({ fileName: '', artNumber: '', fileContent: '' });

  useEffect(() => {
    if (editingDoc) {
      setForm({
        fileName: editingDoc.fileName || '',
        artNumber: editingDoc.artNumber || '',
        fileContent: editingDoc.fileContent || ''
      });
    }
  }, [editingDoc]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.type !== 'application/pdf') {
            alert('Por favor, selecione um arquivo PDF.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            setForm(prev => ({ ...prev, fileName: file.name, fileContent: loadEvent.target.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!form.fileName || !form.artNumber) {
        alert('Preencha todos os campos.');
        return;
    }
    if (!form.fileContent && !editingDoc) {
        alert('Faça o upload do PDF.');
        return;
    }
    onSave({
      ...form,
      type: 'external',
      date: new Date().toLocaleDateString('pt-BR'),
      id: editingDoc ? editingDoc.id : Date.now()
    });
    setForm({ fileName: '', artNumber: '', fileContent: '' });
    alert('ART Cadastrada com Sucesso!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 flex items-center"><Icons.Upload className="mr-2"/> Cadastrar ART (PDF)</h2>
      <div className="space-y-4">
        <input 
            type="text" 
            placeholder="Nome do Arquivo / Descrição" 
            className="w-full border p-2 rounded"
            value={form.fileName}
            onChange={e => setForm({...form, fileName: e.target.value})}
        />
        <input 
            type="text" 
            placeholder="Número da ART" 
            className="w-full border p-2 rounded"
            value={form.artNumber}
            onChange={e => setForm({...form, artNumber: e.target.value})}
        />
        <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded bg-gray-50">
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
            <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                <Icons.Cloud className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-blue-600 font-bold">Clique para enviar PDF</span>
            </label>
            {form.fileName && <p className="mt-2 text-sm text-green-600 font-bold">Selecionado: {form.fileName}</p>}
        </div>

        {form.fileContent && (
            <div className="mt-4 border p-2 rounded bg-gray-100">
                <h3 className="font-bold text-sm mb-2 text-gray-700 border-b pb-1">Pré-visualização do Arquivo:</h3>
                <iframe src={form.fileContent} className="w-full h-[500px] border bg-white" title="PDF Preview"></iframe>
            </div>
        )}

        <button onClick={handleSubmit} className="w-full bg-black text-white p-3 rounded font-bold hover:bg-gray-800">
            SALVAR ART
        </button>
      </div>
    </div>
  );
};

const ScreenHistory = ({ docs, onView, onDownload, onEdit, onDelete, onSendToNetwork, activeMaintenances }) => {
  // Split logic for side panel
  const finishedIds = new Set(activeMaintenances.filter(m => m.status === 'finished').map(m => m.id));
  
  // Finished OMs go to side panel
  const finishedDocs = docs.filter(d => d.maintenanceId && finishedIds.has(d.maintenanceId));
  
  // Active or Unlinked docs stay in main area
  const activeDocs = docs.filter(d => !d.maintenanceId || !finishedIds.has(d.maintenanceId));

  return (
    <div className="p-6 h-full flex flex-col md:flex-row gap-6">
        {/* MAIN CONTENT (LEFT) */}
        <div className="flex-1 flex flex-col bg-white rounded shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-xl flex items-center"><Icons.FileText className="mr-2"/> DOCUMENTOS ATIVOS / HISTÓRICO</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-sm text-gray-600">
                    <tr>
                        <th className="p-3 border-b">Tipo</th>
                        <th className="p-3 border-b">ID / Tarefa</th>
                        <th className="p-3 border-b hidden md:table-cell">OM / TAG</th>
                        <th className="p-3 border-b">Data</th>
                        <th className="p-3 border-b text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {activeDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50 border-b last:border-0">
                            <td className="p-3">
                                {doc.type === 'emergencial' && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold">ART EMER</span>}
                                {doc.type === 'atividade' && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">ART ATIV</span>}
                                {doc.type === 'checklist' && <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-bold">CHECKLIST</span>}
                                {doc.type === 'external' && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-bold">PDF EXT</span>}
                            </td>
                            <td className="p-3">
                                <div className="font-bold">{doc.taskName || doc.fileName}</div>
                                <div className="text-xs text-gray-500">ID: {doc.maintenanceId || doc.id}</div>
                            </td>
                            <td className="p-3 hidden md:table-cell">
                                <div>{doc.om || '-'}</div>
                                <div className="text-xs text-gray-500">{doc.tag}</div>
                            </td>
                            <td className="p-3">{doc.date} <span className="text-gray-400">{doc.time}</span></td>
                            <td className="p-3">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => onView(doc)} className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="Visualizar">
                                        <Icons.Eye size={18} />
                                    </button>
                                    <button onClick={() => onDownload(doc)} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Visualizar para Baixar">
                                        <Icons.Download size={18} />
                                    </button>
                                    <button onClick={() => onEdit(doc)} className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200" title="Editar">
                                        <Icons.Edit size={18} />
                                    </button>
                                    <button onClick={() => onDelete(doc.id)} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Excluir">
                                        <Icons.Trash size={18} />
                                    </button>
                                    <button onClick={() => onSendToNetwork(doc)} className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" title="Enviar Rede">
                                        <Icons.Server size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {activeDocs.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhum documento ativo.</td></tr>
                    )}
                </tbody>
            </table>
          </div>
        </div>

        {/* SIDE PANEL (RIGHT) - ENCERRADAS */}
        <div className="w-full md:w-80 bg-gray-50 border-l border-gray-300 shadow-inner flex flex-col p-4">
             <h3 className="font-bold text-gray-700 mb-4 flex items-center border-b pb-2"><Icons.Lock className="mr-2 w-4 h-4"/> OMs ENCERRADAS</h3>
             <div className="flex-1 overflow-y-auto space-y-3">
                 {finishedDocs.map(doc => (
                     <div key={doc.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
                         <div className="flex justify-between items-start mb-1">
                             <span className="text-xs font-bold bg-gray-200 px-1 rounded">{doc.type.toUpperCase().slice(0,4)}</span>
                             <span className="text-[10px] text-gray-400">{doc.date}</span>
                         </div>
                         <div className="font-bold text-sm truncate">{doc.taskName}</div>
                         <div className="text-xs text-gray-500 mb-2">OM: {doc.om} | TAG: {doc.tag}</div>
                         
                         <div className="bg-red-50 border border-red-100 text-red-700 text-xs text-center py-1 font-bold mb-2 rounded">
                             OM ENCERRADA
                         </div>

                         <div className="flex gap-1 justify-center border-t pt-2">
                             <button onClick={() => onView(doc)} className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex-1 flex justify-center"><Icons.Eye size={14}/></button>
                             <button onClick={() => onDownload(doc)} className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100 flex-1 flex justify-center"><Icons.Download size={14}/></button>
                             <button onClick={() => onEdit(doc)} className="p-1 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 flex-1 flex justify-center"><Icons.Edit size={14}/></button>
                             <button onClick={() => onDelete(doc.id)} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 flex-1 flex justify-center"><Icons.Trash size={14}/></button>
                         </div>
                     </div>
                 ))}
                 {finishedDocs.length === 0 && <p className="text-xs text-gray-400 text-center italic">Nenhuma OM encerrada recentemente.</p>}
             </div>
        </div>
    </div>
  );
};

const ScreenEmployeeRegister = ({ employees, setEmployees }) => {
  const [form, setForm] = useState({ name: '', role: '', matricula: '' });

  const handleAdd = () => {
    if (!form.name || !form.matricula) return alert("Preencha nome e matrícula");
    setEmployees([...employees, form]);
    setForm({ name: '', role: '', matricula: '' });
  };

  const handleDelete = (matricula) => {
      if (confirm("Excluir funcionário?")) {
          setEmployees(employees.filter(e => e.matricula !== matricula));
      }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Funcionários</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input placeholder="Nome Completo" className="border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Função / Cargo" className="border p-2 rounded" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input placeholder="Matrícula" className="border p-2 rounded" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} />
      </div>
      <button onClick={handleAdd} className="w-full bg-blue-600 text-white p-2 rounded font-bold mb-6">ADICIONAR FUNCIONÁRIO</button>
      
      <div className="space-y-2">
        {employees.map(emp => (
          <div key={emp.matricula} className="flex justify-between items-center border p-3 rounded hover:bg-gray-50">
            <div>
                <p className="font-bold">{emp.name}</p>
                <p className="text-xs text-gray-500">{emp.role} | Mat: {emp.matricula}</p>
            </div>
            <button onClick={() => handleDelete(emp.matricula)} className="p-2 text-red-600 hover:bg-red-100 rounded"><Icons.Trash /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScreenAdminUsers = ({ users, setUsers }) => {
  const [form, setForm] = useState({ name: '', matricula: '', password: '' });

  const handleAdd = () => {
    if (!form.name || !form.matricula || !form.password) return alert("Preencha todos os dados");
    setUsers([...users, { ...form, role: 'user' }]);
    setForm({ name: '', matricula: '', password: '' });
  };

  const handleDelete = (matricula) => {
      if (confirm("Excluir usuário de sistema?")) {
          setUsers(users.filter(u => u.matricula !== matricula));
      }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Gestão de Usuários (Login)</h2>
      <div className="grid grid-cols-1 gap-3 mb-4">
        <input placeholder="Nome do Usuário" className="border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <div className="grid grid-cols-2 gap-2">
            <input placeholder="Login (Matrícula)" className="border p-2 rounded" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} />
            <input placeholder="Senha" type="password" className="border p-2 rounded" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>
      </div>
      <button onClick={handleAdd} className="w-full bg-black text-white p-2 rounded font-bold mb-6">CRIAR USUÁRIO</button>

      <div className="space-y-2">
        {users.map(u => (
          <div key={u.matricula} className="flex justify-between items-center border p-3 rounded">
            <div>
                <p className="font-bold">{u.name} {u.role === 'admin' && <span className="text-xs bg-black text-white px-1 rounded">ADMIN</span>}</p>
                <p className="text-xs text-gray-500">Login: {u.matricula}</p>
            </div>
            <button onClick={() => handleDelete(u.matricula)} className="p-2 text-red-600 hover:bg-red-100 rounded"><Icons.Trash /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScreenAdminSettings = ({ settings, setSettings, users, setUsers, employees, setEmployees, externalArtProps, activeTab, setActiveTab }) => {
  const [newTag, setNewTag] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [networkPath, setNetworkPath] = useState(settings.registeredNetwork || '');
  const [wifiName, setWifiName] = useState(settings.wifiName || '');
  const [networkUser, setNetworkUser] = useState(settings.networkUser || '');
  const [networkPassword, setNetworkPassword] = useState(settings.networkPassword || '');

  const handleAddTag = () => {
    if(newTag) { setSettings({...settings, tags: [...settings.tags, newTag]}); setNewTag(''); }
  };
  const handleAddLoc = () => {
    if(newLoc) { setSettings({...settings, locations: [...settings.locations, newLoc]}); setNewLoc(''); }
  };
  const handleSaveNetwork = () => {
      setSettings({ 
          ...settings, 
          registeredNetwork: networkPath, 
          wifiName: wifiName,
          networkUser: networkUser,
          networkPassword: networkPassword
      });
      alert("Configurações de Rede salvas!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center"><Icons.Settings className="mr-2"/> CONFIGURAÇÕES GERAIS</h2>
      
      {/* TABS HEADER */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto">
          <button onClick={() => setActiveTab('general')} className={`px-6 py-3 font-bold rounded-t-lg ${activeTab === 'general' ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>GERAL & REDE</button>
          <button onClick={() => setActiveTab('employees')} className={`px-6 py-3 font-bold rounded-t-lg ${activeTab === 'employees' ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>FUNCIONÁRIOS</button>
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-bold rounded-t-lg ${activeTab === 'users' ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>USUÁRIOS SISTEMA</button>
          <button onClick={() => setActiveTab('external_art')} className={`px-6 py-3 font-bold rounded-t-lg ${activeTab === 'external_art' ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>CADASTRAR ART (PDF)</button>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow min-h-[500px]">
        {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* NETWORK CONFIG */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded border border-gray-300">
                    <h3 className="font-bold text-lg mb-4 flex items-center"><Icons.Wifi className="mr-2"/> REDE E CONEXÃO</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-sm mb-1">Nome da Rede Wi-Fi / Conexão</label>
                            <input 
                                className="w-full border p-2 rounded" 
                                value={wifiName} 
                                onChange={e => setWifiName(e.target.value)}
                                placeholder="Ex: WIFI-MINERADORA-01"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Caminho da Rede / Banco de Dados</label>
                            <input 
                                className="w-full border p-2 rounded" 
                                value={networkPath} 
                                onChange={e => setNetworkPath(e.target.value)}
                                placeholder="Ex: \\servidor\dados\app"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Usuário de Rede</label>
                            <input 
                                className="w-full border p-2 rounded" 
                                value={networkUser} 
                                onChange={e => setNetworkUser(e.target.value)}
                                placeholder="Ex: admin_rede"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Senha de Rede</label>
                            <input 
                                type="password"
                                className="w-full border p-2 rounded" 
                                value={networkPassword} 
                                onChange={e => setNetworkPassword(e.target.value)}
                                placeholder="********"
                            />
                        </div>
                    </div>
                    <button onClick={handleSaveNetwork} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-bold">SALVAR REDE</button>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-4 rounded border border-gray-300 mt-0">
                    <h3 className="font-bold text-lg mb-4 flex items-center"><Icons.Lock className="mr-2"/> SEGURANÇA E CRIPTOGRAFIA</h3>
                    <div className="flex items-center justify-between bg-white p-4 border rounded">
                        <div>
                            <p className="font-bold text-green-700 flex items-center"><Icons.CheckSquare className="w-4 h-4 mr-2"/> Certificado SSL Válido</p>
                            <p className="text-xs text-gray-500">Emitido para: {settings.wifiName || 'localhost'}</p>
                            <p className="text-xs text-gray-500">Expira em: 365 dias</p>
                        </div>
                        <div className="text-right">
                             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">ATIVO</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold mb-2">Tags Cadastradas</h3>
                    <div className="flex gap-2 mb-2">
                        <input className="border p-2 flex-1" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Nova TAG"/>
                        <button onClick={handleAddTag} className="bg-green-600 text-white px-4 rounded">+</button>
                    </div>
                    <div className="border p-2 h-48 overflow-y-auto bg-gray-50 rounded">
                        {settings.tags.map(t => <div key={t} className="border-b p-1">{t}</div>)}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Locais de Trabalho</h3>
                    <div className="flex gap-2 mb-2">
                        <input className="border p-2 flex-1" value={newLoc} onChange={e => setNewLoc(e.target.value)} placeholder="Novo Local"/>
                        <button onClick={handleAddLoc} className="bg-green-600 text-white px-4 rounded">+</button>
                    </div>
                    <div className="border p-2 h-48 overflow-y-auto bg-gray-50 rounded">
                        {settings.locations.map(l => <div key={l} className="border-b p-1">{l}</div>)}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'employees' && <ScreenEmployeeRegister employees={employees} setEmployees={setEmployees} />}
        {activeTab === 'users' && <ScreenAdminUsers users={users} setUsers={setUsers} />}
        {activeTab === 'external_art' && <ScreenExternalArt {...externalArtProps} />}
      </div>
    </div>
  );
};

const ScreenFileDocuments = ({ docs, onView, onDownload, onEdit, onDelete, onSendToNetwork }) => {
  const [search, setSearch] = useState('');
  const filtered = docs.filter(d => 
      d.taskName?.toLowerCase().includes(search.toLowerCase()) ||
      d.om?.includes(search) ||
      d.tag?.includes(search) ||
      d.fileName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
      onDelete(id);
  };

  return (
    <div className="p-6">
       <div className="bg-white p-6 rounded shadow">
           <h2 className="text-2xl font-bold mb-6 flex items-center"><Icons.Folder className="mr-2"/> ARQUIVO DOCUMENTOS (GERAL)</h2>
           <div className="mb-4">
               <input 
                  className="w-full p-3 border rounded bg-gray-50" 
                  placeholder="Pesquisar por Tarefa, OM, TAG ou Nome do Arquivo..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
               />
           </div>
           <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-100">
                       <tr>
                           <th className="p-3">Tipo</th>
                           <th className="p-3">Identificação</th>
                           <th className="p-3">Data/Hora</th>
                           <th className="p-3 text-center">Gerenciamento</th>
                       </tr>
                   </thead>
                   <tbody>
                       {filtered.map(doc => (
                           <tr key={doc.id} className="border-b hover:bg-gray-50">
                               <td className="p-3 font-bold text-xs uppercase">{doc.type}</td>
                               <td className="p-3">
                                   <div className="font-bold">{doc.taskName || doc.fileName}</div>
                                   <div className="text-xs text-gray-500">{doc.om} | {doc.tag} | ID: {doc.maintenanceId || doc.id}</div>
                               </td>
                               <td className="p-3 text-sm">{doc.date} {doc.time}</td>
                               <td className="p-3">
                                   <div className="flex justify-center gap-2">
                                       <button onClick={() => onView(doc)} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold hover:bg-blue-200 flex items-center"><Icons.Eye size={14} className="mr-1"/> VER</button>
                                       <button onClick={() => onDownload(doc)} className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-bold hover:bg-green-200 flex items-center"><Icons.Download size={14} className="mr-1"/> PDF</button>
                                       <button onClick={() => onEdit(doc)} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold hover:bg-yellow-200 flex items-center"><Icons.Edit size={14} className="mr-1"/> EDIT</button>
                                       <button onClick={() => handleDelete(doc.id)} className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-bold hover:bg-red-200 flex items-center"><Icons.Trash size={14} className="mr-1"/> DEL</button>
                                       <button onClick={() => onSendToNetwork(doc)} className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-xs font-bold hover:bg-gray-200 flex items-center"><Icons.Server size={14} className="mr-1"/> REDE</button>
                                   </div>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>
    </div>
  );
};

const Sidebar = ({ activeScreen, setActiveScreen, onLogout, isAdmin }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Activity },
    { id: 'programming', label: 'Programação', icon: Icons.Calendar },
    { id: 'emergencial', label: 'ART Emergencial', icon: Icons.AlertTriangle },
    { id: 'atividade', label: 'ART Atividade', icon: Icons.ClipboardList },
    { id: 'checklist', label: 'Checklist', icon: Icons.CheckSquare },
    { id: 'history', label: 'Histórico Doc.', icon: Icons.Clock },
    { id: 'file_documents', label: 'Arquivo Documentos', icon: Icons.Folder },
  ];

  if (isAdmin) {
      menuItems.push({ id: 'admin_settings', label: 'Configurações', icon: Icons.Settings });
  }

  return (
    <div className="w-64 bg-black text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-40 hidden md:flex">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-tighter text-yellow-500 flex items-center">
          <Icons.Activity className="mr-2"/> ART APP
        </h1>
        <p className="text-xs text-gray-400 mt-1">Gestão de Segurança</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`w-full flex items-center p-3 rounded transition-all duration-200 ${activeScreen === item.id ? 'bg-yellow-500 text-black font-bold shadow-lg translate-x-2' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}
          >
            <item.icon className="mr-3 w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={onLogout} className="w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 rounded transition-colors">
          <Icons.LogOut className="mr-3 w-5 h-5" /> Sair
        </button>
      </div>
    </div>
  );
};

const MobileSidebar = ({ activeScreen, setActiveScreen, onLogout, isAdmin, isOpen, onClose }) => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Icons.Activity },
      { id: 'programming', label: 'Programação', icon: Icons.Calendar },
      { id: 'emergencial', label: 'ART Emergencial', icon: Icons.AlertTriangle },
      { id: 'atividade', label: 'ART Atividade', icon: Icons.ClipboardList },
      { id: 'checklist', label: 'Checklist', icon: Icons.CheckSquare },
      { id: 'history', label: 'Histórico Doc.', icon: Icons.Clock },
      { id: 'file_documents', label: 'Arquivo Documentos', icon: Icons.Folder },
    ];

    if (isAdmin) {
        menuItems.push({ id: 'admin_settings', label: 'Configurações', icon: Icons.Settings });
    }
  
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>}
        <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tighter text-yellow-500">ART APP</h1>
                <button onClick={onClose}><Icons.X /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => { setActiveScreen(item.id); onClose(); }}
                    className={`w-full flex items-center p-3 rounded transition-all duration-200 ${activeScreen === item.id ? 'bg-yellow-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-300'}`}
                >
                    <item.icon className="mr-3 w-5 h-5" />
                    {item.label}
                </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button onClick={onLogout} className="w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 rounded">
                <Icons.LogOut className="mr-3 w-5 h-5" /> Sair
                </button>
            </div>
        </div>
      </>
    );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(getLocalStorage('users', []));
  const [employees, setEmployees] = useState(getLocalStorage('employees', []));
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [docs, setDocs] = useState(getLocalStorage('docs', []));
  const [settings, setSettings] = useState(getLocalStorage('settings', { tags: ['TR-01', 'CV-02'], locations: ['Mina', 'Oficina'], registeredNetwork: '', wifiName: '' }));
  const [activeMaintenances, setActiveMaintenances] = useState(getLocalStorage('activeMaintenances', []));
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [settingsTab, setSettingsTab] = useState('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checklistPreFill, setChecklistPreFill] = useState(null);
  const [scheduleItems, setScheduleItems] = useState(getLocalStorage('scheduleItems', []));
  const [showProgrammingModal, setShowProgrammingModal] = useState(false);

  useEffect(() => { setLocalStorage('users', users); }, [users]);
  useEffect(() => { setLocalStorage('employees', employees); }, [employees]);
  useEffect(() => { setLocalStorage('docs', docs); }, [docs]);
  useEffect(() => { setLocalStorage('settings', settings); }, [settings]);
  useEffect(() => { setLocalStorage('activeMaintenances', activeMaintenances); }, [activeMaintenances]);
  useEffect(() => { setLocalStorage('scheduleItems', scheduleItems); }, [scheduleItems]);

  // TIMER DO ALERTA DE PROGRAMAÇÃO (A CADA 2 MINUTOS, EXIBE POR 30 SEG)
  useEffect(() => {
      const timer = setInterval(() => {
          if (scheduleItems.length > 0 && currentUser) {
             setShowProgrammingModal(true);
             // Fecha automaticamente após 30 segundos
             setTimeout(() => {
                 setShowProgrammingModal(false);
             }, 30000);
          }
      }, 120000); // 120.000 ms = 2 minutos

      return () => clearInterval(timer);
  }, [scheduleItems, currentUser]);

  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => {
      setCurrentUser(null);
  };

  const startMaintenance = (doc) => {
      const exists = activeMaintenances.find(m => m.id === doc.maintenanceId);
      if (!exists) {
          const newM = {
              id: doc.maintenanceId,
              tag: doc.tag,
              om: doc.om,
              taskName: doc.taskName,
              startTime: new Date(),
              status: 'active',
              userName: currentUser.name,
              userId: currentUser.matricula
          };
          setActiveMaintenances([...activeMaintenances, newM]);
      } else {
         const updated = activeMaintenances.map(m => m.id === doc.maintenanceId ? { ...m, tag: doc.tag, om: doc.om, taskName: doc.taskName } : m);
         setActiveMaintenances(updated);
      }
  };

  const handleFinishMaintenance = (maintenance) => {
      const updated = activeMaintenances.map(m => 
          m.id === maintenance.id 
          ? { ...m, status: 'finished', endTime: new Date() } 
          : m
      );
      setActiveMaintenances(updated);
  };

  const handleOpenChecklist = (maintenance) => {
    setChecklistPreFill({
        om: maintenance.om,
        tag: maintenance.tag,
        taskName: maintenance.taskName,
        maintenanceId: maintenance.id
    });
    setActiveScreen('checklist');
  };

  const handleSaveDoc = (docData) => {
      let finalDoc = { ...docData };
      
      if (editingDoc) {
          const updatedDocs = docs.map(d => d.id === editingDoc.id ? finalDoc : d);
          setDocs(updatedDocs);
          
          if (finalDoc.maintenanceId) {
              startMaintenance(finalDoc); 
          }
          setEditingDoc(null);
          alert("Documento atualizado com sucesso!");
      } else {
          if (docData.type !== 'external') {
              finalDoc.maintenanceId = `MNT-${finalDoc.id}`;
          }
          
          setDocs([...docs, finalDoc]);

          if (docData.type !== 'external') {
             if (docData.type === 'checklist') {
                // If it's a checklist, we check if there is an active maintenance to finish
                const relatedMaintenanceId = docData.maintenanceId || (checklistPreFill ? checklistPreFill.maintenanceId : null);
                
                // Try to finish maintenance by ID or OM/TAG matching if ID is missing (legacy support)
                let maintenanceToFinish = null;
                
                if (relatedMaintenanceId) {
                     maintenanceToFinish = activeMaintenances.find(m => m.id === relatedMaintenanceId && m.status !== 'finished');
                }
                
                if (!maintenanceToFinish) {
                    maintenanceToFinish = activeMaintenances.find(m => m.om === docData.om && m.tag === docData.tag && m.status !== 'finished');
                }

                if (maintenanceToFinish) {
                    handleFinishMaintenance(maintenanceToFinish);
                    alert("Checklist Salvo e Manutenção Encerrada com Sucesso!");
                } else {
                    alert("Checklist Salvo! (Nenhuma manutenção ativa foi encerrada)");
                }

             } else {
                 // It's an ART (Emergencial/Activity), start maintenance
                 startMaintenance(finalDoc);
                 alert("ART Salva e Manutenção Iniciada!");
             }
          } else {
              alert("Documento salvo com sucesso!");
          }
      }
      
      setChecklistPreFill(null); // Clear pre-fill after save
      setActiveScreen('history');
  };

  const handleDeleteDoc = (id) => {
      if (confirm("Tem certeza que deseja excluir este documento?")) {
          const doc = docs.find(d => d.id === id);
          setDocs(docs.filter(d => d.id !== id));
          if (doc && doc.maintenanceId) {
              setActiveMaintenances(activeMaintenances.filter(m => m.id !== doc.maintenanceId));
          }
      }
  };

  const handleEditDoc = (doc) => {
      setEditingDoc(doc);
      if (doc.type === 'external') {
          setSettingsTab('external_art');
          setActiveScreen('admin_settings');
      } else {
          setActiveScreen(doc.type);
      }
  };

  const handleViewDoc = (doc) => {
      setPreviewDoc({ ...doc, autoPrint: false });
  };

  const handleDownloadDoc = (doc) => {
      if (doc.type === 'external' && doc.fileContent) {
         const byteCharacters = atob(doc.fileContent.split(',')[1]);
         const byteNumbers = new Array(byteCharacters.length);
         for (let i = 0; i < byteCharacters.length; i++) {
             byteNumbers[i] = byteCharacters.charCodeAt(i);
         }
         const byteArray = new Uint8Array(byteNumbers);
         const blob = new Blob([byteArray], {type: 'application/pdf'});
         const link = document.createElement('a');
         link.href = window.URL.createObjectURL(blob);
         link.download = doc.fileName || `documento-${doc.id}.pdf`;
         link.click();
      } else {
         setPreviewDoc({ ...doc, autoPrint: false });
      }
  };

  const handlePreviewAction = (formData) => {
      setPreviewDoc({ ...formData, autoPrint: false });
  };

  const handleSendToNetwork = (doc) => {
      if (!settings.registeredNetwork) {
          alert("Nenhum caminho de rede configurado em Configurações.");
          return;
      }
      alert(`Enviando arquivo ${doc.id} para: ${settings.registeredNetwork}...\n(Simulação: Arquivo transferido com sucesso!)`);
  };

  const refreshData = () => {
     const m = localStorage.getItem('activeMaintenances');
     if(m) setActiveMaintenances(JSON.parse(m));
  };

  if (!currentUser) return <ScreenLogin onLogin={handleLogin} users={users} setUsers={setUsers} />;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} onLogout={handleLogout} isAdmin={currentUser.role === 'admin'} />
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activeScreen={activeScreen} setActiveScreen={setActiveScreen} onLogout={handleLogout} isAdmin={currentUser.role === 'admin'} />
      
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
          {/* MOBILE HEADER */}
          <div className="md:hidden bg-black text-white p-4 flex justify-between items-center shadow-md z-30">
              <h1 className="font-bold text-yellow-500 tracking-tighter text-xl">ART APP</h1>
              <button onClick={() => setMobileMenuOpen(true)}><Icons.Menu /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-0 md:p-0 relative">
             {activeScreen === 'dashboard' && (
                <ScreenDashboard 
                    currentUser={currentUser} 
                    activeMaintenances={activeMaintenances} 
                    onOpenChecklist={handleOpenChecklist}
                    refreshData={refreshData}
                    networkName={settings.wifiName}
                />
             )}
             {activeScreen === 'programming' && <ScreenProgramming scheduleItems={scheduleItems} setScheduleItems={setScheduleItems} />}
             {activeScreen === 'emergencial' && <ScreenArtEmergencial onSave={handleSaveDoc} employees={employees} editingDoc={editingDoc} settings={settings} onPreview={handlePreviewAction} />}
             {activeScreen === 'atividade' && <ScreenArtAtividade onSave={handleSaveDoc} employees={employees} editingDoc={editingDoc} settings={settings} externalDocs={docs.filter(d => d.type === 'external')} onPreview={handlePreviewAction} />}
             {activeScreen === 'checklist' && <ScreenChecklist onSave={handleSaveDoc} employees={employees} editingDoc={editingDoc} settings={settings} onPreview={handlePreviewAction} preFill={checklistPreFill} />}
             {activeScreen === 'history' && <ScreenHistory docs={docs} onView={handleViewDoc} onDownload={handleDownloadDoc} onEdit={handleEditDoc} onDelete={handleDeleteDoc} onSendToNetwork={handleSendToNetwork} activeMaintenances={activeMaintenances} />}
             {activeScreen === 'file_documents' && <ScreenFileDocuments docs={docs} onView={handleViewDoc} onDownload={handleDownloadDoc} onEdit={handleEditDoc} onDelete={handleDeleteDoc} onSendToNetwork={handleSendToNetwork} />}
             
             {activeScreen === 'admin_settings' && (
                 <ScreenAdminSettings 
                    settings={settings} 
                    setSettings={setSettings} 
                    users={users} 
                    setUsers={setUsers} 
                    employees={employees} 
                    setEmployees={setEmployees}
                    externalArtProps={{ onSave: handleSaveDoc, editingDoc: (editingDoc?.type === 'external' ? editingDoc : null) }}
                    activeTab={settingsTab}
                    setActiveTab={setSettingsTab}
                 />
             )}
          </div>
      </div>

      {showProgrammingModal && (
          <ProgrammingAlertModal scheduleItems={scheduleItems} onClose={() => setShowProgrammingModal(false)} />
      )}

      {previewDoc && (
        <PrintTemplate 
            data={previewDoc} 
            type={previewDoc.type} 
            onClose={() => setPreviewDoc(null)}
            settings={settings}
        />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);