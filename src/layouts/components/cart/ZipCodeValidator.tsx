"use client";

import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTruck, FaGlobe, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface ZipCodeValidatorProps {
  onShippingStatusChange?: (isFreeShipping: boolean, country: string) => void;
}

const ZipCodeValidator: React.FC<ZipCodeValidatorProps> = ({ onShippingStatusChange }) => {
  const [zipCode, setZipCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    country: string;
    isIndia: boolean;
    message: string;
  } | null>(null);

  // Indian ZIP code patterns (6 digits)
  const indianZipPattern = /^[1-9][0-9]{5}$/;

  const validateZipCode = async (code: string) => {
    if (!code.trim()) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);

    try {
      // First check if it's a valid Indian ZIP code format
      if (indianZipPattern.test(code)) {
        // For Indian ZIP codes, assume it's valid and show free shipping
        setValidationResult({
          isValid: true,
          country: "India",
          isIndia: true,
          message: "Free shipping available for Indian locations!"
        });
        onShippingStatusChange?.(true, "India");
        return;
      }

      // For non-Indian ZIP codes, use a geocoding API to determine country
      const response = await fetch(`https://api.zippopotam.us/us/${code}`);
      
      if (response.ok) {
        const data = await response.json();
        setValidationResult({
          isValid: true,
          country: data.country || "United States",
          isIndia: false,
          message: "International shipping available with documentation"
        });
        onShippingStatusChange?.(false, data.country || "United States");
      } else {
        // Try other countries or show international message
        setValidationResult({
          isValid: true,
          country: "International",
          isIndia: false,
          message: "International shipping available with documentation"
        });
        onShippingStatusChange?.(false, "International");
      }
    } catch (error) {
      // If API fails, assume it's international
      setValidationResult({
        isValid: true,
        country: "International",
        isIndia: false,
        message: "International shipping available with documentation"
      });
      onShippingStatusChange?.(false, "International");
    } finally {
      setIsValidating(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setZipCode(value);
    
    if (value.length >= 5) {
      validateZipCode(value);
    } else {
      setValidationResult(null);
      onShippingStatusChange?.(false, "");
    }
  };

  return (
    <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <FaMapMarkerAlt className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark">
            Delivery Location
          </h3>
          <p className="text-sm text-text-light dark:text-darkmode-text-light">
            Enter your ZIP code to check shipping options
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* ZIP Code Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaMapMarkerAlt className="w-4 h-4 text-text-light dark:text-darkmode-text-light" />
          </div>
          <input
            type="text"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="Enter your ZIP code (e.g., 500001)"
            className="w-full pl-12 pr-4 py-3 border-2 border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark placeholder-text-light dark:placeholder-darkmode-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            maxLength={10}
          />
          {isValidating && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            validationResult.isIndia 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                validationResult.isIndia 
                  ? 'bg-green-100 dark:bg-green-800' 
                  : 'bg-amber-100 dark:bg-amber-800'
              }`}>
                {validationResult.isIndia ? (
                  <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <FaExclamationTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {validationResult.isIndia ? (
                    <FaTruck className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <FaGlobe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <h4 className={`font-semibold ${
                    validationResult.isIndia 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-amber-800 dark:text-amber-200'
                  }`}>
                    {validationResult.isIndia ? 'Free Shipping Available!' : 'International Shipping'}
                  </h4>
                </div>
                
                <p className={`text-sm ${
                  validationResult.isIndia 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {validationResult.message}
                </p>

                {/* International Shipping Message */}
                {!validationResult.isIndia && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Deliver to {zipCode}</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      You are just one step away from placing your order and we are eager to ship your favorites. 
                      However, cross border shipping has some documentation work to be done before the order can be dispatched. 
                      We are more than happy to support you here. You just have to share an Indian address along with an ID proof 
                      (Aadhar card) in support of the address. Request you to share these as a reply to the confirmation mail 
                      you receive from us for ease of tracking.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-text-light dark:text-darkmode-text-light">
          <p>• Indian ZIP codes: 6 digits (e.g., 500001, 110001)</p>
          <p>• International ZIP codes will show cross-border shipping requirements</p>
        </div>
      </div>
    </div>
  );
};

export default ZipCodeValidator;
