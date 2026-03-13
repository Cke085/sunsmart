  <template>
    <div class="cta-card">
      <span v-if="icon" class="cta-icon">{{ icon }}</span>
      <div class="cta-text">
        <p class="cta-title">{{ title }}</p>
      </div>
      <RouterLink :to="to" class="cta-button">{{ buttonText }} ></RouterLink>
    </div>
  </template>
  
  <script setup>
  defineProps({
    icon: { type: String, default: '' },
    title: { type: String, required: true },
    desc: { type: String, default: '' },
    buttonText: { type: String, required: true },
    to: { type: String, required: true },
  })
  </script>
  
  <style scoped>
  .cta-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    background: #fff8f0;
    border: 1px solid #ffe0b2;
    border-radius: 12px;
    padding: 20px 24px;
    margin: 32px auto 0;
    max-width: 420px;
  }
  
  .cta-icon {
    font-size: 28px;
  }
  
  .cta-text {
    flex: 1;
  }
  
  .cta-title {
    margin: 0;
    font-size: 17px;
    color: #333;
  }
  
  .cta-button {
    display: inline-block;
    margin-top: 4px;
    background: #ff9800;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
  }
  
  .cta-button:hover {
    background: #e65100;
  }
  </style>