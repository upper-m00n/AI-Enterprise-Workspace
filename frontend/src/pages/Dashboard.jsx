import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUserProfile } from '../features/auth/authSlice';
import api from '../services/api';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Files, 
  Search, 
  Settings as SettingsIcon, 
  LogOut, 
  Bell, 
  ChevronDown, 
  Upload, 
  Plus, 
  FileText, 
  History, 
  Cpu, 
  Database, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Grid, 
  List, 
  Trash2, 
  MoreVertical, 
  BookOpen, 
  ChevronRight, 
  Send, 
  Loader2, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  RefreshCw, 
  Key, 
  User as UserIcon, 
  Lock as LockIcon, 
  Palette, 
  Building, 
  CreditCard,
  Sparkles,
  SearchCode,
  FileCheck
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Navigation / Sidebar
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'workspace' | 'documents' | 'search' | 'settings'

  // Document states
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocDetails, setSelectedDocDetails] = useState(null);
  
  // Chat / Workspace states
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activeCitation, setActiveCitation] = useState(null); // Selected citation for drawer preview
  
  // Semantic Search states
  const [semanticQuery, setSemanticQuery] = useState('');
  const [semanticResults, setSemanticResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [previewChunk, setPreviewChunk] = useState(null); // Selected search result for drawer

  // Custom Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Confirm delete states
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', id: '', title: '' });

  // Settings sub-tabs
  const [settingsTab, setSettingsTab] = useState('profile'); // 'profile' | 'security' | 'api' | 'appearance'
  
  // Dark Mode state
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Settings edit states
  const [profileName, setProfileName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user?.full_name) {
      setProfileName(user.full_name);
    }
  }, [user]);

  const messagesEndRef = useRef(null);

  // Setup APIs
  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const response = await api.get('/documents/');
      if (Array.isArray(response.data)) {
        setDocuments(response.data);
      } else {
        setDocuments([]);
        showToast('Invalid documents response structure', 'error');
      }
    } catch (err) {
      showToast('Failed to fetch documents', 'error');
    } finally {
      setLoadingDocs(false);
    }
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const response = await api.get('/conversations/');
      if (Array.isArray(response.data)) {
        setChats(response.data);
      } else {
        setChats([]);
      }
    } catch (err) {
      showToast('Failed to fetch chats', 'error');
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await api.get(`/conversations/${chatId}`);
      setMessages(response.data.messages);
    } catch (err) {
      showToast('Failed to load messages', 'error');
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchChats();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  useEffect(() => {
    // Scroll to bottom of chat
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generating]);

  // Dark Mode toggler
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Dynamic Toast utility
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Log out
  const handleLogout = () => {
    dispatch(logout());
  };

  // Drag and Drop files
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop().toLowerCase();
      if (['txt', 'md', 'pdf', 'docx'].includes(ext)) {
        setSelectedFile(file);
      } else {
        showToast('Invalid format. Only .txt, .md, .pdf, and .docx are supported.', 'error');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop().toLowerCase();
      if (['txt', 'md', 'pdf', 'docx'].includes(ext)) {
        setSelectedFile(file);
      } else {
        showToast('Invalid format. Only .txt, .md, .pdf, and .docx are supported.', 'error');
      }
    }
  };

  // Document Upload
  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Document uploaded and RAG-indexed successfully!');
      setSelectedFile(null);
      fetchDocuments();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Ingestion failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Settings profile and password updates
  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    try {
      const response = await api.put('/auth/me', { full_name: profileName });
      dispatch(updateUserProfile({ full_name: response.data.full_name }));
      showToast('Profile details updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to update profile.', 'error');
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      showToast('Please fill out all fields', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    try {
      await api.put('/auth/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      showToast('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to update password.', 'error');
    }
  };

  // Custom Confirmation Dialog helper
  const triggerDeleteConfirm = (type, id, title) => {
    setConfirmDialog({ isOpen: true, type, id, title });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = confirmDialog;
    setConfirmDialog({ isOpen: false, type: '', id: '', title: '' });

    try {
      if (type === 'document') {
        await api.delete(`/documents/${id}`);
        showToast('Document deleted from knowledge vault.');
        fetchDocuments();
      } else if (type === 'chat') {
        await api.delete(`/conversations/${id}`);
        showToast('Conversation deleted.');
        if (currentChatId === id) {
          setCurrentChatId(null);
        }
        fetchChats();
      }
    } catch (err) {
      showToast('Deletion failed', 'error');
    }
  };

  // Start a new Chat session
  const handleStartNewChat = async () => {
    try {
      const response = await api.post('/conversations/', { title: 'New Chat' });
      const newChat = response.data;
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setCurrentTab('workspace');
      showToast('New workspace chat initialized.');
    } catch (err) {
      showToast('Failed to create new chat', 'error');
    }
  };

  // Send message in AI Workspace
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || generating) return;

    let chatId = currentChatId;
    
    // Auto-create chat if none exists or is active
    if (!chatId) {
      try {
        const response = await api.post('/conversations/', { title: 'New Chat' });
        const newChat = response.data;
        chatId = newChat.id;
        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(chatId);
      } catch (err) {
        showToast('Failed to start chat', 'error');
        return;
      }
    }

    const userPrompt = prompt;
    setPrompt('');
    
    // Optimistic User Message update
    const tempUserMsg = {
      id: 'temp-user-id-' + Date.now(),
      role: 'user',
      content: userPrompt,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setGenerating(true);

    try {
      const response = await api.post(`/conversations/${chatId}/messages`, { content: userPrompt });
      const assistantMsg = response.data;
      
      // Update with real database messages
      fetchMessages(chatId);
      fetchChats(); // Refresh title list
    } catch (err) {
      showToast('Error generating AI answer', 'error');
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id)); // Remove optimistic msg
    } finally {
      setGenerating(false);
    }
  };

  // Perform Semantic Search
  const handleSemanticSearch = async (e) => {
    if (e) e.preventDefault();
    if (!semanticQuery.trim()) return;

    setLoadingSearch(true);
    try {
      const response = await api.get(`/search/?q=${encodeURIComponent(semanticQuery)}`);
      setSemanticResults(response.data);
      if (response.data.length === 0) {
        showToast('No matching chunks found in vault.', 'info');
      }
    } catch (err) {
      showToast('Semantic search failed', 'error');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Copy text utility
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  // Basic utility formatting
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtered doc library list
  const filteredDocuments = Array.isArray(documents)
    ? documents.filter((doc) =>
        doc && doc.filename && typeof doc.filename === 'string' &&
        doc.filename.toLowerCase().includes((docSearchQuery || '').toLowerCase())
      )
    : [];

  const totalStorageBytes = Array.isArray(documents)
    ? documents.reduce((sum, doc) => sum + (doc?.file_size || 0), 0)
    : 0;

  // Helper custom parser to format bold, code tags, bullet items, and citations [1]
  const renderMessageContent = (text, citationsList = []) => {
    if (!text) return null;
    
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeLines = part.slice(3, -3).trim().split('\n');
        let language = 'text';
        let code = part.slice(3, -3).trim();
        if (codeLines[0] && codeLines[0].length < 15 && !codeLines[0].includes(' ') && codeLines[0] !== '') {
          language = codeLines[0];
          code = codeLines.slice(1).join('\n');
        }
        return (
          <div key={index} className="my-3 font-mono text-xs rounded-lg overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 shadow-md">
            <div className="flex justify-between items-center px-4 py-1.5 bg-slate-800 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-700">
              <span>{language}</span>
              <button 
                onClick={() => copyToClipboard(code)}
                className="hover:text-slate-100 flex items-center gap-1 transition-colors"
              >
                <Copy size={12}/> Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto"><code>{code}</code></pre>
          </div>
        );
      }

      // Format bold, inline code, bullets, citations
      let inlineText = part;
      // Bold converter
      const boldParts = inlineText.split(/(\*\*.*?\*\*)/g);
      const renderedBold = boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return <strong key={bIdx} className="font-semibold text-slate-900 dark:text-slate-100">{bPart.slice(2, -2)}</strong>;
        }
        
        // Inline code converter
        const codeParts = bPart.split(/(`.*?`)/g);
        return codeParts.map((cPart, cIdx) => {
          if (cPart.startsWith('`') && cPart.endsWith('`')) {
            return <code key={cIdx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-primary dark:text-primary-container rounded font-mono text-xs">{cPart.slice(1, -1)}</code>;
          }

          // Citation link converter [1], [2]
          const citationParts = cPart.split(/(\[\d+\])/g);
          return citationParts.map((citPart, citIdx) => {
            if (citPart.match(/^\[\d+\]$/)) {
              const num = parseInt(citPart.slice(1, -1));
              const citationData = citationsList[num - 1];
              return (
                <button
                  key={citIdx}
                  onClick={() => citationData && setActiveCitation(citationData)}
                  className="mx-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 rounded-full transition-colors align-middle cursor-pointer"
                  title={citationData ? `Source: ${citationData.filename}` : "View Citation"}
                >
                  {num}
                </button>
              );
            }
            return citPart;
          });
        });
      });

      return <span key={index} className="whitespace-pre-line leading-relaxed">{renderedBold}</span>;
    });
  };

  return (
    <div className="bg-background dark:bg-slate-950 text-on-background min-h-screen flex transition-colors duration-200">
      
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border animate-slide-in transition-all duration-300 ${
              toast.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : toast.type === 'info'
                ? 'bg-slate-50 border-slate-200 text-slate-800'
                : 'bg-teal-50 border-teal-200 text-teal-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="text-red-500 shrink-0" size={18} />
            ) : (
              <CheckCircle2 className="text-teal-500 shrink-0" size={18} />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl animate-scale-up">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Delete {confirmDialog.type === 'document' ? 'Document' : 'Conversation'}?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to delete <strong className="text-slate-700 dark:text-slate-300">"{confirmDialog.title}"</strong>? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmDialog({ isOpen: false, type: '', id: '', title: '' })}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <span className="font-bold text-lg text-slate-950 dark:text-white tracking-tight">Enterprise AI</span>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-1.5">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentTab === 'dashboard'
                ? 'text-primary bg-primary-container/40 dark:bg-primary/10 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm">Dashboard</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentTab('workspace');
              if (chats.length > 0 && !currentChatId) {
                setCurrentChatId(chats[0].id);
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentTab === 'workspace'
                ? 'text-primary bg-primary-container/40 dark:bg-primary/10 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare size={18} />
            <span className="text-sm">AI Workspace</span>
          </button>
          
          <button
            onClick={() => setCurrentTab('documents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentTab === 'documents'
                ? 'text-primary bg-primary-container/40 dark:bg-primary/10 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Files size={18} />
            <span className="text-sm">Documents</span>
          </button>

          <button
            onClick={() => setCurrentTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentTab === 'search'
                ? 'text-primary bg-primary-container/40 dark:bg-primary/10 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Search size={18} />
            <span className="text-sm">Semantic Search</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentTab === 'settings'
                ? 'text-primary bg-primary-container/40 dark:bg-primary/10 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SettingsIcon size={18} />
            <span className="text-sm">Settings</span>
          </button>
        </div>
        
        {/* User Card & Sign Out */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/10">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">Enterprise User</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-[260px] w-full min-h-screen flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="sticky top-0 w-full z-30 flex justify-between items-center px-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all cursor-pointer">
              <span className="text-xs font-semibold">Workspace: Global Operations</span>
              <ChevronDown size={14} className="text-slate-500" />
            </div>

            {/* Global search jumps to search tab */}
            <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-sm gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                className="bg-transparent border-none text-xs w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-0"
                placeholder="Global search index..."
                type="text"
                value={docSearchQuery}
                onChange={(e) => {
                  setDocSearchQuery(e.target.value);
                  if (currentTab !== 'documents' && currentTab !== 'search') {
                    setCurrentTab('documents');
                  }
                }}
              />
              {docSearchQuery && (
                <button onClick={() => setDocSearchQuery('')} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {/* Dark mode button */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Toggle Theme"
              >
                <Palette size={18} />
              </button>

              <button className="p-2 relative text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            {/* Mobile Log out */}
            <button className="lg:hidden p-2 text-red-500 hover:bg-red-50 rounded-full" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* ============================================================== */}
            {/* TAB: DASHBOARD OVERVIEW */}
            {/* ============================================================== */}
            {currentTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Workspace Overview</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Intelligent workspace activity and storage index status.</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleStartNewChat}
                      className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Plus size={16} />
                      Start Chat
                    </button>
                    <button
                      onClick={() => setCurrentTab('documents')}
                      className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload Data
                    </button>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg">
                        <Files size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Documents</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Ingested</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{documents.length}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-lg">
                        <MessageSquare size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Chats</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Conversations</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{chats.length}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
                        <Database size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Size</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Storage Volume</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{formatBytes(totalStorageBytes)}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                        <Cpu size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">RAG Engine</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Processor</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">Groq Llama 3</p>
                  </div>
                </div>

                {/* Bento Layout Bottom Rows */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Recent documents */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-soft-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <History size={16} className="text-primary" />
                        Recent Vault Ingestions
                      </h3>
                      <button onClick={() => setCurrentTab('documents')} className="text-xs text-primary font-semibold hover:underline">Manage All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-3.5">Filename</th>
                            <th className="px-6 py-3.5">Size</th>
                            <th className="px-6 py-3.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                          {loadingDocs ? (
                            <tr>
                              <td colSpan="3" className="px-6 py-8 text-center text-slate-400"><Loader2 className="animate-spin mx-auto text-primary" size={24} /></td>
                            </tr>
                          ) : documents.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="px-6 py-8 text-center text-slate-400">
                                No documents in the vault yet. Upload documents to index.
                              </td>
                            </tr>
                          ) : (
                            documents.slice(0, 4).map((doc) => (
                              <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-6 py-3.5 flex items-center gap-2">
                                  <FileText className="text-primary shrink-0" size={14} />
                                  <span className="font-semibold text-slate-850 dark:text-slate-200 truncate max-w-[200px]">{doc.filename}</span>
                                </td>
                                <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{formatBytes(doc.file_size)}</td>
                                <td className="px-6 py-3.5">
                                  <span className="px-2 py-0.5 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full">Indexed</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: AI Status Panel */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-soft-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                        <Cpu size={16} className="text-teal-500" />
                        AI Status & Architecture
                      </h3>
                      <div className="space-y-4 mt-4 text-xs">
                        <div>
                          <p className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Vector Embeddings</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">nomic-embed-text-v1.5 (768-dim)</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Retrieval Search</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">pgVector Cosine Similarity</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Language Model</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Groq Llama 3 API (8B Parameters)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></div>
                      <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">RAG pipeline fully active</span>
                    </div>
                  </div>
                </div>

                {/* Recent Chats row */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-soft-sm p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
                    <MessageSquare size={16} className="text-primary" />
                    Recent AI Workspace Conversations
                  </h3>
                  {chats.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No past conversations found. Click "Start Chat" to open a session.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chats.slice(0, 3).map((chat) => (
                        <div 
                          key={chat.id}
                          onClick={() => {
                            setCurrentChatId(chat.id);
                            setCurrentTab('workspace');
                          }}
                          className="p-4 border border-slate-100 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-lg cursor-pointer transition-all duration-200 flex flex-col justify-between h-28"
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">{chat.title}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{formatDate(chat.created_at)}</p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-primary dark:text-primary-container">
                            <span>Open workspace</span>
                            <ChevronRight size={12} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: AI WORKSPACE */}
            {/* ============================================================== */}
            {currentTab === 'workspace' && (
              <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)] animate-fade-in">
                {/* Left side: past chats panel */}
                <div className="col-span-12 md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col shadow-soft-sm h-full overflow-hidden">
                  <button 
                    onClick={handleStartNewChat}
                    className="w-full py-2.5 bg-primary hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors shrink-0"
                  >
                    <Plus size={14} />
                    New Workspace Chat
                  </button>

                  <div className="flex-1 overflow-y-auto mt-4 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">History</p>
                    {loadingChats ? (
                      <div className="text-center py-4 text-slate-400"><Loader2 className="animate-spin mx-auto text-primary" size={18} /></div>
                    ) : chats.length === 0 ? (
                      <p className="text-xs text-slate-400 px-3 py-2">No active history.</p>
                    ) : (
                      chats.map((chat) => (
                        <div 
                          key={chat.id}
                          onClick={() => setCurrentChatId(chat.id)}
                          className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                            currentChatId === chat.id 
                              ? 'bg-primary-container/40 dark:bg-primary/10 text-primary font-semibold' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate pr-2">{chat.title}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerDeleteConfirm('chat', chat.id, chat.title);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 rounded transition-all"
                            title="Delete Chat"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Center chat window */}
                <div className="col-span-12 md:col-span-9 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-soft-sm h-full overflow-hidden relative">
                  
                  {/* Active chat header */}
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10 shrink-0">
                    <div className="overflow-hidden">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentChatId ? chats.find(c => c.id === currentChatId)?.title || "Active Conversation" : "New Chat"}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Cpu size={10} /> Active LLM: Groq Llama3 + Vector RAG
                      </p>
                    </div>
                    {currentChatId && (
                      <button 
                        onClick={() => triggerDeleteConfirm('chat', currentChatId, chats.find(c => c.id === currentChatId)?.title || "Chat")}
                        className="p-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete this Conversation"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Messages box */}
                  <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/10 space-y-4">
                    {messages.length === 0 && !generating ? (
                      <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 bg-primary-container/30 text-primary flex items-center justify-center rounded-xl mb-4">
                          <MessageSquare size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Start Workspace Conversation</h4>
                        <p className="text-xs text-slate-400 max-w-sm mt-1">
                          Query your database vault. Type your question below to retrieve details with citations.
                        </p>
                        
                        {/* Quick Prompts cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full max-w-md">
                          <button 
                            onClick={() => setPrompt("What is the main summary of our uploaded text files?")}
                            className="p-3 text-left border border-slate-200 dark:border-slate-800 hover:border-primary/20 bg-white dark:bg-slate-900 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 transition-all hover:shadow-soft-sm"
                          >
                            "What is the main summary of our uploaded text files?"
                          </button>
                          <button 
                            onClick={() => setPrompt("List key actionable items from the recent project uploads.")}
                            className="p-3 text-left border border-slate-200 dark:border-slate-800 hover:border-primary/20 bg-white dark:bg-slate-900 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 transition-all hover:shadow-soft-sm"
                          >
                            "List key actionable items from the recent project uploads."
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {messages.map((msg) => {
                          const isUser = msg.role === 'user';
                          return (
                            <div key={msg.id} className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                              {!isUser && (
                                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                                  <Sparkles size={14} />
                                </div>
                              )}
                              
                              <div className="flex flex-col gap-2 max-w-[85%]">
                                <div className={`px-4 py-3 rounded-xl shadow-soft-sm border text-xs leading-relaxed ${
                                  isUser 
                                    ? 'bg-primary border-primary text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                }`}>
                                  <div className={!isUser ? 'markdown-content' : ''}>
                                    {isUser ? msg.content : renderMessageContent(msg.content, msg.citations)}
                                  </div>
                                </div>

                                {/* Citation cards for assistants */}
                                {!isUser && msg.citations && msg.citations.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {msg.citations.map((cit, citIdx) => (
                                      <div 
                                        key={citIdx}
                                        onClick={() => setActiveCitation(cit)}
                                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
                                      >
                                        <BookOpen size={10} className="text-teal-500" />
                                        <span className="truncate max-w-[120px]">[{citIdx + 1}] {cit.filename}</span>
                                        <span className="text-[9px] text-teal-600 font-mono">{(cit.similarity * 100).toFixed(0)}%</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                                  <span>{formatDate(msg.created_at)}</span>
                                  {!isUser && (
                                    <div className="flex items-center gap-1.5 ml-2">
                                      <button className="hover:text-slate-600 p-0.5"><ThumbsUp size={10}/></button>
                                      <button className="hover:text-slate-600 p-0.5"><ThumbsDown size={10}/></button>
                                      <button onClick={() => copyToClipboard(msg.content)} className="hover:text-slate-600 p-0.5 ml-1" title="Copy"><Copy size={10}/></button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {isUser && (
                                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xs uppercase">
                                  {user?.full_name ? user.full_name.charAt(0) : 'U'}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        
                        {/* Loader animation for generation */}
                        {generating && (
                          <div className="flex items-start gap-4 justify-start">
                            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Sparkles size={14} className="animate-spin" />
                            </div>
                            <div className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl rounded-tl-none max-w-[85%] shadow-soft-sm text-xs text-slate-500 flex items-center gap-2">
                              <Loader2 className="animate-spin text-primary" size={14} />
                              <span className="streaming-text">AI is retrieving knowledge and synthesizing answer...</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3 shrink-0">
                    <input
                      className="flex-grow bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 outline-none"
                      placeholder={documents.length === 0 ? "⚠️ Upload documents first to perform RAG chat..." : "Ask the AI assistant anything about your knowledge..."}
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!prompt.trim() || generating}
                      className="px-4 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold"
                    >
                      <span>Send</span>
                      <Send size={12} />
                    </button>
                  </form>
                  
                  {/* Citation preview slider drawer overlay */}
                  {activeCitation && (
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-5 z-20 flex flex-col justify-between animate-slide-in">
                      <div>
                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div>
                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Source Document</span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate max-w-[200px]">{activeCitation.filename}</h4>
                          </div>
                          <button onClick={() => setActiveCitation(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600"><X size={14}/></button>
                        </div>

                        <div className="mt-4 space-y-4">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Similarity Score</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${activeCitation.similarity * 100}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-teal-600">{(activeCitation.similarity * 100).toFixed(1)}%</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Content Snippet</p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed text-slate-700 dark:text-slate-350 max-h-96 overflow-y-auto whitespace-pre-wrap">
                              {activeCitation.content}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-2">
                        <button
                          onClick={() => copyToClipboard(activeCitation.content)}
                          className="flex-1 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
                        >
                          <Copy size={12}/> Copy Text
                        </button>
                        <button
                          onClick={() => {
                            setPreviewChunk(activeCitation);
                            setActiveCitation(null);
                            setCurrentTab('search');
                          }}
                          className="flex-1 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1.5"
                        >
                          <Search size={12}/> Find Chunks
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: DOCUMENTS MANAGEMENT */}
            {/* ============================================================== */}
            {currentTab === 'documents' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge Vault</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload and manage internal documents to index inside the vector DB.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Upload panel */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-soft-sm">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Upload size={16} className="text-primary" />
                      Ingest New Source
                    </h3>

                    {/* Drag and Drop Zone */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        dragActive 
                          ? 'border-primary bg-primary-container/20' 
                          : selectedFile 
                          ? 'border-teal-400 bg-teal-50/10' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <FileCheck className={`text-3xl mb-2 ${selectedFile ? 'text-teal-500' : 'text-slate-400'}`} size={32} />
                      <input
                        id="docFileInput"
                        type="file"
                        accept=".txt,.md,.pdf,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label htmlFor="docFileInput" className="cursor-pointer text-xs font-bold text-primary hover:underline">
                        {selectedFile ? 'Select a different file' : 'Click to select file'}
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1">or drag & drop .txt, .md, .pdf, or .docx</p>
                      
                      {selectedFile && (
                        <div className="mt-4 p-2 bg-slate-100 dark:bg-slate-850 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-700 dark:text-slate-300 max-w-full truncate">
                          Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
                        </div>
                      )}
                    </div>

                    {selectedFile && (
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full mt-4 bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="animate-spin text-white" size={14} />
                            <span>Vectorizing & Chunking...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            <span>Ingest to Vault</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Document Vault List */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-soft-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Files size={16} className="text-primary" />
                        Indexed Vault Sources ({documents.length})
                      </h3>
                      <div className="flex items-center gap-3">
                        {/* Search in docs */}
                        <input
                          type="text"
                          placeholder="Filter docs..."
                          value={docSearchQuery}
                          onChange={(e) => setDocSearchQuery(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none"
                        />
                        <button onClick={fetchDocuments} className="text-slate-400 hover:text-primary transition-colors">
                          <RefreshCw size={14} />
                        </button>
                        <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                          <button onClick={() => setViewMode('grid')} className={`p-1 ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent'}`}><Grid size={14}/></button>
                          <button onClick={() => setViewMode('list')} className={`p-1 ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent'}`}><List size={14}/></button>
                        </div>
                      </div>
                    </div>

                    {loadingDocs ? (
                      <div className="p-12 text-center text-slate-400">
                        <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                        <p className="text-xs mt-2">Retrieving index files...</p>
                      </div>
                    ) : filteredDocuments.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        <FileText className="mx-auto text-slate-300 mb-3" size={36} />
                        <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400">No matching files found</h4>
                        <p className="text-xs mt-1">Upload knowledge assets to begin.</p>
                      </div>
                    ) : viewMode === 'grid' ? (
                      // Grid View
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50/30 dark:bg-slate-900/10">
                        {filteredDocuments.map((doc) => (
                          <div 
                            key={doc.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-xl shadow-soft-sm hover:shadow-soft-md hover:border-primary/20 dark:hover:border-primary/20 transition-all flex flex-col justify-between h-36"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="text-primary shrink-0" size={16} />
                                <span className="font-semibold text-xs text-slate-950 dark:text-slate-200 truncate pr-2" title={doc.filename}>{doc.filename}</span>
                              </div>
                              <button
                                onClick={() => triggerDeleteConfirm('document', doc.id, doc.filename)}
                                className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"
                                title="Delete document"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            <div className="space-y-1 text-[10px] text-slate-400">
                              <p>Size: {formatBytes(doc.file_size)}</p>
                              <p>Ingested: {formatDate(doc.created_at)}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-3 mt-2">
                              <span className="px-2 py-0.5 text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-full">Indexed</span>
                              <button 
                                onClick={() => setSelectedDocDetails(doc)}
                                className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
                              >
                                Details <ChevronRight size={10}/>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // List View
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-850 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                            <tr>
                              <th className="px-6 py-3.5">Filename</th>
                              <th className="px-6 py-3.5">Size</th>
                              <th className="px-6 py-3.5">Ingested</th>
                              <th className="px-6 py-3.5">Status</th>
                              <th className="px-6 py-3.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {filteredDocuments.map((doc) => (
                              <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-6 py-3.5 flex items-center gap-2">
                                  <FileText className="text-primary shrink-0" size={14} />
                                  <span className="font-semibold text-slate-850 dark:text-slate-200 truncate max-w-[200px]">{doc.filename}</span>
                                </td>
                                <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{formatBytes(doc.file_size)}</td>
                                <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{formatDate(doc.created_at)}</td>
                                <td className="px-6 py-3.5">
                                  <span className="px-2 py-0.5 text-[9px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full">Indexed</span>
                                </td>
                                <td className="px-6 py-3.5 text-right space-x-2">
                                  <button 
                                    onClick={() => setSelectedDocDetails(doc)}
                                    className="px-2 py-1 text-[10px] font-semibold text-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => triggerDeleteConfirm('document', doc.id, doc.filename)}
                                    className="p-1 hover:bg-red-50 text-slate-450 hover:text-red-500 rounded inline-flex align-middle"
                                    title="Delete document"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Doc Details Drawer overlay */}
                {selectedDocDetails && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
                    <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 w-full max-w-md flex flex-col justify-between animate-slide-in">
                      <div>
                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                          <div className="flex items-center gap-2.5">
                            <FileText className="text-primary" size={20} />
                            <div>
                              <h4 className="text-sm font-bold text-slate-950 dark:text-white truncate max-w-[240px]">{selectedDocDetails.filename}</h4>
                              <p className="text-[10px] text-slate-450 mt-0.5">Ingested successfully</p>
                            </div>
                          </div>
                          <button onClick={() => setSelectedDocDetails(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600"><X size={16}/></button>
                        </div>

                        <div className="mt-6 space-y-4 text-xs">
                          <div>
                            <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Document ID</p>
                            <p className="font-mono text-[10px] text-slate-800 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-850 p-2 rounded">{selectedDocDetails.id}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">MIME Type</p>
                              <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">{selectedDocDetails.mime_type}</p>
                            </div>
                            <div>
                              <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">File Size</p>
                              <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">{formatBytes(selectedDocDetails.file_size)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Ingestion Timestamp</p>
                            <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">{formatDate(selectedDocDetails.created_at)}</p>
                          </div>
                          <div>
                            <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">RAG Vector Chunks</p>
                            <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">Split in 500-char intervals with 50-char overlap.</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setConfirmDialog({ isOpen: true, type: 'document', id: selectedDocDetails.id, title: selectedDocDetails.filename });
                          setSelectedDocDetails(null);
                        }}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete from Vault
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: SEMANTIC SEARCH */}
            {/* ============================================================== */}
            {currentTab === 'search' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Semantic Search</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Query your organization's document chunks using embeddings context similarity.</p>
                </div>

                {/* Google-like search bar */}
                <form onSubmit={handleSemanticSearch} className="flex gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-soft-sm">
                  <div className="flex-grow flex items-center bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 gap-2">
                    <Search className="text-slate-450 shrink-0" size={18} />
                    <input
                      className="bg-transparent border-none text-xs w-full text-slate-850 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-0 outline-none"
                      placeholder="Search semantic phrases..."
                      type="text"
                      value={semanticQuery}
                      onChange={(e) => setSemanticQuery(e.target.value)}
                    />
                    {semanticQuery && (
                      <button type="button" onClick={() => setSemanticQuery('')} className="text-slate-450 hover:text-slate-650"><X size={16}/></button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!semanticQuery.trim() || loadingSearch}
                    className="px-6 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-xs font-bold shrink-0"
                  >
                    {loadingSearch ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <SearchCode size={14} />
                        <span>Semantic Match</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Search Results List */}
                <div className="space-y-4">
                  {loadingSearch ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-400">
                      <Loader2 className="animate-spin mx-auto text-primary mb-2" size={24} />
                      <p className="text-xs">Computing similarity embeddings...</p>
                    </div>
                  ) : semanticResults.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-400 shadow-soft-sm">
                      <Search className="mx-auto text-slate-200 mb-3" size={40} />
                      <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400">No search results</h4>
                      <p className="text-xs mt-1">Enter a phrase above to scan the vector database.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-450 font-semibold px-1">Retrieved {semanticResults.length} relevant vector chunks:</p>
                      
                      {semanticResults.map((result, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setPreviewChunk(result)}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-primary/30 hover:shadow-soft-md cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-soft-sm"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="overflow-hidden">
                              <span className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">Match Chunk #{idx + 1}</span>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{result.filename}</h4>
                            </div>
                            
                            <div className="flex items-center gap-1.5 shrink-0 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 border border-teal-200 dark:border-teal-800 rounded-lg">
                              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">Score: {(result.similarity * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed line-clamp-3 bg-slate-50/50 dark:bg-slate-850 p-3 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-wrap font-sans">
                            {result.content}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1"><Clock size={12}/> Chunk ID: {result.chunk_id.slice(0, 8)}</span>
                            <span className="text-primary font-bold flex items-center gap-0.5 hover:underline">Preview Details <ChevronRight size={10}/></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview Chunk Overlay Details */}
                {previewChunk && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col justify-between shadow-2xl animate-scale-up">
                      <div>
                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                          <div>
                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Semantic Vector Match</span>
                            <h4 className="text-sm font-bold text-slate-950 dark:text-white mt-0.5 truncate max-w-[400px]">{previewChunk.filename}</h4>
                          </div>
                          <button onClick={() => setPreviewChunk(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600"><X size={16}/></button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-4 text-xs">
                            <div>
                              <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Document ID</p>
                              <p className="font-semibold text-slate-850 dark:text-slate-200 mt-0.5">{previewChunk.document_id}</p>
                            </div>
                            <div>
                              <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Cosine Similarity</p>
                              <p className="font-bold text-teal-600 mt-0.5">{(previewChunk.similarity * 100).toFixed(3)}%</p>
                            </div>
                          </div>

                          <div>
                            <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Full Chunk Snippet Content</p>
                            <div className="mt-1 p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed text-slate-800 dark:text-slate-300 max-h-96 overflow-y-auto whitespace-pre-wrap font-sans">
                              {previewChunk.content}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                        <button 
                          onClick={() => copyToClipboard(previewChunk.content)}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                        >
                          <Copy size={12}/> Copy Text
                        </button>
                        <button 
                          onClick={() => {
                            setPrompt(`Based on ${previewChunk.filename}, explain: `);
                            setCurrentTab('workspace');
                            setPreviewChunk(null);
                          }}
                          className="px-4 py-2 bg-primary hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare size={12}/> Prompt Context
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: SETTINGS */}
            {/* ============================================================== */}
            {currentTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Workspace Settings</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure profile security, generate API access keys, and adjust appearance.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-soft-sm overflow-hidden flex flex-col md:flex-row min-h-[480px]">
                  
                  {/* Left Column: Settings Tab Selector */}
                  <div className="w-full md:w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 p-4 space-y-1">
                    <button
                      onClick={() => setSettingsTab('profile')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all ${
                        settingsTab === 'profile'
                          ? 'bg-primary-container/40 dark:bg-primary/10 text-primary font-semibold'
                          : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <UserIcon size={14} />
                      Profile
                    </button>
                    <button
                      onClick={() => setSettingsTab('security')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all ${
                        settingsTab === 'security'
                          ? 'bg-primary-container/40 dark:bg-primary/10 text-primary font-semibold'
                          : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <LockIcon size={14} />
                      Security
                    </button>
                    <button
                      onClick={() => setSettingsTab('api')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all ${
                        settingsTab === 'api'
                          ? 'bg-primary-container/40 dark:bg-primary/10 text-primary font-semibold'
                          : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <Key size={14} />
                      API Keys
                    </button>
                    <button
                      onClick={() => setSettingsTab('appearance')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all ${
                        settingsTab === 'appearance'
                          ? 'bg-primary-container/40 dark:bg-primary/10 text-primary font-semibold'
                          : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <Palette size={14} />
                      Appearance
                    </button>
                  </div>

                  {/* Right Column: Settings Panels */}
                  <div className="flex-1 p-6 md:p-8">
                    
                    {/* PANEL: Profile */}
                    {settingsTab === 'profile' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">User Profile Information</h3>
                        
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-2xl border border-primary/20 shadow-md">
                            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.full_name || 'System User'}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-lg">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Full Name</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                              value={profileName}
                              onChange={(e) => setProfileName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Email Address</label>
                            <input 
                              type="email" 
                              className="w-full px-3 py-2 bg-slate-150 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg cursor-not-allowed"
                              defaultValue={user?.email || ''}
                              disabled
                            />
                          </div>
                        </div>

                        <button 
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-primary hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* PANEL: Security */}
                    {settingsTab === 'security' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Security & Password</h3>

                        <div className="space-y-4 text-xs max-w-sm">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Current Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">New Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                        </div>

                        <button 
                          onClick={handleUpdatePassword}
                          className="px-4 py-2 bg-primary hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    )}

                    {/* PANEL: API Keys */}
                    {settingsTab === 'api' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">API Integration Credentials</h3>
                          <button 
                            onClick={() => showToast('Created a new API Token: live_tok_' + Math.random().toString(36).slice(2))}
                            className="px-3 py-1.5 bg-primary hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Plus size={12}/> Generate Key
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Query document embeddings and trigger chats externally from Slack bots, custom backends, or enterprise tools.
                        </p>

                        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
                          <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 font-bold text-slate-450">
                            <span>Key Name</span>
                            <span>Prefix</span>
                            <span className="text-right">Actions</span>
                          </div>
                          <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="grid grid-cols-3 px-4 py-3 items-center">
                              <span className="font-semibold text-slate-805 dark:text-slate-300">Production Slack Integration</span>
                              <span className="font-mono text-slate-400">sk_live_6c00d...</span>
                              <button onClick={() => showToast('Token sk_live_6c00d revoked.')} className="text-right text-red-500 hover:underline">Revoke</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PANEL: Appearance */}
                    {settingsTab === 'appearance' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Visual Settings</h3>

                        <div className="space-y-4 text-xs">
                          <div className="flex items-center justify-between max-w-sm">
                            <div>
                              <p className="font-bold text-slate-850 dark:text-slate-200">Workspace Theme Mode</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Toggle light backgrounds or dark interface modes.</p>
                            </div>
                            <button
                              onClick={() => setDarkMode(!darkMode)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-colors"
                            >
                              {darkMode ? 'Dark theme active' : 'Light theme active'}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between max-w-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div>
                              <p className="font-bold text-slate-850 dark:text-slate-200">Compact Workspace Sidebar</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Minimize sidebar links into small icons.</p>
                            </div>
                            <div className="w-10 h-6 bg-slate-200 rounded-full p-1 cursor-pointer">
                              <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
