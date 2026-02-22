import { MatchSchema, InstitutionSchema, EmployerSchema } from '@/types';
import { BrainCircuit, Sparkles, MapPin, Target } from 'lucide-react';

interface AIReasoningPaneProps {
    selectedNode: any | null;
    matches: MatchSchema[];
    institutions: InstitutionSchema[];
    employers: EmployerSchema[];
}

export default function AIReasoningPane({ selectedNode, matches, institutions, employers }: AIReasoningPaneProps) {
    if (!selectedNode) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-white border-l border-slate-200">
                <BrainCircuit className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-sm">Select an institution or employer node on the network graph to view AI match reasoning.</p>
            </div>
        );
    }

    // Find matches involving this node
    const nodeMatches = matches.filter(
        m => m.sourceId === selectedNode.id || m.targetId === selectedNode.id
    ).sort((a, b) => b.matchStrengthScore - a.matchStrengthScore);

    const getEntityName = (id: string) => {
        const inst = institutions.find(i => i.id === id);
        const emp = employers.find(e => e.id === id);
        return inst ? inst.name : (emp ? emp.name : id);
    };

    return (
        <div className="h-full overflow-y-auto p-6 bg-white border-l border-slate-200">
            <div className="mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`w-3 h-3 rounded-full ${selectedNode.group === 'institution' ? 'bg-[#0F2C52]' : selectedNode.group === 'employer' ? 'bg-[#1A5F7A]' : 'bg-[#E48F45]'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{selectedNode.group} selected</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 leading-tight">{selectedNode.name}</h2>
            </div>

            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#E48F45]" />
                AI Pathway Recommendations
            </h3>

            {nodeMatches.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No significant pathways detected for this entity currently.</p>
            ) : (
                <div className="space-y-6">
                    {nodeMatches.map(match => {
                        const isSource = match.sourceId === selectedNode.id;
                        const targetName = getEntityName(isSource ? match.targetId : match.sourceId);

                        return (
                            <div key={match.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#0F2C52]"></div>

                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-semibold text-slate-800">
                                        Pathway with <span className="text-[#0F2C52]">{targetName}</span>
                                    </div>
                                    <div className="bg-slate-200 text-[#0F2C52] text-xs font-bold px-2 py-1 rounded">
                                        Score: {match.matchStrengthScore}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-300 pl-3">
                                        "{match.aiReasoning}"
                                    </p>
                                </div>

                                {match.recommendedPathway && (
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                                        <Target className="h-3 w-3 text-[#1A5F7A]" />
                                        Recommended Action: <span className="text-slate-800">{match.recommendedPathway}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
