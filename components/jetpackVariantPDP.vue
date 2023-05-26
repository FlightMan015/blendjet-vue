<template>
  <transition name="fade">
    <div class="pdp-container" v-if="product && jetpacks.length">
      <div class="product-select">
        <div class="hidden-product-price" v-show="false">
          <product-price
            :price="currentVariant.price"
            @DisplayPrice="setDisplayPrice"
            @Currency="setCurrency"
          />
        </div>
        <div class="product-select__controls__mobile-title-container">
          <!-- Cross-Sell Link (links to Protein from Original, and vice versa) -->
          <nuxt-link :to="crossSell.url" v-if="crossSell.url && crossSell.text">
            <div
              class="inner-text"
              style="color: #373975;height: 50px;border: 2px solid #373975;border-radius: 200px;margin-top:35px;background-color: lightyellow;line-height: 46px;text-align: center;font-family: Bold;letter-spacing: 1.75px;font-size: 12px;margin-bottom: -35px;text-transform: uppercase;cursor: pointer;max-width: 360px;margin: 30px auto 30px auto;"
            >
              {{ crossSell.text }}
            </div>
          </nuxt-link>

          <div class="product-select__controls__title">
            {{ currentVariant.title }}
          </div>
          <div class="product-select__controls__category">
            <h1>{{ jetpackCategory }}</h1>
          </div>
          <div class="product-select__controls__rating" style="zoom:1.25">
            <n-link :to="{ path: `/products/${product.handle}`, hash: '#reviews' }">
              <!-- TODO: Change to be variant based -->
              <loox-product-rating :product="product" />
            </n-link>
          </div>
        </div>
        <div class="product-select__image-carousel">
          <transition name="fade" mode="out-in">
            <img
              class="product-select__image-carousel__img"
              :src="optimizeSource({ url: productImage })"
            />
          </transition>
        </div>
        <div class="product-select__controls">
          <div class="product-select__controls__container">
            <div class="product-select__controls__title-container">
              <!-- Cross-Sell Link (links to Protein from Original, and vice versa) -->
              <nuxt-link :to="crossSell.url" v-if="crossSell.url && crossSell.text">
                <div
                  class="inner-text"
                  style="color: #373975;height: 50px;border: 2px solid #373975;border-radius: 200px;margin-top:35px;background-color: lightyellow;line-height: 46px;text-align: center;font-family: Bold;letter-spacing: 1.75px;font-size: 12px;margin-bottom: -35px;text-transform: uppercase;cursor: pointer;"
                >
                  {{ crossSell.text }}
                </div>
              </nuxt-link>

              <div class="product-select__controls__title">
                {{ currentVariant.title }}
              </div>
              <div class="product-select__controls__category">
                <h1>{{ jetpackCategory }}</h1>
              </div>
              <div class="product-select__controls__rating" style="zoom:1.25">
                <n-link
                  :to="{
                    path: `/products/${product.handle}`,
                    hash: '#reviews'
                  }"
                >
                  <!-- TODO: Change to be variant based -->
                  <loox-product-rating :product="product" />
                </n-link>
              </div>
            </div>
            <div class="product-select__controls__option-select">
              <div class="jetpack-dropdown-container">
                <JetpackVariantsDropdown
                  :items="jetpacks"
                  :currentVariant="currentVariant"
                  @update="updateJetpack"
                />
              </div>
            </div>
            <div class="product-select__controls__add-to-cart">
              <div class="product-select__controls__add-to-cart__subscribe-select">
                <SubscriptionToggle
                  :value.sync="isSubscriptionActive"
                  :product="productData"
                  :variant="currentVariant"
                />
                <div
                  class="product-select__controls__add-to-cart__subscribe-select__about"
                  @click="$modal.show('about-subscriptions')"
                >
                  <div>How do subscriptions work?</div>
                  <div class="product-select__controls__add-to-cart__subscribe-select__about__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18"
                      viewBox="0 0 24 24"
                      width="18"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path
                        fill="#373975"
                        d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="product-select__controls__add-to-cart__quantity-add-button">
                <div class="product-select__controls__add-to-cart__quantity-add-button__quantity">
                  <quantity-selector :quantity.sync="quantity" />
                </div>
                <div
                  class="product-select__controls__add-to-cart__quantity-add-button__quantity__add-to-cart"
                >
                  <SubscriptionAddToCartButton
                    :product="productData"
                    :variant="currentVariant"
                    :metafields="productData.metafields"
                    :all-options-selected="true"
                    :only-one-option="true"
                    :quantity="quantity"
                    :showPrice="true"
                    :isSubscriptionOn="isSubscriptionActive"
                    :styleObj="{
                      height: '50px',
                      marginRight: '6px'
                    }"
                  />
                </div>
              </div>
            </div>
            <div class="product-select__controls__shipping-notification">
              <!-- TODO: Change to use contentful -->
              <ShippingTime :product="'jetpack'" :country="country" />
            </div>
            <hr class="product-select__controls__divider" />

            <div class="product-select__controls__value-props">
              <div
                class="product-select__controls__value-props__guarantee"
                @click="$modal.show('guarantee-modal')"
              >
                <Guarantee :size="'40px'" />
                <span class="product-select__controls__value-props__guarantee__text"
                  >30 day money back guarantee</span
                >
              </div>
              <div class="product-select__controls__value-props__badges">
                <a
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  class="product-select__controls__value-props__badges__img"
                  :href="mcafeeLink"
                >
                  <img
                    :src="optimizeSource({ url: '/images/blendjetPDP/TrustedSite.svg' })"
                    alt="TrustedSite Seal" style="border: 1px solid #ccc;border-radius: 3px;"
                  />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  class="product-select__controls__value-props__badges__img"
                  :href="nortonLink"
                >
                  <img
                    :src="optimizeSource({ url: '/images/blendjetPDP/nortonsiteseal.svg' })"
                    alt="Norton Secured Logo"
                  />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  class="product-select__controls__value-props__badges__img"
                  :href="bbbLink"
                >
                  <img
                    :src="optimizeSource({ url: '/images/blendjetPDP/BBB-Seal.svg' })"
                    alt="Better Business Bureau Logo"
                  />
                </a>
              </div>
            </div>
            <hr class="product-select__controls__divider" />
            <div class="product-select__controls__made-in-ca">
              <svg
                width="314px"
                height="67px"
                viewBox="0 0 314 67"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>made in california</title>
                <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="D-BlendJet-PDP-JetPack" transform="translate(-1031.000000, -826.000000)">
                    <g id="BUY" transform="translate(0.000000, 109.000000)">
                      <g id="made-in-california" transform="translate(1031.000000, 717.000000)">
                        <path
                          d="M295,15.5 C299.280207,15.5 303.155207,17.2348966 305.960155,20.0398449 C308.765103,22.8447932 310.5,26.7197932 310.5,31 C310.5,35.2802068 308.765103,39.1552068 305.960155,41.9601551 C303.155207,44.7651034 299.280207,46.5 295,46.5 L295,46.5 L19,46.5 C14.7197932,46.5 10.8447932,44.7651034 8.03984489,41.9601551 C5.23489659,39.1552068 3.5,35.2802068 3.5,31 C3.5,26.7197932 5.23489659,22.8447932 8.03984489,20.0398449 C10.8447932,17.2348966 14.7197932,15.5 19,15.5 L19,15.5 L295,15.5 Z"
                          id="Rectangle"
                          stroke-opacity="0.5"
                          stroke="#8291ED"
                        ></path>
                        <path
                          d="M295,12.5 C300.108634,12.5 304.733634,14.570683 308.081475,17.9185245 C311.429317,21.2663661 313.5,25.8913661 313.5,31 C313.5,36.1086339 311.429317,40.7336339 308.081475,44.0814755 C304.733634,47.429317 300.108634,49.5 295,49.5 L295,49.5 L19,49.5 C13.8913661,49.5 9.26636606,47.429317 5.91852455,44.0814755 C2.57068303,40.7336339 0.5,36.1086339 0.5,31 C0.5,25.8913661 2.57068303,21.2663661 5.91852455,17.9185245 C9.26636606,14.570683 13.8913661,12.5 19,12.5 L19,12.5 Z"
                          id="Rectangle"
                          stroke="#373795"
                        ></path>
                        <polygon
                          id="Rectangle"
                          fill="#F6F5FD"
                          points="110 11 145 11 145 18 114 18"
                        ></polygon>
                        <polygon
                          id="Rectangle"
                          fill="#F6F5FD"
                          points="127 43 171 43 178 50 132 50"
                        ></polygon>
                        <polygon
                          id="Fill-1"
                          fill-opacity="0.5"
                          fill="#8291ED"
                          points="139.358007 0 138.5783 1.4160597 138.056089 0 116.18821 0 116.187007 1.4160597 116.970323 5.11231227 116.187007 8.50320734 115 11.056795 115.521609 13.1520611 118.71263 18.0434886 119.234239 22.7950795 122.833162 26.206522 124.221112 29.1704874 126.720866 30.0369036 129.559936 33.4991439 126.116232 31.5505635 127.777921 36.0099244 130.044846 36.7210935 129.559936 39.2507092 130.044846 41.4275942 137.273976 49.2858409 137.795585 53.3005784 145.076456 54.2845715 146.095007 55.9198037 150.268483 56.9197782 150.790092 58.6286386 152.24422 58.6286386 157.155288 62.7541039 158.156995 67 171.984752 65.2860027 174.029677 64.4310017 172.763857 62.7541039 172.506361 60.7632872 173.508068 59.8580592 173.508068 57.1652057 176 54.9643487 174.290782 54.0402856 172.764459 50.0147035 141.011875 22.171237 140.173811 21.5576682 141.011875 20.3550734 141.011875 0"
                        ></polygon>
                        <g id="Group-5" transform="translate(23.000000, 21.000000)" fill="#373795">
                          <text
                            id="made-with"
                            font-family="Helvetica"
                            font-size="14"
                            font-weight="normal"
                            line-spacing="15"
                            letter-spacing="1.75"
                          >
                            <tspan x="34.2421875" y="7.2978516">MADE</tspan>
                            <tspan x="38.9248047" y="22.2978516">WITH</tspan>
                          </text>
                          <text
                            id="in-california"
                            font-family="Helvetica"
                            font-size="14"
                            font-weight="normal"
                            line-spacing="15"
                            letter-spacing="1.75"
                          >
                            <tspan x="188.506836" y="7">IN</tspan>
                            <tspan x="146.5" y="22">CALIFORNIA</tspan>
                          </text>
                          <path
                            d="M132.465684,0.484007284 C128.152422,-1.51502146 125.100145,3.3525853 125.100145,3.3525853 C125.100145,3.3525853 122.047838,-1.51502146 117.734607,0.4801781 C114.361054,2.04439976 113.118003,6.40892314 114.935949,9.776658 C116.361252,12.423403 119.318167,15.7748476 124.914368,19.9353533 C125.024285,20.0215489 125.176478,20.0215489 125.286386,19.9353533 C130.882588,15.7751721 133.839316,12.4236626 135.264805,9.78185012 C137.082658,6.41249271 135.836144,2.04819649 132.466147,0.484072185 L132.465684,0.484007284 Z"
                            id="Fill-1"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <modal name="guarantee-modal" width="414px" height="auto" :adaptive="true">
            <div class="guarantee-modal__container">
              <div slot="top-right" @click="$modal.hide('guarantee-modal')">
                <Close />
              </div>
              <Guarantee />
              <div class="guarantee-modal__container__heading">
                30-day Money Back Guarantee
              </div>
              <div class="guarantee-modal__container__text">
                We believe in 100% customer satisfaction and that is why we are offering all
                customers a 30 day money-back guarantee! If you are not satisfied with your BlendJet
                blender, you may return the item within 30 days from the order date for a full
                refund. If you don't like your product, get a full refund within 30 days, no
                questions asked. <br />
                — <br />
                Please
                <a class="guarantee-modal__container__text__contact-link"
                  >contact our customer happiness</a
                >
                team to start your return process.
              </div>
            </div>
          </modal>

          <modal name="about-subscriptions" height="auto" width="494px" :adaptive="true">
            <div class="about-subscriptions__container">
              <div slot="top-right" @click="$modal.hide('about-subscriptions')">
                <Close />
              </div>
              <div class="about-subscriptions__heading">
                Get Delicious On Demand <br />
                And save 25%
              </div>
              <div class="about-subscriptions__column">
                <div class="about-subscriptions__icon">
                  <svg
                    width="70px"
                    height="70px"
                    viewBox="0 0 70 70"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <title>Group 2</title>
                    <defs>
                      <linearGradient
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="98.7331081%"
                        id="linearGradient-1"
                      >
                        <stop stop-color="#1E90BB" offset="0%"></stop>
                        <stop stop-color="#373795" offset="100%"></stop>
                      </linearGradient>
                    </defs>
                    <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g
                        id="D-BlendJet-PDP-JetPack-Copy"
                        transform="translate(-685.000000, -289.000000)"
                      >
                        <g id="Group-4" transform="translate(472.000000, 170.000000)">
                          <g id="Portable" transform="translate(113.000000, 120.000000)">
                            <g id="Group-2" transform="translate(101.000000, 0.000000)">
                              <circle
                                id="Oval-Copy"
                                stroke="#373795"
                                stroke-width="1.5"
                                cx="34"
                                cy="34"
                                r="34"
                              ></circle>
                              <circle
                                id="Oval-Copy"
                                fill="url(#linearGradient-1)"
                                cx="34"
                                cy="34"
                                r="30"
                              ></circle>
                              <text
                                id="30"
                                font-family="Helvetica"
                                font-size="26"
                                font-weight="normal"
                                line-spacing="14"
                                fill="#FFFFFF"
                              >
                                <tspan x="19" y="37">30</tspan>
                              </text>
                              <text
                                id="DAYS"
                                font-family="Helvetica"
                                font-size="11"
                                font-weight="normal"
                                line-spacing="14"
                                fill="#FFFFFF"
                              >
                                <tspan x="19" y="47">DAYS</tspan>
                              </text>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div class="about-subscriptions__text">
                  AUTOMATICALLY DELIVERED <br />
                  EVERY 30 DAYS
                </div>
                <div class="about-subscriptions__icon">
                  <svg
                    width="70px"
                    height="70px"
                    viewBox="0 0 70 70"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <title>Group 2</title>
                    <defs>
                      <linearGradient
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="98.7331081%"
                        id="linearGradient-1"
                      >
                        <stop stop-color="#1E90BB" offset="0%"></stop>
                        <stop stop-color="#373795" offset="100%"></stop>
                      </linearGradient>
                    </defs>
                    <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g
                        id="D-BlendJet-PDP-JetPack-Copy"
                        transform="translate(-685.000000, -438.000000)"
                      >
                        <g id="Group-4" transform="translate(472.000000, 170.000000)">
                          <g id="Portable-Copy" transform="translate(113.000000, 269.000000)">
                            <g id="Group-2" transform="translate(101.000000, 0.000000)">
                              <circle
                                id="Oval-Copy"
                                stroke="#373795"
                                stroke-width="1.5"
                                cx="34"
                                cy="34"
                                r="34"
                              ></circle>
                              <circle
                                id="Oval-Copy"
                                fill="url(#linearGradient-1)"
                                cx="34"
                                cy="34"
                                r="30"
                              ></circle>
                              <path
                                d="M44.16,22.2928932 L45.7071068,23.84 L36.0471068,33.5 L45.7071068,43.16 L44.1599817,44.7071251 L34.5,35.0461434 L24.8400183,44.7071251 L23.2929115,43.1600183 L32.9528932,33.4990366 L23.2928749,23.8400183 L24.84,22.2928932 L34.5,31.9528932 L44.16,22.2928932 Z"
                                id="Ham___Mobile_2"
                                stroke="#FFFFFF"
                                fill="#FFFFFF"
                                stroke-linejoin="round"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div class="about-subscriptions__text">
                  NO STRINGS ATTACHED <br />
                  CANCEL ANYTIME
                </div>
                <div class="about-subscriptions__icon">
                  <svg
                    width="70px"
                    height="70px"
                    viewBox="0 0 70 70"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <title>Group 2</title>
                    <defs>
                      <linearGradient
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="98.7331081%"
                        id="linearGradient-1"
                      >
                        <stop stop-color="#1E90BB" offset="0%"></stop>
                        <stop stop-color="#373795" offset="100%"></stop>
                      </linearGradient>
                    </defs>
                    <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g
                        id="D-BlendJet-PDP-JetPack-Copy"
                        transform="translate(-685.000000, -588.000000)"
                      >
                        <g id="Group-4" transform="translate(472.000000, 170.000000)">
                          <g id="Portable-Copy-2" transform="translate(93.000000, 419.000000)">
                            <g id="Group-2" transform="translate(121.000000, 0.000000)">
                              <circle
                                id="Oval-Copy"
                                stroke="#373795"
                                stroke-width="1.5"
                                cx="34"
                                cy="34"
                                r="34"
                              ></circle>
                              <circle
                                id="Oval-Copy"
                                fill="url(#linearGradient-1)"
                                cx="34"
                                cy="34"
                                r="30"
                              ></circle>
                              <path
                                d="M55.6609355,29.0887521 C55.4439559,28.8708588 55.1496012,28.7484382 54.8426666,28.7484382 C54.535732,28.7484382 54.2413773,28.8708588 54.0243977,29.0887521 L49.9567895,33.1711748 L49.9567895,32.5392549 C49.9567895,23.41941 42.564682,16 33.4783959,16 C24.3921098,16 17,23.4194065 17,32.5392514 C17,41.7770723 24.3921075,49.2926829 33.4783924,49.2926829 C37.8511133,49.3047352 42.0468827,47.5603041 45.1302435,44.4482522 C45.5817098,43.9945884 45.5814958,43.2595498 45.1297654,42.8061509 C44.6780349,42.352752 43.9457012,42.3525372 43.4937068,42.805671 C40.843304,45.480434 37.2368968,46.9797534 33.4783959,46.9694131 C25.6686786,46.9694131 19.3146638,40.4960767 19.3146638,32.5392537 C19.3146638,24.6879483 25.6559829,18.3232078 33.4783965,18.3232078 C41.30081,18.3232078 47.6421291,24.6879483 47.6421291,32.5392537 L47.6421291,33.1711748 L43.5745197,29.0887556 C43.1226016,28.6351693 42.3898985,28.6351701 41.9379813,29.0887573 C41.4860642,29.5423446 41.486065,30.277754 41.9379831,30.7313402 L47.9804491,36.7961228 C48.0346724,36.8504135 48.0941085,36.8991928 48.157891,36.9417497 C48.1854042,36.9601832 48.2151788,36.972732 48.2437869,36.9885426 C48.3135337,37.034337 48.3910952,37.0668317 48.4725818,37.0843971 C48.5060645,37.094359 48.53817,37.1073329 48.5728876,37.1142503 C48.7223985,37.1448315 48.8765189,37.1448315 49.0260298,37.1142503 C49.0607497,37.1073376 49.0928529,37.0943636 49.1263356,37.0843971 C49.2078225,37.0668314 49.2853843,37.0343368 49.3551317,36.9885426 C49.3837398,36.972732 49.4135132,36.9601832 49.4410264,36.9417497 C49.5048093,36.8991928 49.5642458,36.8504135 49.6184695,36.7961228 L55.6609355,30.7313402 C55.8780288,30.513559 56,30.2181159 56,29.9100462 C56,29.6019765 55.8780288,29.3065334 55.6609355,29.0887521 L55.6609355,29.0887521 Z"
                                id="Path"
                                fill="#FFFFFF"
                                fill-rule="nonzero"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div class="about-subscriptions__text">
                  UPDATE YOUR SUBSCRIPTION <br />
                  WHEN YOU WANT
                </div>
              </div>
            </div>
          </modal>
        </div>
      </div>

      <div v-if="headerText" class="blendjet-banner">
        <div class="blendjet-banner__content-block">
          <RichTextRenderer :document="headerText" />
        </div>
      </div>

      <div class="media-content">
        <div class="media-content__carousel__container">
          <b-carousel
            class="media-content__carousel"
            :arrow="true"
            :arrow-hover="false"
            :repeat="true"
            :indicator="true"
            :autoplay="false"
            :has-drag="true"
          >
            <b-carousel-item v-for="(image, i) in heroImages" :key="i">
              <img class="media-content__carousel__img" :src="image" />
            </b-carousel-item>
          </b-carousel>
        </div>
        <div class="media-content__main" v-if="features">
          <div class="media-content__main__features">
            <JetpackFeaturesPDP
              :content="features.fields.description"
              :title="features.fields.title"
            />
          </div>
          <div class="media-content__main__details" v-if="loaded && productDescription">
            <ProductMediaTile
              class="media-content__main__details__content-block"
              v-for="(section, i) of productDescription"
              :key="i"
              :title="section.fields.heading"
              :text="section.fields.text"
              :contentful-media="section.fields.video"
              :external-media-url="section.fields.externalVideoUrl"
            />
          </div>
        </div>
      </div>

      <!-- JETPACKS CROSS-SELL -->
      <!-- TODO: THIS COMPONENT SHOULD BE VARIANT BASED -->
      <div class="reviews" id="reviews">
        <loox-product-reviews :product="product" />
      </div>

      <div class="jetpacks">
        <!-- TODO: Make this dynamic using contentful -->
        <JetpackCrossSell :product="product" :heading="'You may also like these'" />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import ProductTitle from '~/components/nacelle/ProductTitle'
import ProductPrice from '~/components/nacelle/ProductPrice'
const JetpackCrossSell = () => import('~/components/jetpackCrossSellVariants')
import ModelIcon from '~/components/ModelIcon'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

import JetpackFeaturesPDP from '~/components/JetpackFeaturesPDP'
const VideoContainer = () => import('~/components/VideoContainer')
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import SubscriptionSelect from '~/components/subscriptionSelect'
import SubscriptionToggle from '~/components/subscriptionToggle'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton'
import JetpackVariantsDropdown from '~/components/jetpackVariantsDropdown'
import ShippingTime from '~/components/shippingTime'
import ProductMediaTile from '~/components/ProductMediaTile'

import imageOptimize from '~/mixins/imageOptimize'

import Guarantee from '~/components/svg/30dayGuarantee'
import Close from '~/components/svg/modalClose'
import Info from '~/components/svg/info'
import CaretDown from '~/components/svg/caretDown'

import { createClient } from '~/plugins/contentful.js'

export default {
  data() {
    return {
      imageStyle: {},
      currentVariant: null,
      productImage: null,
      heroImages: [],
      imgWidth: 0,
      isSubscriptionActive: true, // whether the subscription toggle is active or not
      loaded: false,
      ratingCount: '9,881',
      shippingTime: 'saturday, October 23rd',
      shippingCountdown: '1 hr, 23 minutes',
      jetpackMenuVisible: false,
      frequency: null,
      quantity: 1,
      jetpacks: [],
      productData: { ...this.product },
      pageData: { ...this.page },
      headerText: null,
      productDescription: null,
      features: null,
      media: {},
      bannerText: '',
      description: {},
      client: null,
      jetpackCategory: 'Jetpack Smoothie',
      addToCartWidth: '260px',
      screenWidth: 0,
      currency: 'USD',
      displayPrice: '0',
      mcafeeLink: 'https://www.trustedsite.com/verify?host=blendjet.com',
      nortonLink:
        'https://seal.digicert.com/seals/popup/?tag=6CDZP5Ti&url=blendjet.com',
      bbbLink:
        'https://www.bbb.org/us/ca/concord/profile/online-shopping/blendjet-1116-882016/#sealclick',
      metaTitle: null,
      metaDescription: null
    }
  },
  components: {
    ProductTitle,
    ProductPrice,
    VideoContainer,
    QuantitySelector,
    SubscriptionAddToCartButton,
    SubscriptionSelect,
    SubscriptionToggle,
    JetpackCrossSell,
    JetpackFeaturesPDP,
    JetpackVariantsDropdown,
    ShippingTime,
    Guarantee,
    Close,
    Info,
    ModelIcon,
    RichTextRenderer,
    CaretDown,
    ProductMediaTile
  },
  mixins: [imageOptimize],
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    country: {
      type: Object,
      default: () => {}
    },
    page: {
      type: Object,
      default: () => {}
    }
  },
  head() {
    let productCurrency = this.currency
    let productPrice = this.displayPrice
    let image = this.productImage
    let name = this.product.title
    let properties = {}
    let meta = []
    let script = [
      {
        type: 'application/ld+json',
        json: {
          '@context': 'http://schema.org',
          '@type': 'Product',
          name: `${name}`,
          image: [`${image}`],
          offers: {
            '@type': 'Offer',
            url: 'https://blendjet.com/products/blendjet-2',
            itemCondition: 'http://schema.org/NewCondition',
            availability: 'http://schema.org/InStock',
            price: `${productPrice}`,
            priceCurrency: `${productCurrency}`
          }
        }
      }
    ]

    if (this.metaTitle) {
      properties.title = this.metaTitle
    } else {
      properties.title = name
    }

    if (this.metaDescription) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: this.metaDescription
      })
    }

    if (image && productCurrency && productPrice) {
      return {
        ...properties,
        meta,
        script
      }
    }
  },
  computed: {
    ...mapState('user', ['locale'])
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    setDefaultVariant() {
      if (this.currentVariant) {
        return this.currentVariant
      } else if (this.product && this.product.variants && this.product.variants.length) {
        return this.product.variants[0]
      }
      return undefined
    },
    formatList() {
      for (let i = 0; i < this.jetpacks.length; i++) {
        if (this.jetpacks[i].title === this.initialProduct.title) {
          this.jetpacks.splice(i, 1)
          this.jetpacks.unshift(this.initialProduct)
        }
      }
    },
    async updateJetpack(selectedVariant) {
      this.currentVariant = selectedVariant
      this.addHashToLocation()

      await this.getMedia()
    },
    toggleJetpackMenu() {
      this.jetpackMenuVisible = !this.jetpackMenuVisible
    },
    formatTitle(title) {
      return title.replace(/\s/g, '')
    },
    camelize(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
    },
    handleJetpackMenu() {
      this.jetpackMenuVisible ? (this.jetpackMenuVisible = !this.jetpackMenuVisible) : null
    },
    setImages() {},
    setDisplayPrice(data) {
      this.displayPrice = data
    },
    setCurrency(data) {
      this.currency = data
    },
    addHashToLocation() {
      window.history.pushState(
        {},
        null,
        this.$route.path + '?variant=' + this.formatVariantId(this.currentVariant.id)
      )
    },
    formatVariantId(value) {
      const url = atob(value)
      return url.replace('gid://shopify/ProductVariant/', '')
    },
    setCurrentVariant() {
      const variantId = this.$route.query.variant
      const variants = this.product.variants.map(variant => {
        variant['formatedId'] = this.formatVariantId(variant.id)
        return variant
      })
      const variant = variants.filter(variant => {
        return variant.formatedId === variantId
      })

      if (variant.length > 0) this.currentVariant = variant[0]
    },
    getPageHandle(title) {
      let handle = title.replace(/\s+/g, '-')
      let handlesufix = this.product.handle.includes('protein')
        ? '-protein-smoothie'
        : '-jetpack-ready-to-blend-smoothie'
      handle = handle + handlesufix
      return handle.toLowerCase()
    },
    async getMedia() {
      let key = this.camelize(this.formatTitle(this.currentVariant.title))
      this.productImage = this.media[key].productImage
      this.heroImages = this.media[key].heroImages
      this.bannerText = this.media[key].bannerText
      await this.getPageInfo(this.currentVariant)
      this.loaded = true
    },
    async getPageInfo(variant) {
      // TODO we should get this using nacelle content
      await this.client
        .getEntries({
          content_type: 'product',
          'fields.handle': this.getPageHandle(variant.title)
        })
        .then(res => {
          let something = res.items[0]
          this.headerText = something.fields.headerText
          this.productDescription = something.fields.productDescription
          this.features = something.fields.features
        })
    },
    createUUID() {
        var result = ''
        var length = 16
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
        return result
    },
    elevarProductView() {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var variant = this.currentVariant
      var referrer = document.referrer.includes('marketplace') ? document.referrer : '';
      var productId = Buffer.from(this.product.pimSyncSourceProductId, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      var variantId = Buffer.from(variant.id, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      window.dataLayer.push({
        "event": "dl_view_item",
        "event_id": uuid,
        "ecommerce": {
          "currencyCode": this.product.priceRange.currencyCode,
          "detail": {
            "actionField": {'list': referrer}, 
            "products": [{
              "name": this.product.title.replace("'", ''),
              "id": ((variant && variant.sku) || ""),
              "product_id": productId,
              "variant_id": ((variant && variantId) || ""),
              "image": this.product.featuredMedia.src,
              "price": variant.price,
              "brand": this.product.vendor.replace("'", ''),
              "variant": (variant && variant.title && (variant.title.replace("'", '')) || ""),
              "category": this.product.productType,
              "inventory": this.quantity,
              "list": referrer, 
            }]
          }
        }
      })
      // console.log('wdl_pv:', window.dataLayer)
    }
  },
  watch: {
    currentVariant(newVariant) { 
      this.elevarProductView()
    },
    quantity() {
      // Outsmartly discussed with John and both agreed it doesn't make sense to fire a "ViewContent"
      // event just because quantity changed. Removing this as noise.
      // this.elevarProductView()
    }  
  },
  
  async mounted() {
    this.screenWidth = screen.innerWidth
    this.client = createClient()

    // Gets variants of the products
    if (this.product && this.product.availableForSale) {
      this.jetpacks = this.product.variants.filter(variant => {
        return variant.availableForSale
      })
    } else {
      //TODO: SHOW 404 PAGE
    }

    //todo decide which variant will be displayed
    this.setCurrentVariant()
    this.currentVariant = this.setDefaultVariant()

    const vm = this
    // TODO we should get this using nacelle content
    const isProteinJetPack = this.product.handle.includes('protein')
    const PROTEIN_CONTENT = '24QNVJ9UR9oYvUmQ8EzvFs'
    const SMOOTHIE_CONENT = '6L3Tl2qpSUZLV3i2I3thFQ'
    let contentId = isProteinJetPack ? PROTEIN_CONTENT : SMOOTHIE_CONENT

    // Assemble cross sell link data
    this.crossSell = {
      url: isProteinJetPack ? '/products/jetpack-smoothies' : '/products/jetpack-protein-smoothie',
      text: isProteinJetPack
        ? 'Try Our Original JetPack Smoothies'
        : 'Try our NEW Protein Smoothies'
    }

    // Fetch Contentful data
    await this.client
      .getEntry(contentId)
      .then(async entry => {
        entry.fields.variants.forEach(node => {
          vm.media[node.fields.title] = {
            productImage: `https:${node.fields.productImage.fields.file.url}?w=2100`,
            heroImages: node.fields.heroImages.map(image => {
              return `${image.fields.file.url}?w=2100`
            }),
            bannerText: node.fields.description
          }
          vm.bannerText = node.fields.description

          vm.description = entry.fields.productDescription.map(node => {
            return {
              heading: node.fields.heading,
              text: node.fields.text.content.map(p => {
                return p.content.map(line => {
                  return line.value
                })
              }),

              video: node.fields.video ? node.fields.video.fields.file.url : ''
            }
          })
        })
        if (entry.fields.metaTitle) {
          this.metaTitle = entry.fields.metaTitle
        }
        if (entry.fields.metaDescription) {
          this.metaDescription = entry.fields.metaDescription
        }

        await this.getMedia()
        this.loaded = true
      })
      .catch(console.error)
    this.currentVariant = this.setDefaultVariant()
  }
}
</script>

<style lang="scss" scoped>
.pdp-container {
}

.product-select {
  display: flex;
  flex-flow: row wrap;

  @include respond-to('small') {
    height: auto;
  }

  &__image-carousel {
    background-image: linear-gradient(to bottom, #ededf5 1%, #ffffff 49%);
    width: 65%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 848px;

    @include respond-to('small') {
      width: 100%;
      height: 290px;
    }

    &__img {
      width: 100%;
      height: 848px;
      object-position: center;
      object-fit: cover;
      @include respond-to('small') {
        height: 290px;
      }
    }
  }

  &__controls {
    width: 35%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background-color: $primary-purple-tint;
    text-align: center;
    height: 848px;
    @include respond-to('small') {
      width: 100%;
      padding: 0;
      height: auto;
    }

    &__container {
      max-width: 360px;
    }

    &__mobile-title-container {
      width: 100%;

      @media screen and (min-width: 768px) {
        display: none;
      }
    }

    &__title-container {
      @include respond-to('small') {
        display: none;
      }
    }

    &__title {
      font-family: Medium;
      font-size: 28px;
      line-height: 1.14;
      letter-spacing: 3.5px;
      margin-top: 75px;
      color: $primary-purple;
      margin-bottom: 7px;
      text-transform: uppercase;
      text-align: center;

      @include respond-to('small') {
        font-size: 24px;
        line-height: 1.17;
        margin-top: 4px;
        margin-bottom: 4px;
      }
    }

    &__category {
      font-family: Bold;
      text-align: center;
      text-transform: uppercase;
      color: $primary-purple;
      font-size: 18px;
      line-height: 0.83;
      letter-spacing: 3.5px;
      @include respond-to('small') {
        font-size: 12px;
        line-height: 1.25;
        letter-spacing: 1.75px;
      }
    }

    &__rating {
      display: flex;
      justify-content: center;
      font-family: Regular;
      font-size: 13px;
      color: $primary-purple;
      margin-top: 14px;
      margin-bottom: 42px;
      @include respond-to('small') {
        margin-bottom: 30px;
      }

      & > a {
        color: $primary-purple;
      }
    }

    &__price {
      color: $primary-purple;
      font-family: Bold;
      font-size: 18px;
      line-height: 0.83;
      letter-spacing: 3.5px;
      margin-bottom: 52px;
      @include respond-to('small') {
        font-size: 14px;
        line-height: 1.07;
        letter-spacing: 2.04px;
        margin-bottom: 18px;
      }

      &__installments {
        font-size: 13px;
        font-family: Regular;
        line-height: 1.38;
        letter-spacing: 0.46px;
        margin-top: 13px;
        display: flex;
        justify-content: center;
        align-items: center;
        @include respond-to('small') {
          margin-top: 6px;
        }

        &__logo {
          height: 15px;
          margin-top: 4px;
          margin-left: 7px;
        }
      }
    }

    &__option-select {
      margin-bottom: 20px;

      &__text {
        font-family: Bold;
        font-size: $text-small;
        text-transform: uppercase;
        line-height: 1.33;
        letter-spacing: 1.75px;
        margin-bottom: 20px;
      }

      &__label {
        color: $grayscale-gray;
      }

      &__selected-color {
        color: $primary-purple;
      }

      &__swatches {
        margin-bottom: 20px;
      }
    }

    &__add-to-cart {
      margin-bottom: 24px;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      &__subscribe-select {
        margin-bottom: 17px;

        &__about {
          margin-top: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Regular;
          font-size: 13px;
          line-height: 1.38;
          letter-spacing: 0.46px;
          color: $primary-purple;
          cursor: pointer;

          &__icon {
            margin-left: 7px;
            display: flex;
            align-items: center;
          }
        }
      }
      &__quantity-add-button {
        display: flex;
        justify-content: center;
        align-items: center;

        ::v-deep .add-to-cart-button {
          width: 260px;
        }
        @include respond-to('small') {
          position: fixed;
          bottom: 0;
          padding: 10px;
          z-index: 10;
          width: 100%;
          background-color: $grayscale-white;
        }

        &__quantity {
          margin-right: 6px;
        }
      }
    }

    &__shipping-notification {
      font-family: Bold;
      letter-spacing: 1.75px;
      text-align: center;
      line-height: 1.33;
      font-size: $text-small;
      margin-bottom: 20px;
      margin-top: 20px;
      text-transform: uppercase;

      &__label {
        color: $primary-purple;
      }

      &__countdown {
        color: $secondary-purple-2;
      }
    }

    &__divider {
      width: 100%;
      height: 1px;
      background-color: #7f7fd1;
    }

    &__value-props {
      display: flex;
      flex-flow: column nowrap;

      &__guarantee {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-bottom: 30px;

        &__text {
          margin-left: 15px;
          color: $primary-purple;
          text-transform: uppercase;
          font-family: Bold;
          font-size: $text-small;
          letter-spacing: 1.75px;
          line-height: 1.17;
        }
      }

      &__badges {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        &__img {
          &:first-child {
            margin-right: 15px;
          }
          &:last-child {
            margin-left: 15px;
          }
        }
      }
    }
  }
}

.guarantee-modal {
  &__container {
    padding: 40px;

    &__heading {
      color: $primary-purple;
      font-family: Medium;
      font-size: 24px;
      letter-spacing: 3.5px;
      line-height: 1.17;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 23px;
      margin-top: 8px;
    }

    &__text {
      font-family: Regular;
      font-size: 14px;
      line-height: 1.29;
      letter-spacing: 0.58px;
      text-align: center;
      color: #626262;
      margin-bottom: 27px;
    }
  }
}

.about-subscriptions {
  &__container {
  }

  &__heading {
    font-family: Medium;
    font-size: 22px;
    line-height: 1.14;
    letter-spacing: 3.21px;
    text-transform: uppercase;
    color: $primary-purple;
    margin-top: 40px;
    margin-bottom: 40px;
  }

  &__column {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  &__text {
    font-family: Bold;
    font-size: $text-small;
    line-height: 1.17;
    letter-spacing: 1.75px;
    color: $primary-purple;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 40px;
  }
}

.blendjet-banner {
  height: 310px;
  background-image: linear-gradient(to bottom, #7f80d9 0%, #474699 98%);
  display: flex;
  justify-content: center;
  align-items: center;

  &__content-block {
    width: 681px;
    color: $grayscale-white;
    text-align: center;
    font-family: Medium;

    @include respond-to('small') {
      width: auto;
      padding: 50px 27px;
    }

    h2 {
      font-size: 24px;
      line-height: 1.17;
      letter-spacing: 4px;
      margin-bottom: 15px;
      text-transform: uppercase;

      @include respond-to('small') {
        font-size: 18px;
        line-height: 1.22;
        letter-spacing: 2.5px;
      }
    }

    &__content {
      font-size: 16px;
      line-height: 1.25;
      letter-spacing: 0.5px;
    }
  }
}

.jetpack-dropdown-container {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.media-content {
  &__carousel {
    height: 800px;
    @include respond-to('small') {
      height: auto;
    }
    &__img {
      height: 800px;
      max-width: 100%;
      object-fit: cover;
      object-position: center;
      width: 100%;
      @include respond-to('small') {
        height: 400px;
      }
    }
  }

  &__main {
    display: flex;
    flex-flow: row wrap;

    &__features {
      background-image: linear-gradient(to bottom, #5555b1 0%, #474699 98%);

      width: 50%;
      padding: 50px;
      @include respond-to('small') {
        width: 100%;
        padding: 20px 0 0 0;
      }
    }

    &__details {
      width: 50%;
      background: $primary-purple-tint;
      padding-top: 50px;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      @include respond-to('small') {
        width: 100%;
      }

      &__content-block {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        margin-bottom: 80px;
        width: 520px;

        @include respond-to('small') {
          width: auto;
        }

        &__heading {
          font-size: 24px;
          font-family: Bold;
          letter-spacing: 4px;
          line-height: 1.17;
          text-transform: uppercase;
          text-align: center;
          color: $primary-purple;
          margin-bottom: 15px;
          @include respond-to('small') {
            font-size: 18px;
            line-height: 1.22;
            letter-spacing: 2.5px;
            padding: 0 10px;
          }
        }

        &__text {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.5px;
          line-height: 1.29;
          color: $grayscale-gray;
          text-align: center;
          margin-bottom: 35px;
          @include respond-to('small') {
            padding: 0 20px;
          }
        }

        &__image {
          display: flex;
          justify-content: center;
        }
      }

      &__specs {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        width: 520px;

        &__heading {
          font-size: 24px;
          font-family: Bold;
          letter-spacing: 4px;
          line-height: 1.17;
          text-transform: uppercase;
          text-align: center;
          color: $primary-purple;
          margin-bottom: 15px;
        }

        &__text {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.5px;
          line-height: 1.29;
          color: $grayscale-gray;
          text-align: center;
          margin-bottom: 35px;
        }

        &__list {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.5px;
          line-height: 1.29;
          color: $grayscale-gray;
          margin-bottom: 35px;
          & ul {
            list-style-type: square;
          }
          & li {
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}

.rounded-video-container {
  width: 520px;
  height: 520px;
  border-radius: 12px;
  overflow: hidden;

  @include respond-to('small') {
    width: auto;
    height: auto;
    border-radius: 0;
  }
}

.carousel {
  width: 100%;
}

.carousel-item {
  justify-content: center;
  display: flex;
}

//Reset h1
h1 {
  font-family: inherit;
  line-height: inherit;
  letter-spacing: inherit;
}
</style>
