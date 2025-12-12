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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      console.log("response", response);
      
      localStorage.setItem("token", response.data.token)
      

      if (response.data.status) {
        setEmail("");
        setPassword("");
        navigate("/dashboard");
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
      <div className="w-full max-w-7xl bg-gradient-to-br h-[93vh] from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-800 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-10 md:px-14 py-10">
          <div className="flex flex-col justify-center h-full">
            <div className="mb-6">
              <h1 className="text-4xl font-extrabold text-blue-400 mb-2 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm">
                Log in to continue managing your expenses
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              >
                Login
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-400 cursor-pointer hover:underline"
              >
                Sign Up
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
                <p className="text-gray-400 text-sm">Monthly Overview</p>
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

export default Login;
