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
    const [hoverNode, setHoverNode] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Compute direct neighbors for isolating un-connected nodes 
    const linkedNodes = React.useMemo(() => {
        if (!selectedNodeId) return new Set<string>();
        const connected = new Set<string>([selectedNodeId]);
        data.links.forEach((l: any) => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            if (sourceId === selectedNodeId) connected.add(targetId);
            if (targetId === selectedNodeId) connected.add(sourceId);
        });
        return connected;
    }, [data.links, selectedNodeId]);

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

    // Configure forces and zoom to fit nodes once loaded
    useEffect(() => {
        if (fgRef.current && data.nodes.length > 0) {
            // Increase repulsion (default is usually -30) to spread nodes apart
            fgRef.current.d3Force('charge').strength(-350);
            // Increase preferred link distance (default is 30)
            fgRef.current.d3Force('link').distance(75);

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
                // react-force-graph mutates the data.nodes in place with x/y coordinates
                const targetNode = data.nodes.find((n: any) => n.id === selectedNodeId) as any;
                if (targetNode && targetNode.x !== undefined && targetNode.y !== undefined) {
                    fgRef.current.centerAt(targetNode.x, targetNode.y, 1000);
                    fgRef.current.zoom(3, 1000);
                }
            }, 100);
        }
    }, [selectedNodeId, data]);

    const getNodeColor = (node: any) => {
        return node.color || '#9ca3af'; // Fallback to gray if no color is provided
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-[#0F2C52] border border-slate-200 rounded-lg overflow-hidden relative shadow-inner">
            {/* @ts-ignore */}
            <ForceGraph2D
                ref={fgRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={data}
                nodeColor={getNodeColor}
                nodeRelSize={6}
                nodeVal={(node: any) => node.val || 1}
                nodeLabel={() => ''} // Disabled default tooltip in favor of canvas text
                onNodeClick={onNodeClick}
                onNodeHover={(node) => setHoverNode(node && node.id ? String(node.id) : null)}
                nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                    const label = node.name;
                    const fontSize = 14 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;

                    // Draw outer background/fill
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
                    ctx.fillStyle = getNodeColor(node);
                    ctx.fill();

                    // Shading/Badge for subTypes
                    if (node.subType) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        if (node.group === 'institution' && node.subType === 'R1') {
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, node.val * 0.4, 0, 2 * Math.PI, false);
                            ctx.fill();
                        } else if (node.group === 'institution' && node.subType === 'Community College') {
                            ctx.lineWidth = 1.5 / globalScale;
                            ctx.strokeStyle = '#FFFFFF';
                            ctx.stroke();
                        } else if (node.group === 'employer') {
                            ctx.fillRect(node.x - node.val / 4, node.y - node.val / 4, node.val / 2, node.val / 2);
                        }
                    }

                    // Hover layer text and highlight
                    if (hoverNode === node.id || selectedNodeId === node.id) {
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth + fontSize, fontSize + fontSize * 1.5]; // Expanded height and width

                        // Move text down slightly to fit exactly inside the expanded box
                        const boxY = node.y - node.val - fontSize * 1.5;

                        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                        ctx.fillRect(node.x - bckgDimensions[0] / 2, boxY - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#0F2C52';
                        ctx.fillText(label, node.x, boxY);

                        ctx.beginPath();
                        ctx.arc(node.x, node.y, node.val + 2, 0, 2 * Math.PI, false);
                        ctx.strokeStyle = '#FFFFFF';
                        ctx.lineWidth = 2 / globalScale;
                        ctx.stroke();
                    }
                }}
                nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.val + 3, 0, 2 * Math.PI, false);
                    ctx.fill();
                }}
                linkColor={(link: any) => {
                    const baseColor = 'rgba(249, 217, 170, 0.4)'; // Peach base for all links
                    const highlightColor = 'rgba(249, 217, 170, 0.9)';
                    const dimColor = 'rgba(249, 217, 170, 0.1)';

                    if (!selectedNodeId) return baseColor;

                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    const isConnected = sourceId === selectedNodeId || targetId === selectedNodeId;

                    return isConnected ? highlightColor : dimColor;
                }}
                linkWidth={(link: any) => {
                    // Score range is roughly 40-100. Normalize to a 1 - 5 pixel width.
                    const minWidth = 1;
                    const maxWidth = 5;
                    // Protect against undefined or low score edge cases
                    const score = Math.max(40, link.value || 40);
                    return minWidth + ((score - 40) / 60) * (maxWidth - minWidth);
                }}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={(d: any) => (d.value || 40) * 0.0001}
            />
        </div>
    );
}
