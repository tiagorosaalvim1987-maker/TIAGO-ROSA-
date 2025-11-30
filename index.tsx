

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Camera, Trash2, Download, FileText, Eye, Edit, Share2, Printer, X, Menu, Save, Upload, Cloud, User, Users, Lock, AlertTriangle, ClipboardList, CheckSquare, Home, LogOut, Clock, Activity, Settings, Pen, Terminal, Folder, ChevronRight, FileCheck, Wifi, Server, Globe, Database, Cpu, Radio, Layers, ArrowRightLeft, Calendar, Bell, Copy, Clipboard, FileSpreadsheet, Send, Phone, CloudLightning, File, FileCode, PlayCircle, ChevronLeft, Sun, CloudSun, Haze, CloudDrizzle, CloudRain, Snowflake, CloudRainWind, Wind, CloudCheck, CloudUpload, RotateCcw, QrCode } from 'lucide-react';

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
  CloudLightning: CloudLightning,
  FileCheck: FileCheck,
  Wifi: Wifi,
  Server: Server,
  Globe: Globe,
  Database: Database,
  Cpu: Cpu,
  Radio: Radio,
  Layers: Layers,
  ArrowRightLeft: ArrowRightLeft,
  Calendar: Calendar,
  Bell: Bell,
  Copy: Copy,
  Clipboard: Clipboard,
  FileSpreadsheet: FileSpreadsheet,
  Whatsapp: Send, 
  Phone: Phone,
  File: File,
  FileCode: FileCode,
  PlayCircle: PlayCircle,
  ChevronLeft: ChevronLeft,
  ChevronRight: ChevronRight,
  Sun: Sun,
  CloudSun: CloudSun,
  Haze: Haze,
  CloudDrizzle: CloudDrizzle,
  CloudRain: CloudRain,
  Snowflake: Snowflake,
  CloudRainWind: CloudRainWind,
  Wind: Wind,
  CloudCheck: CloudCheck,
  CloudUpload: CloudUpload,
  Restore: RotateCcw,
  QrCode: QrCode,
};

// --- CONSTANTS ---
const ALERT_THRESHOLD_HOURS = 20;
const ALERT_THRESHOLD_MS = ALERT_THRESHOLD_HOURS * 60 * 60 * 1000;
const PROGRAMMING_ALERT_INTERVAL = 2 * 60 * 1000; // 2 minutes
const PROGRAMMING_ALERT_DURATION = 20 * 1000; // 20 seconds
const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE'; // In a real app, this would come from the server

const TRUCK_IMAGE_URL = "https://img.freepik.com/premium-vector/mining-dump-truck-vector-illustration-isolated-white-background_263357-365.jpg"; 
const VALE_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Vale_logo.svg/800px-Vale_logo.svg.png";

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

// --- HELPERS & CUSTOM HOOKS ---
const useCachedState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(error);
      }
    }, 500); // Debounce saves by 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [key, state]);

  return [state, setState];
};


const getLocalIP = () => {
  return new Promise((resolve, reject) => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer().then(pc.setLocalDescription.bind(pc));

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          return;
        }

        const candidate = ice.candidate.candidate;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const ipMatch = candidate.match(ipRegex);
        
        if (ipMatch) {
          const ip = ipMatch[1];
          if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
            resolve(ip);
            pc.close();
          }
        }
      };
      setTimeout(() => reject('Timeout'), 2000); // Fail after 2s
    } catch (e) {
      reject(e);
    }
  });
};


const getWeatherIcon = (code) => {
    switch(code) {
        case 0: return Icons.Sun;
        case 1: case 2: case 3: return Icons.CloudSun;
        case 45: case 48: return Icons.Haze;
        case 51: case 53: case 55: case 56: case 57: return Icons.CloudDrizzle;
        case 61: case 63: case 65: case 66: case 67: return Icons.CloudRain;
        case 71: case 73: case 75: case 77: return Icons.Snowflake;
        case 80: case 81: case 82: return Icons.CloudRainWind;
        case 95: case 96: case 99: return Icons.CloudLightning;
        default: return Icons.Cloud;
    }
};

// --- SIMULATED PUSH NOTIFICATION ---
const showLocalNotification = (title, body, tag = 'art-notification') => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
              body,
              icon: 'https://img.freepik.com/premium-vector/mining-dump-truck-vector-illustration-isolated-white-background_263357-365.jpg',
              badge: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Vale_logo.svg/800px-Vale_logo.svg.png',
              tag: tag
          });
      });
  }
};


// --- COMPONENTS ---
const AutoSaveIndicator = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-2xl z-[100] animate-in fade-in-50 duration-300 pointer-events-none">
      <div className="flex items-center gap-2">
        <Icons.Save size={14} />
        <span>Rascunho salvo automaticamente.</span>
      </div>
    </div>
  );
};

const DraftLoadModal = ({ onConfirm, onDiscard }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[200]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center animate-in zoom-in-95">
        <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Icons.FileText size={32} className="text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Rascunho Encontrado</h2>
        <p className="text-gray-600 mb-6">
          Encontramos um rascunho salvo para este formulário. Deseja continuar de onde parou?
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Sim, Carregar Rascunho
          </button>
          <button onClick={onDiscard} className="w-full bg-transparent text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Não, Descartar e Começar Novo
          </button>
        </div>
      </div>
    </div>
  );
};

const YemReportModal = ({ m, doc, onClose }) => {
  const [pendencias, setPendencias] = useState('');
  const [desvio, setDesvio] = useState('');
  const [status, setStatus] = useState('LIBERADO');

  const generateReportContent = useMemo(() => {
    const executantes = doc.signatures?.map(s => s.name).join(', ') || 'N/A';
    
    let atividades = 'N/A';
    if (doc.correctionDescription) {
        atividades = doc.correctionDescription;
    } else if (doc.type === 'checklist') {
        atividades = 'Checklist de entrega do equipamento realizado conforme padrões de segurança.';
    }

    let report = `📝 RELATÓRIO\n\n`;
    report += `SOBRE:\n${m.om || ''}\n\n`;
    report += `▪ TIPO: IEM\n\n`;
    report += `🚜 ⁠*EQUIPAMENTO:*\n${m.tag || ''}\n\n`;
    report += `🗓 DADOS:\n${doc.date || ''}\n\n`;
    report += `👥 EXECUTANTES:\n${executantes}\n\n`;
    report += `⏱⁠ HORA INÍCIO: ${m.startTime ? new Date(m.startTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : ''}\n`;
    report += `HORA FIM: ${m.endTime ? new Date(m.endTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : ''}\n\n`;
    report += `MOTIVO DA PARADA 🔧\n${m.taskName || ''}\n\n`;
    report += `ATIVIDADES REALIZADAS:\n${atividades}\n\n`;
    report += `PENDÊNCIAS: ${pendencias || ''}\n\n`;
    report += `❗ * DESVIO: ${desvio || ''}\n\n`;
    report += `▪ STATUS: ${status}`;

    return report;
  }, [m, doc, pendencias, desvio, status]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportContent);
    alert('Relatório copiado para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[150] p-4 animate-in fade-in-25">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Icons.FileSpreadsheet /> Gerar Relatório Conforme</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><Icons.X /></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div>
            <label className="font-bold text-gray-700 text-sm">PENDÊNCIAS:</label>
            <textarea value={pendencias} onChange={(e) => setPendencias(e.target.value)} className="w-full border p-2 rounded mt-1 h-20 text-sm" />
          </div>
          <div>
            <label className="font-bold text-gray-700 text-sm">DESVIO:</label>
            <textarea value={desvio} onChange={(e) => setDesvio(e.target.value)} className="w-full border p-2 rounded mt-1 h-20 text-sm" />
          </div>
           <div>
            <label className="font-bold text-gray-700 text-sm">STATUS:</label>
            <div className="flex gap-4 mt-2">
                <label className="flex items-center text-sm">
                    <input type="radio" name="status" value="LIBERADO" checked={status === 'LIBERADO'} onChange={(e) => setStatus(e.target.value)} className="mr-2 h-4 w-4"/>
                    Liberado
                </label>
                <label className="flex items-center text-sm">
                    <input type="radio" name="status" value="PARADO" checked={status === 'PARADO'} onChange={(e) => setStatus(e.target.value)} className="mr-2 h-4 w-4" />
                    Parado
                </label>
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-700 text-sm">Pré-visualização do Relatório:</label>
            <div className="bg-gray-100 p-4 rounded border whitespace-pre-wrap font-mono text-xs mt-1 max-h-60 overflow-y-auto">
              {generateReportContent}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded border font-bold text-sm">Cancelar</button>
          <button onClick={handleCopy} className="bg-blue-600 text-white px-4 py-2 rounded font-bold flex items-center gap-2 text-sm"><Icons.Copy /> Copiar Relatório</button>
        </div>
      </div>
    </div>
  );
};


const QRCodeModal = ({ data, onClose }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-in fade-in-25">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">Compartilhar com QR Code</h3>
        <div className="p-4 bg-gray-100 border rounded-lg">
          <img src={qrUrl} alt="QR Code" className="w-full h-auto object-contain" />
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Aponte a câmera do seu dispositivo para o código para ver os detalhes.
        </p>
        <button onClick={onClose} className="mt-6 w-full bg-gray-700 text-white px-4 py-2 rounded font-bold hover:bg-gray-800">Fechar</button>
      </div>
    </div>
  );
};

const Toast = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const colors = {
        success: 'bg-green-600',
        info: 'bg-blue-600',
        warning: 'bg-yellow-500',
    };

    return (
        <div className={`fixed bottom-8 right-8 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-2xl z-[200] flex items-center gap-4 animate-in slide-in-from-bottom`}>
            {type === 'success' && <Icons.CloudCheck />}
            {type === 'info' && <Icons.CloudUpload />}
            <span>{message}</span>
            <button onClick={onDismiss} className="ml-4 opacity-75 hover:opacity-100">&times;</button>
        </div>
    );
};

const SyncStatusIndicator = ({ status, queueLength }) => {
    if (status === 'synced') {
        return (
            <div className="flex items-center gap-2 text-xs text-green-300 bg-green-900/50 px-3 py-1 rounded-full border border-green-700">
                <Icons.CloudCheck size={14} />
                <span>Sincronizado</span>
            </div>
        );
    }
    if (status === 'syncing') {
        return (
            <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-700 animate-pulse">
                <Icons.Cpu size={14} className="animate-spin" />
                <span>Sincronizando...</span>
            </div>
        );
    }
    if (status === 'offline') {
        return (
            <div className="flex items-center gap-2 text-xs text-yellow-300 bg-yellow-900/50 px-3 py-1 rounded-full border border-yellow-700">
                <Icons.CloudUpload size={14} />
                <span>{queueLength} alterações pendentes</span>
            </div>
        );
    }
    return null;
};

const WeatherWidget = ({ weather, status }) => {
    if (status === 'loading') {
        return <div className="text-white text-xs flex items-center gap-2"><Cpu className="animate-spin w-4 h-4"/> <span>Carregando clima...</span></div>;
    }
    if (status === 'error' || !weather) {
        return <div className="text-red-400 text-xs flex items-center gap-2"><X size={14}/> <span>Clima indisponível</span></div>;
    }

    const WeatherIcon = getWeatherIcon(weather.weathercode);

    return (
        <div className="bg-white/10 p-2 rounded-lg flex items-center gap-4 border border-white/20">
            <WeatherIcon className="w-8 h-8 text-yellow-300" />
            <div className="text-white">
                <p className="font-bold text-2xl leading-none">{Math.round(weather.temperature)}°C</p>
            </div>
            <div className="text-white border-l border-white/20 pl-4">
                <div className="flex items-center gap-2">
                    <Icons.Wind size={16} />
                    <span className="font-bold">{Math.round(weather.windspeed)} km/h</span>
                </div>
                <p className="text-xs text-gray-300">Vento</p>
            </div>
        </div>
    );
};


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
  const [notified, setNotified] = useState(false);
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

  useEffect(() => {
    if (isOverdue && !notified) {
      showLocalNotification(
        `ALERTA CRÍTICO: ${maintenance.tag}`,
        `A manutenção "${maintenance.taskName}" excedeu o tempo limite.`,
        `maintenance-${maintenance.id}`
      );
      setNotified(true);
    }
  }, [isOverdue, notified, maintenance]);

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

const ProgrammingPrintTemplate = ({ schedule, onClose, title = "PROGRAMAÇÃO SEMANAL DE MANUTENÇÃO" }) => {
    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95 flex justify-center overflow-y-auto print:bg-white print:static print:block">
            <style>{`
                @media print {
                    @page { size: A4 landscape; margin: 5mm; }
                    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .print-container { width: 100% !important; box-shadow: none !important; padding: 0 !important; }
                }
            `}</style>
            
            <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-blue-700 flex items-center">
                    <Icons.Printer className="mr-2 w-4 h-4"/> IMPRIMIR
                </button>
                <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-red-700">
                    FECHAR
                </button>
            </div>

            <div className="bg-white w-[297mm] min-h-[210mm] p-[10mm] shadow-2xl my-8 print-container print:my-0 font-sans">
                {/* Header */}
                <div className="border-2 border-black flex items-center mb-4">
                    <div className="w-48 border-r-2 border-black flex items-center justify-center p-4">
                        <img src={VALE_LOGO_URL} alt="Logo Vale" className="w-full object-contain" />
                    </div>
                    <div className="flex-1 text-center p-4 bg-gray-50 print:bg-gray-50">
                        <h1 className="text-2xl font-black uppercase tracking-widest">{title}</h1>
                        <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Sistema de Gestão de Segurança e Manutenção</p>
                    </div>
                    <div className="w-56 border-l-2 border-black flex flex-col justify-center p-3 text-[10px] bg-gray-50 print:bg-gray-50">
                         <div className="flex justify-between border-b border-gray-300 pb-1 mb-1"><strong>DATA EMISSÃO:</strong> <span>{new Date().toLocaleDateString('pt-BR')}</span></div>
                         <div className="flex justify-between border-b border-gray-300 pb-1 mb-1"><strong>REVISÃO:</strong> <span>04</span></div>
                         <div className="flex justify-between"><strong>RESPONSÁVEL:</strong> <span>PLANEJAMENTO</span></div>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full border-collapse border border-black text-[10px]">
                    <thead className="bg-gray-800 text-white print:bg-gray-800 print:text-white">
                        <tr>
                            <th className="border border-black p-1">DATA</th>
                            <th className="border border-black p-1">H. INÍCIO</th>
                            <th className="border border-black p-1">H. FIM</th>
                            <th className="border border-black p-1">EQUIPAMENTO</th>
                            <th className="border border-black p-1">OM</th>
                            <th className="border border-black p-1 w-1/4">DESCRIÇÃO DA ATIVIDADE</th>
                            <th className="border border-black p-1">CENTRO DE TRAB.</th>
                            <th className="border border-black p-1">EXECUTANTE/REC.</th>
                            <th className="border border-black p-1">PRIORIDADE</th>
                            <th className="border border-black p-1 text-center">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((item, index) => (
                            <tr key={index} className={`border border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100 print:bg-gray-100'}`}>
                                <td className="border border-black p-1 text-center font-mono">{new Date(item.startDate).toLocaleDateString('pt-BR').slice(0,5)}</td>
                                <td className="border border-black p-1 text-center font-mono">{item.startTime}</td>
                                <td className="border border-black p-1 text-center font-mono">{item.endTime}</td>
                                <td className="border border-black p-1 font-bold text-center">{item.omFrota}</td>
                                <td className="border border-black p-1 text-center">{item.om || '-'}</td>
                                <td className="border border-black p-1 font-bold uppercase">{item.description}</td>
                                <td className="border border-black p-1 text-center">{item.workCenter}</td>
                                <td className="border border-black p-1">{item.resource}</td>
                                <td className="border border-black p-1 text-center text-[9px] font-bold uppercase">{item.priority}</td>
                                <td className="border border-black p-1 text-center">
                                    <div className="w-3 h-3 border border-black inline-block mr-1"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer Signatures */}
                <div className="mt-8 flex justify-between gap-10 avoid-break">
                    <div className="flex-1 text-center">
                        <div className="border-b border-black h-8 mb-1"></div>
                        <p className="text-xs font-bold uppercase">SUPERVISOR DE MANUTENÇÃO</p>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="border-b border-black h-8 mb-1"></div>
                        <p className="text-xs font-bold uppercase">PLANEJADOR</p>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="border-b border-black h-8 mb-1"></div>
                        <p className="text-xs font-bold uppercase">COORDENAÇÃO</p>
                    </div>
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
                    {/* FIX: Remove print button as per user request */}
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
            {/* Template content simplified for brevity, assume full implementation from original file */}
            <table className="document-table mb-6">
                <tbody>
                    <tr className="bg-gray-50 print:bg-gray-50">
                        <td className="w-48 text-center p-4 border-r-2 border-black">
                            <img src={VALE_LOGO_URL} alt="Vale Logo" className="w-full object-contain" />
                        </td>
                        <td className="text-center p-4">
                            <h1 className="text-2xl font-black uppercase tracking-widest">{getTitle()}</h1>
                            <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Sistema de Gestão de Segurança e Manutenção</p>
                        </td>
                        <td className="w-48 text-xs p-3 align-top border-l-2 border-black">
                            <div className="flex justify-between border-b border-gray-300 pb-1 mb-1"><strong>DATA:</strong> <span>{data.date}</span></div>
                            <div className="flex justify-between border-b border-gray-300 pb-1 mb-1"><strong>HORA:</strong> <span>{data.time}</span></div>
                            <div className="flex justify-between"><strong>ID DOC:</strong> <span className="font-mono">{data.maintenanceId ? data.maintenanceId.slice(-6) : data.id?.toString().slice(-6) ?? 'Novo'}</span></div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            {/* Dynamic Content based on type */}
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
            
            {/* Specific Type Rendering */}
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
                                    const status = data.checks?.[idx + '-' + item] || data.checks?.[key] || 'na';
                                    const obs = data.obs?.[idx + '-' + item] || data.obs?.[key];
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
                                <img src={sig.signatureImage} className="h-12 mb-1 object-contain border border-dashed border-gray-400 p-1 bg-white" alt="Assinatura" />
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
            // FIX: Remove print button as per user request and adjust layout
            <div className="no-print mt-8 w-full max-w-[210mm] grid grid-cols-1 gap-4 mb-10">
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

const generateReportText = (m, doc) => {
    let text = `*RELATÓRIO DE MANUTENÇÃO - ${m.tag}*\n`;
    text += `--------------------------------\n`;
    text += `*OM:* ${m.om || 'N/A'}\n`;
    text += `*DATA:* ${new Date().toLocaleDateString('pt-BR')}\n`;
    text += `*EXECUTANTE:* ${m.userName || 'N/A'}\n`;
    text += `*ATIVIDADE:* ${m.taskName}\n`;
    
    if (m.startTime && m.endTime) {
        const start = new Date(m.startTime);
        const end = new Date(m.endTime);
        const diff = end.getTime() - start.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        text += `*DURAÇÃO:* ${hours}h ${minutes}m\n`;
    }

    if (doc) {
        if (doc.type === 'checklist' && doc.checks) {
             text += `\n*CHECKLIST DE ENTREGA:*\n`;
             let hasIssues = false;
             SYSTEMS_CHECKLIST.forEach((sys, idx) => {
                 const nokItems = sys.items.filter(item => {
                     const status = doc.checks[`${idx}-${item}`] || doc.checks[`${sys.name}-${item}`];
                     return status === 'nok';
                 });
                 
                 if (nokItems.length > 0) {
                     hasIssues = true;
                     text += `\n📍 *${sys.name}*\n`;
                     nokItems.forEach(item => {
                         const obs = doc.obs?.[`${idx}-${item}`] || doc.obs?.[`${sys.name}-${item}`];
                         text += `❌ ${item}${obs ? ` (${obs})` : ''}\n`;
                     });
                 }
             });
             
             if (!hasIssues) text += `✅ Equipamento em condições normais de operação.\n`;
        } else if (doc.correctionDescription) {
             text += `\n*OBSERVAÇÕES:* ${doc.correctionDescription}\n`;
        }
    }

    text += `--------------------------------\n`;
    text += `Gerado via App de Manutenção`;
    
    return text;
};

const ReportCard: React.FC<{ m: any; doc: any; settings: any, onGenerateQr: (text: string) => void, onGenerateYemReport: () => void }> = ({ m, doc, settings, onGenerateQr, onGenerateYemReport }) => {
    const [deviations, setDeviations] = useState('');
    const baseReportText = useMemo(() => generateReportText(m, doc), [m, doc]);

    const copyToClipboard = () => {
        let fullReportText = baseReportText;
        if (deviations.trim()) {
            fullReportText += `\n--------------------------------\n`;
            fullReportText += `*DESVIOS E PENDÊNCIAS:*\n${deviations.trim()}`;
        }
        navigator.clipboard.writeText(fullReportText);
        alert("Relatório copiado para a área de transferência!");
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col h-full transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4 border-b pb-4 bg-gray-50 -mx-6 -mt-6 px-6 pt-6 rounded-t-lg">
                <div>
                    <h3 className="font-black text-xl text-gray-800">{m.tag}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold bg-black text-yellow-400 px-2 py-1 rounded">OM: {m.om}</span>
                        <span className="text-xs font-bold text-gray-500">{doc.activityType}</span>
                    </div>
                </div>
                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                    <Icons.CheckSquare size={12}/> ENCERRADO
                </span>
            </div>
            
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Relatório Padrão (Não Editável):</label>
            <div 
                className="flex-1 text-sm text-gray-800 space-y-2 mb-6 whitespace-pre-wrap font-mono bg-gray-100 p-4 rounded border border-gray-200 h-[200px] overflow-y-auto shadow-inner leading-relaxed"
            >
                {baseReportText}
            </div>
            
            <div className="grid grid-cols-1 gap-2 mt-auto">
                 <button 
                    onClick={onGenerateYemReport}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
                >
                    <Icons.FileSpreadsheet size={18} /> GERAR RELATÓRIO CONFORME
                </button>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={copyToClipboard}
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
                    >
                        <Icons.Copy size={18} /> COPIAR PADRÃO
                    </button>
                    <button
                        onClick={() => onGenerateQr(baseReportText)}
                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold p-3 rounded-lg flex items-center justify-center transition-colors text-sm shadow-md"
                        title="Gerar QR Code"
                    >
                        <Icons.QrCode size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ScreenReports = ({ activeMaintenances, docs, settings }) => {
    const finishedMaintenances = activeMaintenances.filter(m => m.status === 'finished');
    const [qrCodeData, setQrCodeData] = useState(null);
    const [yemReportData, setYemReportData] = useState(null);

    const handleGenerateQr = (reportText) => {
        if (!navigator.onLine) {
            alert("A geração de QR Code requer uma conexão com a internet.");
            return;
        }
        setQrCodeData(reportText);
    };

    return (
        <div className="p-8 h-full flex flex-col bg-gray-100">
             {qrCodeData && <QRCodeModal data={qrCodeData} onClose={() => setQrCodeData(null)} />}
             {yemReportData && <YemReportModal m={yemReportData.m} doc={yemReportData.doc} onClose={() => setYemReportData(null)} />}
            <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-4">
                 <h2 className="text-4xl font-black flex items-center text-gray-800 tracking-tight">
                    <Icons.ClipboardList className="mr-4 w-10 h-10 text-yellow-600" /> 
                    RELATÓRIOS DE RETORNO
                </h2>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-500">OMs Encerradas</p>
                    <p className="text-3xl font-bold text-gray-800">{finishedMaintenances.length}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto pb-10 px-2">
                {finishedMaintenances.map((m) => {
                    const relatedDocs = docs.filter(d => d.maintenanceId === m.id);
                    const doc = relatedDocs.find(d => d.type === 'checklist') || relatedDocs[0];

                    if (!doc) return null;

                    return <ReportCard key={m.id} m={m} doc={doc} settings={settings} onGenerateQr={handleGenerateQr} onGenerateYemReport={() => setYemReportData({ m, doc })} />;
                })}
                {finishedMaintenances.length === 0 && (
                    <div className="col-span-full text-center py-32 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 text-gray-400">
                        <Icons.FileCheck className="w-24 h-24 mx-auto mb-6 opacity-20" />
                        <p className="text-2xl font-bold text-gray-300">Nenhuma manutenção encerrada disponível para relatório.</p>
                        <p className="text-sm mt-2">Encerre uma manutenção através do Checklist para gerar o relatório.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ScreenProgramming = ({ schedule, onStartTask, activeMaintenances }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    
    const filteredSchedule = schedule.filter(item => {
        if (!selectedDate) return true;
        const today = selectedDate;
        const start = item.startDate;
        const end = item.endDate || item.startDate;
        return today >= start && today <= end;
    }).sort((a, b) => new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime());

    if (showPrintPreview) {
        return <ProgrammingPrintTemplate schedule={filteredSchedule} onClose={() => setShowPrintPreview(false)} />;
    }

    return (
        <div className="h-full flex flex-col bg-gray-100">
            <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-3xl font-bold flex items-center text-gray-800">
                        <Icons.Calendar className="mr-3 w-8 h-8" /> PROGRAMAÇÃO DE MANUTENÇÃO
                    </h2>
                    {/* FIX: Removed print/pdf button as per user request */}
                </div>
            </div>

            {/* QUICK ACTIONS & FILTERS */}
            <div className="px-6">
                <div className="bg-white p-4 rounded shadow mb-4 border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                         <div>
                            <label className="text-xs font-bold block text-gray-500 mb-1">FILTRAR POR DATA:</label>
                            <input type="date" className="border p-2 rounded text-sm font-bold bg-gray-50" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                            {selectedDate && <button onClick={() => setSelectedDate('')} className="ml-2 text-xs text-red-500 underline">Limpar</button>}
                         </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-400">Total de Itens</p>
                        <p className="text-xl font-bold">{filteredSchedule.length}</p>
                    </div>
                </div>
            </div>

            {/* MAIN TABLE - FORMAL LAYOUT */}
            <div className="bg-white rounded-t-lg shadow-lg overflow-hidden flex-1 border border-gray-400 flex flex-col mx-6 mb-6">
                 <div className="overflow-auto flex-1">
                     <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                         <thead className="bg-black text-white uppercase sticky top-0 z-10 shadow-md">
                             <tr>
                                 <th className="p-3 border border-gray-600">FROTA/OM</th>
                                 <th className="p-3 border border-gray-600">DESCRIÇÃO DA ATIVIDADE</th>
                                 <th className="p-3 border border-gray-600">DATA MIN</th>
                                 <th className="p-3 border border-gray-600">DATA MAX</th>
                                 <th className="p-3 border border-gray-600">PRIORIDADE</th>
                                 <th className="p-3 border border-gray-600">N DE PESSOAS</th>
                                 <th className="p-3 border border-gray-600">H</th>
                                 <th className="p-3 border border-gray-600">DATA INICIO</th>
                                 <th className="p-3 border border-gray-600">DATA FIM</th>
                                 <th className="p-3 border border-gray-600">CENTRO DE TRABALHO</th>
                                 <th className="p-3 border border-gray-600">HORA INICIO</th>
                                 <th className="p-3 border border-gray-600">HORA FIM</th>
                                 <th className="p-3 border border-gray-600">RECURSOS</th>
                                 <th className="p-3 border border-gray-600">AÇÃO</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-200">
                             {filteredSchedule.map((item) => {
                                 const isTaskActive = activeMaintenances.some(m => m.programmingId === item.id && m.status !== 'finished');
                                 return (
                                     <tr key={item.id} className="hover:bg-yellow-50">
                                         <td className="p-3 border">{item.omFrota}</td>
                                         <td className="p-3 border">{item.description}</td>
                                         <td className="p-3 border">{item.dateMin}</td>
                                         <td className="p-3 border">{item.dateMax}</td>
                                         <td className="p-3 border">{item.priority}</td>
                                         <td className="p-3 border">{item.peopleCount}</td>
                                         <td className="p-3 border">{item.hours}</td>
                                         <td className="p-3 border">{item.startDate}</td>
                                         <td className="p-3 border">{item.endDate}</td>
                                         <td className="p-3 border">{item.workCenter}</td>
                                         <td className="p-3 border">{item.startTime}</td>
                                         <td className="p-3 border">{item.endTime}</td>
                                         <td className="p-3 border bg-blue-50 font-semibold text-blue-800">{item.resource}</td>
                                         <td className="p-3 border">
                                            <div className="flex items-center justify-center gap-1">
                                                <button 
                                                    onClick={() => onStartTask(item)}
                                                    disabled={isTaskActive}
                                                    className={`flex items-center justify-center gap-1 text-white text-xs px-2 py-2 rounded font-bold transition-colors ${
                                                        isTaskActive 
                                                            ? 'bg-gray-400 cursor-not-allowed' 
                                                            : 'bg-green-600 hover:bg-green-700'
                                                    }`}
                                                    title="Iniciar Tarefa no Dashboard"
                                                >
                                                    <Icons.PlayCircle size={14} /> 
                                                    <span className="hidden sm:inline">{isTaskActive ? 'ATIVO' : 'INICIAR'}</span>
                                                </button>
                                            </div>
                                         </td>
                                     </tr>
                                 );
                             })}
                             {filteredSchedule.length === 0 && (
                                 <tr><td colSpan={14} className="p-12 text-center text-gray-400 font-bold bg-white">Nenhuma atividade encontrada para o filtro selecionado.</td></tr>
                             )}
                         </tbody>
                     </table>
                 </div>
                 <div className="p-2 bg-black text-white border-t border-gray-800 text-[10px] text-center font-mono uppercase">
                     Sistema de Gestão de Manutenção - Visualização Oficial
                 </div>
            </div>
        </div>
    );
};

const ProgrammingAlert = ({ schedule, onClose }) => {
    // Correctly get "Today" in local time YYYY-MM-DD format
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localNow = new Date(now.getTime() - (offset*60*1000));
    const todayISO = localNow.toISOString().split('T')[0];

    // The alert correctly filters tasks where today's date falls within the task's start and end dates.
    const todaysItems = schedule?.filter(item => {
        if (!item.startDate) return false;
        const start = item.startDate;
        const end = item.endDate || item.startDate;
        return todayISO >= start && todayISO <= end;
    }) || [];

    if (todaysItems.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex flex-col items-center justify-center animate-fade-in text-white p-4">
            <div className="w-full max-w-6xl bg-yellow-500 text-black rounded-lg shadow-2xl overflow-hidden border-4 border-white transform transition-all scale-100 flex flex-col max-h-screen relative">
                <button onClick={onClose} className="absolute top-4 right-4 bg-white hover:bg-red-500 hover:text-white text-black p-2 rounded-full font-bold z-50 shadow-lg transition-colors border-2 border-black" title="Interromper Alerta">
                    <Icons.X size={24} />
                </button>
                <div className="bg-black text-yellow-500 p-6 text-center shrink-0">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter flex justify-center items-center gap-4 animate-pulse">
                        <Icons.AlertTriangle className="w-12 h-12 md:w-20 md:h-20" />
                        PROGRAMAÇÃO DO DIA
                        <Icons.AlertTriangle className="w-12 h-12 md:w-20 md:h-20" />
                    </h1>
                    <p className="text-xl mt-2 text-white font-bold">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div className="p-4 bg-yellow-400 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-3">
                        {todaysItems.map(item => (
                            <div key={item.id} className="bg-white border-l-8 border-black p-4 shadow-lg flex flex-col md:flex-row justify-between items-center rounded gap-4">
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        {item.omFrota && <span className="bg-white text-black border border-black text-xs font-bold px-2 py-1 rounded">OM: {item.omFrota}</span>}
                                        <span className="bg-black text-yellow-500 text-lg font-black px-2 py-1 rounded uppercase">{item.workCenter || 'GERAL'}</span>
                                        <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">REC: {item.resource}</span>
                                        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">PRIORIDADE: {item.priority}</span>
                                    </div>
                                    <p className="text-xl md:text-2xl text-gray-800 font-bold uppercase leading-tight">{item.description}</p>
                                    <div className="flex gap-4 mt-2 text-sm font-bold text-gray-600">
                                         <span><Icons.Users className="inline w-4 h-4 mr-1"/> {item.peopleCount || '-'} Pessoas</span>
                                         <span><Icons.Clock className="inline w-4 h-4 mr-1"/> {item.startTime || '--:--'} - {item.endTime || '--:--'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-black p-2 text-center text-white text-sm font-mono shrink-0">
                    EXIBINDO POR {PROGRAMMING_ALERT_DURATION / 1000} SEGUNDOS...
                </div>
            </div>
        </div>
    );
};

const CorrectiveMaintenanceAlert = ({ tasks, onClose }) => {
    if (tasks.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex flex-col items-center justify-center animate-fade-in text-white p-4">
            <div className="w-full max-w-4xl bg-red-600 text-white rounded-lg shadow-2xl overflow-hidden border-4 border-white transform transition-all scale-100 flex flex-col max-h-screen relative">
                <button onClick={onClose} className="absolute top-4 right-4 bg-white hover:bg-yellow-400 hover:text-black text-black p-2 rounded-full font-bold z-50 shadow-lg transition-colors border-2 border-black" title="Interromper Alerta">
                    <Icons.X size={24} />
                </button>
                <div className="bg-black text-red-500 p-6 text-center shrink-0">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter flex justify-center items-center gap-4 animate-pulse">
                        <Icons.AlertTriangle className="w-12 h-12 md:w-20 md:h-20" />
                        ALERTA: MANUTENÇÃO CORRETIVA
                        <Icons.AlertTriangle className="w-12 h-12 md:w-20 md:h-20" />
                    </h1>
                    <p className="text-xl mt-2 text-white font-bold">TAREFAS ATIVAS NÃO PROGRAMADAS</p>
                </div>
                
                <div className="p-4 bg-red-500 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-3">
                        {tasks.map(task => (
                            <div key={task.id} className="bg-white text-black border-l-8 border-black p-4 shadow-lg flex flex-col md:flex-row justify-between items-center rounded gap-4">
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        {task.tag && <span className="bg-white text-black border border-black text-xs font-bold px-2 py-1 rounded">TAG: {task.tag}</span>}
                                        <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">Resp: {task.userName}</span>
                                    </div>
                                    <p className="text-xl md:text-2xl text-gray-800 font-bold uppercase leading-tight">{task.taskName}</p>
                                </div>
                                <div className="font-mono font-bold text-lg bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                                    <MaintenanceTimer startTime={task.startTime} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-black p-2 text-center text-white text-sm font-mono shrink-0">
                    ALERTA ATIVO POR 20 SEGUNDOS...
                </div>
            </div>
        </div>
    );
};

// --- SCREENS ---

const ScreenLogin = ({ onLogin, users, onUserChange }) => {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMatricula, setForgotMatricula] = useState('');

  // Registration states
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regMatricula, setRegMatricula] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Técnico'); // Default role
  
  // Fake Network Search state
  const [searchingNetwork, setSearchingNetwork] = useState(false);
  const [networkFound, setNetworkFound] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.matricula === matricula && u.password === password);
    if (user) {
        if (user.role === 'admin') {
            const sessionId = Date.now() + Math.random();
            localStorage.setItem('adminSession', JSON.stringify({ sessionId }));
            user.sessionId = sessionId;
        }
        onLogin(user);
    } else {
        alert('Credenciais inválidas');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if(!regName || !regMatricula || !regPassword) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }
    if(users.find(u => u.matricula === regMatricula)) {
        alert("Usuário já cadastrado com esta matrícula.");
        return;
    }
    const newUser = {
        name: regName,
        matricula: regMatricula,
        password: regPassword,
        role: regRole === 'Admin' ? 'admin' : 'user'
    };
    onUserChange({ type: 'ADD_USER', payload: newUser });
    alert("Cadastro realizado com sucesso! Faça login.");
    setIsRegistering(false);
    // Auto-fill login
    setMatricula(regMatricula);
    setPassword('');
  };

  const handleCreateAdmin = () => {
    const newUser = { name: 'Administrador', matricula: 'admin', password: 'admin', role: 'admin' };
    onUserChange({ type: 'ADD_USER', payload: newUser });
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

  const handleSearchNetwork = () => {
      setSearchingNetwork(true);
      setTimeout(() => {
          setSearchingNetwork(false);
          setNetworkFound(true);
      }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans">
      {/* BACKGROUND & OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://storage.googleapis.com/aistudio-hub-generative-ai-assets/e69315f0-6c90-48e0-a7d1-e97022d861ce/vale-background.png" 
            alt="Industrial Background" 
            className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/80 to-black/60"></div>
      </div>
      
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500 z-20 shadow-[0_0_20px_rgba(234,179,8,0.6)]"></div>
      <div className="absolute bottom-0 w-full h-2 bg-yellow-500 z-20"></div>

      <div className="relative z-10 w-full max-w-lg p-8 mx-4">
        {/* LOGO AREA */}
        <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
            <img src={VALE_LOGO_URL} alt="Vale Logo" className="w-32 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-6xl font-black text-white tracking-tighter mb-2 leading-none drop-shadow-2xl">
                ART
            </h1>
            <div className="flex items-center justify-center gap-3">
                 <div className="h-1 w-12 bg-yellow-500 rounded"></div>
                 <h2 className="text-yellow-500 text-sm md:text-base font-bold uppercase tracking-[0.2em]">ANÁLISE PRELIMINAR DA TAREFA</h2>
                 <div className="h-1 w-12 bg-yellow-500 rounded"></div>
            </div>
        </div>

        {/* CARD */}
        <div className="bg-black/60 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

            {!showForgot && !isRegistering && (
                <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in duration-500">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Bem-vindo</h3>
                        <p className="text-gray-400 text-sm">Faça login para acessar o sistema de segurança.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="group/input">
                            <label className="block text-xs font-bold text-yellow-500 uppercase mb-1 ml-1 group-focus-within/input:text-yellow-400 transition-colors">Matrícula</label>
                            <div className="relative">
                                <Icons.User className="absolute left-4 top-3.5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:bg-gray-800 transition-all font-bold" 
                                    placeholder="Digite sua matrícula"
                                    value={matricula} 
                                    onChange={e => setMatricula(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group/input">
                            <label className="block text-xs font-bold text-yellow-500 uppercase mb-1 ml-1 group-focus-within/input:text-yellow-400 transition-colors">Senha</label>
                            <div className="relative">
                                <Icons.Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:bg-gray-800 transition-all font-bold"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-1 text-lg uppercase tracking-wider flex items-center justify-center gap-2">
                        ENTRAR <Icons.ArrowRightLeft size={20} className="hidden" />
                    </button>
                    
                    <div className="flex justify-between items-center text-xs mt-4">
                        <button type="button" onClick={() => setShowForgot(true)} className="text-gray-400 hover:text-white hover:underline transition-colors">
                            Esqueci a senha
                        </button>
                        <button type="button" onClick={() => setIsRegistering(true)} className="text-yellow-500 hover:text-yellow-300 font-bold hover:underline transition-colors uppercase">
                            CRIAR CONTA
                        </button>
                    </div>

                    {/* FAKE NETWORK SEARCH */}
                    <div className="border-t border-gray-700 pt-4 mt-2">
                        {!networkFound ? (
                            <button type="button" onClick={handleSearchNetwork} className="w-full flex items-center justify-center text-xs text-gray-500 hover:text-white transition-colors gap-2">
                                <Icons.Wifi size={14} className={searchingNetwork ? 'animate-ping' : ''}/>
                                {searchingNetwork ? 'BUSCANDO REDE LOCAL...' : 'BUSCAR REDE LOCAL'}
                            </button>
                        ) : (
                            <div className="w-full flex items-center justify-center text-xs text-green-500 font-bold gap-2 animate-pulse">
                                <Icons.Wifi size={14} /> REDE LOCAL CONECTADA
                            </div>
                        )}
                    </div>

                </form>
            )}

            {isRegistering && (
                <form onSubmit={handleRegister} className="space-y-4 animate-in slide-in-from-right duration-500">
                     <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Nova Conta</h3>
                            <p className="text-gray-400 text-sm">Preencha seus dados para acesso.</p>
                        </div>
                        <button type="button" onClick={() => setIsRegistering(false)} className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
                            <Icons.ArrowRightLeft size={20} className="rotate-180" />
                        </button>
                    </div>

                    <div className="space-y-3">
                         <div>
                            <label className="text-xs font-bold text-gray-400 ml-1">Nome Completo</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" 
                                placeholder="Seu nome"
                                value={regName}
                                onChange={e => setRegName(e.target.value)}
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="text-xs font-bold text-gray-400 ml-1">Matrícula</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" 
                                    placeholder="ID"
                                    value={regMatricula}
                                    onChange={e => setRegMatricula(e.target.value)}
                                />
                             </div>
                             <div>
                                <label className="text-xs font-bold text-gray-400 ml-1">Função</label>
                                <select 
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none appearance-none"
                                    value={regRole}
                                    onChange={e => setRegRole(e.target.value)}
                                >
                                    <option>Técnico</option>
                                    <option>Engenheiro</option>
                                    <option>Gestor</option>
                                    <option>Admin</option>
                                </select>
                             </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-400 ml-1">Senha</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" 
                                placeholder="Crie uma senha"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                            />
                         </div>
                    </div>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-lg shadow-lg mt-4 text-lg uppercase tracking-wider transition-all hover:scale-[1.02]">
                        CADASTRAR E ENTRAR
                    </button>
                </form>
            )}

            {showForgot && (
                <div className="space-y-5 animate-in slide-in-from-right duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-xl text-white">Recuperar Acesso</h3>
                        <button onClick={() => setShowForgot(false)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                            <Icons.X size={20}/>
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">Digite sua matrícula abaixo. Enviaremos as instruções de recuperação para o e-mail corporativo cadastrado.</p>
                    
                    <div className="relative">
                        <Icons.User className="absolute left-4 top-3.5 text-gray-500" size={20} />
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-800/50 text-white focus:border-yellow-500 outline-none placeholder-gray-600"
                            placeholder="Sua Matrícula"
                            value={forgotMatricula}
                            onChange={e => setForgotMatricula(e.target.value)}
                        />
                    </div>
                    
                    <button onClick={handleForgotPassword} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors border border-gray-600 hover:border-gray-500">
                        ENVIAR INSTRUÇÕES
                    </button>
                </div>
            )}
            
            {!showForgot && !isRegistering && users.length === 0 && (
              <button onClick={handleCreateAdmin} className="mt-6 w-full text-xs text-gray-500 hover:text-white font-bold transition-colors opacity-50 hover:opacity-100">
                [DEBUG] Criar Admin Inicial
              </button>
            )}
        </div>
      </div>
      
      {/* FOOTER */}
      <div className="absolute bottom-4 text-center w-full z-10 text-[10px] text-gray-500 font-mono">
        © 2024 ART SYSTEM v3.5 | SEGURANÇA E CONFIABILIDADE
      </div>
    </div>
  );
};

const ScreenDashboard = ({ currentUser, activeMaintenances, onOpenChecklist, refreshData, networkName, isOnline, location, syncStatus, offlineQueueLength, onRequestNotifications, notificationPermission }) => {
  const activeList = activeMaintenances.filter(m => m.status !== 'finished');
  const finishedList = activeMaintenances.filter(m => m.status === 'finished');
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState('idle');

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);
  
  useEffect(() => {
      if (location && isOnline) {
        setWeatherStatus('loading');
        const { latitude, longitude } = location;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
          .then(res => {
              if(!res.ok) throw new Error('Network response was not ok');
              return res.json();
          })
          .then(data => {
            setWeather(data.current_weather);
            setWeatherStatus('success');
          })
          .catch(error => {
            console.error("Error fetching weather", error);
            setWeatherStatus('error');
          });
      } else if (!isOnline) {
          setWeatherStatus('error');
      }
  }, [location, isOnline]);

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="bg-black text-yellow-400 p-6 rounded-lg shadow-lg mb-6 border-l-8 border-yellow-500 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold uppercase mb-1 tracking-tighter">SEGURANÇA EM 1º LUGAR</h1>
            <p className="text-lg italic text-white opacity-90">"Nenhum trabalho é tão urgente que não possa ser feito com segurança."</p>
          </div>
          <div className="text-right text-white flex items-center gap-4">
             <WeatherWidget weather={weather} status={weatherStatus} />
             <div className="hidden md:block">
                 <div className="flex items-center justify-end mb-1">
                     <Icons.Lock className="w-3 h-3 text-green-500 mr-1" />
                     <p className="text-sm font-bold">{currentUser.name}</p>
                 </div>
                 <div className="flex items-center justify-end gap-2 mt-1">
                     <SyncStatusIndicator status={syncStatus} queueLength={offlineQueueLength} />
                      {notificationPermission === 'default' && (
                        <button onClick={onRequestNotifications} className="flex items-center gap-2 text-xs text-yellow-300 bg-yellow-900/50 px-3 py-1 rounded-full border border-yellow-700 hover:bg-yellow-800">
                            <Icons.Bell size={14} /> Ativar Alertas
                        </button>
                      )}
                      {notificationPermission === 'granted' && (
                        <div className="flex items-center gap-2 text-xs text-green-300">
                          <Icons.Bell size={14} /> Alertas Ativos
                        </div>
                      )}
                 </div>
             </div>
          </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          <div className="lg:col-span-2 bg-white rounded shadow-xl border border-gray-300 flex flex-col relative overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10 relative">
                 <h2 className="text-2xl font-bold text-red-600 flex items-center animate-pulse">
                    <Icons.Activity /> <span className="ml-2">EM ANDAMENTO</span>
                 </h2>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 animate-pulse flex items-center"><Icons.Clock className="w-3 h-3 mr-1"/> Atualização: 10s</span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                        {activeList.length} ATIVOS
                    </span>
                 </div>
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
const ScreenArtEmergencial = ({ onSave, employees, editingDoc, settings }) => {
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
  const [maintenanceType, setMaintenanceType] = useState('corretiva');
  const [correctionDescription, setCorrectionDescription] = useState('');
  
  const [draftToLoad, setDraftToLoad] = useState(null);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const draftKey = useMemo(() => editingDoc ? `draft_emergencial_${editingDoc.id}` : 'draft_emergencial_new', [editingDoc]);
  
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
      id: editingDoc?.id ?? Date.now()
    };
  };

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
      setMaintenanceType(editingDoc.maintenanceType || 'corretiva');
      setCorrectionDescription(editingDoc.correctionDescription || '');
    }
  }, [editingDoc]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft.taskName || Object.keys(parsedDraft.checkedRisks || {}).length > 0) {
          setDraftToLoad(parsedDraft);
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
        localStorage.removeItem(draftKey);
      }
    }
  }, [draftKey]);

  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
        const currentData = {
            ...header, type: 'emergencial', checkedRisks, riskLocations, riskControls,
            signatures, maintenanceType, correctionDescription, id: editingDoc?.id ?? Date.now()
        };

        if (currentData.taskName || Object.keys(currentData.checkedRisks).length > 0 || currentData.signatures.length > 0) {
            localStorage.setItem(draftKey, JSON.stringify(currentData));
            setShowSaveToast(true);
            setTimeout(() => setShowSaveToast(false), 2500);
        }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [header, checkedRisks, riskLocations, riskControls, signatures, maintenanceType, correctionDescription, editingDoc, draftKey]);

  const handleLoadDraft = () => {
    const draft = draftToLoad;
    setHeader({
      taskName: draft.taskName || '', om: draft.om || '', tag: draft.tag || '',
      activityType: draft.activityType || 'Mecânica', location: draft.location || '',
      hasPlanning: draft.hasPlanning || false, docVersion: draft.docVersion || header.docVersion,
      date: draft.date || new Date().toLocaleDateString('pt-BR'),
      time: draft.time || new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
    });
    setCheckedRisks(draft.checkedRisks || {});
    setRiskLocations(draft.riskLocations || {});
    setRiskControls(draft.riskControls || {});
    setSignatures(draft.signatures || []);
    setMaintenanceType(draft.maintenanceType || 'corretiva');
    setCorrectionDescription(draft.correctionDescription || '');
    setDraftToLoad(null);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(draftKey);
    setDraftToLoad(null);
  };
  
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
    localStorage.removeItem(draftKey);
    onSave({ type: 'SAVE_DOC', payload: getDocData() });
  };

  const QUADRANTS = ['Frente / Abaixo', 'Atrás / Acima', 'Esquerda', 'Direita'];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded relative">
        {draftToLoad && <DraftLoadModal onConfirm={handleLoadDraft} onDiscard={handleDiscardDraft} />}
        <AutoSaveIndicator isVisible={showSaveToast} />
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
        <p className="font-bold mb-2">ETAPA DE EXECUÇÃO: Essa tarefa possui PRO ou ART de planejamento? <span className="font-mono font-bold ml-2">{header.hasPlanning ? '[X] SIM  [ ] NÃO' : '[ ] SIM  [ ] NÃO'}</span></p>
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
const ScreenArtAtividade = ({ onSave, employees, editingDoc, settings, externalDocs }) => {
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
  const [maintenanceType, setMaintenanceType] = useState('corretiva');
  const [correctionDescription, setCorrectionDescription] = useState('');
  
  const [draftToLoad, setDraftToLoad] = useState(null);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const draftKey = useMemo(() => editingDoc ? `draft_atividade_${editingDoc.id}` : 'draft_atividade_new', [editingDoc]);

  const getDocData = () => {
     return {
         ...header, type: 'atividade', steps, principalRisks, controlSummary,
         additionalMeasures, signatures, attachedPdfName, maintenanceType,
         correctionDescription, id: editingDoc?.id ?? Date.now()
     };
  };
  
  useEffect(() => {
    if (editingDoc) {
        setHeader({
            taskName: editingDoc.taskName, om: editingDoc.om, tag: editingDoc.tag,
            activityType: editingDoc.activityType, location: editingDoc.location,
            date: editingDoc.date || header.date, time: editingDoc.time || header.time
        });
        setSteps(editingDoc.steps || ['']);
        setPrincipalRisks(editingDoc.principalRisks || [{risk: '', total: '', level: 'MÉDIA'}]);
        setControlSummary(editingDoc.controlSummary || '');
        setAdditionalMeasures(editingDoc.additionalMeasures || '');
        setSignatures(editingDoc.signatures || []);
        setAttachedPdfName(editingDoc.attachedPdfName || '');
        setMaintenanceType(editingDoc.maintenanceType || 'corretiva');
        setCorrectionDescription(editingDoc.correctionDescription || '');
    }
  }, [editingDoc]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft.taskName || parsedDraft.steps?.length > 1) {
          setDraftToLoad(parsedDraft);
        }
      } catch (e) { console.error("Failed to parse draft", e); localStorage.removeItem(draftKey); }
    }
  }, [draftKey]);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
        const currentData = getDocData();
        if (currentData.taskName || currentData.steps.some(s => s) || currentData.signatures.length > 0) {
            localStorage.setItem(draftKey, JSON.stringify(currentData));
            setShowSaveToast(true);
            setTimeout(() => setShowSaveToast(false), 2500);
        }
    }, 30000);
    return () => clearInterval(interval);
  }, [header, steps, principalRisks, controlSummary, additionalMeasures, signatures, attachedPdfName, maintenanceType, correctionDescription, editingDoc, draftKey]);

  const handleLoadDraft = () => {
    const draft = draftToLoad;
    setHeader({
        taskName: draft.taskName || '', om: draft.om || '', tag: draft.tag || '',
        activityType: draft.activityType || 'Mecânica', location: draft.location || '',
        date: draft.date || new Date().toLocaleDateString('pt-BR'),
        time: draft.time || new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
    });
    setSteps(draft.steps || ['']);
    setPrincipalRisks(draft.principalRisks || [{risk: '', total: '', level: 'MÉDIA'}]);
    setControlSummary(draft.controlSummary || '');
    setAdditionalMeasures(draft.additionalMeasures || '');
    setSignatures(draft.signatures || []);
    setAttachedPdfName(draft.attachedPdfName || '');
    setMaintenanceType(draft.maintenanceType || 'corretiva');
    setCorrectionDescription(draft.correctionDescription || '');
    setDraftToLoad(null);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(draftKey);
    setDraftToLoad(null);
  };

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (i, val) => { const n = [...steps]; n[i] = val; setSteps(n); };
  const removeStep = (i) => { const n = [...steps]; n.splice(i, 1); setSteps(n); };

  const addRisk = () => setPrincipalRisks([...principalRisks, {risk: '', total: '', level: 'MÉDIA'}]);
  const updateRisk = (i, field, val) => { const n = [...principalRisks]; n[i][field] = val; setPrincipalRisks(n); };

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
        alert("Por favor, descreva a manutenção realizada.");
        return;
     }
     if (signatures.length === 0) {
        alert("ERRO DE VALIDAÇÃO: A assinatura é OBRIGATÓRIA para salvar este documento.");
        return;
    }
    localStorage.removeItem(draftKey);
    onSave({ type: 'SAVE_DOC', payload: getDocData() });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded relative">
        {draftToLoad && <DraftLoadModal onConfirm={handleLoadDraft} onDiscard={handleDiscardDraft} />}
        <AutoSaveIndicator isVisible={showSaveToast} />
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
const ScreenChecklist = ({ onSave, employees, editingDoc, preFill, settings }) => {
  // FIX: Add maintenanceId to the header state to prevent type errors.
  const [header, setHeader] = useState({ 
      taskName: '', om: '', tag: '', activityType: 'Mecânica', location: '',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
      maintenanceId: null
  });
  const [checks, setChecks] = useState({});
  const [obs, setObs] = useState({});
  const [signatures, setSignatures] = useState([]);
  const [maintenanceType, setMaintenanceType] = useState('preventiva');
  const [correctionDescription, setCorrectionDescription] = useState('');
  
  const [draftToLoad, setDraftToLoad] = useState(null);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const draftKey = useMemo(() => {
    const id = editingDoc?.maintenanceId || preFill?.maintenanceId;
    return id ? `draft_checklist_${id}` : 'draft_checklist_new';
  }, [editingDoc, preFill]);

  const getDocData = () => {
      return {
        ...header, type: 'checklist', checks, obs, signatures,
        maintenanceType, correctionDescription, id: editingDoc?.id ?? Date.now()
    };
  };

  useEffect(() => {
      if (preFill) {
        setHeader(prev => ({...prev, ...preFill}));
      }
      if (editingDoc) {
          // FIX: Use functional update and include maintenanceId to prevent state overwrites.
          setHeader(prev => ({
            ...prev,
            taskName: editingDoc.taskName, om: editingDoc.om, tag: editingDoc.tag,
            activityType: editingDoc.activityType, location: editingDoc.location,
            date: editingDoc.date || prev.date, time: editingDoc.time || prev.time,
            maintenanceId: editingDoc.maintenanceId
          }));
          setChecks(editingDoc.checks || {});
          setObs(editingDoc.obs || {});
          setSignatures(editingDoc.signatures || []);
          setMaintenanceType(editingDoc.maintenanceType || 'preventiva');
          setCorrectionDescription(editingDoc.correctionDescription || '');
      }
  }, [editingDoc, preFill]);

  // Load draft
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (Object.keys(parsedDraft.checks || {}).length > 0) {
          setDraftToLoad(parsedDraft);
        }
      } catch (e) { console.error("Failed to parse draft", e); localStorage.removeItem(draftKey); }
    }
  }, [draftKey]);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
        const currentData = getDocData();
        if (Object.keys(currentData.checks).length > 0 || currentData.signatures.length > 0) {
            localStorage.setItem(draftKey, JSON.stringify(currentData));
            setShowSaveToast(true);
            setTimeout(() => setShowSaveToast(false), 2500);
        }
    }, 30000);
    return () => clearInterval(interval);
  }, [header, checks, obs, signatures, maintenanceType, correctionDescription, editingDoc, draftKey]);

  const handleLoadDraft = () => {
    const draft = draftToLoad;
    // FIX: Use functional update for setHeader to ensure state consistency.
    setHeader(prev => ({
        ...prev,
        taskName: draft.taskName || preFill?.taskName || '', om: draft.om || preFill?.om || '', tag: draft.tag || preFill?.tag || '',
        activityType: draft.activityType || 'Mecânica', location: draft.location || '',
        date: draft.date || new Date().toLocaleDateString('pt-BR'),
        time: draft.time || new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        maintenanceId: draft.maintenanceId || preFill?.maintenanceId
    }));
    setChecks(draft.checks || {});
    setObs(draft.obs || {});
    setSignatures(draft.signatures || []);
    setMaintenanceType(draft.maintenanceType || 'preventiva');
    setCorrectionDescription(draft.correctionDescription || '');
    setDraftToLoad(null);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(draftKey);
    setDraftToLoad(null);
  };

  const handleCheck = (key, val) => setChecks(prev => ({...prev, [key]: val}));
  const handleObs = (key, val) => setObs(prev => ({...prev, [key]: val}));

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
    localStorage.removeItem(draftKey);
    onSave({ type: 'SAVE_DOC', payload: getDocData() });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded relative">
        {draftToLoad && <DraftLoadModal onConfirm={handleLoadDraft} onDiscard={handleDiscardDraft} />}
        <AutoSaveIndicator isVisible={showSaveToast} />
        <button 
            onClick={handleSubmit} 
            className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-2xl border-4 border-white hover:bg-green-700 z-50 flex items-center gap-2 transition-transform hover:scale-105"
            title="Salvar Checklist e Encerrar Manutenção"
        >
            <Icons.Save />
            <span className="font-bold">SALVAR E ENCERRAR OM</span>
        </button>

      <h2 className="text-2xl font-bold mb-4 bg-gray-700 text-white p-2 text-center border-2 border-black">CHECKLIST DE ENTREGA</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 border rounded">
        <input placeholder="Tarefa" className="border p-2 w-full" value={header.taskName} onChange={e => setHeader(prev => ({...prev, taskName: e.target.value}))} />
        <div>
             <label className="text-xs font-bold text-red-600 block">OM (Obrigatório)*</label>
             <input placeholder="OM" className="border p-2 w-full border-l-4 border-red-500" value={header.om} readOnly={!!preFill} onChange={e => setHeader(prev => ({...prev, om: e.target.value}))} />
        </div>
        
        <div className="w-full relative">
            <label className="text-xs font-bold text-red-600 block">TAG (Obrigatório)*</label>
            <input list="tagList" placeholder="TAG Equipamento" className="border p-2 w-full border-l-4 border-red-500" value={header.tag} readOnly={!!preFill} onChange={e => setHeader(prev => ({...prev, tag: e.target.value}))} />
            <datalist id="tagList">
                {settings?.tags?.map(t => <option key={t} value={t} />)}
            </datalist>
        </div>
        
        <select className="border p-2 w-full" value={header.location} onChange={e => setHeader(prev => ({...prev, location: e.target.value}))}>
            <option value="">Selecione o Local...</option>
            {settings?.locations?.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        <div>
            <label className="block text-xs font-bold mb-1">Data:</label>
            <input className="border p-2 w-full" value={header.date} onChange={e => setHeader(prev => ({...prev, date: e.target.value}))} />
        </div>
        <div>
            <label className="block text-xs font-bold mb-1">Hora:</label>
            <input className="border p-2 w-full" value={header.time} onChange={e => setHeader(prev => ({...prev, time: e.target.value}))} />
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
      type: 'SAVE_DOC', 
      payload: {
        ...form,
        type: 'external',
        date: new Date().toLocaleDateString('pt-BR'),
        id: editingDoc?.id ?? Date.now()
      }
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
// FIX: Removed ScreenHistory and merged its functionality into ScreenFileDocuments
const ScreenFileDocuments = ({ docs, onView, onDownload, onEdit, onDelete, onSendToNetwork, activeMaintenances }) => {
  const [search, setSearch] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);
  
  const handleGenerateQr = (doc) => {
    if (!navigator.onLine) {
        alert("A geração de QR Code requer uma conexão com a internet.");
        return;
    }
    const summary = generateDocSummary(doc);
    setQrCodeData(summary);
  };

  const filteredDocs = docs.filter(d => 
      d.taskName?.toLowerCase().includes(search.toLowerCase()) ||
      d.om?.includes(search) ||
      d.tag?.includes(search) ||
      d.fileName?.toLowerCase().includes(search.toLowerCase())
  );

  const finishedIds = new Set(activeMaintenances.filter(m => m.status === 'finished').map(m => m.id));
  
  const finishedDocs = filteredDocs.filter(d => d.maintenanceId && finishedIds.has(d.maintenanceId));
  const activeDocs = filteredDocs.filter(d => !d.maintenanceId || !finishedIds.has(d.maintenanceId));

  return (
    <div className="p-6 h-full flex flex-col md:flex-row gap-6">
        {qrCodeData && <QRCodeModal data={qrCodeData} onClose={() => setQrCodeData(null)} />}
        {/* MAIN CONTENT (LEFT) */}
        <div className="flex-1 flex flex-col bg-white rounded shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-100 flex justify-between items-center flex-wrap gap-4">
              <h2 className="font-bold text-xl flex items-center"><Icons.Folder className="mr-2"/> ARQUIVO DE DOCUMENTOS</h2>
              <input 
                  className="p-2 border rounded bg-white w-full md:w-auto" 
                  placeholder="Pesquisar..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
               />
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
                                <div className="flex justify-center gap-1">
                                    <button onClick={() => onView(doc)} className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="Visualizar">
                                        <Icons.Eye size={16} />
                                    </button>
                                    <button onClick={() => onDownload(doc)} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Visualizar para Baixar">
                                        <Icons.Download size={16} />
                                    </button>
                                    <button onClick={() => handleGenerateQr(doc)} className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" title="Gerar QR Code">
                                        <Icons.QrCode size={16} />
                                    </button>
                                    <button onClick={() => onEdit(doc)} className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200" title="Editar">
                                        <Icons.Edit size={16} />
                                    </button>
                                    <button onClick={() => onDelete({ type: 'DELETE_DOC', payload: doc.id })} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Excluir">
                                        <Icons.Trash size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {activeDocs.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhum documento ativo encontrado.</td></tr>
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
                              <button onClick={() => handleGenerateQr(doc)} className="p-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 flex-1 flex justify-center" title="Gerar QR Code">
                                <Icons.QrCode size={14} />
                            </button>
                             <button onClick={() => onDelete({ type: 'DELETE_DOC', payload: doc.id })} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 flex-1 flex justify-center"><Icons.Trash size={14}/></button>
                         </div>
                     </div>
                 ))}
                 {finishedDocs.length === 0 && <p className="text-xs text-gray-400 text-center italic">Nenhuma OM encerrada encontrada.</p>}
             </div>
        </div>
    </div>
  );
};

const ScreenTrash = ({ deletedDocs, onRestore, onPermanentDelete }) => {
    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-3xl font-bold mb-6 flex items-center"><Icons.Trash className="mr-2"/> Lixeira</h2>
            <div className="flex-1 bg-white rounded shadow-lg p-4 overflow-y-auto">
                {deletedDocs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Icons.Trash size={48} className="mb-4" />
                        <p className="text-lg font-bold">A lixeira está vazia.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr>
                                <th className="p-2">Documento</th>
                                <th className="p-2">Data de Exclusão</th>
                                <th className="p-2 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deletedDocs.map(doc => (
                                <tr key={doc.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">
                                        <p className="font-bold">{doc.taskName || doc.fileName}</p>
                                        <p className="text-xs text-gray-500">{doc.om} | {doc.tag}</p>
                                    </td>
                                    <td className="p-2 text-sm">{new Date(doc.deletedAt).toLocaleString('pt-BR')}</td>
                                    <td className="p-2 flex justify-center gap-2">
                                        <button onClick={() => onRestore(doc.id)} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Restaurar">
                                            <Icons.Restore size={18} />
                                        </button>
                                        <button onClick={() => onPermanentDelete(doc.id)} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Excluir Permanentemente">
                                            <Icons.X size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// FIX: Add missing ScreenAdminSettings component
const ScreenAdminSettings = ({ settings, onSaveSettings, adminScreenProps, activeTab, setActiveTab, localIP }) => {
    const { onDataChange, editingDoc, users, employees, schedule, onScheduleChange } = adminScreenProps;

    const tabs = [
        { id: 'general', label: 'Geral', icon: Icons.Settings },
        { id: 'users', label: 'Usuários', icon: Icons.Users },
        { id: 'employees', label: 'Funcionários', icon: Icons.User },
        { id: 'schedule', label: 'Programação', icon: Icons.Calendar },
        { id: 'external_art', label: 'Cadastrar ART (PDF)', icon: Icons.FileCode },
    ];

    const GeneralSettingsTab = () => {
        const [currentSettings, setCurrentSettings] = useState(settings);
        const [newTag, setNewTag] = useState('');
        const [newLocation, setNewLocation] = useState('');

        const handleSave = () => {
            onSaveSettings({ type: 'UPDATE_SETTINGS', payload: currentSettings });
        };

        const addTag = () => {
            if (newTag && !currentSettings.tags.includes(newTag)) {
                setCurrentSettings(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
                setNewTag('');
            }
        };

        const removeTag = (tag) => {
            setCurrentSettings(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
        };
        
        const addLocation = () => {
            if (newLocation && !currentSettings.locations.includes(newLocation)) {
                setCurrentSettings(prev => ({ ...prev, locations: [...prev.locations, newLocation] }));
                setNewLocation('');
            }
        };
        
        const removeLocation = (loc) => {
            setCurrentSettings(prev => ({ ...prev, locations: prev.locations.filter(l => l !== loc) }));
        };

        return (
            <div className="space-y-6 max-w-2xl">
                <div className="p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">TAGs de Equipamentos</h3>
                    <div className="flex gap-2">
                        <input value={newTag} onChange={e => setNewTag(e.target.value)} className="border p-2 flex-1 rounded" placeholder="Nova TAG" />
                        <button onClick={addTag} className="bg-blue-600 text-white px-4 rounded font-bold hover:bg-blue-700">Adicionar</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {currentSettings.tags?.map(tag => (
                            <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm">{tag} <button onClick={() => removeTag(tag)} className="text-red-500 font-bold text-lg leading-none">&times;</button></span>
                        ))}
                    </div>
                </div>
                <div className="p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Locais</h3>
                    <div className="flex gap-2">
                        <input value={newLocation} onChange={e => setNewLocation(e.target.value)} className="border p-2 flex-1 rounded" placeholder="Novo Local" />
                        <button onClick={addLocation} className="bg-blue-600 text-white px-4 rounded font-bold hover:bg-blue-700">Adicionar</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {currentSettings.locations?.map(loc => (
                            <span key={loc} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm">{loc} <button onClick={() => removeLocation(loc)} className="text-red-500 font-bold text-lg leading-none">&times;</button></span>
                        ))}
                    </div>
                </div>
                <div className="p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Configurações de Rede</h3>
                     <label className="block text-sm font-bold text-gray-700">IP do Servidor (Rede Local)</label>
                     <input value={currentSettings.registeredNetwork || ''} onChange={e => setCurrentSettings({...currentSettings, registeredNetwork: e.target.value})} className="border p-2 w-full rounded mt-1" placeholder="Ex: 192.168.1.100" />
                     <p className="text-xs text-gray-500 mt-1">IP local detectado: {localIP || 'N/A'}</p>
                </div>
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 text-lg flex items-center gap-2"><Icons.Save /> Salvar Configurações</button>
            </div>
        )
    };
    
    const UserForm = ({ user, onSave, onCancel }) => {
        const [formData, setFormData] = useState(user || { name: '', matricula: '', password: '', role: 'user' });
        const isNew = !user;

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };
        
        const handleSubmit = (e) => {
            e.preventDefault();
            if(!formData.name || !formData.matricula || !formData.password) {
                alert("Preencha todos os campos.");
                return;
            }
            onSave(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-yellow-50 my-4 space-y-3">
                <h4 className="font-bold">{isNew ? 'Novo Usuário' : 'Editar Usuário'}</h4>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome" className="w-full p-2 border rounded" />
                <input name="matricula" value={formData.matricula} onChange={handleChange} placeholder="Matrícula" disabled={!isNew} className="w-full p-2 border rounded disabled:bg-gray-200" />
                <input name="password" value={formData.password} onChange={handleChange} placeholder="Senha" type="password" className="w-full p-2 border rounded" />
                <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="user">Usuário</option>
                    <option value="admin">Admin</option>
                </select>
                <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
                    <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                </div>
            </form>
        );
    };

    const UsersTab = () => {
        const [showForm, setShowForm] = useState(false);
        const [editingUser, setEditingUser] = useState(null);

        const handleSave = (user) => {
            onDataChange({ type: 'UPDATE_USER', payload: user });
            setShowForm(false);
            setEditingUser(null);
        };

        const handleDelete = (matricula) => {
            if(window.confirm('Tem certeza que deseja excluir este usuário?')) {
                onDataChange({ type: 'DELETE_USER', payload: matricula });
            }
        };

        return (
            <div>
                {!showForm && <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">Adicionar Usuário</button>}
                {showForm && <UserForm user={editingUser} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingUser(null); }} />}
                
                <table className="w-full text-left">
                    <thead className="border-b"><tr><th className="p-2">Nome</th><th className="p-2">Matrícula</th><th className="p-2">Função</th><th className="p-2 text-center">Ações</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.matricula} className="border-b">
                                <td className="p-2">{u.name}</td>
                                <td className="p-2">{u.matricula}</td>
                                <td className="p-2">{u.role}</td>
                                <td className="p-2 flex justify-center gap-2">
                                    <button onClick={() => { setEditingUser(u); setShowForm(true); }} className="p-2 bg-yellow-100 text-yellow-700 rounded"><Icons.Edit size={16} /></button>
                                    <button onClick={() => handleDelete(u.matricula)} className="p-2 bg-red-100 text-red-700 rounded"><Icons.Trash size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    };
    
    const EmployeeForm = ({ employee, onSave, onCancel }) => {
        const [formData, setFormData] = useState(employee || { name: '', matricula: '', role: 'Técnico' });
        const isNew = !employee;

        const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
        
        const handleSubmit = (e) => {
            e.preventDefault();
            if(!formData.name || !formData.matricula || !formData.role) {
                alert("Preencha todos os campos."); return;
            }
            onSave(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-yellow-50 my-4 space-y-3">
                <h4 className="font-bold">{isNew ? 'Novo Funcionário' : 'Editar Funcionário'}</h4>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome" className="w-full p-2 border rounded" />
                <input name="matricula" value={formData.matricula} onChange={handleChange} placeholder="Matrícula" disabled={!isNew} className="w-full p-2 border rounded disabled:bg-gray-200" />
                <input name="role" value={formData.role} onChange={handleChange} placeholder="Função" className="w-full p-2 border rounded" />
                <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
                    <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                </div>
            </form>
        );
    };

    const EmployeesTab = () => {
        const [showForm, setShowForm] = useState(false);
        const [editingEmployee, setEditingEmployee] = useState(null);

        const handleSave = (employee) => {
            onDataChange({ type: 'UPDATE_EMPLOYEE', payload: employee });
            setShowForm(false); setEditingEmployee(null);
        };
        
        const handleDelete = (matricula) => {
            if(window.confirm('Tem certeza?')) {
                onDataChange({ type: 'DELETE_EMPLOYEE', payload: matricula });
            }
        };

        return (
            <div>
                {!showForm && <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">Adicionar Funcionário</button>}
                {showForm && <EmployeeForm employee={editingEmployee} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingEmployee(null); }} />}
                
                <table className="w-full text-left">
                    <thead className="border-b"><tr><th className="p-2">Nome</th><th className="p-2">Matrícula</th><th className="p-2">Função</th><th className="p-2 text-center">Ações</th></tr></thead>
                    <tbody>
                        {employees.map(e => (
                            <tr key={e.matricula} className="border-b">
                                <td className="p-2">{e.name}</td>
                                <td className="p-2">{e.matricula}</td>
                                <td className="p-2">{e.role}</td>
                                <td className="p-2 flex justify-center gap-2">
                                    <button onClick={() => { setEditingEmployee(e); setShowForm(true); }} className="p-2 bg-yellow-100 text-yellow-700 rounded"><Icons.Edit size={16} /></button>
                                    <button onClick={() => handleDelete(e.matricula)} className="p-2 bg-red-100 text-red-700 rounded"><Icons.Trash size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    };

    const ScheduleTab = () => {
        const [csvData, setCsvData] = useState('');

        const handleParse = () => {
            try {
                const lines = csvData.trim().split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                const newSchedule = lines.slice(1).map((line, index) => {
                    const values = line.split(',');
                    const item = headers.reduce((obj, header, i) => {
                        obj[header] = values[i]?.trim();
                        return obj;
                    // FIX: The type of `item` was inferred as `{}`, preventing assignment to `item.id`. Casting the initial value for reduce to `Record<string, any>` resolves this.
                    }, {} as Record<string, any>);
                    item.id = `SCH-${Date.now()}-${index}`; // Generate a unique ID
                    return item;
                });
                onScheduleChange(newSchedule);
                alert(`${newSchedule.length} itens da programação importados com sucesso!`);
            } catch (e) {
                alert('Erro ao importar CSV. Verifique o formato.');
                console.error(e);
            }
        };

        return (
            <div>
                <h3 className="font-bold mb-2">Importar Programação (CSV)</h3>
                <p className="text-sm text-gray-600 mb-2">Cole o conteúdo do seu arquivo CSV abaixo. A primeira linha deve ser o cabeçalho.</p>
                <p className="text-xs text-gray-500 mb-2 font-mono">Ex: omFrota,description,startDate,endDate,resource,workCenter,priority,startTime,endTime</p>
                <textarea 
                    value={csvData} 
                    onChange={e => setCsvData(e.target.value)} 
                    className="w-full h-64 border p-2 font-mono text-xs" 
                    placeholder="Cole os dados do CSV aqui..."
                />
                <button onClick={handleParse} className="bg-green-600 text-white px-4 py-2 rounded mt-2">Importar</button>

                <h3 className="font-bold mt-6 mb-2">Programação Atual ({schedule.length} itens)</h3>
                <div className="max-h-96 overflow-y-auto border rounded">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100"><tr><th className="p-2">OM</th><th className="p-2">Descrição</th><th className="p-2">Data</th></tr></thead>
                        <tbody>
                            {schedule.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2">{item.omFrota}</td>
                                    <td className="p-2">{item.description}</td>
                                    <td className="p-2">{item.startDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-3xl font-bold mb-6 flex items-center"><Icons.Settings className="mr-2"/> Configurações de Administrador</h2>
            <div className="flex border-b mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 font-bold text-sm ${activeTab === tab.id ? 'border-b-4 border-yellow-500 text-black' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'general' && <GeneralSettingsTab />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'employees' && <EmployeesTab />}
                {activeTab === 'schedule' && <ScheduleTab />}
                {activeTab === 'external_art' && <ScreenExternalArt onSave={onDataChange} editingDoc={editingDoc} />}
            </div>
        </div>
    )
};


// FIX: Add onLogout to Sidebar props to resolve undefined error.
const Sidebar = ({ isAdmin, isOnline, isCollapsed, onToggleCollapse, localIP, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Activity, path: '/' },
    { id: 'emergencial', label: 'ART Emergencial', icon: Icons.AlertTriangle, path: '/emergencial' },
    { id: 'atividade', label: 'ART Atividade', icon: Icons.ClipboardList, path: '/atividade' },
    { id: 'checklist', label: 'Checklist', icon: Icons.CheckSquare, path: '/checklist' },
    { id: 'reports', label: 'Relatórios', icon: Icons.FileText, path: '/reports' },
    { id: 'programming', label: 'Programação', icon: Icons.Calendar, path: '/programming' },
    { id: 'file_documents', label: 'Arquivo Documentos', icon: Icons.Folder, path: '/file_documents' },
  ];

  if (isAdmin) {
      menuItems.push({ id: 'admin_settings', label: 'Configurações', icon: Icons.Settings, path: '/admin_settings' });
  }

  return (
    <div className={`bg-black text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-40 hidden md:flex transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-4 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center h-[97px]' : 'justify-between'}`}>
        {!isCollapsed && <img src={VALE_LOGO_URL} alt="Vale" className="h-8" />}
        <h1 className={`font-black tracking-tighter text-yellow-500 ${isCollapsed ? 'text-2xl' : 'text-3xl'}`}>
          {isCollapsed ? 'ART' : 'ART APP'}
        </h1>
      </div>
      <div className={`px-4 pt-2 pb-4 border-b border-gray-800 ${isCollapsed ? 'text-center' : ''}`}>
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {!isCollapsed && <p className={`text-xs uppercase font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>{isOnline ? 'Online' : 'Offline'}</p>}
        </div>
         {!isCollapsed && localIP && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <Icons.Server size={12} />
                <span>IP: {localIP}</span>
            </div>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            end // Match root path exactly
            className={({ isActive }) => `w-full flex items-center p-3 rounded transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-yellow-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}
            title={item.label}
          >
            <item.icon className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
         <NavLink
            key="trash"
            to="/trash"
            className={({ isActive }) => `w-full flex items-center p-3 rounded transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-yellow-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}
            title="Lixeira"
          >
            <Icons.Trash className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
            {!isCollapsed && <span>Lixeira</span>}
          </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <NavLink to="#" onClick={onLogout} title="Sair" className={`w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 rounded transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
          <Icons.LogOut className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
          {!isCollapsed && <span>Sair</span>}
        </NavLink>
        <button onClick={onToggleCollapse} className="w-full flex justify-center items-center p-3 text-gray-400 hover:bg-gray-800 rounded mt-2">
          {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
        </button>
      </div>
    </div>
  );
};

// FIX: Add onLogout prop and use it for the logout button to ensure correct functionality.
const MobileSidebar = ({ isAdmin, isOpen, onClose, onLogout }) => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Icons.Activity, path: '/' },
      { id: 'emergencial', label: 'ART Emergencial', icon: Icons.AlertTriangle, path: '/emergencial' },
      { id: 'atividade', label: 'ART Atividade', icon: Icons.ClipboardList, path: '/atividade' },
      { id: 'checklist', label: 'Checklist', icon: Icons.CheckSquare, path: '/checklist' },
      { id: 'reports', label: 'Relatórios', icon: Icons.FileText, path: '/reports' },
      { id: 'programming', label: 'Programação', icon: Icons.Calendar, path: '/programming' },
      { id: 'file_documents', label: 'Arquivo Documentos', icon: Icons.Folder, path: '/file_documents' },
    ];

    if (isAdmin) {
        menuItems.push({ id: 'admin_settings', label: 'Configurações', icon: Icons.Settings, path: '/admin_settings' });
    }
  
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>}
        <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tighter text-yellow-500">ART APP</h1>
                <button onClick={onClose}><Icons.X /></button>
            </div>
            <div className="px-6 pb-4 border-b border-gray-800">
                <img src={VALE_LOGO_URL} alt="Vale" className="h-8" />
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map(item => (
                <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    end
                    className={({ isActive }) => `w-full flex items-center p-3 rounded transition-all duration-200 ${isActive ? 'bg-yellow-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-300'}`}
                >
                    <item.icon className="mr-3 w-5 h-5" />
                    {item.label}
                </NavLink>
                ))}
                 <NavLink
                    key="trash"
                    to="/trash"
                    onClick={onClose}
                    className={({ isActive }) => `w-full flex items-center p-3 rounded transition-all duration-200 ${isActive ? 'bg-yellow-500 text-black font-bold' : 'hover:bg-gray-800 text-gray-300'}`}
                >
                    <Icons.Trash className="mr-3 w-5 h-5" />
                    Lixeira
                </NavLink>
            </nav>
            <div className="p-4 border-t border-gray-800">
                <NavLink to="#" onClick={onLogout} className="w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 rounded">
                  <Icons.LogOut className="mr-3 w-5 h-5" /> Sair
                </NavLink>
            </div>
        </div>
      </>
    );
};

const AppContent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [settingsTab, setSettingsTab] = useState('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checklistPreFill, setChecklistPreFill] = useState(null);
  const [showProgrammingAlert, setShowProgrammingAlert] = useState(false);
  const [location, setLocation] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useCachedState('sidebarCollapsed', false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [localIP, setLocalIP] = useState(null);
  const navigate = useNavigate();

  // Replace useState with useCachedState for persisted data
  const [users, setUsers] = useCachedState('users', []);
  const [employees, setEmployees] = useCachedState('employees', []);
  const [docs, setDocs] = useCachedState('docs', []);
  const [deletedDocs, setDeletedDocs] = useCachedState('deletedDocs', []);
  const [settings, setSettings] = useCachedState('settings', { tags: ['TR-01', 'CV-02'], locations: ['Mina', 'Oficina'], registeredNetwork: '', wifiName: '' });
  const [activeMaintenances, setActiveMaintenances] = useCachedState('activeMaintenances', []);
  const [schedule, setSchedule] = useCachedState('schedule', []);
  const [offlineQueue, setOfflineQueue] = useCachedState('offlineQueue', []);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [toast, setToast] = useState(null);
  const [showCorrectiveAlert, setShowCorrectiveAlert] = useState(false);
  const [activeCorrectiveTasks, setActiveCorrectiveTasks] = useState([]);

  // --- Data Processing Logic ---
  const processQueue = (queue, baseData) => {
    let newDocs = [...baseData.docs];
    let newMaintenances = [...baseData.activeMaintenances];
    let newSchedule = [...baseData.schedule];
    let newUsers = [...baseData.users];
    let newEmployees = [...baseData.employees];
    let newSettings = {...baseData.settings};
    let newDeletedDocs = [...baseData.deletedDocs];

    queue.forEach(action => {
      switch (action.type) {
        case 'SAVE_DOC': {
            const index = newDocs.findIndex(d => d.id === action.payload.id);
            if (index > -1) newDocs[index] = action.payload;
            else newDocs.push(action.payload);
            break;
        }
        case 'DELETE_DOC': {
            const docToDelete = newDocs.find(d => d.id === action.payload);
            if(docToDelete) {
                newDocs = newDocs.filter(d => d.id !== action.payload);
                newDeletedDocs.push({...docToDelete, deletedAt: new Date().toISOString()});
            }
            break;
        }
        case 'RESTORE_DOC': {
            const docToRestore = newDeletedDocs.find(d => d.id === action.payload);
            if (docToRestore) {
                newDeletedDocs = newDeletedDocs.filter(d => d.id !== action.payload);
                newDocs.push(docToRestore);
            }
            break;
        }
        case 'PERMANENT_DELETE_DOC': {
            newDeletedDocs = newDeletedDocs.filter(d => d.id !== action.payload);
            break;
        }
        case 'UPDATE_MAINTENANCES': {
            newMaintenances = action.payload;
            break;
        }
        case 'UPDATE_SCHEDULE': {
            newSchedule = action.payload;
            break;
        }
        case 'ADD_USER': case 'UPDATE_USER': {
            const index = newUsers.findIndex(u => u.matricula === action.payload.matricula);
            if (index > -1) newUsers[index] = action.payload;
            else newUsers.push(action.payload);
            break;
        }
        case 'DELETE_USER': {
            newUsers = newUsers.filter(u => u.matricula !== action.payload);
            break;
        }
        case 'ADD_EMPLOYEE': case 'UPDATE_EMPLOYEE': {
            const index = newEmployees.findIndex(e => e.matricula === action.payload.matricula);
            if(index > -1) newEmployees[index] = action.payload;
            else newEmployees.push(action.payload);
            break;
        }
        case 'DELETE_EMPLOYEE': {
            newEmployees = newEmployees.filter(e => e.matricula !== action.payload);
            break;
        }
        case 'UPDATE_SETTINGS': {
            newSettings = action.payload;
            break;
        }
        case 'SAVE_DOC_AND_MAINTENANCE_ACTION': {
            const { doc, maintenanceAction } = action.payload;
            // Save doc logic
            const docIndex = newDocs.findIndex(d => d.id === doc.id);
            if (docIndex > -1) newDocs[docIndex] = doc;
            else newDocs.push(doc);
            
            // Process maintenance action on the CURRENT `newMaintenances`
            switch (maintenanceAction.type) {
                case 'ADD_MAINTENANCE':
                    newMaintenances.push(maintenanceAction.payload);
                    break;
                case 'FINISH_MAINTENANCE':
                    newMaintenances = newMaintenances.map(m => 
                        m.id === maintenanceAction.payload.maintenanceId 
                        ? { ...m, status: 'finished', endTime: maintenanceAction.payload.endTime } 
                        : m
                    );
                    break;
            }
            break;
        }
        default:
            console.warn(`Unknown action type in queue: ${action.type}`);
      }
    });
    return { newDocs, newMaintenances, newSchedule, newUsers, newEmployees, newSettings, newDeletedDocs };
  }

  // --- Sync and Offline Logic ---
  useEffect(() => {
    const syncOfflineData = async () => {
      if (offlineQueue.length === 0) {
        setSyncStatus('synced');
        return;
      }
  
      setSyncStatus('syncing');
      setToast({ message: `Sincronizando ${offlineQueue.length} alterações...`, type: 'info' });
      await new Promise(res => setTimeout(res, 1500)); // Simulate network delay
      
      const { newDocs, newMaintenances, newSchedule, newUsers, newEmployees, newSettings, newDeletedDocs } = processQueue(offlineQueue, { docs, activeMaintenances, schedule, users, employees, settings, deletedDocs });
      
      setDocs(newDocs);
      setActiveMaintenances(newMaintenances);
      setSchedule(newSchedule);
      setUsers(newUsers);
      setEmployees(newEmployees);
      setSettings(newSettings);
      setDeletedDocs(newDeletedDocs);
  
      setOfflineQueue([]);
      setSyncStatus('synced');
      setToast({ message: 'Dados sincronizados com sucesso!', type: 'success' });
    };

    const handleOnline = () => { setIsOnline(true); syncOfflineData(); };
    const handleOffline = () => { setIsOnline(false); setSyncStatus('offline'); };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (isOnline && offlineQueue.length > 0) syncOfflineData();
    else if (!isOnline && offlineQueue.length > 0) setSyncStatus('offline');
    
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]); // Rerun only when online status changes

  const handleDataChange = (action, successMessage = 'Alteração salva!') => {
    if (isOnline && syncStatus === 'synced') {
      const { newDocs, newMaintenances, newSchedule, newUsers, newEmployees, newSettings, newDeletedDocs } = processQueue([action], { docs, activeMaintenances, schedule, users, employees, settings, deletedDocs });
      setDocs(newDocs);
      setActiveMaintenances(newMaintenances);
      setSchedule(newSchedule);
      setUsers(newUsers);
      setEmployees(newEmployees);
      setSettings(newSettings);
      setDeletedDocs(newDeletedDocs);
      setToast({ message: successMessage, type: 'success' });
    } else {
      setOfflineQueue(prevQueue => [...prevQueue, action]);
      setSyncStatus('offline');
      setToast({ message: 'Salvo localmente. Sincronizando quando online.', type: 'info' });
    }
  };

  const setupNotifications = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('sw.js');
            if (Notification.permission === 'granted') {
                console.log('Notification permission already granted.');
            }
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      showLocalNotification('Notificações Ativadas', 'Você receberá alertas importantes.');
    }
  };

  // --- App Effects ---
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
        return; // Do nothing if not an admin
    }

    const interval = setInterval(() => {
        try {
            const sessionData = JSON.parse(localStorage.getItem('adminSession'));
            if (sessionData?.sessionId !== currentUser.sessionId) {
                handleLogout(); // This will set currentUser to null
                alert("Outro administrador iniciou uma sessão. Você foi desconectado.");
            }
        } catch (e) {
            // Ignore parsing errors
        }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setupNotifications();
       getLocalIP().then(ip => {
        setLocalIP(ip);
      }).catch(err => {
        console.error("Could not get local IP", err);
        setLocalIP('Indisponível');
      });
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const localNow = new Date(now.getTime() - (offset*60*1000));
      const todayISO = localNow.toISOString().split('T')[0];
      const todaysItems = schedule?.filter(item => {
        if (!item.startDate) return false;
        const start = item.startDate;
        const end = item.endDate || item.startDate;
        return todayISO >= start && todayISO <= end;
      }) || [];

      if (todaysItems.length > 0) {
        showLocalNotification(
          `Programação de Hoje (${new Date().toLocaleDateString('pt-BR')})`,
          `Você tem ${todaysItems.length} tarefa(s) agendada(s) para hoje.`,
          'daily-schedule-summary'
        );
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
            (error) => console.error("Error getting geolocation", error)
        );
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const timer = setTimeout(() => setShowProgrammingAlert(true), 5000);
    const interval = setInterval(() => {
        setShowProgrammingAlert(true);
        setTimeout(() => setShowProgrammingAlert(false), PROGRAMMING_ALERT_DURATION);
    }, PROGRAMMING_ALERT_INTERVAL);
    return () => { clearTimeout(timer); clearInterval(interval); }
  }, [currentUser, schedule]);
  
  // Corrective Maintenance Alert Logic
  useEffect(() => {
    const tasks = activeMaintenances.filter(
        m => m.status === 'active' && m.maintenanceType === 'corretiva'
    );
    setActiveCorrectiveTasks(tasks);
  }, [activeMaintenances]);

  const activeCorrectiveTasksRef = useRef(activeCorrectiveTasks);
  activeCorrectiveTasksRef.current = activeCorrectiveTasks;
  
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
        if (activeCorrectiveTasksRef.current.length > 0) {
            setShowCorrectiveAlert(true);
            setTimeout(() => setShowCorrectiveAlert(false), 20000); // 20 seconds
        }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [currentUser]);


  // --- Event Handlers ---
  const handleLogin = (user) => setCurrentUser(user);
  
  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setCurrentUser(null);
  };
  
  const handleStartTask = (task) => {
    if (activeMaintenances.some(m => m.programmingId === task.id && m.status !== 'finished')) {
      navigate('/');
      return;
    }
    const newMaintenance = {
      id: `MNT-PROG-${task.id}-${Date.now()}`, programmingId: task.id,
      om: task.omFrota, tag: task.omFrota, taskName: task.description,
      startTime: new Date().toISOString(), status: 'active',
      userName: currentUser.name, userId: currentUser.matricula, location: task.workCenter,
      maintenanceType: 'preventiva', // Tasks from programming are preventive
    };
    handleDataChange({ type: 'UPDATE_MAINTENANCES', payload: [...activeMaintenances, newMaintenance] }, "Tarefa iniciada com sucesso!");
    navigate('/');
  };

  const handleOpenChecklist = (maintenance) => {
    setChecklistPreFill({
        om: maintenance.om, tag: maintenance.tag,
        taskName: maintenance.taskName, maintenanceId: maintenance.id
    });
    navigate('/checklist');
  };

  const handleSaveDoc = (action: any) => {
      const docToSave = { ...action.payload };
      let maintenanceAction = null;
      let successMessage = 'Documento salvo com sucesso!';
      let maintenanceToFinish = null;

      if (!editingDoc && docToSave.type !== 'external') {
          docToSave.maintenanceId = `MNT-${docToSave.id}`;
      }
      
      if (docToSave.type === 'checklist') {
          const relatedId = editingDoc ? editingDoc.maintenanceId : (checklistPreFill?.maintenanceId || docToSave.maintenanceId);
          maintenanceToFinish = activeMaintenances.find(m => m.id === relatedId && m.status !== 'finished');

          if(maintenanceToFinish) {
              maintenanceAction = { 
                  type: 'FINISH_MAINTENANCE', 
                  payload: { maintenanceId: relatedId, endTime: new Date().toISOString() } 
              };
              successMessage = `Checklist salvo e OM ${maintenanceToFinish.om || maintenanceToFinish.tag} encerrada!`;
          }
      } else if (docToSave.type !== 'external' && !editingDoc) {
          const newMaintenance = {
              id: docToSave.maintenanceId, 
              tag: docToSave.tag, om: docToSave.om, taskName: docToSave.taskName,
              startTime: new Date().toISOString(), status: 'active', 
              userName: currentUser.name, userId: currentUser.matricula,
              maintenanceType: docToSave.maintenanceType,
          };
          maintenanceAction = { type: 'ADD_MAINTENANCE', payload: newMaintenance };
          successMessage = 'ART e nova manutenção ativa criadas com sucesso!';
      }

      if (maintenanceAction) {
          handleDataChange({ 
              type: 'SAVE_DOC_AND_MAINTENANCE_ACTION', 
              payload: { doc: docToSave, maintenanceAction: maintenanceAction } 
          }, successMessage);
      } else {
          handleDataChange({ type: 'SAVE_DOC', payload: docToSave }, successMessage);
      }

      setEditingDoc(null);
      setChecklistPreFill(null);
      navigate('/file_documents');
  };

  const handleEditDoc = (doc) => {
      setEditingDoc(doc);
      if (doc.type === 'external') {
          setSettingsTab('external_art');
          navigate('/admin_settings');
      } else {
          navigate(`/${doc.type}`);
      }
  };

  const handleDownloadDoc = (doc) => {
      if (doc.type === 'external' && doc.fileContent) {
         const byteCharacters = atob(doc.fileContent.split(',')[1]);
         const byteNumbers = new Array(byteCharacters.length);
         for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
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
  
  const handleRestoreDoc = (id) => {
    handleDataChange({ type: 'RESTORE_DOC', payload: id }, 'Documento restaurado com sucesso!');
  };

  const handlePermanentDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este item permanentemente? Esta ação não pode ser desfeita.")) {
      handleDataChange({ type: 'PERMANENT_DELETE_DOC', payload: id }, 'Item excluído permanentemente.');
    }
  };


  if (!currentUser) return <ScreenLogin onLogin={handleLogin} users={users} onUserChange={handleDataChange} />;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      <Sidebar 
        isAdmin={currentUser.role === 'admin'} isOnline={isOnline}
        isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        localIP={localIP}
        onLogout={handleLogout}
      />
      {/* FIX: Pass onLogout handler to MobileSidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isAdmin={currentUser.role === 'admin'} onLogout={handleLogout} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} flex flex-col h-screen overflow-hidden`}>
          <div className="md:hidden bg-black text-white p-4 flex justify-between items-center shadow-md z-30">
              <div className="flex items-center gap-2">
                  <Icons.ClipboardList className="w-6 h-6 text-yellow-500" />
                  <h1 className="font-bold text-yellow-500 tracking-tighter text-xl">ART APP</h1>
              </div>
              <button onClick={() => setMobileMenuOpen(true)}><Icons.Menu className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Routes>
                <Route path="/" element={
                  <ScreenDashboard 
                    currentUser={currentUser} activeMaintenances={activeMaintenances} 
                    onOpenChecklist={handleOpenChecklist} refreshData={() => {}}
                    networkName={settings.wifiName} isOnline={isOnline} location={location}
                    syncStatus={syncStatus} offlineQueueLength={offlineQueue.length}
                    onRequestNotifications={requestNotificationPermission}
                    notificationPermission={notificationPermission}
                />
                } />
                 <Route path="/emergencial" element={<ScreenArtEmergencial onSave={handleSaveDoc} employees={employees} editingDoc={editingDoc} settings={settings} />} />
                 <Route path="/atividade" element={<ScreenArtAtividade onSave={handleSaveDoc} employees={employees} editingDoc={editingDoc} settings={settings} externalDocs={docs.filter(d => d.type === 'external')} />} />
                 <Route path="/checklist" element={<ScreenChecklist onSave={handleSaveDoc} employees={employees} editingDoc={editingDoc} settings={settings} preFill={checklistPreFill} />} />
                 <Route path="/file_documents" element={<ScreenFileDocuments docs={docs} onView={setPreviewDoc} onDownload={handleDownloadDoc} onEdit={handleEditDoc} onDelete={handleDataChange} onSendToNetwork={() => {}} activeMaintenances={activeMaintenances} />} />
                 <Route path="/reports" element={<ScreenReports activeMaintenances={activeMaintenances} docs={docs} settings={settings} />} />
                 <Route path="/programming" element={<ScreenProgramming 
                    schedule={schedule}
                    onStartTask={handleStartTask} 
                    activeMaintenances={activeMaintenances}
                 />} />
                 <Route path="/trash" element={<ScreenTrash deletedDocs={deletedDocs} onRestore={handleRestoreDoc} onPermanentDelete={handlePermanentDelete} />} />
                 <Route path="/admin_settings" element={
                   <ScreenAdminSettings 
                    settings={settings} onSaveSettings={handleDataChange}
                    adminScreenProps={{ 
                      onDataChange: handleDataChange, 
                      editingDoc: (editingDoc?.type === 'external' ? editingDoc : null),
                      users: users,
                      employees: employees,
                      schedule: schedule,
                      onScheduleChange: (newSchedule) => handleDataChange({ type: 'UPDATE_SCHEDULE', payload: newSchedule }),
                    }}
                    activeTab={settingsTab} setActiveTab={setSettingsTab}
                    localIP={localIP}
                 />
                 } />
            </Routes>
          </div>
      </div>

      {previewDoc && <PrintTemplate data={previewDoc} type={previewDoc.type} onClose={() => setPreviewDoc(null)} settings={settings} />}
      {showProgrammingAlert && <ProgrammingAlert schedule={schedule} onClose={() => setShowProgrammingAlert(false)} />}
      {showCorrectiveAlert && activeCorrectiveTasks.length > 0 && <CorrectiveMaintenanceAlert tasks={activeCorrectiveTasks} onClose={() => setShowCorrectiveAlert(false)} />}
    </div>
  );
};

const generateDocSummary = (doc) => {
    let summary = `ART APP - Resumo do Documento\n`;
    summary += `---------------------------------\n`;
    summary += `Tipo: ${doc.type.toUpperCase()}\n`;
    summary += `Tarefa: ${doc.taskName || doc.fileName || 'N/A'}\n`;
    summary += `OM: ${doc.om || 'N/A'}\n`;
    summary += `TAG: ${doc.tag || 'N/A'}\n`;
    summary += `Data: ${doc.date} ${doc.time}\n`;

    if (doc.type === 'checklist' && doc.checks) {
        const nokItems = Object.keys(doc.checks).filter(key => doc.checks[key] === 'nok');
        if (nokItems.length > 0) {
            summary += `\nItens com Não Conformidade (NOK):\n`;
            nokItems.forEach(key => {
                const [sysName, itemName] = key.split('-');
                summary += `- ${itemName || key} (${doc.obs?.[key] || 'Sem obs.'})\n`;
            });
        } else {
            summary += `\nStatus: Todos os itens OK.\n`;
        }
    }
    
    if (doc.signatures && doc.signatures.length > 0) {
        summary += `\nAssinado por:\n`;
        doc.signatures.forEach(sig => {
            summary += `- ${sig.name} (${sig.role})\n`;
        });
    }

    return summary;
};


const App = () => (
    <HashRouter>
        <AppContent />
    </HashRouter>
);

const root = createRoot(document.getElementById('root'));
root.render(<App />);