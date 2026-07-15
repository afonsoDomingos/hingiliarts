<template>
  <div class="app-container">
    <Transition name="fade-preloader">
      <div v-if="isLoading" class="preloader">
        <div class="preloader-content">
          <div class="preloader-logo-wrap">
            <img src="/assets/img/logo.png" alt="Hingili Arts Logo" class="preloader-logo">
          </div>
          <div class="preloader-bar">
            <div class="preloader-progress"></div>
          </div>
          <p class="preloader-text">Dando cor à sua visão...</p>
        </div>
      </div>
    </Transition>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);

onMounted(() => {
  const handleLoad = () => {
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  };

  if (document.readyState === 'complete') {
    handleLoad();
  } else {
    window.addEventListener('load', handleLoad);
  }
});
</script>

<style>
.preloader {
  position: fixed;
  inset: 0;
  background: #0d0d11;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

body[data-theme="light"] .preloader {
  background: #f5f5f8;
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.preloader-logo-wrap {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-logo 2s infinite ease-in-out;
}

.preloader-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preloader-bar {
  width: 150px;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

body[data-theme="light"] .preloader-bar {
  background: rgba(0, 0, 0, 0.06);
}

.preloader-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  border-radius: 10px;
  animation: loading-bar 1.5s infinite ease-in-out;
}

.preloader-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
}

body[data-theme="light"] .preloader-text {
  color: rgba(0, 0, 0, 0.4);
}

@keyframes pulse-logo {
  0%, 100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
    filter: drop-shadow(0 0 15px rgba(229, 46, 113, 0.3));
  }
}

@keyframes loading-bar {
  0% {
    left: -40%;
  }
  100% {
    left: 100%;
  }
}

/* Preloader Transition */
.fade-preloader-leave-active {
  transition: opacity 0.6s ease;
}

.fade-preloader-leave-to {
  opacity: 0;
}
</style>
