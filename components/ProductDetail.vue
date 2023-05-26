<template>
  <transition name="fade">
    <div
      class="pdp-container"
      v-if="product && product.variants && product.variants.length"
      :style="{
        '--header-background': headerBackground,
        '--features-background': featuresBackground
      }"
    >
      <ProductStickyAddToCart
        :product="product"
        :variants="variants"
        :currentVariant.sync="currentVariant"
        :quantity.sync="quantity"
        :updateVariant="setSelectedVariant"
        :isSubscriptionOn="isSubscriptionActive"
        :optionsQty="allOptions.length"
      />

      <div class="product-select" :class="{ 'has-bundle': hasBundle }">
        <!-- TODO: Figure out what this component's purpose is...? -->
        <div class="hidden-product-price" v-show="false">
          <product-price
            :price="currentVariant.price"
            @DisplayPrice="setDisplayPrice"
            @Currency="setCurrency"
          />
          <afterpay-placement
            data-locale="en_US"
            :data-currency="currency"
            :data-amount="displayPrice"
            data-modal-theme="white"
            data-size="xs"
            data-logo-type="lockup"
          ></afterpay-placement>
        </div>

        <!-- MOBILE PRODUCT INFO - Title, Variant Title, Rating -->
        <div class="product-select__controls__mobile-title-container">
          <TabLinks :tab-items="jetpackCrossSell" v-if="isJetpack" class="tab-links" />
          <template v-if="isJetpack">
            <div class="product-select__controls__title">
              {{ currentVariant.displayName || currentVariant.title }}
            </div>
            <div class="product-select__controls__category">
              <h1>{{ product.title }}</h1>
            </div>
          </template>
          <template v-else>
            <div class="product-select__controls__title">
              <h1>{{ product.title }}</h1>
            </div>
            <div
              v-if="currentVariant.title !== 'Default Title' && !hasColorVariants"
              class="product-select__controls__category"
            >
              {{ currentVariant.title }}
            </div>
          </template>
          <div
            v-if="!product.title.includes('Replacement')"
            class="product-select__controls__rating"
            style="zoom:1.25"
          >
            <n-link :to="{ path: `/products/${product.handle}`, hash: '#reviews' }">
              <!-- TODO: Change to be variant based -->
              <loox-product-rating :product="product" />
            </n-link>
          </div>
        </div>

        <!-- GALLERY -->
        <div
          :class="[
            'product-select__image-carousel',
            { jetpack: isJetpack },
            { 'has-bundle': hasBundle }
          ]"
        >
          <div
            class="product-select__image-carousel__container"
            :class="[{ jetpack: isJetpack }, { 'has-bundle': hasBundle }]"
          >
            <div
              v-if="variants.length > 1 && isJetpack"
              class="product-select__image-carousel__prev-variant"
              @click="decrementVariant"
            >
              <PrevSlide />
            </div>
            <div
              v-if="variants.length > 1 && isJetpack"
              class="product-select__image-carousel__next-variant"
              @click="incrementVariant"
            >
              <NextSlide />
            </div>
            <transition name="fade" mode="out-in">
              <img
                :class="[
                  'product-select__image-carousel__img',
                  { jetpack: isJetpack },
                  { 'has-bundle': hasBundle }
                ]"
                :src="optimizeSource({ url: productImage, height: 1200 })"
                @mousedown.prevent="dragStart"
                @mousemove.prevent="dragProgress"
                @mouseleave.prevent="dragExit"
                @mouseup.prevent="dragEnd(incrementVariant, decrementVariant)"
                v-touch:swipe.right="decrementVariant"
                v-touch:swipe.left="incrementVariant"
              />
            </transition>
          </div>
        </div>

        <div
          :class="['product-select__controls', { jetpack: isJetpack }, { 'has-bundle': hasBundle }]"
        >
          <div class="product-select__controls__container">
            <!-- DESKTOP PRODUCT INFO - Title, Variant Title, Ratings -->
            <div class="product-select__controls__title-container">
              <TabLinks :tab-items="jetpackCrossSell" v-if="isJetpack" class="tab-links" />
              <template v-if="isJetpack">
                <div class="product-select__controls__title" :class="{ jetpack: isJetpack }">
                  {{ currentVariant.displayName || currentVariant.title }}
                </div>
                <div class="product-select__controls__category">
                  <h1>{{ product.title }}</h1>
                </div>
              </template>
              <template v-else>
                <div class="product-select__controls__title">
                  <h1>{{ product.title }}</h1>
                </div>
                <div
                  v-if="currentVariant.title !== 'Default Title' && !hasColorVariants"
                  class="product-select__controls__category"
                >
                  {{ currentVariant.title }}
                </div>
              </template>
              <div
                v-if="!product.title.includes('Replacement')"
                class="product-select__controls__rating"
                style="zoom:1.25"
              >
                <n-link
                  :to="{
                    path: `/products/${product.handle}`,
                    hash: '#reviews'
                  }"
                >
                  <loox-product-rating :product="product" />
                </n-link>
              </div>
            </div>

            <!-- VARIANT SELECTOR DROPDOWN MENU -->
            <div class="product-select__controls__option-select" v-if="product.variants.length > 1">
              <template v-if="hasColorVariants">
                <div class="product-select__controls__variant-color__text">
                  <span class="product-select__controls__variant-color__text__label">
                    Color:
                  </span>
                  <span class="product-select__controls__variant-color__text__selected-color">
                    {{ currentVariant.title }}
                  </span>
                </div>
                <product-options
                  :options="allOptions"
                  :variant="currentVariant"
                  :update="setSelectedOption"
                  :variants="variants"
                  @clear="selectedOptions = []"
                  :currentOption="currentOption"
                />
              </template>

              <div class="variant-dropdown-container" v-else>
                <CustomProductOptions
                  v-if="allOptions.length > 1"
                  :options="allOptions"
                  :variant="currentVariant"
                  :update="setSelectedOption"
                  :variants="variants"
                  @clear="selectedOptions = []"
                  :currentOption="currentOption"
                  :product="product"
                />
                <ProductVariantsDropdown
                  v-else
                  :with-variety-pack="withVarietyPack"
                  :variants="variants"
                  :currentVariant="currentVariant"
                  @update="setSelectedVariant"
                />
              </div>
            </div>

            <div class="product-select__controls__add-to-cart">
              <!-- SUBSCRIPTION TOGGLE -->
              <div
                class="product-select__controls__add-to-cart__subscribe-select"
                v-if="hasSubscription"
              >
                <SubscriptionToggle
                  :value.sync="isSubscriptionActive"
                  :product="productData"
                  :variant="currentVariant"
                />

                <!-- SUBSCRIPTION MODAL TRIGGER -->
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
              <div
                v-if="quantityOption.quantity.length"
                class="product-select__controls__quantity-set"
              >
                <div class="product-select__controls__quantity-set--label">
                  {{ quantityOption.title }}
                </div>
                <Tabs
                  :tabItems="quantityOption.quantity"
                  :selected="quantity"
                  :no-select-start="true"
                  @activeTab="updateQuantity"
                  id="custom-tabs"
                />
              </div>
              <div class="product-select__controls__add-to-cart__quantity-add-button">
                <!-- QUANTITY ADJUSTER -->
                <div class="product-select__controls__add-to-cart__quantity-add-button__quantity">
                  <quantity-selector :quantity.sync="quantity" />
                </div>
                <!-- ADD-TO-CART CTA -->
                <div
                  class="product-select__controls__add-to-cart__quantity-add-button__quantity__add-to-cart"
                >
                  <SubscriptionAddToCartButton
                    :product="productData"
                    :variant="currentVariant"
                    :variants="variants"
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

            <div
              v-if="selectedBundle.length || selectedBundleVarietyPack.length"
              class="product-select__controls__bundles"
            >
              <div
                v-if="page && page.fields.bundles"
                class="product-select__controls__bundles__title normal-size"
              >
                {{ bundleTitle }}
              </div>
              <div class="product-select__controls__bundles__bundle-products">
                <div
                  class="product-select__controls__bundles__bundle-product-container"
                  :class="{
                    blur: varietyBundleSelectorActive || bundleSelectorVisible
                  }"
                >
                  <img
                    v-if="
                      currentVariant &&
                        currentVariant.featuredMedia &&
                        !currentVariant.withVarietyPack
                    "
                    :src="currentVariant.featuredMedia.thumbnailSrc"
                    :alt="currentVariant.featuredMedia.altText"
                    class="product-select__controls__bundles__bundle-product-image"
                    :class="{
                      'item-blurred': varietyBundleSelectorActive || bundleSelectorVisible
                    }"
                    @click.self="bundleItemClicked(currentVariant, true)"
                  />
                  <template v-else v-for="(item, index) in variants">
                    <img
                      :key="index"
                      v-show="index === imageIndexProduct"
                      v-if="
                        currentVariant &&
                          currentVariant.featuredMedia &&
                          currentVariant.withVarietyPack
                      "
                      :src="item.featuredMedia.thumbnailSrc"
                      :alt="item.featuredMedia.altText"
                      class="product-select__controls__bundles__bundle-product-image"
                      :class="{
                        'item-blurred': varietyBundleSelectorActive || bundleSelectorVisible
                      }"
                      @click.self="bundleItemClicked(currentVariant, true)"
                    />
                  </template>
                </div>
                <template v-if="selectedBundle.length">
                  <div
                    v-for="(bundle, index) in selectedBundle"
                    :key="bundle.product.id"
                    class="product-select__controls__bundles__bundle-product-container"
                    :class="[
                      {
                        blur:
                          (varietyBundleSelectorActive || bundleSelectorVisible) &&
                          !bundleOptionsSelectorActive[index]
                      },
                      {
                        'no-blur': !(
                          (varietyBundleSelectorActive || bundleSelectorVisible) &&
                          !bundleOptionsSelectorActive[index]
                        )
                      }
                    ]"
                  >
                    <img
                      v-if="bundle.variant && bundle.variant.featuredMedia"
                      :src="bundle.variant.featuredMedia.thumbnailSrc"
                      :alt="bundle.variant.featuredMedia.altText"
                      class="product-select__controls__bundles__bundle-product-image"
                      :class="[
                        { 'no-pointer': !bundle.clickAction || bundle.clickAction === 'none' },
                        {
                          'item-blurred':
                            (varietyBundleSelectorActive || bundleSelectorVisible) &&
                            !bundleOptionsSelectorActive[index]
                        },
                        {
                          'item-not-blurred': !(
                            (varietyBundleSelectorActive || bundleSelectorVisible) &&
                            !bundleOptionsSelectorActive[index]
                          )
                        }
                      ]"
                      @click.self="bundleItemClicked(bundle, false, index)"
                    />
                    <img
                      v-else
                      :src="bundle.product.featuredMedia.thumbnailSrc"
                      :alt="bundle.product.featuredMedia.altText"
                      class="product-select__controls__bundles__bundle-product-image"
                      :class="[
                        { 'no-pointer': !bundle.clickAction || bundle.clickAction === 'none' },
                        {
                          'item-blurred':
                            (varietyBundleSelectorActive || bundleSelectorVisible) &&
                            !bundleOptionsSelectorActive[index]
                        },
                        {
                          'item-not-blurred': !(
                            (varietyBundleSelectorActive || bundleSelectorVisible) &&
                            !bundleOptionsSelectorActive[index]
                          )
                        }
                      ]"
                      @click.self="bundleItemClicked(bundle, false, index)"
                    />
                  </div>
                </template>
                <div
                  v-if="
                    selectedBundleVarietyPack &&
                      selectedBundleVarietyPack[selectedVarieryPackIndex] &&
                      selectedBundleVarietyPack[selectedVarieryPackIndex].variants.length
                  "
                  class="product-select__controls__bundles__bundle-product-container"
                  :class="{
                    blur: bundleSelectorVisible && !varietyBundleSelectorActive,
                    'no-blur': !(bundleSelectorVisible && !varietyBundleSelectorActive)
                  }"
                >
                  <template
                    v-for="(variant, index) in selectedBundleVarietyPack[selectedVarieryPackIndex]
                      .variants"
                  >
                    <img
                      :key="index"
                      v-show="index === imageIndex[selectedVarieryPackIndex]"
                      :test1="imageIndex[selectedVarieryPackIndex]"
                      :src="variant.featuredMedia.thumbnailSrc"
                      alt="variety pack"
                      class="product-select__controls__bundles__bundle-product-image"
                      :class="{
                        'item-blurred': bundleSelectorVisible && !varietyBundleSelectorActive,
                        'item-not-blurred': !(bundleSelectorVisible && !varietyBundleSelectorActive)
                      }"
                      @click.self="
                        bundleVarietyPackClicked(
                          selectedBundleVarietyPack[selectedVarieryPackIndex],
                          selectedBundleVarietyPack.length > 1
                        )
                      "
                    />
                  </template>
                </div>
              </div>
              <div class="product-select__controls__bundles__add-to-cart-bundle">
                <product-add-to-cart-button
                  class="other-products"
                  :quantity="quantity"
                  :product="product"
                  :variant="currentVariant"
                  :allOptionsSelected="true"
                  :onlyOneOption="true"
                  :variants="variants"
                  :isSubscriptionOn="isSubscriptionActive"
                  @addedToCart="quantity = 1"
                  :bundleQuantity="1"
                  :bundles="selectedBundle"
                  :bundle-variety-pack="selectedBundleVarietyPack[selectedVarieryPackIndex]"
                />
              </div>

              <div class="variant-select-container" @click.stop>
                <div
                  v-for="(bundle, index) in selectedBundle"
                  :key="bundle.product.id"
                  class="variant-select bundle-item"
                  :class="{ 'single-variant': bundle.variantsAvailableForSale <= 1 }"
                  v-show="bundleOptionsSelectorActive[index]"
                >
                  <div
                    v-click-outside="hideVariantSelector"
                    v-if="bundleOptionsSelectorActive[index]"
                  >
                    <div
                      v-if="bundle.media"
                      class="media-tile__media"
                      :class="{ 'variety-bundle-item-video': bundleOptionsSelectorActive[index] }"
                    >
                      <Close :on-click="hideVariantSelector" color="white" />
                      <VideoContainer
                        v-if="bundle.media.fields.file"
                        :source="bundle.media.fields.file.url"
                        class="media-tile__media__video bundle-item-video"
                        :show-loader="true"
                        :loader-height="360"
                      />
                    </div>
                    <product-options
                      v-if="bundle.variantsAvailableForSale > 1"
                      :options="getAllOptions(bundle.product.variants)"
                      :variant="bundle.variant"
                      :variants="bundle.product.variants"
                      :currentOption="bundle.variant.selectedOptions[0].value"
                      :key="5"
                      @selectedOption="setBundleVariant($event, index)"
                      @click.stop
                      class="bundle-variant-select-color"
                    />
                    <div class="bundle-overlay" @click.prevent.stop="hideVariantSelector"></div>
                  </div>
                </div>
                <div
                  v-if="
                    selectedBundleVarietyPack &&
                      selectedBundleVarietyPack[selectedVarieryPackIndex] &&
                      selectedBundleVarietyPack[selectedVarieryPackIndex].variants.length &&
                      varietyBundleSelectorActive
                  "
                  class="variant-select"
                  tabindex="2"
                  v-click-outside="hideVariantSelector"
                >
                  <div
                    v-if="selectedBundleVarietyPack[selectedVarieryPackIndex].media"
                    class="media-tile__media variety-bundle-item-video"
                  >
                    <Close :on-click="hideVariantSelector" color="white" />
                    <VideoContainer
                      v-if="selectedBundleVarietyPack[selectedVarieryPackIndex].media.fields.file"
                      :source="
                        selectedBundleVarietyPack[selectedVarieryPackIndex].media.fields.file.url
                      "
                      :show-loader="true"
                      :loader-height="360"
                      class="media-tile__media__video"
                    />
                  </div>
                  <VarietySelect
                    tabindex="0"
                    :options="varietyPackSelectorOptions"
                    @updateOptions="updateSelectedVarietyPack"
                  />
                  <div class="bundle-overlay" @click.prevent.stop="hideVariantSelector"></div>
                </div>
              </div>
            </div>
            <!--
            <div class="product-select__controls__shipping-notification">
              TODO: Shipping estimate for normal products should go here
            </div>
            -->
            <div v-if="isJetpack" class="product-select__controls__shipping-notification">
              <ShippingTime
                :product="'jetpack'"
                :country="country"
                :shipping-offset="variantShippingOffset || productShippingOffset"
                :shipping-date="variantShippingDate || productShippingDate"
              />
            </div>
            <hr class="product-select__controls__divider" />

            <!-- VALUE PROPS - TODO: Abstract into component -->
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
                    :src="
                      optimizeSource({
                        url: '/images/blendjetPDP/TrustedSite.svg'
                      })
                    "
                    alt="TrustedSite Seal"
                    style="border: 1px solid #ccc;border-radius: 3px;"
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
            <template v-if="isJetpack">
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
                          <g
                            id="Group-5"
                            transform="translate(23.000000, 21.000000)"
                            fill="#373795"
                          >
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
            </template>
          </div>

          <!-- MODAL (Purchase Guarantee) - TODO: Abstract into a component -->
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

          <!-- Modal (Subscriptions) — TODO: Abstract into a component, selectively render only if product is a subscription. Pull discount data dynamically -->
          <modal name="about-subscriptions" height="auto" width="494px" :adaptive="true">
            <div class="about-subscriptions__container">
              <div slot="top-right" @click="$modal.hide('about-subscriptions')">
                <Close />
              </div>
              <div class="about-subscriptions__heading">
                Get Delicious On<br />
                Demand And Save
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

      <!-- HEADER TEXT - Variant-specific text banner directly below the main product-detail gallery + form -->
      <div v-if="headerText" class="blendjet-banner">
        <div class="blendjet-banner__content-block">
          <RichTextRenderer :document="headerText" />
        </div>
      </div>

      <div class="media-content">
        <!-- VARIANT HERO IMAGES - Variant-specific hero imagery -->
        <div class="media-content__carousel__container" v-if="heroImages.length">
          <b-carousel
            class="media-content__carousel"
            :arrow="heroImages.length > 1"
            :repeat="true"
            :arrow-hover="false"
            :indicator="heroImages.length > 1"
            :autoplay="false"
            :has-drag="true"
          >
            <b-carousel-item v-for="(image, i) in heroImages" :key="i">
              <img
                class="media-content__carousel__img"
                :src="optimizeSource({ url: image, height: 1200, width: 2000 })"
              />
            </b-carousel-item>
          </b-carousel>
        </div>

        <div class="media-content__main" v-if="features && features.features.length">
          <!-- FEATURES - Title, Description, and Features (text, icon) array -->
          <div class="media-content__main__features">
            <ProductFeatures
              :title="features.title"
              :description="features.description"
              :features="features.features"
            />
          </div>
          <!-- PRODUCT MEDIA LOOP - Title/Description & either image or video -->
          <div class="media-content__main__media" v-if="loaded && productDescription">
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

      <!-- TODO: THIS COMPONENT SHOULD BE VARIANT BASED -->
      <div
        v-if="!product.title.includes('Replacement')"
        class="reviews"
        style="zoom:1.25"
        id="reviews"
      >
        <loox-product-reviews :product="product" />
      </div>

      <!-- TODO: Make this dynamic using contentful
      <div class="jetpacks" v-if="product.variants && product.variants.length > 1">
        <JetpackCrossSell :product="product" heading="You may also like these" />
      </div>
      -->
      <div class="jetpacks">
        <JetpackCrossSell :product="product" :heading="'You may also like these'" />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { cloneDeep } from 'lodash'
import vClickOutside from 'v-click-outside'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

import ProductPrice from '~/components/nacelle/ProductPrice'
import ProductFeatures from '~/components/ProductFeaturesPDP'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import CustomProductOptions from '~/components/CustomProductOptions'
import SubscriptionToggle from '~/components/subscriptionToggle'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton'
import ProductVariantsDropdown from '~/components/ProductVariantsDropdown'
import ProductStickyAddToCart from '~/components/ProductStickyAddToCart'
import ProductMediaTile from '~/components/ProductMediaTile'
import ShippingTime from '~/components/shippingTime'
import imageOptimize from '~/mixins/imageOptimize'
import rechargeProperties from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'
import allOptionsSelected from '~/mixins/allOptionsSelected'
import availableOptions from '~/mixins/availableOptions'
import carouselDragEvents from '~/mixins/carouselDragEvents'
import Guarantee from '~/components/svg/30dayGuarantee'
import Close from '~/components/svg/modalClose'
import Tabs from '~/components/tabs'
import NextSlide from '~/components/svg/NextSlide'
import PrevSlide from '~/components/svg/PrevSlide'
import VarietySelect from '~/components/VarietySelect'
import TabLinks from '~/components/TabLinks'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'
import ProductOptions from '~/components/nacelle/ProductOptions'

import { createClient } from '~/plugins/contentful.js'
const JetpackCrossSell = () => import('~/components/jetpackCrossSellVariants')
const VideoContainer = () => import('~/components/VideoContainer')
export default {
  data() {
    return {
      currentVariant: {},
      withVarietyPack: false,
      variantIndex: 0,
      productImage: null,
      heroImages: [],
      imgWidth: 0,
      isSubscriptionActive: false, // whether the subscription toggle is active or not — this is toggled to true if the product has RC metafields in the created() method
      loaded: false,
      variantsMenuVisible: false,
      quantity: 1,
      variants: [],
      productData: { ...this.product },
      pageData: { ...this.page },
      headerBackground: null,
      headerText: null,
      productDescription: null,
      features: null,
      featuresBackground: null,
      media: {},
      bannerText: '',
      description: {},
      client: null,
      addToCartWidth: '260px',
      currency: 'USD',
      displayPrice: '0',
      mcafeeLink: 'https://www.trustedsite.com/verify?host=blendjet.com',
      nortonLink: 'https://seal.digicert.com/seals/popup/?tag=6CDZP5Ti&url=blendjet.com',
      bbbLink:
        'https://www.bbb.org/us/ca/concord/profile/online-shopping/blendjet-1116-882016/#sealclick',
      applePay: false,
      metaTitle: null,
      metaDescription: null,
      imageInterval: null,
      imageIndex: 0,
      imageIntervalProduct: null,
      imageIndexProduct: 0,
      quantityOption: {
        quantity: [],
        title: ''
      },
      selectedBundle: cloneDeep(this.bundles),
      selectedBundleVarietyPack: cloneDeep(this.bundleVarietyPack),
      bundleTitle: this?.page?.fields?.bundles?.fields?.title,
      bundleVarietyOptions: [],
      selectedVarieryPackIndex: 0,
      varietyPackImage: [],
      bundleOptionsSelectorActive: {},
      varietyBundleSelectorActive: false,
      bundleSelectorVisible: false,
      varietyPackSelectorOptions: [],
      variantShippingOffset: null,
      variantShippingDate: null,
      productShippingOffset: null,
      productShippingDate: null,
      jetpackCrossSell: [
        {
          text: 'Lattes',
          url: '/products/jetpack-latte'
        },
        {
          text: 'Protein',
          url: '/products/jetpack-protein-smoothie'
        },
        {
          text: 'Smoothies',
          url: '/products/jetpack-smoothies'
        }
      ]
    }
  },
  components: {
    JetpackCrossSell,
    ProductPrice,
    QuantitySelector,
    SubscriptionAddToCartButton,
    SubscriptionToggle,
    ProductFeatures,
    ProductVariantsDropdown,
    ProductOptions,
    Guarantee,
    Close,
    RichTextRenderer,
    ProductStickyAddToCart,
    ProductMediaTile,
    CustomProductOptions,
    ShippingTime,
    Tabs,
    PrevSlide,
    NextSlide,
    VideoContainer,
    VarietySelect,
    ProductAddToCartButton,
    TabLinks
  },
  mixins: [
    imageOptimize,
    rechargeProperties,
    productMetafields,
    availableOptions,
    allOptionsSelected,
    carouselDragEvents
  ],
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    page: {
      type: Object,
      default: () => ({})
    },
    country: {
      type: Object,
      default: () => {}
    },
    bundles: {
      type: Array,
      default: () => []
    },
    variantSpecificBundles: {
      type: Object,
      default: () => {}
    },
    bundleVarietyPack: {
      type: Array,
      default: () => []
    },
    variantBundleVarietyPack: {
      type: Object,
      default: () => {}
    }
  },
  head() {
    const productCurrency = this.currency
    const productPrice = this.displayPrice
    const image = this.productImage
    const name = this.product.title
    const properties = {}
    const meta = []
    const script = [
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
    ...mapState('user', ['locale']),
    hasColorVariants() {
      return this.product.variants[0].selectedOptions.some(o => /color/i.test(o.name))
    },
    currentOption() {
      return this.currentVariant.selectedOptions?.[0]?.value || ''
    },
    isJetpack() {
      return this?.product?.productType?.toLowerCase().includes('jetpack')
    },
    hasBundle() {
      return !!this.bundles.length
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    hideVariantSelector(event = {}) {
      if (
        event &&
        event?.target?.className?.includes &&
        event?.target?.className?.includes('item-not-blurred')
      ) {
        return
      }
      this.bundleSelectorVisible = false
      this.varietyBundleSelectorActive = false
      console.log('outside click called')
      for (let i = 0; i < 10; i++) {
        if (this.bundleOptionsSelectorActive[i]) {
          this.$set(this.bundleOptionsSelectorActive, i, false)
        }
      }
    },
    focusOutCalled(event = {}) {
      console.log('focus out called')
      if (
        event &&
        event?.target?.className?.includes &&
        event?.target?.className?.includes('item-not-blurred')
      ) {
        return
      }
      this.varietyBundleSelectorActive = false
    },
    bundleVarietyPackClicked(bundle, hasMultipleProducts) {
      console.log('Bundle variety pack clicked')
      if (hasMultipleProducts) {
        this.varietyBundleSelectorActive = !this.varietyBundleSelectorActive
        this.varietyBundleSelectorActive &&
          this.$nextTick(() => {
            const media = document.querySelector('.variety-bundle-item-video')
            const mediaOffset = media?.getBoundingClientRect()?.top || 0
            if (this.$mq === 'sm' || this.$mq === 'md') {
              window.scroll({
                top: window.scrollY + mediaOffset - 140,
                behavior: 'smooth'
              })
            } else {
              const bundleElement = document.querySelector(
                '.product-select__controls__bundles__bundle-products'
              )
              const bundleOffset = bundleElement?.getBoundingClientRect()?.top
              if (bundleOffset - 380 - 140 < 0) {
                window.scroll({
                  top: window.scrollY + mediaOffset - 140,
                  behavior: 'smooth'
                })
              }
            }
          })
      } else {
        const variant = bundle?.variants?.length ? bundle.variants[0] : bundle.variant
        this.$router.push({
          name: 'products-productHandle',
          params: {
            productHandle: bundle.product.handle
          },
          query: {
            variant: this.formatVariantId(variant.id)
          }
        })
      }
    },
    bundleItemClicked(bundle, isCurrentProduct, index = 0) {
      console.log('Bundle item clicked')
      if (!isCurrentProduct) {
        if (bundle?.clickAction === 'variant') {
          if (this.bundleOptionsSelectorActive[index]) {
            this.hideVariantSelector()
            return
          }
          console.log('show variant')
          for (let i = 0; i < 10; i++) {
            this.$set(this.bundleOptionsSelectorActive, i, false)
          }
          this.varietyBundleSelectorActive = false
          this.bundleSelectorVisible = true
          this.$set(this.bundleOptionsSelectorActive, index, true)
          setTimeout(() => {
            this.$set(this.bundleOptionsSelectorActive, index, true)
            this.bundleSelectorVisible = true
            console.log('visible set')
            this.$nextTick(() => {
              const media = document.querySelector('.variety-bundle-item-video')
              const mediaOffset = media?.getBoundingClientRect()?.top || 0
              if (this.$mq === 'sm' || this.$mq === 'md') {
                window.scroll({
                  top: window.scrollY + mediaOffset - 140,
                  behavior: 'smooth'
                })
              } else {
                const bundleElement = document.querySelector(
                  '.product-select__controls__bundles__bundle-products'
                )
                const bundleOffset = bundleElement?.getBoundingClientRect()?.top
                if (bundleOffset - 380 - 140 < 0) {
                  window.scroll({
                    top: window.scrollY + mediaOffset - 140,
                    behavior: 'smooth'
                  })
                }
              }
            })
          }, 100)
        } else if (bundle.clickAction === 'link') {
          const variant = bundle?.variants?.length ? bundle.variants[0] : bundle.variant
          this.$router.push({
            name: 'products-productHandle',
            params: {
              productHandle: bundle.product.handle
            },
            query: {
              variant: this.formatVariantId(variant.id)
            }
          })
        }
      } else {
        this.bundleSelectorVisible = false
        if (this.$mq === 'sm' || this.$mq === 'md') {
          const element = this.$refs.swatch
          const top = element.offsetTop
          window &&
            window.scroll({
              top: Number(top) - 130,
              behavior: 'smooth'
            })
        } else {
          window &&
            window.scroll({
              top: 0,
              behavior: 'smooth'
            })
        }
      }
    },
    setBundleVariant(option, index) {
      const bundleToUpdate = this.selectedBundle[index]
      const newVariant = bundleToUpdate.product.variants.filter(variant => {
        if (variant.selectedOptions[0].value === option.value) {
          return variant
        }
      })
      if (newVariant.length) {
        this.selectedBundle[index].variant = cloneDeep(...newVariant)
        this.$set(this.bundleOptionsSelectorActive, index, false)
        this.bundleSelectorVisible = false
      }
    },
    updateSelectedVarietyPack(index) {
      this.selectedVarieryPackIndex = index
      this.updateBundle()
      this.varietyBundleSelectorActive = false
    },
    updateBundle() {
      const title = this.currentVariant.title.toLowerCase()?.replace(/\s/g, '')
      if (this?.variantSpecificBundles?.[title]?.length) {
        this.selectedBundle = cloneDeep(this?.variantSpecificBundles[title])
        this.bundleTitle = this?.variantSpecificBundles?.[title]?.[0].title
      } else if (this.bundles.length) {
        this.selectedBundle = cloneDeep(this.bundles)
        this.bundleTitle = this.bundles[0].title
      }
      if (this?.variantBundleVarietyPack?.[title]?.length) {
        this.selectedBundleVarietyPack = cloneDeep(this?.variantBundleVarietyPack?.[title])
      } else if (this.bundleVarietyPack.length) {
        this.selectedBundleVarietyPack = cloneDeep(this.bundleVarietyPack)
      } else {
        this.selectedBundleVarietyPack = []
      }
      if (this.selectedBundleVarietyPack?.length) {
        if (this.selectedBundleVarietyPack?.[this.selectedVarieryPackIndex]) {
          const variants = this.selectedBundleVarietyPack?.[this.selectedVarieryPackIndex].variants
          const imageIndex = []
          for (let i = 0; i < this.selectedBundleVarietyPack?.length; i++) {
            imageIndex[i] = 0
          }
          this.selectedBundleVarietyPack.forEach(({ variants }, index) => {
            this.$set(
              this.varietyPackImage,
              index,
              variants?.[(imageIndex[index] + 1) % variants.length]?.featuredMedia.thumbnailSrc
            )
            imageIndex[index]++
          })
          if (variants?.length) {
            clearInterval(this.imageInterval)
            this.imageInterval = setInterval(() => {
              this.selectedBundleVarietyPack.forEach(({ variants }, index) => {
                this.$set(this.imageIndex, index, this.imageIndex[index] + 1)
                this.$set(this.imageIndex, index, this.imageIndex[index] % variants.length)
              })
              this.updateVarietyPackOptions()
              // this.varietyPackImage =
              //   variants?.[(imageIndex + 1) % variants.length]?.featuredMedia.thumbnailSrc
              // imageIndex++
            }, 1000)
          }
        }
        this.updateVarietyPackOptions()
      } else {
        this.varietyPackSelectorOptions = []
        clearInterval(this.imageInterval)
      }
    },
    updateVarietyPackOptions() {
      this.varietyPackSelectorOptions = []
      this.selectedBundleVarietyPack.forEach(({ product, variants }, index) => {
        let title = product?.title
        if (title?.toLowerCase()?.includes('protein')) {
          title = variants.length + ' JETPACK PROTEIN SMOOTHIES'
        } else if (title?.toLowerCase()?.includes('latte')) {
          title = variants.length + ' JETPACK LATTES'
        } else if (title?.toLowerCase()?.includes('jetpack')) {
          title = variants.length + ' JETPACK SMOOTHIES'
        }
        this.varietyPackSelectorOptions.push({
          title: title,
          variants: variants,
          image: this.varietyPackImage[index]
        })
      })
    },
    incrementVariant() {
      if (this.variantIndex === this.variants.length - 1) {
        this.variantIndex = 0
      } else {
        this.variantIndex++
      }
      const newVar = this.variants[this.variantIndex]
      this.setSelectedVariant(newVar)
    },
    decrementVariant() {
      if (this.variantIndex === 0) {
        this.variantIndex = this.variants.length - 1
      } else {
        this.variantIndex--
      }
      const newVar = this.variants[this.variantIndex]
      this.setSelectedVariant(newVar)
    },
    camelize(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
    },
    /**
     * Sets the selected variant for the add-to-cart form
     */
    setSelectedVariant(selectedVariant) {
      this.currentVariant = selectedVariant
      this.variants.forEach((item, i) => {
        if (item.id === selectedVariant.id) this.variantIndex = i
      })
      this.addHashToLocation()
    },
    // Set the currentVaraint using the options selected
    // If there is only one option selected, it will take the first varaint with that option
    setSelectedOption(opt) {
      let variant = null

      variant = this.variants.find(v => {
        if (opt.length > 1) {
          return JSON.stringify(v.selectedOptions) === JSON.stringify(opt)
        }
      })

      if (!variant) {
        variant = this.variants.find(v => {
          return v.selectedOptions.some(option => {
            return JSON.stringify(option) === JSON.stringify(Array.isArray(opt) ? opt[0] : opt)
          })
        })
      }

      if (variant) {
        this.currentVariant = variant
        this.addHashToLocation()
      }
    },
    /**
     * Toggles the visibility of the variant selection dropdown menu
     */
    toggleVariantsMenu() {
      this.variantsMenuVisible = !this.variantsMenuVisible
    },
    formatTitle(title) {
      return title.replace(/\s/g, '')
    },
    setDisplayPrice(data) {
      this.displayPrice = data
    },
    setCurrency(data) {
      this.currency = data
    },
    updateQuantity(qty) {
      this.quantity = qty
    },
    /**
     * Adds the variant hash to the URL.
     * TODO: This should be done using the vue-router...
     */
    addHashToLocation() {
      window.history.replaceState(
        {},
        null,
        this.$route.path + '?variant=' + this.formatVariantId(this.currentVariant.id)
      )
    },
    /**
     * Formats a Storefront API encoded ID to a plain-language variant ID
     * TODO: Move this to a mixin, it's used in like every product-based component...
     */
    formatVariantId(value) {
      const url = atob(value)
      return url.replace('gid://shopify/ProductVariant/', '')
    },
    /**
     * Sets the initial variant for the PDP.  Derives it from
     * the ?variant= query param in the URL (if present).
     */
    setInitialVariant() {
      const urlVariantId = this.$route.query.variant
      const variantsWithIds = Array.isArray(this.variants)
        ? this.variants.map(variant => ({
          ...variant,
          formattedId: this.formatVariantId(variant.id)
        }))
        : []

      const matchingVariant = variantsWithIds.find(v => v && v.formattedId === urlVariantId)
      matchingVariant &&
        this.variants.forEach((item, i) => {
          if (item.id === matchingVariant.id) this.variantIndex = i
        })

      // Set current variant equal to the variant indicated by the param, or the product's first variant.
      this.currentVariant = matchingVariant || this.variants[0]
    },
    async setProductDetails() {
      this.productDescription = this.page.fields.productDescription
      // load variant specific product details if available
      const variantTitle = this.currentVariant?.title?.toLowerCase()?.replace(/\s/g, '')
      if (this.media[variantTitle]?.nutritionFactsTile) {
        let nutritionFactsTile = this.media[variantTitle].nutritionFactsTile
        if (!nutritionFactsTile.heading) {
          nutritionFactsTile = await this.client.getEntry(nutritionFactsTile.sys.id)
        }
        if (this.productDescription && this.productDescription.length) {
          this.productDescription = this.productDescription.map(descriptionItem => {
            if (descriptionItem.fields.heading === nutritionFactsTile?.fields?.heading) {
              return nutritionFactsTile
            } else {
              return descriptionItem
            }
          })
        }
      }
      if (this.media[variantTitle]?.headerText) {
        this.headerText = this.media[variantTitle]?.headerText
      }
      this.variantShippingOffset = this.media[variantTitle].shippingOffset
      this.variantShippingDate = this.media[variantTitle].shippingDate
      if (this.media[variantTitle]?.quantityOption) {
        this.quantityOption.quantity = this.media[variantTitle]?.quantityOption?.quantity?.split(
          ','
        )
        this.quantityOption.quantity = this.quantityOption.quantity.map(item => Number(item))
        this.quantityOption.title = this.media[variantTitle]?.quantityOption?.title
      } else {
        this.quantityOption = {
          quantity: [],
          title: ''
        }
      }
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
      var referrer = document.referrer.includes('marketplace') ? document.referrer : ''
      var productId = Buffer.from(this.product.pimSyncSourceProductId, 'base64')
        .toString('binary')
        .split('/')
        .pop()
      var variantId = Buffer.from(variant.id, 'base64')
        .toString('binary')
        .split('/')
        .pop()
      window.dataLayer.push({
        event: 'dl_view_item',
        event_id: uuid,
        ecommerce: {
          currencyCode: this.product.priceRange.currencyCode,
          detail: {
            actionField: { list: referrer },
            products: [
              {
                name: this.product.title.replace("'", ''),
                id: (variant && variant.sku) || '',
                product_id: productId,
                variant_id: (variant && variantId) || '',
                image: this.product.featuredMedia.src,
                price: variant.price,
                brand: this.product.vendor.replace("'", ''),
                variant: (variant && variant.title && variant.title.replace("'", '')) || '',
                category: this.product.productType,
                inventory: this.quantity,
                list: referrer
              }
            ]
          }
        }
      })
      // console.log('wdl_pv:', window.dataLayer)
    }
  },
  watch: {
    currentVariant(newVariant) {
      if (!newVariant) return
      // Anytime the selected variant changes, update the media
      const key = newVariant.title.toLowerCase().replace(/\s/g, '')
      const vMedia = this.media[key]

      if (vMedia) {
        this.productImage = vMedia.productImage
        this.heroImages = vMedia.heroImages
        this.bannerText = vMedia.bannerText
      } else {
        this.productImage = newVariant.featuredMedia.src
      }
      if (vMedia && !this.bannerText) {
        this.bannerText = this.product.description
      }
      if (vMedia && !this.productImage) {
        this.productImage = newVariant.featuredMedia.src
      }
      this.setProductDetails()
      // console.log('newVariant:', newVariant);
      this.elevarProductView() // needs flag to only fire once
      this.updateBundle()
    },
    'currentVariant.featuredMedia.src'(newImage) {
      const key = this.currentVariant.title.toLowerCase().replace(/\s/g, '')
      const vMedia = this.media[key]
      if (!vMedia.productImage) {
        this.productImage = newImage
      }
    },
    showDesktopHeader(newValue, oldValue) {
      // If show desktop header gets toggled to false, hide the variant selector menu too
    },
    quantity() {
      // Outsmartly discussed with John and both agreed it doesn't make sense to fire a "ViewContent"
      // event just because quantity changed. Removing this as noise.
      // this.elevarProductView()
    }
  },
  created() {
    // If this product has ReCharge metafields, toggle the subscription active state to true
    // this.isSubscriptionActive = this.hasSubscription
  },
  mounted() {
    const vm = this
    // Create contentful client
    // TODO:
    // Once nacelle-nuxt-module is upgrade to 5.5.7, replace the contentful API with a call to the SDK!
    this.client = createClient()

    // Check to see if Contentful data is present in page
    if (!this?.page?.fields) {
      // If page data doesn't exist, fail
      // TODO - Figure out failure logic?
      console.warn(`No content model found for product with handle "${this.product.handle}"`)

      // Set the product image from shopify, later if the product is found on contentful the image will be changed with the one in contentful.
      this.productImage = this.product.media[0].src

      this.product.variants.forEach(variant => {
        const variantTitle = variant.title.toLowerCase().replace(/\s/g, '')

        const variantData = {
          productImage: variant.featuredMedia?.src,
          heroImages: [],
          bannerText: this.product.description
        }

        // Add variant data to component's `media` object
        vm.media[variantTitle] = variantData
      })

      this.setInitialVariant()

      return
    }

    // Set the product image from shopify, later if the product is found on contentful the image will be changed with the one in contentful.
    this.productImage = this.product.media[0].src

    // Set component data based on the matching Contentful entry
    const fields = this.page.fields

    // Set metadata
    if (fields.metaTitle) {
      this.metaTitle = this.page.fields.metaTitle
    }
    if (fields.metaDescription) {
      this.metaDescription = this.page.fields.metaDescription
    }
    if (fields.shippingOffset) {
      this.productShippingOffset = fields.shippingOffset
    }
    if (fields.shippingDate) {
      this.productShippingDate = fields.shippingDate
    }
    // Get 'Header' (product description beneath the product form)
    this.headerText = fields.headerText
    this.headerBackground =
      fields.headerBackground || 'linear-gradient(to bottom right,#373795 0,#1e90bb)'

    // 'Media' tiles
    this.productDescription = fields.productDescription
    // 'Features' array
    const featureFields = fields.features?.fields || {}
    if (featureFields) {
      const featureItems = featureFields.features || []
      this.features = {
        ...featureFields,
        features: Array.isArray(featureItems) ? featureItems.map(fi => fi.fields) : []
      }
    }
    this.featuresBackground = fields.featuresBackgroundColor || '#33499d'

    // Loop over the `variants` fields to assemble the variant-specific data
    // for this product that updates on variant change
    if (Array.isArray(fields.variants)) {
      fields.variants.forEach(node => {
        // Assemble ProductVariant data into usable object
        const variantTitle = node.fields.title.toLowerCase()
        const variantData = {
          productImage: node?.fields?.productImage?.fields?.file?.url
            ? `https:${node.fields.productImage.fields.file.url}`
            : null, // hero image
          heroImages: Array.isArray(node?.fields?.heroImages)
            ? node.fields.heroImages.map(image => `${image.fields.file.url}?w=2100`)
            : [],
          bannerText: node?.fields?.description,
          headerText: node?.fields?.headerText,
          nutritionFactsTile: node?.fields?.nutritionFactsTile,
          shippingOffset: node?.fields?.shippingOffset || null,
          shippingDate: node?.fields?.shippingDate || null
        }

        // set Quantity Set if available
        if (node?.fields?.quantityOption?.fields) {
          variantData.quantityOption = node.fields.quantityOption.fields
        }

        // Add variant data to component's `media` object
        vm.media[variantTitle] = variantData
      })
    } else {
      this.product.variants.forEach(variant => {
        const variantTitle = variant.title.toLowerCase().replace(/\s/g, '')

        const variantData = {
          productImage: variant.featuredMedia?.src,
          heroImages: [],
          bannerText: this.product.description
        }
        // Add variant data to component's `media` object
        vm.media[variantTitle] = variantData
      })
    }

    // Set loaded flag
    this.loaded = true

    // Set the product's forms initially selected variant
    // Note: this is run after the contentful data-fetch so that the
    // various media is available for the `currentVariant` watcher.

    this.variants = this.product.variants
      .filter(v => v.availableForSale)
      .map(v => {
        const variantId = atob(v.id)
          .split('/')
          .pop()

        return {
          ...v,
          discountPercentage: this.discountPercentage,
          plainId: variantId
        }
      })
    if (vm.media.varietypack) {
      // has variety pack, add a variety pack variant
      const varietyPackVariant = {
        availableForSale: true,
        compareAtPrice: null,
        compareAtPriceCurrency: null,
        id: 'dmFyaWV0eXBhY2s=', // encoded string for 'varietypack'
        sku: 'variety-pack',
        title: 'Variety Pack',
        displayName: `Variety Pack (${this.variants.length})`,
        plainId: 'varietyPack',
        price: 0,
        weight: 0,
        withVarietyPack: true
      }
      this.variants.forEach(v => {
        varietyPackVariant.price += Number(v.price)
        varietyPackVariant.priceCurrency = v.priceCurrency
        varietyPackVariant.weight += Number(v.weight)
        varietyPackVariant.weightUnit = v.weightUnit
        varietyPackVariant.featuredMedia = {}
      })

      this.variants.unshift({ ...varietyPackVariant, price: varietyPackVariant.price.toString() })
      this.withVarietyPack = true
      if (this.variants?.length > 2) {
        // update once before calling settimeout so its available at setInitialVariant()
        clearInterval(this.imageIntervalProduct)
        this.$set(this.variants[0].featuredMedia, 'src', this.variants?.[1]?.featuredMedia.src)
        this.$set(
          this.variants[0].featuredMedia,
          'thumbnailSrc',
          this.variants?.[1]?.featuredMedia.thumbnailSrc
        )
        this.imageIntervalProduct = setInterval(() => {
          this.imageIndexProduct++
          this.imageIndexProduct = this.imageIndexProduct % this.variants.length
          if (this.imageIndexProduct === 0) {
            this.imageIndexProduct++
          }
        }, 1000)
      }
    }

    this.setInitialVariant()
  },
  beforeDestroy() {
    clearInterval(this.imageIntervalProduct)
    clearInterval(this.imageInterval)
  },
  beforeRouteLeave() {
    clearInterval(this.imageIntervalProduct)
    clearInterval(this.imageInterval)
  }
}
</script>

<style lang="scss" scoped>
.product-select__image-carousel {
  position: relative;
  max-height: 848px;
  &.jetpack {
    max-height: 980px;
    @include respond-to('small') {
      height: auto;
    }
  }
  &.has-bundle {
    max-height: 1180px;
    @include respond-to('small') {
      height: auto;
    }
  }
}
.media-content__main__features {
  background: var(--features-background) !important;
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
    height: 980px;
    &.has-bundle {
      height: 1180px;
      @include respond-to('small') {
        height: auto;
      }
    }

    &__container {
      position: sticky;
      top: 1px;
      width: 100%;
      max-height: 1180px;
      min-height: 300px;
      display: flex;
      max-height: 848px;
      &.jetpack {
        max-height: 980px;
        height: 100vh;
        @include respond-to('small') {
          height: auto;
        }
      }
      &.has-bundle {
        max-height: 1180px;
        @include respond-to('small') {
          height: auto;
        }
      }

      @include respond-to('small') {
        height: auto;
      }
    }

    @include respond-to('small') {
      height: auto;
      width: 100%;
      position: relative;
    }

    &__prev-variant {
      position: absolute;
      top: 50%;
      left: 20px;
      cursor: pointer;
      z-index: 2;
      @include respond-to('small') {
        left: 10px;
      }
    }

    &__next-variant {
      position: absolute;
      top: 50%;
      right: 20px;
      cursor: pointer;
      z-index: 2;
      @include respond-to('small') {
        right: 10px;
      }
    }

    &__img {
      width: 100%;
      object-position: center;
      object-fit: contain; // this was changed from cover -> contain at Ryan's request (BLEN-139)
      &::selection {
        background-color: transparent;
      }

      &.jetpack {
        object-fit: cover;
        @include respond-to('small') {
          height: auto;
          min-height: 300px;
        }
      }
      @include respond-to('small') {
        object-fit: contain;
        top: 0;
        left: 0;
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
    &.jetpack {
      height: 980px;
      @include respond-to('small') {
        height: auto;
      }
    }
    &.has-bundle {
      height: 1180px;
      @include respond-to('small') {
        height: auto;
      }
    }
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
      .tab-links {
        margin-top: 30px;
      }

      @media screen and (min-width: 768px) {
        display: none;
      }
    }

    &__title-container {
      @include respond-to('small') {
        display: none;
      }
      .tab-links {
        margin-top: 30px;
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
      &.jetpack {
        margin-top: 45px;
      }

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
      line-height: 1;
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
      margin-bottom: 25px;
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

    &__quantity-set {
      width: 100%;
      &--label {
        font-family: Bold;
        letter-spacing: 1.75px;
        text-align: center;
        line-height: 1.33;
        font-size: 12px;
        text-transform: uppercase;
        color: $primary-purple;
      }
    }

    &__variant-color {
      &__text {
        font-family: Bold;
        font-size: $text-small;
        text-transform: uppercase;
        line-height: 1.33;
        letter-spacing: 1.75px;
        margin-bottom: 20px;

        &__selected-color {
          color: $primary-purple;
        }

        &__label {
          color: $grayscale-gray;
        }

        @include respond-to('small') {
          margin-top: 10px;
          margin-bottom: 10px;
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
        margin-top: 24px;

        ::v-deep .add-to-cart-button {
          width: 260px;
        }
        // The sticky bar behavior is now handed in ProductStickyAddToCart
        /*@include respond-to('small') {
          position: fixed;
          bottom: 0;
          padding: 10px;
          z-index: 10;
          width: 100%;
          background-color: $grayscale-white;
        }*/

        &__quantity {
          margin-right: 6px;
        }
      }
    }

    &__bundles {
      padding: 10px;
      position: relative;
      width: 370px;
      margin: 20px auto 5px auto;
      &__title {
        font-weight: bold;
        color: $primary-purple;
        margin-bottom: 10px;
        font-size: 12px;
        font-family: Bold;
        letter-spacing: 1.75px;
        text-align: center;
        line-height: 1.33;
        text-transform: uppercase;
      }
      &__bundle-products {
        display: flex;
        margin: auto auto 15px auto;
        justify-content: center;
        max-width: 370px;
        position: relative;
      }
      .product-image-dummy {
        width: 60px;
        height: 60px;
        position: relative;
        cursor: pointer;
        z-index: 9;
      }
      &__bundle-product-container {
        height: 60px;
        width: 90px;
        position: relative;
        &.blur {
          opacity: 0.25;
        }
        &:not(:last-child)::after {
          content: '+';
          font-size: 30px;
          color: $primary-purple;
          position: absolute;
          right: calc(0% - 7px);
          top: 10px;
          opacity: 1;
        }
      }
      .blur + .no-blur {
        &::after {
          opacity: 0.25;
        }
      }
      &__bundle-product-image {
        height: 100%;
        max-height: 60px;
        width: auto;
        cursor: pointer;
        position: relative;
        z-index: 10;
        filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.3));
        &.no-pointer {
          cursor: default;
        }
      }
      &__add-to-cart-bundle {
        display: flex;
        justify-content: center;
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
        margin-bottom: 20px;

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
  .cross-sell__mobile {
    display: block;
    height: 75px;
    width: 95%;
    margin: auto;
    max-width: 360px;
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
  height: auto;
  background: var(--header-background);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5%;
  padding-bottom: 5%;

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

.variant-dropdown-container {
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

    &__media {
      width: 50%;
      padding: 50px;
      width: 50%;
      background: $primary-purple-tint;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      @include respond-to('small') {
        width: 100%;
        padding: 20px 0 0 0;
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
.blendjet-banner__content-block a:hover {
  color: #000;
}
//Reset h1
h1 {
  font-family: inherit;
  line-height: inherit;
  letter-spacing: inherit;
}
.variant-select-container {
  position: absolute;
  top: 108px;
  left: 0;
  width: 370px;
  .variant-select {
    &.bundle-item {
      background: white;
      width: 370px;
      border: 2px solid black;
      border-radius: 25px;
      overflow: hidden;
      &.single-variant {
        border: 0;
      }
    }
    .option {
      margin-bottom: 0;
    }
  }
  .bundle-variant-select-color {
    z-index: 10;
    position: relative;
    background: white;
    padding: 10px;
    border-radius: 22px;
  }
}
</style>
<style lang="scss">
#custom-tabs {
  margin-top: 5px;
  .tab-container {
    width: 100%;
    height: 50px;
    padding: 0;
    border: 2px solid $secondary-purple-4;
    background: #fff;
    .tab-item {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        height: 100%;
        width: 100%;
        color: $primary-purple;
        font-family: Bold;
        line-height: 1.17;
        letter-spacing: 1.75px;
        text-transform: uppercase;
        cursor: pointer;
        font-size: 12px;
        &:hover {
          background: none;
        }
      }
      &.is-active {
        a {
          background: #e0e0ff;
          border: 2px solid $primary-purple;
          &:hover {
            background: #e0e0ff;
          }
        }
      }
    }
  }
}

.variant-dropdown {
  .dropdown-content {
    padding: 0 !important;
  }
}
.variant-select-container {
  .variant-select {
    .option {
      margin-bottom: 0;
    }
  }
  .bundle-overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
  .media-tile__media {
    position: absolute;
    z-index: 10;
    top: -485px;
    border-radius: 5px;
    overflow: hidden;
    &.variety-bundle-item-video {
      height: 360px;
      width: 380px;
      left: -6px;
      @include respond-to('small') {
        width: 100%;
        left: 0;
      }
      video {
        min-height: 360px;
        @include respond-to('small') {
          width: auto;
        }
      }
    }
  }
}
</style>
