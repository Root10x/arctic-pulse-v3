"use client";

import React, { useState } from "react";
// FIXED: Path changed from @/lib/mockdata to @/lib/mock-data to match Vercel's case-sensitive environment
import { imageSourceConfigs, aiGeneratedImages, freeStockImages } from "@/lib/mock-data";

export default function ImageSourcingPage() {
  const [activeTab, setActiveTab] = useState<"ai" | "stock">("ai");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Image Sourcing Engine</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage automated AI generation profiles and integrated stock photography networks.
        </p>
      </div>

      {/* Engine Configurations Status Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Media API Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {imageSourceConfigs.map((config) => (
            <div key={config.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm text-slate-800">{config.name}</h3>
                  <p className="text-xs text-slate-400 capitalize">{config.provider} • {config.type.replace("-", " ")}</p>
                </div>
                <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                  config.status === "active" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  {config.status}
                </span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-50 text-xs text-slate-600 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Daily Token Limit:</span>
                  <span className="font-mono font-medium text-slate-700">{config.dailyLimit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Used Today:</span>
                  <span className="font-mono font-medium text-slate-700">{config.usageToday}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-teal-600 h-full rounded-full" 
                    style={{ width: `${(config.usageToday / config.dailyLimit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Asset Pools */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Pool Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4">
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "ai" 
                ? "border-teal-600 text-teal-600" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            AI Generation Sandbox ({aiGeneratedImages.length})
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "stock" 
                ? "border-teal-600 text-teal-600" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Free Stock Asset Pool ({freeStockImages.length})
          </button>
        </div>

        {/* Gallery Dynamic Content */}
        <div className="p-6">
          {activeTab === "ai" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {aiGeneratedImages.map((img) => (
                <div key={img.id} className="group border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col justify-between">
                  <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                    <img 
                      src={img.thumbnail} 
                      alt={img.articleTopic} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 bg-white space-y-1.5 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-teal-50 border border-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-medium">
                        Context Match
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800 mt-1.5 line-clamp-1">{img.articleTopic}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 italic line-clamp-2 mt-1 bg-slate-50 p-1.5 border border-slate-100 rounded">
                      "{img.prompt}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {freeStockImages.map((img) => (
                <div key={img.id} className="group border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col justify-between">
                  <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                    <img 
                      src={img.thumbnail} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 bg-white flex flex-col justify-between">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{img.title}</h4>
                    <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                      <span>Source: <strong className="text-slate-600">{img.credit}</strong></span>
                      <span className="uppercase font-mono bg-slate-100 px-1 rounded">Stock</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
