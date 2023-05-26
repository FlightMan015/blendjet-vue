<template>
  <div class="marquee-wrapper">
    <div class="marquee-container">
      <div
        class="marquee-block"
        :style="[{ width: width * length * 2 + 'px' }, { height: height ? height + 'px' : '60px' }]"
      >
        <div class="marquee-inner" :class="direction">
          <span class="repeat">
            <slot></slot>
          </span>
          <span class="repeat">
            <slot></slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 60
    },
    length: {
      type: Number,
      default: 0
    },
    direction: {
      type: String,
      default: 'left'
    }
  }
}
</script>
<style lang="scss" scoped>
.marquee-wrapper {
  text-align: center;
}
.marquee-wrapper .marquee-container {
  overflow: hidden;
}
.marquee-inner span {
  float: left;
  width: 50%;
  display: flex;
  justify-content: space-evenly;
}
.marquee-wrapper .marquee-block {
  height: 60px;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}
.marquee-inner {
  display: block;
  width: 200%;
  position: absolute;
}
.marquee-inner p {
  font-weight: 800;
  font-size: 30px;
  font-family: cursive;
}
.marquee-inner.left {
  animation: marqueeLeft 70s linear infinite;
}
.marquee-inner.right {
  animation: marqueeRight 70s linear infinite;
}
.marquee-item {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  color: white;
  float: left;
  transition: all 0.2s ease-out;
}
@keyframes marqueeLeft {
  0% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
@keyframes marqueeRight {
  0% {
    left: -100%;
  }
  100% {
    left: 0;
  }
}
</style>
