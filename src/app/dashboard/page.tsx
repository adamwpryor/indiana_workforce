"use client";

import { useState, useMemo } from 'react';
import DataPanel from '@/components/DataPanel';
import AIReasoningPane from '@/components/AIReasoningPane';
import NetworkGraph from '@/components/NetworkGraph';
import { mockInstitutions, mockEmployers } from '@/data/mock';
import { generateMatches } from '@/lib/InsightEngine';
import { NetworkGraphData } from '@/types';
import { INSTITUTION_COLORS, SECTOR_PALETTE, getSectorColorMapping, parseIndustries } from '@/lib/colorUtils';

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
    return generateMatches(mockInstitutions, mockEmployers);
  }, []);

  // Assemble Graph Data from the schemas and matches
  const graphData = useMemo<NetworkGraphData>(() => {
    const allSectors = Array.from(new Set(mockEmployers.flatMap(e => parseIndustries(e.industry)))).sort();
    const sectorColors = getSectorColorMapping(allSectors);
    const allInstTypes = Array.from(new Set(mockInstitutions.map(i => i.type)));

    const filterHasSectors = Array.from(activeFilters).some(f => allSectors.includes(f));
    const filterHasInstTypes = Array.from(activeFilters).some(f => allInstTypes.includes(f));

    const allNodes = [
      ...mockInstitutions.map(i => ({
        id: i.id, name: i.name, group: 'institution' as const, val: 5, subType: i.type,
        color: INSTITUTION_COLORS[i.type] || INSTITUTION_COLORS.DEFAULT
      })),
      ...mockEmployers.map(e => {
        const industries = parseIndustries(e.industry);
        // Predominant sector color with fallback logic
        let displayIndustry = industries[0]; // default to first
        if (activeFilters.size > 0) {
          const activeMatch = industries.find(ind => activeFilters.has(ind));
          if (activeMatch) displayIndustry = activeMatch;
        }
        return {
          id: e.id, name: e.name, group: 'employer' as const, val: 4, subType: e.industry,
          color: sectorColors[displayIndustry] || '#9ca3af'
        };
      })
    ];

    const nodes = allNodes.filter(n => {
      if (activeFilters.size === 0) return true;

      if (n.group === 'institution') {
        return filterHasInstTypes ? activeFilters.has(n.subType || '') : true;
      } else {
        const industries = parseIndustries(n.subType || '');
        return filterHasSectors ? industries.some(ind => activeFilters.has(ind)) : true;
      }
    });

    const validNodeIds = new Set(nodes.map(n => n.id));

    const generatedLinks = matches.map(m => ({
      source: m.sourceId,
      target: m.targetId,
      value: m.matchStrengthScore
    }));

    // Filter ALL links to ensure they only connect existing valid nodes
    const validLinks = generatedLinks.filter(l =>
      validNodeIds.has(typeof l.source === 'object' ? (l.source as any).id : l.source as string) &&
      validNodeIds.has(typeof l.target === 'object' ? (l.target as any).id : l.target as string)
    );

    return { nodes, links: validLinks };
  }, [matches, activeFilters]);

  const filteredMatches = useMemo(() => {
    const validNodeIds = new Set(graphData.nodes.map(n => n.id));
    return matches.filter(m => validNodeIds.has(m.sourceId) && validNodeIds.has(m.targetId));
  }, [matches, graphData]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-50 overflow-y-auto lg:overflow-hidden font-sans">
      {/* Left Panel - Data Summary */}
      <div className="w-full lg:w-1/4 lg:h-full shrink-0 relative z-10 shadow-lg border-b lg:border-b-0">
        <DataPanel
          institutions={mockInstitutions}
          employers={mockEmployers}
          activeFilters={activeFilters}
          onFilterToggle={toggleFilter}
          onClearFilters={clearFilters}
          selectedNodeId={selectedNode?.id || null}
          onNodeSelect={(id) => {
            if (!id) setSelectedNode(null);
            else setSelectedNode(graphData.nodes.find(n => n.id === id) || null);
          }}
        />
      </div>

      {/* Center Stage - Visualization */}
      <div className="w-full lg:w-1/2 h-[60vh] lg:h-full p-4 lg:p-6 relative z-0 flex flex-col border-y lg:border-x lg:border-y-0 border-slate-200 bg-slate-100/50 shrink-0">
        <div className="mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0F2C52] tracking-tight">AI Partner-Matching Engine</h1>
            <p className="text-slate-500 mt-1 font-medium text-sm lg:text-base">Demonstrating AI Discernment for Workforce Readiness</p>
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
      <div className="w-full lg:w-1/4 lg:h-full relative z-10 shadow-lg shrink-0">
        <AIReasoningPane
          selectedNode={selectedNode}
          matches={filteredMatches}
          institutions={mockInstitutions}
          employers={mockEmployers}
        />
      </div>
    </div>
  );
}
