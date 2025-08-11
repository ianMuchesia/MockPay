import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetBannerEntitlementsQuery,
  useGetBannerServiceQuery,
  useCreatePremiumBannerMutation,
  useCreateBannerMutation,
} from "../../features/banners/bannerApi";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const CreateBannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requiresService = searchParams.get("requiresService") === "true";

  // API hooks
  const { data: entitlementsData, isLoading: loadingEntitlements } =
    useGetBannerEntitlementsQuery();
  const { data: bannerServiceData, isLoading: loadingService } =
    useGetBannerServiceQuery();
  const [createPremiumBanner, { isLoading: creatingPremiumBanner }] =
    useCreatePremiumBannerMutation();
  const [createBanner, { isLoading: creatingBanner }] =
    useCreateBannerMutation();

  // Form state
  const [step, setStep] = useState<"creation" | "linking">("creation");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [webImage, setWebImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);
  const [webImagePreview, setWebImagePreview] = useState<string>("");
  const [mobileImagePreview, setMobileImagePreview] = useState<string>("");

  // Linking/Purchase state
  const [selectedSubscriptionId, setSelectedSubscriptionId] =
    useState<number>(0);
  const [linkingOption, setLinkingOption] = useState<"existing" | "purchase">(
    "existing"
  );

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Determine available options when entitlements load
  useEffect(() => {
    if (entitlementsData?.data) {
      const entitlements = entitlementsData.data;

      // If user has no slots available, force purchase flow
      if (!entitlements.canCreateBanner || requiresService) {
        setLinkingOption("purchase");
      }

      // Auto-select subscription if only one available
      if (entitlements.availableSubscriptionIdsForNewBanner.length === 1) {
        setSelectedSubscriptionId(
          entitlements.availableSubscriptionIdsForNewBanner[0]
        );
      }
    }
  }, [entitlementsData, requiresService]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "web" | "mobile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [`${type}Image`]: "Please select a valid image file.",
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [`${type}Image`]: "Image size must be less than 5MB.",
      }));
      return;
    }

    if (type === "web") {
      setWebImage(file);
      setWebImagePreview(URL.createObjectURL(file));
    } else {
      setMobileImage(file);
      setMobileImagePreview(URL.createObjectURL(file));
    }

    // Clear error
    setErrors((prev) => ({ ...prev, [`${type}Image`]: "" }));
  };

  // Validate creation form
  const validateCreationForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.link.trim()) {
      newErrors.link = "Link is required";
    } else {
      try {
        new URL(formData.link);
      } catch {
        newErrors.link = "Please enter a valid URL";
      }
    }

    if (!webImage) {
      newErrors.webImage = "Web banner image is required";
    }

    if (!mobileImage) {
      newErrors.mobileImage = "Mobile banner image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate linking form
  const validateLinkingForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (linkingOption === "existing" && !selectedSubscriptionId) {
      newErrors.subscription = "Please select a subscription";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle creation form submit
  const handleCreationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCreationForm()) {
      return;
    }

    // Move to linking step
    setStep("linking");
  };

  // Handle final banner creation
  const handleFinalSubmit = async () => {
    if (!validateLinkingForm()) {
      return;
    }

    const bannerData = {
      title: formData.title,
      description: formData.description,
      link: formData.link,
      webImage: webImage,
      mobileImage: mobileImage,
    };

    if (linkingOption === "purchase") {
      // Redirect to purchase flow with banner data stored

      // Store banner data in sessionStorage for after purchase

      sessionStorage.setItem("bannerData", JSON.stringify(bannerData));

      try {
        const res = await createBanner({
          title: formData.title,
          description: formData.description,
          link: formData.link,
          selectedSubscriptionId,
          webImage: webImage as File,
          mobileImage: mobileImage as File,
        }).unwrap();

        console.log("Banner created successfully:", res);

        // Redirect to purchase flow
        const service = bannerServiceData?.data;
        if (service) {
          const params = new URLSearchParams({
            serviceId: service.id.toString(),
            subscriptionType: "SERVICE",
            price: service.standalonePrice.toString(),
            name: service.name,
            billingCycle: service.standaloneBillingCycle,
            bannerId: res.data.id.toString(),
          });

          navigate(`/dashboard/banners/payment-details?${params.toString()}`);
        }
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || "Failed to save banner. Please try again.";
        setModalMessage(errorMessage);
        setModalType("error");
        setShowModal(true);
        return;
      }
    } else {
      try {
        await createPremiumBanner({
          title: formData.title,
          description: formData.description,
          link: formData.link,
          selectedSubscriptionId,
          webImage: webImage as File,
          mobileImage: mobileImage as File,
        }).unwrap();

        setModalMessage("Banner created successfully!");
        setModalType("success");
        setShowModal(true);

        // Redirect after success
        setTimeout(() => {
          navigate("/dashboard/banners");
        }, 2000);
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || "Failed to create banner. Please try again.";
        setModalMessage(errorMessage);
        setModalType("error");
        setShowModal(true);
      }
    }

    // Create banner with existing subscription
  };

  // Loading state
  if (loadingEntitlements || loadingService) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-grow">
            <div className="h-8 bg-neutral-100 w-48 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-neutral-100 w-64 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const entitlements = entitlementsData?.data;
  const bannerService = bannerServiceData?.data;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-neutral-800">
            Create New Banner
          </h1>
          <p className="text-neutral-500">
            {step === "creation"
              ? "Design your banner content and upload images"
              : "Choose how to activate your banner"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<i className="fas fa-arrow-left"></i>}
          onClick={() => {
            if (step === "linking") {
              setStep("creation");
            } else {
              navigate("/dashboard/banners");
            }
          }}
        >
          {step === "linking" ? "Back to Creation" : "Back to Banners"}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center">
          <div
            className={`flex items-center ${
              step === "creation" ? "text-primary" : "text-green-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "creation"
                  ? "bg-primary text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {step === "creation" ? "1" : <i className="fas fa-check"></i>}
            </div>
            <span className="ml-2 font-medium">Banner Content</span>
          </div>

          <div className="flex-1 mx-4 h-0.5 bg-neutral-200">
            <div
              className={`h-full transition-all duration-300 ${
                step === "linking" ? "bg-primary w-full" : "bg-neutral-200 w-0"
              }`}
            ></div>
          </div>

          <div
            className={`flex items-center ${
              step === "linking" ? "text-primary" : "text-neutral-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "linking"
                  ? "bg-primary text-white"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Activation</span>
          </div>
        </div>
      </div>

      {step === "creation" ? (
        /* CREATION STEP */
        <Card>
          <form onSubmit={handleCreationSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                Banner Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="form-label">
                    Banner Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`form-input ${
                      errors.title ? "border-red-300" : ""
                    }`}
                    placeholder="Enter banner title"
                  />
                  {errors.title && <p className="form-error">{errors.title}</p>}
                </div>

                {/* Link */}
                <div>
                  <label className="form-label">
                    Target Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className={`form-input ${
                      errors.link ? "border-red-300" : ""
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.link && <p className="form-error">{errors.link}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`form-input ${
                    errors.description ? "border-red-300" : ""
                  }`}
                  placeholder="Enter banner description"
                />
                {errors.description && (
                  <p className="form-error">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                Banner Images
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Web Image */}
                <div>
                  <label className="form-label">
                    Web Banner Image <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                    {webImagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={webImagePreview}
                          alt="Web banner preview"
                          className="w-full h-32 object-cover rounded border"
                        />
                        <div className="flex gap-2 justify-center">
                          <label className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              Change Image
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, "web")}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="space-y-2">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                            <i className="fas fa-desktop text-green-600 text-xl"></i>
                          </div>
                          <p className="text-neutral-700 font-medium">
                            Upload Web Banner
                          </p>
                          <p className="text-sm text-neutral-500">
                            Recommended: 1200x400px
                          </p>
                          <p className="text-xs text-neutral-400">
                            Max 5MB • JPG, PNG, GIF
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "web")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.webImage && (
                    <p className="form-error">{errors.webImage}</p>
                  )}
                </div>

                {/* Mobile Image */}
                <div>
                  <label className="form-label">
                    Mobile Banner Image <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                    {mobileImagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={mobileImagePreview}
                          alt="Mobile banner preview"
                          className="w-full h-32 object-cover rounded border"
                        />
                        <div className="flex gap-2 justify-center">
                          <label className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              Change Image
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, "mobile")}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="space-y-2">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                            <i className="fas fa-mobile-alt text-blue-600 text-xl"></i>
                          </div>
                          <p className="text-neutral-700 font-medium">
                            Upload Mobile Banner
                          </p>
                          <p className="text-sm text-neutral-500">
                            Recommended: 400x300px
                          </p>
                          <p className="text-xs text-neutral-400">
                            Max 5MB • JPG, PNG, GIF
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "mobile")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.mobileImage && (
                    <p className="form-error">{errors.mobileImage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-end pt-6 border-t border-neutral-200">
              <Button
                type="submit"
                rightIcon={<i className="fas fa-arrow-right"></i>}
                disabled={
                  !formData.title ||
                  !formData.description ||
                  !formData.link ||
                  !webImage ||
                  !mobileImage
                }
              >
                Continue to Activation
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* LINKING/PURCHASE STEP */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activation Options */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-6">
                Banner Activation
              </h3>

              {/* Activation Options */}
              <div className="mb-6">
                <label className="form-label mb-4">
                  Choose Activation Method
                </label>

                <div className="space-y-3">
                  {/* Link to Existing Subscription */}
                  {entitlements?.availableSubscriptionIdsForNewBanner &&
                    entitlements.availableSubscriptionIdsForNewBanner.length >
                      0 && (
                      <label
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                          linkingOption === "existing"
                            ? "border-primary bg-primary/5"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="linkingOption"
                          value="existing"
                          checked={linkingOption === "existing"}
                          onChange={(e) =>
                            setLinkingOption(
                              e.target.value as "existing" | "purchase"
                            )
                          }
                          className="text-primary focus:ring-primary mt-1"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-neutral-800">
                            Link to Existing Service
                          </p>
                          <p className="text-sm text-neutral-600">
                            Use an available slot from your current
                            subscriptions
                          </p>

                          {linkingOption === "existing" && (
                            <div className="mt-3 space-y-2">
                              {entitlements.availableSubscriptionIdsForNewBanner.map(
                                (subId) => (
                                  <label
                                    key={subId}
                                    className={`flex items-center p-3 border rounded cursor-pointer ${
                                      selectedSubscriptionId === subId
                                        ? "border-primary bg-primary/5"
                                        : "border-neutral-200"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="subscription"
                                      value={subId}
                                      checked={selectedSubscriptionId === subId}
                                      onChange={(e) =>
                                        setSelectedSubscriptionId(
                                          parseInt(e.target.value)
                                        )
                                      }
                                      className="text-primary focus:ring-primary"
                                    />
                                    <div className="ml-3">
                                      <p className="text-sm font-medium">
                                        Subscription #{subId}
                                      </p>
                                      <p className="text-xs text-neutral-500">
                                        Available slot
                                      </p>
                                    </div>
                                  </label>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </label>
                    )}

                  {/* Purchase New Service */}
                  <label
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                      linkingOption === "purchase"
                        ? "border-primary bg-primary/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="linkingOption"
                      value="purchase"
                      checked={linkingOption === "purchase"}
                      onChange={(e) =>
                        setLinkingOption(
                          e.target.value as "existing" | "purchase"
                        )
                      }
                      className="text-primary focus:ring-primary mt-1"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-neutral-800">
                        Purchase New Banner Service
                      </p>
                      <p className="text-sm text-neutral-600">
                        {bannerService
                          ? `KES ${
                              bannerService.standalonePrice
                            }/${bannerService.standaloneBillingCycle.toLowerCase()}`
                          : "Get a dedicated banner service"}
                      </p>
                    </div>
                  </label>
                </div>

                {errors.subscription && (
                  <p className="form-error">{errors.subscription}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-neutral-200">
                <Button variant="outline" onClick={() => setStep("creation")}>
                  Back to Content
                </Button>

                <Button
                  onClick={handleFinalSubmit}
                  isLoading={creatingPremiumBanner}
                  rightIcon={
                    <i
                      className={`fas ${
                        linkingOption === "purchase"
                          ? "fa-shopping-cart"
                          : "fa-check"
                      }`}
                    ></i>
                  }
                >
                  {linkingOption === "purchase"
                    ? "Proceed to Payment"
                    : "Create Banner"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Banner Preview */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                Banner Preview
              </h3>

              <div className="space-y-4">
                {/* Web Preview */}
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-2">
                    Web Version
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    {webImagePreview ? (
                      <img
                        src={webImagePreview}
                        alt="Web banner preview"
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <div className="w-full h-24 bg-neutral-100 flex items-center justify-center">
                        <i className="fas fa-image text-neutral-400"></i>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Preview */}
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-2">
                    Mobile Version
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    {mobileImagePreview ? (
                      <img
                        src={mobileImagePreview}
                        alt="Mobile banner preview"
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <div className="w-full h-24 bg-neutral-100 flex items-center justify-center">
                        <i className="fas fa-image text-neutral-400"></i>
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Details */}
                <div className="pt-4 border-t border-neutral-200">
                  <h4 className="font-medium text-neutral-800">
                    {formData.title || "Banner Title"}
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    {formData.description || "Banner description"}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    Link: {formData.link || "https://example.com"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Service Info (if purchasing) */}
            {linkingOption === "purchase" && bannerService && (
              <Card className="mt-4">
                <h4 className="font-medium text-neutral-800 mb-3">
                  Service Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Service:</span>
                    <span className="font-medium">{bannerService.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Price:</span>
                    <span className="font-medium">
                      KES {bannerService.standalonePrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Billing:</span>
                    <span className="font-medium">
                      {bannerService.standaloneBillingCycle}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === "success" ? "Success!" : "Error"}
        type={modalType}
      >
        <p>{modalMessage}</p>
        {modalType === "success" && (
          <div className="mt-4 flex justify-end">
            <Button onClick={() => navigate("/dashboard/banners")} size="sm">
              View Banners
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CreateBannerPage;
