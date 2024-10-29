import React, { useState } from 'react';
import { Employee, Shift } from '../types';
import { Clock } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  shifts: Shift[];
  employees: Employee[];
  onAddShift: (shift: Omit<Shift, 'id'>) => void;
}

export function WeekView({ currentDate, shifts, employees, onAddShift }: WeekViewProps) {
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    hour: number;
  } | null>(null);

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getShiftsForDateAndHour = (date: Date, hour: number) => {
    return shifts.filter((shift) => {
      const shiftStart = new Date(shift.start);
      const shiftEnd = new Date(shift.end);
      return (
        shiftStart.getDate() === date.getDate() &&
        shiftStart.getMonth() === date.getMonth() &&
        shiftStart.getFullYear() === date.getFullYear() &&
        shiftStart.getHours() <= hour &&
        shiftEnd.getHours() > hour
      );
    });
  };

  const handleCellClick = (date: Date, hour: number) => {
    setSelectedSlot({ date, hour });
    setShowShiftModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-px bg-gray-200 min-w-[800px]">
          <div className="bg-white w-20">
            <div className="h-12"></div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-12 flex items-center justify-center text-sm text-gray-500"
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {days.map((date) => (
            <div key={date.toISOString()} className="bg-white flex-1">
              <div className="h-12 p-2 border-b text-center">
                <div className="font-medium">
                  {date.toLocaleDateString('default', { weekday: 'short' })}
                </div>
                <div className="text-sm text-gray-500">
                  {date.toLocaleDateString('default', { day: 'numeric' })}
                </div>
              </div>
              {hours.map((hour) => {
                const shiftsInHour = getShiftsForDateAndHour(date, hour);
                return (
                  <div
                    key={hour}
                    onClick={() => handleCellClick(date, hour)}
                    className="h-12 border-b border-gray-100 p-1 cursor-pointer hover:bg-gray-50"
                  >
                    {shiftsInHour.map((shift) => (
                      <ShiftCard key={shift.id} shift={shift} employees={employees} />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {showShiftModal && selectedSlot && (
        <QuickShiftModal
          date={selectedSlot.date}
          hour={selectedSlot.hour}
          employees={employees}
          onClose={() => setShowShiftModal(false)}
          onSave={(employeeId, start, end) => {
            onAddShift({
              employeeId,
              type: 'custom',
              start,
              end,
            });
            setShowShiftModal(false);
          }}
        />
      )}
    </>
  );
}

function ShiftCard({ shift, employees }: { shift: Shift; employees: Employee[] }) {
  const employee = employees.find((e) => e.id === shift.employeeId);
  if (!employee) return null;

  const getShiftColor = (type: Shift['type']) => {
    switch (type) {
      case 'morning':
        return 'bg-blue-100 text-blue-800';
      case 'afternoon':
        return 'bg-green-100 text-green-800';
      case 'night':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`text-xs p-1 rounded flex items-center gap-1 ${getShiftColor(shift.type)}`}>
      <img
        src={employee.avatar}
        alt={employee.name}
        className="w-4 h-4 rounded-full"
      />
      <span>{employee.name}</span>
    </div>
  );
}

function QuickShiftModal({
  date,
  hour,
  employees,
  onClose,
  onSave,
}: {
  date: Date;
  hour: number;
  employees: Employee[];
  onClose: () => void;
  onSave: (employeeId: string, start: string, end: string) => void;
}) {
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [startTime, setStartTime] = useState(`${hour.toString().padStart(2, '0')}:00`);
  const [endTime, setEndTime] = useState(`${(hour + 1).toString().padStart(2, '0')}:00`);

  const handleSave = () => {
    const shiftDate = date.toISOString().split('T')[0];
    onSave(
      employeeId,
      `${shiftDate}T${startTime}`,
      `${shiftDate}T${endTime}`
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Add Shift</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}