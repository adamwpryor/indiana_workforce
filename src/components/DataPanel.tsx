import { InstitutionSchema, EmployerSchema } from '@/types';
import { Building2, GraduationCap, Filter } from 'lucide-react';

interface DataPanelProps {
    institutions: InstitutionSchema[];
    employers: EmployerSchema[];
    activeFilters: Set<string>;
    onFilterToggle: (filter: string) => void;
    onClearFilters: () => void;
}

export default function DataPanel({ institutions, employers, activeFilters, onFilterToggle, onClearFilters }: DataPanelProps) {
    const totalStudents = institutions.reduce((acc, inst) => acc + (inst.studentDemographics?.totalStudents || 0), 0);

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
                <div className="space-y-3">
                    {[
                        { name: 'Manufacturing', width: '72%' },
                        { name: 'Technology', width: '68%' },
                        { name: 'Pharmaceuticals', width: '55%' },
                        { name: 'Healthcare', width: '60%' }
                    ].map(sector => {
                        const isActive = activeFilters.has(sector.name);
                        return (
                            <button
                                key={sector.name}
                                onClick={() => onFilterToggle(sector.name)}
                                className={`w-full flex items-center justify-between p-1.5 -mx-1.5 rounded-md hover:bg-slate-200 transition-colors ${isActive ? 'bg-blue-100/50 ring-1 ring-blue-300' : ''}`}>
                                <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>{sector.name}</span>
                                <div className="h-2 flex-grow mx-4 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-colors ${isActive ? 'bg-blue-500' : 'bg-slate-400'}`}
                                        style={{ width: sector.width }}
                                    />
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Institution Nodes</h3>
                    <Filter className="h-3 w-3 text-slate-400" />
                </div>
                <ul className="space-y-1">
                    {/* Add unique types as active filters */}
                    {Array.from(new Set(institutions.map(i => i.type))).map(type => {
                        const isActive = activeFilters.has(type);
                        const count = institutions.filter(i => i.type === type).length;
                        return (
                            <li key={type}>
                                <button
                                    onClick={() => onFilterToggle(type)}
                                    className={`w-full text-left text-sm flex justify-between px-2 py-1.5 rounded border ${isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                    <span>{type}</span>
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
