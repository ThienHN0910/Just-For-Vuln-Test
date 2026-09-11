<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card p-4 shadow">
        <h3>Giỏ Hàng Của Bạn 🛒</h3>
        <hr />

        <div v-if="cartItems.length === 0" class="text-muted py-4 text-center">
          Giỏ hàng trống. Hãy quay lại trang sản phẩm để thêm món hàng bạn muốn!
        </div>

        <table v-else class="table align-middle">
          <thead>
            <tr>
              <th>Sản Phẩm</th>
              <th>Đơn Giá</th>
              <th>Số Lượng</th>
              <th>Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.CartId">
              <td>{{ item.Name }}</td>
              <td>${{ item.Price }}</td>
              <td>{{ item.Quantity }}</td>
              <td>${{ (item.Price * item.Quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" class="text-end">Tổng Cộng:</th>
              <th>${{ totalAmount.toFixed(2) }}</th>
            </tr>
          </tfoot>
        </table>

        <button v-if="cartItems.length > 0" class="btn btn-success fw-bold text-uppercase mt-3" @click="checkout">
          Thanh Toán Đơn Hàng
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CartView',
  data() {
    return {
      cartItems: []
    };
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
    }
  },
  mounted() {
    this.loadCart();
  },
  methods: {
    async loadCart() {
      const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
      try {
        const res = await axios.get(`/api/cart/${user.id}`);
        this.cartItems = res.data;
      } catch (err) {
        alert('Lỗi tải giỏ hàng: ' + err.message);
      }
    },
    async checkout() {
      const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
      try {
        const res = await axios.post('/api/orders/checkout', {
          userId: user.id,
          totalAmount: this.totalAmount
        });
        alert(`Thanh toán thành công! Mã đơn hàng của bạn là #${res.data.orderId}`);
        this.loadCart();
      } catch (err) {
        alert('Lỗi thanh toán: ' + err.message);
      }
    }
  }
};
</script>
