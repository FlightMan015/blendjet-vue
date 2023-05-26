<template>
  <div class="svg-container" :style="styleObj">
    <svg
      width="12px"
      height="8px"
      viewBox="0 0 12 8"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="D_Nav-White-Sticky" transform="translate(-269.000000, -32.000000)" :fill="color">
          <g
            id="&gt;"
            transform="translate(275.388889, 36.444444) scale(-1, 1) rotate(-90.000000) translate(-275.388889, -36.444444) translate(271.888889, 30.944444)"
          >
            <polygon
              id="BG"
              transform="translate(3.500010, 3.499990) rotate(-45.000000) translate(-3.500010, -3.499990) "
              points="2.97025193e-05 2.79998971 6.99999574 2.79998971 6.99999574 4.19998971 2.97025193e-05 4.19998971"
            ></polygon>
            <polygon
              id="BG-Copy-2"
              transform="translate(3.500012, 7.449860) scale(1, -1) rotate(-45.000000) translate(-3.500012, -7.449860) "
              points="2.89919206e-05 6.74986049 6.99999503 6.74986049 6.99999503 8.14986049 2.89919206e-05 8.14986049"
            ></polygon>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    styleObj: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default: '#373795'
    }
  }
}
</script>

<style lang="scss" scoped></style>
