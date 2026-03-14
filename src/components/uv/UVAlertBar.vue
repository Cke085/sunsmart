<template>
  <div class="alert" role="status" aria-live="polite">
    <div class="left">
      <div class="title">{{ title }}</div>
      <div class="msg">
        <slot>{{ message }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Title and message content are provided by the parent (e.g. from mock data or API).
  // Defaults are empty to avoid hard-coded copy in this presentational component.
  title: { type: String, default: '' },
  message: { type: String, default: '' }
})
</script>

<style scoped>
.alert {
  width: 100%;
  max-width: 760px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.left {
  min-width: 0;
}

.title {
  font-weight: 700;
  color: rgba(0, 0, 0, 0.82);
  margin-bottom: 4px;
}

.msg {
  color: rgba(0, 0, 0, 0.72);
  font-size: 14px;
  line-height: 1.35;
}
</style>
