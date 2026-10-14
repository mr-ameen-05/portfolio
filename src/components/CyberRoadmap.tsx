import { useState, useRef, useEffect } from 'react';
import { Shield, Server, Laptop, Globe, Database, Cpu, Palette, Eye, Package, Folder, ShieldCheck, Zap, Atom } from 'lucide-react';

type FocusArea = 'offense' | 'defense' | 'purple' | 'devsecops' | 'white' | 'frontier';

interface MindMapNode {
  id: string;
  label: string;
  level: number; // 0 = bedrock, 1 = principles, 2 = color teams, 3 = frontiers
  category: FocusArea;
  description: string;
  tools: string[];
  isMyFocus: boolean;
  focusLink?: string;
}

// Import the data
import { CYBER_ROADMAP_NODES } from '../data/roadmapData';

// Color mapping for each focus area
const areaColors: Record<FocusArea, string> = {
  offense: '#EF4444',       // Crimson
  defense: '#3B82F6',       // Blue
  purple: '#8B5CF6',        // Violet
  devsecops: '#F59E0B',     // Amber
  white: '#6B7280',         // Slate
  frontier: '#10B981',      // Emerald
};

// Badge labels
const areaLabels: Record<FocusArea, string> = {
  offense: 'Offense',
  defense: 'Defense',
  purple: 'Purple',
  devsecops: 'DevSecOps',
  white: 'Governance',
  frontier: 'Frontier',
};

// Node icons per category
const areaIcons: Record<FocusArea, React.ComponentType<{ className?: string }>> = {
  offense: Shield,
  defense: Palette,
  purple: Zap,
  devsecops: Package,
  white: Folder,
  frontier: Cpu,
};

const CyberRoadmap = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | FocusArea>('all');
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 768);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNode) {
        setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  // Filter nodes by active category
  const filteredNodes = activeFilter === 'all'
    ? CYBER_ROADMAP_NODES
    : CYBER_ROADMAP_NODES.filter(n => n.category === activeFilter);

  // Node color based on category
  const getNodeColor = (node: MindMapNode) => areaColors[node.category] || '#6B7280';

  // Show "My Expertise" badge
  const showMyFocusBadge = (node: MindMapNode) => node.isMyFocus;

  return (
    <section id="cyber-roadmap" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Filter Pill Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 md:mb-16">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-bg-secondary text-text-secondary border border-border-subtle hover:border-border-hover'
            }`}
          >
            All Paths
          </button>
          {['offense', 'defense', 'purple', 'devsecops', 'white', 'frontier'].map((cat) => {
            const count = CYBER_ROADMAP_NODES.filter(n => n.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat as FocusArea)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeFilter === cat
                    ? 'bg-accent text-bg-primary'
                    : 'bg-bg-secondary text-text-secondary border border-border-subtle hover:border-border-hover'
                }`}
              >
                {areaLabels[cat as FocusArea]} <span className="text-xs">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Accordion Roadmap */}
        {isMobile && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {filteredNodes.map((node) => (
              <details
                key={node.id}
                className="bg-bg-secondary border border-border-subtle rounded-xl p-5 hover:border-accent/30 transition-colors cursor-pointer"
                aria-label={node.label}
              >
                <summary className="font-medium text-text-primary hover:text-accent transition-colors">
                  {node.label}
                  {node.isMyFocus && (
                    <span className="text-[10px] font-mono text-accent uppercase tracking-widest ml-2 bg-accent/10 text-accent px-1 rounded">
                      Ameen's Focus
                    </span>
                  )}
                </summary>
                <p className="text-text-secondary text-sm mt-3 leading-relaxed">
                  {node.description}
                </p>
              </details>
            ))}
          </div>
        )}

        {/* Desktop Mind Map Grid Cards */}
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
                {node.category === 'offense' && <Shield className="text-primary" />}

                {node.category === 'defense' && <Palette className="text-primary" />}

                {node.category === 'purple' && <Zap className="text-primary" />}

                {node.category === 'devsecops' && <Package className="text-primary" />}

                {node.category === 'white' && <Folder className="text-primary" />}

                {node.category === 'frontier' && <Cpu className="text-primary" />}
              </div>
              
              <h3 className="text-sm font-medium text-text-primary line-clamp-1 line-clamp-line-clamp-2">
                {node.label}
              </h3>
              
              {node.isMyFocus && (
                <p className="text-xs font-mono text-accent uppercase tracking-widest mt-1 bg-accent/10 text-accent px-1 rounded">
                  Ameen's Focus
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Selected Node Detail Panel */}
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
                    <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-2">
                      Related Project
                    </p>
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

export default CyberRoadmap;