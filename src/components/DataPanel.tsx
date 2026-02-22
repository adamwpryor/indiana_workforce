import { InstitutionSchema, EmployerSchema } from '@/types';
import { Building2, GraduationCap, Filter, Search } from 'lucide-react';
import { parseIndustries, getSectorColorMapping } from '@/lib/colorUtils';

interface DataPanelProps {
    institutions: InstitutionSchema[];
    employers: EmployerSchema[];
    activeFilters: Set<string>;
    onFilterToggle: (filter: string) => void;
    onClearFilters: () => void;
    selectedNodeId: string | null;
    onNodeSelect: (id: string | null) => void;
}

export default function DataPanel({ institutions, employers, activeFilters, onFilterToggle, onClearFilters, selectedNodeId, onNodeSelect }: DataPanelProps) {
    const totalStudents = institutions.reduce((acc, inst) => acc + (inst.studentDemographics?.totalStudents || 0), 0);

    // Extract unique sectors
    const allSectors = Array.from(new Set(employers.flatMap(e => parseIndustries(e.industry)))).sort();
    const sectorColors = getSectorColorMapping(allSectors);

    // Filter institutions to unique types
    const institutionTypes = Array.from(new Set(institutions.map(i => i.type))).sort();

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto p-5 bg-slate-100 border-r border-slate-200">
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Statewide Overview</h2>
                <p className="text-sm text-slate-500">Indiana Labor & Education Metrics</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <GraduationCap className="text-blue-500 mb-2 h-6 w-6" />
                    <div className="text-2xl font-bold text-blue-900">{(totalStudents / 1000).toFixed(0)}k+</div>
                    <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Students</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <Building2 className="text-emerald-500 mb-2 h-6 w-6" />
                    <div className="text-2xl font-bold text-emerald-900">{employers.length} Top</div>
                    <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Employers</div>
                </div>
            </div>

            <div className="mt-2 bg-white rounded-lg p-3 border border-slate-200 shadow-sm relative">
                <label htmlFor="nodeSearch" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5" /> Find Entity in Graph
                </label>
                <select
                    id="nodeSearch"
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1A5F7A] focus:ring-[#1A5F7A] text-slate-700 sm:text-sm p-2 border bg-white"
                    value={selectedNodeId || ''}
                    onChange={(e) => onNodeSelect(e.target.value || null)}
                >
                    <option value="">-- Select to Navigate --</option>
                    <optgroup label="Institutions">
                        {institutions.map(n => (
                            <option key={n.id} value={n.id}>{n.name}</option>
                        ))}
                    </optgroup>
                    <optgroup label="Employers">
                        {employers.map(n => (
                            <option key={n.id} value={n.id}>{n.name}</option>
                        ))}
                    </optgroup>
                </select>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Key Hiring Sectors</h3>
                    {activeFilters.size > 0 ? (
                        <button
                            onClick={onClearFilters}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                        >
                            Clear Filters
                        </button>
                    ) : (
                        <Filter className="h-3 w-3 text-slate-400" />
                    )}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {allSectors.map(sector => {
                        const isActive = activeFilters.has(sector);
                        const color = sectorColors[sector];

                        return (
                            <button
                                key={sector}
                                onClick={() => onFilterToggle(sector)}
                                className={`w-full flex items-center justify-between p-1.5 -mx-1.5 rounded-md hover:bg-slate-200 transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
                                <div className="flex items-center gap-2">
                                    <span style={{ backgroundColor: color }} className="w-2.5 h-2.5 rounded-full inline-block"></span>
                                    <span className={`text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{sector}</span>
                                </div>
                                {isActive && <span className="text-xs text-blue-600 font-semibold">Active</span>}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Institution Nodes</h3>
                    <Filter className="h-3 w-3 text-slate-400" />
                </div>
                <ul className="space-y-1">
                    {institutionTypes.map(type => {
                        const isActive = activeFilters.has(type);
                        const count = institutions.filter(i => i.type === type).length;
                        return (
                            <li key={type}>
                                <button
                                    onClick={() => onFilterToggle(type)}
                                    className={`w-full text-left text-sm flex justify-between px-2 py-1.5 rounded border ${isActive ? 'bg-blue-50 border-blue-200 text-blue-800 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                    <span className="truncate pr-2">{type}</span>
                                    <span className="text-slate-400 text-xs px-1.5 py-0.5 bg-slate-100 rounded-full">{count}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}
