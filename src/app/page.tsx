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
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) newFilters.delete(filter);
      else newFilters.add(filter);
      return newFilters;
    });
    // Clear selection if it doesn't match new filters to avoid zombie isolated nodes
    setSelectedNode(null);
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
    setSelectedNode(null);
  };

  // Generate matches using our AI logic
  const matches = useMemo(() => {
    return generateMatches(mockInstitutions, mockEmployers, mockIntermediaries);
  }, []);

  // Assemble Graph Data from the schemas and matches
  const graphData = useMemo<NetworkGraphData>(() => {
    const allNodes = [
      ...mockInstitutions.map(i => ({ id: i.id, name: i.name, group: 'institution' as const, val: 5, subType: i.type })),
      ...mockEmployers.map(e => ({ id: e.id, name: e.name, group: 'employer' as const, val: 4, subType: e.industry })),
      ...mockIntermediaries.map(i => ({ id: i.id, name: i.name, group: 'intermediary' as const, val: 3, subType: i.focusArea }))
    ];

    const nodes = allNodes.filter(n => {
      if (activeFilters.size === 0) return true;
      // Allow passing through if filter matches specific sector, or we can just filter out employers/institutions
      return activeFilters.has(n.subType || '');
    });

    const validNodeIds = new Set(nodes.map(n => n.id));

    const generatedLinks = matches.map(m => ({
      source: m.sourceId,
      target: m.targetId,
      value: m.matchStrengthScore
    }));

    // Add some random static intermediary links for initial visual depth
    if (matches.length > 0) {
      generatedLinks.push({ source: mockInstitutions[0].id, target: mockIntermediaries[0].id, value: 50 });
      generatedLinks.push({ source: mockEmployers[1].id, target: mockIntermediaries[1].id, value: 60 });
      generatedLinks.push({ source: mockInstitutions[1].id, target: mockIntermediaries[0].id, value: 70 });
    }

    // Filter ALL links to ensure they only connect existing valid nodes
    const validLinks = generatedLinks.filter(l =>
      validNodeIds.has(typeof l.source === 'object' ? (l.source as any).id : l.source as string) &&
      validNodeIds.has(typeof l.target === 'object' ? (l.target as any).id : l.target as string)
    );

    return { nodes, links: validLinks };
  }, [matches, activeFilters]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Left Panel - Data Summary */}
      <div className="w-1/4 h-full relative z-10 shadow-lg">
        <DataPanel
          institutions={mockInstitutions}
          employers={mockEmployers}
          activeFilters={activeFilters}
          onFilterToggle={toggleFilter}
          onClearFilters={clearFilters}
        />
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
