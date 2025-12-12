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
  Plus,
  X,
  Trash2,
  Download,
  Calendar,
  Briefcase,
  Laptop,
  PieChart as PieChartIcon,
  Gift,
  Building,
  CreditCard,
  Star,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Income = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIncomePopup, setShowIncomePopup] = useState(false);
  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const processIncomeChartData = (incomes) => {
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

    const monthlyData = months.map((month) => ({ month, income: 0 }));

    if (!incomes || incomes.length === 0) return monthlyData;

    incomes.forEach((income) => {
      const date = new Date(income.date);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].income += income.amount;
    });

    return monthlyData;
  };

  const processIncomePieData = (incomes) => {
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-blue-400 font-bold">{label}</p>
          <p className="text-green-400">
            Income: ${payload[0]?.value?.toLocaleString() || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-white">
            Amount: ${payload[0].value?.toLocaleString()}
          </p>
          <p className="text-gray-300">{payload[0].payload.percentage}</p>
        </div>
      );
    }
    return null;
  };

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://expense-tracker-backend-eta-coral.vercel.app/api/v1/income/get",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.stats) {
        setIncomes(res.data.income);
        
        const total = res.data.income.reduce(
          (sum, income) => sum + income.amount,
          0
        );
        setTotalIncome(total);

        const incomeChartData = processIncomeChartData(res.data.income);
        setChartData(incomeChartData);

        const incomePieData = processIncomePieData(res.data.income);
        setPieData(incomePieData);
      }
    } catch (error) {
      console.log("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post(
        "https://expense-tracker-backend-eta-coral.vercel.app/api/v1/income/add",
        {
          source: newIncome.source,
          amount: parseFloat(newIncome.amount),
          date: newIncome.date,
          icon: newIncome.icon,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.status) {
        setShowIncomePopup(false);
        setNewIncome({ source: "", amount: "", date: "", icon: "" });
        fetchIncomes();
      }
    } catch (error) {
      console.error("Error adding income:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        const res = await axios.get(
          `https://expense-tracker-backend-eta-coral.vercel.app/api/v1/income/${incomeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.status) {
          await fetchIncomes();
        } else {
          alert(res.data.message || "Failed to delete income");
        }
      } catch (error) {
        console.error("Error deleting income:", error);
        alert("Error deleting income");
      }
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const res = await axios.get(
        "https://expense-tracker-backend-eta-coral.vercel.app/api/v1/income/downloadexcel",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Error downloading Excel file");
    }
  };

  useEffect(() => {
    fetchIncomes();

    axios
      .get(
        "https://expense-tracker-backend-eta-coral.vercel.app/userInfo",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        if (res.data.status) {
          setUser({
            name: res.data.user?.fullName || "User",
            image: res.data.user?.profileImage
              ? `https://expense-tracker-backend-eta-coral.vercel.app${res.data.user.profileImage}`
              : null,
          });
        }
      })
      .catch((err) => console.error(err));
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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getIncomeSourceConfig = (source) => {
    const sourceKey = source?.toLowerCase();
    return incomeSources[sourceKey] || incomeSources.other;
  };

  const COLORS = [
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-gray-100 flex overflow-hidden">
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg border border-gray-700"
        >
          <Menu size={20} />
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

          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 mb-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-blue-400 text-2xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <h2 className="text-lg font-semibold text-blue-400 text-center">
              {user.name || "Loading..."}
            </h2>
            <p className="text-gray-400 text-sm mt-1 text-center">
              Income Management
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                navigate("/dashboard");
                if (isMobile) setSidebarOpen(false);
              }}
              className="flex items-center w-full gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-700"
            >
              <LayoutDashboard size={18} className="text-blue-400" /> Dashboard
            </button>

            <button className="flex items-center w-full gap-3 px-4 py-3 bg-blue-600/20 text-blue-300 rounded-lg border border-blue-500/30">
              <Wallet size={18} /> Income
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-blue-400">
              Income Management
            </h1>
            <p className="text-gray-400 mt-2 text-sm lg:text-base">
              Track and manage all your income sources in one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 hover:bg-[#51A2FF]/30 p-2 lg:p-3 rounded-xl text-[#51A2FF] hover:text-[#51A2FF]/90 transition-all shadow-lg hover:shadow-xl border border-[#51A2FF]/30 hover:border-[#51A2FF]/50 text-sm lg:text-base"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 p-4 lg:p-6 rounded-2xl border border-green-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm mb-2">Total Income</p>
                <h3 className="text-xl lg:text-3xl font-bold text-white">
                  ${totalIncome.toLocaleString()}
                </h3>
                <p className="text-green-400 text-sm mt-2">
                  {incomes.length} income records
                </p>
              </div>
              <div className="bg-green-500/20 p-3 lg:p-4 rounded-full border border-green-500/30">
                <DollarSign className="text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 p-4 lg:p-6 rounded-2xl border border-blue-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm mb-2">Average Income</p>
                <h3 className="text-xl lg:text-3xl font-bold text-white">
                  $
                  {incomes.length > 0
                    ? Math.round(totalIncome / incomes.length).toLocaleString()
                    : "0"}
                </h3>
                <p className="text-blue-400 text-sm mt-2">per transaction</p>
              </div>
              <div className="bg-blue-500/20 p-3 lg:p-4 rounded-full border border-blue-500/30">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 p-4 lg:p-6 rounded-2xl border border-purple-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-2">Income Sources</p>
                <h3 className="text-xl lg:text-3xl font-bold text-white">
                  {Object.keys(processIncomePieData(incomes)).length}
                </h3>
                <p className="text-purple-400 text-sm mt-2">
                  different sources
                </p>
              </div>
              <div className="bg-purple-500/20 p-3 lg:p-4 rounded-full border border-purple-500/30">
                <PieChartIcon className="text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
         
          <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 lg:p-3 rounded-full border border-green-500/30">
                  <TrendingUp className="text-green-400" size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Monthly Income</p>
                  <h3 className="text-green-400 text-lg lg:text-xl font-bold">
                    ${totalIncome.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>

            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#4b5563" }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Income"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500/20 p-2 lg:p-3 rounded-full border border-purple-500/30">
                  <PieChartIcon className="text-purple-400" size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Income Distribution</p>
                  <h3 className="text-purple-400 text-lg lg:text-xl font-bold">
                    by Source
                  </h3>
                </div>
              </div>
            </div>

            {pieData.length > 0 ? (
              <>
                <div className="h-48 lg:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 lg:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 lg:w-3 lg:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-xs lg:text-sm font-medium whitespace-nowrap">
                          {item.name}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {item.percentage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48">
                <div className="text-center text-gray-500">
                  <PieChartIcon size={32} className="mx-auto mb-3" />
                  <p className="text-sm">No income data for chart</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-700 bg-gray-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 p-2 lg:p-3 rounded-full border border-blue-500/30">
                  <Wallet className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-white">
                    Income Records
                  </h3>
                  <p className="text-gray-400 text-sm">
                    All your income transactions
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIncomePopup(true)}
                className="flex items-center gap-2 hover:bg-green-500/30 p-2 lg:p-3 rounded-xl text-green-400 hover:text-green-300 transition-all shadow-lg hover:shadow-xl border border-green-500/30 hover:border-green-400/50 text-sm lg:text-base w-full sm:w-auto justify-center"
              >
                <Plus size={16} />
                Add Income
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            {incomes.length > 0 ? (
              <div className="space-y-3 lg:space-y-4">
                {incomes.map((income) => {
                  const sourceConfig = getIncomeSourceConfig(income.source);
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
                          <p className="text-white font-semibold text-base lg:text-lg">
                            {sourceConfig.name}
                          </p>
                          <div className="flex items-center gap-2 lg:gap-4 mt-1">
                            <p className="text-gray-400 text-xs lg:text-sm flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(income.date)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 lg:gap-4">
                        <span className="text-green-400 font-bold text-base lg:text-xl">
                          +${income.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDeleteIncome(income._id)}
                          className="text-red-400 hover:text-red-300 transition-all p-1 lg:p-2 hover:bg-red-500/20 rounded-lg"
                          title="Delete Income"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 lg:py-12">
                <Wallet
                  className="text-gray-600 mx-auto mb-3 lg:mb-4"
                  size={40}
                />
                <h3 className="text-gray-400 text-base lg:text-lg mb-2">
                  No income records found
                </h3>
                <p className="text-gray-500 text-sm mb-4 lg:mb-6">
                  Start by adding your first income source
                </p>
                <button
                  onClick={() => setShowIncomePopup(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-white transition-all shadow-lg text-sm lg:text-base"
                >
                  Add Your First Income
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showIncomePopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-4 lg:p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-bold text-blue-400">
                Add New Income
              </h3>
              <button
                onClick={() => setShowIncomePopup(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddIncome} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">
                  Income Source *
                </label>
                <select
                  value={newIncome.source}
                  onChange={(e) => {
                    const selectedSource = e.target.value;
                    setNewIncome({
                      ...newIncome,
                      source: selectedSource,
                      icon: selectedSource,
                    });
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm lg:text-base"
                  required
                >
                  <option value="">Select Income Source</option>
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="business">Business</option>
                  <option value="investment">Investment</option>
                  <option value="bonus">Bonus</option>
                  <option value="rental">Rental Income</option>
                  <option value="dividends">Dividends</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  value={newIncome.amount}
                  onChange={(e) =>
                    setNewIncome({ ...newIncome, amount: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm lg:text-base"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">
                  Date *
                </label>
                <input
                  type="date"
                  value={newIncome.date}
                  onChange={(e) =>
                    setNewIncome({ ...newIncome, date: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm lg:text-base"
                  max={getCurrentDate()}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowIncomePopup(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 lg:py-3 rounded-lg transition-all text-sm lg:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 lg:py-3 rounded-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                >
                  {submitting ? "Adding..." : "Add Income"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
