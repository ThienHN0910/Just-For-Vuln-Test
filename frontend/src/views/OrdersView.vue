<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card border-0 shadow-sm p-4">
        <h3 class="fw-bold mb-3">Tra cứu & Lịch sử đơn hàng 📦</h3>
        <p class="text-secondary small">
          Vui lòng nhập Mã Đơn Hàng (Order ID) để kiểm tra tình trạng xử lý và thông tin chi tiết của đơn hàng.
        </p>

        <div class="input-group mb-4">
          <input v-model="orderId" type="number" class="form-control" placeholder="Nhập Mã đơn hàng (vd: 1, 2, 3...)" />
          <button @click="fetchOrder" class="btn btn-primary px-4">Tra cứu</button>
        </div>

        <div v-if="error" class="alert alert-danger py-2 small">
          {{ error }}
        </div>

        <div v-if="order" class="card bg-light border-0 p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Chi tiết đơn hàng #{{ order.Id }}</h5>
            <span class="badge bg-success fs-6">{{ order.Status }}</span>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-6 mb-2">
              <span class="text-muted small d-block">Tên khách hàng:</span>
              <strong>{{ order.FullName }} ({{ order.Username }})</strong>
            </div>
            <div class="col-md-6 mb-2">
              <span class="text-muted small d-block">Email liên hệ:</span>
              <strong>{{ order.Email }}</strong>
            </div>
            <div class="col-md-6 mb-2">
              <span class="text-muted small d-block">Tổng số tiền thanh toán:</span>
              <strong class="text-primary fs-5">${{ Number(order.TotalAmount).toFixed(2) }}</strong>
            </div>
            <div class="col-md-6 mb-2">
              <span class="text-muted small d-block">Thời gian đặt hàng:</span>
              <strong>{{ new Date(order.CreatedAt).toLocaleString() }}</strong>
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
  name: 'OrdersView',
  data() {
    return {
      orderId: 1,
      order: null,
      error: null
    };
  },
  mounted() {
    this.fetchOrder();
  },
  methods: {
    async fetchOrder() {
      this.error = null;
      this.order = null;
      try {
        const res = await axios.get(`/api/orders/${this.orderId}`);
        this.order = res.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      }
    }
  }
};
</script>
