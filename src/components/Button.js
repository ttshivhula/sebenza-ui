import Loader from "components/Loader";

function Button({ loading, text, ...props }) {
  return (
    <button
      className="bg-primary text-black text-md mt-8 h-12 rounded text-dark-grey font-bold w-full hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50 focus:ring-offset-2"
      {...props}
    >
      {loading ? <Loader /> : text}
    </button>
  );
}

export default Button;
