import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

function CreateProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    type: '',
    material: '',
    careInstructions: '',
    gender: '',
    sizes: [],
    colors: [],
    colorImages: {}
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (type, value) => {
    if (type === 'colors') {
      setFormData(prev => {
        const newColors = prev.colors.includes(value)
          ? prev.colors.filter(item => item !== value)
          : [...prev.colors, value];
        
        // Remove images for unselected colors
        const newColorImages = { ...prev.colorImages };
        if (!newColors.includes(value)) {
          delete newColorImages[value];
        }
        
        return {
          ...prev,
          colors: newColors,
          colorImages: newColorImages
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].includes(value)
          ? prev[type].filter(item => item !== value)
          : [...prev[type], value]
      }));
    }
  };

  const handleImageChange = (e, color) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      colorImages: {
        ...prev.colorImages,
        [color]: files
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that each selected color has images
    const missingImages = formData.colors.filter(color => !formData.colorImages[color]?.length);
    if (missingImages.length > 0) {
      setError(`Please upload images for the following colors: ${missingImages.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('material', formData.material);
      formDataToSend.append('careInstructions', formData.careInstructions);
      formDataToSend.append('gender', formData.gender);
      
      // Add sizes as JSON string
      const sizesData = formData.sizes.map(size => ({ size, stock: 10 }));
      formDataToSend.append('sizes', JSON.stringify(sizesData));
      
      // Add colors with their color codes
      const colorsData = formData.colors.map(colorName => ({
        colorName,
        colorCode: colorName.toLowerCase()
      }));
      formDataToSend.append('colors', JSON.stringify(colorsData));
      
      // Append images for each color
      Object.entries(formData.colorImages).forEach(([color, files]) => {
        files.forEach(file => {
          formDataToSend.append(`images_${color}`, file);
        });
      });

      await axiosInstance.post('/product/create-product', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/productlist');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select a type</option>
            <option value="Shirt">Shirt</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Jeans">Jeans</option>
            <option value="Jacket">Jacket</option>
            <option value="Sweater">Sweater</option>
            <option value="Dress">Dress</option>
            <option value="Shorts">Shorts</option>
            <option value="Skirt">Skirt</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            placeholder="e.g. Cotton, Polyester, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
          <textarea
            name="careInstructions"
            value={formData.careInstructions}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            placeholder="e.g. Machine wash cold, tumble dry low"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map(size => (
              <label key={size} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleCheckboxChange('sizes', size)}
                  className="mr-2"
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {availableColors.map(color => (
              <label key={color} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.colors.includes(color)}
                  onChange={() => handleCheckboxChange('colors', color)}
                  className="mr-2"
                />
                {color}
              </label>
            ))}
          </div>
          
          {formData.colors.length > 0 && (
            <div className="space-y-4">
              {formData.colors.map(color => (
                <div key={color} className="border p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images for {color}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, color)}
                    className="w-full"
                    required
                  />
                  {formData.colorImages[color]?.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.colorImages[color].length} images selected
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
