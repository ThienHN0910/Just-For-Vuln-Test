<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card p-4 shadow">
        <h3>Xem Chi Tiết Đơn Hàng (IDOR Vulnerability Test)</h3>
        <p class="text-muted">
          Nhập bất kỳ Mã Đơn Hàng (Order ID) nào để xem thông tin đơn hàng và thông tin khách hàng mà không cần kiểm tra quyền sở hữu.
        </p>

        <div class="input-group mb-4">
          <input v-model="orderId" type="number" class="form-control" placeholder="Order ID (ví dụ: 1, 2, 3)" />
          <button @click="fetchOrder" class="btn btn-primary">Tra Cứu Đơn Hàng</button>
        </div>

        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div v-if="order" class="card bg-light p-3">
          <h5>Đơn Hàng #{{ order.Id }}</h5>
          <hr />
          <p><strong>Khách Hàng:</strong> {{ order.FullName }} ({{ order.Username }})</p>
          <p><strong>Email Khách Hàng:</strong> {{ order.Email }}</p>
          <p><strong>Tổng Tiền:</strong> ${{ order.TotalAmount }}</p>
          <p><strong>Trạng Thái:</strong> <span class="badge bg-success">{{ order.Status }}</span></p>
          <p><strong>Ngày Tạo:</strong> {{ new Date(order.CreatedAt).toLocaleString() }}</p>
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
