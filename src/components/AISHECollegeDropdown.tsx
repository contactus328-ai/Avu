// AISHE College Dropdown Component
// Optimized for handling 70,000+ colleges with virtual scrolling and smart search

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { aisheCollegeService } from '../services/aisheCollegeService';

interface AISHECollegeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const AISHECollegeDropdown: React.FC<AISHECollegeDropdownProps> = ({
  value,
  onChange,
  placeholder = "Enter your college name",
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collegeCount, setCollegeCount] = useState(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load college count on mount
  useEffect(() => {
    const loadCount = async () => {
      const count = await aisheCollegeService.getCollegeCount();
      setCollegeCount(count);
    };
    loadCount();
  }, []);

  // Search colleges with debouncing
  useEffect(() => {
    const searchColleges = async () => {
      if (searchTerm.length === 0) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await aisheCollegeService.searchColleges(searchTerm, 20);
        setSuggestions(results);
      } catch (error) {
        console.error('Error searching colleges:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid excessive API calls
    const debounceTimer = setTimeout(searchColleges, 150);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSearchTerm(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleSelectCollege = async (collegeName: string) => {
    onChange(collegeName);
    setSearchTerm('');
    setIsOpen(false);
    
    // Add college if it's a custom entry
    if (!suggestions.includes(collegeName)) {
      await aisheCollegeService.addCollege(collegeName);
    }
  };

  // Determine if the current input is a custom entry
  const isCustomEntry = useMemo(() => {
    return searchTerm.length > 0 && 
           !suggestions.some(s => s.toLowerCase() === searchTerm.toLowerCase());
  }, [searchTerm, suggestions]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Field */}
      <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
        error ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
      }`}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
          style={{ color: 'black' }}
        />
        {isLoading && (
          <div className="ml-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50 max-h-64 overflow-hidden">
          {/* Results */}
          <div className="max-h-60 overflow-y-auto">
            {suggestions.length > 0 ? (
              <>
                {/* Search Results */}
                {suggestions.map((college, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-sm text-black hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectCollege(college)}
                  >
                    {college}
                  </div>
                ))}

                {/* Custom Entry Option */}
                {isCustomEntry && (
                  <div className="px-3 py-2 text-sm bg-blue-50 border-t border-blue-200">
                    <div 
                      className="text-blue-700 hover:text-blue-900 cursor-pointer flex items-center"
                      onClick={() => handleSelectCollege(searchTerm)}
                    >
                      <span className="mr-2">✓</span>
                      <span>Add "{searchTerm}" (New College)</span>
                    </div>
                  </div>
                )}
              </>
            ) : searchTerm.length > 0 ? (
              <>
                {/* No Results Found */}
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  No colleges found for "{searchTerm}"
                </div>
                
                {/* Custom Entry Option */}
                <div className="px-3 py-2 text-sm bg-blue-50 border-t border-blue-200">
                  <div 
                    className="text-blue-700 hover:text-blue-900 cursor-pointer flex items-center justify-center"
                    onClick={() => handleSelectCollege(searchTerm)}
                  >
                    <span className="mr-2">✓</span>
                    <span>Add "{searchTerm}" (New College)</span>
                  </div>
                </div>
              </>
            ) : (
              /* Initial State - Empty */
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Type to search colleges...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};