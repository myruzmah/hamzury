/**
 * HAMZURY Facilities Dashboard
 * Manages office resources, bookings, and maintenance requests.
 */
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Building2, Calendar, Wrench, CheckCircle2, Clock, AlertCircle, ArrowLeft, Plus } from "lucide-react";

const BRAND = "#1B4D3E";

const ROOMS = [
  { id: "boardroom", name: "Boardroom", capacity: 12, icon: "🏛️" },
  { id: "studio_a", name: "Studio A", capacity: 6, icon: "🎨" },
  { id: "studio_b", name: "Studio B", capacity: 4, icon: "📷" },
  { id: "meeting_room", name: "Meeting Room", capacity: 8, icon: "💼" },
  { id: "training_hall", name: "Training Hall", capacity: 30, icon: "🎓" },
];

const MAINTENANCE_CATEGORIES = ["Electrical", "Plumbing", "IT Equipment", "Furniture", "HVAC", "Security", "Cleaning", "Other"];

interface Booking {
  id: string;
  room: string;
  bookedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface MaintenanceRequest {
  id: string;
  category: string;
  description: string;
  location: string;
  reportedBy: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

// Mock data — replace with real tRPC calls when backend is extended
const MOCK_BOOKINGS: Booking[] = [
  { id: "BK-001", room: "Boardroom", bookedBy: "Idris Ibrahim", date: "2026-03-17", startTime: "09:00", endTime: "11:00", purpose: "CEO Strategy Review", status: "confirmed" },
  { id: "BK-002", room: "Studio A", bookedBy: "Maryam Ashir Lalo", date: "2026-03-17", startTime: "13:00", endTime: "16:00", purpose: "Brand Identity Shoot", status: "confirmed" },
  { id: "BK-003", room: "Meeting Room", bookedBy: "Amina Ibrahim Musa", date: "2026-03-18", startTime: "10:00", endTime: "11:30", purpose: "Client Onboarding", status: "pending" },
];

const MOCK_MAINTENANCE: MaintenanceRequest[] = [
  { id: "MR-001", category: "IT Equipment", description: "Projector in boardroom not displaying correctly", location: "Boardroom", reportedBy: "Idris Ibrahim", priority: "high", status: "in_progress", createdAt: "2026-03-15" },
  { id: "MR-002", category: "Electrical", description: "Power socket near Studio A desk not working", location: "Studio A", reportedBy: "Suleiman Ahmad Bashir", priority: "medium", status: "open", createdAt: "2026-03-14" },
];

const PRIORITY_COLOR: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-50 text-yellow-700",
  high: "bg-orange-50 text-orange-700",
  urgent: "bg-red-50 text-red-700",
};

const STATUS_COLOR: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  cancelled: "bg-red-50 text-red-700",
  open: "bg-blue-50 text-blue-700",
  in_progress: "bg-purple-50 text-purple-700",
  resolved: "bg-green-50 text-green-700",
};

export default function FacilitiesDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "maintenance" | "assets">("overview");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({ room: "Boardroom", date: "", startTime: "", endTime: "", purpose: "" });
  const [maintenanceForm, setMaintenanceForm] = useState({ category: "IT Equipment", description: "", location: "", priority: "medium" as const });
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE);

  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split("T")[0]);
  const openMaintenance = maintenance.filter(m => m.status !== "resolved").length;

  const submitBooking = () => {
    if (!bookingForm.date || !bookingForm.startTime || !bookingForm.endTime || !bookingForm.purpose) {
      toast.error("Please fill in all fields.");
      return;
    }
    const newBooking: Booking = {
      id: `BK-${String(bookings.length + 1).padStart(3, "0")}`,
      ...bookingForm,
      bookedBy: "Current User",
      status: "pending",
    };
    setBookings(prev => [...prev, newBooking]);
    setShowBookingForm(false);
    setBookingForm({ room: "Boardroom", date: "", startTime: "", endTime: "", purpose: "" });
    toast.success("Booking request submitted.");
  };

  const submitMaintenance = () => {
    if (!maintenanceForm.description || !maintenanceForm.location) {
      toast.error("Please fill in all fields.");
      return;
    }
    const newRequest: MaintenanceRequest = {
      id: `MR-${String(maintenance.length + 1).padStart(3, "0")}`,
      ...maintenanceForm,
      reportedBy: "Current User",
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setMaintenance(prev => [...prev, newRequest]);
    setShowMaintenanceForm(false);
    setMaintenanceForm({ category: "IT Equipment", description: "", location: "", priority: "medium" });
    toast.success("Maintenance request submitted.");
  };

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "bookings", label: "Room Bookings" },
    { id: "maintenance", label: "Maintenance" },
    { id: "assets", label: "Assets" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center">
              <Building2 size={20} style={{ color: BRAND }} />
            </div>
            <div>
              <div className="text-base font-bold text-[#1B4D3E]">Facilities Management</div>
              <div className="text-xs text-stone-400">HAMZURY OS · Systems Department</div>
            </div>
          </div>
          <Link href="/os/ai" className="text-xs text-stone-400 hover:text-[#1B4D3E] transition-colors">
            AI Network →
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Rooms", value: ROOMS.length, icon: <Building2 size={16} />, color: "#1B4D3E" },
            { label: "Today's Bookings", value: todayBookings.length, icon: <Calendar size={16} />, color: "#3b82f6" },
            { label: "Open Maintenance", value: openMaintenance, icon: <Wrench size={16} />, color: "#f59e0b" },
            { label: "Resolved This Week", value: maintenance.filter(m => m.status === "resolved").length, icon: <CheckCircle2 size={16} />, color: "#10b981" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl border border-stone-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: kpi.color }}>{kpi.icon}</span>
                <span className="text-xs text-stone-400">{kpi.label}</span>
              </div>
              <div className="text-2xl font-bold text-stone-900">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-6 w-fit">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white text-[#1B4D3E] shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Status */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Room Status</h3>
              <div className="space-y-3">
                {ROOMS.map((room) => {
                  const isBooked = bookings.some(b => b.room === room.name && b.date === new Date().toISOString().split("T")[0] && b.status === "confirmed");
                  return (
                    <div key={room.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{room.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-stone-900">{room.name}</div>
                          <div className="text-xs text-stone-400">Capacity: {room.capacity}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${isBooked ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {isBooked ? "In Use" : "Available"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[...bookings.slice(-3).reverse(), ...maintenance.slice(-2).reverse()].map((item: any, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.status === "confirmed" || item.status === "resolved" ? "bg-green-500" : "bg-yellow-500"}`} />
                    <div>
                      <div className="text-xs font-medium text-stone-800">
                        {item.room ? `${item.room} booked by ${item.bookedBy}` : `${item.category} issue at ${item.location}`}
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {item.date || item.createdAt} · <span className={`${STATUS_COLOR[item.status]} px-1.5 py-0.5 rounded-full text-xs`}>{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Room Bookings */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-stone-900">Room Bookings</h3>
              <button onClick={() => setShowBookingForm(true)}
                className="bg-[#1B4D3E] text-white text-xs px-4 py-2 rounded-xl hover:bg-[#163d30] transition-colors flex items-center gap-1.5">
                <Plus size={13} /> Book a Room
              </button>
            </div>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="bg-white rounded-xl border border-stone-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">{b.room}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[b.status]}`}>{b.status}</span>
                      </div>
                      <div className="text-xs text-stone-400 mt-1">{b.date} · {b.startTime}–{b.endTime}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{b.purpose} · Booked by {b.bookedBy}</div>
                    </div>
                    <span className="text-xs text-stone-300">{b.id}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Form Modal */}
            {showBookingForm && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-stone-900">Book a Room</h3>
                    <button onClick={() => setShowBookingForm(false)} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
                  </div>
                  <div className="space-y-3">
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Room</label>
                      <select value={bookingForm.room} onChange={(e) => setBookingForm({ ...bookingForm, room: e.target.value })}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] bg-white">
                        {ROOMS.map(r => <option key={r.id} value={r.name}>{r.name} (cap. {r.capacity})</option>)}
                      </select></div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Date</label>
                      <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs font-medium text-stone-600 block mb-1">Start Time</label>
                        <input type="time" value={bookingForm.startTime} onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
                      <div><label className="text-xs font-medium text-stone-600 block mb-1">End Time</label>
                        <input type="time" value={bookingForm.endTime} onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
                    </div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Purpose</label>
                      <input value={bookingForm.purpose} onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                        placeholder="e.g. Client meeting, team review"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
                    <button onClick={submitBooking}
                      className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#163d30] transition-colors mt-2">
                      Submit Booking Request
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Maintenance */}
        {activeTab === "maintenance" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-stone-900">Maintenance Requests</h3>
              <button onClick={() => setShowMaintenanceForm(true)}
                className="bg-[#1B4D3E] text-white text-xs px-4 py-2 rounded-xl hover:bg-[#163d30] transition-colors flex items-center gap-1.5">
                <Plus size={13} /> Report Issue
              </button>
            </div>
            <div className="space-y-3">
              {maintenance.map((m) => (
                <div key={m.id} className="bg-white rounded-xl border border-stone-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-stone-900">{m.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[m.priority]}`}>{m.priority}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[m.status]}`}>{m.status.replace("_", " ")}</span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">{m.description}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{m.location} · Reported by {m.reportedBy} · {m.createdAt}</div>
                    </div>
                    <span className="text-xs text-stone-300 shrink-0">{m.id}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Maintenance Form Modal */}
            {showMaintenanceForm && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-stone-900">Report Maintenance Issue</h3>
                    <button onClick={() => setShowMaintenanceForm(false)} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
                  </div>
                  <div className="space-y-3">
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Category</label>
                      <select value={maintenanceForm.category} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, category: e.target.value })}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] bg-white">
                        {MAINTENANCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select></div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Location</label>
                      <input value={maintenanceForm.location} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, location: e.target.value })}
                        placeholder="e.g. Boardroom, Studio A, Reception"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Description</label>
                      <textarea value={maintenanceForm.description} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                        placeholder="Describe the issue clearly"
                        rows={3}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] resize-none" /></div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Priority</label>
                      <select value={maintenanceForm.priority} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value as any })}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] bg-white">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select></div>
                    <button onClick={submitMaintenance}
                      className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#163d30] transition-colors mt-2">
                      Submit Request
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Assets */}
        {activeTab === "assets" && (
          <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench size={20} className="text-stone-400" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900 mb-2">Asset Registry</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Track all HAMZURY physical assets — computers, cameras, furniture, and equipment. Coming in the next update.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
