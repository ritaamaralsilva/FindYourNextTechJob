export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  minLength,
}) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="form-control"
        required={required}
        minLength={minLength}
      />
    </div>
  );
}
