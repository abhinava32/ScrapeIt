import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// You can move these to a separate types file
type FormStage = "email" | "otp" | "reset";

interface FormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<FormStage>("email");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      // Make API call to send OTP
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      setEmailSent(true);
      setStage("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrors({
        submit: "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOTP()) return;

    setIsLoading(true);
    try {
      // Make API call to verify OTP
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      setStage("reset");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors({
        otp: "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Make API call to reset password
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      // Redirect to login page on success
      navigate("/login", {
        state: {
          message:
            "Password reset successful. Please login with your new password.",
        },
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrors({
        submit: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailForm = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </form>
  );

  const renderOTPForm = () => (
    <form onSubmit={handleOTPSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700"
        >
          Enter OTP
        </label>
        <div className="mt-1">
          <input
            id="otp"
            name="otp"
            type="text"
            required
            maxLength={6}
            value={formData.otp}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter 6-digit OTP"
          />
          {errors.otp && (
            <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          OTP has been sent to your email address
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </form>
  );

  const renderResetForm = () => (
    <form onSubmit={handlePasswordReset} className="space-y-6">
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <div className="mt-1">
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            value={formData.newPassword}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );

  return (
    <>
      <Navbar></Navbar>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex justify-center">
            <span className="text-3xl font-bold text-blue-600">
              Scrape2Data
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {stage === "email" && "Reset your password"}
            {stage === "otp" && "Enter verification code"}
            {stage === "reset" && "Create new password"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              return to sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {errors.submit && (
              <div className="mb-4 text-sm text-red-600 text-center">
                {errors.submit}
              </div>
            )}

            {stage === "email" && renderEmailForm()}
            {stage === "otp" && renderOTPForm()}
            {stage === "reset" && renderResetForm()}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default ForgotPassword;
