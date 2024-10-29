export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  start: string;
  end: string;
  type: 'custom' | 'morning' | 'afternoon' | 'night';
}

export type CalendarView = 'month' | 'week' | 'day';