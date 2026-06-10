import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search, 
  Trash2, 
  FileText, 
  Calendar, 
  HelpCircle, 
  X, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Brain,
  AlertCircle,
  Target,
  Copy,
  Check
} from 'lucide-react';

const MemoryExplorer = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [agentAnswer, setAgentAnswer] = useState('');
  const [relevantMemoryIds, setRelevantMemoryIds] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Detail panel expanded state
  const [expandedMemoryId, setExpandedMemoryId] = useState(null);

  useEffect(() => {
    fetchMemories();
  }, [filterType]);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const url = filterType ? `/memories?type=${filterType}` : '/memories';
      const response = await api.get(url);
      if (response.data.success) {
        setMemories(response.data.memories);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setAgentAnswer('');
    setRelevantMemoryIds([]);
    try {
      const response = await api.get(`/memories/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.data.success) {
        setAgentAnswer(response.data.answer);
        setRelevantMemoryIds(response.data.relevantMemories.map(m => m.id));
      }
    } catch (error) {
      console.error('Error querying Memory Agent:', error);
      setAgentAnswer('Sorry, the Memory Agent encountered an issue analyzing your request.');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAgentAnswer('');
    setRelevantMemoryIds([]);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Stop expansion trigger
    if (!window.confirm('Are you sure you want to permanently delete this memory? It will be removed from your digital twin profile.')) {
      return;
    }

    try {
      const response = await api.delete(`/memories/${id}`);
      if (response.data.success) {
        setMemories(memories.filter(m => m._id !== id));
        setRelevantMemoryIds(relevantMemoryIds.filter(mid => mid !== id));
      }
    } catch (error) {
      console.error('Error removing memory:', error);
    }
  };

  const toggleExpand = (id) => {
    if (expandedMemoryId === id) {
      setExpandedMemoryId(null);
    } else {
      setExpandedMemoryId(id);
    }
  };

  const handleCopyText = (text, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Safe search highlighting helper
  const highlightText = (text, query) => {
    if (!text) return '';
    if (!query || !query.trim()) return text;
    
    // Escape HTML to prevent XSS
    let escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
      
    // Filter and sanitize query words
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 2 && !['what', 'how', 'when', 'where', 'who', 'which', 'why', 'this', 'that', 'with', 'from', 'your', 'have', 'your', 'about'].includes(t));
      
    if (terms.length === 0) return escapedText;
    
    // Escape regex characters
    const escapedTerms = terms.map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  };

  const getSourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'document':
        return <FileText size={16} className="text-info" />;
      case 'goal':
        return <Target size={16} className="text-success" />;
      case 'note':
      default:
        return <Brain size={16} className="text-violet" style={{ color: 'var(--accent-primary)' }} />;
    }
  };

  // Pre-calculate filter category counts
  const allCount = memories.length;
  const docCount = memories.filter(m => m.sourceType === 'document').length;
  const noteCount = memories.filter(m => m.sourceType === 'note').length;
  const goalCount = memories.filter(m => m.sourceType === 'goal').length;

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="row mb-5">
        <div className="col-12">
          <span className="text-secondary small text-uppercase tracking-wider fw-semibold">Long-Term Storage</span>
          <h1 className="text-white fw-bold mb-0 mt-1">Memory Explorer</h1>
          <p className="text-secondary mb-0">Search, review, and filter your stored documents, reflections, notes, and targets.</p>
        </div>
      </div>

      {/* Memory Agent Grounded Search bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="glass-card">
            <h5 className="text-white mb-3 d-flex align-items-center gap-2">
              <Brain size={18} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
              <span>Ask the Memory Agent</span>
            </h5>
            <form onSubmit={handleSearch} className="mb-2">
              <div className="input-group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control glass-input"
                  placeholder="E.g., What skills did I list in my resume? What projects have I worked on?"
                  required
                />
                <button type="submit" disabled={searching} className="btn btn-primary-glow px-4">
                  {searching ? 'Querying...' : <Search size={18} />}
                </button>
              </div>
            </form>

            {agentAnswer && (
              <div className="p-3 rounded bg-white-5 border border-glass mt-3 position-relative transition-all border-success">
                <button onClick={clearSearch} className="btn btn-sm text-secondary hover-text-white border-0 bg-transparent position-absolute end-0 top-0 m-2">
                  <X size={16} />
                </button>
                <div className="text-white small fw-bold mb-1 d-flex align-items-center gap-2">
                  <Brain size={14} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Agent Reasoning Grounded in Memories</span>
                </div>
                <p className="text-secondary small mb-0 mt-2.5 lh-base" style={{ whiteSpace: 'pre-line' }}>{agentAnswer}</p>
                <div className="text-muted text-xxs mt-3 d-flex align-items-center gap-1.5" style={{ fontSize: '0.7rem' }}>
                  <AlertCircle size={12} className="text-success" />
                  <span>Highlighting matching timeline source documents below.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Category Filters (Left Hand Side) */}
        <div className="col-md-3">
          <div className="glass-card p-3">
            <h6 className="text-white fw-bold mb-3 px-1">Categories</h6>
            <div className="d-flex flex-column gap-2">
              <button 
                onClick={() => setFilterType('')}
                className={`btn btn-sm text-start py-2.5 px-3 rounded d-flex justify-content-between align-items-center ${
                  filterType === '' ? 'btn-primary-glow border-0' : 'btn-secondary-glass border-0 bg-transparent text-secondary'
                }`}
              >
                <span>All Memories</span>
                <span className={`badge rounded-pill ${filterType === '' ? 'bg-white text-dark' : 'bg-white-5 text-secondary'} px-2 py-1`}>
                  {allCount}
                </span>
              </button>
              <button 
                onClick={() => setFilterType('document')}
                className={`btn btn-sm text-start py-2.5 px-3 rounded d-flex justify-content-between align-items-center ${
                  filterType === 'document' ? 'btn-primary-glow border-0' : 'btn-secondary-glass border-0 bg-transparent text-secondary'
                }`}
              >
                <span>Uploaded Docs</span>
                <span className={`badge rounded-pill ${filterType === 'document' ? 'bg-white text-dark' : 'bg-white-5 text-secondary'} px-2 py-1`}>
                  {docCount}
                </span>
              </button>
              <button 
                onClick={() => setFilterType('note')}
                className={`btn btn-sm text-start py-2.5 px-3 rounded d-flex justify-content-between align-items-center ${
                  filterType === 'note' ? 'btn-primary-glow border-0' : 'btn-secondary-glass border-0 bg-transparent text-secondary'
                }`}
              >
                <span>Reflection Notes</span>
                <span className={`badge rounded-pill ${filterType === 'note' ? 'bg-white text-dark' : 'bg-white-5 text-secondary'} px-2 py-1`}>
                  {noteCount}
                </span>
              </button>
              <button 
                onClick={() => setFilterType('goal')}
                className={`btn btn-sm text-start py-2.5 px-3 rounded d-flex justify-content-between align-items-center ${
                  filterType === 'goal' ? 'btn-primary-glow border-0' : 'btn-secondary-glass border-0 bg-transparent text-secondary'
                }`}
              >
                <span>Target Goals</span>
                <span className={`badge rounded-pill ${filterType === 'goal' ? 'bg-white text-dark' : 'bg-white-5 text-secondary'} px-2 py-1`}>
                  {goalCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Corpus (Right Hand Side) */}
        <div className="col-md-9">
          <div className="glass-card">
            <h5 className="text-white mb-4">Memory Corpus Timeline</h5>

            {loading ? (
              <div className="text-center py-5 text-secondary d-flex flex-column align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-violet" role="status" style={{ color: 'var(--accent-primary)' }}></div>
                <span>Loading memory logs...</span>
              </div>
            ) : memories.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <AlertCircle size={36} className="mx-auto mb-3 opacity-50 text-muted" />
                <p className="small mb-0">No matching memories found.</p>
              </div>
            ) : (
              <div className="timeline-container">
                {memories.map((m) => {
                  const isHighlighted = relevantMemoryIds.includes(m._id);
                  const isExpanded = expandedMemoryId === m._id;
                  
                  return (
                    <div key={m._id} className="timeline-item">
                      <div className="timeline-dot" style={{
                        background: isHighlighted ? '#10b981' : 'var(--accent-primary)',
                        boxShadow: isHighlighted ? '0 0 12px #10b981' : '0 0 10px var(--accent-primary)'
                      }}></div>
                      
                      <div 
                        onClick={() => toggleExpand(m._id)}
                        className={`p-3.5 rounded bg-white-5 border transition-all cursor-pointer ${
                          isHighlighted ? 'border-success scanning' : 'border-glass'
                        } hover-glow-card`}
                        style={{
                          background: isHighlighted ? 'rgba(16,185,129,0.03)' : 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div className="min-width-0">
                            <div className="d-flex align-items-center gap-2 mb-1.5 flex-wrap">
                              <span className="badge badge-glass text-uppercase py-1 px-2.5 d-flex align-items-center gap-1.5" style={{ fontSize: '0.65rem' }}>
                                {getSourceIcon(m.sourceType)}
                                <span>{m.sourceType}</span>
                              </span>
                              {m.metadata?.fileName && (
                                <span className="text-white small fw-bold text-truncate" style={{ maxWidth: '240px' }}>
                                  {m.metadata.fileName}
                                </span>
                              )}
                              {isHighlighted && (
                                <span className="badge bg-success text-white py-1 px-2.5" style={{ fontSize: '0.65rem' }}>
                                  Agent Resource
                                </span>
                              )}
                            </div>
                            <div className="text-muted text-xs d-flex align-items-center gap-1.5 mt-1" style={{ fontSize: '0.75rem' }}>
                              <Calendar size={12} className="text-muted" />
                              <span>{new Date(m.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={(e) => handleDelete(m._id, e)} 
                              className="btn btn-sm btn-secondary-glass border-0 bg-transparent text-secondary p-1.5 hover-text-danger rounded"
                              title="Delete Memory"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button 
                              onClick={() => toggleExpand(m._id)}
                              className="btn btn-sm btn-secondary-glass border-0 bg-transparent text-secondary p-1.5 hover-text-white rounded"
                            >
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          </div>
                        </div>

                        {/* AI Summary Section */}
                        <div className="mt-3">
                          <p className="text-secondary small mb-0 fw-medium">AI Summary:</p>
                          <p 
                            className="text-secondary small mb-0 mt-1.5 lh-sm"
                            dangerouslySetInnerHTML={{ __html: highlightText(m.summary, searchQuery) }}
                          />
                        </div>

                        {/* Collapsible Extracted Source Document text */}
                        {isExpanded && (
                          <div className="mt-3.5 pt-3.5 border-top border-glass" onClick={(e) => e.stopPropagation()}>
                            <div className="d-flex justify-content-between align-items-center mb-2.5">
                              <span className="text-white small fw-bold">Extracted Grounding Text</span>
                              <button 
                                onClick={(e) => handleCopyText(m.content, m._id, e)}
                                className="btn btn-xs btn-secondary-glass py-1 px-2 text-secondary d-flex align-items-center gap-1 text-xs"
                              >
                                {copiedId === m._id ? (
                                  <>
                                    <Check size={12} className="text-success" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>Copy Text</span>
                                  </>
                                )}
                              </button>
                            </div>
                            
                            <div className="p-3.5 rounded text-secondary text-xs font-monospace max-height-350 position-relative" style={{
                              whiteSpace: 'pre-wrap',
                              overflowY: 'auto',
                              maxHeight: '350px',
                              background: '#040306',
                              lineHeight: '1.6',
                              border: '1px solid rgba(255,255,255,0.06)'
                            }}>
                              <span dangerouslySetInnerHTML={{ __html: highlightText(m.content, searchQuery) }} />
                            </div>
                            
                            {m.metadata?.wordCount && (
                              <div className="mt-2 text-muted text-xxs d-flex gap-3 justify-content-end" style={{ fontSize: '0.7rem' }}>
                                <span>Word Count: {m.metadata.wordCount}</span>
                                {m.metadata.fileSize ? <span>File Size: {(m.metadata.fileSize / 1024).toFixed(1)} KB</span> : null}
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .bg-white-5 {
          background: rgba(255, 255, 255, 0.04);
        }
        .text-xxs {
          font-size: 0.68rem;
        }
        .border-success {
          border-color: rgba(16, 185, 129, 0.45) !important;
        }
        .hover-text-danger:hover {
          color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.08) !important;
        }
        .hover-text-white:hover {
          color: #ffffff !important;
          background: rgba(255,255,255,0.08) !important;
        }
        .hover-glow-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border-color: rgba(255,255,255,0.12);
        }
        /* Neon Yellow Highlight styling */
        .search-highlight {
          background: rgba(245, 158, 11, 0.22);
          color: #fffbeb;
          border-radius: 3px;
          padding: 0px 3px;
          font-weight: 600;
          border-bottom: 1.5px solid #f59e0b;
        }
      `}</style>
    </div>
  );
};

export default MemoryExplorer;