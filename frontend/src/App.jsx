import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard, Receipt, Wallet, Settings, Bell, Menu,
  ArrowUpRight, ArrowDownLeft, LogOut, User
} from "lucide-react";

const API_BASE_URL = "http://localhost:7000/api";
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

const Input = (props) => (
  <input {...props} className={`w-full rounded-2xl border px-4 py-3 outline-none ${props.className || ""}`} />
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</div>
);

const SummaryCard = ({ title, value, extra }) => (
  <Card>
    <p className="text-sm text-slate-500">{title}</p>
    <h3 className="mt-3 text-3xl font-bold">{value}</h3>
    <p className="mt-3 text-sm text-slate-500">{extra}</p>
  </Card>
);

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
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
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
      <div className="grid w-full max-w-5xl rounded-[32px] bg-white overflow-hidden shadow-xl md:grid-cols-2">
        <div className="bg-slate-950 p-10 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Expense Tracker</h1>
          <p className="mt-4 text-slate-300">
            Track income, expenses, savings and manage everything in one dashboard.
          </p>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold">{isLogin ? "Login" : "Register"}</h2>
          <p className="mt-2 text-slate-500">
            {isLogin ? "Login your account" : "Create a new account"}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {!isLogin && (
              <Input name="name" placeholder="Enter your name" value={form.name} onChange={handleChange} />
            )}
            <Input name="email" type="email" placeholder="Enter email" value={form.email} onChange={handleChange} />
            <Input name="password" type="password" placeholder="Enter password" value={form.password} onChange={handleChange} />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white">
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setForm({ name: "", email: "", password: "" });
            }}
            className="mt-6 text-sm font-semibold text-slate-700"
          >
            {isLogin ? "Create new account" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-slate-950 text-white transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 px-6 py-5">
          <h1 className="text-2xl font-bold">ExpenseFlow</h1>
          <p className="text-sm text-slate-400">Track money smartly</p>
        </div>

        <div className="flex flex-1 flex-col">
          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {sidebarItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 ${
                    isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-900"
                  }`
                }
              >
                <Icon size={20} />
                {name}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950"
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

const Navbar = ({ title, user, setSidebarOpen }) => (
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

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setDashboard(res.data.data)).catch(console.error);
  }, []);

  if (!dashboard) return <div className="p-8">Loading dashboard...</div>;

  return (
    <main className="p-4 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Monthly Income" value={formatCurrency(dashboard.monthlyIncome)} extra="Current month total income" />
        <SummaryCard title="Monthly Expense" value={formatCurrency(dashboard.monthlyExpense)} extra="Current month total expense" />
        <SummaryCard title="Savings" value={formatCurrency(dashboard.savings)} extra={`Savings rate: ${dashboard.savingsRate || 0}%`} />
        <SummaryCard title="Categories" value={dashboard.expenseDistribution?.length || 0} extra="Expense category distribution" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
          <div className="mt-5 space-y-4">
            {dashboard.recentTransactions?.slice(0, 8).map((item) => (
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
        </Card>

        <Card>
          <h3 className="text-xl font-semibold">Expense Distribution</h3>
          <div className="mt-6 space-y-5">
            {dashboard.expenseDistribution?.map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span>{formatCurrency(item.amount)} ({item.percent}%)</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-slate-900" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

function TransactionForm({ type, editingItem, setEditingItem, onSuccess }) {
  const initial = useMemo(() => ({
    description: editingItem?.description || "",
    amount: editingItem?.amount || "",
    category: editingItem?.category || "",
    date: editingItem?.date ? new Date(editingItem.date).toISOString().split("T")[0] : "",
  }), [editingItem]);

  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => setForm(initial), [initial]);

  const reset = () => {
    setForm({ description: "", amount: "", category: "", date: "" });
    setEditingItem(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base = type === "income" ? "/income" : "/expense";
      const payload = { ...form, amount: Number(form.amount) };
      editingItem?._id
        ? await api.put(`${base}/update/${editingItem._id}`, payload)
        : await api.post(`${base}/add`, payload);
      reset();
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || `${type} operation failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
      <Input name="description" value={form.description} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder={`Enter ${type} description`} />
      <Input name="amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder="Enter amount" />
      <Input name="category" value={form.category} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder="Enter category" />
      <Input name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} />
      <div className="flex gap-3 md:col-span-2">
        <button disabled={loading} className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">
          {loading ? "Saving..." : editingItem ? `Update ${type}` : `Add ${type}`}
        </button>
        {editingItem && (
          <button type="button" onClick={reset} className="rounded-2xl border px-5 py-3 font-semibold">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

function TransactionPage({ type }) {
  const [items, setItems] = useState([]);
  const [overview, setOverview] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const base = type === "income" ? "/income" : "/expense";
  const title = type === "income" ? "Income" : "Expense";

  const fetchData = async () => {
    try {
      const [listRes, overviewRes] = await Promise.all([
        api.get(`${base}/get`),
        api.get(`${base}/overview?range=monthly`),
      ]);
      setItems(listRes.data);
      setOverview(overviewRes.data.data);
    } catch (err) {
      console.error(`${title} fetch error:`, err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteItem = async (id) => {
    try {
      await api.delete(`${base}/delete/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <main className="space-y-6 p-4 md:p-8">
      <TransactionForm type={type} editingItem={editingItem} setEditingItem={setEditingItem} onSuccess={fetchData} />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title={`Total ${title}`}
          value={formatCurrency(type === "income" ? overview?.totalIncome : overview?.totalExpense)}
          extra={`Transactions: ${overview?.numberOfTransactions || 0}`}
        />
        <SummaryCard
          title={`Average ${title}`}
          value={formatCurrency(type === "income" ? overview?.averageIncome : overview?.averageExpense)}
          extra={`Range: ${overview?.range || "monthly"}`}
        />
        <a href={`${API_BASE_URL}${base}/download`} className="rounded-3xl bg-slate-950 p-5 text-white">
          Download {type} excel
        </a>
      </div>

      <Card>
        <h3 className="text-xl font-semibold">{title} List</h3>
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
      </Card>
    </main>
  );
}

function ProfilePage({ user, refreshUser }) {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    setProfile({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/profile", profile);
      refreshUser();
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/password", passwordData);
      setPasswordData({ currentPassword: "", newPassword: "" });
      alert("Password updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    }
  };

  return (
    <main className="grid gap-6 p-4 md:p-8 lg:grid-cols-2">
      <form onSubmit={updateProfile} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-xl font-semibold">Update Profile</h3>
        <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white">Save Profile</button>
      </form>

      <form onSubmit={updatePassword} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-xl font-semibold">Change Password</h3>
        <Input type="password" placeholder="Current password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
        <Input type="password" placeholder="New password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white">Update Password</button>
      </form>
    </main>
  );
}

const SettingsPage = () => (
  <main className="p-8">
    <Card>Settings page ready.</Card>
  </main>
);

function ProtectedLayout({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/user/me");
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch {
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/auth");
    }
  };

  useEffect(() => { refreshUser(); }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setIsAuthenticated={setIsAuthenticated} />
      <div className="min-h-screen flex-1 lg:ml-72">
        <Routes>
          <Route path="/" element={<><Navbar title="Dashboard" user={user} setSidebarOpen={setSidebarOpen} /><DashboardPage /></>} />
          <Route path="/income" element={<><Navbar title="Income" user={user} setSidebarOpen={setSidebarOpen} /><TransactionPage type="income" /></>} />
          <Route path="/expenses" element={<><Navbar title="Expenses" user={user} setSidebarOpen={setSidebarOpen} /><TransactionPage type="expense" /></>} />
          <Route path="/profile" element={<><Navbar title="Profile" user={user} setSidebarOpen={setSidebarOpen} /><ProfilePage user={user} refreshUser={refreshUser} /></>} />
          <Route path="/settings" element={<><Navbar title="Settings" user={user} setSidebarOpen={setSidebarOpen} /><SettingsPage /></>} />
        </Routes>
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
        <Route
          path="/*"
          element={
            isAuthenticated
              ? <ProtectedLayout setIsAuthenticated={setIsAuthenticated} />
              : <AuthPage setIsAuthenticated={setIsAuthenticated} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


