import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import KitCard from '../components/KitCard';
import Modal from '../components/Modal';
import api, { resolveFileUrl } from '../api/axios';

const getYouTubeEmbed = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const Dashboard = () => {
  const [kits, setKits] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [totalKits, setTotalKits] = useState(0);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [videoUrl, setVideoUrl] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [outcomesText, setOutcomesText] = useState(null);

  const fetchKits = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/kits/school', {
        params: { page, search, grade: gradeFilter, subject: subjectFilter }
      });
      if (data.success) {
        setKits(data.kits);
        setGrades(data.grades);
        setSubjects(data.subjects);
        setTotalKits(data.total_kits);
        setTotalFiltered(data.total_filtered);
        setTotalPages(data.total_pages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, gradeFilter, subjectFilter]);

  useEffect(() => {
    fetchKits();
  }, [fetchKits]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchKits();
  };

  const embedUrl = videoUrl ? getYouTubeEmbed(videoUrl) : null;

  return (
    <div className="page">
      <Navbar />

      <main className="dashboard">
        <div className="dashboard__header">
          <h1>Your STEM Kits</h1>
          <p>{totalKits} kit{totalKits !== 1 ? 's' : ''} assigned to your school</p>
        </div>

        <form className="dashboard__filters" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="input"
            placeholder="Search by name, topic or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input"
            value={gradeFilter}
            onChange={(e) => {
              setGradeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn--primary">
            Search
          </button>
        </form>

        {loading ? (
          <div className="empty-state">Loading kits...</div>
        ) : kits.length === 0 ? (
          <div className="empty-state">No kits found matching your criteria.</div>
        ) : (
          <>
            <div className="kit-grid">
              {kits.map((kit) => (
                <KitCard
                  key={kit._id}
                  kit={kit}
                  onWatchVideo={setVideoUrl}
                  onViewPdf={setPdfFile}
                  onShowOutcomes={setOutcomesText}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn--sm btn--outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages} ({totalFiltered} results)
                </span>
                <button
                  className="btn btn--sm btn--outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {videoUrl && (
        <Modal title="Kit Video" onClose={() => setVideoUrl(null)}>
          {embedUrl ? (
            <iframe
              width="100%"
              height="400"
              src={embedUrl}
              title="Kit video"
              allowFullScreen
              style={{ border: 0, borderRadius: 8 }}
            />
          ) : (
            <a href={videoUrl} target="_blank" rel="noreferrer">
              Open video link
            </a>
          )}
        </Modal>
      )}

      {pdfFile && (
        <Modal title="Kit Manual" onClose={() => setPdfFile(null)}>
          <iframe
            width="100%"
            height="500"
            src={resolveFileUrl(pdfFile, 'kits')}
            title="Kit manual"
            style={{ border: 0, borderRadius: 8 }}
          />
        </Modal>
      )}

      {outcomesText && (
        <Modal title="Learning Outcomes" onClose={() => setOutcomesText(null)}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{outcomesText}</p>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
