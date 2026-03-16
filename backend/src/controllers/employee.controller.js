import { Employee } from "../models/employee.model.js";
import { Trip } from "../models/trip.model.js";
import { asynchandller } from "../util/asynchandller.js";

export const createEmp = asynchandller(async (req, res) => {
  const { name, phone, city, role } = req.body;

  if ([name, phone, city, role].some((field) => !field)) {
    return res.status(400).json({
      success: false,
      message: "Please fill all field",
    });
  }

  const existingPhone = await Employee.findOne({ phone: phone });
  if (existingPhone) {
    return res.status(400).json({
      success: false,
      message: "This employee is already exist",
    });
  }

  const emp = await Employee.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Employee created successfully",
    emp,
  });
});

export const getEmpByRole = asynchandller(async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({
      success: false,
      message: "Please Enter the role of employee",
    });
  }
  const emps = await Employee.find({ role: role }).lean();
  return res.status(200).json({
    success: true,
    message: "Details fetched successfully",
    emps,
  });
});

export const getAllEmp = asynchandller(async (req, res) => {
  const emps = await Employee.find({}).lean();
  return res.status(200).json({
    success: true,
    message: "Details fetched successfully",
    emps,
  });
});

export const updateEmpById = asynchandller(async (req, res) => {
  const { name, _id, role, city, phone } = req.body;
  if ([name, _id, role, city, phone].some((field) => !field)) {
    return res.status(400).json({
      success: false,
      message: "Please fill all field",
    });
  }

  const emp = await Employee.findById(_id);

  if (!emp) {
    return res.status(400).json({
      success: false,
      message: "Employee not found",
    });
  }

  const existingPhone = await Employee.findOne({
    phone: phone,
    _id: { $ne: _id },
  });

  if (existingPhone) {
    return res.status(400).json({
      success: false,
      message: "Phone Number Alredy Exist",
    });
  }

  if (emp.phone) emp.phone = phone;
  if (emp.name) emp.name = name;
  if (emp.role) emp.role = role;
  if (emp.city) emp.city = city;

  const updatedEmp = await emp.save();

  return res.status(200).json({
    success: true,
    message: "Employee details updated successfully",
    updatedEmp,
  });
});

export const deleteEmpById = asynchandller(async (req, res) => {
  const { id } = req.params;
  const emp = await Employee.findById(id);
  if (!emp) {
    return res.status(400).json({
      success: false,
      message: "Employee not found",
    });
  }

  const assignedEmp = await Trip.findOne({
    $or: [{ driver: emp._id }, { conductor: emp._id }],
  });

  if (assignedEmp) {
    return res.status(400).json({
      success: false,
      message: "First remove this employee from trip",
    });
  }
  await Employee.findByIdAndDelete(id, { new: true });
  return res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
  });
});
