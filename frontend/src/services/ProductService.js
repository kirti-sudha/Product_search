const BASE_URL = '/api/products';

class ProductService {
  /**
   * Fetch products with optional filtering and sorting
   * @param {Object} filters
   * @returns {Promise<Array>} Array of product objects
   */
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.searchQuery) params.append('query', filters.searchQuery);
    if (filters.department && filters.department !== 'all') {
      params.append('department', filters.department);
    }
    if (filters.isOrganic) params.append('organic', 'true');
    if (filters.isSale) params.append('sale', 'true');
    if (filters.isGlutenFree) params.append('glutenFree', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const queryUrl = `${BASE_URL}?${params.toString()}`;
    console.log(`ProductService: GET ${queryUrl}`);

    const response = await fetch(queryUrl);
    if (!response.ok) {
      throw new Error(`ProductService Error: HTTP ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Create a new product
   * @param {Object} productData 
   * @returns {Promise<Object>} The created product
   */
  async createProduct(productData) {
    console.log('ProductService: POST /api/products', productData);
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      throw new Error(`ProductService Error: HTTP ${response.status}`);
    }

    return response.json();
  }
}

// Export as a singleton instance to mimic Spring's @Service singleton behavior
export default new ProductService();
