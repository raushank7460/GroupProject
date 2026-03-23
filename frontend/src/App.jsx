import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Settings,
  Bell,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  LogOut,
  User,
  ShieldCheck,
  BarChart3,
  WalletCards,
} from "lucide-react";

const API_BASE_URL = "http://localhost:7000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const sidebarItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Income", path: "/income", icon: Wallet },
  { name: "Expenses", path: "/expenses", icon: Receipt },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AuthPage({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isLogin ? "/user/login" : "/user/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await api.post(endpoint, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-center bg-slate-950 p-10 text-white md:p-12">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Expense Tracker</h1>

          <p className="mt-6 max-w-md text-base leading-8 text-slate-300 md:text-lg">
            Expense Tracker helps you monitor income, control expenses, track savings,
            and manage your financial activities with a clean and modern dashboard.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl bg-slate-900/80 p-5 shadow-sm ring-1 ring-white/10">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/10 p-3">
                  <WalletCards size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Easy Transaction Tracking</h3>
                  {/* <p className="mt-1 text-sm leading-6 text-slate-300">
                    Add and manage your daily income and expenses in a simple and
                    organized way.
                  </p> */}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/80 p-5 shadow-sm ring-1 ring-white/10">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/10 p-3">
                  <BarChart3 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Clear Financial Insights</h3>
                  {/* <p className="mt-1 text-sm leading-6 text-slate-300">
                    Understand your spending, savings, and overall financial
                    performance at a glance.
                  </p> */}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/80 p-5 shadow-sm ring-1 ring-white/10">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/10 p-3">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Secure and Reliable Access</h3>
                  {/* <p className="mt-1 text-sm leading-6 text-slate-300">
                    Access your account safely and keep your financial records protected
                    and available anytime.
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold">{isLogin ? "Login" : "Register"}</h2>
          <p className="mt-2 text-slate-500">
            {isLogin ? "Apne account me login karo" : "Naya account banao"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            {isLogin ? "Create new account" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-slate-800 px-6 py-5">
          <h1 className="text-2xl font-bold">ExpenseFlow</h1>
          <p className="text-sm text-slate-400">Track money smartly</p>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 ${isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-900"}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4">
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function Navbar({ setSidebarOpen, title, user }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-2xl border p-2 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-slate-500">Backend connected expense tracker dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-2xl border p-3"><Bell size={18} /></button>
          <div className="rounded-2xl bg-slate-950 px-4 py-2 text-white">
            <p className="text-sm font-semibold">{user?.name || "User"}</p>
            <p className="text-xs text-slate-300">{user?.email || "-"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function SummaryCard({ title, value, extra }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-3 text-3xl font-bold">{value}</h3>
      <p className="mt-3 text-sm text-slate-500">{extra}</p>
    </div>
  );
}

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard");
      setDashboard(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <main className="p-4 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Monthly Income" value={formatCurrency(dashboard?.monthlyIncome)} extra="Current month total income" />
        <SummaryCard title="Monthly Expense" value={formatCurrency(dashboard?.monthlyExpense)} extra="Current month total expense" />
        <SummaryCard title="Savings" value={formatCurrency(dashboard?.savings)} extra={`Savings rate: ${dashboard?.savingsRate || 0}%`} />
        <SummaryCard title="Categories" value={dashboard?.expenseDistribution?.length || 0} extra="Expense category distribution" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
          <div className="mt-5 space-y-4">
            {dashboard?.recentTransactions?.slice(0, 8).map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-2xl p-3 ${item.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                    {item.type === "income" ? <ArrowDownLeft size={18} className="text-green-700" /> : <ArrowUpRight size={18} className="text-red-700" />}
                  </div>
                  <div>
                    <p className="font-semibold">{item.description}</p>
                    <p className="text-sm text-slate-500">{item.category} • {formatDate(item.date)}</p>
                  </div>
                </div>
                <p className="font-bold">{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-xl font-semibold">Expense Distribution</h3>
          <div className="mt-6 space-y-5">
            {dashboard?.expenseDistribution?.map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{item.category}</span>
                  <span>{formatCurrency(item.amount)} ({item.percent}%)</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-slate-900" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function TransactionForm({ type, onSuccess, editingItem, setEditingItem }) {
  const initialState = useMemo(() => ({
    description: editingItem?.description || "",
    amount: editingItem?.amount || "",
    category: editingItem?.category || "",
    date: editingItem?.date ? new Date(editingItem.date).toISOString().split("T")[0] : "",
  }), [editingItem]);

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = type === "income" ? "/income" : "/expense";
      if (editingItem?._id) {
        await api.put(`${endpoint}/update/${editingItem._id}`, formData);
      } else {
        await api.post(`${endpoint}/add`, formData);
      }
      setFormData({ description: "", amount: "", category: "", date: "" });
      setEditingItem(null);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
      <input name="description" value={formData.description} onChange={handleChange} placeholder={`Enter ${type} description`} className="rounded-2xl border px-4 py-3 outline-none" />
      <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="Enter amount" className="rounded-2xl border px-4 py-3 outline-none" />
      <input name="category" value={formData.category} onChange={handleChange} placeholder="Enter category" className="rounded-2xl border px-4 py-3 outline-none" />
      <input name="date" type="date" value={formData.date} onChange={handleChange} className="rounded-2xl border px-4 py-3 outline-none" />
      <div className="md:col-span-2 flex gap-3">
        <button type="submit" disabled={loading} className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">
          {loading ? "Saving..." : editingItem ? `Update ${type}` : `Add ${type}`}
        </button>
        {editingItem && (
          <button type="button" onClick={() => setEditingItem(null)} className="rounded-2xl border px-5 py-3 font-semibold">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

function IncomePage() {
  const [items, setItems] = useState([]);
  const [overview, setOverview] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      const [listRes, overviewRes] = await Promise.all([
        api.get("/income/get"),
        api.get("/income/overview?range=monthly"),
      ]);
      setItems(listRes.data);
      setOverview(overviewRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteItem = async (id) => {
    await api.delete(`/income/delete/${id}`);
    fetchData();
  };

  return (
    <main className="space-y-6 p-4 md:p-8">
      <TransactionForm type="income" onSuccess={fetchData} editingItem={editingItem} setEditingItem={setEditingItem} />
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Total Income" value={formatCurrency(overview?.totalIncome)} extra={`Transactions: ${overview?.numberOfTransactions || 0}`} />
        <SummaryCard title="Average Income" value={formatCurrency(overview?.averageIncome)} extra={`Range: ${overview?.range || "monthly"}`} />
        <a href={`${API_BASE_URL}/income/download`} className="rounded-3xl bg-slate-950 p-5 text-white">Download income excel</a>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-xl font-semibold">Income List</h3>
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-2xl border p-4">
              <div>
                <p className="font-semibold">{item.description}</p>
                <p className="text-sm text-slate-500">{item.category} • {formatDate(item.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold">{formatCurrency(item.amount)}</p>
                <button onClick={() => setEditingItem(item)} className="rounded-xl border px-3 py-2">Edit</button>
                <button onClick={() => deleteItem(item._id)} className="rounded-xl bg-red-500 px-3 py-2 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ExpensePage() {
  const [items, setItems] = useState([]);
  const [overview, setOverview] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      const [listRes, overviewRes] = await Promise.all([
        api.get("/expense/get"),
        api.get("/expense/overview?range=monthly"),
      ]);
      setItems(listRes.data);
      setOverview(overviewRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteItem = async (id) => {
    await api.delete(`/expense/delete/${id}`);
    fetchData();
  };

  return (
    <main className="space-y-6 p-4 md:p-8">
      <TransactionForm type="expense" onSuccess={fetchData} editingItem={editingItem} setEditingItem={setEditingItem} />
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Total Expense" value={formatCurrency(overview?.totalExpense)} extra={`Transactions: ${overview?.numberOfTransactions || 0}`} />
        <SummaryCard title="Average Expense" value={formatCurrency(overview?.averageExpense)} extra={`Range: ${overview?.range || "monthly"}`} />
        <a href={`${API_BASE_URL}/expense/download`} className="rounded-3xl bg-slate-950 p-5 text-white">Download expense excel</a>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-xl font-semibold">Expense List</h3>
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-2xl border p-4">
              <div>
                <p className="font-semibold">{item.description}</p>
                <p className="text-sm text-slate-500">{item.category} • {formatDate(item.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold">{formatCurrency(item.amount)}</p>
                <button onClick={() => setEditingItem(item)} className="rounded-xl border px-3 py-2">Edit</button>
                <button onClick={() => deleteItem(item._id)} className="rounded-xl bg-red-500 px-3 py-2 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ProfilePage({ user, refreshUser }) {
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    setProfile({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    await api.put("/user/profile", profile);
    refreshUser();
    alert("Profile updated successfully");
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    await api.put("/user/password", passwordData);
    setPasswordData({ currentPassword: "", newPassword: "" });
    alert("Password updated successfully");
  };

  return (
    <main className="grid gap-6 p-4 md:p-8 lg:grid-cols-2">
      <form onSubmit={updateProfile} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 space-y-4">
        <h3 className="text-xl font-semibold">Update Profile</h3>
        <input className="w-full rounded-2xl border px-4 py-3" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <input className="w-full rounded-2xl border px-4 py-3" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white">Save Profile</button>
      </form>

      <form onSubmit={updatePassword} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 space-y-4">
        <h3 className="text-xl font-semibold">Change Password</h3>
        <input type="password" placeholder="Current password" className="w-full rounded-2xl border px-4 py-3" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
        <input type="password" placeholder="New password" className="w-full rounded-2xl border px-4 py-3" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white">Update Password</button>
      </form>
    </main>
  );
}

function SettingsPage() {
  return <main className="p-8"><div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">Settings page ready.</div></main>;
}

function ProtectedLayout({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      navigate("/auth");
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="min-h-screen flex-1 lg:ml-72">
          <Routes>
            <Route path="/" element={<><Navbar setSidebarOpen={setSidebarOpen} title="Dashboard" user={user} /><DashboardPage /></>} />
            <Route path="/income" element={<><Navbar setSidebarOpen={setSidebarOpen} title="Income" user={user} /><IncomePage /></>} />
            <Route path="/expenses" element={<><Navbar setSidebarOpen={setSidebarOpen} title="Expenses" user={user} /><ExpensePage /></>} />
            <Route path="/profile" element={<><Navbar setSidebarOpen={setSidebarOpen} title="Profile" user={user} /><ProfilePage user={user} refreshUser={refreshUser} /></>} />
            <Route path="/settings" element={<><Navbar setSidebarOpen={setSidebarOpen} title="Settings" user={user} /><SettingsPage /></>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/*" element={isAuthenticated ? <ProtectedLayout setIsAuthenticated={setIsAuthenticated} /> : <AuthPage setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </BrowserRouter>
  );
}