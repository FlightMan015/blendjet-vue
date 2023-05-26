<template>
  <section :class="bannerClasses" :data-gradient="isGradient">
    <slot
      name="background"
      :mobileBackgroundImgUrl="mobileBackgroundImgUrl"
      :imageUrl="imageUrl"
      :backgroundAltTag="backgroundAltTag"
    >
      <picture class="hero-background" ref="hero-img-card">
        <source
          v-if="cloudinaryCanAutoFormat"
          media="(max-width: 768px)"
          :srcset="
            optimizeSource({
              url: mobileSrc,
              format: 'auto',
              width: 768,
              crop: mobileCrop
            })
          "
          @error="fallback"
        />
        <source
          v-if="reformat"
          media="(max-width: 768px)"
          :srcset="
            optimizeSource({
              url: mobileSrc,
              format: 'webp',
              width: 768,
              crop: mobileCrop
            })
          "
          type="image/webp"
          @error="fallback"
        />
        <source
          v-if="reformat"
          media="(max-width: 768px)"
          :srcset="
            optimizeSource({
              url: mobileSrc,
              format: 'pjpg',
              width: 768,
              crop: mobileCrop
            })
          "
          type="image/jpeg"
          @error="fallback"
        />
        <source
          v-if="cloudinaryCanAutoFormat"
          media="(min-width: 769px) and (max-width: 1023px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'auto',
              width: 1023,
              crop: mobileCrop
            })
          "
          @error="fallback"
        />
        <source
          v-if="reformat"
          media="(min-width: 769px) and (max-width: 1023px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'webp',
              width: 1023,
              crop: mobileCrop
            })
          "
          type="image/webp"
        />
        <source
          v-if="reformat"
          media="(min-width: 769px) and (max-width: 1023px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'pjpg',
              width: 1023,
              crop: mobileCrop
            })
          "
          type="image/jpeg"
        />
        <source
          v-if="cloudinaryCanAutoFormat"
          media="(min-width: 1023px) and (max-width: 1215px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'auto',
              width: 1215
            })
          "
          @error="fallback"
        />
        <source
          v-if="reformat"
          media="(min-width: 1023px) and (max-width: 1215px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'webp',
              width: 1215
            })
          "
          type="image/webp"
        />
        <source
          v-if="reformat"
          media="(min-width: 1023px) and (max-width: 1215px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'pjpg',
              width: 1215
            })
          "
          type="image/jpeg"
        />
        <source
          v-if="cloudinaryCanAutoFormat"
          media="(min-width: 1216px) and (max-width: 1407px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'auto',
              width: 1407
            })
          "
          @error="fallback"
        />
        <source
          v-if="reformat"
          media="(min-width: 1216px) and (max-width: 1407px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'webp',
              width: 1407
            })
          "
          type="image/webp"
        />
        <source
          v-if="reformat"
          media="(min-width: 1216px) and (max-width: 1407px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'pjpg',
              width: 1407
            })
          "
          type="image/jpeg"
        />
        <source
          v-if="cloudinaryCanAutoFormat"
          media="(min-width: 1408px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'auto',
              width: 1408
            })
          "
          @error="fallback"
        />
        <source
          v-if="reformat"
          media="(min-width: 1408px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'webp',
              width: 1408
            })
          "
          type="image/webp"
        />
        <source
          v-if="reformat"
          media="(min-width: 1408px)"
          :srcset="
            optimizeSource({
              url: imageUrl,
              format: 'pjpg',
              width: 1408
            })
          "
          type="image/jpeg"
        />
        <img :src="imageUrl" :alt="backgroundAltTag" @error="fallback" />
      </picture>
    </slot>
    <div class="hero-body">
      <div class="container">
        <div class="hero-body-inner" :style="innerMaxWidth">
          <div class="blendjet-logo" v-if="location === 'collection'">
            <svg
              width="140px"
              height="35px"
              viewBox="0 0 140 35"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <title>JetPackLogo</title>
              <defs>
                <filter id="filter-1">
                  <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"
                  ></feColorMatrix>
                </filter>
                <polygon
                  id="path-2"
                  points="0.292578297 0.272900256 14.9976099 0.272900256 14.9976099 26.6284818 0.292578297 26.6284818"
                ></polygon>
              </defs>
              <g id="Collections" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g
                  id="JetPackLogo"
                  transform="translate(-650.000000, -256.000000)"
                  filter="url(#filter-1)"
                >
                  <g
                    transform="translate(720.000000, 273.500000) rotate(180.000000) translate(-720.000000, -273.500000) translate(650.000000, 256.000000)"
                  >
                    <path
                      d="M127.789343,35 C129.469641,35 131,33.5395968 131,31.8085637 C131,30.2334234 129.815366,29 128.173482,29 C126.452292,29 125,30.616296 125,32.1552692 C125,33.6929952 126.184634,35 127.789343,35"
                      id="Fill-1"
                      fill="#030100"
                    ></path>
                    <g id="Group-5" transform="translate(125.000000, 0.000000)">
                      <mask id="mask-3" fill="white">
                        <use xlink:href="#path-2"></use>
                      </mask>
                      <g id="Clip-4"></g>
                      <path
                        d="M8.99138324,6.95333095 C9.17422665,5.80906496 9.80163049,5.14476829 10.8329629,5.14476829 C11.6444052,5.14476829 12.0112871,5.44041023 12.269419,5.73485524 L14.9977294,1.97050742 C14.554364,1.45463018 13.3389931,0.272062404 10.5019327,0.272062404 C7.55253709,0.272062404 4.60314148,2.26614936 3.86698764,6.10590384 L0.292578297,26.6284818 L5.5257239,26.6284818 L8.99138324,6.95333095 Z"
                        id="Fill-3"
                        fill="#030100"
                        mask="url(#mask-3)"
                      ></path>
                    </g>
                    <path
                      d="M109.506473,19.3935146 L118.442707,19.3935146 C117.729172,21.2870291 115.925852,22.9639766 113.148423,22.9639766 C110.257754,22.9639766 109.468726,20.8932708 109.506473,19.643667 L109.506473,19.3935146 Z M112.661369,27 C119.230518,27 124,21.429477 124,15.7141899 C124,10.9995124 120.358049,8 115.701807,8 C111.007819,8 108.192643,10.2502133 106.42707,13.2508838 L110.632786,14.5004876 C111.195335,13.5728392 112.69668,12.1437279 115.139259,12.1437279 C117.653679,12.1437279 119.119713,13.7500305 119.156242,15.6076435 C119.156242,15.7141899 119.119713,15.8218944 119.119713,15.9295989 L105.487055,15.9295989 L105.187516,17.6424479 C105.037747,18.3570035 105,19.0344996 105,19.7143118 C105,24.0711325 107.855358,27 112.661369,27 L112.661369,27 Z"
                      id="Fill-6"
                      fill="#030100"
                    ></path>
                    <path
                      d="M93.9941686,21.5705292 L89.7787595,21.5705292 L89,26.1575476 L93.2142605,26.1575476 L92.4010426,31 L97.4296696,31 L98.2451847,26.1575476 L101.221241,26.1575476 L102,21.5705292 L99.0250928,21.5705292 L100.476939,13.0272823 C100.547005,12.5847699 100.582612,12.2130115 100.582612,11.8064758 C100.582612,8.95832709 98.8838134,7 95.9789715,7 C93.3222301,7 91.7635625,7.96177485 91.0548684,8.62614301 L92.542322,12.5104182 C92.8960947,12.2130115 93.4267538,11.8820267 94.171055,11.8820267 C94.9854215,11.8820267 95.3748012,12.324539 95.3748012,13.1016339 C95.3748012,13.2503373 95.3748012,13.4709939 95.3403428,13.618498 L93.9941686,21.5705292 Z"
                      id="Fill-8"
                      fill="#030100"
                    ></path>
                    <path
                      d="M77.0708504,12.2884327 C79.3459477,12.2884327 80.8739619,13.8175666 80.8739619,16.1850674 C80.8739619,19.0992779 78.6750237,22.3393887 75.2454536,22.3393887 C72.9703564,22.3393887 71.367392,20.7358645 71.367392,18.3695445 C71.367392,15.1672192 73.9761379,12.2884327 77.0708504,12.2884327 M73.8274467,27 C76.8472091,27 78.7100809,25.4696853 79.7170714,24.4884418 L80.0543467,26.4910759 L84.3796909,26.4910759 L89,1 L83.7075581,1 L82.0296436,10.0673509 C81.3961947,8.9751124 79.6433302,7.62782143 76.9221592,7.62782143 C70.2866604,7.62782143 66,13.6723284 66,18.9894636 C66,23.6866797 69.3534111,27 73.8274467,27"
                      id="Fill-10"
                      fill="#030100"
                    ></path>
                    <path
                      d="M55.0364996,12.5710716 C57.2773747,12.5710716 58.7951222,14.1414726 58.7951222,16.463489 C58.7951222,19.6425088 56.3010939,22.4289284 53.301931,22.4289284 C51.0985601,22.4289284 49.6148008,20.9280141 49.6148008,18.6071559 C49.6148008,15.7500914 51.7115191,12.5710716 55.0364996,12.5710716 L55.0364996,12.5710716 Z M48.459203,24.6084969 C49.0733341,25.6785932 50.7715705,27 53.4109276,27 C59.8792276,27 64,21.0727783 64,15.8925393 C64,11.2496648 60.7476839,8 56.4464226,8 C53.4835919,8 51.675187,9.49975619 50.7000781,10.5003657 L50.3742605,8.49914665 L46.1808238,8.49914665 L43,26.5008533 L48.1333854,26.5008533 L48.459203,24.6084969 Z"
                      id="Fill-12"
                      fill="#030100"
                    ></path>
                    <path
                      d="M30.2598774,22.2853224 C28.4450345,22.2853224 27.2583602,21.3217725 27.0013275,19.6784103 L22,21.1781665 C22.4432012,24.5007924 25.5191858,27 29.6305076,27 C36.7049118,27 41,21.5001219 41,16.0361453 C41,11.3214678 37.4447816,8 32.5923889,8 C28.5567356,8 25.3330173,10.071864 23.5181743,13.4651347 L27.9994311,15.0007924 C28.8882357,13.5357796 30.29591,12.7146776 32.0374866,12.7146776 C34.3351666,12.7146776 35.7788735,14.1785322 35.7788735,16.4275875 C35.7788735,19.1792637 33.7406284,22.2853224 30.2598774,22.2853224"
                      id="Fill-14"
                      fill="#030100"
                    ></path>
                    <polygon
                      id="Fill-16"
                      fill="#030100"
                      points="6.23156905 26.7207708 12.6452447 20.8145266 10.3636257 34 15.5072549 34 20 8 14.8563708 8 13.8412736 13.9423754 12.0660283 15.5779137 8.22651707 8 2.46490043 8 8.0444105 19.290995 0 26.7207708"
                    ></polygon>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <slot
            name="body"
            :textColor="textColor"
            :title="title"
            :subtitle="subtitle"
            :superHeading="superHeading"
            :shortDescript="shortDescription"
          >
            <h6
              class="superHeading"
              :style="textColor && textColor.length > 0 ? `color: ${textColor}` : ''"
            >
              {{ superHeading }}
            </h6>
            <h1
              :class="titleClass"
              :style="textColor && textColor.length > 0 ? `color: ${textColor}` : ''"
            >
              {{ title }}
            </h1>
            <h3
              :class="subtitleClass"
              :style="textColor && textColor.length > 0 ? `color: ${textColor}` : ''"
            >
              {{ subtitle }}
            </h3>
            <p
              class="shortDescription"
              :style="textColor && textColor.length > 0 ? `color: ${textColor}` : ''"
            >
              {{ shortDescription }}
            </p>
          </slot>
          <slot
            name="cta"
            :ctaUrl="ctaUrl"
            :ctaText="ctaText"
            :ctaHandler="ctaHandler"
            :ctaTwoUrl="ctaTwoUrl"
            :ctaTwoText="ctaTwoText"
            :ctaTwoHandler="ctaTwoHandler"
          >
            <p class="cta-container" v-if="ctaText.length > 0">
              <cta-button :to="ctaUrl" @clicked="ctaHandler" rel="nofollow">{{
                ctaText
              }}</cta-button>
              <cta-button :to="ctaTwoUrl" @clicked="ctaTwoHandler" rel="nofollow">{{
                ctaTwoText
              }}</cta-button>
            </p>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CtaButton from '~/components/nacelle/CtaButton'
import imageOptimize from '~/mixins/imageOptimize'

export default {
  components: {
    CtaButton
  },
  props: {
    alignment: {
      type: String,
      default: 'center'
    },
    size: {
      type: String,
      default: 'medium'
    },
    mobileFullHeight: {
      type: Boolean,
      default: false
    },
    mobileCrop: {
      type: Boolean,
      default: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    mobileBackgroundImgUrl: {
      type: String,
      default: ''
    },
    backgroundAltTag: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    superHeading: {
      type: String,
      default: ''
    },
    shortDescription: {
      type: String,
      default: ''
    },
    ctaText: {
      type: String,
      default: ''
    },
    ctaUrl: {
      type: String,
      default: ''
    },
    ctaHandler: {
      type: Function,
      default: () => {}
    },
    ctaTwoText: {
      type: String,
      default: ''
    },
    ctaTwoUrl: {
      type: String,
      default: ''
    },
    ctaTwoHandler: {
      type: Function,
      default: () => {}
    },
    textColor: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageOptions: {
        url: this.imageUrl,
        containerRef: 'hero-img-card'
      }
    }
  },
  computed: {
    bannerClasses() {
      const mobileHeightClass = this.mobileFullHeight ? 'is-mobile-fullheight' : ''
      return `hero nacelle is-${this.size} is-align-${this.alignment} ${mobileHeightClass}`
    },

    innerMaxWidth() {
      if (this.location !== 'homepage' && this.location !== 'brand-ambassador') {
        return 'max-width: 520px'
      }
    },

    isGradient() {
      if (this.location.toLowerCase() === 'brand-ambassador') {
        return 'yes'
      }
    },

    titleClass() {
      if (this.location.toLowerCase() === 'homepage') {
        return 'title-homepage'
      } else if (this.location.toLowerCase() === 'collection') {
        return 'title-collection'
      } else if (this.location.toLowerCase() === 'brand-ambassador') {
        return 'title-homepage'
      } else {
        return 'title'
      }
      // return this.location.toLowerCase() === 'homepage' ? 'title-homepage' : 'title'
    },
    subtitleClass() {
      if (this.location.toLowerCase() === 'homepage') {
        return 'subtitle-homepage'
      } else if (this.location.toLowerCase() === 'collection') {
        return 'subtitle-collection'
      } else {
        return 'subtitle'
      }
      // return this.location.toLowerCase() === 'homepage' ? 'subtitle-homepage' : 'subtitle'
    },
    // titleClass() {
    //   let classObj = {}
    //   if(this.textColor && this.textColor.length) {
    //     classObj.color = this.textColor
    //   }
    //   if(this.location.toLowerCase() === 'homepage') {
    //     Object.assign(classObj, {
    //       fontSize: '54px',
    //       fontFamily: 'Medium',
    //       letterSpacing: '10px',
    //       textTransform: 'uppercase',
    //       lineHeight: 1,
    //       textAlign: 'center'
    //     })
    //   }

    //   return classObj;
    // },
    //  subtitleClass() {
    //   let classObj = {}
    //   if(this.textColor && this.textColor.length) {
    //     classObj.color = this.textColor
    //   }
    //   if(this.location.toLowerCase() === 'homepage') {
    //     Object.assign(classObj, {
    //       fontSize: '54px',
    //       fontFamily: 'BoldItalic',
    //       letterSpacing: '10px',
    //       textTransform: 'uppercase',
    //       lineHeight: 1,
    //       textAlign: 'center'
    //     })
    //   }

    //   return classObj;
    // },
    mobileSrc() {
      return this.mobileBackgroundImgUrl || this.imageUrl
    },
    fallbackImage() {
      return this.imageUrl
    }
  },
  mixins: [imageOptimize]
}
</script>

<style lang="scss" scoped>
.hero {
  position: relative;

  &.is-mobile-fullheight {
    @media screen and (max-width: 768px) {
      height: 100vh;
    }
  }
}
.cta-container {
  display: flex;
  justify-content: center;
  .cta-button {
    font-family: 'Bold';
  }
  .cta-button:last-child {
    margin-left: 15px;
    @media (max-width: 551px) {
      margin-left: 0;
      margin-top: 15px;
    }
  }

  @media (max-width: 551px) {
    flex-direction: column;
    align-items: center;
  }
}
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.is-mobile-fullheight .hero-body {
  display: flex;
  align-items: center;
}

.is-align-center .hero-body .container {
  display: flex;
  justify-content: center;
  text-align: center;
}

.is-align-right .hero-body .container {
  display: flex;
  justify-content: flex-end;
  text-align: right;
}

// .hero-body-inner {
//   max-width: 650px;
// }

.title-homepage {
  font-size: 54px;
  font-family: 'Bold';
  letter-spacing: 10px;
  text-transform: uppercase;
  line-height: 1;
  text-align: center;
  margin-bottom: 10px;

  @include respond-to('small') {
    font-size: 26px;
    letter-spacing: 3.5px;
    line-height: 1.14;
    margin-bottom: 5px;
  }
}

.subtitle-homepage {
  font-size: 54px;
  font-family: BoldItalic;
  letter-spacing: 10px;
  text-transform: uppercase;
  line-height: 1;
  text-align: center;
  margin-bottom: 21px;

  @include respond-to('small') {
    font-size: 26px;
    letter-spacing: 3.5px;
    line-height: 1.14;
    margin-bottom: 15px;
  }
}

.title-collection {
  font-family: Bold;
  font-size: 48px;
  letter-spacing: 8px;
  line-height: 1;
  text-transform: uppercase;
  text-align: center;
}

.subtitle-collection {
  font-family: Regular;
  font-size: 14px;
  line-height: 1.29;
  letter-spacing: 0.5px;
  text-align: center;
  margin-bottom: 25px;
  margin-top: 10px;
}

.superHeading {
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 15px;
  font-family: 'Bold';
}

.shortDescription {
  max-width: 840px;
  margin: 0 auto 40px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Regular';
}

[data-gradient='yes'] {
  position: relative;
  &::after {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: '';
    background-image: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(0%, #0381a2),
      color-stop(100%, #554d99)
    );
    background-image: linear-gradient(to right, #0381a2 0%, #554d99 100%);
    background-repeat: repeat-x;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FF0381A2', endColorstr='#FF554D99', GradientType=1);
    opacity: 0.7;
  }
  .hero-body {
    position: relative;
    z-index: 2;
  }
}
</style>
