const Modal = ({ title, onClose, children, wide }) => (
  // mousedown, not click: a text-selection drag released over the overlay fires click on it
  <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className={`modal${wide ? ' modal--wide' : ''}`}>
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
