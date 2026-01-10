import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useBookings, Building, VenueAllocation } from "@/contexts/BookingContext";
import { 
  Building2, 
  Calendar, 
  Clock, 
  BookOpen, 
  Users,
  User,
  Plus, 
  Trash2, 
  Edit3,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { 
  generateTimeOptions, 
  timeRangesOverlap, 
  timeToMinutes, 
  minutesToTime,
  formatTimeDisplay,
  formatDuration,
  generateDurationOptions
} from "@/lib/timeUtils";

// Types
const buildings = ["A", "B", "C", "D", "E", "F"] as const;

const venues: Record<Building, string[]> = {
  A: ["A101", "A102", "A103", "A104"],
  B: ["B201", "B202", "B203", "B204"],
  C: ["C101", "C102", "C103", "C104"],
  D: ["D201", "D202", "D203", "D204"],
  E: ["E101", "E102", "E103", "E104"],
  F: ["F201", "F202", "F203", "F204"],
};

const timeOptions = generateTimeOptions();

// Display grid: hourly slots for timetable visualization (8:00-9:00, 9:00-10:00, etc.)
const displayTimeSlots = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

// Check if a booking overlaps with a display time slot
const bookingOverlapsSlot = (startTime: string, duration: number, slotStart: string, slotEnd: string): boolean => {
  const bookingStartMin = timeToMinutes(startTime);
  const bookingEndMin = bookingStartMin + duration * 60;
  const slotStartMin = timeToMinutes(slotStart);
  const slotEndMin = timeToMinutes(slotEnd);
  
  return bookingStartMin < slotEndMin && slotStartMin < bookingEndMin;
};

const venueColors: Record<Building, string> = {
  A: "bg-venue-a",
  B: "bg-venue-b",
  C: "bg-venue-c",
  D: "bg-venue-d",
  E: "bg-venue-e",
  F: "bg-venue-f",
};

const venueBorderColors: Record<Building, string> = {
  A: "border-l-[hsl(199,89%,48%)]",
  B: "border-l-[hsl(262,83%,58%)]",
  C: "border-l-[hsl(142,71%,45%)]",
  D: "border-l-[hsl(25,95%,53%)]",
  E: "border-l-[hsl(340,82%,52%)]",
  F: "border-l-[hsl(174,72%,40%)]",
};

// VenueAllocation type is imported from BookingContext

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { allocations, addAllocation, updateAllocation, deleteAllocation } = useBookings();
  const [currentView, setCurrentView] = useState<"dashboard" | "timetable">("dashboard");
  const [selectedBuilding, setSelectedBuilding] = useState<Building>("A");
  const [selectedVenue, setSelectedVenue] = useState<string>(venues.A[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedStartTime, setSelectedStartTime] = useState<string>("08:00");
  const [duration, setDuration] = useState<number>(1);
  const [courseName, setCourseName] = useState<string>("");
  const [lecturerName, setLecturerName] = useState<string>("");
  const [activity, setActivity] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [timetableFilter, setTimetableFilter] = useState<Building | "all">("all");

  // Check if a time range has conflicts with existing bookings
  const hasConflict = (venue: string, date: string, startTime: string, duration: number, excludeId?: string): boolean => {
    return allocations.some(a => {
      if (a.id === excludeId) return false;
      if (a.room !== venue || a.date !== date) return false;
      
      // Use startTime if available, otherwise fall back to timeSlot for migration
      const bookingStartTime = 'startTime' in a ? a.startTime : (a as any).timeSlot?.split(' - ')[0] || '08:00';
      return timeRangesOverlap(startTime, duration, bookingStartTime, a.duration);
    });
  };

  // Get maximum available duration from a starting time (max 6 hours, in 0.5 hour increments)
  const getMaxDuration = (startTime: string): number => {
    const startMinutes = timeToMinutes(startTime);
    const maxEndMinutes = timeToMinutes("17:00"); // End of day
    
    let maxDuration = 0.5;
    for (let d = 0.5; d <= 6; d += 0.5) {
      const endMinutes = startMinutes + d * 60;
      if (endMinutes > maxEndMinutes) break;
      
      if (!hasConflict(selectedVenue, selectedDate, startTime, d, editingId || undefined)) {
        maxDuration = d;
      } else {
        break;
      }
    }
    return Math.min(maxDuration, 6);
  };

  const maxAvailableDuration = getMaxDuration(selectedStartTime);

  // Adjust duration if it exceeds maxAvailableDuration (max 6 hours)
  useEffect(() => {
    if (duration > maxAvailableDuration && maxAvailableDuration > 0) {
      setDuration(maxAvailableDuration);
    }
  }, [maxAvailableDuration, duration, selectedStartTime]);

  // Update venue options when building changes
  const handleBuildingChange = (building: Building) => {
    setSelectedBuilding(building);
    const newVenue = venues[building][0];
    setSelectedVenue(newVenue);
    // Don't reset time/duration - let user keep their selections
  };

  // Update time when venue changes
  const handleVenueChange = (venue: string) => {
    setSelectedVenue(venue);
    // Don't reset time/duration - let user keep their selections
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    // Don't reset time/duration - let user keep their selections
  };

  const handleStartTimeChange = (time: string) => {
    setSelectedStartTime(time);
    // Don't reset duration - let user keep their selection
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseName.trim() || !lecturerName.trim() || !activity.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check for conflicts before booking
    if (!editingId && hasConflict(selectedVenue, selectedDate, selectedStartTime, duration)) {
      toast({
        title: "Booking Conflict",
        description: "This time range overlaps with an existing booking. Please select another time or reduce the duration.",
        variant: "destructive",
      });
      return;
    }

    // Also check for conflicts when editing
    if (editingId && hasConflict(selectedVenue, selectedDate, selectedStartTime, duration, editingId)) {
      toast({
        title: "Booking Conflict",
        description: "This time range overlaps with an existing booking. Please select another time or reduce the duration.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Update existing allocation
      updateAllocation(editingId, {
        building: selectedBuilding,
        room: selectedVenue,
        course: courseName,
        lecturerName,
        activity,
        startTime: selectedStartTime,
        date: selectedDate,
        duration,
      });
      toast({
        title: "Booking Updated",
        description: `${courseName} has been updated successfully.`,
      });
      setEditingId(null);
    } else {
      // Create new allocation
      addAllocation({
        building: selectedBuilding,
        room: selectedVenue,
        course: courseName,
        lecturerName,
        activity,
        startTime: selectedStartTime,
        date: selectedDate,
        duration,
      });
      toast({
        title: "Booking Confirmed",
        description: `${courseName} has been booked at ${selectedVenue} from ${formatTimeDisplay(selectedStartTime)}.`,
      });
    }

    // Reset form
    setCourseName("");
    setLecturerName("");
    setActivity("");
    setDuration(0.5);
    setSelectedStartTime("08:00");
  };

  // Handle edit
  const handleEdit = (allocation: VenueAllocation) => {
    setEditingId(allocation.id);
    setSelectedBuilding(allocation.building);
    setSelectedVenue(allocation.room);
    setSelectedDate(allocation.date);
    // Handle migration: use startTime if available, otherwise extract from timeSlot
    const startTime = 'startTime' in allocation ? allocation.startTime : (allocation as any).timeSlot?.split(' - ')[0] || '08:00';
    setSelectedStartTime(startTime);
    setDuration(allocation.duration);
    setCourseName(allocation.course);
    setLecturerName(allocation.lecturerName || '');
    setActivity(allocation.activity);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteAllocation(id);
    toast({
      title: "Booking Deleted",
      description: "The venue allocation has been removed.",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setCourseName("");
    setLecturerName("");
    setActivity("");
    setDuration(0.5);
    setSelectedStartTime("08:00");
  };

  // Get allocations for timetable preview
  const filteredAllocations = timetableFilter === "all" 
    ? allocations.filter(a => a.date === selectedDate)
    : allocations.filter(a => a.building === timetableFilter && a.date === selectedDate);

  const getSlotAllocations = (building: Building, timeSlot: string) => {
    const [slotStart, slotEnd] = timeSlot.split(' - ');
    return filteredAllocations.filter(a => {
      if (a.building !== building) return false;
      // Handle migration: use startTime if available, otherwise extract from timeSlot
      const bookingStartTime = 'startTime' in a ? a.startTime : (a as any).timeSlot?.split(' - ')[0] || '08:00';
      return bookingOverlapsSlot(bookingStartTime, a.duration, slotStart, slotEnd);
    });
  };

  const handleLogout = () => {
    navigate("/");
  };

  // Render Timetable View
  const renderTimetableView = () => (
    <div className="py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-navy-light text-primary-foreground">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Timetable View</h1>
            <p className="text-muted-foreground">View all venue allocations</p>
          </div>
        </div>
      </div>

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-secondary" />
                Live Timetable
              </CardTitle>
              <CardDescription>
                Real-time view of venue availability for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </div>
            {/* Building Filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setTimetableFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timetableFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {buildings.map((b) => (
                <button
                  key={b}
                  onClick={() => setTimetableFilter(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    timetableFilter === b
                      ? `${venueColors[b]} text-white`
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-primary/5">
                  <th className="sticky left-0 z-10 bg-primary/5 px-3 py-2.5 text-left text-xs font-semibold text-foreground border-b border-border w-24">
                    Time
                  </th>
                  {(timetableFilter === "all" ? buildings : [timetableFilter]).map((building) => (
                    <th
                      key={building}
                      className="px-3 py-2.5 text-center text-xs font-semibold text-foreground border-b border-border"
                    >
                      Building {building}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayTimeSlots.map((timeSlot, rowIndex) => (
                  <tr key={timeSlot} className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="sticky left-0 z-10 px-3 py-2 text-xs font-medium text-foreground border-r border-border bg-inherit">
                      {timeSlot}
                    </td>
                    {(timetableFilter === "all" ? buildings : [timetableFilter]).map((building) => {
                      const slotAllocations = getSlotAllocations(building, timeSlot);
                      return (
                        <td key={building} className="px-1.5 py-1.5 border-r border-border last:border-r-0">
                          {slotAllocations.length > 0 ? (
                            <div className="space-y-0.5">
                              {slotAllocations.map((allocation) => (
                                <div
                                  key={allocation.id}
                                  className={`${venueColors[allocation.building]} rounded-md px-2 py-1.5 text-white shadow-sm transition-all hover:scale-[1.02] cursor-pointer`}
                                  onClick={() => {
                                    handleEdit(allocation);
                                    setCurrentView("dashboard");
                                  }}
                                >
                                  <div className="text-[10px] font-semibold truncate">{allocation.course}</div>
                                  <div className="text-[9px] opacity-80 truncate">
                                    {allocation.room} • {allocation.lecturerName || '—'}
                                  </div>
                                  <div className="text-[9px] opacity-70 truncate">
                                    {allocation.activity}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-10 flex items-center justify-center text-[10px] text-muted-foreground/40">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-border">
            {buildings.map((building) => (
              <div key={building} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${venueColors[building]}`} />
                <span className="text-xs text-muted-foreground">Building {building}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-red-100 flex flex-col">
      <Header 
        isAdmin 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 container py-8">
        {currentView === "timetable" ? (
          renderTimetableView()
        ) : (
          <>
            {/* Dashboard Header */}
            <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-navy-light text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage venue bookings and class allocations</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Control Panel */}
          <Card className="lg:col-span-1 animate-slide-up border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5 text-secondary" />
                {editingId ? "Edit Booking" : "New Booking"}
              </CardTitle>
              <CardDescription>
                {editingId ? "Update the venue allocation details" : "Create a new venue allocation"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Building Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Building
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {buildings.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleBuildingChange(b)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedBuilding === b
                            ? `${venueColors[b]} text-white shadow-md`
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Venue Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Venue</label>
                  <select
                    value={selectedVenue}
                    onChange={(e) => handleVenueChange(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {venues[selectedBuilding].map((venue) => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Start Time
                  </label>
                  <select
                    value={selectedStartTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                    ))}
                  </select>
                </div>

                {/* Duration (max based on availability, in 0.5 hour increments) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Duration
                    </span>
                    <span className="text-xs text-muted-foreground">Max {formatDuration(maxAvailableDuration)} available</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {generateDurationOptions(maxAvailableDuration).map((d) => (
                      <option key={d} value={d}>{formatDuration(d)}</option>
                    ))}
                  </select>
                  <div className="text-xs text-muted-foreground">
                    Ends at {formatTimeDisplay(minutesToTime(timeToMinutes(selectedStartTime) + duration * 60))}
                  </div>
                </div>

                {/* Course Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g., Computer Science 101"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Lecturer Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Lecturer Name
                  </label>
                  <input
                    type="text"
                    value={lecturerName}
                    onChange={(e) => setLecturerName(e.target.value)}
                    placeholder="e.g., Dr. John Smith"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Activity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Activity Type
                  </label>
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="e.g., Lecture, Lab, Seminar"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-2 pt-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 btn-primary justify-center"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {editingId ? "Update Booking" : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right Column: Allocations + Timetable */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Allocation Overview */}
            <Card className="animate-slide-up-delay-1 border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  Class Allocation Overview
                </CardTitle>
                <CardDescription>
                  All current venue allocations across buildings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Building</TableHead>
                        <TableHead className="font-semibold">Venue</TableHead>
                        <TableHead className="font-semibold">Course</TableHead>
                        <TableHead className="font-semibold">Lecturer</TableHead>
                        <TableHead className="font-semibold">Activity</TableHead>
                        <TableHead className="font-semibold">Time</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allocations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            No allocations yet. Create one above.
                          </TableCell>
                        </TableRow>
                      ) : (
                        allocations.map((allocation) => (
                          <TableRow key={allocation.id} className="group hover:bg-muted/30 transition-colors">
                            <TableCell>
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-semibold ${venueColors[allocation.building]}`}>
                                {allocation.building}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">{allocation.room}</TableCell>
                            <TableCell>
                              <div className={`border-l-4 pl-3 ${venueBorderColors[allocation.building]}`}>
                                {allocation.course}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {allocation.lecturerName || '—'}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                                {allocation.activity}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatTimeDisplay('startTime' in allocation ? allocation.startTime : (allocation as any).timeSlot?.split(' - ')[0] || '08:00')}
                              <span className="text-xs ml-1">({formatDuration(allocation.duration)})</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEdit(allocation)}
                                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                  title="Edit"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(allocation.id)}
                                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Live Timetable Preview */}
            <Card className="animate-slide-up-delay-2 border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-secondary" />
                      Live Timetable Preview
                    </CardTitle>
                    <CardDescription>
                      Real-time view of venue availability
                    </CardDescription>
                  </div>
                  {/* Building Filter */}
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setTimetableFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        timetableFilter === "all"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      All
                    </button>
                    {buildings.map((b) => (
                      <button
                        key={b}
                        onClick={() => setTimetableFilter(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          timetableFilter === b
                            ? `${venueColors[b]} text-white`
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="sticky left-0 z-10 bg-primary/5 px-3 py-2.5 text-left text-xs font-semibold text-foreground border-b border-border w-24">
                          Time
                        </th>
                        {(timetableFilter === "all" ? buildings : [timetableFilter]).map((building) => (
                          <th
                            key={building}
                            className="px-3 py-2.5 text-center text-xs font-semibold text-foreground border-b border-border"
                          >
                            Building {building}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayTimeSlots.map((timeSlot, rowIndex) => (
                        <tr key={timeSlot} className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                          <td className="sticky left-0 z-10 px-3 py-2 text-xs font-medium text-foreground border-r border-border bg-inherit">
                            {timeSlot}
                          </td>
                          {(timetableFilter === "all" ? buildings : [timetableFilter]).map((building) => {
                            const slotAllocations = getSlotAllocations(building, timeSlot);
                            return (
                              <td key={building} className="px-1.5 py-1.5 border-r border-border last:border-r-0">
                                {slotAllocations.length > 0 ? (
                                  <div className="space-y-0.5">
                                    {slotAllocations.map((allocation) => (
                                      <div
                                        key={allocation.id}
                                        className={`${venueColors[allocation.building]} rounded-md px-2 py-1.5 text-white shadow-sm transition-all hover:scale-[1.02] cursor-pointer`}
                                        onClick={() => handleEdit(allocation)}
                                      >
                                        <div className="text-[10px] font-semibold truncate">{allocation.course}</div>
                                        <div className="text-[9px] opacity-80 truncate">
                                          {allocation.room} • {allocation.activity}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="h-10 flex items-center justify-center text-[10px] text-muted-foreground/40">
                                    —
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-border">
                  {buildings.map((building) => (
                    <div key={building} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded ${venueColors[building]}`} />
                      <span className="text-xs text-muted-foreground">Building {building}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

            {/* Watermark */}
            <div className="mt-12 flex justify-center opacity-5">
              <img src="/favicon.ico" alt="ProjectX Logo" className="h-24 w-24" />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
