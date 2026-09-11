<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card p-4 shadow border-danger">
        <h3 class="card-title text-danger mb-3">File Downloader (Path Traversal Test)</h3>
        
        <p class="text-muted">
          Ứng dụng tải file qua endpoint <code>/api/files/download?file=...</code> mà không kiểm tra sanitize tên file.
        </p>

        <div class="mb-3">
          <label class="form-label">Thử nghiệm các Payload Path Traversal:</label>
          <div class="d-flex gap-2 mb-2">
            <button class="btn btn-outline-secondary btn-sm" @click="filePath = 'avatar1.jpg'">avatar1.jpg</button>
            <button class="btn btn-outline-secondary btn-sm" @click="filePath = 'secret.txt'">secret.txt</button>
            <button class="btn btn-outline-danger btn-sm" @click="filePath = '../package.json'">../package.json</button>
            <button class="btn btn-outline-danger btn-sm" @click="filePath = '../server.js'">../server.js</button>
            <button class="btn btn-outline-danger btn-sm" @click="filePath = '../../.env'">../../.env</button>
          </div>
        </div>

        <div class="input-group mb-3">
          <input v-model="filePath" type="text" class="form-control" placeholder="Nhập đường dẫn file (ví dụ: ../package.json)" />
          <button @click="downloadFile" class="btn btn-danger">Tải / Đọc File</button>
        </div>

        <div v-if="fileContent !== null" class="card bg-dark text-light p-3">
          <h6>Nội dung file đọc được:</h6>
          <pre class="mb-0 text-success font-monospace">{{ fileContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FileViewer',
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
          transformResponse: [(data) => data] // Keep raw string format
        });
        this.fileContent = res.data;
      } catch (err) {
        this.fileContent = `[LỖI]: ${err.response?.data || err.message}`;
      }
    }
  }
};
</script>
