<template>
  <div v-html="$route.query.bio"></div>
  <div ref="box"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const box = ref(null)
onMounted(() => {
  box.value.innerHTML = window.location.hash
})
</script>
