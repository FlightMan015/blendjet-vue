<template>
  <svg width="19px" height="19px" viewBox="0 0 19 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>i</title>
    <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="D-BlendJet-PDP-BlendJet" transform="translate(-1319.000000, -483.000000)">
        <g id="BUY" transform="translate(0.000000, 77.000000)">
          <g id="Side" transform="translate(935.000000, 32.000000)">
            <g id="Group-5" transform="translate(70.000000, 65.000000)">
              <g id="After-Ppay" transform="translate(2.000000, 310.000000)">
                <g id="Group-12" transform="translate(26.000000, 0.000000)">
                  <g id="i" transform="translate(287.000000, 0.000000)">
                    <circle id="Oval-Copy-7" :stroke="color" cx="8.5" cy="8.5" r="8.5"></circle>
                    <text font-family="Helvetica" font-size="12" font-weight="normal" line-spacing="18" letter-spacing="0.428571429" :fill="color">
                      <tspan x="7.5" y="13">i</tspan>
                    </text>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'Info',
  props: {
    size: {
      type: String,
      default: '19px'
    },
    color: {
      type: String, 
      default: "#373795"
    }
  }
}
</script>

<style lang="scss" scoped>

</style>