import React from 'react';
import { User } from 'lucide-react';
import { Employee } from '../types';
import { AddEmployeeForm } from './AddEmployeeForm';

interface EmployeeListProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}

export function EmployeeList({ employees, onSelectEmployee, onAddEmployee }: EmployeeListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Team Members</h2>
      <div className="space-y-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            onClick={() => onSelectEmployee(employee)}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div>
              <h3 className="font-medium">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.role}</p>
            </div>
          </div>
        ))}
        <AddEmployeeForm onAdd={onAddEmployee} />
      </div>
    </div>
  );
}