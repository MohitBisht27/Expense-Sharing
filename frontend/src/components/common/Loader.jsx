import { Loader2 } from "lucide-react";

const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-9 h-9",
    lg: "w-14 h-14",
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-4 border-slate-100`} />
        <Loader2
          className={`${sizes[size]} animate-spin text-indigo-500 absolute inset-0`}
          strokeWidth={2.5}
        />
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-400">{text}</p>
      )}
    </div>
  );
};

export default Loader;
