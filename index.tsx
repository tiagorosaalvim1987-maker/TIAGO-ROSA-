import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Trash2, Download, FileText, Eye, Edit, Share2, Printer, X, Menu, Save, Upload, Cloud, User, Users, Lock, AlertTriangle, ClipboardList, CheckSquare, Home, LogOut, Clock, Activity, Settings, Pen, Terminal, Folder, ChevronRight, FileCheck, Wifi, Server, Globe, Database, Cpu, Radio, Layers, ArrowRightLeft, Calendar, Bell, Copy, Clipboard, FileSpreadsheet, Send, Sun } from 'lucide-react';

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
  Calendar: Calendar,
  Bell: Bell,
  Copy: Copy,
  Clipboard: Clipboard,
  FileSpreadsheet: FileSpreadsheet,
  Whatsapp: Send,
  Sun: Sun
};

// --- CONSTANTS ---
const ALERT_THRESHOLD_HOURS = 20;
const ALERT_THRESHOLD_MS = ALERT_THRESHOLD_HOURS * 60 * 60 * 1000;
const PROGRAMMING_ALERT_INTERVAL = 2 * 60 * 1000; // 2 minutes
const PROGRAMMING_ALERT_DURATION = 10 * 1000; // 10 seconds

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
    const timeStr = now.toLocaleTimeString('pt-BR');
    const dataUrl = canvas.toDataURL();
    onSave({ dataUrl, date: dateStr, time: timeStr, name: employeeName, role: employeeRole, id: employeeId });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <h3 className="font-bold mb-2">Assinar como {employeeName}</h3>