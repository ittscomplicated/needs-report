// src/components/Button.js
import PropTypes from 'prop-types';

function Button({ children, onClick, type = 'primary', className = '' }) {
  const baseStyles = 'px-6 py-3 rounded-lg text-lg font-semibold transition';
  const typeStyles =
    type === 'primary'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${typeStyles} ${className}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
};

export default Button;
