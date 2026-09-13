import { resolveFileUrl } from '../api/axios';

const KitCard = ({ kit, onWatchVideo, onViewPdf, onShowOutcomes }) => {
  const outcomesSnippet =
    kit.learning_outcomes?.length > 80
      ? `${kit.learning_outcomes.slice(0, 80)}...`
      : kit.learning_outcomes;

  return (
    <div className="kit-card">
      <div className="kit-card__image">
        {kit.kit_image ? (
          <img src={resolveFileUrl(kit.kit_image, 'kits')} alt={kit.kit_name} />
        ) : (
          <div className="kit-card__image-placeholder">
            <span>{kit.subject?.[0] || 'K'}</span>
          </div>
        )}
        <span className="kit-card__grade-badge">{kit.grade}</span>
      </div>

      <div className="kit-card__body">
        <span className="kit-card__subject">{kit.subject}</span>
        <h3 className="kit-card__title">{kit.kit_name}</h3>
        {kit.topic && <p className="kit-card__topic">{kit.topic}</p>}
        {outcomesSnippet && <p className="kit-card__outcomes">{outcomesSnippet}</p>}

        <div className="kit-card__actions">
          {kit.video_url && (
            <button className="btn btn--sm btn--outline" onClick={() => onWatchVideo(kit.video_url)}>
              ▶ Watch Video
            </button>
          )}
          {kit.manual_pdf && (
            <button className="btn btn--sm btn--outline" onClick={() => onViewPdf(kit.manual_pdf)}>
              📄 Manual
            </button>
          )}
          {kit.learning_outcomes && (
            <button className="btn btn--sm btn--outline" onClick={() => onShowOutcomes(kit.learning_outcomes)}>
              🎯 Outcomes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitCard;
