"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Brain, Layers, Eye, Sparkles, ChevronRight, CheckCircle2,
  Clock, AlertCircle, TrendingUp, ExternalLink, Zap, BarChart3,
  ArrowRight, Loader2, Tag, Send, Plus, X, Globe, FileText,
  Rss, Link as LinkIcon, Hash, FolderOpen, BookOpen, ShieldCheck, 
  Image as ImageIcon, Facebook, Instagram
} from "lucide-react";
import {
  researchTopics, monitoredSources, researchSources, monitoredArticles, generatedTopics,
} from "@/lib/mock-data";

const tabs = [
  { id: "topics", label: "Research Topics", icon: Brain, count: researchTopics.length },
  { id: "sources", label: "Sources", icon: Layers, count: researchSources.length },
  { id: "monitored", label: "Monitored", icon: Eye, count: monitoredArticles.length },
  { id: "generated", label: "Generated", icon: Sparkles, count: generatedTopics.length },
];

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState("topics");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<typeof researchTopics[0] | null>(researchTopics[0] || null);
  const [selectedGenerated, setSelectedGenerated] = useState<typeof generatedTopics[0] | null>(generatedTopics[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Interactive Demo States
  const [simulatedExport, setSimulatedExport] = useState<string | null>(null);

  const filteredTopics = researchTopics.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSources = researchSources.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.siteName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMonitored = monitoredArticles.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.source.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGenerated = generatedTopics.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleTriggerHandoff = (id: string) => {
    setSimulatedExport(id);
    setTimeout(() => {
      setSimulatedExport(null);
    }, 2500);
  };

  const handleGenerateDraft = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowCreateModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Arctic Engine OS: Intelligence Workspace</h1>
          <p className="text-slate-500 text-sm mt-1">Multi-market ingestion clustering, automated attribution extraction, and social previews.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2 shadow-sm bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> New Track Vector
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tracked Vectors", value: researchTopics.length, icon: Brain, color: "bg-blue-50 text-blue-600" },
          { label: "Active Feeds Monitored", value: researchSources.length, icon: Layers, color: "bg-emerald-50 text-emerald-600" },
          { label: "Change Logs Checked", value: monitoredArticles.length, icon: Eye, color: "bg-amber-50 text-amber-600" },
          { label: "Synthesized Briefs", value: generatedTopics.length, icon: Sparkles, color: "bg-purple-50 text-purple-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs & Search */}
      <div className="flex items-center gap-3 flex-wrap justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/60">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden p-1 gap-1 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide uppercase transition-all ${
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter discovery matrix..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
      </div>

      {/* TAB: Research Topics */}
      {activeTab === "topics" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left bg-white border rounded-xl p-4 transition-all shadow-sm flex items-start gap-3 hover:border-slate-300 ${
                  selectedTopic?.id === topic.id ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200/80"
                }`}
              >
                <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-slate-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 truncate pr-2">{topic.title}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider rounded-md flex-shrink-0">{topic.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{topic.contextSummary}</p>
                  <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-50 text-[11px] font-medium text-slate-400">
                    <span className="flex items-center gap-1 text-slate-600"><Globe className="w-3 h-3"/> {topic.suggestedSite}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{topic.confidence}% Extraction Confidence</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-2" />
              </button>
            ))}
          </div>

          {/* Right Workspace Preview Panel */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit space-y-5">
            {selectedTopic ? (
              <>
                <div className="flex justify-between items-start border-b border-slate-100 pb-3.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Verification Engine</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">{selectedTopic.title}</h3>
                  </div>
                  <button 
                    onClick={() => handleTriggerHandoff(selectedTopic.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      simulatedExport === selectedTopic.id 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {simulatedExport === selectedTopic.id ? (
                      <>⚡ Staged to Wizard!</>
                    ) : (
                      <><Send className="w-3 h-3" /> Stage Pipeline Brief</>
                    )}
                  </button>
                </div>

                {/* The Copyright Guardrail Module View */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl text-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Clean Factual Extractors (De-risked Asset)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic border-b border-slate-800 pb-2 mb-2">
                    "System parsing logs: Content transformed from targeted arrays into raw metrics. No original sentence layouts retained." 
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-start gap-1.5 font-medium"><span className="text-slate-500">•</span> Sourced Targeting Anchor: {selectedTopic.angle}</p>
                    <p className="flex items-start gap-1.5 font-medium"><span className="text-slate-500">•</span> Verification Anchors: Checked across {selectedTopic.sourceCount} primary network clusters[cite: 281].</p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex flex-wrap gap-1.5">
                    {selectedTopic.sources.map((s, i) => (
                      <span key={i} className="bg-slate-900 px-1.5 py-0.5 rounded flex items-center gap-1 text-slate-400">
                        <ExternalLink className="w-2.5 h-2.5" /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Teaser Platform Overrides Mock Panels */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" /> Multi-Channel Promotional Outlines
                  </h4>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                      <Facebook className="w-3.5 h-3.5 fill-current" /> Facebook Dynamic Post Anchor [cite: 335]
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      📢 <strong>Intelligence Alert:</strong> New strategic data tracking confirms emerging developments regarding <em>"{selectedTopic.title}"</em>. Read the complete localized deep dive on our cluster matrix. Links matching verification loops attached. [cite: 306, 336]
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-pink-600">
                      <Instagram className="w-3.5 h-3.5" /> Instagram Content Engine Post [cite: 335]
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      High-impact data trends are landing across the high Arctic ecosystem. Complete breakdown of metrics available now. 🌍 Link in profile bio. [cite: 306, 336]
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 font-mono">
                      #NordicIntelligence #DataOps #{selectedTopic.category.replace(/\s+/g, '')} [cite: 337]
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">Select an active tracking vector matrix node</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Sources (Telemetry Check & Feeds View) */}
      {activeTab === "sources" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Approved Monitoring Array (RSS / Alerts) [cite: 281]</h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated cron loops polling data streams cleanly without scraping protected text blocks[cite: 289].</p>
            </div>
            <div className="space-y-2.5">
              {monitoredSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {source.type === "feed" ? <Rss className="w-4 h-4 text-slate-600" /> : <Globe className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{source.name}</p>
                      <p className="text-[11px] text-slate-400">Yield: {source.articlesFound} historical footprints · Checked {source.lastScan} [cite: 417]</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md">
                    Polling Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Extracted Entities Ledger</h3>
              <p className="text-xs text-slate-400 mt-0.5">Raw unstructured documents analyzed for key metrics and trend clustering data.</p>
            </div>
            <div className="space-y-3">
              {filteredSources.map((source) => (
                <div key={source.id} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-inner space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{source.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{source.siteName} · Indexed parameters</p>
                    </div>
                    <span className="bg-slate-100 text-slate-700 text-[9px] uppercase font-mono px-2 py-0.5 rounded font-bold">Parsed</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
                    {source.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Monitored Articles */}
      {activeTab === "monitored" && (
        <div className="max-w-4xl space-y-3">
          {filteredMonitored.map((article) => (
            <div key={article.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold text-slate-900">{article.title}</h3>
                      {article.changeDetected && (
                        <span className="text-[9px] bg-red-50 text-red-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          Delta Identified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{article.source} · Verification checkpoint: {article.lastChecked} [cite: 428]</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 border border-slate-100 p-3 rounded-lg font-medium">{article.summary}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Generated Topics (Asset Engine / Stock-First Loop Showcase) */}
      {activeTab === "generated" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            {filteredGenerated.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedGenerated(topic)}
                className={`w-full text-left bg-white border rounded-xl p-4 transition-all shadow-sm flex items-start gap-3 hover:border-slate-300 ${
                  selectedGenerated?.id === topic.id ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200/80"
                }`}
              >
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 truncate pr-2">{topic.title}</h3>
                    <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800">{topic.urgency} triage Priority</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic font-medium">"{topic.excerpt}" [cite: 439]</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-2" />
              </button>
            ))}
          </div>

          {/* Right Workspace Preview Panel for Asset Engine Rules */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit space-y-4">
            {selectedGenerated ? (
              <>
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Engine Rules Blueprint</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">{selectedGenerated.title}</h3>
                </div>

                {/* Free Stock First Visual Proof Logic */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-slate-600" /> Sourced Asset Priority Matrix</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">Rule active</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-lg shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        <strong>Step 1: Free Stock Verification API Lookup</strong>
                        <p className="text-slate-400 mt-0.5 font-mono text-[10px]">Query: "{selectedGenerated.keywords?.[0] || 'Arctic'}" via Unsplash/Pexels endpoint hook.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/40 border border-slate-100 p-2 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        <strong>Step 2: AI Prompt generation Fallback</strong>
                        <p className="text-[10px] mt-0.5 italic">Conditional fallback execution triggers only if match yields zero asset parameters[cite: 299, 303].</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Estimated Output parameters</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>📐 Target Outpost: <span className="text-slate-900 font-bold">{selectedGenerated.suggestedSite}</span></div>
                    <div>📝 Word Estimate: <span className="text-slate-900 font-bold">~{selectedGenerated.wordCountEstimate} words</span> [cite: 449]</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => handleTriggerHandoff(selectedGenerated.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                      simulatedExport === selectedGenerated.id 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-950 text-white hover:bg-slate-900'
                    }`}
                  >
                    {simulatedExport === selectedGenerated.id ? (
                      <>⚡ Brief Dispatched to Master Pipeline Logs!</>
                    ) : (
                      <><Send className="w-3.5 h-3.5" /> Initialize Content Pipeline Handoff</>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">Select an intelligence summary node</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Modal Shell (Retained for matching visual layout consistency) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Define Automated Tracking Vector</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Topic Core Parameters</label>
                <input type="text" placeholder="e.g., Akureyri Airport infrastructure adjustments" className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Domain Module</label>
                  <select className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                    <option>All Network Outposts</option>
                    <option>Greenland Review</option>
                    <option>Nordic Current</option>
                    <option>Norway Review</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Triage Category</label>
                  <select className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                    <option>Policy</option>
                    <option>Tourism</option>
                    <option>Environment</option>
                    <option>Infrastructure</option>
                  </select>
                </div>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-700 font-medium">
                "System Note: Initializing this matrix triggers an automated background polling request across approved streams." [cite: 360]
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleGenerateDraft} disabled={isGenerating} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {isGenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Loops...</> : <><Brain className="w-3.5 h-3.5" /> Initialize Matrix Tracking</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
