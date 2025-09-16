"use client";

import { CustomerError } from "@/lib/shopify/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState, Suspense } from "react";
import { BiLoaderAlt } from "react-icons/bi";

export const dynamic = "force-dynamic";

export interface FormData {
  firstName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const SignUpContent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ code: string; message: string; field?: string[]; }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password requirements
    if (name === "password") {
      setPasswordRequirements({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
      });
    }
  };

  const validateForm = (): boolean => {
    const errors = [];
    
    if (!formData.firstName?.trim()) {
      errors.push({ code: "MISSING_FIRST_NAME", message: "First name is required" });
    }
    
    if (!formData.email?.trim()) {
      errors.push({ code: "MISSING_EMAIL", message: "Email is required" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push({ code: "INVALID_EMAIL", message: "Please enter a valid email address" });
    }
    
    if (!formData.password) {
      errors.push({ code: "MISSING_PASSWORD", message: "Password is required" });
    } else if (!Object.values(passwordRequirements).every(req => req)) {
      errors.push({ code: "WEAK_PASSWORD", message: "Password does not meet requirements" });
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push({ code: "PASSWORD_MISMATCH", message: "Passwords do not match" });
    }
    
    setErrorMessages(errors);
    return errors.length === 0;
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/customer/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setErrorMessages([]);
        const data = responseData;
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/");
      } else {
        const errors = responseData.errors || [];
        setErrorMessages(errors);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrorMessages([{ code: "NETWORK_ERROR", message: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-darkmode-light login-bg">
      <div className="container py-8">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary hover:text-[#600018] transition-colors duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            {/* Registration Card */}
            <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-2xl p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-darkmode-text-dark mb-2">
                  Create Account
                </h1>
                <p className="text-text-light dark:text-darkmode-text-light">
                  Join VLNS Home Foods and discover authentic flavors
              </p>
            </div>

              {/* Registration Form */}
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* First Name Field */}
              <div>
                  <label className="block text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-text-light dark:text-darkmode-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                <input
                      className="w-full pl-10 pr-4 py-3 border-2 border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark placeholder-text-light dark:placeholder-darkmode-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                  type="text"
                  onChange={handleChange}
                      name="firstName"
                      required
                />
                  </div>
              </div>

                {/* Email Field */}
              <div>
                  <label className="block text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-text-light dark:text-darkmode-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                <input
                      className="w-full pl-10 pr-4 py-3 border-2 border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark placeholder-text-light dark:placeholder-darkmode-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email address"
                  type="email"
                  onChange={handleChange}
                      name="email"
                      required
                />
                  </div>
              </div>

                {/* Password Field */}
              <div>
                  <label className="block text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-text-light dark:text-darkmode-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                <input
                      className="w-full pl-10 pr-12 py-3 border-2 border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark placeholder-text-light dark:placeholder-darkmode-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Create a strong password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange}
                  name="password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4 text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-text-light dark:text-darkmode-text-light">Password Requirements:</p>
                      <div className="space-y-1">
                        <div className={`flex items-center text-xs ${passwordRequirements.length ? 'text-green-600' : 'text-red-500'}`}>
                          <svg className={`w-3 h-3 mr-2 ${passwordRequirements.length ? 'text-green-600' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          At least 8 characters
                        </div>
                        <div className={`flex items-center text-xs ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                          <svg className={`w-3 h-3 mr-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          One uppercase letter
                        </div>
                        <div className={`flex items-center text-xs ${passwordRequirements.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                          <svg className={`w-3 h-3 mr-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          One lowercase letter
                        </div>
                        <div className={`flex items-center text-xs ${passwordRequirements.number ? 'text-green-600' : 'text-red-500'}`}>
                          <svg className={`w-3 h-3 mr-2 ${passwordRequirements.number ? 'text-green-600' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          One number
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-text-light dark:text-darkmode-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      className="w-full pl-10 pr-12 py-3 border-2 border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark placeholder-text-light dark:placeholder-darkmode-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                  onChange={handleChange}
                      name="confirmPassword"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4 text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
              </div>

                {/* Error Messages */}
              {errorMessages.map((error) => (
                  <div
                  key={error.code}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                >
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {error.message}
                </p>
                  </div>
              ))}

                {/* Sign Up Button */}
              <button
                type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-[#600018] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center"
              >
                {loading ? (
                    <>
                      <BiLoaderAlt className="animate-spin w-5 h-5 mr-2" />
                      Creating Account...
                    </>
                ) : (
                    "Create Account"
                )}
              </button>
            </form>

              {/* Divider */}
              <div className="my-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border dark:border-darkmode-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-darkmode-body text-text-light dark:text-darkmode-text-light">
                      Already have an account?
                    </span>
                  </div>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
              <Link
                  href="/login"
                  className="inline-flex items-center text-primary hover:text-[#600018] font-semibold transition-colors duration-300"
              >
                  Sign In
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
              </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-text-light dark:text-darkmode-text-light">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:text-[#600018] transition-colors duration-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:text-[#600018] transition-colors duration-300">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUp = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-light dark:bg-darkmode-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <BiLoaderAlt className="animate-spin w-8 h-8 text-white" />
          </div>
          <p className="text-text-light dark:text-darkmode-text-light">Loading...</p>
        </div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUp;
