import React, { useState, useEffect } from "react";
import Button from "../../../components/common/Button";


interface PayerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  gatewayName: string;

}

interface PaymentDetailsFormProps {
  initialPayerInfo?: PayerInfo;
  loading?: boolean;
  onSubmit: (form: PayerInfo & { gatewayName: string; currency: string }) => void;
  error?: string;
  submitLabel?: string;
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  initialPayerInfo,
  loading,
  onSubmit,
  error,
  submitLabel = "Proceed to Payment",
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "KE",
    currency: "KES",
    gatewayName: "Pesapal",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialPayerInfo) {
      setFormData((prev) => ({
        ...prev,
        ...initialPayerInfo,
      }));
    }
  }, [initialPayerInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{9,12}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      errors.phoneNumber = "Phone number is invalid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`form-input ${formErrors.firstName ? "border-red-500" : ""}`}
            placeholder="First Name"
          />
          {formErrors.firstName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`form-input ${formErrors.lastName ? "border-red-500" : ""}`}
            placeholder="Last Name"
          />
          {formErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${formErrors.email ? "border-red-500" : ""}`}
          placeholder="Email Address"
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Country Code
          </label>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="form-input"
          >
            <option value="KE">Kenya (KE)</option>
            <option value="UG">Uganda (UG)</option>
            <option value="TZ">Tanzania (TZ)</option>
            <option value="RW">Rwanda (RW)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`form-input ${formErrors.phoneNumber ? "border-red-500" : ""}`}
            placeholder="e.g. 712345678"
          />
          {formErrors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="form-input"
          >
            <option value="KES">Kenyan Shilling (KES)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="UGX">Ugandan Shilling (UGX)</option>
            <option value="TZS">Tanzanian Shilling (TZS)</option>
            <option value="RWF">Rwandan Franc (RWF)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Payment Gateway
          </label>
          <select
            name="gatewayName"
            value={formData.gatewayName}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Pesapal">Pesapal</option>
            <option value="Flutterwave">Flutterwave</option>
            <option value="Mpesa">Mpesa</option>
            <option value="Mock">Mock</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button type="submit" isLoading={loading}>
          {submitLabel}
        </Button>
      </div>
      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}
    </form>
  );
};

export default PaymentDetailsForm;