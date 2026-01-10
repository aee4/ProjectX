// Time utility functions for flexible booking system

// Generate time options at 30-minute intervals from 8:00 to 17:00
export const generateTimeOptions = (): string[] => {
  const options: string[] = [];
  for (let hour = 8; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 17 && minute > 0) break; // Stop at 17:00
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      options.push(timeString);
    }
  }
  return options;
};

// Convert time string (HH:mm) to minutes since midnight
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Convert minutes since midnight to time string (HH:mm)
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

// Format time for display (e.g., "08:30" -> "8:30 AM")
export const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const m = minutes === "00" ? "" : `:${minutes}`;
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayHour}${m} ${period}`;
};

// Check if two time ranges overlap
export const timeRangesOverlap = (
  start1: string,
  duration1: number,
  start2: string,
  duration2: number
): boolean => {
  const start1Min = timeToMinutes(start1);
  const end1Min = start1Min + duration1 * 60;
  const start2Min = timeToMinutes(start2);
  const end2Min = start2Min + duration2 * 60;
  
  return start1Min < end2Min && start2Min < end1Min;
};

// Generate duration options (0.5, 1, 1.5, ..., 6 hours)
export const generateDurationOptions = (maxDuration: number = 6): number[] => {
  const options: number[] = [];
  for (let i = 0.5; i <= maxDuration; i += 0.5) {
    options.push(i);
  }
  return options;
};

// Format duration for display
export const formatDuration = (duration: number): string => {
  if (duration === 0.5) return "30 min";
  if (duration === 1) return "1 hour";
  if (duration % 1 === 0) return `${duration} hours`;
  const hours = Math.floor(duration);
  const minutes = (duration - hours) * 60;
  return `${hours}h ${minutes}m`;
};
