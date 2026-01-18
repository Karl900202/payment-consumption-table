"use client";

import { useState, useRef, useEffect, useMemo } from "react";

interface FilterDropdownProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const FilterDropdownComponent = ({
  options,
  value = "",
  onChange,
  placeholder = "Selected",
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(searchText.toLowerCase())
      ),
    [options, searchText]
  );

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    setIsOpen(false);
    setSearchText("");
  };

  const displayValue = value || placeholder;
  
  return (
    <div className="relative w-[132px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[28px] px-1 py-0.5 border border-gray-300 rounded bg-white text-left flex items-center justify-between"
      >
        <span
          className={`text-xs font-normal truncate min-w-0 flex-1 ${!value ? "text-gray-400" : ""}`}
        >
          {displayValue}
        </span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-500 rounded shadow-lg overflow-hidden">
          <div className="p-1">
            <div className="relative">
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs border border-gray-500 rounded focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="flex flex-col overflow-y-auto">
            <button
              type="button"
              onClick={() => handleSelect("All")}
              className={
                `w-full px-2 py-1.5 text-xs text-left text-gray-700 flex items-center hover:bg-[#EBEBFA] ${value === "All" && "bg-[#EBEBFA]"}`
              }
            >
              <span>All</span>
            </button>
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-2 py-1.5 text-xs text-left text-gray-700 truncate hover:bg-[#EBEBFA] ${
                  value === option && "bg-[#EBEBFA]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const FilterDropdown = FilterDropdownComponent;
