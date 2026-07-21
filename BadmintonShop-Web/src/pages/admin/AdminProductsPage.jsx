import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../api/productApi';
import { useAppContext } from '../../context/AppContext';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import { toast } from 'react-toastify';
import '../../styles/AdminProductsPage.css';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rackets',
    price: '',
    discount: '0',
    stock: '',
    imageUrl: '',
    brand: 'Yonex',
    description: '',
    isFeatured: false
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchQuery = '', page = 1) => {
    setIsLoading(true);
    try {
      const res = await getProducts(false, page, 10, undefined, searchQuery);
      if (res.success) {
        setProducts(res.products);
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.currentPage || 1);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCats = async () => {
    try {
      const res = await getCategories();
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(search, 1);
  };

  const openModal = (product = null) => {
    if (product) {
      setIsEditMode(true);
      setCurrentProduct(product);
      setFormData({
        name: product.name || '',
        category: product.category || 'Rackets',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        stock: product.stock?.toString() || '',
        imageUrl: (product.images && product.images.length > 0) ? product.images[0] : (product.imageUrl || ''),
        brand: product.brand || 'Yonex',
        description: product.description || '',
        isFeatured: product.isFeatured || false
      });
    } else {
      setIsEditMode(false);
      setCurrentProduct(null);
      setFormData({
        name: '',
        category: 'Rackets',
        price: '',
        discount: '0',
        stock: '',
        imageUrl: '',
        brand: 'Yonex',
        description: '',
        isFeatured: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = {
      ...formData,
      images: formData.imageUrl ? [formData.imageUrl] : [],
      price: parseFloat(formData.price),
      discount: parseInt(formData.discount, 10),
      stock: parseInt(formData.stock, 10)
    };

    try {
      let res;
      if (isEditMode) {
        res = await updateProduct(currentProduct._id || currentProduct.id, submitData);
      } else {
        res = await createProduct(submitData);
      }

      if (res.success) {
        toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
        closeModal();
        fetchProducts(search, currentPage);
      } else {
        toast.error(res.error || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted successfully');
        fetchProducts(search, currentPage);
      } else {
        toast.error(res.error || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchProducts(search, newPage);
    }
  };

  return (
    <div className="admin-page page-container">
      <div className="admin-header">
        <h1 className="admin-title">Product Management</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <HiOutlinePlus /> Add Product
        </button>
      </div>

      <div className="admin-toolbar glass">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <HiOutlineSearch size={20} />
          </button>
        </form>
      </div>

      <div className="admin-content glass">
        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No products found</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product._id || product.id}>
                      <td>
                        <img 
                          src={(product.images && product.images.length > 0) ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/50')} 
                          alt={product.name} 
                          className="table-img"
                        />
                      </td>
                      <td className="font-medium max-w-xs truncate" title={product.name}>
                        {product.name}
                      </td>
                      <td>{product.category}</td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td>
                        <span className={`stock-badge ${product.stock > 10 ? 'high' : product.stock > 0 ? 'medium' : 'low'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        {product.isFeatured && <span className="featured-badge">Featured</span>}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="action-btn edit" 
                            title="Edit"
                            onClick={() => openModal(product)}
                          >
                            <HiOutlinePencilAlt />
                          </button>
                          <button 
                            className="action-btn delete" 
                            title="Delete"
                            onClick={() => handleDelete(product._id || product.id)}
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                className="page-btn" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <HiOutlineX size={24} />
              </button>
            </div>
            
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group col-span-2">
                  <label className="form-label">Product Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <input 
                    className="form-control" 
                    name="category"
                    list="category-list"
                    required
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="Select or type category"
                  />
                  <datalist id="category-list">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    className="form-control" 
                    name="price" 
                    required
                    value={formData.price}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input 
                    type="number" 
                    min="0"
                    className="form-control" 
                    name="stock" 
                    required
                    value={formData.stock}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    className="form-control" 
                    name="discount" 
                    value={formData.discount}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="form-group col-span-2">
                  <label className="form-label">Image URL</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="imageUrl" 
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label">Brand *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="brand" 
                    required
                    value={formData.brand}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="form-group col-span-2">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    name="description" 
                    rows="3"
                    value={formData.description}
                    onChange={handleFormChange}
                  ></textarea>
                </div>
                
                <div className="form-group col-span-2 checkbox-group">
                  <input 
                    type="checkbox" 
                    id="isFeatured" 
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleFormChange}
                  />
                  <label htmlFor="isFeatured">Featured Product (Shows on Home Page)</label>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
