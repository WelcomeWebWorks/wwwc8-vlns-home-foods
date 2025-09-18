"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  isoCode: string;
  name: string;
  symbol: string;
}

export interface Country {
  isoCode: string;
  name: string;
  currency: Currency;
  unitSystem: string;
}

export interface CurrencyContextType {
  selectedCurrency: Currency;
  selectedCountry: Country;
  availableCurrencies: Currency[];
  availableCountries: Country[];
  isLoading: boolean;
  setCurrency: (currency: Currency) => void;
  setCountry: (country: Country) => void;
  formatPrice: (amount: string, currencyCode?: string) => string;
  getCurrencySymbol: (currencyCode?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Default currencies for fallback
const DEFAULT_CURRENCIES: Currency[] = [
  { isoCode: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { isoCode: 'USD', name: 'US Dollar', symbol: '$' },
  { isoCode: 'EUR', name: 'Euro', symbol: '€' },
  { isoCode: 'GBP', name: 'British Pound', symbol: '£' },
  { isoCode: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { isoCode: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

const DEFAULT_COUNTRIES: Country[] = [
  { isoCode: 'IN', name: 'India', currency: DEFAULT_CURRENCIES[0], unitSystem: 'metric' },
  { isoCode: 'US', name: 'United States', currency: DEFAULT_CURRENCIES[1], unitSystem: 'imperial' },
  { isoCode: 'FR', name: 'France', currency: DEFAULT_CURRENCIES[2], unitSystem: 'metric' },
  { isoCode: 'GB', name: 'United Kingdom', currency: DEFAULT_CURRENCIES[3], unitSystem: 'metric' },
  { isoCode: 'CA', name: 'Canada', currency: DEFAULT_CURRENCIES[4], unitSystem: 'metric' },
  { isoCode: 'AU', name: 'Australia', currency: DEFAULT_CURRENCIES[5], unitSystem: 'metric' },
];

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(DEFAULT_CURRENCIES[0]);
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRIES[0]);
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);
  const [availableCountries, setAvailableCountries] = useState<Country[]>(DEFAULT_COUNTRIES);
  const [isLoading, setIsLoading] = useState(true);

  // Load currency data from Shopify
  useEffect(() => {
    const loadCurrencyData = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch available countries and currencies from Shopify
        const response = await fetch('/api/currencies', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.countries && data.countries.length > 0) {
            setAvailableCountries(data.countries);
            setAvailableCurrencies(data.currencies);
            
            // Set default country/currency from data
            const defaultCountry = data.countries.find((c: Country) => c.isoCode === 'IN') || data.countries[0];
            setSelectedCountry(defaultCountry);
            setSelectedCurrency(defaultCountry.currency);
          }
        }
      } catch (error) {
        console.warn('Failed to load currency data from Shopify, using defaults:', error);
        // Use default currencies if API fails
        setAvailableCurrencies(DEFAULT_CURRENCIES);
        setAvailableCountries(DEFAULT_COUNTRIES);
        setSelectedCurrency(DEFAULT_CURRENCIES[0]);
        setSelectedCountry(DEFAULT_COUNTRIES[0]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrencyData();
  }, []);

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      const savedCountry = localStorage.getItem('selectedCountry');
      
      if (savedCurrency) {
        try {
          const currency = JSON.parse(savedCurrency);
          setSelectedCurrency(currency);
        } catch (error) {
          console.warn('Failed to parse saved currency:', error);
        }
      }
      
      if (savedCountry) {
        try {
          const country = JSON.parse(savedCountry);
          setSelectedCountry(country);
        } catch (error) {
          console.warn('Failed to parse saved country:', error);
        }
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency));
      localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
    }
  }, [selectedCurrency, selectedCountry, isLoading]);

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    // Find corresponding country
    const country = availableCountries.find(c => c.currency.isoCode === currency.isoCode);
    if (country) {
      setSelectedCountry(country);
    }
  };

  const setCountry = (country: Country) => {
    setSelectedCountry(country);
    setSelectedCurrency(country.currency);
  };

  const formatPrice = (amount: string, currencyCode?: string): string => {
    const code = currencyCode || selectedCurrency.isoCode;
    const symbol = getCurrencySymbol(code);
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(amount));
    } catch (error) {
      // Fallback to simple formatting
      return `${symbol}${parseFloat(amount).toFixed(2)}`;
    }
  };

  const getCurrencySymbol = (currencyCode?: string): string => {
    const code = currencyCode || selectedCurrency.isoCode;
    const currency = availableCurrencies.find(c => c.isoCode === code);
    return currency?.symbol || selectedCurrency.symbol;
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    selectedCountry,
    availableCurrencies,
    availableCountries,
    isLoading,
    setCurrency,
    setCountry,
    formatPrice,
    getCurrencySymbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
