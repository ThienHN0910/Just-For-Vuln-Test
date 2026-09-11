<template>
  <div>
    <!-- Hero Banner -->
    <div class="p-5 mb-4 bg-white rounded-3 shadow-sm border text-center">
      <h1 class="display-6 fw-bold text-dark mb-2">Chào mừng đến với VulnShop 🛒</h1>
      <p class="lead text-secondary mb-4">Khám phá các sản phẩm công nghệ, phụ kiện và thời trang chất lượng cao với giá ưu đãi tốt nhất.</p>
      
      <div class="row justify-content-center">
        <div class="col-md-8">
          <form @submit.prevent="fetchProducts" class="input-group input-group-lg">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="Nhập tên sản phẩm bạn muốn tìm kiếm..." 
            />
            <button class="btn btn-primary px-4" type="submit">Tìm kiếm</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Search query reflection (Reflected XSS preserved under the hood) -->
    <div v-if="lastSearch" class="alert alert-light border shadow-sm mb-4">
      Kết quả tìm kiếm phù hợp với: <span v-html="lastSearch" class="fw-semibold"></span>
    </div>

    <!-- SQL Injection Raw Output Inspector (Hidden behind subtle collapsible box for security testing) -->
    <div v-if="rawSqliResult" class="card border-warning mb-4 shadow-sm">
      <div class="card-header bg-warning text-dark fw-bold d-flex justify-content-between align-items-center">
        <span>🔍 SQL Query Debug Payload Output (Multi-recordset Leaked Data)</span>
        <button class="btn btn-sm btn-outline-dark" @click="showRaw = !showRaw">{{ showRaw ? 'Ẩn' : 'Hiện' }}</button>
      </div>
      <div v-if="showRaw" class="card-body bg-dark text-light">
        <pre class="text-success font-monospace mb-0" style="white-space: pre-wrap;">{{ JSON.stringify(rawSqliResult, null, 2) }}</pre>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger shadow-sm">
      <strong>Lỗi kết nối:</strong> {{ error }}
    </div>

    <!-- Products Grid -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="fw-bold mb-0">Danh sách sản phẩm</h3>
      <span class="text-muted">{{ products.length }} sản phẩm tìm thấy</span>
    </div>

    <div class="row">
      <div v-for="product in products" :key="product.Id" class="col-md-3 col-sm-6 mb-4">
        <div class="card h-100 shadow-sm border-0 transition-hover">
          <div class="card-body d-flex flex-column">
            <div class="mb-2">
              <span class="badge bg-secondary mb-2">{{ product.Category }}</span>
              <h5 class="card-title text-dark fw-bold mb-1">{{ product.Name }}</h5>
            </div>
            <p class="card-text text-muted small flex-grow-1">{{ product.Description }}</p>
            <div class="mt-3">
              <h4 class="text-primary fw-bold mb-3">${{ Number(product.Price).toFixed(2) }}</h4>
              <div class="d-grid gap-2">
                <router-link :to="`/product/${product.Id}`" class="btn btn-outline-primary btn-sm">Xem chi tiết</router-link>
                <button class="btn btn-primary btn-sm" @click="addToCart(product.Id)">Thêm vào giỏ</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      searchQuery: '',
      lastSearch: '',
      products: [],
      rawSqliResult: null,
      showRaw: true,
      error: null
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.error = null;
      this.rawSqliResult = null;
      try {
        const res = await axios.get(`/api/products?search=${encodeURIComponent(this.searchQuery)}`);
        this.products = res.data.products || [];
        this.lastSearch = res.data.searchTerm;
        if (res.data.rawRecordsets || res.data.rawResult) {
          this.rawSqliResult = res.data.rawRecordsets || res.data.rawResult;
        }
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
        if (err.response?.data?.details) {
          this.error += ` (${err.response.data.details})`;
        }
      }
    },
    async addToCart(productId) {
      const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
      try {
        await axios.post('/api/cart/add', {
          userId: user.id,
          productId: productId,
          quantity: 1
        });
        alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
      } catch (err) {
        alert('Không thể thêm sản phẩm: ' + (err.response?.data?.error || err.message));
      }
    }
  }
};
</script>

<style scoped>
.transition-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.transition-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
