"use client";

import { useState, useMemo } from 'react';
import DataPanel from '@/components/DataPanel';
import AIReasoningPane from '@/components/AIReasoningPane';
import NetworkGraph from '@/components/NetworkGraph';
import { mockInstitutions, mockEmployers, mockIntermediaries } from '@/data/mock';
import { generateMatches } from '@/lib/InsightEngine';
import { NetworkGraphData } from '@/types';

export default function Dashboard() {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Generate matches using our AI logic
  const matches = useMemo(() => {
    return generateMatches(mockInstitutions, mockEmployers, mockIntermediaries);
  }, []);

  // Assemble Graph Data from the schemas and matches
  const graphData = useMemo<NetworkGraphData>(() => {
    const nodes = [
      ...mockInstitutions.map(i => ({ id: i.id, name: i.name, group: 'institution' as const, val: 5 })),
      ...mockEmployers.map(e => ({ id: e.id, name: e.name, group: 'employer' as const, val: 4 })),
      ...mockIntermediaries.map(i => ({ id: i.id, name: i.name, group: 'intermediary' as const, val: 3 }))
    ];

    const links = matches.map(m => ({
      source: m.sourceId,
      target: m.targetId,
      value: m.matchStrengthScore
    }));

    // Add some random static intermediary links for initial visual depth
    if (matches.length > 0) {
      links.push({ source: mockInstitutions[0].id, target: mockIntermediaries[0].id, value: 50 });
      links.push({ source: mockEmployers[1].id, target: mockIntermediaries[1].id, value: 60 });
      links.push({ source: mockInstitutions[1].id, target: mockIntermediaries[0].id, value: 70 });
    }

    return { nodes, links };
  }, [matches]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Left Panel - Data Summary */}
      <div className="w-1/4 h-full relative z-10 shadow-lg">
        <DataPanel institutions={mockInstitutions} employers={mockEmployers} />
      </div>

      {/* Center Stage - Visualization */}
      <div className="w-1/2 h-full p-6 relative z-0 flex flex-col border-x border-slate-200 bg-slate-100/50">
        <div className="mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F2C52] tracking-tight">AI Partner-Matching Engine</h1>
            <p className="text-slate-500 mt-1 font-medium">Demonstrating AI Discernment for Workforce Readiness</p>
          </div>
          <div className="w-64">
            <label htmlFor="nodeSearch" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Find Entity in Graph</label>
            <select
              id="nodeSearch"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1A5F7A] focus:ring-[#1A5F7A] text-slate-700 sm:text-sm p-2.5 border bg-white"
              value={selectedNode?.id || ''}
              onChange={(e) => {
                const id = e.target.value;
                if (!id) {
                  setSelectedNode(null);
                  return;
                }
                const node = graphData.nodes.find(n => n.id === id);
                if (node) setSelectedNode(node);
              }}
            >
              <option value="">-- Select to Navigate --</option>
              <optgroup label="Institutions">
                {graphData.nodes.filter(n => n.group === 'institution').map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </optgroup>
              <optgroup label="Employers & Intermediaries">
                {graphData.nodes.filter(n => n.group !== 'institution').map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
        <div className="flex-grow shadow-md rounded-lg overflow-hidden border border-slate-300">
          <NetworkGraph
            data={graphData}
            onNodeClick={(node) => setSelectedNode(node)}
            selectedNodeId={selectedNode?.id}
          />
        </div>
      </div>

      {/* Right Panel - AI Reasoning */}
      <div className="w-1/4 h-full relative z-10 shadow-lg">
        <AIReasoningPane
          selectedNode={selectedNode}
          matches={matches}
          institutions={mockInstitutions}
          employers={mockEmployers}
        />
      </div>
    </div>
  );
}
