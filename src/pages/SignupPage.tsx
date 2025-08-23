import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useNotification } from "../components/common/NotificationProvider";
import { PendingActionsService } from "../utils/PendingActionService";
import { SessionStorageManager } from "../utils/SessionStorageManager";

interface SignupFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: "INDIVIDUAL" | "COMPANY";
  alertChannel: "EMAIL" | "PHONE";
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<SignupFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "INDIVIDUAL",
      alertChannel: "EMAIL",
      agreeToTerms: false,
      subscribeNewsletter: false,
    },
  });

  const [registerUser, { isLoading }] = useRegisterMutation();

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");
  const watchedUserType = watch("userType");

  const onSubmit = async (data: SignupFormData) => {
    try {
      const {
        confirmPassword,
        agreeToTerms,
        subscribeNewsletter,
        ...registerData
      } = data;

      const response = await registerUser({
        ...registerData,
        name: data.firstName + " " + data.lastName,
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
        "Account Created Successfully",
        `Welcome to MockPay, ${response.data.user.firstName}!`
      );

      await PendingActionsService.processPendingActions();

      const redirectUrl = SessionStorageManager.getAndClearRedirectUrl();
      navigate(redirectUrl || "/dashboard", { replace: true });
    } catch (error: any) {
      showNotification(
        "error",
        "Registration Failed",
        error?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(watchedPassword || "");
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Left Side - Enhanced Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white p-12 flex-col justify-between relative overflow-hidden">
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
            <h2 className="text-4xl font-bold mb-8 leading-tight">
              Start Your Journey with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-100">
                Local Businesses
              </span>
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of users discovering amazing local businesses and
              exclusive subscription benefits.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: "fa-rocket",
                title: "Quick & Easy Setup",
                text: "Get started in minutes with our streamlined registration",
              },
              {
                icon: "fa-gift",
                title: "Instant Benefits",
                text: "Access exclusive offers immediately after registration",
              },
              {
                icon: "fa-heart",
                title: "Support Local",
                text: "Help local businesses thrive in your community",
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

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl">
          {/* Mobile Header */}
          <div className="text-center lg:hidden mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-3xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-credit-card text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-primary font-display">
              MockPay
            </h1>
            <p className="text-neutral-600">Business Subscription Platform</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-neutral-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-800 mb-3">
                Create Your Account
              </h2>
              <p className="text-neutral-600 text-lg">
                Join MockPay and start exploring amazing local businesses
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: "INDIVIDUAL",
                      icon: "fa-user",
                      label: "Individual",
                      desc: "Personal account",
                    },
                    {
                      value: "COMPANY",
                      icon: "fa-building",
                      label: "Company",
                      desc: "Business account",
                    },
                  ].map((type) => (
                    <label key={type.value} className="cursor-pointer">
                      <input
                        {...register("userType")}
                        type="radio"
                        value={type.value}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 border-2 rounded-2xl transition-all ${
                          watchedUserType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <i
                            className={`fas ${type.icon} text-2xl ${
                              watchedUserType === type.value
                                ? "text-primary"
                                : "text-neutral-400"
                            }`}
                          ></i>
                        </div>
                        <h3
                          className={`font-semibold text-center ${
                            watchedUserType === type.value
                              ? "text-primary"
                              : "text-neutral-800"
                          }`}
                        >
                          {type.label}
                        </h3>
                        <p className="text-sm text-neutral-600 text-center">
                          {type.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-neutral-800 mb-2"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i
                        className={`fas fa-user transition-colors ${
                          errors.firstName
                            ? "text-red-500"
                            : watch("firstName")
                            ? "text-primary"
                            : "text-neutral-400"
                        }`}
                      ></i>
                    </div>
                    <input
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters",
                        },
                      })}
                      type="text"
                      id="firstName"
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg font-medium transition-all focus:outline-none ${
                        errors.firstName
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-neutral-200 focus:border-primary bg-white hover:border-neutral-300"
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-neutral-800 mb-2"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i
                        className={`fas fa-user transition-colors ${
                          errors.lastName
                            ? "text-red-500"
                            : watch("lastName")
                            ? "text-primary"
                            : "text-neutral-400"
                        }`}
                      ></i>
                    </div>
                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters",
                        },
                      })}
                      type="text"
                      id="lastName"
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg font-medium transition-all focus:outline-none ${
                        errors.lastName
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-neutral-200 focus:border-primary bg-white hover:border-neutral-300"
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            : watch("phone")
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

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-neutral-800 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i
                        className={`fas fa-envelope transition-colors ${
                          errors.email
                            ? "text-red-500"
                            : watch("email")
                            ? "text-primary"
                            : "text-neutral-400"
                        }`}
                      ></i>
                    </div>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      type="email"
                      id="email"
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg font-medium transition-all focus:outline-none ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-neutral-200 focus:border-primary bg-white hover:border-neutral-300"
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        onChange: () => {
                          if (watchedConfirmPassword) {
                            trigger("confirmPassword");
                          }
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl text-lg font-medium transition-all focus:outline-none ${
                        errors.password
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-neutral-200 focus:border-primary bg-white hover:border-neutral-300"
                      }`}
                      placeholder="Create a strong password"
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

                  {/* Password Strength Indicator */}
                  {watchedPassword && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-neutral-600">
                          Password Strength
                        </span>
                        <span
                          className={`text-xs font-medium ${strengthColors[
                            passwordStrength - 1
                          ]?.replace("bg-", "text-")}`}
                        >
                          {strengthLabels[passwordStrength - 1]}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded-full transition-colors ${
                              i < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : "bg-neutral-200"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-neutral-800 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i
                        className={`fas fa-lock transition-colors ${
                          errors.confirmPassword
                            ? "text-red-500"
                            : watchedConfirmPassword
                            ? "text-primary"
                            : "text-neutral-400"
                        }`}
                      ></i>
                    </div>
                    <input
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watchedPassword || "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl text-lg font-medium transition-all focus:outline-none ${
                        errors.confirmPassword
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-neutral-200 focus:border-primary bg-white hover:border-neutral-300"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-primary transition-colors"
                    >
                      <i
                        className={`fas ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Alert Channel */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-3">
                  Preferred Alert Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: "EMAIL",
                      icon: "fa-envelope",
                      label: "Email",
                      desc: "Receive alerts via email",
                    },
                    {
                      value: "PHONE",
                      icon: "fa-sms",
                      label: "SMS",
                      desc: "Receive alerts via SMS",
                    },
                  ].map((channel) => (
                    <label key={channel.value} className="cursor-pointer">
                      <input
                        {...register("alertChannel")}
                        type="radio"
                        value={channel.value}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 border-2 rounded-2xl transition-all ${
                          watch("alertChannel") === channel.value
                            ? "border-primary bg-primary/5"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <i
                            className={`fas ${channel.icon} text-xl ${
                              watch("alertChannel") === channel.value
                                ? "text-primary"
                                : "text-neutral-400"
                            }`}
                          ></i>
                        </div>
                        <h3
                          className={`font-semibold text-center ${
                            watch("alertChannel") === channel.value
                              ? "text-primary"
                              : "text-neutral-800"
                          }`}
                        >
                          {channel.label}
                        </h3>
                        <p className="text-sm text-neutral-600 text-center">
                          {channel.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    {...register("agreeToTerms", {
                      required: "You must agree to the terms and conditions",
                    })}
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="relative mt-0.5 mr-3">
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all ${
                        watch("agreeToTerms")
                          ? "bg-primary border-primary"
                          : errors.agreeToTerms
                          ? "border-red-500"
                          : "border-neutral-300 hover:border-primary"
                      }`}
                    >
                      {watch("agreeToTerms") && (
                        <i className="fas fa-check text-white text-xs absolute inset-0 flex items-center justify-center"></i>
                      )}
                    </div>
                  </div>
                  <span className="text-neutral-700 leading-relaxed">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600 flex items-center ml-8">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.agreeToTerms.message}
                  </p>
                )}

                <label className="flex items-start cursor-pointer">
                  <input
                    {...register("subscribeNewsletter")}
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="relative mt-0.5 mr-3">
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all ${
                        watch("subscribeNewsletter")
                          ? "bg-primary border-primary"
                          : "border-neutral-300 hover:border-primary"
                      }`}
                    >
                      {watch("subscribeNewsletter") && (
                        <i className="fas fa-check text-white text-xs absolute inset-0 flex items-center justify-center"></i>
                      )}
                    </div>
                  </div>
                  <span className="text-neutral-700 leading-relaxed">
                    Subscribe to our newsletter for exclusive offers and updates
                  </span>
                </label>
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
                    <span className="ml-3">Creating your account...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-user-plus mr-3"></i>
                    Create Account
                  </span>
                )}
              </button>

              {/* Social Signup */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-neutral-500 font-medium">
                    Or sign up with
                  </span>
                </div>
              </div>

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
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-bold hover:text-primary-dark transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
