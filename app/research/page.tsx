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
  { id: "topics", label: "Trending Topics", icon: Brain, count: researchTopics.length },
  { id: "sources", label: "News Feeds & Sites", icon: Layers, count: researchSources.length },
  { id: "monitored", label: "Monitored Updates", icon: Eye, count: monitoredArticles.length },
  { id: "generated", label: "Content Suggestions", icon: Sparkles, count: generatedTopics.length },
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
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Newsroom & Research Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Scan active news feeds, extract factual summaries, and preview promotional posts.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2 shadow-sm bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> Track New Topic
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Trending Topics Found", value: researchTopics.length, icon: Brain, color: "bg-blue-50 text-blue-600" },
          { label: "Connected News Feeds", value: researchSources.length, icon: Layers, color: "bg-emerald-50 text-emerald-600" },
          { label: "Articles Scanned", value: monitoredArticles.length, icon: Eye, color: "bg-amber-50 text-amber-600" },
          { label: "Story Ideas Generated", value: generatedTopics.length, icon: Sparkles, color: "bg-purple-50 text-purple-600" },
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
            placeholder="Search research..."
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
                    <span className="flex items-center gap-1 text-slate-600"><Globe className="w-3 h-3"/> For Site: {topic.suggestedSite}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{topic.confidence}% Info Accuracy</span>
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Trend Details</span>
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
                      <>⚡ Sent to Content Wizard!</>
                    ) : (
                      <><Send className="w-3 h-3" /> Send to Content Wizard</>
                    )}
                  </button>
                </div>

                {/* The Copyright Guardrail Module View */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl text-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Story Facts (Copyright Safe)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic border-b border-slate-800 pb-2 mb-2">
                    "System check: The following facts have been compiled and verified from local announcements. Original phrasing and text have been removed to avoid copyright issues."
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-start gap-1.5 font-medium"><span className="text-slate-500">•</span> Story Angle: {selectedTopic.angle}</p>
                    <p className="flex items-start gap-1.5 font-medium"><span className="text-slate-500">•</span> Coverage Cross-checked: Found across {selectedTopic.sourceCount} different news sources.</p>
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
                    <Hash className="w-3.5 h-3.5" /> Social Media Previews
                  </h4>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                      <Facebook className="w-3.5 h-3.5 fill-current" /> Facebook Post Draft
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      📢 <strong>News Update:</strong> New updates are coming out regarding <em>"{selectedTopic.title}"</em>. Read our full story breakout and analysis at the link below.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-pink-600">
                      <Instagram className="w-3.5 h-3.5" /> Instagram Post Draft
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Major trends are reshaping travel in the Arctic. Check out the full breakdown on our site. 🌍 Link in bio.
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 font-mono">
                      #NordicNews #TravelUpdate #{selectedTopic.category.replace(/\s+/g, '')}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">Select a topic from the list to view facts</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Sources (Telemetry Check & Feeds View) */}
      {activeTab === "sources" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sub-Column: Add New Feeds & Source Ingestion Control */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Input Block for Non-Technical Users */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-slate-700" /> Connect News Feed or Website
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Add an RSS link, news site URL, or Google News keyword to start monitoring it.</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feed Name / Label</label>
                  <input type="text" placeholder="e.g., Local Iceland Safety Alerts" className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-800" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feed URL or Search Phrase</label>
                  <div className="relative mt-1">
                    <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="https://example.com/rss or 'Svalbard travel'" className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-800" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source Type</label>
                    <select className="w-full mt-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none">
                      <option>Standard RSS Feed</option>
                      <option>Google News Search</option>
                      <option>Official Government Website</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Check Frequency</label>
                    <select className="w-full mt-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none">
                      <option>Every hour (Recommended)</option>
                      <option>Every 15 minutes</option>
                      <option>Once a day</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => handleTriggerHandoff('new_source')}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                    simulatedExport === 'new_source'
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {simulatedExport === 'new_source' ? (
                    <>✔ Source Connected & Active!</>
                  ) : (
                    <><Plus className="w-3.5 h-3.5" /> Start Monitoring Feed</>
                  )}
                </button>
              </div>
            </div>

            {/* Existing Monitored List */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Currently Monitored Feeds</h3>
                <p className="text-xs text-slate-400 mt-0.5">Sites and feeds the system currently checks for news updates.</p>
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
                        <p className="text-[11px] text-slate-400 font-medium">Found: {source.articlesFound} stories · Last checked {source.lastScan}</p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-emerald-200">
                      Connected
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sub-Column: Extracted Material Ledger */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 h-fit">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Articles Scanned</h3>
              <p className="text-xs text-slate-400 mt-0.5">Individual articles found during recent feed checks, indexed for fact-checking.</p>
            </div>
            <div className="space-y-3">
              {filteredSources.map((source) => (
                <div key={source.id} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-inner space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{source.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{source.siteName} · Scan Complete</p>
                    </div>
                    <span className="bg-slate-100 text-slate-700 text-[9px] uppercase px-2 py-0.5 rounded font-bold border border-slate-200">Indexed</span>
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
                          Page Updated
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">From: {article.source} · Checked {article.lastChecked}</p>
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
                    <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800">{topic.urgency} Priority</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic font-medium">"{topic.excerpt}"</p>
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image Selection Settings</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">{selectedGenerated.title}</h3>
                </div>

                {/* Free Stock First Visual Proof Logic */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-slate-600" /> Image Search Order</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">Active Rule</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-lg shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        <strong>Step 1: Check Free Stock Repositories First</strong>
                        <p className="text-slate-400 mt-0.5 font-mono text-[10px]">Looking up keyword: "{selectedGenerated.keywords?.[0] || 'Arctic'}" on Unsplash/Pexels.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/40 border border-slate-100 p-2 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        <strong>Step 2: Fallback to AI Image Generation</strong>
                        <p className="text-[10px] mt-0.5 italic">An AI graphic will only be created if no suitable free stock photo matches the keyword.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Story Details</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>🎯 Target Website: <span className="text-slate-900 font-bold">{selectedGenerated.suggestedSite}</span></div>
                    <div>📝 Target Length: <span className="text-slate-900 font-bold">~{selectedGenerated.wordCountEstimate} words</span></div>
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
                      <>⚡ Brief Exported to Draft Queue!</>
                    ) : (
                      <><Send className="w-3.5 h-3.5" /> Send to Draft Queue</>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">Select a story suggestion to check settings</p>
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
              <h3 className="text-base font-bold text-slate-900">Add New Topic Tracking</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topic / Target Subject</label>
                <input type="text" placeholder="e.g., Akureyri Airport flights expansion" className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-800 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Website</label>
                  <select className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none text-slate-700 font-medium">
                    <option>All Managed Sites</option>
                    <option>Greenland Review</option>
                    <option>Nordic Current</option>
                    <option>Norway Review</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none text-slate-700 font-medium">
                    <option>Policy</option>
                    <option>Tourism</option>
                    <option>Environment</option>
                    <option>Infrastructure</option>
                  </select>
                </div>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-700 font-medium">
                "Note: Adding this topic instructs background system checks to scan incoming news alerts for matching factual references."
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleGenerateDraft} disabled={isGenerating} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {isGenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing feeds...</> : <><Brain className="w-3.5 h-3.5" /> Start Topic Tracking</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
