<template>
  <nav class="nav">
    <div class="nav-left">
      <span class="brand">SunSmart</span>
    </div>
    <div class="nav-links">
      <RouterLink to="/" class="link" active-class="active">UV</RouterLink>
      <RouterLink to="/awareness" class="link" active-class="active">Awareness</RouterLink>
      <RouterLink to="/clothing" class="link" active-class="active">Clothing</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 40;
}

.brand {
  font-weight: 800;
  letter-spacing: 0.04em;
  font-size: 16px;
}

.nav-links {
  display: flex;
  gap: 12px;
}

.link {
  padding: 6px 10px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.link:hover {
  background: rgba(0, 0, 0, 0.04);
}

.active {
  background: #ff9800;
  color: #ffffff;
}
</style>