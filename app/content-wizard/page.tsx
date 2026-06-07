"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight, ChevronLeft, FileText, Globe, Calendar, Image as ImageIcon,
  MessageSquare, Check, Sparkles, Loader2, Clock, Send, Eye, Search
} from "lucide-react";
import { sites, freeStockImages, aiGeneratedImages } from "@/lib/mock-data";
import { SocialTeaserPreview } from "@/components/social-teaser";

const steps = [
  { id: "topic", label: "Topic", icon: FileText },
  { id: "target", label: "Target Site", icon: Globe },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "image", label: "Image Pool", icon: ImageIcon },
  { id: "social", label: "Social Teasers", icon: MessageSquare },
  { id: "preview", label: "Final Preview", icon: Eye },
];

export default function ContentWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [targetSite, setTargetSite] = useState("gl");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("09:00");
  
  // Media Sourcing Integration States
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [mediaTab, setMediaTab] = useState<"ai" | "stock">("ai");
  const [mediaSearch, setMediaSearch] = useState("");

  const [socialEnabled, setSocialEnabled] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<any>(null);

  // Filter media pools interactively based on keyword search input
  const filteredAiImages = aiGeneratedImages.filter(img => 
    img.articleTopic.toLowerCase().includes(mediaSearch.toLowerCase()) ||
    img.prompt.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  const filteredStockImages = freeStockImages.filter(img => 
    img.title.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDraft({
        title: topic ? `${topic}: Arctic Council Discusses New Shipping Regulations` : "Arctic Shipping Regulations: New Safety Protocols",
        excerpt: "The Arctic Council convenes this week in Tromsø to discuss new shipping regulations as ice melt opens northern passages...",
        body: "The Arctic Council convenes this week in Tromsø to discuss new shipping regulations as ice melt opens northern passages. Delegates from all eight member states will review environmental protocols and safety standards for vessels navigating increasingly accessible Arctic waters.\n\nThe proposed regulations address ice-class certification requirements, mandatory satellite tracking for all commercial vessels, and updated environmental protection measures.",
        category: "Policy",
        tags: ["arctic council", "shipping", "tromsø"],
        wordCount: 1240,
      });
      setIsGenerating(false);
    }, 1800);
  };

  const handleSubmit = () => {
    router.push("/review-queue");
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "topic":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Article Topic or Headline</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Arctic Council Shipping Regulations Update"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Research Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add key points, angles, or source URLs..."
                rows={4}
                className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500 text-sm font-sans resize-none"
              />
            </div>
            <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-100">
              <p className="text-xs text-teal-800 leading-relaxed">
                The engine will reference this workspace state to assemble contextual records and match background visuals dynamically.
              </p>
            </div>
          </div>
        );

      case "target":
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 block">Target Website Network</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {sites.map((site) => (
                <button
                  type="button"
                  key={site.id}
                  onClick={() => setTargetSite(site.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    targetSite === site.id
                      ? "border-teal-600 bg-teal-50/20 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {site.logo}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${targetSite === site.id ? "text-teal-700" : "text-slate-900"}`}>
                        {site.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{site.url}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Publish Date</label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-teal-500 bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Publish Time</label>
                <input
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-teal-500 bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input type="checkbox" id="draft-review" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" defaultChecked />
              <label htmlFor="draft-review" className="text-xs text-slate-600 font-medium">Send to editorial review queue before final live sync</label>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            {/* Inline Sub-tabs selector controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
              <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-100 w-fit shrink-0">
                <button
                  type="button"
                  onClick={() => setMediaTab("ai")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    mediaTab === "ai" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500"
                  }`}
                >
                  AI Generated Sandbox
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab("stock")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    mediaTab === "stock" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Free Stock Pool
                </button>
              </div>

              {/* Inline Search Bar Filter */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search media pool..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg focus:outline-none focus:border-teal-500 text-xs text-slate-700"
                />
              </div>
            </div>

            {/* Dynamic Sourcing Grid rendering */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {mediaTab === "ai" ? (
                filteredAiImages.map((img) => {
                  const isSelected = selectedImageUrl === img.url;
                  return (
                    <button
                      type="button"
                      key={img.id}
                      onClick={() => setSelectedImageUrl(img.url)}
                      className={`relative rounded-xl overflow-hidden border-2 text-left bg-slate-50 group flex flex-col justify-between transition-all ${
                        isSelected ? "border-teal-600 ring-2 ring-teal-600/10" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img src={img.thumbnail} alt="" className="w-full h-28 object-cover" />
                      <div className="p-2 bg-white w-full border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{img.articleTopic}</p>
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">"{img.prompt}"</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center shadow">
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                filteredStockImages.map((img) => {
                  const isSelected = selectedImageUrl === img.url;
                  return (
                    <button
                      type="button"
                      key={img.id}
                      onClick={() => setSelectedImageUrl(img.url)}
                      className={`relative rounded-xl overflow-hidden border-2 text-left bg-slate-50 group flex flex-col justify-between transition-all ${
                        isSelected ? "border-teal-600 ring-2 ring-teal-600/10" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img src={img.thumbnail} alt="" className="w-full h-28 object-cover" />
                      <div className="p-2 bg-white w-full flex justify-between items-center border-t border-slate-100 text-[10px]">
                        <span className="font-semibold text-slate-800 truncate pr-2">{img.title}</span>
                        <span className="font-mono bg-slate-100 text-slate-500 px-1 rounded text-[9px] uppercase">{img.credit}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center shadow">
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="social-toggle"
                checked={socialEnabled}
                onChange={(e) => setSocialEnabled(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="social-toggle" className="text-xs text-slate-700 font-semibold">
                Auto-generate cross-network promotional teaser updates
              </label>
            </div>
            {socialEnabled && draft && (
              <SocialTeaserPreview
                articleTitle={draft.title}
                articleUrl={`https://${sites.find(s => s.id === targetSite)?.url || "example.gl"}/${draft.title.toLowerCase().replace(/\s+/g, "-")}`}
                featuredImage={selectedImageUrl || "https://picsum.photos/seed/aigen1/800/500"}
                excerpt={draft.excerpt}
              />
            )}
            {!draft && socialEnabled && (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium">Please generate an article draft first to review live network teasers.</p>
              </div>
            )}
          </div>
        );

      case "preview":
        return (
          <div className="space-y-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-7 h-7 text-teal-600 animate-spin mb-2" />
                <p className="text-xs text-slate-500 font-medium">Parsing data layers and synthesizing draft summary...</p>
              </div>
            ) : draft ? (
              <div className="space-y-4 text-left">
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-2">
                  <span className="px-2 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold rounded">
                    {draft.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{draft.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{draft.excerpt}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Pipeline</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{sites.find(s => s.id === targetSite)?.name || "Not selected"}</p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Scheduled Lock</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{publishDate ? `${publishDate} @ ${publishTime}` : "Immediate on approval"}</p>
                  </div>
                </div>

                {selectedImageUrl && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">Attached Canvas Asset</p>
                    <img src={selectedImageUrl} alt="Hero illustration preview" className="w-full h-36 object-cover rounded-lg border border-slate-100" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <button type="button" onClick={handleGenerate} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 mx-auto">
                  <Sparkles className="w-4 h-4" /> Synthesize and Preview Draft
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Content Creation Engine</h1>
        <p className="text-slate-500 text-sm mt-0.5">Automated staging layout pipeline wizard</p>
      </div>

      {/* Step Indicator Progress Hub */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-3 shadow-sm overflow-x-auto">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isPassed = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={step.id} className="flex items-center flex-1 min-w-[75px]">
              <div className={`flex flex-col items-center flex-1 ${isPassed || isCurrent ? "opacity-100" : "opacity-45"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                  isPassed ? "bg-emerald-600 text-white shadow-sm" :
                  isCurrent ? "bg-teal-600 text-white shadow-sm ring-4 ring-teal-50" :
                  "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                  {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[9px] font-bold text-slate-500 mt-1 truncate max-w-full">{step.label}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 mx-1" />}
            </div>
          );
        })}
      </div>

      {/* Step Content Wrapper */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">{steps[currentStep].label} Parameter Node</h2>
        {renderStep()}
      </div>

      {/* Footer Navigation Tray */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-3 py-1.5 text-xs font-semibold border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        
        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
            className="px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft}
            className="px-4 py-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Queue for Sync
          </button>
        )}
      </div>
    </div>
  );
}
