import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Building = "A" | "B" | "C" | "D" | "E" | "F";

export interface VenueAllocation {
  id: string;
  building: Building;
  room: string;
  course: string;
  lecturerName: string;
  activity: string;
  startTime: string; // Format: "HH:mm" (e.g., "08:30", "14:00")
  date: string;
  duration: number; // Duration in hours (can be 0.5, 1, 1.5, 2, etc. up to 6)
}

interface BookingContextType {
  allocations: VenueAllocation[];
  addAllocation: (allocation: Omit<VenueAllocation, "id">) => void;
  updateAllocation: (id: string, allocation: Partial<VenueAllocation>) => void;
  deleteAllocation: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = "venue-navigator-bookings";

// Migrate old timeSlot format to new startTime format
const migrateAllocation = (allocation: any): VenueAllocation => {
  const migrated: any = { ...allocation };
  
  // Migrate timeSlot to startTime if needed
  if (!('startTime' in migrated) && 'timeSlot' in migrated) {
    const oldTimeSlot = migrated.timeSlot as string;
    // Extract start time from old format like "8:00 - 9:00"
    const startTime = oldTimeSlot.split(' - ')[0];
    migrated.startTime = startTime.padStart(5, '0'); // Ensure HH:mm format
    // Old bookings were always 1 hour
    if (!('duration' in migrated)) {
      migrated.duration = 1;
    }
  }
  
  // Ensure lecturerName exists (for old data)
  if (!('lecturerName' in migrated)) {
    migrated.lecturerName = '';
  }
  
  // Ensure duration exists (safety check)
  if (!('duration' in migrated) || typeof migrated.duration !== 'number') {
    migrated.duration = 1;
  }
  
  return migrated as VenueAllocation;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [allocations, setAllocations] = useState<VenueAllocation[]>(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Migrate old format to new format
          return Array.isArray(parsed) ? parsed.map(migrateAllocation) : [];
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Save to localStorage whenever allocations change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allocations));
    }
  }, [allocations]);

  const addAllocation = (allocation: Omit<VenueAllocation, "id">) => {
    const newAllocation: VenueAllocation = {
      ...allocation,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setAllocations((prev) => [...prev, newAllocation]);
  };

  const updateAllocation = (id: string, updates: Partial<VenueAllocation>) => {
    setAllocations((prev) =>
      prev.map((allocation) =>
        allocation.id === id ? { ...allocation, ...updates } : allocation
      )
    );
  };

  const deleteAllocation = (id: string) => {
    setAllocations((prev) => prev.filter((allocation) => allocation.id !== id));
  };

  return (
    <BookingContext.Provider
      value={{
        allocations,
        addAllocation,
        updateAllocation,
        deleteAllocation,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};

