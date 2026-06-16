"use client";

import { useState } from "react";
import {
  CheckCircle2, Clock, AlertCircle, Check, X, Image as ImageIcon,
  FolderOpen, Calendar, MessageSquare, ChevronRight, Eye, Edit3,
  Search, Wand2, Facebook, Instagram, Twitter, Linkedin, ClipboardList,
  Sparkles, ThumbsUp, ThumbsDown, RotateCcw, ExternalLink, Tag
} from "lucide-react";
import {
  articles,
  sites,
  lifecycleStages,
  freeStockImages,
  aiGeneratedImages,
  imageSourceConfigs,
  socialTeaserTemplates,
  aiImagePromptTemplates
} from "@/lib/mock-data";

type StatusFilter = "all" | "pending_review" | "needs_changes" | "approved";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending_review: { label: "Pending Review", color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  needs_changes: { label: "Needs Changes", color: "text-red-700", bg: "bg-red-50", icon: AlertCircle },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-50", icon: CheckCircle2 },
};

export default function ReviewQueuePage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTab, setImageTab] = useState<"free" | "ai">("free");
  const [selectedReplacementImage, setSelectedReplacementImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<typeof aiGeneratedImages>([]);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [changesNote, setChangesNote] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [localArticles, setLocalArticles] = useState(articles);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    headlineReviewed: false,
    contentReviewed: false,
    imageApproved: false,
    linksVerified: false,
    categoryAssigned: false,
    tagsAdded: false,
  });

  const reviewArticles = localArticles.filter(a => ["pending_review", "needs_changes", "approved"].includes(a.status));
  const filtered = reviewArticles.filter(a => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.siteName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const selected = localArticles.find(a => a.id === selectedId) || filtered[0] || null;

  const toggleChecklist = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = [
    { id: "headlineReviewed", label: "Headline Reviewed" },
    { id: "contentReviewed", label: "Content Reviewed" },
    { id: "imageApproved", label: "Image Approved", checked: !!selected?.featuredImage },
    { id: "linksVerified", label: "Links Verified" },
    { id: "categoryAssigned", label: "Category Assigned", checked: !!selected?.category },
    { id: "tagsAdded", label: "Tags Added", checked: selected?.tags.length > 0 },
  ];

  const completedChecks = checklistItems.filter(i => checklist[i.id] || i.checked).length;
  const checklistProgress = Math.round((completedChecks / checklistItems.length) * 100);

  const currentPromptTemplate = aiImagePromptTemplates.find(t => t.category === selected?.category) || aiImagePromptTemplates[0];

  const handleApprove = () => {
    if (!selected) return;
    setLocalArticles(prev => prev.map(a => a.id === selected.id ? { ...a, status: "approved" as const } : a));
    setShowSuccess("Article approved — ready to schedule or publish");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleRequestChanges = () => {
    if (!selected || !changesNote.trim()) return;
    setLocalArticles(prev => prev.map(a => a.id === selected.id ? { ...a, status: "needs_changes" as const } : a));
    setShowChangesModal(false);
    setChangesNote("");
    setShowSuccess("Changes requested — article sent back to author");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleSchedule = () => {
    if (!selected) return;
    setLocalArticles(prev => prev.map(a => a.id === selected.id ? { ...a, status: "scheduled" as const, scheduledAt: new Date(`${scheduleDate}T${scheduleTime}`).toISOString() } : a));
    setShowScheduleModal(false);
    setShowSuccess("Article scheduled — added to publishing calendar");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handlePublishNow = () => {
    if (!selected) return;
    setLocalArticles(prev => prev.map(a => a.id === selected.id ? { ...a, status: "published" as const } : a));
    setShowPublishModal(false);
    setShowSuccess("Article published — live on site");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleReplaceImage = () => {
    setShowImageModal(true);
    setSelectedReplacementImage(null);
    setImageTab("free");
  };

  const handleSelectReplacementImage = (imageUrl: string) => {
    setSelectedReplacementImage(imageUrl);
  };

  const handleConfirmImageReplace = () => {
    if (selectedReplacementImage && selected) {
      setLocalArticles(prev => prev.map(a => a.id === selected.id ? { ...a, featuredImage: selectedReplacementImage } : a));
      setShowImageModal(false);
      setShowSuccess("Featured image updated successfully");
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const handleGenerateAIImagesInReview = () => {
    setIsGeneratingImage(true);
    setImageTab("ai");
    setTimeout(() => {
      setGeneratedImages(aiGeneratedImages.slice(0, 4));
      setIsGeneratingImage(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">{showSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Review Queue</h1>
          <p className="text-slate-500 text-sm mt-1">Editorial approval workflow</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{filtered.length} items</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(["all", "pending_review", "needs_changes", "approved"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f === "all" ? "All" : f === "pending_review" ? "Pending" : f === "needs_changes" ? "Needs Changes" : "Approved"}
          </button>
        ))}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="input ml-auto w-64 px-3 py-1.5 border border-slate-200 rounded-md text-sm"
        />
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        {/* Left: Article List */}
        <div className="lg:col-span-3 card bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Articles</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((article) => {
              const config = statusConfig[article.status];
              const StatusIcon = config.icon;
              const isSelected = selected?.id === article.id;
              return (
                <button
                  key={article.id}
                  onClick={() => setSelectedId(article.id)}
                  className={`w-full text-left p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    isSelected ? "bg-blue-50/60 border-l-2 border-l-slate-900" : "border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isSelected ? "text-slate-900 font-semibold" : "text-slate-700"}`}>
                        {article.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{article.siteName}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{article.wordCount} words</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400">No articles found</p>
              </div>
            )}
          </div>
        </div>

        {/* Center: Editor */}
        <div className="lg:col-span-6 card bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          {selected ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>
                    {statusConfig[selected.status].label}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{selected.siteName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <input
                  type="text"
                  defaultValue={selected.title}
                  className="w-full text-xl font-bold text-slate-900 border-none focus:outline-none focus:ring-0 bg-transparent"
                />
                <textarea
                  defaultValue={selected.excerpt}
                  rows={2}
                  className="w-full text-sm text-slate-500 border-none focus:outline-none focus:ring-0 bg-transparent resize-none italic"
                />
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selected.body}</p>
                </div>

                {/* Content Lifecycle Tracker (Simplified) */}
                <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-900">Publishing Progress</h4>
                    <span className="text-xs font-semibold text-blue-600">{selected.lifecycle.progress}% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${selected.lifecycle.progress}%` }} />
                  </div>
                  <div className="space-y-2">
                    {selected.lifecycle.history.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-600">{h.note}</span>
                        <span className="text-slate-400 ml-auto">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                    {selected.status === "pending_review" && (
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Awaiting review...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                {selected.status === "pending_review" && (
                  <>
                    <button onClick={handleApprove} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => setShowChangesModal(true)} className="px-4 py-2 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                      <MessageSquare className="w-4 h-4" /> Request Changes
                    </button>
                  </>
                )}
                {selected.status === "needs_changes" && (
                  <>
                    <button onClick={handleApprove} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                      <Check className="w-4 h-4" /> Approve After Changes
                    </button>
                    <span className="text-xs text-amber-600 font-medium ml-2">Author has been notified</span>
                  </>
                )}
                {selected.status === "approved" && (
                  <>
                    <button onClick={() => setShowScheduleModal(true)} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                      <Calendar className="w-4 h-4" /> Schedule
                    </button>
                    <button onClick={() => setShowPublishModal(true)} className="px-4 py-2 bg-white border border-green-200 text-green-700 hover:bg-green-50 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                      Publish Now
                    </button>
                    <button onClick={() => setShowSocialModal(true)} className="px-4 py-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                      <Facebook className="w-4 h-4" /> Edit Teasers
                    </button>
                    <button onClick={handleReplaceImage} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                      <ImageIcon className="w-4 h-4" /> Replace Image
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Select an article to review</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Metadata Panel */}
        <div className="lg:col-span-3 card bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Article Details</p>
          </div>
          {selected ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Review Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-900">Review Checklist</h4>
                  <span className="text-xs text-slate-500 font-medium">{completedChecks}/{checklistItems.length}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${checklistProgress}%` }} />
                </div>
                <div className="space-y-2">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleChecklist(item.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          checklist[item.id] || item.checked ? "bg-green-500 border-green-500" : "border-slate-300"
                        }`}
                      >
                        {checklist[item.id] || item.checked ? <Check className="w-3 h-3 text-white" /> : null}
                      </button>
                      <span className={`text-xs ${checklist[item.id] || item.checked ? "text-slate-500 line-through" : "text-slate-700"}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-900">Featured Image</h4>
                  <button onClick={handleReplaceImage} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Replace
                  </button>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={selected.featuredImage} alt="Featured image" className="w-full h-32 object-cover" />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
                  <span className="font-bold text-slate-400 block uppercase tracking-tight text-[9px]">Image Context</span>
                  <p className="italic font-sans leading-tight text-slate-700">"{currentPromptTemplate.template.replace("{{subject}}", selected.category)}"</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Category</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm text-slate-700 font-medium">{selected.category}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block">Author</label>
                    <span className="text-xs text-slate-700 font-medium">{selected.author}</span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium block">Length</label>
                    <span className="text-xs text-slate-700 font-medium">{selected.wordCount} words</span>
                  </div>
                </div>
              </div>

              {/* Editorial Notes */}
              <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100">
                <h4 className="text-xs font-bold text-blue-800 mb-2">Editorial Notes</h4>
                <ul className="space-y-1.5">
                  <li className="text-[11px] text-blue-800">
                    Consider adding a subheading for better readability.
                  </li>
                  <li className="text-[11px] text-blue-800">
                    Featured image meets {selected.category} standards.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <p className="text-sm text-slate-400">Select an article to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals (All Restored with Clean Language) */}
      {/* Schedule Modal */}
      {showScheduleModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Schedule Article</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Date</label>
                <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full mt-1 p-2 border border-slate-200 rounded-md text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Time</label>
                <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full mt-1 p-2 border border-slate-200 rounded-md text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Publish to</label>
                <p className="text-sm text-slate-500 mt-1 font-medium">{selected.siteName}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={() => setShowScheduleModal(false)} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Cancel</button>
              <button onClick={handleSchedule} disabled={!scheduleDate} className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium disabled:opacity-50">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showChangesModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Request Changes</h3>
            <p className="text-sm text-slate-500 mb-3">
              Article: <span className="text-slate-700 font-semibold">{selected.title}</span>
            </p>
            <textarea
              value={changesNote}
              onChange={(e) => setChangesNote(e.target.value)}
              placeholder="Describe the changes needed..."
              rows={4}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setShowChangesModal(false)} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Cancel</button>
              <button onClick={handleRequestChanges} disabled={!changesNote.trim()} className="px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100/70 rounded-md text-sm font-medium disabled:opacity-50">
                Request Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Replacement Modal */}
      {showImageModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Replace Featured Image</h3>
                <p className="text-xs text-slate-400 mt-0.5">Category: {selected.category}</p>
              </div>
              <button onClick={() => setShowImageModal(false)} className="p-1.5 hover:bg-slate-100 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 mb-4 w-fit">
              <button
                onClick={() => setImageTab("free")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${imageTab === "free" ? "bg-white shadow-xs text-slate-900" : "text-slate-500"}`}
              >
                Free Stock Images
              </button>
              <button
                onClick={() => setImageTab("ai")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${imageTab === "ai" ? "bg-white shadow-xs text-slate-900" : "text-slate-500"}`}
              >
                Generate Image
              </button>
            </div>
            {imageTab === "free" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {freeStockImages.slice(0, 9).map((img) => (
                    <button
                      key={img.id}
                      onClick={() => handleSelectReplacementImage(img.url)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all group ${
                        selectedReplacementImage === img.url ? "border-slate-900 ring-2 ring-slate-900/10" : "border-transparent"
                      }`}
                    >
                      <img src={img.thumbnail || img.url} alt={img.title} className="w-full h-24 object-cover" />
                      {selectedReplacementImage === img.url && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {imageTab === "ai" && (
              <div className="space-y-4">
                {isGeneratingImage ? (
                  <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Loader2 className="w-8 h-8 text-slate-800 animate-spin mb-3" />
                    <p className="text-xs font-semibold text-slate-600">Generating images...</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm text-center italic">"{currentPromptTemplate.template.replace("{{subject}}", selected.category)}"</p>
                  </div>
                ) : generatedImages.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <Wand2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-slate-700">Generate Custom Image</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Create a custom image for this article.</p>
                    <button
                      onClick={handleGenerateAIImagesInReview}
                      className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium flex items-center gap-2 mx-auto transition-colors"
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Generate
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {generatedImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => handleSelectReplacementImage(img.url)}
                          className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                            selectedReplacementImage === img.url ? "border-slate-900" : "border-transparent"
                          }`}
                        >
                          <img src={img.thumbnail || img.url} alt="Generated image" className="w-full h-28 object-cover" />
                          {selectedReplacementImage === img.url && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleGenerateAIImagesInReview}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 w-full rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Generate More
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
              <button onClick={() => setShowImageModal(false)} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Cancel</button>
              <button
                onClick={handleConfirmImageReplace}
                disabled={!selectedReplacementImage}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" /> Replace Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Teaser Modal */}
      {showSocialModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Edit Social Media Teasers</h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize posts for each platform</p>
              </div>
              <button onClick={() => setShowSocialModal(false)} className="p-1.5 hover:bg-slate-100 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-600 border border-slate-100">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Article</span>
                {selected.title}
              </div>
              <div className="space-y-3">
                {socialTeaserTemplates.slice(0, 3).map((tmpl) => (
                  <div key={tmpl.id} className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 capitalize flex items-center gap-1">
                        {tmpl.platform === "facebook" && <Facebook className="w-3.5 h-3.5 text-blue-600" />}
                        {tmpl.platform === "instagram" && <Instagram className="w-3.5 h-3.5 text-pink-600" />}
                        {tmpl.platform === "twitter" && <Twitter className="w-3.5 h-3.5 text-sky-500" />}
                        {tmpl.platform === "linkedin" && <Linkedin className="w-3.5 h-3.5 text-blue-800" />}
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Max: {tmpl.maxLength} chars</span>
                    </div>
                    <textarea
                      defaultValue={
                        tmpl.platform === "twitter"
                          ? `${selected.title} — Live on ${selected.siteName.toLowerCase().replace(/\s/g, "")}.is/feed`
                          : `${selected.title}\n\n${selected.excerpt.slice(0, 100)}...\n\n#arctic #nordic #${selected.category.toLowerCase()}`
                      }
                      rows={2}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono bg-slate-50 focus:bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button onClick={() => setShowSocialModal(false)} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Cancel</button>
              <button
                onClick={() => { setShowSocialModal(false); setShowSuccess("Social teasers updated"); setTimeout(() => setShowSuccess(null), 3000); }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Now Modal */}
      {showPublishModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Publish Now</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              This will publish <span className="text-slate-700 font-semibold">{selected.title}</span> immediately to <span className="font-semibold text-slate-800">{selected.siteName}</span>.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowPublishModal(false)} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Cancel</button>
              <button onClick={handlePublishNow} className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors">
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
