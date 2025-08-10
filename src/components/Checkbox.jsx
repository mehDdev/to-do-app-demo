import { Check } from "lucide-react";
import { useState } from "react";

function Checkbox({ label, checked, onClick: clickHandler }) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    clickHandler()
  };

  return (
    <label className="flex items-center cursor-pointer gap-3 select-none">
      <div
        onClick={handleToggle}
        className={`size-6.5 rounded border-2 flex items-center justify-center shrink-0 border-custom-purple transition-colors ${isChecked ? "bg-custom-purple " : "bg-transparent"} text-wrap`}
      >
        { isChecked && <Check className="text-custom-white" /> }
      </div>
      <span className={`text-xl font-medium text-black dark:text-white ${isChecked && '!text-custom-black/50 dark:!text-custom-white/50 line-through'}`}>{label}</span>
    </label>
  );
};
export default Checkbox;