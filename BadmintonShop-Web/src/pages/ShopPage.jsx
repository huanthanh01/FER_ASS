import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import "../styles/ShopPage.css";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentCategory = searchParams.get("category") || "All";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [categories, setCategories] = useState(["All"]);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const sortOptions = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // getProducts(isFeatured, page, limit, category, search, sortOrder)
      // Note: sortOrder logic depends on how the backend handles it.
      // We pass the parameters to the API as mapped in api.js
      const sortParam =
        currentSort === "price_asc"
          ? "price-asc"
          : currentSort === "price_desc"
            ? "price-desc"
            : undefined;

      const res = await getProducts(
        false,
        currentPage,
        12, // 12 items per page
        currentCategory !== "All" ? currentCategory : undefined,
        currentSearch,
        sortParam,
      );

      if (res.success) {
        setProducts(res.products);
        setTotalPages(res.totalPages || 1);
        setTotalProducts(res.totalProducts || 0);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Failed to fetch shop products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentCategory, currentSearch, currentSort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await getCategories();
      if (res.success && res.categories) {
        setCategories(["All", ...res.categories]);
      }
    };
    fetchCats();
  }, []);

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    // Always reset to page 1 when changing filters
    newParams.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === "" ||
        (key === "category" && value === "All")
      ) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  // Sync input value with URL when URL changes externally
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Debounced instant search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateFilters({ search: searchInput });
      }
    }, 100); // 100ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, currentSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="shop-page page-container">
      <div className="shop-header">
        <h1 className="shop-title">Shop All Gear</h1>

        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <HiOutlineSearch size={20} />
          </button>
        </form>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h3 className="filter-title">
              <HiOutlineFilter /> Categories
            </h3>
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`category-btn ${currentCategory === cat ? "active" : ""}`}
                    onClick={() => updateFilters({ category: cat })}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="shop-content">
          <div className="shop-toolbar">
            <div className="results-count">
              Showing {products.length} of {totalProducts} products
            </div>

            <div className="sort-controls">
              <label htmlFor="sort" className="sort-label">
                Sort by:
              </label>
              <select
                id="sort"
                className="form-control sort-select"
                value={currentSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="shop-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <HiOutlineChevronLeft /> Prev
                  </button>

                  <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`pagination-page ${currentPage === page ? "active" : ""}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next <HiOutlineChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => {
                  setSearchInput("");
                  setSearchParams({});
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
