import { useState, useRef, useEffect } from 'react';
import { Shield, Server, Laptop, Globe, Database, Cpu, Palette, Package, Folder, ShieldCheck, Zap, Atom } from 'lucide-react';

type FocusArea = 'offense' | 'defense' | 'purple' | 'devsecops' | 'white' | 'frontier';

interface MindMapNode {
  id: string;
  label: string;
  level: number;
  category: FocusArea;
  description: string;
  tools: string[];
  isMyFocus: boolean;
  focusLink?: string;
  children?: MindMapNode[];
}

import { CYBER_ROADMAP_NODES } from '../data/roadmapData';

const areaColors: Record<FocusArea, string> = {
  offense: '#EF4444',
  defense: '#3B82F6',
  purple: '#8B5CF6',
  devsecops: '#F59E0B',
  white: '#6B7280',
  frontier: '#10B981',
};

const areaLabels: Record<FocusArea, string> = {
  offense: 'Offense',
  defense: 'Defense',
  purple: 'Purple',
  devsecops: 'DevSecOps',
  white: 'Governance',
  frontier: 'Frontier',
};

const areaIcons: Record<FocusArea, React.ComponentType<{ className?: string }>> = {
  offense: Shield,
  defense: Palette,
  purple: Zap,
  devsecops: Package,
  white: Folder,
  frontier: Cpu,
};

const StartLearning = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | FocusArea>('all');
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(new Set<string>());

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 768);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const initExpanded = new Set<string>();
    CYBER_ROADMAP_NODES.forEach(node => {
      if (node.level <= 2) {
        initExpanded.add(node.id);
      }
    });
    setExpandedNodes(initExpanded);
  }, []);

  const filteredNodes = activeFilter === 'all'
    ? CYBER_ROADMAP_NODES
    : CYBER_ROADMAP_NODES.filter((n: MindMapNode) => n.category === activeFilter);

  const getNodeColor = (node: MindMapNode) => areaColors[node.category] || '#6B7280';

  const isNodeExpanded = (node: MindMapNode) => expandedNodes.has(node.id);

  const toggleNodeExpansion = (node: MindMapNode) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
        if (node.level === 2) {
          const childrenIds = node.children?.map(c => c.id) || [];
          childrenIds.forEach(id => next.delete(id));
        }
      } else {
        next.add(node.id);
      }
      return next;
    });
  };

  const showMyFocusBadge = (node: MindMapNode) => node.isMyFocus;

  return (
    <section id="start-learning" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-16">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
              Start Learning
            </h1>
            <p className="text-text-secondary mt-2 leading-relaxed">
              An interactive roadmap through the cybersecurity landscape — from bedrock fundamentals to modern frontiers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              onChange={(e) => setActiveFilter(e.target.value as FocusArea)}
              className="bg-bg-secondary border border-border-subtle rounded-lg px-4 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent transition-colors"
            >
              <option value="all">All Paths</option>
              {['offense', 'defense', 'purple', 'devsecops', 'white', 'frontier'].map((cat: string) => {
                const count = CYBER_ROADMAP_NODES.filter((n: MindMapNode) => n.category === (cat as FocusArea)).length;
                return (
                  <option key={cat} value={cat}>
                    {areaLabels[cat as FocusArea]} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {isMobile && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {filteredNodes.map((node) => (
              <details
                key={node.id}
                className="bg-bg-secondary border border-border-subtle rounded-xl p-5 hover:border-accent/30 transition-colors cursor-pointer"
                aria-label={node.label}
                open={isNodeExpanded(node)}
              >
                <summary className="font-medium text-text-primary hover:text-accent transition-colors flex items-center justify-between">
                  {node.label}
                  {node.isMyFocus && (
                    <span className="text-[10px] font-mono text-accent uppercase tracking-widest ml-2 bg-accent/10 text-accent px-1 rounded">
                      Ameen's Focus
                    </span>
                  )}
                  {node.children && node.children.length > 0 && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="transition-transform rotate-180"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </summary>
                <p className="text-text-secondary text-sm mt-3 leading-relaxed">
                  {node.description}
                </p>
                {node.children && node.children.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {node.children.map((child: MindMapNode) => (
                      <details
                        key={child.id}
                        className="pl-4 bg-bg-tertiary rounded-md p-2 text-xs text-text-secondary"
                        open={isNodeExpanded(child)}
                      >
                        <summary>{child.label}</summary>
                        <p className="text-text-secondary mt-1 line-clamp-2">{child.description}</p>
                      </details>
                    ))}
                  </div>
                )}
              </details>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:mb-12">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              className={`group bg-bg-secondary border border-border-subtle rounded-xl p-5 hover:border-accent/30 transition-colors cursor-pointer ${
                node.isMyFocus ? 'ring-2 ring-accent/20' : ''
              }`}
              onClick={() => setSelectedNode(node)}
              role="button"
              tabIndex={0}
              aria-label={node.label}
            >
              <div className="h-10 w-10 rounded-md flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {node.category === 'offense' && <Shield className="text-bg-primary" />}
                {node.category === 'defense' && <Palette className="text-bg-primary" />}
                {node.category === 'purple' && <Zap className="text-bg-primary" />}
                {node.category === 'devsecops' && <Package className="text-bg-primary" />}
                {node.category === 'white' && <Folder className="text-bg-primary" />}
                {node.category === 'frontier' && <Cpu className="text-bg-primary" />}
              </div>
              <h3 className="text-sm font-medium text-text-primary line-clamp-1 line-clamp-line-clamp-2">
                {node.label}
              </h3>
              {node.isMyFocus && (
                <p className="text-xs font-mono text-accent uppercase tracking-widest mt-1 bg-accent/10 text-accent px-1 rounded">
                  Ameen's Focus
                </p>
              )}
              {node.children && node.children.length > 0 && (
                <button
                  type="button"
                  className="text-xs font-mono text-text-secondary uppercase tracking-widest mt-2 hover:text-accent transition-colors block text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNodeExpansion(node);
                  }}
                >
                  {isNodeExpanded(node) ? '▲ Collapse' : '▼ Expand'}
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedNode && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedNode(null)}
          >
            <div
              className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 md:p-8 max-w-2xl w-full mx-auto relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute right-6 top-6 text-text-secondary hover:text-text-primary transition-colors font-mono text-xs"
              >
                ✕ Close
              </button>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">
                {selectedNode.label}
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                {selectedNode.description}
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-2">Core Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.tools.slice(0, 8).map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-mono text-text-secondary px-2.5 py-1 rounded bg-bg-primary border border-border-subtle"
                      >
                        {tool}
                      </span>
                    ))}
                    {selectedNode.tools.length > 8 && (
                      <span className="text-[10px] font-mono text-text-secondary">+{selectedNode.tools.length - 8} more</span>
                    )}
                  </div>
                </div>
                {selectedNode.focusLink && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-2">Related Project</p>
                    <a
                      href={`#${selectedNode.focusLink}`}
                      className="inline-flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider hover:text-text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View {selectedNode.focusLink.replace(/-/g, ' ')}
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StartLearning;
