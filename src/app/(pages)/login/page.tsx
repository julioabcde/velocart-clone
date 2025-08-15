"use client";

import Spinner from "@/components/spinner/Spinner";
import { useAuth } from "@/context/AuthContext";
import { LoginDTO } from "@/models/Staff";
import { LoginService } from "@/services/api/LoginService";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();

  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setError] = useState(false);
  const { isLoggedIn, setLoggedIn, isLoading, setLoading } = useAuth();

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginDTO, string>>>({});

  const loginParam: LoginDTO = {
    staffId: staffId,
    password: password,
  };

  useEffect(() => {
    if (!AuthService.isTokenExpired()) {
      setLoading(true);
      setLoggedIn(true);
      setTimeout(() => {
        router.replace("/master/product");
      }, 1000);
    }
  }, [router]);

  const validateLogin = () => {
    const errors: Partial<Record<keyof LoginDTO, string>> = {};

    if (!staffId.trim()) {
      errors.staffId = "Staff ID is required!";
    }

    if (!password.trim()) {
      errors.password = "Password is required!";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length > 0;
  };

  const login = async () => {
    try {
      setLoading(true);

      const response = await LoginService.login(loginParam);
      if (response.responseCode != "00") {
        //must be removed once error pop up is finished
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);

        setError(true);
        setLoading(false);
      }
      else {
        const staffId = response.data.staffId;
        const role = response.data.role;
        const token = response.data.token;
        const ttl = response.data.ttl;

        if (staffId && role && token && ttl) {
          const expiresIn = Date.now() + ttl * 60000;

          localStorage.setItem("staffId", staffId);
          localStorage.setItem("role", role);
          localStorage.setItem("token", token);
          localStorage.setItem("ttl", expiresIn.toString());

          setTimeout(() => {
            setLoggedIn(true);
            setLoading(false);
            router.push("/master/product");
          }, 1000);
        }
        else {
          setLoading(false);
        }
      }
    }
    catch (err) {
      console.error("Fetch error:", err);
      setError(true);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = validateLogin();

    if (!hasError) {
      await login();
    }
    return;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="staffId" className="block text-sm font-medium mb-1">Staff ID <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="staffId"
              name="staffId"
              value={staffId}
              onChange={(e) => {
                setStaffId(e.target.value);
                if (fieldErrors.staffId) {
                  setFieldErrors((prev) => ({ ...prev, staffId: undefined }));
                }
              }}
              placeholder="Enter Staff ID"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.staffId ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {fieldErrors.staffId && (
              <p className="text-sm text-red-600">{fieldErrors.staffId}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="Enter Password"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-center pt-4 gap-5">
            <button
              type="submit"
              disabled={isLoading}
              className="text-[15px] px-3.5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              Login
            </button>
          </div>
        </form>

        {isLoading && <Spinner message={isLoggedIn ? "Logged in! Redirecting..." : "Logging in... Please wait."} />}
      </div>
    </div>
  );
}
