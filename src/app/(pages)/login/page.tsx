"use client";

import Spinner from "@/components/spinner/Spinner";
import { RequestStructure } from "@/models/GeneralDTO";
import { Credential, LoginDTO } from "@/models/Staff";
import { fetchData } from "@/services/GeneralService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const router = useRouter();

  const param: LoginDTO = {
    staffId: staffId,
    password: password,
  };

  const request: RequestStructure<LoginDTO> = {
    api: "/login",
    method: "POST",
    body: param,
  };

  const login = async () => {
    try {
      setLoading(true);
      
      const response = await fetchData<Credential>(request);
      if (response.responseCode != "00") {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);
        setError(true);
        setLoading(false);
      }
      else {
        const jwtToken = response.data.token;
        if (jwtToken) {
          localStorage.setItem("jwt_token", jwtToken);
          setTimeout(() => {
            setLoading(false);
            router.push("/manage-product");
          }, 1500);
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

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="grid grid-cols-6 items-center mt-3 mb-2 w-full max-w-lg">
          <label
            htmlFor="staffId"
            className="col-span-2 text-base font-semibold text-left"
          >
            Staff ID
          </label>
          <input
            type="text"
            id="staffId"
            name="staffId"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            placeholder="Enter Staff ID"
            className="col-span-4 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-6 items-center mt-3 mb-2 w-full max-w-lg">
          <label
            htmlFor="password"
            className="col-span-2 text-base font-semibold text-left"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="col-span-4 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-center mt-3 mb-2 w-full max-w-lg">
          <button
            type="button"
            onClick={login}
            className="rounded-md border border-gray-300 px-3 py-2 text-base text-center text-white bg-green-600 hover:bg-green-700"
          >
            Login
          </button>
        </div>
      </div>

      {isLoading && <Spinner message="Logging in... Please wait." />}
    </div>
  );
}
