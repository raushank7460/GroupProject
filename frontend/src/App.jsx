// =========================================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Settings,
  Bell,
  Menu,
  ArrowUpRight,
  ArrowDownLeft,
  LogOut,
  User,
  Pencil,
  Trash2,
  Download,
  IndianRupee,
  TrendingUp,
  CreditCard,
  X,
  PiggyBank,
  Sparkles,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   API
========================================================= */
const API_BASE_URL = "/api";
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =========================================================
   CONSTANTS / HELPERS
========================================================= */
const sidebarItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Income", path: "/income", icon: Wallet },
  { name: "Expenses", path: "/expenses", icon: Receipt },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

const formatCurrency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(v || 0));

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const getListFromResponse = (resData, type) => {
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData?.data)) return resData.data;

  if (type === "income") {
    if (Array.isArray(resData?.incomes)) return resData.incomes;
    if (Array.isArray(resData?.data?.incomes)) return resData.data.incomes;
  } else {
    if (Array.isArray(resData?.expenses)) return resData.expenses;
    if (Array.isArray(resData?.data?.expenses)) return resData.data.expenses;
  }

  return [];
};

const getOverviewFromResponse = (resData) => {
  return resData?.data || resData || null;
};

const getItemFromMutationResponse = (resData, type) => {
  if (!resData) return null;

  if (resData?.data?._id) return resData.data;
  if (resData?._id) return resData;

  if (type === "income") {
    if (resData?.income?._id) return resData.income;
    if (resData?.updatedIncome?._id) return resData.updatedIncome;
    if (resData?.data?.income?._id) return resData.data.income;
    if (resData?.data?.updatedIncome?._id) return resData.data.updatedIncome;
  } else {
    if (resData?.expense?._id) return resData.expense;
    if (resData?.updatedExpense?._id) return resData.updatedExpense;
    if (resData?.data?.expense?._id) return resData.data.expense;
    if (resData?.data?.updatedExpense?._id) return resData.data.updatedExpense;
  }

  return null;
};

/* =========================================================
   GLOBAL ANIMATION STYLES
========================================================= */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes floaty {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.20); }
        50% { box-shadow: 0 0 0 14px rgba(99,102,241,0.00); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-24px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .animate-floaty { animation: floaty 3.5s ease-in-out infinite; }
      .animate-glow { animation: pulseGlow 2.4s ease-in-out infinite; }
      .animate-fade-up { animation: fadeUp 0.6s ease forwards; }
      .animate-slide-left { animation: slideInLeft 0.6s ease forwards; }
      .glass-card {
        background: rgba(255,255,255,0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }
      .premium-shimmer {
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%);
        background-size: 200% 100%;
        animation: shimmer 3s linear infinite;
      }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

/* =========================================================
   UI COMPONENTS
========================================================= */
const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${className}`}
  />
);

const Card = ({ children, className = "" }) => (
  <div
    className={`glass-card rounded-[28px] border border-white/60 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(15,23,42,0.10)] ${className}`}
  >
    {children}
  </div>
);

const GradientCard = ({ children, className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 text-white shadow-[0_15px_50px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 ${className}`}
  >
    <div className="premium-shimmer absolute inset-0 opacity-30" />
    <div className="relative z-10">{children}</div>
  </div>
);

const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-slate-950 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl",
    secondary: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg",
    soft: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    success: "bg-green-500 text-white hover:bg-green-600 shadow-lg",
  };

  return (
    <button
      {...props}
      className={`rounded-2xl px-5 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const SummaryCard = ({ title, value, extra, icon: Icon, dark = false }) => {
  const Wrapper = dark ? GradientCard : Card;
  return (
    <Wrapper className="animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-500"}`}>{title}</p>
          <h3 className="mt-3 break-words text-3xl font-bold">{value}</h3>
          <p className={`mt-3 text-sm ${dark ? "text-slate-300" : "text-slate-500"}`}>{extra}</p>
        </div>
        {Icon && (
          <div className={`rounded-2xl p-3 ${dark ? "bg-white/10" : "bg-indigo-50"}`}>
            <Icon size={22} className={dark ? "text-white" : "text-indigo-700"} />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

/* =========================================================
   CUTE LOGO
========================================================= */
const CuteLogo = ({ small = false }) => (
  <div className={`relative flex items-center justify-center ${small ? "h-12 w-12" : "h-16 w-16"} animate-floaty`}>
    <div
      className={`absolute rounded-[22px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl animate-glow ${
        small ? "h-12 w-12" : "h-16 w-16"
      }`}
    />
    <div className={`absolute rounded-[18px] bg-white/15 backdrop-blur ${small ? "h-10 w-10" : "h-14 w-14"}`} />
    <PiggyBank className={`relative z-10 text-white ${small ? "h-6 w-6" : "h-8 w-8"}`} />
    <Sparkles className={`absolute -right-1 -top-1 text-yellow-300 ${small ? "h-4 w-4" : "h-5 w-5"}`} />
  </div>
);

/* =========================================================
   AUTH PAGE
========================================================= */
function AuthPage({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/user/login" : "/user/register";
      const payload = isLogin ? { email: form.email, password: form.password } : form;

      const { data } = await api.post(endpoint, payload);

      if (!data?.token) throw new Error("Token not received from backend");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 p-6">
      <GlobalStyles />

      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-60 w-60 -translate-x-1/2 rounded-full bg-purple-300/10 blur-3xl" />

      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/40 bg-white/70 shadow-[0_20px_70px_rgba(15,23,42,0.15)] backdrop-blur md:grid-cols-2 animate-fade-up">
        <div className="relative flex flex-col justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-10 text-white md:p-14">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="mb-6 flex items-center gap-4">
            <CuteLogo />
            <div>
              <p className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm">
                Smart Finance Management
              </p>
            </div>
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Expense Tracker Dashboard
          </h1>
          <p className="mt-5 max-w-md text-slate-300">
            Track income, expenses, savings and manage your money beautifully in one place.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Income Tracking</p>
              <h3 className="mt-2 text-2xl font-bold">Easy</h3>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Expense Reports</p>
              <h3 className="mt-2 text-2xl font-bold">Fast</h3>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-6 flex items-center gap-3">
              <CuteLogo small />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="mt-1 text-slate-500">
                  {isLogin ? "Login to continue managing your money" : "Start tracking your money in minutes"}
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-4">
              {!isLogin && (
                <Input
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              )}

              <Input
                name="email"
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />

              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                  {error}
                </p>
              )}

              <Button className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
              </Button>
            </form>

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setForm({ name: "", email: "", password: "" });
              }}
              className="mt-6 text-sm font-semibold text-indigo-700 transition hover:text-indigo-900"
            >
              {isLogin ? "Create new account" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */
function Sidebar({ sidebarOpen, setSidebarOpen, setIsAuthenticated }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/auth");
  };

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6 lg:block">
          <div className="flex items-center gap-3 animate-slide-left">
            <CuteLogo small />
            <div>
              <h1 className="text-2xl font-bold">ExpenseFlow</h1>
              <p className="text-sm text-slate-400">Track money smartly</p>
            </div>
          </div>

          <button
            className="rounded-xl border border-white/10 p-2 transition hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col">
          <nav className="hide-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {sidebarItems.map(({ name, path, icon: Icon }, index) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-white text-slate-950 shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <Icon size={20} />
                {name}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   NAVBAR
========================================================= */
const Navbar = ({ title, user, setSidebarOpen }) => (
  <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur-xl">
    <div className="flex items-center justify-between px-4 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-2xl border border-slate-200 bg-white p-2 transition hover:scale-105 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">Manage your finance beautifully</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:scale-105">
          <Bell size={18} />
        </button>
        <div className="rounded-2xl bg-slate-950 px-4 py-2 text-white shadow-lg transition hover:scale-[1.02]">
          <p className="text-sm font-semibold">{user?.name || "User"}</p>
          <p className="text-xs text-slate-300">{user?.email || "-"}</p>
        </div>
      </div>
    </div>
  </header>
);

/* =========================================================
   DASHBOARD PAGE
========================================================= */
function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard");
      setDashboard(res.data?.data || res.data || null);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <main className="p-4 md:p-8">
        <Card>Loading dashboard...</Card>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="p-4 md:p-8">
        <Card>Dashboard data not found.</Card>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <GradientCard className="mb-6 animate-fade-up">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-300">{getGreeting()}</p>
            <h2 className="mt-2 text-3xl font-bold">Welcome to your finance dashboard</h2>
            <p className="mt-2 max-w-xl text-slate-300">
              Track your earnings, control expenses, and manage your savings smarter.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-slate-300">Savings Rate</p>
            <h3 className="mt-2 text-4xl font-bold">{dashboard.savingsRate || 0}%</h3>
          </div>
        </div>
      </GradientCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Monthly Income"
          value={formatCurrency(dashboard.monthlyIncome)}
          extra="Current month total income"
          icon={TrendingUp}
          dark
        />
        <SummaryCard
          title="Monthly Expense"
          value={formatCurrency(dashboard.monthlyExpense)}
          extra="Current month total expense"
          icon={Receipt}
        />
        <SummaryCard
          title="Savings"
          value={formatCurrency(dashboard.savings)}
          extra={`Savings rate: ${dashboard.savingsRate || 0}%`}
          icon={IndianRupee}
        />
        <SummaryCard
          title="Categories"
          value={dashboard.expenseDistribution?.length || 0}
          extra="Expense category distribution"
          icon={CreditCard}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 animate-fade-up">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Recent Transactions</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              Latest Activity
            </span>
          </div>

          <div className="space-y-4">
            {dashboard.recentTransactions?.length ? (
              dashboard.recentTransactions.slice(0, 8).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50/70 p-4 transition hover:translate-x-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-2xl p-3 ${item.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                      {item.type === "income" ? (
                        <ArrowDownLeft size={18} className="text-green-700" />
                      ) : (
                        <ArrowUpRight size={18} className="text-red-700" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.description}</p>
                      <p className="text-sm text-slate-500">
                        {item.category} • {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900">{formatCurrency(item.amount)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                No recent transactions found.
              </div>
            )}
          </div>
        </Card>

        <Card className="animate-fade-up">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Expense Distribution</h3>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">Monthly</span>
          </div>

          <div className="space-y-5">
            {dashboard.expenseDistribution?.length ? (
              dashboard.expenseDistribution.map((item) => (
                <div key={item.category}>
                  <div className="mb-2 flex justify-between text-sm text-slate-600">
                    <span>{item.category}</span>
                    <span>
                      {formatCurrency(item.amount)} ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-slate-900 to-indigo-700 transition-all duration-700"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                No distribution data found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

/* =========================================================
   TRANSACTION FORM
========================================================= */
function TransactionForm({ type, editingItem, setEditingItem, onSuccess }) {
  const initial = useMemo(
    () => ({
      description: editingItem?.description || "",
      amount: editingItem?.amount || "",
      category: editingItem?.category || "",
      date: editingItem?.date ? new Date(editingItem.date).toISOString().split("T")[0] : "",
    }),
    [editingItem]
  );

  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const reset = () => {
    setForm({ description: "", amount: "", category: "", date: "" });
    setEditingItem(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.description || !form.amount || !form.category || !form.date) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const base = type === "income" ? "/income" : "/expense";
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      let response;

      if (editingItem?._id) {
        response = await api.put(`${base}/update/${editingItem._id}`, payload);
      } else {
        response = await api.post(`${base}/add`, payload);
      }

      const returnedItem = getItemFromMutationResponse(response.data, type);

      await onSuccess(returnedItem, Boolean(editingItem?._id));
      reset();
    } catch (err) {
      alert(err.response?.data?.message || `${type} operation failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden p-0 animate-fade-up">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-5 text-white">
        <h3 className="text-xl font-semibold">{editingItem ? `Edit ${type}` : `Add New ${type}`}</h3>
        <p className="mt-1 text-sm text-slate-300">
          {editingItem ? "Update your transaction details" : "Add a new transaction to your tracker"}
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-4 p-5 md:grid-cols-2">
        <Input
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          placeholder={`Enter ${type} description`}
        />
        <Input
          name="amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          placeholder="Enter amount"
        />
        <Input
          name="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          placeholder="Enter category"
        />
        <Input
          name="date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
        />

        <div className="flex flex-wrap gap-3 md:col-span-2">
          <Button disabled={loading}>
            {loading ? "Saving..." : editingItem ? `Update ${type}` : `Add ${type}`}
          </Button>

          {editingItem && (
            <Button type="button" variant="secondary" onClick={reset}>
              Cancel Edit
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

/* =========================================================
   TRANSACTION PAGE
========================================================= */
function TransactionPage({ type }) {
  const [items, setItems] = useState([]);
  const [overview, setOverview] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const base = type === "income" ? "/income" : "/expense";
  const title = type === "income" ? "Income" : "Expense";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [listRes, overviewRes] = await Promise.all([
        api.get(`${base}/get`),
        api.get(`${base}/overview?range=monthly`),
      ]);

      const listData = getListFromResponse(listRes.data, type);
      const overviewData = getOverviewFromResponse(overviewRes.data);

      setItems(Array.isArray(listData) ? listData : []);
      setOverview(overviewData);
    } catch (err) {
      console.error(`${title} fetch error:`, err);
      setItems([]);
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }, [base, title, type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ===== FIXED EDIT / ADD / DELETE LIVE UPDATE ===== */
  const handleSuccess = async (returnedItem, isEdit) => {
    try {
      if (returnedItem && returnedItem._id) {
        if (isEdit) {
          setItems((prev) => prev.map((item) => (item._id === returnedItem._id ? returnedItem : item)));
        } else {
          setItems((prev) => [returnedItem, ...prev]);
        }
      } else {
        await fetchData();
        return;
      }

      try {
        const overviewRes = await api.get(`${base}/overview?range=monthly`);
        setOverview(getOverviewFromResponse(overviewRes.data));
      } catch (err) {
        console.error("Overview refresh failed:", err);
      }

      setTimeout(async () => {
        try {
          const listRes = await api.get(`${base}/get`);
          const listData = getListFromResponse(listRes.data, type);
          setItems(Array.isArray(listData) ? listData : []);
        } catch (err) {
          console.error("Final sync failed:", err);
        }
      }, 150);
    } catch (err) {
      console.error("Handle success error:", err);
      await fetchData();
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`${base}/delete/${id}`);

      setItems((prev) => prev.filter((item) => item._id !== id));

      if (editingItem?._id === id) {
        setEditingItem(null);
      }

      try {
        const overviewRes = await api.get(`${base}/overview?range=monthly`);
        setOverview(getOverviewFromResponse(overviewRes.data));
      } catch (err) {
        console.error("Overview refresh failed:", err);
      }

      setTimeout(async () => {
        try {
          const listRes = await api.get(`${base}/get`);
          const listData = getListFromResponse(listRes.data, type);
          setItems(Array.isArray(listData) ? listData : []);
        } catch (err) {
          console.error("Delete sync failed:", err);
        }
      }, 150);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  /* ===== ONLY DOWNLOAD FIX ===== */
  const handleDownload = async () => {
    try {
      setDownloadLoading(true);

      const response = await api.get(`${base}/download`, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];
      const extension =
        contentType?.includes("csv")
          ? "csv"
          : contentType?.includes("sheet") || contentType?.includes("excel")
          ? "xlsx"
          : "xlsx";

      const blob = new Blob([response.data], { type: contentType || "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.toLowerCase()}-report.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert(err.response?.data?.message || `${title} download failed`);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <main className="space-y-6 p-4 md:p-8">
      <TransactionForm
        type={type}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        onSuccess={handleSuccess}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title={`Total ${title}`}
          value={formatCurrency(type === "income" ? overview?.totalIncome : overview?.totalExpense)}
          extra={`Transactions: ${overview?.numberOfTransactions || 0}`}
          icon={IndianRupee}
          dark
        />
        <SummaryCard
          title={`Average ${title}`}
          value={formatCurrency(type === "income" ? overview?.averageIncome : overview?.averageExpense)}
          extra={`Range: ${overview?.range || "monthly"}`}
          icon={TrendingUp}
        />

        {/* ===== FIXED DOWNLOAD BUTTON ===== */}
        <button
          onClick={handleDownload}
          disabled={downloadLoading}
          className="rounded-[28px] bg-gradient-to-br from-indigo-600 to-slate-950 p-5 text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-70"
        >
          <div className="flex h-full items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-indigo-100">Export Data</p>
              <h3 className="mt-2 text-xl font-bold">
                {downloadLoading ? "Downloading..." : "Download Excel"}
              </h3>
              <p className="mt-2 text-sm text-indigo-100">Get your {title.toLowerCase()} report</p>
            </div>
            <Download size={24} />
          </div>
        </button>
      </div>

      <Card className="animate-fade-up">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{title} List</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{items.length} Items</span>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Loading {title.toLowerCase()}...
          </div>
        ) : (
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                No {title.toLowerCase()} records found.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-2xl p-3 ${type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                      {type === "income" ? (
                        <ArrowDownLeft size={18} className="text-green-700" />
                      ) : (
                        <ArrowUpRight size={18} className="text-red-700" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">{item.description}</p>
                      <p className="text-sm text-slate-500">
                        {item.category} • {formatDate(item.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <p className="min-w-[100px] text-right text-lg font-bold text-slate-900">
                      {formatCurrency(item.amount)}
                    </p>

                    <Button
                      variant="soft"
                      className="flex items-center gap-2 px-4 py-2"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil size={16} />
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      className="flex items-center gap-2 px-4 py-2"
                      onClick={() => deleteItem(item._id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </main>
  );
}

/* =========================================================
   PROFILE PAGE
========================================================= */
function ProfilePage({ user, refreshUser }) {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    setProfile({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoadingProfile(true);
      await api.put("/user/profile", profile);
      await refreshUser();
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoadingProfile(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      setLoadingPassword(true);
      await api.put("/user/password", passwordData);
      setPasswordData({ currentPassword: "", newPassword: "" });
      alert("Password updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <main className="grid gap-6 p-4 md:p-8 lg:grid-cols-2">
      <Card className="animate-fade-up">
        <h3 className="mb-4 text-xl font-semibold text-slate-900">Update Profile</h3>
        <form onSubmit={updateProfile} className="space-y-4">
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter name"
            required
          />
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Enter email"
            required
          />
          <Button disabled={loadingProfile}>{loadingProfile ? "Saving..." : "Save Profile"}</Button>
        </form>
      </Card>

      <Card className="animate-fade-up">
        <h3 className="mb-4 text-xl font-semibold text-slate-900">Change Password</h3>
        <form onSubmit={updatePassword} className="space-y-4">
          <Input
            type="password"
            placeholder="Current password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="New password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            required
          />
          <Button disabled={loadingPassword}>{loadingPassword ? "Updating..." : "Update Password"}</Button>
        </form>
      </Card>
    </main>
  );
}

/* =========================================================
   SETTINGS PAGE
========================================================= */
const SettingsPage = () => (
  <main className="p-4 md:p-8">
    <Card className="animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Settings</h3>
          <p className="mt-2 text-slate-500">Your premium finance app settings page is ready.</p>
        </div>
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
          <Settings size={22} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
          <p className="font-semibold text-slate-900">Theme</p>
          <p className="mt-1 text-sm text-slate-500">Premium light UI active</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
          <p className="font-semibold text-slate-900">Animations</p>
          <p className="mt-1 text-sm text-slate-500">Smooth transitions enabled</p>
        </div>
      </div>
    </Card>
  </main>
);

/* =========================================================
   PROTECTED LAYOUT
========================================================= */
function ProtectedLayout({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/user/me");
      const updatedUser = data?.user || data?.data?.user || data?.data || user || null;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser || {}));
    } catch (err) {
      console.error("User refresh error:", err);
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/auth");
    }
  }, [navigate, setIsAuthenticated, user]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200">
      <GlobalStyles />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setIsAuthenticated={setIsAuthenticated}
      />

      <div className="min-h-screen flex-1 lg:ml-72">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar title="Dashboard" user={user} setSidebarOpen={setSidebarOpen} />
                <DashboardPage />
              </>
            }
          />
          <Route
            path="/income"
            element={
              <>
                <Navbar title="Income" user={user} setSidebarOpen={setSidebarOpen} />
                <TransactionPage type="income" />
              </>
            }
          />
          <Route
            path="/expenses"
            element={
              <>
                <Navbar title="Expenses" user={user} setSidebarOpen={setSidebarOpen} />
                <TransactionPage type="expense" />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar title="Profile" user={user} setSidebarOpen={setSidebarOpen} />
                <ProfilePage user={user} refreshUser={refreshUser} />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <Navbar title="Settings" user={user} setSidebarOpen={setSidebarOpen} />
                <SettingsPage />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/auth" element={<AuthPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <ProtectedLayout setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <AuthPage setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


