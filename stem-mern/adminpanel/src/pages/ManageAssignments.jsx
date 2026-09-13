import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const ManageAssignments = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [unassignedKits, setUnassignedKits] = useState([]);
  const [selectedKitIds, setSelectedKitIds] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/schools').then(({ data }) => {
      if (data.success) setSchools(data.schools);
    });
  }, []);

  const loadAssignments = async (schoolId) => {
    if (!schoolId) {
      setAssignments([]);
      setUnassignedKits([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/assignments/${schoolId}`);
      if (data.success) {
        setAssignments(data.assignments);
        setUnassignedKits(data.unassignedKits);
        setSelectedKitIds([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolChange = (e) => {
    const id = e.target.value;
    setSelectedSchool(id);
    setMessage(null);
    loadAssignments(id);
  };

  const toggleKit = (kitId) => {
    setSelectedKitIds((prev) =>
      prev.includes(kitId) ? prev.filter((k) => k !== kitId) : [...prev, kitId]
    );
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (selectedKitIds.length === 0) {
      setMessage({ type: 'warning', text: 'Please select at least one kit to assign.' });
      return;
    }
    const { data } = await api.post('/admin/assignments', {
      school_id: selectedSchool,
      kit_ids: selectedKitIds
    });
    setMessage({ type: 'success', text: data.message });
    loadAssignments(selectedSchool);
  };

  const handleRemove = async (assignmentId) => {
    if (!window.confirm('Remove this kit assignment?')) return;
    const { data } = await api.delete(`/admin/assignments/${assignmentId}`);
    setMessage({ type: 'success', text: data.message });
    loadAssignments(selectedSchool);
  };

  return (
    <Layout>
      <h1 className="page-title">Assignments</h1>
      <p className="page-subtitle">Assign STEM kits to a school, or remove existing assignments</p>

      <div className="panel" style={{ marginBottom: 20 }}>
        <label className="field-label">Select School</label>
        <select className="input" value={selectedSchool} onChange={handleSchoolChange}>
          <option value="">-- Choose a school --</option>
          {schools.map((s) => (
            <option key={s._id} value={s._id}>
              {s.school_name} ({s.email})
            </option>
          ))}
        </select>
      </div>

      {message && <div className={`alert alert--${message.type}`}>{message.text}</div>}

      {selectedSchool && !loading && (
        <div className="panel-grid">
          <div className="panel">
            <h3>Assigned Kits ({assignments.length})</h3>
            {assignments.length === 0 && <p className="muted">No kits assigned yet.</p>}
            <ul className="assignment-list">
              {assignments.map((a) => (
                <li key={a._id}>
                  <div>
                    <strong>{a.kit?.kit_name}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {a.kit?.grade} · {a.kit?.subject}
                    </div>
                  </div>
                  <button className="btn btn--sm btn--danger" onClick={() => handleRemove(a._id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h3>Assign New Kits</h3>
            {unassignedKits.length === 0 ? (
              <p className="muted">All kits are already assigned to this school.</p>
            ) : (
              <form onSubmit={handleAssign}>
                <ul className="assignment-list assignment-list--select">
                  {unassignedKits.map((kit) => (
                    <li key={kit._id}>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedKitIds.includes(kit._id)}
                          onChange={() => toggleKit(kit._id)}
                        />
                        <span>
                          <strong>{kit.kit_name}</strong>
                          <span className="muted" style={{ fontSize: 12, display: 'block' }}>
                            {kit.grade} · {kit.subject}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <button type="submit" className="btn btn--primary btn--block">
                  Assign Selected Kits
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageAssignments;
