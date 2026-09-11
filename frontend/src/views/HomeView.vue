<template>
  <div>
    <div class="row mb-4">
      <div class="col-md-8 offset-md-2">
        <form @submit.prevent="fetchProducts" class="input-group">
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control" 
            placeholder="Tìm kiếm sản phẩm (Test SQL Injection: ' OR '1'='1 hoặc Reflected XSS: <img src=x onerror=alert(1)>)"
          />
          <button class="btn btn-primary" type="submit">Tìm kiếm</button>
        </form>
      </div>
    </div>

    <!-- Reflected XSS Vulnerability Display -->
    <div v-if="lastSearch" class="alert alert-info">
      Kết quả tìm kiếm cho: <span v-html="lastSearch"></span>
    </div>

    <div v-if="error" class="alert alert-danger">
      <strong>Lỗi backend:</strong> {{ error }}
    </div>

    <div class="row">
      <div v-for="product in products" :key="product.Id" class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ product.Name }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${{ product.Price }} - {{ product.Category }}</h6>
            <p class="card-text">{{ product.Description }}</p>
          </div>
          <div class="card-footer bg-white d-flex justify-content-between align-items-center">
            <router-link :to="`/product/${product.Id}`" class="btn btn-outline-primary btn-sm">Xem Chi Tiết</router-link>
            <button class="btn btn-success btn-sm" @click="addToCart(product.Id)">Thêm giỏ hàng 🛒</button>
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
      error: null
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.error = null;
      try {
        const res = await axios.get(`/api/products?search=${encodeURIComponent(this.searchQuery)}`);
        this.products = res.data.products;
        this.lastSearch = res.data.searchTerm;
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
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
        alert('Đã thêm sản phẩm vào giỏ hàng!');
      } catch (err) {
        alert('Lỗi thêm giỏ hàng: ' + (err.response?.data?.error || err.message));
      }
    }
  }
};
</script>
