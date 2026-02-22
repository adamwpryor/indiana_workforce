"use client";

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { NetworkGraphData } from '@/types';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface NetworkGraphProps {
    data: NetworkGraphData;
    onNodeClick?: (node: any) => void;
    selectedNodeId?: string | null;
}

export default function NetworkGraph({ data, onNodeClick, selectedNodeId }: NetworkGraphProps) {
    const fgRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }

        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Zoom to fit nodes once loaded
    useEffect(() => {
        if (fgRef.current && data.nodes.length > 0) {
            setTimeout(() => {
                fgRef.current.zoomToFit(400, 50);
            }, 500);
        }
    }, [data]);

    // Zoom to selected node if selected from outside
    useEffect(() => {
        if (selectedNodeId && fgRef.current) {
            // Need setTimeout to allow internal d3 state to stabilize if data just loaded
            setTimeout(() => {
                const GraphData = fgRef.current.graphData();
                const targetNode = GraphData.nodes.find((n: any) => n.id === selectedNodeId);
                if (targetNode && targetNode.x !== undefined && targetNode.y !== undefined) {
                    fgRef.current.centerAt(targetNode.x, targetNode.y, 1000);
                    fgRef.current.zoom(3, 1000);
                }
            }, 100);
        }
    }, [selectedNodeId]);

    const getNodeColor = (node: any) => {
        switch (node.group) {
            case 'institution': return '#0F2C52'; /* Brand Navy */
            case 'employer': return '#1A5F7A'; /* Brand Teal */
            case 'intermediary': return '#E48F45'; /* Brand Gold */
            default: return '#9ca3af'; // gray-400
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden relative shadow-inner">
            {/* Legend overlays */}
            <div className="absolute top-4 left-4 inline-flex flex-col gap-2 p-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-md shadow-sm z-10 text-sm font-medium">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#0F2C52]"></span> Institutions</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1A5F7A]"></span> Employers</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#E48F45]"></span> Intermediaries</div>
            </div>

            {/* @ts-ignore */}
            <ForceGraph2D
                ref={fgRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={data}
                nodeColor={getNodeColor}
                nodeRelSize={6}
                nodeVal={(node: any) => node.val || 1}
                nodeLabel="name"
                onNodeClick={onNodeClick}
                linkColor={() => '#cbd5e1'}
                linkWidth={(link: any) => Math.max(1, (link.value - 60) / 10)}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={(d: any) => d.value * 0.0001}
            />
        </div>
    );
}
