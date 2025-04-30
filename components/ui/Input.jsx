export default function Input({
  label,
  id,
  type = 'text',
  className = '',
  error,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`w-full border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
