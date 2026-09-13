const Modal = ({ title, onClose, children, wide }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className={`modal${wide ? ' modal--wide' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="modal__header">
        <h3>{title}</h3>
        <button className="modal__close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="modal__body">{children}</div>
    </div>
  </div>
);

export default Modal;
