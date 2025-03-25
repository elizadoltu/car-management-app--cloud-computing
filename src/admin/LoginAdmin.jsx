import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      const response = await axios.post(
        "https://user-service-car-management-production.up.railway.app/api/auth/login/admin",
        { username, password }
      );
      localStorage.setItem("adminToken", response.data.token);
      setMessage({ text: "Admin login successful!", type: "success" });
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      console.error("Admin login failed", error);
      setMessage({ 
        text: error.response?.data?.message || "Admin login failed. Please try again.", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-3">
      <div className="uppercase leading-none">
        <p className="font-bold">drive sync</p>
        <p className="opacity-50">admin portal</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} className="p-4 w-full max-w-md">
          <h2 className="mb-4 uppercase font-medium text-2xl">
            Admin Login
          </h2>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full py-2 border-b"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-2 border-b"
              disabled={isLoading}
            />
          </div>
          
          {message.text && (
            <div className={`mt-4 p-2 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="p-2 mt-5 bg-[#181818] text-[#f6f6f6] w-full rounded-lg transition-all duration-300 ease-in-out hover:bg-[#333333] disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Admin Login"}
          </button>
          <div className="flex justify-center mt-2 font-medium">
            <a href="/" className="underline-link is--alt">
              Back to User Login
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AdminLogin;
