import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "./style.css";
import ReactPaginate from 'react-paginate';


const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    "full_name": "",
    "age": null,
    "email": "",
    "phone_number": "",
    "address": "",
    "employee_id": "",
    "department": "",
    "is_active": true,
    "salary_structure": {
        "base_salary": "",
        "hra_percentage": "",
        "da_percentage": "",
        "provident_fund_percentage": "",
        "tax_percentage": ""
    },
});
  const [salaryStructure, setSalaryStructure] = useState({
    "base_salary": "",
    "hra_percentage": "",
    "da_percentage": "",
    "provident_fund_percentage": "",
    "tax_percentage": ""
});
  const [error, setError] = useState("");
  const [pageInfo, setPageInfo] = useState(null);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [showEmployeeData, setShowEmployeeData] = useState(true);
  const [showPayslip, setShowPayslip] = useState(false);
  const handleAddEmployeeClick = () => {
    setShowAddEmployeeForm(true);
    setShowEmployeeData(false)
    setShowPayslip(false)
    console.log("Caled")
  };
  
  const accessToken = localStorage.getItem("accessToken");

  axios.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  // Fetch all employees
  const fetchEmployees = async (page) => {
    try {
      console.log(accessToken);

      const response = await axios.get(`api/?page=${page}`);
      console.log(response);
      setEmployees(response.data.results);
      setPageInfo({
        totalPages: Math.ceil(response.data.count / 10),
        currentPage: page
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees.");
    }
  };

  useEffect(() => {
    fetchEmployees(1);
  }, []);
  const handlePageChange = ({ selected }) => {
    const nextPage = selected + 1; // React Paginate uses 0-based indexing
    fetchEmployees(nextPage);
  };

  const updateEmployee = async (e) => {
    e.preventDefault();
    console.log("Updating",newEmployee)
    newEmployee.salary_structure = salaryStructure
    try {
      await axios.put(
        `api/${newEmployee.id}/`,
        newEmployee
      );
      fetchEmployees(1);
      setShowAddEmployeeForm(false)
      setShowEmployeeData(true)
      setNewEmployee({
        "full_name": "",
        "age": null,
        "email": "",
        "phone_number": "",
        "address": "",
        "employee_id": "",
        "department": "",
        "is_active": true,
        "salary_structure": {
            "base_salary": "",
            "hra_percentage": "",
            "da_percentage": "",
            "provident_fund_percentage": "",
            "tax_percentage": ""
        },
    });
    setSalaryStructure({
        "base_salary": "",
        "hra_percentage": "",
        "da_percentage": "",
        "provident_fund_percentage": "",
        "tax_percentage": ""
    })
    setError("Edited Successfully.. ")
    } catch (err) {
      console.error(err);
      setError("Failed to update employee.");
    }
  };

  // Add employee
  const addEmployee = async (event) => {
    event.preventDefault();
    setShowEmployeeData(true)
    setShowAddEmployeeForm(false)
    setShowPayslip(false)
    try {
        newEmployee.salary_structure = salaryStructure
        await axios.post("api/", newEmployee);
        fetchEmployees(1);
        setNewEmployee({
            "full_name": "",
            "age": null,
            "email": "",
            "phone_number": "",
            "address": "",
            "employee_id": "",
            "department": "",
            "is_active": true,
            "salary_structure": {
                "base_salary": "",
                "hra_percentage": "",
                "da_percentage": "",
                "provident_fund_percentage": "",
                "tax_percentage": ""
            },
        });
        setError("Added Successfully.. ")
        } catch (err) {
        console.error(err);
        setError("Failed to add employee.");
        }
    };

  // Delete employee
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`api/${id}/`);
      fetchEmployees(1);
      setShowAddEmployeeForm(false)
      setShowEmployeeData(true)
      setError("Deleted Successfully.. ")
    } catch (err) {
      console.error(err);
      setError("Failed to delete employee.");
    }
  };

  const handlePayslip = async (id) => {
    setShowAddEmployeeForm(false)
    setShowEmployeeData(false)
    setShowPayslip(true)
    const response = await axios.get(`api/${id}`);
    console.log(response.data);
    setNewEmployee({...response.data})
    newEmployee.salary_structure = response.data.salary_structure
  };

    const handlePrint = () => {
        window.print();
    };

  const payslipEmployee = () => {
    const data = newEmployee
    return (
        <>
        <div class="container mt-5 mb-5">
    <div class="row">
        <div class="col-md-12" style={{
            backgroundColor:'whitesmoke',
        }}>
            <div class="text-center lh-1 mb-2">
                <h6 class="fw-bold">Payslip</h6> <span class="fw-normal">Payment slip for the month of June 2021</span>
            </div>
            <div class="d-flex justify-content-end"> <span>Working Branch:Test</span> </div>
            <div class="row">
                <div class="col-md-10">
                    <div class="row">
                        <div class="col-md-6">
                            <div> <span class="fw-bolder">EMP Code</span> <small class="ms-3">{data.employee_id}</small> </div>
                        </div>
                        <div class="col-md-6">
                            <div> <span class="fw-bolder">EMP Name</span> <small class="ms-3">{data.full_name}</small> </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div> <span class="fw-bolder">PF No.</span> <small class="ms-3">101523065714</small> </div>
                        </div>
                        <div class="col-md-6">
                            <div> <span class="fw-bolder">NOD</span> <small class="ms-3">28</small> </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div> <span class="fw-bolder">Mode of Pay</span> <small class="ms-3">UPI</small> </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div> <span class="fw-bolder">Designation</span> <small class="ms-3">{data.department}</small> </div>
                        </div>
                        <div class="col-md-6">
                            <div> <span class="fw-bolder">Ac No.</span> <small class="ms-3">*******test</small> </div>
                        </div>
                    </div>
                </div>
                <table class="mt-4 table table-bordered">
                    <thead class="bg-dark text-white">
                        <tr>
                            <th scope="col">Earnings</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Deductions</th>
                            <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Basic</th>
                            <td>{data.salary_structure.base_salary}</td>
                            <td>PF</td>
                            <td>{data.salary_structure.provident_fund_percentage}</td>
                        </tr>
                        <tr>
                            <th scope="row">DA</th>
                            <td>{data.salary_structure.da}</td>
                        </tr>
                        <tr>
                            <th scope="row">HRA</th>
                            <td>{data.salary_structure.hra} </td>
                        </tr>
                        <tr>
                        </tr>
                        <tr class="border-top">
                            <th scope="row">Total Earning</th>
                            <td>{data.salary_structure.net_salary}</td>
                            <td>Total Deductions</td>
                            <td>{data.salary_structure.total_deductions}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="row">
                <div class="col-md-4"> <br/> <span class="fw-bold">Net Pay : {data.salary_structure.net_salary}</span> </div>
                <div class="border col-md-8">
                    <div class="d-flex flex-column"> <span>In Words</span> <span>Twenty Five thousand nine hundred seventy only</span> </div>
                </div>
            </div>
            <div class="d-flex justify-content-end">
                <div class="d-flex flex-column mt-2"> <span class="fw-bolder">For Testing only | </span> <span class="mt-4">Authorised Signatory</span> </div>
            </div>
        </div>
    </div>
        <button className="print-button"  onClick={handlePrint}><span><i class="fa fa-print" aria-hidden="true"></i>
</span> Print</button>
</div>
       
       
       </>
    )
  }

  const handleEdit = (employee_params) => {
    console.log(employee_params)
    setNewEmployee({ ...employee_params }); // Update the state with the selected employee data
    newEmployee.salary_structure = employee_params.salary_structure
    setSalaryStructure({...employee_params.salary_structure})
    setShowAddEmployeeForm(true);
    setShowEmployeeData(false)
    console.log(newEmployee)
    // setSalaryStructure({ ...newEmployee.salaryStructure });
    // setNewEmployee({
    //     employee_name: employee.id,
    //     employee_designation: employee.employee_designation,
    //     employee_salary: employee.employee_salary,
    //   })
  };

  // Render employee list
  const renderEmployees = () => {
    console.log("Emloyee Data", employees);
    return (
      <>
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-8">
                <h2>
                  Employee <b>Details</b>
                </h2>
              </div>
            </div>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>EmployeeID</th>
                <th>Designation</th>
                <th>Age</th>
                <th>Email</th>
                <th>Address</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td> {employee.full_name}</td>
                  <td>{employee.employee_id}</td>
                  <td> {employee.department}</td>
                  <td> {employee.age}</td>
                  <td> {employee.email}</td>
                  <td>{employee.address}</td>
                  <td> {employee.salary_structure.net_salary}</td>
                  <td>
                    <a
                      onClick={() => handleEdit(employee)}
                      className="edit"
                      title="Edit"
                      data-toggle="tooltip"
                    >
                      <i className="material-icons">&#xE254;</i>
                    </a>
                    <a
                      onClick={() => deleteEmployee(employee.id)}
                      className="delete"
                      title="Delete"
                      data-toggle="tooltip"
                    >
                      <i className="material-icons">&#xE872;</i>
                    </a>
                    <a
                      onClick={() => handlePayslip(employee.id)}
                      className="payslip"
                      title="payslip"
                      data-toggle="tooltip"
                    >
                    <i class="fa fa-download" aria-hidden="true"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pageInfo && (
        <ReactPaginate
          pageCount={pageInfo.totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active'}
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          initialPage={pageInfo.currentPage - 1} // React Paginate uses 0-based indexing
        />
      )}
      
        </div>
      </>
    );
  };

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("name:- ",name)
    setNewEmployee({ ...newEmployee, [name]: value });
  };
  const handlesalarystrucutreChange = (e) => {
    const { name, value } = e.target;
    console.log("name:- ",value)
    setSalaryStructure({...salaryStructure ,[name]: value });
    console.log(salaryStructure)
  };
  const handleBack = () => {
    setShowAddEmployeeForm(false);
    setShowEmployeeData(true)
    setShowPayslip(false)
    setNewEmployee({
        "full_name": "",
        "age": null,
        "email": "",
        "phone_number": "",
        "address": "",
        "employee_id": "",
        "department": "",
        "is_active": true,
        "salary_structure": {
            "base_salary": "",
            "hra_percentage": "",
            "da_percentage": "",
            "provident_fund_percentage": "",
            "tax_percentage": ""
        },
    })
    setSalaryStructure({
        "base_salary": "",
        "hra_percentage": "",
        "da_percentage": "",
        "provident_fund_percentage": "",
        "tax_percentage": ""
    })
  }

  // Add employee form
  const renderAddEmployeeForm = () => {
    return (
        <>
       
      <div className="responsive-form">
        <h2>{newEmployee.id ? "Edit Employee" : "Add Employee"}</h2>{" "}
        {/* Update heading */}
        <form
          className="form-container"
          onSubmit={newEmployee.id ? updateEmployee : addEmployee}
          >
          {" "}
          {/* Update onSubmit handler */}
          <div>
            <label className="form-container-label">full_name</label>
            <input
              type="text"
              name="full_name"
              className="form-container-input"
              value={newEmployee.full_name}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label className="form-container-label">employee_id</label>
            <input
              type="text"
              name="employee_id"
              className="form-container-input"
              value={newEmployee.employee_id}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label className="form-container-label">email</label>
            <input
              type="email"
              name="email"
              className="form-container-input"
              value={newEmployee.email}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label className="form-container-label">address</label>
            <textarea
              name="address"
              className="form-container-input"
              value={newEmployee.address}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label className="form-container-label">age</label>
            <input
              type="number"
              name="age"
              className="form-container-input"
              value={newEmployee.age}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label className="form-container-label">department</label>
            <input
              type="text"
              name="department"
              className="form-container-input"
              value={newEmployee.department}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label className="form-container-label">phone_number</label>
            <input
              type="tel"
              name="phone_number"
              className="form-container-input"
              value={newEmployee.phone_number}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label className="form-container-label">base_salary</label>
            <input
              type="number"
              name="base_salary"
              className="form-container-input"
              value={salaryStructure.base_salary}
              onChange={handlesalarystrucutreChange}
              />
          </div>
          <div>
            <label className="form-container-label">da_percentage</label>
            <input
              type="number"
              name="da_percentage"
              className="form-container-input"
              value={salaryStructure.da_percentage}
              onChange={handlesalarystrucutreChange}
              />
          </div>
          <div>
            <label className="form-container-label">hra_percentage</label>
            <input
              type="number"
              name="hra_percentage"
              className="form-container-input"
              value={salaryStructure.hra_percentage}
              onChange={handlesalarystrucutreChange}
              />
          </div>
          <div>
            <label className="form-container-label">provident_fund_percentage</label>
            <input
              type="number"
              name="provident_fund_percentage"
              className="form-container-input"
              value={salaryStructure.provident_fund_percentage}
              onChange={handlesalarystrucutreChange}
              />
          </div>
          <div>
            <label className="form-container-label">tax_percentage</label>
            <input
              type="number"
              name="tax_percentage"
              className="form-container-input"
              value={salaryStructure.tax_percentage}
              onChange={handlesalarystrucutreChange}
              />
          </div>
          
          <div>
            <button className="form-container-button" type="submit">
              {newEmployee.id ? "Update Employee" : "Add Employee"}
            </button>{" "}
            {/* Update button text */}
          </div>
        </form>
      </div>
              </>
    );
  };

  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
        // console.log(accessToken);
        let page = 1
        const response = await axios.get(`api/?search=${query}&page=${page}`);
        console.log(response);
        setEmployees(response.data.results);
        setPageInfo({
          totalPages: Math.ceil(response.data.count / 10),
          currentPage: page
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employees.");
      }
    // onSearch(query);
  };

  return (
    <div align="center">
        
      <h1>Employee Management</h1>
      {showEmployeeData && <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Type Name or Designation."
      />
      <button type="submit">Search</button>
    </form>}
      {!showEmployeeData &&  <button style={{"float":"left"}} className="form-container-button" onClick={handleBack}>Back</button>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {showAddEmployeeForm && renderAddEmployeeForm()}
      {showEmployeeData && renderEmployees()}
      {showPayslip  && payslipEmployee()}
      {showEmployeeData &&  <button style={{"width":"250px"}} className="form-container-button" onClick={handleAddEmployeeClick}>Add Employee</button>}
     
    </div>
  );
};

export default Employee;
