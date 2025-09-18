"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { FaChevronDown, FaGlobe, FaSpinner } from 'react-icons/fa';

const CurrencyToggle: React.FC = () => {
  const {
    selectedCurrency,
    selectedCountry,
    availableCurrencies,
    availableCountries,
    isLoading,
    setCurrency,
    setCountry,
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on search term
  const filteredCountries = availableCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.isoCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: any) => {
    setCountry(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCurrencySelect = (currency: any) => {
    setCurrency(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
        <FaSpinner className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Select currency"
      >
        <FaGlobe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {selectedCurrency.symbol} {selectedCurrency.isoCode}
        </span>
        <span className="sm:hidden">
          {selectedCurrency.symbol}
        </span>
        <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search countries or currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              autoFocus
            />
          </div>

          {/* Countries List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.isoCode}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    selectedCountry.isoCode === country.isoCode
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold">
                      {country.currency.symbol}
                    </span>
                    <div>
                      <div className="font-medium">{country.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {country.currency.name} ({country.currency.isoCode})
                      </div>
                    </div>
                  </div>
                  {selectedCountry.isoCode === country.isoCode && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No countries found
              </div>
            )}
          </div>

          {/* Quick Currency Selection */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Quick Select Currency
            </div>
            <div className="flex flex-wrap gap-2">
              {availableCurrencies.slice(0, 6).map((currency) => (
                <button
                  key={currency.isoCode}
                  onClick={() => handleCurrencySelect(currency)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-200 ${
                    selectedCurrency.isoCode === currency.isoCode
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {currency.symbol} {currency.isoCode}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyToggle;
