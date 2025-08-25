import React, { useState } from "react";
import axios from "axios";
import "./PlantForm.css"; 

const PlantForm = () => {
  const [formData, setFormData] = useState({
    plantName: "",
    price: "",
    category: "",
    stock: "",
    avatar: null,
  });

  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      const res = await axios.post(
        "https://plantcatalogbackend.onrender.com/api/v1/admin/postPlant",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess("🌿 Plant added successfully!");
      setErrors({});
      setFormData({
        plantName: "",
        price: "",
        category: "",
        stock: "",
        image: null,
      });
      console.log("✅ Uploaded:", res.data);
    } catch (err) {
      const message = err.response?.data?.message || "Plant upload failed";

      if (message.includes("Plant name already exists")) {
        setErrors({ plantName: "Plant name already exists" });
      } else {
        setErrors({ general: message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className={loading ? "blurred" : ""}>
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>Add New Plant 🌱</h2>

          {success && <p className="success-msg">{success}</p>}
          {errors.general && <p className="error-msg">{errors.general}</p>}

          <label>Plant Name</label>
          <input
            type="text"
            name="plantName"
            placeholder="Enter plant name"
            value={formData.plantName}
            onChange={handleChange}
            required
          />
          {errors.plantName && <p className="error-msg">{errors.plantName}</p>}

          <label>Price</label>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="flowering">Flowering</option>
            <option value="decorative">Decorative</option>
            <option value="medicinal">Medicinal</option>
            <option value="succulent">Succulent</option>
          </select>

          <label>Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="Available stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          <label>Upload Image</label>
          <input
            type="file"
            name="avatar"
            accept="avatar/*"
            onChange={handleFileChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Plant"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default PlantForm;
