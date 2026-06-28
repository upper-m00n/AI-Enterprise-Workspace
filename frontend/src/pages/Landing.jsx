import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight, 
  ChevronDown, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Database,
  MessageSquare,
  Network,
  Share2,
  Lock
} from 'lucide-react';

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);

  // Mock chat simulation state
  const [simQuery, setSimQuery] = useState('');
  const [simAnswer, setSimAnswer] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const triggerSimQuery = (queryText) => {
    setSimulating(true);
    setSimQuery(queryText);
    setSimAnswer(null);
    setTimeout(() => {
      setSimulating(false);
      setSimAnswer({
        text: "Based on the Q4_Strategy.pdf, our primary expansions goals for EMEA include:\n\n1. Increasing market share in the DACH region by 15% through localized partner networks [1].\n2. Launching a new edge node in Dublin to reduce latency for Western European clients [2].",
        citations: [
          { filename: "Q4_Strategy.pdf", page: 12, index: 1 },
          { filename: "Security_Policy.html", page: 4, index: 2 }
        ]
      });
    }, 1200);
  };

  return (
    <div className="bg-background text-on-background font-sans overflow-x-hidden min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-45 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-between">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">Enterprise AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-650">
            <a className="hover:text-primary transition-colors" href="#features">Features</a>
            <a className="hover:text-primary transition-colors" href="#workflow">Workflow</a>
            <a className="hover:text-primary transition-colors" href="#pricing">Pricing</a>
            <a className="hover:text-primary transition-colors" href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-xs font-bold text-primary hover:bg-slate-50 transition-colors rounded-lg">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-xs font-bold bg-primary hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all active:scale-95">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Atmospheric backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bg-blob" style={{ top: '-150px', right: '-150px', animationDelay: '0s' }}></div>
        <div className="bg-blob" style={{ bottom: '-150px', left: '-150px', animationDelay: '-8s' }}></div>
      </div>

      <main className="flex-grow relative z-10">
        
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-700 rounded-full mb-6">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">SOC2 Compliant & Enterprise Secured</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight max-w-4xl">
            Your Company's Knowledge, <span className="text-primary bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">Instantly Searchable</span> with AI.
          </h1>
          
          <p className="text-sm md:text-base text-slate-500 mt-6 max-w-2xl leading-relaxed">
            Upload documents, ask questions, and receive citation-backed answers powered by our advanced semantic RAG engine.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to="/register" className="px-6 py-3.5 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-primary/20 transition-all flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
            <a href="#workflow" className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-all text-center block">
              Book Demo
            </a>
          </div>

          {/* Interactive Chat Simulator Widget */}
          <div className="w-full max-w-4xl mt-16 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden text-left">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="h-4 w-px bg-slate-200 mx-2"></div>
                <span className="text-[10px] font-bold text-slate-550 flex items-center gap-1.5">
                  <FileText size={12} className="text-primary" />
                  EMEA Operations Project Knowledge Base
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-12 h-[380px]">
              {/* Sidebar */}
              <div className="col-span-12 md:col-span-3 border-r border-slate-100 bg-slate-50/50 p-4 text-xs">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Workspace Sources</span>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-primary font-semibold">
                    <FileText size={12} />
                    <span className="truncate">Q4_Strategy.pdf</span>
                  </div>
                  <div className="p-2 hover:bg-slate-100 rounded-lg flex items-center gap-2 text-slate-600 transition-colors">
                    <FileText size={12} className="text-slate-400" />
                    <span className="truncate">Security_Policy.html</span>
                  </div>
                  <div className="p-2 hover:bg-slate-100 rounded-lg flex items-center gap-2 text-slate-600 transition-colors">
                    <Database size={12} className="text-slate-400" />
                    <span className="truncate">Operations_Manual.txt</span>
                  </div>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="col-span-12 md:col-span-9 p-6 flex flex-col justify-between text-xs bg-slate-50/10">
                <div className="space-y-4 overflow-y-auto">
                  {simQuery ? (
                    <div className="flex justify-end">
                      <div className="bg-primary text-white px-4 py-2.5 rounded-xl rounded-tr-none max-w-[80%]">
                        {simQuery}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-12">
                      <p>Click a suggest question below to simulate our RAG response engine.</p>
                      <button 
                        onClick={() => triggerSimQuery("What are our expansion goals for EMEA in DACH region?")}
                        className="mt-3 px-4 py-2 border border-slate-200 hover:border-primary/20 bg-white rounded-lg text-[10px] text-slate-600 font-semibold transition-colors"
                      >
                        "What are our expansion goals for EMEA in DACH region?"
                      </button>
                    </div>
                  )}

                  {simulating && (
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center shrink-0">
                        <Sparkles size={12} className="animate-spin" />
                      </div>
                      <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl rounded-tl-none text-slate-500">
                        AI is retrieving vector chunks & synthesizing answer...
                      </div>
                    </div>
                  )}

                  {simAnswer && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center shrink-0">
                          <Sparkles size={12} />
                        </div>
                        <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl rounded-tl-none text-slate-800 leading-relaxed shadow-sm">
                          {simAnswer.text}
                        </div>
                      </div>

                      {/* Simulated citation cards */}
                      <div className="flex gap-2 pl-9">
                        {simAnswer.citations.map((c, idx) => (
                          <div key={idx} className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-teal-700 text-[9px] font-bold rounded flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-teal-600" />
                            Source [{c.index}] Page {c.page}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-2">
                  <input 
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none text-[11px] placeholder:text-slate-400"
                    placeholder="Search documents instantly..." 
                    type="text" 
                    readOnly
                  />
                  <button className="p-2 bg-primary hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"><ArrowRight size={14}/></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Features Section */}
        <section className="bg-slate-50/50 py-20 px-6 border-y border-slate-100" id="features">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-slate-900">Enterprise AI Infrastructure</h2>
              <p className="text-xs text-slate-500 mt-2">Deploy secure, citation-backed intelligence to your entire team.</p>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-7 bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between hover:shadow-soft-md transition-shadow">
                <div>
                  <Zap className="text-primary text-3xl mb-4" size={32} />
                  <h3 className="text-lg font-bold text-slate-900">Precision RAG Ingestion</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Our semantic retrieval pipeline parses plaintext, markdown, files, and wikis, generating high-dimensional vectors stored inside a dedicated pgVector catalog.
                  </p>
                </div>
                <div className="mt-8 flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded">500-char Chunks</span>
                  <span className="px-2 py-1 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded">pgVector Database</span>
                  <span className="px-2 py-1 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded">Cosine Similarity</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-5 bg-slate-900 text-slate-100 rounded-xl p-8 flex flex-col justify-between hover:shadow-soft-md transition-shadow">
                <div>
                  <Lock className="text-teal-400 mb-4 animate-pulse" size={32} />
                  <h3 className="text-lg font-bold">SOC2 Level Security</h3>
                  <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                    Your company data remains isolated. We run private vector partitions and never train models on your uploaded corporate documents.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between text-center">
                  <div>
                    <p className="text-lg font-extrabold text-white">99.9%</p>
                    <span className="text-[9px] uppercase font-bold text-slate-500">Uptime</span>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-white">AES-256</p>
                    <span className="text-[9px] uppercase font-bold text-slate-500">Encryption</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-4 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-soft-md transition-shadow">
                <Globe className="text-primary mb-3" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Multilingual Search</h4>
                  <p className="text-xs text-slate-500 mt-1">Search, translate, and synthesize answers across 50+ languages natively.</p>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-4 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-soft-md transition-shadow">
                <Network className="text-primary mb-3" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Federated Indexing</h4>
                  <p className="text-xs text-slate-500 mt-1">Ingest plain text, code scripts, policies, and operational files seamlessly.</p>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-4 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-soft-md transition-shadow">
                <Share2 className="text-primary mb-3" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">API Integration</h4>
                  <p className="text-xs text-slate-500 mt-1">Expose semantic endpoints to connect workspaces with Slack, Jira, and wikis.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Workflow Ingestion Section */}
        <section className="py-20 px-6" id="workflow">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-slate-900">How RAG Pipeline Works</h2>
              <p className="text-xs text-slate-500 mt-2">A clean three-step workflow from static raw data to intelligent synthesis.</p>
            </div>

            <div className="relative space-y-12">
              <div className="flex items-start gap-8 group">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm relative z-10 shadow-md">1</div>
                <div className="p-6 bg-white border border-slate-200 rounded-xl group-hover:border-primary transition-colors flex-grow shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900">Data Chunking & Ingestion</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Upload plain text (.txt) or markdown (.md). Our pipeline splits text into 500-char intervals to optimize semantic search density and prevent context dilution.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm relative z-10 shadow-md">2</div>
                <div className="p-6 bg-white border border-slate-200 rounded-xl group-hover:border-primary transition-colors flex-grow shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900">Embedding vector matching</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Queries are converted to embeddings. We query our pgVector index utilizing Cosine Similarity, retrieving exact chunks containing related semantic topics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm relative z-10 shadow-md">3</div>
                <div className="p-6 bg-white border border-slate-200 rounded-xl group-hover:border-primary transition-colors flex-grow shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900">Synthesis & Citation mapping</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Groq LLM synthesizes retrieved chunks into a unified response. Precision citation tags link claims back to source documents, guaranteeing auditability.
                  </p>
                </div>
              </div>
              
              <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-slate-100 -z-0"></div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Trusted by Enterprise Leaders</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between">
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "The accuracy of the RAG engine is unmatched. Our engineers spend 40% less time digging through API specs and documentation, drastically speeding up development cycles."
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xs uppercase">MC</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Marcus Chen</h5>
                    <p className="text-[10px] text-slate-400">CTO at TechFlow Systems</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between">
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "In fintech, data privacy is everything. Having isolated private indices where vectors are never used to train public LLMs is the primary reason we chose Enterprise AI Workspace."
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs uppercase">SS</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Sarah Sterling</h5>
                    <p className="text-[10px] text-slate-400">Head of Security at Fintech Global</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6" id="pricing">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900">Transparent Workspace Pricing</h2>
              <p className="text-xs text-slate-500 mt-2">Deploy AI to small divisions or entire multinational organizations.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 p-8 rounded-xl flex flex-col justify-between h-[360px] hover:shadow-soft-md transition-shadow">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Starter</h4>
                  <p className="text-[10px] text-slate-400 mt-1">For teams validating workflows.</p>
                  <p className="text-3xl font-black text-slate-900 mt-4">$0 <span className="text-xs font-normal text-slate-400">/mo</span></p>
                  <ul className="text-[11px] text-slate-650 space-y-2 mt-6">
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary"/> Up to 50 documents</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary"/> 100 RAG queries / month</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary"/> Basic citation index</li>
                  </ul>
                </div>
                <Link to="/register" className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-center font-bold rounded-lg text-xs transition-colors border border-slate-200">Start Free</Link>
              </div>

              <div className="bg-white border-2 border-primary p-8 rounded-xl flex flex-col justify-between h-[360px] relative shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">Most Popular</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Business</h4>
                  <p className="text-[10px] text-slate-400 mt-1">For active operational teams.</p>
                  <p className="text-3xl font-black text-slate-900 mt-4">$29 <span className="text-xs font-normal text-slate-400">/user/mo</span></p>
                  <ul className="text-[11px] text-slate-650 space-y-2 mt-6">
                    <li className="flex items-center gap-2 font-semibold"><CheckCircle2 size={12} className="text-primary"/> Unlimited documents</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary"/> 5,000 queries / user / mo</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary"/> Full API and Webhook access</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary"/> Priority support SLAs</li>
                  </ul>
                </div>
                <Link to="/register" className="w-full py-2 bg-primary hover:bg-blue-700 text-white text-center font-bold rounded-lg text-xs shadow transition-colors">Start Trial</Link>
              </div>

              <div className="bg-slate-900 text-slate-100 p-8 rounded-xl flex flex-col justify-between h-[360px] hover:shadow-soft-md transition-shadow">
                <div>
                  <h4 className="text-sm font-bold">Enterprise</h4>
                  <p className="text-[10px] text-slate-400 mt-1">For global compliance & scale.</p>
                  <p className="text-3xl font-black mt-4">Custom</p>
                  <ul className="text-[11px] text-slate-400 space-y-2 mt-6">
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-teal-400"/> Dedicated private DB partitions</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-teal-400"/> On-premise hybrid cloud</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-teal-400"/> Custom embedding training</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-teal-400"/> SOC2 reporting compliance</li>
                  </ul>
                </div>
                <button className="w-full py-2 bg-white text-slate-900 hover:bg-slate-100 text-center font-bold rounded-lg text-xs transition-colors">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-slate-50/50 border-t border-slate-100" id="faq">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-3">
              {[
                {
                  q: "Is my corporate knowledge base data used to train public LLM models?",
                  a: "Absolutely not. We provide completely partitioned, isolated database spaces. Your document vectors are used solely for real-time similarity search during active sessions, and are never sent to external training datasets."
                },
                {
                  q: "What file formats are supported for automatic ingestion?",
                  a: "Currently, our vault supports UTF-8 encoded plain text (.txt) and markdown (.md) documents. PDF and spreadsheet ingestion are fully supported on business plans."
                },
                {
                  q: "How precise are the citation tags?",
                  a: "Citations map directly to the specific 500-character chunk containing the source material. Clicking a citation badge instantly opens the original document excerpt with its similarity score for verification."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 px-6">
          <div className="bg-primary text-white rounded-2xl max-w-4xl mx-auto p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 -translate-y-24 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full -translate-x-16 translate-y-16 blur-2xl"></div>
            
            <h2 className="text-2xl font-bold relative z-10">Unlock your team's collective intelligence today.</h2>
            <p className="text-xs text-white/80 mt-2 max-w-lg mx-auto relative z-10">Connect your internal document vaults and query files with security-vetted AI.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 relative z-10">
              <Link to="/register" className="px-6 py-3 bg-white hover:bg-slate-100 text-primary font-bold text-xs rounded-lg transition-colors shadow">
                Start Trial
              </Link>
              <button className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white font-bold text-xs rounded-lg transition-colors">
                Contact Operations
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-6 text-xs text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">AI</div>
            <span className="font-bold text-slate-900 tracking-tight">Enterprise Workspace</span>
          </div>
          <p>© 2026 Enterprise AI Workspace. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors animate-fade-in" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors animate-fade-in" href="#">Terms</a>
            <a className="hover:text-primary transition-colors animate-fade-in" href="#">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
