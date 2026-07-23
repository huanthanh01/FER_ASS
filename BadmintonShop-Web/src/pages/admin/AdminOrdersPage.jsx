import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineEye, HiOutlineX } from 'react-icons/hi';
import { getOrders, updateOrderStatus } from '../../api/orderApi';
import { toast } from 'react-toastify';

export default function AdminOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
  }, [searchParams]);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const res = await getOrders(search);
    if (res.success) {
      setOrders(res.orders);
      if (search) setCurrentPage(1);
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  }, [search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      toast.success('Order status updated successfully');
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } else {
      toast.error(res.error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Order Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage customer orders and update statuses.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-slate-500"
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg font-semibold tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Customer</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Total</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 rounded-tr-lg font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                currentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                      #{String(order._id).substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-200">{order.user?.fullname || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-400">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status || 'Completed'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full outline-none cursor-pointer border ${
                          order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' :
                          order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' :
                          order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        <option value="Pending" className="bg-slate-800 text-amber-400">Pending</option>
                        <option value="Completed" className="bg-slate-800 text-emerald-400">Completed</option>
                        <option value="Cancelled" className="bg-slate-800 text-rose-400">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openModal(order)}
                        title="View Details"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {orders.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50 rounded-b-xl">
            <span className="text-xs text-slate-500">
              Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} of {orders.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div>
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <p className="text-sm text-slate-400 mt-1">
                  ID: #{String(selectedOrder._id).toUpperCase()}
                </p>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Customer Info</h3>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{selectedOrder.user?.fullname || 'Unknown'}</p>
                    <p className="text-sm text-slate-300">{selectedOrder.user?.email}</p>
                    <p className="text-sm text-slate-400">@{selectedOrder.user?.username}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Order Info</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-300"><span className="text-slate-500 mr-2">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-slate-300"><span className="text-slate-500 mr-2">Status:</span> 
                      <span className={`font-semibold ${
                        selectedOrder.status === 'Completed' ? 'text-emerald-400' :
                        selectedOrder.status === 'Pending' ? 'text-amber-400' :
                        selectedOrder.status === 'Cancelled' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>{selectedOrder.status || 'Completed'}</span>
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-white mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="w-12 h-12 bg-white rounded-md overflow-hidden flex-shrink-0">
                      <img src={(item.product?.images && item.product?.images.length > 0) ? item.product.images[0] : (item.product?.imageUrl || 'https://via.placeholder.com/50')} alt={item.product?.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.priceAtPurchase?.toFixed(2)}</p>
                    </div>
                    <div className="text-sm font-bold text-emerald-400 flex-shrink-0">
                      ${((item.priceAtPurchase || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Amount:</span>
              <span className="text-2xl font-bold text-white">${selectedOrder.totalAmount?.toFixed(2)}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
