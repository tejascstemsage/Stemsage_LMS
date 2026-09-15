import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../api/axios';

const emptyForm = { school_name: '', email: '', contact: '', password: '', is_active: true };

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchSchools = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/schools');
    if (data.success) setSchools(data.schools);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (school) => {
    setEditingId(school._id);
    setForm({
      school_name: school.school_name,
      email: school.email,
      contact: school.contact || '',
      password: '',
      is_active: school.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = { ...form };
    if (editingId && !payload.password) delete payload.password;

    try {
      let res;
      if (editingId) {
        res = await api.put(`/admin/schools/${editingId}`, payload);
      } else {
        res = await api.post('/admin/schools', payload);
      }
      setMessage({ type: 'success', text: res.data.message });
      setShowModal(false);
      fetchSchools();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this school? Its kit assignments will also be removed.')) return;
    const { data } = await api.delete(`/admin/schools/${id}`);
    setMessage({ type: 'success', text: data.message });
    fetchSchools();
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Schools</h1>
          <p className="page-subtitle">Add, edit or remove school accounts</p>
        </div>
        <button className="btn btn--primary" onClick={openAddModal}>
          + Add School
        </button>
      </div>

      {message && <div className={`alert alert--${message.type}`}>{message.text}</div>}

      {loading ? (
        <p>Loading schools...</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted" style={{ textAlign: 'center', padding: 24 }}>
                    No schools added yet.
                  </td>
                </tr>
              )}
              {schools.map((school) => (
                <tr key={school._id}>
                  <td>{school.school_name}</td>
                  <td>{school.email}</td>
                  <td>{school.contact}</td>
                  <td>
                    <span className={`badge ${school.is_active ? 'badge--success' : 'badge--muted'}`}>
                      {school.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button className="btn btn--sm btn--outline" onClick={() => openEditModal(school)}>
                      Edit
                    </button>
                    <button className="btn btn--sm btn--danger" onClick={() => handleDelete(school._id)}>
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
          title={editingId ? 'Edit School' : 'Add School'}
          onClose={() => {
            setShowModal(false);
            setMessage(null);
          }}
        >
          <form onSubmit={handleSubmit}>
            {message?.type === 'danger' && <div className="alert alert--danger">{message.text}</div>}
            <label className="field-label">School Name *</label>
            <input
              className="input"
              required
              value={form.school_name}
              onChange={(e) => setForm({ ...form, school_name: e.target.value })}
            />

            <label className="field-label">Email *</label>
            <input
              className="input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label className="field-label">Contact</label>
            <input
              className="input"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />

            <label className="field-label">
              Password {editingId && <span className="muted">(leave blank to keep current)</span>} {!editingId && '*'}
            </label>
            <input
              className="input"
              type="password"
              required={!editingId}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Active (school can log in)
            </label>

            <button type="submit" className="btn btn--primary btn--block" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update School' : 'Add School'}
            </button>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default ManageSchools;
