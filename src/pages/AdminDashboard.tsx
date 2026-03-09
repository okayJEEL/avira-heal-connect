import { useEffect, useState } from "react";
import drVivekImg from "@/assets/dr-vivek-admin.jpg";
import drPreetiImg from "@/assets/dr-preeti-admin.jpg";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Calendar, Users, Activity, MessageCircle, Monitor, CheckCircle, X, Eye, Video, Building2, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Appointment {
  id: string;
  patient_name: string;
  mobile: string;
  age: number | null;
  gender: string | null;
  department: string | null;
  time_slot: string;
  status: string;
  fee: number | null;
  created_at: string;
  consultation_type: string | null;
  video_call_link: string | null;
  email: string | null;
  address: string | null;
  patient_type: string | null;
  notes: string | null;
}

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("appointments");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || "");

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("time_slot", { ascending: false });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setAppointments(data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/staff-login");
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, status } : apt)
      );

      toast({
        title: "Success",
        description: `Appointment ${status} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "cancelled": return "destructive";
      case "completed": return "secondary";
      default: return "outline";
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.mobile.includes(searchTerm) ||
                          apt.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-muted">
      {/* Top bar */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              A+
            </div>
            <h1 className="text-lg font-heading font-bold text-primary">Avira Hospital</h1>
            <span className="text-sm text-muted-foreground">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 space-y-6">
        {/* Quick Nav Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Appointments", icon: Calendar, tab: "appointments" },
            { label: "Doctors", icon: Users, tab: "doctors" },
            { label: "Messages", icon: MessageCircle, tab: "messages" },
            { label: "View Website", icon: Monitor, tab: "website" },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                if (item.tab === "website") {
                  window.open("/", "_blank");
                } else {
                  setActiveTab(item.tab);
                }
              }}
              className={`group relative p-6 rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in ${
                activeTab === item.tab && item.tab !== "website" ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
            </button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Doctors
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              View Website
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{appointments.length}</p>
                    <p className="text-sm text-muted-foreground">Total Appointments</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {appointments.filter((a) => a.status === "pending").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {appointments.filter((a) => a.status === "confirmed").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm text-muted-foreground">Doctors</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Appointments Management</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {filteredAppointments.length} total appointments
                  </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient name, doctor, or mobile..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[300px]"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Filter className="w-4 h-4" />
                    Showing {filteredAppointments.length} appointments
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : filteredAppointments.length === 0 ? (
                  <p className="text-muted-foreground">No appointments found.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((apt) => (
                      <Card key={apt.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-full bg-primary/10">
                                <Users className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{apt.patient_name}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>📞 {apt.mobile}</span>
                                  <span>📧 {apt.email || "N/A"}</span>
                                  <span>📍 {apt.address || "N/A"}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Age: {apt.age || "N/A"} | Gender: {apt.gender || "N/A"}
                                </div>
                              </div>
                            </div>
                            <Badge variant={statusColor(apt.status)} className="ml-auto">
                              {apt.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                            <div>
                              <p className="text-sm font-medium text-foreground">Doctor:</p>
                              <p className="text-sm text-primary">
                                {apt.department === "Aesthetic Physician & Cosmetologist" 
                                  ? "Dr. Preeti Siddhpura" 
                                  : "Dr. Vivek Siddhpura"}
                              </p>
                              <p className="text-sm text-muted-foreground">{apt.department || "Consulting Physician & Diabetologist"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Date & Time:</p>
                              <p className="text-sm text-foreground">{format(new Date(apt.time_slot), "dd MMM yyyy, hh:mm a")}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Consultation Fee:</p>
                              <p className="text-sm font-bold text-primary">₹{apt.fee || 0}</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm font-medium text-foreground mb-2">Patient Type:</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                {apt.consultation_type === "video" ? <Video className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                                {apt.consultation_type === "video" ? "Video Consultation" : "In-Person (OPD)"}
                              </span>
                              <span>• {apt.patient_type === "existing" ? "Existing" : "New"} Patient</span>
                            </div>
                            {apt.video_call_link && (
                              <div className="mt-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Video Call Link:</p>
                                <a 
                                  href={apt.video_call_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                  <Video className="w-3 h-3" />
                                  Join Meeting
                                </a>
                              </div>
                            )}
                            {apt.notes && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-foreground">Reason for visit:</p>
                                <p className="text-sm text-muted-foreground">{apt.notes}</p>
                              </div>
                            )}
                          </div>

                          {apt.status === "pending" && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          )}
                          
                          {apt.status === "confirmed" && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => updateAppointmentStatus(apt.id, "completed")}
                              >
                                Mark Completed
                              </Button>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground mt-2">
                            Booked on: {format(new Date(apt.created_at), "dd/MM/yyyy, hh:mm a")}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Dr. Vivek Siddhpura",
                  designation: "Consulting Physician & Diabetologist",
                  qualifications: "MBBS, M.D., PGCDM",
                  image: drVivekImg,
                  feeNew: 700,
                  feeExisting: 350,
                },
                {
                  name: "Dr. Preeti Siddhpura",
                  designation: "Aesthetic Physician & Cosmetologist",
                  qualifications: "MBBS, FAM, PGDCC, PGDCD",
                  image: drPreetiImg,
                  feeNew: 600,
                  feeExisting: 300,
                },
              ].map((doc) => (
                <Card key={doc.name} className="overflow-hidden animate-fade-in hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-56 sm:h-auto bg-muted flex-shrink-0">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <h3 className="text-xl font-heading font-bold text-foreground">{doc.name}</h3>
                        <p className="text-primary font-medium mt-1">{doc.designation}</p>
                        <p className="text-sm text-muted-foreground mt-1">{doc.qualifications}</p>
                        <div className="mt-4 space-y-1">
                          <p className="text-sm"><span className="font-medium text-foreground">New Patient Fee:</span> <span className="text-primary font-bold">₹{doc.feeNew}</span></p>
                          <p className="text-sm"><span className="font-medium text-foreground">Existing Patient Fee:</span> <span className="text-primary font-bold">₹{doc.feeExisting}</span></p>
                        </div>
                        <div className="mt-4">
                          <Badge className="bg-green-100 text-green-700 border-green-200">Available</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Message management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="website">
            <Card>
              <CardHeader>
                <CardTitle>View Website</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <Monitor className="w-12 h-12 text-primary" />
                <p className="text-muted-foreground">Click below to open the hospital website in a new tab</p>
                <Button size="lg" onClick={() => window.open("/", "_blank")}>
                  <Monitor className="w-4 h-4 mr-2" />
                  Open Website
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
