<template>
  <Transition name="slide-left" mode="out-in">
    <router-view />
  </Transition>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}
</style>
