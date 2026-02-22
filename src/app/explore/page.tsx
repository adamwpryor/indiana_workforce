"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, GitMerge, Building2, GraduationCap, BrainCircuit, Search, Network, Activity } from 'lucide-react';
import { mockInstitutions, mockEmployers } from '@/data/mock';
import { generateMatches } from '@/lib/InsightEngine';
import { InstitutionSchema, EmployerSchema } from '@/types';

export default function Explore() {
    const [instId, setInstId] = useState<string>('');
    const [empId, setEmpId] = useState<string>('');
    const [instSearch, setInstSearch] = useState<string>('');
    const [empSearch, setEmpSearch] = useState<string>('');

    const filteredInsts = mockInstitutions.filter(i => i.name.toLowerCase().includes(instSearch.toLowerCase()) || i.region.toLowerCase().includes(instSearch.toLowerCase()));
    const filteredEmps = mockEmployers.filter(e => e.name.toLowerCase().includes(empSearch.toLowerCase()) || e.industry.toLowerCase().includes(empSearch.toLowerCase()));

    const selectedInst = mockInstitutions.find(i => i.id === instId);
    const selectedEmp = mockEmployers.find(e => e.id === empId);

    const match = useMemo(() => {
        if (!selectedInst || !selectedEmp) return null;
        return generateMatches([selectedInst], [selectedEmp])[0];
    }, [selectedInst, selectedEmp]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12 selection:bg-blue-100 selection:text-blue-900">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-2">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4 text-sm transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Intro
                        </Link>
                        <h1 className="text-3xl font-extrabold text-[#0F2C52] tracking-tight">Imagine a Connection</h1>
                        <p className="text-slate-500 mt-1 font-medium">Bespoke AI Insight Engine Sandbox</p>
                    </div>
                    <Link href="/dashboard" className="px-6 py-3 bg-[#0F2C52] hover:bg-blue-900 text-white rounded-lg font-bold shadow-md transition-all flex items-center gap-2">
                        <Network className="w-4 h-4" /> Go to Ecosystem Map
                    </Link>
                </div>

                {/* Selectors */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
                        <label className="block text-sm font-semibold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0">
                            <GraduationCap className="text-blue-500 w-5 h-5" /> Select Institution
                        </label>
                        <div className="relative mb-3 shrink-0">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or region..."
                                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg pl-10 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                                value={instSearch}
                                onChange={(e) => setInstSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="w-full flex-grow bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none overflow-y-auto"
                            value={instId}
                            onChange={(e) => setInstId(e.target.value)}
                            size={6}
                        >
                            {filteredInsts.map(inst => (
                                <option key={inst.id} value={inst.id} className="p-2 border-b border-slate-100 last:border-0 hover:bg-slate-200 cursor-pointer">
                                    {inst.name} ({inst.region})
                                </option>
                            ))}
                            {filteredInsts.length === 0 && (
                                <option disabled className="p-2 text-slate-400 italic">No institutions found.</option>
                            )}
                        </select>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
                        <label className="block text-sm font-semibold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0">
                            <Building2 className="text-emerald-500 w-5 h-5" /> Select Employer
                        </label>
                        <div className="relative mb-3 shrink-0">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or industry..."
                                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg pl-10 p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none"
                                value={empSearch}
                                onChange={(e) => setEmpSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="w-full flex-grow bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none overflow-y-auto"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            size={6}
                        >
                            {filteredEmps.map(emp => (
                                <option key={emp.id} value={emp.id} className="p-2 border-b border-slate-100 last:border-0 hover:bg-slate-200 cursor-pointer">
                                    {emp.name} ({emp.industry})
                                </option>
                            ))}
                            {filteredEmps.length === 0 && (
                                <option disabled className="p-2 text-slate-400 italic">No employers found.</option>
                            )}
                        </select>
                    </div>
                </div>

                {/* Results */}
                {match && selectedInst && selectedEmp ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 text-white">
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-blue-300">{selectedInst.name}</h2>
                                <div className="text-slate-400 text-sm mt-1">{selectedInst.type}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-inner relative z-10">
                                    <span className="text-2xl font-black text-white">{match.matchStrengthScore}</span>
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Insight Score</div>
                            </div>
                            <div className="flex-1 text-center md:text-right">
                                <h2 className="text-2xl font-bold text-emerald-300">{selectedEmp.name}</h2>
                                <div className="text-slate-400 text-sm mt-1">{selectedEmp.industry} Sector</div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

                            {/* Left Col: Breakdown */}
                            <div className="p-8 bg-slate-50">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-500" /> Deterministic Math
                                </h3>
                                <div className="space-y-4">
                                    {match.scoreBreakdown?.map((b, i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                                            <span className="text-sm font-medium text-slate-600 pr-4 leading-tight">{b.category}</span>
                                            <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded shadow-sm">+{b.score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Middle & Right Col: AI Narrative & Pathway */}
                            <div className="p-8 lg:col-span-2">
                                <div className="mb-10">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <BrainCircuit className="w-5 h-5 text-purple-500" /> Generative AI Reasoning
                                    </h3>
                                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 text-purple-900 leading-relaxed font-medium">
                                        {match.aiReasoning.split('\n').map((line, idx) => {
                                            if (!line.trim()) return null;
                                            if (line.trim().startsWith('### ')) {
                                                return <h4 key={idx} className="text-lg font-bold text-[#0F2C52] mt-6 mb-2 first:mt-0">{line.replace('### ', '')}</h4>;
                                            }
                                            return <p key={idx} className="mb-3 last:mb-0">{line}</p>;
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <GitMerge className="w-5 h-5 text-emerald-500" /> Recommended Pathway
                                    </h3>
                                    <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                                        <p className="text-emerald-900 font-bold text-lg mb-2">
                                            {match.recommendedPathway?.split(':')[0]}
                                        </p>
                                        <p className="text-emerald-700 leading-relaxed">
                                            {match.recommendedPathway?.split(':')[1]?.trim()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-slate-300 rounded-2xl bg-slate-100/50">
                        <Search className="w-12 h-12 text-slate-400 mb-4" />
                        <h3 className="text-xl font-bold text-slate-600 mb-2">Awaiting Selection</h3>
                        <p className="text-slate-500 max-w-md">
                            Select one institution and one employer from the dropdowns above to calculate their deterministic alignment score and generate a bespoke pathway.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
