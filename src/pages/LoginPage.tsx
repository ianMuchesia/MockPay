import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useNotification } from "../components/common/NotificationProvider";
import { useForm } from "react-hook-form";
import { PendingActionsService } from "../utils/PendingActionService";
import { SessionStorageManager } from "../utils/SessionStorageManager";

interface LoginFormData {
  phone: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      phone: "",
      password: "",
      rememberMe: false,
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login({
        phone: data.phone,
        password: data.password,
      }).unwrap();

      dispatch(
        setCredentials({
          token: response.data.api.token,
          refreshToken: response.data.api.refreshToken,
          user: response.data.user,
        })
      );

      showNotification(
        "success",
        "Login Successful",
        `Welcome back, ${response.data.user.firstName}!`
      );

      await PendingActionsService.processPendingActions();

      const redirectUrl = SessionStorageManager.getAndClearRedirectUrl();

      console.log(redirectUrl);
      navigate(redirectUrl || "/dashboard", { replace: true });
    } catch (error: any) {
      showNotification(
        "error",
        "Login Failed",
        error?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  const watchedPhone = watch("phone");
  const watchedPassword = watch("password");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Left Side - Enhanced Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
              <i className="fas fa-credit-card text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">MockPay</h1>
              <p className="text-primary-light">
                Business Subscription Platform
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 py-12">
          <div className="mb-16">
            <h2 className="text-5xl font-bold mb-8 leading-tight">
              Welcome Back to Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-100">
                Business Journey
              </span>
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Access exclusive offers, manage subscriptions, and connect with
              amazing local businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {[
              {
                icon: "fa-star",
                title: "Premium Access",
                text: "Unlock exclusive business offers and subscription benefits",
              },
              {
                icon: "fa-users",
                title: "Community Driven",
                text: "Join thousands of users supporting local businesses",
              },
              {
                icon: "fa-shield-alt",
                title: "Secure & Trusted",
                text: "Your data and transactions are always protected",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${item.icon} text-xl`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-white/80">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/20 text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} MockPay. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Enhanced Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg">
          {/* Mobile Header */}
          <div className="text-center md:hidden mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-3xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-credit-card text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-primary font-display">
              MockPay
            </h1>
            <p className="text-neutral-600">Business Subscription Platform</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-neutral-100">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-neutral-800 mb-3">
                Welcome Back
              </h2>
              <p className="text-neutral-600 text-lg">
                Sign in to access your account and continue your business
                journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-neutral-800 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i
                      className={`fas fa-phone transition-colors ${
                        errors.phone
                          ? "text-red-500"
                          : watchedPhone
                          ? "text-primary"
                          : "text-neutral-400"
                      }`}
                    ></i>
                  </div>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(?:\+254\d{9}|07\d{8})$/,
                        message:
                          "Please enter a valid phone number (07... or +254...)",
                      },
                    })}
                    type="tel"
                    id="phone"
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg font-medium transition-all focus:outline-none ${
                      errors.phone
                        ? "border-red-300 focus:border-red-500 bg-red-50"
                        : "border-neutral-200 focus:border-primary bg-white hover:border-neutral-300"
                    }`}
                    placeholder="+254 712 345 678"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-neutral-800 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i
                      className={`fas fa-lock transition-colors ${
                        errors.password
                          ? "text-red-500"
                          : watchedPassword
                          ? "text-primary"
                          : "text-neutral-400"
                      }`}
                    ></i>
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl text-lg font-medium transition-all focus:outline-none ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 bg-red-50"
                        : "border-neutral-200 focus:border-primary bg-white hover:border-neutral-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-primary transition-colors"
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    {...register("rememberMe")}
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="relative">
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all ${
                        watch("rememberMe")
                          ? "bg-primary border-primary"
                          : "border-neutral-300 hover:border-primary"
                      }`}
                    >
                      {watch("rememberMe") && (
                        <i className="fas fa-check text-white text-xs absolute inset-0 flex items-center justify-center"></i>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-neutral-700 font-medium">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner />
                    <span className="ml-3">Signing you in...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-sign-in-alt mr-3"></i>
                    Sign In
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-neutral-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    name: "google",
                    color: "hover:bg-red-50 hover:border-red-200",
                    icon: "fab fa-google text-red-500",
                  },
                  {
                    name: "facebook",
                    color: "hover:bg-blue-50 hover:border-blue-200",
                    icon: "fab fa-facebook text-blue-600",
                  },
                  {
                    name: "apple",
                    color: "hover:bg-neutral-100 hover:border-neutral-300",
                    icon: "fab fa-apple text-neutral-800",
                  },
                ].map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    className={`flex items-center justify-center py-4 px-4 border-2 border-neutral-200 rounded-xl font-medium transition-all ${provider.color}`}
                  >
                    <i className={`${provider.icon} text-xl`}></i>
                  </button>
                ))}
              </div>
            </form>

            <div className="text-center mt-10 pt-8 border-t border-neutral-100">
              <p className="text-neutral-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-bold hover:text-primary-dark transition-colors"
                >
                  Create your account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
