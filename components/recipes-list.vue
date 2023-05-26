<template>
  <div class="recipe-container">
    <div class="heading">
      Never. Ending. Blending.
    </div>
    <div class="list-container">
      <div class="list-wrapper">
        <!-- <div class="opacity-block-top"></div> -->
        <ul class="list">
          <li><a>Smoothies</a></li>
          <li><a>Shakes</a></li>
          <li><a>Cocktails</a></li>
          <li><a>Dips</a></li>
          <li><a>Mousse</a></li>
          <li><a>Dressings</a></li>
          <li><a>Juices</a></li>
          <li><a>Pasta Sauce</a></li>
          <li><a>Toppings</a></li>
          <li><a>Desserts</a></li>

          <li><a aria-hidden="true">Smoothies</a></li>
          <li><a aria-hidden="true">Shakes</a></li>
          <li><a aria-hidden="true">Cocktails</a></li>
          <li><a aria-hidden="true">Dips</a></li>
          <li><a aria-hidden="true">Mousse</a></li>
          <li><a aria-hidden="true">Dressings</a></li>
          <li><a aria-hidden="true">Juices</a></li>
          <li><a aria-hidden="true">Pasta Sauce</a></li>
          <li><a aria-hidden="true">Toppings</a></li>
          <li><a aria-hidden="true">Desserts</a></li>
        </ul>
        <!-- <div class="opacity-block-bottom"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
$duration: 10s;

@keyframes scroll {
  from {
    transform: traslateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

.heading {
  color: $grayscale-white;
  font-size: 24px;
  letter-spacing: 3.5px;
  text-align: center;
  font-family: Medium;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;

  @include respond-to('small') {
    font-size: 18px;
    line-height: 1.22;
    letter-spacing: 2.5px;
    margin-top: 60px;
  }
}

.recipe-container {
  @include gradient-primary-purple-turquoise(to top);
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  height: 100%;
}

.opacity-block-top {
  position: absolute;
  top: 0em;
  left: 0em;
  width: 100%;
  height: 150px;
}

.opacity-block-bottom {
  position: absolute;
  bottom: 0em;
  left: 0em;
  width: 100%;
  background: linear-gradient(to top, rgba(55, 55, 149, 1) 0%, rgba(30, 144, 187, 0) 100%);
  height: 150px;
}
.list-container {
  position: relative;
  @include respond-to('small') {
    margin-bottom: 75px;
    -webkit-mask-image: linear-gradient(
      to top,
      transparent 0%,
      black 20%,
      black 70%,
      transparent 100%
    );
    mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%);
  }
}
.list-wrapper {
  margin-top: 30px;
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(
    to top,
    transparent 0%,
    black 20%,
    black 70%,
    transparent 100%
  );
  mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%);
}

.list {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  text-align: center;
  animation: scroll linear $duration infinite;
  color: $grayscale-white;
  font-size: 48px;
  letter-spacing: 4px;
  line-height: 50px;
  font-family: BoldItalic;
  height: 500px;
  text-transform: uppercase;

  &:hover,
  &:active,
  &:focus {
    animation-play-state: paused;
  }

  a {
    color: $grayscale-white;
  }
}
</style>
