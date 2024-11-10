import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Forms.css'; // Make sure this CSS file exists

const Forms = ({ onAddCard, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddCard(formData);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Station Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="input-group">
          <label>Address:</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            required
          />
        </div>

        <div className="input-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
          />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Forms;