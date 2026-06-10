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
  AlertCircle
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
        // Remove from highlighted search IDs if present
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
              <div className="p-3 rounded bg-white-5 border border-glass mt-3 position-relative">
                <button onClick={clearSearch} className="btn btn-sm text-secondary hover-text-white border-0 bg-transparent position-absolute end-0 top-0 m-2">
                  <X size={16} />
                </button>
                <div className="text-white small fw-bold mb-1 d-flex align-items-center gap-2">
                  <Brain size={14} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Agent Reasoning Grounded in Memories</span>
                </div>
                <p className="text-secondary small mb-0 mt-2 lh-base" style={{ whiteSpace: 'pre-line' }}>{agentAnswer}</p>
                <div className="text-muted text-xxs mt-3" style={{ fontSize: '0.7rem' }}>
                  *Showing highlights in the timeline list below for relevant source documents matching this answer.*
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
            <h6 className="text-white fw-bold mb-3">Categories</h6>
            <div className="d-flex flex-column gap-2">
              <button 
                onClick={() => setFilterType('')}
                className={`btn btn-sm text-start py-2 px-3 rounded d-flex justify-content-between align-items-center ${
                  filterType === '' ? 'btn-primary-glow' : 'btn-secondary-glass border-0 bg-transparent text-secondary'
                }`}
              >
                <span>All Memories</span>
              </button>
              <button 
                onClick={() => setFilterType('document')}
                className={`btn btn-sm text-start py-2 px-3 rounded d-flex justify-content-between align-items-center ${
                  filterType === 'document' ? 'btn-primary-glow' : 'btn-secondary-glass border-0 bg-transparent text-secondary'
                }`}
              >
                <span>Uploaded Documents</span>
              </button>
              <button 
                onClick={() => setFilterType('note')}
                className={`btn btn-sm text-start py-2 px-3 rounded d-flex justify-content-between align-items-center ${
                  filterType === 'note' ? 'btn-primary-glow' : 'btn-secondary-glass border-0 bg-transparent text-secondary'
                }`}
              >
                <span>Reflection Notes</span>
              </button>
              <button 
                onClick={() => setFilterType('goal')}
                className={`btn btn-sm text-start py-2 px-3 rounded d-flex justify-content-between align-items-center ${
                  filterType === 'goal' ? 'btn-primary-glow' : 'btn-secondary-glass border-0 bg-transparent text-secondary'
                }`}
              >
                <span>Target Goals</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Corpus (Right Hand Side) */}
        <div className="col-md-9">
          <div className="glass-card">
            <h5 className="text-white mb-4">Memory Corpus Timeline</h5>

            {loading ? (
              <div className="text-center py-5 text-secondary">Loading memory logs...</div>
            ) : memories.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <AlertCircle size={36} className="mx-auto mb-3 opacity-50" />
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
                        boxShadow: isHighlighted ? '0 0 10px #10b981' : '0 0 10px var(--accent-primary)'
                      }}></div>
                      
                      <div 
                        onClick={() => toggleExpand(m._id)}
                        className={`p-3 rounded bg-white-5 border transition-all cursor-pointer ${
                          isHighlighted ? 'border-success scanning' : 'border-glass'
                        }`}
                        style={{
                          background: isHighlighted ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.03)',
                          cursor: 'pointer'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div className="min-width-0">
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                              <span className="badge badge-glass text-uppercase py-1 px-2" style={{ fontSize: '0.65rem' }}>
                                {m.sourceType}
                              </span>
                              {m.metadata?.fileName && (
                                <span className="text-white small fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                                  {m.metadata.fileName}
                                </span>
                              )}
                              {isHighlighted && (
                                <span className="badge bg-success text-white py-1 px-2" style={{ fontSize: '0.65rem' }}>
                                  Agent Resource
                                </span>
                              )}
                            </div>
                            <div className="text-muted text-xs d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.75rem' }}>
                              <Calendar size={12} />
                              {new Date(m.createdAt).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2">
                            <button 
                              onClick={(e) => handleDelete(m._id, e)} 
                              className="btn btn-sm btn-secondary-glass border-0 bg-transparent text-secondary p-1 hover-text-danger"
                              title="Delete Memory"
                            >
                              <Trash2 size={14} />
                            </button>
                            <span className="text-secondary">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </span>
                          </div>
                        </div>

                        {/* AI summary */}
                        <div className="mt-3">
                          <p className="text-secondary small mb-0 fw-medium">AI Summary:</p>
                          <p className="text-secondary small mb-0 mt-1">{m.summary || 'Summary processing failed'}</p>
                        </div>

                        {/* Full original text expansion */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-top border-glass">
                            <div className="text-white small fw-bold mb-2">Extracted Document Text</div>
                            <div className="p-3 rounded bg-black-50 text-secondary text-xs font-monospace max-height-400" style={{
                              whiteSpace: 'pre-wrap',
                              overflowY: 'auto',
                              maxHeight: '350px',
                              background: '#040306',
                              lineHeight: '1.5'
                            }}>
                              {m.content}
                            </div>
                            
                            {m.metadata?.wordCount && (
                              <div className="mt-2 text-muted text-xxs d-flex gap-3" style={{ fontSize: '0.7rem' }}>
                                <span>Word Count: {m.metadata.wordCount}</span>
                                {m.metadata.fileSize && <span>File Size: {(m.metadata.fileSize / 1024).toFixed(1)} KB</span>}
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
          background: rgba(255, 255, 255, 0.05);
        }
        .text-xxs {
          font-size: 0.7rem;
        }
        .border-success {
          border-color: rgba(16, 185, 129, 0.4) !important;
        }
        .hover-text-danger:hover {
          color: #ef4444 !important;
        }
        .hover-text-violet:hover {
          color: var(--accent-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default MemoryExplorer;