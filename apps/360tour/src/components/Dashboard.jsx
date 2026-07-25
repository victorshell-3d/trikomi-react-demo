import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { tourApi } from '../api/dashboardApi';
import { useLocalImage } from '../hooks/useLocalImage';
import ExportDialog from './ExportDialog';

const TourThumbnail = ({ tourId, url, alt }) => {
  const localUrl = useLocalImage(tourId, url);
  return <img src={localUrl || url} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
};

const Dashboard = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportTourData, setExportTourData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTourTitle, setNewTourTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadTours(); }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const data = await tourApi.getDashboard();
      setTours(data);
    } catch (_err) {
      setError('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    if (!newTourTitle.trim()) return;
    try {
      const newTour = await tourApi.createTour({ title: newTourTitle, description: '' });
      setShowCreateModal(false);
      setNewTourTitle('');
      navigate(`/editor/${newTour.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create tour');
    }
  };

  const handleDuplicateTour = async (id, e) => {
    e.stopPropagation();
    try { await tourApi.duplicateTour(id); loadTours(); }
    catch { setError('Failed to duplicate tour'); }
  };

  const handleDeleteTour = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this tour?')) return;
    try { await tourApi.deleteTour(id); loadTours(); }
    catch { setError('Failed to delete tour'); }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Loading tours…
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">My Tours</h1>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const tour = await tourApi.openExisting();
                navigate(`/editor/${tour.id}`);
              } catch (err) {
                setError(err.message || 'Failed to open tour folder');
              }
            }}
            className="btn btn-secondary btn-sm"
          >
            Open Existing
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm">
            + New Tour
          </button>
        </div>
      </div>

      {error && <div className="error-bar">{error}</div>}

      {/* Tours Grid */}
      {tours.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌐</div>
          <h3 className="empty-state-title">No tours yet</h3>
          <p className="empty-state-text">Create your first virtual tour to get started.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Create Tour</button>
        </div>
      ) : (
        <div className="tour-grid">
          {tours.map((tour) => (
            <div key={tour.id} className="tour-card">
              <Link to={`/editor/${tour.id}`} style={{ display: 'block' }}>
                <div className="tour-thumb">
                  {tour.scenes?.[0]?.thumbnail ? (
                    <TourThumbnail tourId={tour.id} url={tour.scenes[0].thumbnail} alt={tour.title} />
                  ) : (
                    <span style={{ fontSize: '1.5rem' }}>🌐</span>
                  )}
                  <div className="tour-actions" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => { e.preventDefault(); setExportTourData(tour); }} className="btn-icon" title="Export">📦</button>
                    <button onClick={(e) => handleDuplicateTour(tour.id, e)} className="btn-icon" title="Duplicate">📋</button>
                    <button onClick={(e) => handleDeleteTour(tour.id, e)} className="btn-icon" title="Delete" style={{ color: 'var(--color-danger)' }}>🗑️</button>
                  </div>
                </div>
                <div className="tour-info">
                  <div className="tour-title">{tour.title}</div>
                  <div className="tour-meta">
                    <span className={`badge ${tour.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                      {tour.status || 'draft'}
                    </span>
                    <span>{tour.scenes_count || tour.scenes?.length || 0} scenes · {new Date(tour.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <ExportDialog
        isOpen={!!exportTourData}
        onClose={() => setExportTourData(null)}
        tourId={exportTourData?.id}
        tourTitle={exportTourData?.title}
      />

      {/* Create Tour Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box modal-sm">
            <div className="modal-head">
              <span className="modal-head-title">Create New Tour</span>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateTour}>
                <label className="label">Tour Name</label>
                <input
                  type="text"
                  value={newTourTitle}
                  onChange={(e) => setNewTourTitle(e.target.value)}
                  className="input-field"
                  placeholder="Enter tour name"
                  autoFocus
                />
                <div className="flex gap-2" style={{ marginTop: 16 }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
