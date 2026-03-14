<template>
  <transition name="fade">
    <div v-if="visible" class="banner" role="status" aria-live="polite">
      <button class="close" type="button" aria-label="Dismiss notification" @click="dismiss">
        ×
      </button>

      <div class="title">{{ title }}</div>
      <div class="body">
        <div class="row">
          <span class="pill uv-pill" :class="severityClass">
            UV {{ uvLevel }}
          </span>
          <span class="text">{{ uvReminder }}</span>
        </div>
        <div v-if="sunscreenAdvice" class="row">
          <span class="pill warn">Sunscreen</span>
          <span class="text">{{ sunscreenAdvice }}</span>
        </div>
        <div v-if="clothingAdvice" class="row">
          <span class="pill secondary">Clothing</span>
          <span class="text">{{ clothingAdvice }}</span>
        </div>
      </div>

      <button class="cta" type="button" @click="goClothing">
        View clothing advice
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // All content comes from parent (mock/API); keep defaults minimal to avoid hard-coded copy.
  uvLevel: { type: Number, default: 0 },
  title: { type: String, default: '' },
  uvReminder: { type: String, default: '' },
  sunscreenAdvice: { type: String, default: '' },
  clothingAdvice: { type: String, default: '' },
  autoShow: { type: Boolean, default: true },
  autoHideMs: { type: Number, default: 0 },
  // When this number changes, the banner will re-show (used for location changes, etc.)
  triggerKey: { type: Number, default: 0 },
})

const emit = defineEmits(['dismiss', 'navigate'])
const router = useRouter()

const visible = ref(false)
let hideTimer = null

const severityClass = computed(() => {
  const v = props.uvLevel
  if (v <= 2) return 'low'
  if (v <= 5) return 'moderate'
  if (v <= 7) return 'high'
  if (v <= 10) return 'very-high'
  return 'extreme'
})

const show = () => {
  visible.value = true
  if (hideTimer) window.clearTimeout(hideTimer)
  if (props.autoHideMs && props.autoHideMs > 0) {
    hideTimer = window.setTimeout(() => {
      visible.value = false
      emit('dismiss')
    }, props.autoHideMs)
  }
}

const dismiss = () => {
  visible.value = false
  if (hideTimer) window.clearTimeout(hideTimer)
  emit('dismiss')
}

const goClothing = () => {
  emit('navigate')
  router.push('/clothing')
  dismiss()
}

onMounted(() => {
  if (props.autoShow) show()
})

watch(
  () => props.uvLevel,
  () => {
    // When UV changes, re-show the banner briefly (if it was dismissed).
    if (props.autoShow) show()
  }
)

watch(
  () => props.triggerKey,
  () => {
    if (props.autoShow) show()
  },
)
</script>

<style scoped>
.banner {
  position: fixed;
  top: 16px;
  right: 16px;
  width: min(360px, calc(100vw - 32px));
  background: #ffffff;
  color: rgba(0, 0, 0, 0.86);
  border-radius: 14px;
  padding: 14px 14px 12px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  z-index: 50;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.04);
  line-height: 28px;
  font-size: 18px;
}

.close:hover {
  background: rgba(0, 0, 0, 0.08);
}

.title {
  font-weight: 900;
  letter-spacing: 0.2px;
  margin-bottom: 10px;
}

.body {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.row {
  display: flex;
  gap: 10px;
  align-items: baseline;
}

.pill {
  font-weight: 800;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.22);
  white-space: nowrap;
}

.uv-pill {
  font-size: 14px;
}

.uv-pill.low {
  background: rgba(76, 175, 80, 0.16);
  border-color: rgba(76, 175, 80, 0.4);
}

.uv-pill.moderate {
  background: rgba(255, 235, 59, 0.3);
  border-color: rgba(255, 235, 59, 0.8);
}

.uv-pill.high {
  background: rgba(255, 152, 0, 0.32);
  border-color: rgba(255, 152, 0, 0.9);
}

.uv-pill.very-high {
  background: rgba(244, 67, 54, 0.22);
  border-color: rgba(244, 67, 54, 0.6);
}

.uv-pill.extreme {
  background: rgba(156, 39, 176, 0.22);
  border-color: rgba(156, 39, 176, 0.6);
}

.pill.warn {
  background: rgba(59, 130, 246, 0.16);
  border-color: rgba(59, 130, 246, 0.4);
}

.pill.secondary {
  background: rgba(59, 130, 246, 0.16);
  border-color: rgba(59, 130, 246, 0.22);
}

.text {
  color: rgba(0, 0, 0, 0.72);
  font-size: 13px;
  line-height: 1.25;
}

.cta {
  width: 100%;
  border: 0;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px 12px;
  background: #f59e0b;
  color: rgba(0, 0, 0, 0.86);
  font-weight: 900;
}

.cta:hover {
  filter: brightness(0.98);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
