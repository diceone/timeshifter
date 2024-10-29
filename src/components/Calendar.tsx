import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Shift, CalendarView, Employee } from '../types';
import { WeekView } from './WeekView';

interface CalendarProps {
  shifts: Shift[];
  view: CalendarView;
  currentDate: Date;
  employees: Employee[];
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onAddShift: (shift: Omit<Shift, 'id'>) => void;
}

export function Calendar({
  shifts,
  view,
  currentDate,
  employees,
  onDateChange,
  onViewChange,
  onAddShift,
}: CalendarProps) {
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange(newDate);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => view === 'week' ? navigateWeek('prev') : onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {view === 'week'
            ? `Week of ${currentDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}`
            : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => view === 'week' ? navigateWeek('next') : onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange('month')}
          className={`px-4 py-2 rounded-lg ${
            view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={`px-4 py-2 rounded-lg ${
            view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          Week
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {renderHeader()}
      {view === 'week' ? (
        <WeekView
          currentDate={currentDate}
          shifts={shifts}
          employees={employees}
          onAddShift={onAddShift}
        />
      ) : (
        <MonthView currentDate={currentDate} shifts={shifts} employees={employees} />
      )}
    </div>
  );
}

function MonthView({
  currentDate,
  shifts,
  employees,
}: {
  currentDate: Date;
  shifts: Shift[];
  employees: Employee[];
}) {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const weeks = Math.ceil((daysInMonth + firstDayOfMonth) / 7);

  return (
    <>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-white p-4 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {Array.from({ length: weeks * 7 }).map((_, index) => {
          const dayNumber = index - firstDayOfMonth + 1;
          const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
          const dayShifts = shifts.filter((shift) => {
            const shiftDate = new Date(shift.start);
            return (
              shiftDate.getDate() === dayNumber &&
              shiftDate.getMonth() === currentDate.getMonth() &&
              shiftDate.getFullYear() === currentDate.getFullYear()
            );
          });

          return (
            <div
              key={index}
              className={`min-h-[120px] bg-white p-2 ${
                isCurrentMonth ? '' : 'bg-gray-50'
              }`}
            >
              {isCurrentMonth && (
                <>
                  <div className="font-medium text-sm mb-1">{dayNumber}</div>
                  {dayShifts.map((shift) => {
                    const employee = employees.find((e) => e.id === shift.employeeId);
                    return (
                      <div
                        key={shift.id}
                        className={`text-xs p-1 mb-1 rounded flex items-center gap-1 ${
                          shift.type === 'morning'
                            ? 'bg-blue-100 text-blue-800'
                            : shift.type === 'afternoon'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {employee && (
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span>{employee?.name}</span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}