import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, uploadProductImages } from '../../api/productApi';
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlinePhotograph,
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineUpload
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/AdminProductsPage.css';

export default function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [draggedImageId, setDraggedImageId] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rackets',
    price: '',
    discount: '0',
    stock: '',
    images: [],
    brand: 'Yonex',
    description: '',
    isFeatured: false,
    weight: '',
    stiffness: '',
    balance: ''
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
    fetchProducts(query, 1);
  }, [searchParams]);

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
    setSearchParams(search ? { search } : {});
  };

  const openModal = (product = null) => {
    const buildImageItems = (images = []) => images
      .filter(Boolean)
      .map((url) => ({
        id: `${url}-${Math.random().toString(36).slice(2)}`,
        url
      }));

    if (product) {
      setIsEditMode(true);
      setCurrentProduct(product);
      setFormData({
        name: product.name || '',
        category: product.category || 'Rackets',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        stock: product.stock?.toString() || '',
        images: buildImageItems(product.images || (product.imageUrl ? [product.imageUrl] : [])),
        brand: product.brand || 'Yonex',
        description: product.description || '',
        isFeatured: product.isFeatured || false,
        weight: product.weight || '',
        stiffness: product.stiffness || '',
        balance: product.balance || ''
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
        images: [],
        brand: 'Yonex',
        description: '',
        isFeatured: false,
        weight: '',
        stiffness: '',
        balance: ''
      });
    }
    setImageUrlInput('');
    setDraggedImageId(null);
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

  const addImageUrls = (urls) => {
    const nextImages = urls
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url
      }));

    if (nextImages.length === 0) return;

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...nextImages]
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (files.length === 0) return;

    setIsUploadingImages(true);
    const res = await uploadProductImages(files);
    setIsUploadingImages(false);

    if (res.success) {
      addImageUrls(res.images);
      toast.success(`${res.images.length} image${res.images.length > 1 ? 's' : ''} uploaded`);
    } else {
      toast.error(res.error);
    }
  };

  const handleAddImageUrl = () => {
    addImageUrls([imageUrlInput]);
    setImageUrlInput('');
  };

  const removeImage = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image.id !== id)
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= formData.images.length) return;

    setFormData(prev => {
      const nextImages = [...prev.images];
      const [movedImage] = nextImages.splice(fromIndex, 1);
      nextImages.splice(toIndex, 0, movedImage);
      return { ...prev, images: nextImages };
    });
  };

  const handleImageDrop = (targetId) => {
    if (!draggedImageId || draggedImageId === targetId) return;

    const fromIndex = formData.images.findIndex(image => image.id === draggedImageId);
    const toIndex = formData.images.findIndex(image => image.id === targetId);
    if (fromIndex !== -1 && toIndex !== -1) {
      moveImage(fromIndex, toIndex);
    }
    setDraggedImageId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const images = formData.images.map(image => image.url).filter(Boolean);
    if (images.length === 0) {
      toast.error('Please upload or add at least one product image');
      setIsSubmitting(false);
      return;
    }

    const submitData = {
      ...formData,
      images,
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

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const res = await deleteProduct(productToDelete.id);
      if (res.success) {
        toast.success('Product deleted successfully');
        setProductToDelete(null);
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
            className="form-control search-input"
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
                            onClick={() => setProductToDelete({
                              id: product._id || product.id,
                              name: product.name
                            })}
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
                  <label className="form-label">Product Images *</label>
                  <div className="image-upload-panel">
                    <label className={`image-upload-dropzone ${isUploadingImages ? 'uploading' : ''}`}>
                      <HiOutlineUpload size={24} />
                      <span>{isUploadingImages ? 'Uploading images...' : 'Upload images'}</span>
                      <small>PNG, JPG, JPEG, WEBP or GIF. Up to 8 files, 5MB each.</small>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploadingImages}
                        onChange={handleImageUpload}
                      />
                    </label>

                    <div className="image-url-row">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="Or paste an image URL"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleAddImageUrl}
                        disabled={!imageUrlInput.trim()}
                      >
                        <HiOutlinePlus /> Add URL
                      </button>
                    </div>

                    {formData.images.length > 0 ? (
                      <div className="image-preview-grid">
                        {formData.images.map((image, index) => (
                          <div
                            key={image.id}
                            className="image-preview-card"
                            draggable
                            onDragStart={() => setDraggedImageId(image.id)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => handleImageDrop(image.id)}
                          >
                            <img src={image.url} alt={`Product preview ${index + 1}`} />
                            <div className="image-preview-meta">
                              <span>{index === 0 ? 'Cover image' : `Image ${index + 1}`}</span>
                              <div className="image-preview-actions">
                                <button
                                  type="button"
                                  title="Move up"
                                  disabled={index === 0}
                                  onClick={() => moveImage(index, index - 1)}
                                >
                                  <HiOutlineChevronUp />
                                </button>
                                <button
                                  type="button"
                                  title="Move down"
                                  disabled={index === formData.images.length - 1}
                                  onClick={() => moveImage(index, index + 1)}
                                >
                                  <HiOutlineChevronDown />
                                </button>
                                <button
                                  type="button"
                                  title="Remove image"
                                  onClick={() => removeImage(image.id)}
                                >
                                  <HiOutlineTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="image-empty-state">
                        <HiOutlinePhotograph size={28} />
                        <span>No product images selected</span>
                      </div>
                    )}
                  </div>
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

                {formData.category && formData.category.toLowerCase().includes('racket') && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Weight</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="weight" 
                        placeholder="e.g. 4U (Avg. 83g)"
                        value={formData.weight}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stiffness (Flex)</label>
                      <select 
                        className="form-control" 
                        name="stiffness" 
                        value={formData.stiffness}
                        onChange={handleFormChange}
                      >
                        <option value="">Select Stiffness</option>
                        <option value="Flexible">Flexible</option>
                        <option value="Medium">Medium</option>
                        <option value="Stiff">Stiff</option>
                        <option value="Extra Stiff">Extra Stiff</option>
                      </select>
                    </div>
                    <div className="form-group col-span-2">
                      <label className="form-label">Balance Point</label>
                      <select 
                        className="form-control" 
                        name="balance" 
                        value={formData.balance}
                        onChange={handleFormChange}
                      >
                        <option value="">Select Balance Point</option>
                        <option value="Head Heavy">Head Heavy (Tấn công)</option>
                        <option value="Even Balance">Even Balance (Toàn diện)</option>
                        <option value="Head Light">Head Light (Phòng thủ)</option>
                      </select>
                    </div>
                  </>
                )}
                
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

      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete product?"
        message={`Delete ${productToDelete?.name || 'this product'}? This action cannot be undone.`}
        confirmText="Delete"
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
}
