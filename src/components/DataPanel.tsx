import { InstitutionSchema, EmployerSchema } from '@/types';
import { Building2, GraduationCap } from 'lucide-react';

interface DataPanelProps {
    institutions: InstitutionSchema[];
    employers: EmployerSchema[];
}

export default function DataPanel({ institutions, employers }: DataPanelProps) {
    const totalStudents = institutions.reduce((acc, inst) => acc + inst.studentDemographics.totalStudents, 0);

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto p-4 bg-white border-r border-slate-200">
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
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">Key Hiring Sectors</h3>
                <div className="space-y-3">
                    {[
                        { name: 'Manufacturing', width: '72%' },
                        { name: 'Technology', width: '68%' },
                        { name: 'Pharmaceuticals', width: '55%' },
                        { name: 'Healthcare', width: '60%' }
                    ].map(sector => (
                        <div key={sector.name} className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 font-medium">{sector.name}</span>
                            <div className="h-2 flex-grow mx-4 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-slate-300 rounded-full"
                                    style={{ width: sector.width }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">Institution Nodes</h3>
                <ul className="space-y-2">
                    {institutions.map(inst => (
                        <li key={inst.id} className="text-sm text-slate-600 flex justify-between border-b border-slate-100 pb-2">
                            <span className="font-medium">{inst.name}</span>
                            <span className="text-slate-400">{inst.type}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
