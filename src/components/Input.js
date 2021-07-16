import { AlertTriangle } from "react-feather";
import classNames from "classnames";

function Input({ label, labelFor, errors, icon, ...props }) {
  const inputClasses = classNames(
    "appearance-none",
    "border",
    "border-secondary-dark-grey",
    "rounded",
    "w-full",
    "text-gray-700",
    "mt-1",
    "leading-tight",
    "focus:outline-none",
    "focus:shadow-outline",
    "h-14",
    "flex",
    "flex-col",
    "p-2",
    "max-w-md",
    "z-10",
    {
      "border-semantic-red": errors,
    },
  );

  return (
    <div>
      <label htmlFor={props.id}>
        <div className={inputClasses}>
          {label ? (
            <span className="text-xs text-dark-grey leading-4 h-4">
              {label}
            </span>
          ) : null}

          <div className="flex flex-row items-center justify-between w-full">
            <input className="focus:outline-none w-full" {...props} />
            {icon}
          </div>
        </div>
      </label>

      {errors ? (
        <div className="flex flex-row items-center mt-0.5">
          <AlertTriangle size={24} color="#EB4D3E" />
          <span className="text-semantic-red ml-2 text-sm">{errors}</span>
        </div>
      ) : null}
    </div>
  );
}

export default Input;
