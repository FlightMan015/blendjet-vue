<template>
  <div class="features-container" :class="isSticky">
    <div class="features-column" :style="computedWidth">
      <div v-if="location !== 'homepage'" class="features-heading">
        {{heading}}
      </div>
      <div class="features-row">
        <div class="features-icon">
          <!-- <img class="features-icon__img" :src="optimizeSource({url: '/images/features/portable.png'})" /> -->
         <svg width="70px" height="70px" viewBox="0 0 70 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <title>Group 2</title>
              <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="D-BlendJet-PDP-BlendJet" transform="translate(-169.000000, -1935.000000)">
                      <g id="Features" transform="translate(0.000000, 1780.000000)">
                          <g id="Group-2" transform="translate(170.000000, 156.000000)">
                              <circle id="Oval-Copy" stroke="#FFFFFF" stroke-width="1.5" cx="34" cy="34" r="34"></circle>
                              <circle id="Oval-Copy" fill="#FFFFFF" cx="34" cy="34" r="30"></circle>
                              <g id="Group-40" transform="translate(13.000000, 12.000000)" :fill="location ==='homepage' ? '#3457A2' : '#32499D'">
                                  <path d="M20.2753221,42.5046924 L20.2753221,32.5379109 L11.6869393,32.5379109 C13.1796058,37.2855831 15.3265383,40.5549538 16.42547,42.0299905 C17.6713177,42.3029277 18.9569959,42.4642089 20.2753221,42.5046924" id="Fill-1"></path>
                                  <path d="M11.3073083,31.2321868 L20.275061,31.2321868 L20.275061,22.660128 L10.0901909,22.660128 C10.1489573,25.8511435 10.6243122,28.7222086 11.3073083,31.2321868" id="Fill-4"></path>
                                  <path d="M24.7223715,1.09142264 L24.8039915,1.0169852 C23.7553378,0.82044424 22.6786067,0.70291144 21.580981,0.66961048 L21.580981,11.4754455 L30.1693638,11.4754455 C28.1020925,4.90340312 24.7706906,1.14496536 24.7223715,1.09142264" id="Fill-6"></path>
                                  <path d="M10.0900603,21.3542732 L20.2755833,21.3542732 L20.2755833,12.7815614 L11.3163192,12.7815614 C10.6287523,15.2961104 10.1494796,18.1684814 10.0900603,21.3542732" id="Fill-8"></path>
                                  <path d="M31.9227573,12.7816267 C32.5731055,15.3013993 33.0177712,18.1698526 33.0719669,21.3543385 L41.8562378,21.3543385 C41.8229368,18.293915 41.1321052,15.3928137 39.9202114,12.7816267 L31.9227573,12.7816267 Z" id="Fill-10"></path>
                                  <path d="M31.7659163,22.6601932 L21.5810463,22.6601932 L21.5810463,31.2322521 L30.5396575,31.2322521 C31.2272243,28.7177032 31.7071499,25.8453321 31.7659163,22.6601932" id="Fill-13"></path>
                                  <path d="M31.5580139,11.4757067 L39.2590241,11.4757067 C36.5942944,6.65490302 32.0842996,3.00093886 26.6804027,1.45995326 C27.9347388,3.17070846 30.0966894,6.58960702 31.5580139,11.4757067" id="Fill-15"></path>
                                  <path d="M31.9138118,31.2321868 L39.5064307,31.2321868 C40.8528342,28.6432004 41.6794815,25.7414462 41.834886,22.660128 L33.0715099,22.660128 C33.0166612,25.8393902 32.5687307,28.7084964 31.9138118,31.2321868" id="Fill-17"></path>
                                  <path d="M20.2753221,0.669284 C19.1783493,0.70323792 18.1035772,0.82011776 17.0549234,1.01600576 L17.1358905,1.08913728 C17.0875714,1.14333296 13.7659639,4.92593024 11.6973866,11.475772 L20.2753221,11.475772 L20.2753221,0.669284 Z" id="Fill-19"></path>
                                  <path d="M0.021482384,22.6601932 C0.176886864,25.7415115 1.00353422,28.6432657 2.34993774,31.2322521 L9.93341518,31.2322521 C9.28306702,28.7131324 8.83840126,25.8446792 8.78420558,22.6601932 L0.021482384,22.6601932 Z" id="Fill-21"></path>
                                  <path d="M10.2978975,32.5381068 L3.08660722,32.5381068 C5.66318738,36.7274982 9.67497362,39.9374496 14.435705,41.4895355 C13.1800629,39.5894219 11.5019557,36.5622993 10.2978975,32.5381068" id="Fill-23"></path>
                                  <path d="M1.93635288,12.7816267 C0.72380616,15.3928137 0.03362744,18.293915 -0.00032648,21.3543385 L8.7839444,21.3543385 C8.83879304,18.1744233 9.28737656,15.3053171 9.9429484,12.7816267 L1.93635288,12.7816267 Z" id="Fill-25"></path>
                                  <path d="M21.5812421,42.5046924 C22.8963036,42.4642089 24.1800229,42.3035807 25.4239117,42.0312964 C26.5189257,40.551689 28.6632463,37.2725239 30.1585247,32.5379109 L21.5812421,32.5379109 L21.5812421,42.5046924 Z" id="Fill-28"></path>
                                  <path d="M31.5471747,32.5381068 C30.3391987,36.5577286 28.6591327,39.5913808 27.4054495,41.4947592 C32.1733634,39.9439792 36.1897203,36.7320689 38.7702183,32.5381068 L31.5471747,32.5381068 Z" id="Fill-31"></path>
                                  <path d="M30.548603,12.7816267 L21.5815033,12.7816267 L21.5815033,21.3543385 L31.7657204,21.3543385 C31.707607,18.1626701 31.2315992,15.2922579 30.548603,12.7816267" id="Fill-33"></path>
                                  <path d="M10.3088019,11.4757067 C11.7746971,6.5980955 13.9359947,3.1700555 15.1851072,1.45734142 C9.77794541,2.99767406 5.26272701,6.65229118 2.59669133,11.4757067 L10.3088019,11.4757067 Z" id="Fill-38"></path>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </div>
        <div class="features-text-block">
          <div class="features-text-block__title">
            Portable
          </div>
          <div class="features-text-block__text">
            Perfect for jetting around town. Lightweight & durably constructed. Stash it in your bag & drink straight from the jar.
          </div>
        </div>
      </div>
      <div class="features-row">
        <div class="features-icon">
          <svg width="70px" height="70px" viewBox="0 0 70 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>Power</title>
            <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="D-BlendJet-PDP-BlendJet" transform="translate(-169.000000, -2048.000000)">
                    <g id="Features" transform="translate(0.000000, 1780.000000)">
                        <g id="Power" transform="translate(170.000000, 269.000000)">
                            <circle id="Oval-Copy-2" stroke="#FFFFFF" stroke-width="1.5" cx="34" cy="34" r="34"></circle>
                            <path d="M34,4 C50.5685425,4 64,17.4314575 64,34 C64,50.5685425 50.5685425,64 34,64 C17.4314575,64 4,50.5685425 4,34 C4,17.4314575 17.4314575,4 34,4 Z M44.3965487,17 L32.9771151,17 L24,34.7251284 L30.8935493,34.7251284 L25.6029822,51 L45,28.2789639 L37.7865801,28.2789639 L44.3965487,17 Z" id="Combined-Shape" fill="#FFFFFF"></path>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        </div>
        <div class="features-text-block">
          <div class="features-text-block__title">
            Powerful
          </div>
          <div class="features-text-block__text">
            Big blender performance, compact size. Patented TurboJet™ technology powers through anything in 20 seconds flat: ice, frozen fruit, leafy greens & more.
          </div>
        </div>
      </div>
      <div class="features-row">
        <div class="features-icon">
          <svg width="70px" height="70px" viewBox="0 0 70 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <title>USB</title>
              <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="D-BlendJet-PDP-BlendJet" transform="translate(-169.000000, -2171.000000)">
                      <g id="Features" transform="translate(0.000000, 1780.000000)">
                          <g id="USB" transform="translate(170.000000, 392.000000)">
                              <circle id="Oval-Copy-3" stroke="#FFFFFF" stroke-width="1.5" cx="34" cy="34" r="34"></circle>
                              <path d="M34,4 C50.5685425,4 64,17.4314575 64,34 C64,50.5685425 50.5685425,64 34,64 C17.4314575,64 4,50.5685425 4,34 C4,17.4314575 17.4314575,4 34,4 Z M33.6600607,15 L28.6010571,23.1166849 L33.2265152,23.1166849 L33.2265152,41.6719651 L27.2887427,36.8471336 L27.2887427,33.2840085 C29.1586812,33.0439623 30.6048059,31.4456057 30.6048059,29.50572 C30.6048059,27.3999486 28.902252,25.6927907 26.8021597,25.6927907 C24.7020674,25.6927907 23,27.3999486 23,29.50572 C23,31.4456057 24.4461247,33.0439623 26.3155767,33.2840085 L26.3155767,37.3121012 L33.2265152,42.9278167 L33.2265152,45.4370803 C31.4451348,45.7532387 30.0909743,47.3101239 30.0909743,49.1875586 C30.0909743,51.2933299 31.7935282,53 33.893134,53 C35.9932263,53 37.6957802,51.2933299 37.6957802,49.1875586 C37.6957802,47.1857097 36.1562316,45.5473454 34.1996813,45.390242 L34.1996813,39.2432047 L41.5733603,35.7396033 L41.5733603,32.9058869 L44.4782609,32.9058869 L44.4782609,26.1050652 L37.6957802,26.1050652 L37.6957802,32.9058869 L40.6001942,32.9058869 L40.6001942,35.1219233 L34.1996813,38.1634846 L34.1996813,23.1166849 L38.8261126,23.1166849 L33.6600607,15 Z" id="Combined-Shape" fill="#FFFFFF"></path>
                              <g id="Group-3" transform="translate(23.000000, 15.000000)"></g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </div>
        <div class="features-text-block">
          <div class="features-text-block__title">
            USB-Rechargeable
          </div>
          <div class="features-text-block__text">
            Lasts for 15+ blends & recharges quickly. Water-resistant USB-C charging port. Reversible cable included.
          </div>
        </div>
      </div>
      <div class="features-row">
        <div class="features-icon">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70" height="70" viewBox="0 0 70 70">
            <defs>
                <path id="v3u9cewgta" d="M23 15L45 15 45 51 23 51z"/>
            </defs>
            <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
                <circle cx="34" cy="34" r="34" stroke="#FFF" stroke-width="1.5"/>
                <circle cx="34" cy="34" r="30" fill="#FFF"/>
                <mask id="tp3i71p06b" fill="#fff">
                    <use xlink:href="#v3u9cewgta"/>
                </mask>
                <path :fill="location ==='homepage' ? '#2B77AF' : '#32499D'" d="M34 51c-6.075 0-11-4.958-11-11.074C23 30.71 34 15 34 15s11 15.709 11 24.926C45 46.042 40.075 51 34 51" mask="url(#tp3i71p06b)"/>
            </g>
          </svg>
        </div>
        <div class="features-text-block">
          <div class="features-text-block__title">
            Self-Cleaning
          </div>
          <div class="features-text-block__text">
            Just add water, soap & blend. Rinse and you’re ready to go! The BlendJet 2 portable blender is the world’s most convenient blender.
          </div>
        </div>
      </div>
      <div class="features-row" v-if="location !=='homepage'">
        <div class="features-icon">
        <svg width="70px" height="70px" viewBox="0 0 70 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>PDP</title>
            <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="D-BlendJet-PDP-BlendJet" transform="translate(-169.000000, -2399.000000)">
                    <g id="Features" transform="translate(0.000000, 1780.000000)">
                        <polygon id="BG" fill="none" points="0.0034936606 0 720 0 720 730 0.0034936606 730"></polygon>
                        <polygon id="BG-Copy-4" fill="none" points="0.0034936606 0 720 0 720 3316 0.0034936606 3316"></polygon>
                        <g id="Portable-Copy-2" transform="translate(170.000000, 620.000000)">
                            <path d="M34,68 C52.7776815,68 68,52.7776815 68,34 C68,29.1232783 66.9732781,24.4863603 65.1242036,20.2936154 C59.8534682,8.34231227 47.9009598,0 34,0 C15.2223185,0 0,15.2223185 0,34 C0,52.7776815 15.2223185,68 34,68 Z" id="Oval-Copy" stroke="#FFFFFF" stroke-width="1.5"></path>
                            <circle id="Oval-Copy" fill="#FFFFFF" cx="34" cy="34" r="30"></circle>
                            <g id="Group-3" transform="translate(20.000000, 18.000000)" fill="#32499D" >
                                <path d="M0.747095631,23.8897397 C0.340335864,5.51301685 11.9329892,4.08371618 28,0 C26.5763408,14.2930066 23.5256426,26.748341 4.00117376,27.3608984 C3.594414,28.3818275 3.18765423,29.4027565 2.98427435,30.6278714 C2.3741347,33.0781011 -0.676563552,31.8529862 0.136955981,30.0153139 C3.594414,21.0311383 9.49243062,14.2930066 17.0174863,8.57580398 C17.0174863,8.57580398 6.23835248,13.6804492 0.747095631,23.8897397 Z" id="Path"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        </div>
        <div class="features-text-block">
          <div class="features-text-block__title">
            BPA-Free
          </div>
          <div class="features-text-block__text">
            Mindfully designed to help you live well.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
export default {

  computed: {
    isSticky() {
      return {
        sticky: this.location !== 'homepage'
      }
    },
    portableFill() {
      return {

      }
    },
    computedWidth() {
      return this.location === 'homepage' ? 'width:100%' : 'width:60%';
    }
  },

  mixins: [
    imageOptimize
  ],
  props: {
    location: {
      type: String,
      default: 'homepage'
    },
    heading: {
      type: String,
      default: 'Blendjet 2 Features'
    }
  }

}
</script>

<style lang="scss" scoped>

.sticky {
  position: sticky;
  top: 260px;
}

.features-container {
  display: flex;
  justify-content: center;
  color: $grayscale-white;


}

.features-heading {
  font-size:24px;
  font-family: Medium;
  letter-spacing: 4px;
  line-height: 1.17;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 48px;
}

.features-column {
  // width: 60%;
  display: flex;
  flex-flow: column nowrap;
  @include respond-to('small') {
    width: 80%;
  }
}

.features-row {
  display: flex;
  margin-bottom: 40px;
  @include respond-to('small') {
    flex-flow: column nowrap;
  }
}

.features-icon {
  display: flex;
  justify-content: center;
  align-items: center;

  &__img {
    height: 70px;
    width: 70px;
    max-width: auto;
  }
}

.features-text-block {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin-left: 25px;

  @include respond-to('small') {
    margin-left: 0;
    margin-top: 20px;
  }

  &__title {
    font-family: Bold;
    font-size: $text-small;
    letter-spacing: 1.75px;
    line-height: 1.17;
    text-transform: uppercase;

    @include respond-to('small') {
      text-align: center;
    }
  }

  &__text {
    font-family: Regular;
    font-size: 14px;
    letter-spacing: 0.5px;
    line-height: 1.29;
    @include respond-to('small') {
      text-align: center;
    }
  }
}


</style>
