"use client";

import React from "react";
import { socialTeaserTemplates, articles } from "@/lib/mock-data";

export default function SocialTeasersPage() {
  const publishedArticles = articles.filter(a => a.status === "published").slice(0, 3);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Social Distribution Templates</h1>
        <p className="text-slate-500">Preview automated distribution formats for live content networks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Configs */}
        <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-xl shadow-sm h-fit space-y-4">
          <h2 className="font-medium text-slate-800 border-b pb-2">Active Multi-Channel Rules</h2>
          {socialTeaserTemplates.map((tmpl) => (
            <div key={tmpl.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs">
              <div className="flex justify-between font-semibold text-slate-700 capitalize">
                <span>{tmpl.platform}</span>
                <span className="text-slate-400 text-[10px] font-normal">{tmpl.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] font-mono truncate">{tmpl.template}</p>
            </div>
          ))}
        </div>

        {/* Live Content Engine Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-medium text-slate-800 px-1">Inline Generator Sandbox</h2>
          {publishedArticles.map((art) => (
            <div key={art.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">{art.siteName}</span>
              <h3 className="font-semibold text-slate-800 text-sm">{art.title}</h3>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Twitter Teaser</span>
                  <p className="text-xs text-slate-600 mt-1 font-sans">{art.title} — Live updates via {art.siteName.toLowerCase().replace(" ", "")}.is/feed</p>
                </div>
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">LinkedIn Professional</span>
                  <p className="text-xs text-slate-600 mt-1 font-sans">Insights on {art.category}: {art.excerpt.slice(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
