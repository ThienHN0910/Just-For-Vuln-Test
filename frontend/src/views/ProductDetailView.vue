<template>
  <div v-if="product" class="row">
    <div class="col-md-6">
      <div class="card p-4 shadow-sm mb-4">
        <h2>{{ product.Name }}</h2>
        <h4 class="text-success">${{ product.Price }}</h4>
        <p class="badge bg-secondary">{{ product.Category }}</p>
        <p class="mt-3">{{ product.Description }}</p>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="card p-4 shadow-sm">
        <h4>Đánh giá sản phẩm</h4>
        <hr />
        
        <!-- Form add review -->
        <form @submit.prevent="submitReview" class="mb-4">
          <div class="mb-2">
            <label class="form-label">Nhận xét (Test Stored XSS: &lt;img src=x onerror=alert('StoredXSS')&gt;):</label>
            <textarea v-model="newReview" class="form-control" rows="2" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-sm">Gửi Đánh Giá</button>
        </form>

        <!-- List Reviews with Stored XSS Vulnerability (v-html) -->
        <div v-for="rev in reviews" :key="rev.Id" class="border-bottom py-2">
          <div class="d-flex justify-content-between">
            <strong>{{ rev.Username || 'Khách' }}</strong>
            <span class="text-warning">★ {{ rev.Rating }}/5</span>
          </div>
          <!-- VULNERABILITY: Renders unescaped comment html -->
          <div v-html="rev.Comment" class="mt-1"></div>
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
      newReview: ''
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
        alert('Lỗi tải sản phẩm: ' + err.message);
      }
    },
    async submitReview() {
      const id = this.$route.params.id;
      const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
      try {
        await axios.post(`/api/products/${id}/reviews`, {
          userId: user.id,
          comment: this.newReview,
          rating: 5
        });
        this.newReview = '';
        this.loadProduct();
      } catch (err) {
        alert('Lỗi gửi đánh giá: ' + err.message);
      }
    }
  }
};
</script>
