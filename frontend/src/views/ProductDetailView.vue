<template>
  <div v-if="product" class="row">
    <!-- Product Info Card -->
    <div class="col-md-7 mb-4">
      <div class="card border-0 shadow-sm p-4">
        <span class="badge bg-secondary mb-2 align-self-start">{{ product.Category }}</span>
        <h2 class="fw-bold mb-2">{{ product.Name }}</h2>
        <h3 class="text-primary fw-bold mb-3">${{ Number(product.Price).toFixed(2) }}</h3>
        
        <hr class="my-3" />
        
        <h5 class="fw-bold">Mô tả sản phẩm:</h5>
        <p class="text-secondary leading-relaxed">{{ product.Description }}</p>

        <div class="mt-4 d-flex gap-3">
          <button class="btn btn-primary px-4 py-2" @click="addToCart(product.Id)">🛒 Thêm vào giỏ hàng</button>
          <router-link to="/" class="btn btn-outline-secondary px-4 py-2">Quay lại</router-link>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="col-md-5">
      <div class="card border-0 shadow-sm p-4">
        <h4 class="fw-bold mb-3">Đánh giá từ khách hàng</h4>
        <hr class="mb-4" />

        <!-- Add Review Form -->
        <form @submit.prevent="submitReview" class="mb-4 bg-light p-3 rounded">
          <div class="mb-3">
            <label class="form-label fw-semibold">Viết nhận xét của bạn:</label>
            <textarea v-model="newReview" class="form-control" rows="3" placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..." required></textarea>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <select v-model="rating" class="form-select form-select-sm w-auto">
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
              <option value="2">⭐⭐ (2/5)</option>
              <option value="1">⭐ (1/5)</option>
            </select>
            <button type="submit" class="btn btn-primary btn-sm px-3">Gửi đánh giá</button>
          </div>
        </form>

        <!-- Reviews List (Stored XSS preserved via v-html) -->
        <div v-if="reviews.length === 0" class="text-muted text-center py-3">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
        <div v-else class="reviews-list">
          <div v-for="rev in reviews" :key="rev.Id" class="border-bottom py-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <strong class="text-dark">{{ rev.Username || 'Khách hàng' }}</strong>
              <span class="badge bg-warning text-dark">★ {{ rev.Rating }}/5</span>
            </div>
            <!-- Render review comment (Stored XSS vulnerable under the hood) -->
            <div v-html="rev.Comment" class="text-secondary small mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductDetailView',
  data() {
    return {
      product: null,
      reviews: [],
      newReview: '',
      rating: 5
    };
  },
  mounted() {
    this.loadProduct();
  },
  methods: {
    async loadProduct() {
      const id = this.$route.params.id;
      try {
        const res = await axios.get(`/api/products/${id}`);
        this.product = res.data.product;
        this.reviews = res.data.reviews;
      } catch (err) {
        alert('Không thể tải thông tin sản phẩm: ' + err.message);
      }
    },
    async submitReview() {
      const id = this.$route.params.id;
      const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
      try {
        await axios.post(`/api/products/${id}/reviews`, {
          userId: user.id,
          comment: this.newReview,
          rating: Number(this.rating)
        });
        this.newReview = '';
        this.loadProduct();
      } catch (err) {
        alert('Lỗi gửi đánh giá: ' + err.message);
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
        alert('Không thể thêm sản phẩm: ' + err.message);
      }
    }
  }
};
</script>
