import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LogOut,
  TrendingUp,
  Wallet,
  LayoutDashboard,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingBag,
  Car,
  CreditCard,
  Home,
  Utensils,
  Film,
  Heart,
  Menu,
  X,
  Laptop,
  Briefcase,
  PieChart as PieChartIcon,
  Gift,
  Building,
  Star,
  Camera,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboarHome = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const expenseCategories = {
    shopping: {
      icon: ShoppingBag,
      color: "#8b5cf6",
      bgColor: "#8b5cf620",
      name: "Shopping",
    },
    travel: {
      icon: Car,
      color: "#06b6d4",
      bgColor: "#06b6d420",
      name: "Travel",
    },
    salary: {
      icon: DollarSign,
      color: "#10b981",
      bgColor: "#10b98120",
      name: "Salary",
    },
    electricity: {
      icon: Home,
      color: "#f59e0b",
      bgColor: "#f59e0b20",
      name: "Electricity",
    },
    loan: {
      icon: CreditCard,
      color: "#ef4444",
      bgColor: "#ef444420",
      name: "Loan",
    },
    food: {
      icon: Utensils,
      color: "#84cc16",
      bgColor: "#84cc1620",
      name: "Food",
    },
    entertainment: {
      icon: Film,
      color: "#ec4899",
      bgColor: "#ec489920",
      name: "Entertainment",
    },
    utilities: {
      icon: Home,
      color: "#06b6d4",
      bgColor: "#06b6d420",
      name: "Utilities",
    },
    healthcare: {
      icon: Heart,
      color: "#dc2626",
      bgColor: "#dc262620",
      name: "Healthcare",
    },
    other: {
      icon: CreditCard,
      color: "#6b7280",
      bgColor: "#6b728020",
      name: "Other",
    },
  };

  // Income Sources Configuration
  const incomeSources = {
    salary: {
      icon: DollarSign,
      color: "#10b981",
      bgColor: "#10b98120",
      name: "Salary",
    },
    freelance: {
      icon: Laptop,
      color: "#3b82f6",
      bgColor: "#3b82f620",
      name: "Freelance",
    },
    business: {
      icon: Briefcase,
      color: "#8b5cf6",
      bgColor: "#8b5cf620",
      name: "Business",
    },
    investment: {
      icon: PieChartIcon,
      color: "#f59e0b",
      bgColor: "#f59e0b20",
      name: "Investment",
    },
    bonus: {
      icon: Gift,
      color: "#ec4899",
      bgColor: "#ec489920",
      name: "Bonus",
    },
    rental: {
      icon: Building,
      color: "#06b6d4",
      bgColor: "#06b6d420",
      name: "Rental",
    },
    dividends: {
      icon: CreditCard,
      color: "#84cc16",
      bgColor: "#84cc1620",
      name: "Dividends",
    },
    other: {
      icon: Star,
      color: "#6b7280",
      bgColor: "#6b728020",
      name: "Other",
    },
  };

  const getDefaultYearData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month) => ({ month, income: 0, expense: 0 }));
  };

  const processChartData = (incomes, expenses) => {
    const yearlyData = getDefaultYearData();
    if (!incomes) return yearlyData;

    const monthlyData = {};

    incomes.forEach((income) => {
      const date = new Date(income.date);
      const monthIndex = date.getMonth();
      const monthName = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][monthIndex];

      if (!monthlyData[monthIndex]) {
        monthlyData[monthIndex] = { month: monthName, income: 0, expense: 0 };
      }
      monthlyData[monthIndex].income += income.amount;
    });

    expenses?.forEach((expense) => {
      const date = new Date(expense.date);
      const monthIndex = date.getMonth();
      const monthName = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][monthIndex];

      if (!monthlyData[monthIndex]) {
        monthlyData[monthIndex] = { month: monthName, income: 0, expense: 0 };
      }
      monthlyData[monthIndex].expense += expense.amount;
    });

    return yearlyData.map((monthData, index) => {
      if (monthlyData[index]) {
        return {
          ...monthData,
          income: monthlyData[index].income,
          expense: monthlyData[index].expense,
        };
      }
      return monthData;
    });
  };

  const prepareIncomePieData = (incomes) => {
    if (!incomes || incomes.length === 0) return [];

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const sourceMap = {};

    incomes.forEach((income) => {
      const source = income.source?.toLowerCase() || "other";
      if (!sourceMap[source]) {
        sourceMap[source] = 0;
      }
      sourceMap[source] += income.amount;
    });

    return Object.entries(sourceMap).map(([name, value]) => {
      const percentage = ((value / totalIncome) * 100).toFixed(1);
      const sourceConfig = incomeSources[name] || incomeSources.other;

      return {
        name: sourceConfig.name,
        value,
        percentage: `${percentage}%`,
        color: sourceConfig.color,
      };
    });
  };

  const prepareExpensePieData = (expenses) => {
    if (!expenses || expenses.length === 0) return [];

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const categoryMap = {};

    expenses.forEach((expense) => {
      const category = expense.category?.toLowerCase() || "other";
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += expense.amount;
    });

    return Object.entries(categoryMap).map(([name, value]) => {
      const percentage = ((value / totalExpense) * 100).toFixed(1);
      const categoryConfig = expenseCategories[name] || expenseCategories.other;

      return {
        name: categoryConfig.name,
        value,
        percentage: `${percentage}%`,
        color: categoryConfig.color,
      };
    });
  };

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get(
          "http://localhost:5000/api/v1/dashboard/get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status) {
          setDashboardData(res.data);
          const chartData = processChartData(
            res.data.incomes,
            res.data.expenses
          );
          setData(chartData);
        }
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      setData(getDefaultYearData());
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get("http://localhost:5000/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status) {
          setUser({
            name: res.data.user?.fullName || "User",
            image: res.data.user?.profileImage
              ? `http://localhost:5000${res.data.user.profileImage}`
              : null,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await axios.post(
        "http://localhost:5000/update-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        // Update user state with new image
        setUser((prevUser) => ({
          ...prevUser,
          image: `http://localhost:5000${
            response.data.user.profileImage
          }?t=${new Date().getTime()}`,
        }));
        alert("Profile picture updated successfully!");
      } else {
        alert(response.data.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Error updating profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-blue-300 font-bold">{label}</p>
          <p className="text-green-300">
            Income: ${payload[0]?.value?.toLocaleString() || 0}
          </p>
          <p className="text-red-300">
            Expense: ${payload[1]?.value?.toLocaleString() || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-white">
            Amount: ${payload[0].value?.toLocaleString()}
          </p>
          <p className="text-gray-200">{payload[0].payload.percentage}</p>
        </div>
      );
    }
    return null;
  };

  const getCategoryIcon = (category) => {
    const categoryKey = category?.toLowerCase();
    const categoryConfig =
      expenseCategories[categoryKey] || expenseCategories.other;
    return categoryConfig;
  };

  const getSourceIcon = (source) => {
    const sourceKey = source?.toLowerCase();
    const sourceConfig = incomeSources[sourceKey] || incomeSources.other;
    return sourceConfig;
  };

  const incomePieData = prepareIncomePieData(dashboardData?.incomes);
  const expensePieData = prepareExpensePieData(dashboardData?.expenses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-gray-100 flex overflow-hidden">
      {/* MOBILE MENU BUTTON */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg border border-gray-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      <div
        className={`
          w-80 bg-gradient-to-b from-gray-950 via-gray-900 to-black p-6 flex flex-col border-r border-gray-800
          fixed h-full overflow-y-auto z-40 transition-transform duration-300
          ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
        `}
      >
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-center mb-10 text-blue-400">
            Expense Tracker
          </h1>

          {/* Profile */}
          <div className="flex flex-col items-center mb-10">
            <label className="relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
                disabled={uploading}
              />
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 mb-3 group-hover:border-blue-300 transition-all duration-300 relative">
                {user.image ? (
                  <>
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera className="text-white" size={24} />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-blue-400 text-2xl font-bold group-hover:bg-gray-700 transition-colors duration-300">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>
            </label>
            <h2 className="text-lg font-semibold text-blue-400 text-center">
              {user.name || "Loading..."}
            </h2>
            <p className="text-gray-400 text-xs mt-1 text-center">
              Click on photo to change
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => isMobile && setSidebarOpen(false)}
              className="flex items-center w-full gap-3 px-4 py-3 bg-blue-600/20 text-blue-300 rounded-lg border border-blue-500/30"
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/income");
                if (isMobile) setSidebarOpen(false);
              }}
              className="flex items-center w-full gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-700"
            >
              <Wallet size={18} className="text-blue-400" /> Income
            </button>

            <button
              onClick={() => {
                navigate("/expense");
                if (isMobile) setSidebarOpen(false);
              }}
              className="flex items-center w-full gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-700"
            >
              <TrendingUp size={18} className="text-blue-400" /> Expense
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-4 py-3 text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all border border-transparent hover:border-red-500/30 mt-4"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
        flex-1 flex flex-col p-4 lg:p-8 overflow-y-auto
        ${isMobile ? "w-full" : "ml-0 lg:ml-80"}
      `}
      >
        {isMobile && (
          <div className="mb-6 pt-16 lg:pt-0">
            <h1 className="text-2xl font-bold text-blue-400 text-center">
              Dashboard
            </h1>
          </div>
        )}

        {dashboardData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 p-4 lg:p-6 rounded-2xl border border-blue-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm mb-2">Total Balance</p>
                  <h3 className="text-xl lg:text-2xl font-bold text-white">
                    ${dashboardData.totalBalance?.toLocaleString() || "0"}
                  </h3>
                </div>
                <div className="bg-blue-500/20 p-2 lg:p-3 rounded-full">
                  <DollarSign className="text-blue-400" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 p-4 lg:p-6 rounded-2xl border border-green-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm mb-2">Total Income</p>
                  <h3 className="text-xl lg:text-2xl font-bold text-white">
                    ${dashboardData.totalIncome?.toLocaleString() || "0"}
                  </h3>
                </div>
                <div className="bg-green-500/20 p-2 lg:p-3 rounded-full">
                  <ArrowUpCircle className="text-green-400" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 p-4 lg:p-6 rounded-2xl border border-red-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 text-sm mb-2">Total Expense</p>
                  <h3 className="text-xl lg:text-2xl font-bold text-white">
                    ${dashboardData.totalExpense?.toLocaleString() || "0"}
                  </h3>
                </div>
                <div className="bg-red-500/20 p-2 lg:p-3 rounded-full">
                  <ArrowDownCircle className="text-red-400" size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the dashboard content remains the same */}
        <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg mb-6 lg:mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-2 lg:p-3 rounded-full border border-blue-500/30">
                <TrendingUp className="text-blue-400" size={18} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Financial Overview</p>
                <h3 className="text-blue-400 text-lg lg:text-2xl font-bold">
                  $
                  {dashboardData
                    ? (
                        dashboardData.totalIncome + dashboardData.totalExpense
                      ).toLocaleString()
                    : "0"}
                </h3>
              </div>
            </div>
            {loading && (
              <div className="text-blue-400 text-sm animate-pulse">
                Loading...
              </div>
            )}
          </div>

          <div className="h-64 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "#6B7280" }}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "#6B7280" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Income"
                />
                <Bar
                  dataKey="expense"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Expense"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Overview Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-xl mb-6 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-700 bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-full border border-green-500/30">
                  <ArrowUpCircle className="text-green-400" size={18} />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-blue-400">
                  Income Overview
                </h3>
              </div>
              <button
                onClick={() => navigate("/income")}
                className="flex items-center gap-2 hover:bg-[#51A2FF]/30 p-2 lg:p-3 rounded-xl text-[#51A2FF] hover:text-[#51A2FF]/90 transition-all shadow-lg hover:shadow-xl border border-[#51A2FF]/30 hover:border-[#51A2FF]/50 text-sm lg:text-base"
              >
                View All
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-4">
            <div className="lg:col-span-3 lg:border-r lg:border-gray-700 p-4 lg:p-6">
              <div className="grid grid-cols-1 gap-3 lg:gap-4">
                {dashboardData?.incomes?.slice(0, 5).map((income) => {
                  const sourceConfig = getSourceIcon(income.source);
                  const IconComponent = sourceConfig.icon;

                  return (
                    <div
                      key={income._id}
                      className="flex items-center justify-between p-3 lg:p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <div
                          className="p-2 lg:p-3 rounded-full border"
                          style={{
                            backgroundColor: sourceConfig.bgColor,
                            borderColor: sourceConfig.color,
                          }}
                        >
                          <IconComponent
                            size={16}
                            style={{ color: sourceConfig.color }}
                          />
                        </div>
                        <div>
                          <p className="text-gray-100 font-medium capitalize text-sm lg:text-lg">
                            {income.source}
                          </p>
                          <p className="text-gray-400 text-xs lg:text-sm">
                            {formatDate(income.date)}
                          </p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold text-sm lg:text-lg">
                        +${income.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}

                {(!dashboardData?.incomes ||
                  dashboardData.incomes.length === 0) && (
                  <div className="text-center py-6 lg:py-8">
                    <Wallet className="text-gray-600 mx-auto mb-3" size={28} />
                    <p className="text-gray-500 text-sm mb-3">
                      No income transactions yet
                    </p>
                    <button
                      onClick={() => navigate("/income")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      Add Income
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 lg:p-6 border-t lg:border-t-0 border-gray-700">
              <div className="text-center mb-4">
                <p className="text-gray-400 text-sm font-medium">
                  Income Distribution
                </p>
              </div>
              <div className="h-48 lg:h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incomePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {incomePieData.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {incomePieData.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 lg:w-3 lg:h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-300 text-xs">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {item.percentage}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expense Overview Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-700 bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500/20 p-2 rounded-full border border-red-500/30">
                  <ArrowDownCircle className="text-red-400" size={18} />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-blue-400">
                  Expense Overview
                </h3>
              </div>
              <button
                onClick={() => navigate("/expense")}
                className="flex items-center gap-2 hover:bg-[#51A2FF]/30 p-2 lg:p-3 rounded-xl text-[#51A2FF] hover:text-[#51A2FF]/90 transition-all shadow-lg hover:shadow-xl border border-[#51A2FF]/30 hover:border-[#51A2FF]/50 text-sm lg:text-base"
              >
                View All
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-4">
            <div className="lg:col-span-3 lg:border-r lg:border-gray-700 p-4 lg:p-6">
              <div className="grid grid-cols-1 gap-3 lg:gap-4">
                {dashboardData?.expenses?.slice(0, 5).map((expense) => {
                  const categoryConfig = getCategoryIcon(expense.category);
                  const IconComponent = categoryConfig.icon;

                  return (
                    <div
                      key={expense._id}
                      className="flex items-center justify-between p-3 lg:p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <div
                          className="p-2 lg:p-3 rounded-full border"
                          style={{
                            backgroundColor: categoryConfig.bgColor,
                            borderColor: categoryConfig.color,
                          }}
                        >
                          <IconComponent
                            size={16}
                            style={{ color: categoryConfig.color }}
                          />
                        </div>
                        <div>
                          <p className="text-gray-100 font-medium capitalize text-sm lg:text-lg">
                            {expense.category}
                          </p>
                          <p className="text-gray-400 text-xs lg:text-sm">
                            {formatDate(expense.date)}
                          </p>
                        </div>
                      </div>
                      <span className="text-red-400 font-bold text-sm lg:text-lg">
                        -${expense.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}

                {(!dashboardData?.expenses ||
                  dashboardData.expenses.length === 0) && (
                  <div className="text-center py-6 lg:py-8">
                    <TrendingUp
                      className="text-gray-600 mx-auto mb-3"
                      size={28}
                    />
                    <p className="text-gray-500 text-sm mb-3">
                      No expense transactions yet
                    </p>
                    <button
                      onClick={() => navigate("/expense")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      Add Expense
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 lg:p-6 border-t lg:border-t-0 border-gray-700">
              <div className="text-center mb-4">
                <p className="text-gray-400 text-sm font-medium">
                  Expense Distribution
                </p>
              </div>
              <div className="h-48 lg:h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expensePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {expensePieData.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {expensePieData.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 lg:w-3 lg:h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-300 text-xs">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {item.percentage}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboarHome;
