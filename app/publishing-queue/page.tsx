"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GripVertical, Clock, CheckCircle2, AlertCircle, Calendar,
  Globe, FileText, ChevronRight, Filter, Search, MoreHorizontal,
  ArrowRight, Eye, Edit3, Trash2, Send, MessageSquare,
} from "lucide-react";
import { articles, sites } from "@/lib/mock-data";

const stages = [
  { id: "draft", label: "Draft", color: "bg-slate-100", borderColor: "border-slate-200", textColor: "text-slate-600" },
  { id: "research", label: "Research", color: "bg-indigo-50", borderColor: "border-indigo-200", textColor: "text-indigo-700" },
  { id: "pending_review", label: "Review", color: "bg-amber-50", borderColor: "border-amber-200", textColor: "text-amber-700" },
  { id: "approved", label: "Approved", color: "bg-green-50", borderColor: "border-green-200", textColor: "text-green-700" },
  { id: "scheduled", label: "Scheduled", color: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-700" },
  { id: "published", label: "Published", color: "bg-purple-50", borderColor: "border-purple-200", textColor: "text-purple-700" },
];

export default function PublishingQueuePage() {
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);

  const filtered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesSite = siteFilter === "all" || a.siteId === siteFilter;
    return matchesSearch && matchesSite;
  });

  const getStageArticles = (stageId: string) => {
    return filtered.filter(a => a.status === stageId);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Publishing Queue</h1>
          <p className="text-slate-500 text-sm mt-1">Visual content pipeline across all sites</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-arctic-ice/50 w-64"
            />
          </div>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageArticles = getStageArticles(stage.id);
          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div className={`p-3 rounded-t-lg border-t-2 ${stage.borderColor} ${stage.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${stage.textColor}`}>{stage.label}</h3>
                  <span className="text-xs text-slate-500 bg-white/80 px-2 py-0.5 rounded-full">
                    {stageArticles.length}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50/50 border border-t-0 border-slate-200 rounded-b-lg p-3 space-y-3 min-h-[400px]">
                {stageArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-3 h-3 text-slate-300 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{article.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-slate-500">{article.siteName}</span>
                          <span className="text-[10px] text-slate-400">{article.wordCount} words</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {article.scheduledAt && (
                            <span className="text-[10px] flex items-center gap-1 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              <Calendar className="w-3 h-3" />
                              {new Date(article.scheduledAt).toLocaleDateString()}
                            </span>
                          )}
                          {article.status === "published" && article.views && article.views > 0 && (
                            <span className="text-[10px] flex items-center gap-1 text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                              <Eye className="w-3 h-3" />
                              {article.views.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {stageArticles.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400">No articles</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Article Details</h3>
              <button onClick={() => setSelectedArticle(null)} className="p-1.5 hover:bg-slate-100 rounded-md">
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{selectedArticle.title}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedArticle.siteName} · {selectedArticle.author}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-lg font-semibold text-slate-900">{selectedArticle.wordCount}</p>
                  <p className="text-[10px] text-slate-500">Words</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-lg font-semibold text-slate-900">{selectedArticle.lifecycle.progress}%</p>
                  <p className="text-[10px] text-slate-500">Progress</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-lg font-semibold text-slate-900">{selectedArticle.views?.toLocaleString() || "—"}</p>
                  <p className="text-[10px] text-slate-500">Views</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/review-queue`} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Edit3 className="w-4 h-4" /> Open in Review
                </Link>
                <Link href={`/social-teasers`} className="btn-secondary flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Social
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
