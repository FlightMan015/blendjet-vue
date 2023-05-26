<template>
  <div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes scaling {
  0%,
  100% {
    transform: scale(0.2);
    background-color: #373795;
  }
  40% {
    transform: scale(1);
    background-color: #1e90bb;
  }
}

.dot {
  height: 15px;
  width: 15px;
  border-radius: 50%;
  transform: scale(0);
  background-color: red;
  animation: scaling 2.5s ease-in-out infinite;
  display: inline-block;
  margin: 0.25rem;
}

.dot:nth-child(0) {
  animation-delay: 0s;
}
.dot:nth-child(1) {
  animation-delay: 0.2s;
}
.dot:nth-child(2) {
  animation-delay: 0.4s;
}
.dot:nth-child(3) {
  animation-delay: 0.6s;
}
.dot:nth-child(4) {
  animation-delay: 0.8s;
}
.dot:nth-child(5) {
  animation-delay: 1s;
}
</style>
