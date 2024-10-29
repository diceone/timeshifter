import React, { useState } from 'react';
import { Calendar } from './components/Calendar';
import { EmployeeList } from './components/EmployeeList';
import { ShiftForm } from './components/ShiftForm';
import { WorkHoursSummary } from './components/WorkHoursSummary';
import { Employee, Shift, CalendarView } from './types';

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    role: 'Team Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Senior Developer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    role: 'Developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80',
  },
];

function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');

  const handleSaveShift = (newShift: Omit<Shift, 'id'>) => {
    const shift: Shift = {
      ...newShift,
      id: Math.random().toString(36).substr(2, 9),
    };
    setShifts([...shifts, shift]);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const employee: Employee = {
      ...newEmployee,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEmployees([...employees, employee]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Team Roster & Shift Management
        </h1>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-9">
            <Calendar
              shifts={shifts}
              view={view}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onViewChange={setView}
              employees={employees}
              onAddShift={handleSaveShift}
            />
          </div>
          <div className="col-span-3 space-y-8">
            <EmployeeList
              employees={employees}
              onSelectEmployee={setSelectedEmployee}
              onAddEmployee={handleAddEmployee}
            />
            <WorkHoursSummary
              employees={employees}
              shifts={shifts}
              currentDate={currentDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;