import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useBookings, Building } from "@/contexts/BookingContext";
import { Calendar as CalendarIcon } from "lucide-react";
import { timeToMinutes } from "@/lib/timeUtils";

const buildings = ["A", "B", "C", "D", "E", "F"] as const;

// Display grid: hourly slots for timetable visualization
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

const Timetable = () => {
  const { allocations } = useBookings();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Filter allocations by selected date
  const dateFilteredAllocations = allocations.filter(
    (a) => a.date === selectedDate
  );

  const filteredAllocations =
    selectedBuilding === "all"
      ? dateFilteredAllocations
      : dateFilteredAllocations.filter((a) => a.building === selectedBuilding);

  const getSlotAllocations = (building: Building, timeSlot: string) => {
    const [slotStart, slotEnd] = timeSlot.split(' - ');
    return filteredAllocations.filter(a => {
      if (a.building !== building) return false;
      return bookingOverlapsSlot(a.startTime, a.duration, slotStart, slotEnd);
    });
  };

  return (
    <Layout showWatermark>
      <div className="bg-red-100 min-h-[calc(100vh-8rem)]">
        <div className="container py-12">
          {/* Page Header */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Venue Allocation
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              View all classroom and venue allocations across buildings A to F
            </p>
            
            {/* Date Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Building Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedBuilding("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedBuilding === "all"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Buildings
            </button>
            {buildings.map((building) => (
              <button
                key={building}
                onClick={() => setSelectedBuilding(building)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedBuilding === building
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Building {building}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {buildings.map((building) => (
              <div key={building} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${venueColors[building]}`} />
                <span className="text-sm text-muted-foreground">Building {building}</span>
              </div>
            ))}
          </div>

          {/* Timetable Grid */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-lg animate-scale-in">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-primary/5">
                  <th className="sticky left-0 z-10 bg-primary/5 px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border w-28">
                    Time
                  </th>
                  {(selectedBuilding === "all" ? buildings : [selectedBuilding]).map((building) => (
                    <th
                      key={building}
                      className="px-4 py-3 text-center text-sm font-semibold text-foreground border-b border-border"
                    >
                      Building {building}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayTimeSlots.map((timeSlot, rowIndex) => (
                  <tr key={timeSlot} className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="sticky left-0 z-10 px-4 py-3 text-sm font-medium text-foreground border-r border-border bg-inherit">
                      {timeSlot}
                    </td>
                    {(selectedBuilding === "all" ? buildings : [selectedBuilding]).map((building) => {
                      const slotAllocations = getSlotAllocations(building, timeSlot);
                      return (
                        <td
                          key={building}
                          className="px-2 py-2 border-r border-border last:border-r-0"
                        >
                          {slotAllocations.length > 0 ? (
                            <div className="space-y-1">
                              {slotAllocations.map((allocation) => (
                                <div
                                  key={allocation.id}
                                  className={`${venueColors[allocation.building]} rounded-lg px-3 py-2 text-white shadow-sm`}
                                >
                                  <div className="text-xs font-semibold">{allocation.course}</div>
                                  <div className="text-[10px] opacity-90">
                                    {allocation.room} • {allocation.lecturerName || '—'}
                                  </div>
                                  <div className="text-[10px] opacity-70">
                                    {allocation.activity}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-12 flex items-center justify-center text-xs text-muted-foreground/40">
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

          {/* Watermark Visual */}
          <div className="mt-12 flex justify-center opacity-10">
            <img src="/favicon.ico" alt="ProjectX Logo" className="h-32 w-32" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Timetable;
