import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Forms = ({ onAddCard, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload only JPG or PNG images');
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be smaller than 5MB');
        e.target.value = ''; // Reset input
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast.warning('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddCard(formData);
      // Form submission successful - reset form
      setFormData({
        name: '',
        address: '',
        image: null
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="station-form">
      <div className="form-group">
        <label htmlFor="name">Station Name*</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address*</label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleImageChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="cancel-btn"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Forms;