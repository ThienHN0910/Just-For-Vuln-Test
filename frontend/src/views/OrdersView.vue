<template>
  <div class="row justify-content-center">
    <div class="col-md-9">
      <div class="card border-0 shadow-sm p-4">
        <h3 class="fw-bold mb-3">Lịch sử đơn hàng của bạn 📦</h3>
        <p class="text-secondary small">
          Danh sách các đơn hàng đã đặt. Nhấn vào <strong>Xem chi tiết</strong> để xem hóa đơn và thông tin thanh toán.
        </p>

        <div v-if="loading" class="text-muted text-center py-4">Đang tải danh sách đơn hàng...</div>
        <div v-else-if="error" class="alert alert-danger py-2 small">{{ error }}</div>

        <div v-else-if="orders.length === 0" class="text-center text-muted py-4">
          Bạn chưa có đơn hàng nào.
        </div>

        <div v-else class="table-responsive">
          <table class="table align-middle">
            <thead class="table-light">
              <tr>
                <th>Mã đơn hàng</th>
                <th>Thời gian</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th class="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ord in orders" :key="ord.Id">
                <td class="fw-bold">#{{ ord.Id }}</td>
                <td>{{ new Date(ord.CreatedAt).toLocaleString() }}</td>
                <td class="text-primary fw-bold">${{ Number(ord.TotalAmount).toFixed(2) }}</td>
                <td><span class="badge bg-success">{{ ord.Status }}</span></td>
                <td class="text-end">
                  <router-link :to="`/orders/${ord.Id}`" class="btn btn-outline-primary btn-sm">
                    Xem chi tiết ➔
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
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
      orders: [],
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchUserOrders();
  },
  methods: {
    async fetchUserOrders() {
      this.loading = true;
      this.error = null;
      const user = JSON.parse(localStorage.getItem('user') || '{"id": 2}');
      try {
        const res = await axios.get(`/api/orders/user/${user.id}`);
        this.orders = res.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
