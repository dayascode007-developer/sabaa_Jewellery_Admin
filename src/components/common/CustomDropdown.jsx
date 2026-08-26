"use client";

import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < 250 && spaceAbove > 250);
    }
  }, [isOpen]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-black font-medium text-left flex items-center justify-between hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style={{ "--tw-ring-color": "var(--primary)" }}
        >
          <span className={selectedOption ? "text-black" : "text-gray-500"}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <MdKeyboardArrowDown
            size={20}
            className={`text-gray-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className={`absolute left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto ${
            openUpward
              ? "bottom-full mb-1"
              : "top-full mt-1"
          }`}>
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selectedOption?.id === option.id
                    ? "bg-gray-100 text-black border-l-4"
                    : "text-black hover:bg-gray-50"
                }`}
                style={
                  selectedOption?.id === option.id
                    ? { borderLeftColor: "var(--primary)" }
                    : {}
                }
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
