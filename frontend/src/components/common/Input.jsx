const Input = ({
  label,
  error,
  icon: Icon,
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} className={containerClassName}>
      {label && <label className="input-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Icon style={{ width: '1rem', height: '1rem' }} />
          </div>
        )}
        <input
          className={`input-field ${error ? "error" : ""} ${className}`}
          style={Icon ? { paddingLeft: '2.5rem' } : undefined}
          {...props}
        />
      </div>
      {error && (
        <span className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1 animate-slide-up">
          <svg
            style={{ width: '0.75rem', height: '0.75rem', flexShrink: 0 }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
