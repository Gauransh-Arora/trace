import React, { useState } from 'react';


import './FIR.css';
import FloatingSidebar from '../components/Sidebar';
import FullScreenNavbar from '../components/Navbar';


const FIR = () => {
  const [form, setForm] = useState({
    fullName: '',
    parentName: '',
    age: '',
    gender: '',
    contact: '',
    permanentAddress: '',
    presentAddress: '',
    location: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: '#262d36' }}>
      {/* Navbar at top */}
      <div className="w-full sticky top-0 z-30">
        <FullScreenNavbar />
      </div>
      <div className="flex flex-1">
        {/* Sidebar on left */}
        <div className="w-56 min-w-[180px] bg-[#222932] border-r border-gray-700">
          <FloatingSidebar isOpen={true} />
        </div>
        {/* Main content in center */}
        <main className="flex-1 flex items-center justify-center min-h-screen fir-main-content">
          <div className="fir-form-container">
            <h2 className="page-title">File a FIR Report</h2>
            {submitted ? (
              <div className="success-message">FIR submitted successfully!</div>
            ) : (
              <form className="fir-form" onSubmit={handleSubmit}>
                <label>
                  Full Name:
                  <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
                </label>
                <label>
                  Father’s / Mother’s Name:
                  <input type="text" name="parentName" value={form.parentName} onChange={handleChange} required />
                </label>
                <label>
                  Age:
                  <input type="number" name="age" value={form.age} onChange={handleChange} min="0" required />
                </label>
                <label>
                  Gender:
                  <select name="gender" value={form.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Contact Number:
                  <input type="tel" name="contact" value={form.contact} onChange={handleChange} required />
                </label>
                <label>
                  Permanent Address:
                  <textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange} required />
                </label>

                <label>
                  Location:
                  <input type="text" name="location" value={form.location} onChange={handleChange} required />
                </label>
                <label>
                  Description:
                  <textarea name="description" value={form.description} onChange={handleChange} required />
                </label>
                <button type="submit" className="submit-btn">Submit FIR</button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FIR;
