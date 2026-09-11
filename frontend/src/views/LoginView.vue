<template>
  <div class="row justify-content-center py-4">
    <div class="col-md-5 col-sm-8">
      <div class="card border-0 shadow-sm p-4">
        <div class="text-center mb-4">
          <span class="fs-1">🛍️</span>
          <h3 class="fw-bold mt-2">Đăng Nhập Tài Khoản</h3>
          <p class="text-muted small">Vui lòng nhập tên tài khoản và mật khẩu để tiếp tục</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label fw-semibold">Tên đăng nhập / Username:</label>
            <input v-model="username" type="text" class="form-control" placeholder="Nhập username (vd: john_doe)" required />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Mật khẩu:</label>
            <input v-model="password" type="password" class="form-control" placeholder="••••••••" />
          </div>

          <div v-if="error" class="alert alert-danger py-2 small">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2 fw-bold mt-2">Đăng Nhập</button>
        </form>

        <div class="mt-4 text-center border-top pt-3">
          <span class="text-muted small">Chưa có tài khoản? <a href="#" @click.prevent class="text-primary">Đăng ký ngay</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      error: null
    };
  },
  methods: {
    async handleLogin() {
      this.error = null;
      try {
        const res = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password
        });
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        alert('Đăng nhập thành công!');
        this.$router.push('/');
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      }
    }
  }
};
</script>
