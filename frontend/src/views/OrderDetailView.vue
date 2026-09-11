<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card border-0 shadow-sm p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="fw-bold mb-0">Chi tiết đơn hàng #{{ orderId }}</h3>
          <router-link to="/orders" class="btn btn-outline-secondary btn-sm">← Quay lại danh sách</router-link>
        </div>

        <div v-if="loading" class="text-muted text-center py-4">Đang tải thông tin đơn hàng...</div>
        <div v-else-if="error" class="alert alert-danger py-2 small">{{ error }}</div>

        <div v-else-if="order" class="card bg-light border-0 p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0 text-primary">Đơn hàng #{{ order.Id }}</h5>
            <span class="badge bg-success fs-6">{{ order.Status }}</span>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-6 mb-3">
              <span class="text-muted small d-block">Tên khách hàng đặt hàng:</span>
              <strong class="text-dark">{{ order.FullName }} ({{ order.Username }})</strong>
            </div>
            <div class="col-md-6 mb-3">
              <span class="text-muted small d-block">Email liên hệ:</span>
              <strong class="text-dark">{{ order.Email }}</strong>
            </div>
            <div class="col-md-6 mb-3">
              <span class="text-muted small d-block">Tổng số tiền:</span>
              <strong class="text-primary fs-5">${{ Number(order.TotalAmount).toFixed(2) }}</strong>
            </div>
            <div class="col-md-6 mb-3">
              <span class="text-muted small d-block">Thời gian tạo đơn:</span>
              <strong class="text-dark">{{ new Date(order.CreatedAt).toLocaleString() }}</strong>
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
  name: 'OrderDetailView',
  data() {
    return {
      orderId: this.$route.params.id,
      order: null,
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchOrderDetail();
  },
  methods: {
    async fetchOrderDetail() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get(`/api/orders/${this.orderId}`);
        this.order = res.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      } finally {
        this.loading = false;
      }
    }
  },
  watch: {
    '$route.params.id'(newId) {
      this.orderId = newId;
      this.fetchOrderDetail();
    }
  }
};
</script>
