const Input = ({
  label,
  error,
  icon: Icon,
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrap relative">
        {Icon && (
          <div className="input-icon-wrap absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`input-field ${Icon ? "pl-10" : ""} ${error ? "error" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1 animate-slide-up">
          <svg
            className="w-3 h-3 flex-shrink-0"
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
