// Centralized employee data - replace with API call later
export const employeeData = [
  { id: 1, name: 'Rajesh Kumar', phone: '9876543210', city: 'Dallas', role: 'driver' },
  { id: 2, name: 'Amit Singh', phone: '9876543211', city: 'Houston', role: 'conductor' },
  { id: 3, name: 'Priya Sharma', phone: '9876543212', city: 'Austin', role: 'driver' },
  { id: 4, name: 'Vikram Patel', phone: '9876543213', city: 'San Antonio', role: 'conductor' },
  { id: 5, name: 'Suresh Reddy', phone: '9876543214', city: 'Dallas', role: 'driver' },
  { id: 6, name: 'Anita Gupta', phone: '9876543215', city: 'Houston', role: 'conductor' },
];

export const getDrivers = (employees) => employees.filter(e => e.role === 'driver');
export const getConductors = (employees) => employees.filter(e => e.role === 'conductor');
