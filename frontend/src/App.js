import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    city: '',
    age: '',
    gender: 'male',
    height: '',
    weight: ''
  });

  // Fetch all patients on load
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/view`);
      // Convert the backend object format into an array for the table
      const patientArray = Object.entries(response.data).map(([id, info]) => ({
        id,
        ...info
      }));
      setPatients(patientArray);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/create`, formData);
      alert("Patient Registered Successfully!");
      setFormData({ id: '', name: '', city: '', age: '', gender: 'male', height: '', weight: '' });
      fetchPatients();
    } catch (error) {
      alert(error.response?.data?.detail || "Operation failed");
    }
  };

  const deletePatient = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${API_URL}/delete/${id}`);
        fetchPatients();
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="container">
      <h1>🏥 Patient Management System</h1>

      <form className="patient-form" onSubmit={handleSubmit}>
        <input name="id" placeholder="Patient ID (e.g. P001)" value={formData.id} onChange={handleInputChange} required />
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
        <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
        <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleInputChange} required />
        
        <select name="gender" value={formData.gender} onChange={handleInputChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
        
        <input name="height" type="number" step="0.01" placeholder="Height (m)" value={formData.height} onChange={handleInputChange} required />
        <input name="weight" type="number" step="0.1" placeholder="Weight (kg)" value={formData.weight} onChange={handleInputChange} required />
        
        <button type="submit" className="save-btn">Save Patient Record</button>
      </form>

      <div className="table-container">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading records...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Age</th>
                <th>BMI</th>
                <th>Verdict</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td><strong>{patient.id}</strong></td>
                    <td>{patient.name}</td>
                    <td>{patient.city}</td>
                    <td>{patient.age}</td>
                    <td>{patient.bmi}</td>
                    <td>
                      <span className={`badge ${patient.verdict.toLowerCase()}`}>
                        {patient.verdict}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn delete-btn" onClick={() => deletePatient(patient.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No patient records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;