<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card border-0 shadow-sm p-4">
        <h3 class="fw-bold mb-3">Trung tâm tải tài liệu & Hóa đơn 📄</h3>
        <p class="text-secondary small">
          Tải xuống các tài liệu hướng dẫn sử dụng, file hóa đơn điện tử hoặc file đính kèm hệ thống.
        </p>

        <div class="input-group mb-4">
          <input v-model="filePath" type="text" class="form-control" placeholder="Nhập tên tài liệu (vd: secret.txt, avatar1.jpg...)" />
          <button @click="downloadFile" class="btn btn-primary px-4">Tải tài liệu</button>
        </div>

        <div v-if="fileContent !== null" class="card bg-dark text-light border-0 p-3">
          <h6 class="text-white-50 mb-2">Nội dung tài liệu:</h6>
          <pre class="mb-0 text-success font-monospace p-2 rounded bg-black small" style="white-space: pre-wrap;">{{ fileContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DocumentView',
  data() {
    return {
      filePath: 'secret.txt',
      fileContent: null
    };
  },
  methods: {
    async downloadFile() {
      this.fileContent = null;
      try {
        const res = await axios.get(`/api/files/download?file=${encodeURIComponent(this.filePath)}`, {
          transformResponse: [(data) => data]
        });
        this.fileContent = res.data;
      } catch (err) {
        this.fileContent = `[LỖI TẢI FILE]: ${err.response?.data || err.message}`;
      }
    }
  }
};
</script>
