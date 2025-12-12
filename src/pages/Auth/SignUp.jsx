import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("fullName", fullName);
      
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) formData.append("profileImage", profileImage);

      console.log(formData);

      const response = await axios.post(
        "http://localhost:5000/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("response", response);
      

      if (response.data.status) {
        setFullName("");
        setEmail("");
        setPassword("");
        setProfileImage(null);
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const data = [
    { month: "Jan", income: 120, expense: 80 },
    { month: "Feb", income: 200, expense: 130 },
    { month: "Mar", income: 180, expense: 120 },
    { month: "Apr", income: 250, expense: 180 },
    { month: "May", income: 150, expense: 100 },
    { month: "Jun", income: 300, expense: 200 },
    { month: "Jul", income: 260, expense: 190 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-gradient-to-br h-[93vh] from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-800 flex flex-col md:flex-row  overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-10 md:px-14 py-10">
          <div className="flex flex-col justify-center h-full">
            <div className="mb-6">
              <h1 className="text-4xl font-extrabold text-blue-400 mb-2 tracking-tight">
                Expense Tracker
              </h1>
              <p className="text-gray-400 text-sm">
                Create your account and start managing your finances today
              </p>
            </div>

            <div className="flex flex-col items-center mb-8">
              <label className="relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
                <div className="w-28 h-28 rounded-full border-2 border-gray-600 flex items-center justify-center overflow-hidden bg-gray-800 group-hover:border-blue-500 transition-all duration-300">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Upload</span>
                  )}
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-2">Profile Picture</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="bg-gray-800/80 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 rounded-lg py-2 px-3 w-full"
                required
              />

              <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="bg-gray-800/80 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 rounded-lg py-2 px-3 w-full"
                required
              />
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-gray-800/80 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 rounded-lg py-2 px-3 w-full"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between p-10 md:p-14 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-950 border-l border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <TrendingUp className="text-blue-400" size={22} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  Track Your Income & Expenses
                </p>
                <h3 className="text-blue-400 text-2xl font-bold">$430,000</h3>
              </div>
            </div>
            <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
              View
            </button>
          </div>

          <div className="flex-grow flex items-center justify-center pt-6">
            <ResponsiveContainer width="100%" height="80%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#3f3f46"
                />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af" }} />
                <YAxis tick={{ fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#f3f4f6",
                  }}
                />
                <Legend wrapperStyle={{ color: "#9ca3af" }} />
                <Bar dataKey="income" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
