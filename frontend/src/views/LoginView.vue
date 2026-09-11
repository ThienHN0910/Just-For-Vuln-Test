<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card p-4 shadow">
        <h3 class="card-title text-center mb-3">Đăng Nhập</h3>
        <p class="text-muted text-center">
          Test SQL Injection Bypass Payload:<br />
          <code>admin' --</code> hoặc Username: <code>' OR '1'='1</code> & Password: <code>anything</code>
        </p>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Tên đăng nhập / Username:</label>
            <input v-model="username" type="text" class="form-control" placeholder="admin" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Mật khẩu / Password:</label>
            <input v-model="password" type="password" class="form-control" placeholder="••••••••" />
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-warning w-100 fw-bold">Đăng Nhập</button>
        </form>
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
        
        alert('Đăng nhập thành công! Token JWT đã được lưu vào LocalStorage.');
        this.$router.push('/');
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      }
    }
  }
};
</script>
