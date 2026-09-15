import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api, { resolveFileUrl } from '../api/axios';

const emptyForm = {
  kit_name: '',
  grade: '',
  subject: '',
  topic: '',
  description: '',
  video_url: '',
  learning_outcomes: ''
};

const ManageKits = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [kitImageFile, setKitImageFile] = useState(null);
  const [manualPdfFile, setManualPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchKits = async () => {
    setLoading(true);
    const { data } = await api.get('/kits/admin');
    if (data.success) setKits(data.kits);
    setLoading(false);
  };

  useEffect(() => {
    fetchKits();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setKitImageFile(null);
    setManualPdfFile(null);
    setShowModal(true);
  };

  const openEditModal = (kit) => {
    setEditingId(kit._id);
    setForm({
      kit_name: kit.kit_name,
      grade: kit.grade,
      subject: kit.subject,
      topic: kit.topic || '',
      description: kit.description || '',
      video_url: kit.video_url || '',
      learning_outcomes: kit.learning_outcomes || ''
    });
    setKitImageFile(null);
    setManualPdfFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    if (kitImageFile) fd.append('kit_image', kitImageFile);
    if (manualPdfFile) fd.append('manual_pdf', manualPdfFile);

    try {
      let res;
      if (editingId) {
        res = await api.put(`/kits/admin/${editingId}`, fd);
      } else {
        res = await api.post('/kits/admin', fd);
      }
      setMessage({ type: 'success', text: res.data.message });
      setShowModal(false);
      fetchKits();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this kit? This cannot be undone.')) return;
    const { data } = await api.delete(`/kits/admin/${id}`);
    setMessage({ type: 'success', text: data.message });
    fetchKits();
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Remove this kit image?')) return;
    await api.delete(`/kits/admin/${id}/image`);
    fetchKits();
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Kits</h1>
          <p className="page-subtitle">Add, edit or remove STEM kits from the catalog</p>
        </div>
        <button className="btn btn--primary" onClick={openAddModal}>
          + Add Kit
        </button>
      </div>

      {message && <div className={`alert alert--${message.type}`}>{message.text}</div>}

      {loading ? (
        <p>Loading kits...</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Subject</th>
                <th>Topic</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {kits.length === 0 && (
                <tr>
                  <td colSpan={6} className="muted" style={{ textAlign: 'center', padding: 24 }}>
                    No kits added yet.
                  </td>
                </tr>
              )}
              {kits.map((kit) => (
                <tr key={kit._id}>
                  <td>
                    {kit.kit_image ? (
                      <img
                        className="table-thumb"
                        src={resolveFileUrl(kit.kit_image, 'kits')}
                        alt={kit.kit_name}
                      />
                    ) : (
                      <div className="table-thumb table-thumb--empty">—</div>
                    )}
                  </td>
                  <td>{kit.kit_name}</td>
                  <td>{kit.grade}</td>
                  <td>{kit.subject}</td>
                  <td>{kit.topic}</td>
                  <td className="table-actions">
                    <button className="btn btn--sm btn--outline" onClick={() => openEditModal(kit)}>
                      Edit
                    </button>
                    {kit.kit_image && (
                      <button className="btn btn--sm btn--outline" onClick={() => handleDeleteImage(kit._id)}>
                        Remove Image
                      </button>
                    )}
                    <button className="btn btn--sm btn--danger" onClick={() => handleDelete(kit._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingId ? 'Edit Kit' : 'Add Kit'}
          onClose={() => {
            setShowModal(false);
            setMessage(null);
          }}
          wide
        >
          <form onSubmit={handleSubmit} className="form-grid">
            {message?.type === 'danger' && (
              <div className="alert alert--danger form-grid__full">{message.text}</div>
            )}
            <div>
              <label className="field-label">Kit Name *</label>
              <input
                className="input"
                required
                value={form.kit_name}
                onChange={(e) => setForm({ ...form, kit_name: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Grade *</label>
              <input
                className="input"
                required
                placeholder="Grade 5"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Subject *</label>
              <input
                className="input"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Topic</label>
              <input
                className="input"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </div>
            <div className="form-grid__full">
              <label className="field-label">Description</label>
              <textarea
                className="input"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="form-grid__full">
              <label className="field-label">Learning Outcomes</label>
              <textarea
                className="input"
                rows={3}
                value={form.learning_outcomes}
                onChange={(e) => setForm({ ...form, learning_outcomes: e.target.value })}
              />
            </div>
            <div className="form-grid__full">
              <label className="field-label">Video URL</label>
              <input
                className="input"
                placeholder="https://youtube.com/..."
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Kit Image</label>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => setKitImageFile(e.target.files[0])}
              />
            </div>
            <div>
              <label className="field-label">Manual PDF</label>
              <input
                className="input"
                type="file"
                accept="application/pdf"
                onChange={(e) => setManualPdfFile(e.target.files[0])}
              />
            </div>

            <div className="form-grid__full">
              <button type="submit" className="btn btn--primary btn--block" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Kit' : 'Add Kit'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default ManageKits;
