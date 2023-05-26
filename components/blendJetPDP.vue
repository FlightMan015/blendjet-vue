<template>
  <transition name="fade">
    <div
      class="pdp-container"
      :class="[{ 'has-special-edition': specialEdition }, specialEdition]"
      v-if="currentVariant"
      :style="[!currentVariant ? 'height:100vh' : 'auto']"
    >
      <!-- PRODUCT OPTIONS -->
      <div class="product-select" :class="{ 'has-bundle': hasBundle }">
        <div class="product-select__controls__mobile-title-container">
          <div
            v-if="['blendjet-2'].includes(product.handle)"
            class="product-select__controls__title"
          >
            {{ product.title }}
            <br />
            <span style="font-size: 12px;line-height: 1.25;letter-spacing: 1.75px;">
              Portable Blender
            </span>
          </div>
          <div v-else class="product-select__controls__title">
            <h1>{{ product.title }}</h1>
          </div>
          <div class="product-select__controls__rating" style="zoom:1.25">
            <loox-product-rating :product="product" />
          </div>
          <div class="product-select__controls__price">
            <product-price
              @Country="setCoutry"
              @DisplayPrice="setDisplayPrice"
              @Currency="setCurrency"
              v-if="currentVariant"
              :price="currentVariant.price"
              :variantId="currentVariant.id"
            />
            <product-price
              v-show="
                currentVariant.compareAtPrice &&
                  currentVariant.compareAtPrice !== currentVariant.price &&
                  compareAtPrice !== displayPrice
              "
              @CompareAtLocal="setCompareAtPrice"
              :price="currentVariant.compareAtPrice"
              :strikethrough="true"
              :variantId="currentVariant.id"
            />
            <div
              class="product-select__controls__price__installments"
              v-if="productType == 'BlendJet' && showAfterPay"
            >
              <afterpay-placement
                data-locale="en_US"
                :data-currency="currency"
                :data-amount="displayPrice"
                data-modal-theme="white"
                data-size="xs"
                data-logo-type="lockup"
              ></afterpay-placement>
            </div>
          </div>
        </div>
        <div class="product-select__image-carousel" :class="{ 'has-bundle': hasBundle }">
          <div
            v-if="variants.length > 1"
            class="product-select__image-carousel__prev-variant"
            @click="decrementVariant"
          >
            <PrevSlide />
          </div>
          <div
            v-if="variants.length > 1"
            class="product-select__image-carousel__next-variant"
            @click="incrementVariant"
          >
            <NextSlide />
          </div>
          <transition name="fade" mode="out-in">
            <picture
              v-if="productImage"
              :class="[
                'product-select__image-carousel__img-container',
                { 'auto-width': productType !== 'BlendJet' }
              ]"
            >
              <source :srcset="optimizeSource({ url: heroUrl })" />
              <img
                class="product-select__image-carousel__img"
                :class="{ 'has-bundle': hasBundle }"
                currentVariant.featuredMedia.thumbnailSrc
                :src="
                  optimizeSource({
                    url:
                      productType == 'BlendJet'
                        ? productImage
                        : currentVariant.featuredMedia.thumbnailSrc,
                    width: 2100
                  })
                "
                @mousedown.prevent="dragStart"
                @mousemove.prevent="dragProgress"
                @mouseleave.prevent="dragExit"
                @mouseup.prevent="dragEnd(incrementVariant, decrementVariant)"
                v-touch:swipe.right="decrementVariant"
                v-touch:swipe.left="incrementVariant"
              />
            </picture>
          </transition>
        </div>

        <div class="product-select__controls" :class="{ 'has-bundle': hasBundle }">
          <div class="product-select__controls__title-container">
            <div
              v-if="['blendjet-2'].includes(product.handle)"
              class="product-select__controls__title"
            >
              <h1>
                {{ product.title }}
                <br />
                <span
                  style="font-family: Bold;font-size: 18px;line-height: 0.83;letter-spacing: 3.5px;"
                  >Portable Blender</span
                >
              </h1>
            </div>
            <div v-else class="product-select__controls__title">
              <h1>{{ product.title }}</h1>
            </div>
            <div class="product-select__controls__rating" style="zoom:1.25">
              <loox-product-rating :product="product" />
            </div>
            <div class="product-select__controls__price">
              <product-price
                v-if="currentVariant"
                :price="currentVariant.price"
                :variantId="currentVariant.id"
              />
              <product-price
                v-if="
                  currentVariant.compareAtPrice &&
                    currentVariant.compareAtPrice !== currentVariant.price &&
                    compareAtPrice !== displayPrice
                "
                :price="currentVariant.compareAtPrice"
                :strikethrough="true"
                :variantId="currentVariant.id"
              />
              <div
                class="product-select__controls__price__installments"
                v-if="showAfterPay && productType == 'BlendJet'"
              >
                <afterpay-placement
                  data-locale="en_US"
                  :data-currency="currency"
                  :data-amount="displayPrice"
                  data-modal-theme="white"
                  data-size="xs"
                  data-logo-type="lockup"
                ></afterpay-placement>
              </div>
            </div>
          </div>

          <div v-if="variants.length > 1" class="product-select__controls__variant-color">
            <div class="product-select__controls__variant-color__text">
              <span class="product-select__controls__variant-color__text__label">Color: </span
              ><span class="product-select__controls__variant-color__text__selected-color">{{
                currentVariant.title
              }}</span>
            </div>
            <div class="product-select__controls__variant-color__swatches" ref="swatch">
              <product-options
                :options="allOptions"
                :variant="selectedVariant"
                @selectedOptionsSet="setSelected"
                :variants="product.variants"
                @clear="selectedOptions = []"
                :currentOption="currentVariant.selectedOptions[0].value"
                :key="showHeaderVariants"
                v-if="!showMobileVariants"
              />
            </div>
          </div>

          <div v-if="country === 'US' && productType == 'BlendJet'">
            <div
              class="product-select__controls__extend-warranty"
              v-if="extend1yr && extend2yr && extend3yr"
            >
              <div
                class="product-select__controls__extend-warranty__text"
                @click="$modal.show('extend-modal')"
              >
                Add accident protection offered by
                <img
                  class=" product-select__controls__extend-warranty__logo"
                  :src="optimizeSource({ url: '/images/blendjetPDP/extend.png' })"
                />&nbsp;<Info />
              </div>
              <div class="product-select__controls__extend-warranty__button-group">
                <div
                  role="buton"
                  class="product-select__controls__extend-warranty__button"
                  :class="[
                    warrantySelected.handle ===
                    '8862eff0-e8c2-47bc-a194-157f853043ec-10003-blendjet-adh-replace-1y'
                      ? 'extend-active'
                      : 'extend-inactive'
                  ]"
                  @click="selectWarranty(extend1yr)"
                >
                  1 yr - ${{ extend1yr.variants[0].price }}
                </div>
                <div
                  role="buton"
                  class="product-select__controls__extend-warranty__button"
                  :class="
                    warrantySelected.handle ===
                    '8862eff0-e8c2-47bc-a194-157f853043ec-10003-blendjet-adh-replace-2y'
                      ? 'extend-active'
                      : 'extend-inactive'
                  "
                  @click="selectWarranty(extend2yr)"
                >
                  2 yr - ${{ extend2yr.variants[0].price }}
                </div>
                <div
                  role="buton"
                  class="product-select__controls__extend-warranty__button"
                  :class="
                    warrantySelected.handle ===
                    '8862eff0-e8c2-47bc-a194-157f853043ec-10002-blendjet-adh-replace-3y'
                      ? 'extend-active'
                      : 'extend-inactive'
                  "
                  @click="selectWarranty(extend3yr)"
                >
                  3 yr - ${{ extend3yr.variants[0].price }}
                </div>
              </div>
            </div>
          </div>

          <div class="product-select__controls__add-to-cart">
            <div class="product-select__controls__add-to-cart__button-group">
              <div class="product-select__controls__add-to-cart__quantity-select-container">
                <quantity-selector :quantity.sync="quantity" />
              </div>
              <div class="product-select__controls__add-to-cart__add-to-cart-button">
                <product-add-to-cart-button
                  :quantity="quantity"
                  :product="product"
                  :variant="currentVariant"
                  :allOptionsSelected="true"
                  :onlyOneOption="true"
                  :warranty="warrantySelected"
                  @addedToCart="quantity = 1"
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
                  :src="currentVariant.featuredMedia.thumbnailSrc"
                  :alt="currentVariant.featuredMedia.altText"
                  class="product-select__controls__bundles__bundle-product-image"
                  :class="{
                    'item-blurred': varietyBundleSelectorActive || bundleSelectorVisible
                  }"
                  @click.self="bundleItemClicked(currentVariant, true)"
                />
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
                :quantity="quantity"
                :product="product"
                :variant="currentVariant"
                :allOptionsSelected="true"
                :onlyOneOption="true"
                :warranty="warrantySelected"
                @addedToCart="quantity = 1"
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
                    <!-- MEDIA - VIDEO -->
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
                    :options="allOptions"
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
                  <!-- MEDIA - VIDEO -->
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

          <div
            v-if="['baileys-blendjet-2'].includes(product.handle)"
            :product="product"
            :page="page"
            class="product-select__controls__shipping-notification"
          >
            <div class="shipping-container">
              <div class="normal-size">
                <div class="normal-size__label">
                  <span>Order now and it ships by</span>
                </div>
                <div class="normal-size__countdown">
                  <span><span style="color:#7f7fd1;">Friday, April 30</span></span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="product-select__controls__shipping-notification">
            <ShippingTime
              :country="country"
              :shipping-offset="variantShippingOffset || productShippingOffset"
              :shipping-date="variantShippingDate || productShippingDate"
            />
          </div>
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

          <transition name="fade">
            <div
              class="product-select__controls__add-to-cart__mobile-float"
              v-show="showMobileHeader"
            >
              <div class="product-select__controls__add-to-cart__button-group">
                <div
                  v-if="variants.length > 1"
                  class="product-select__controls__add-to-cart__selected-swatch mobile-swatch"
                  @click.prevent="toggleMobileVariants"
                >
                  <product-option-swatch
                    :value="currentVariant.selectedOptions[0].value"
                    :optionName="'Color'"
                    :swatchStyle="'bubble'"
                    :class="{ selected: true }"
                    :variants="product.variants"
                    :selectedOptions="currentVariant.selectedOptions"
                  />
                </div>
                <div class="product-select__controls__add-to-cart__quantity-select-container">
                  <quantity-selector :quantity.sync="quantity" />
                </div>
                <div class="product-select__controls__add-to-cart__add-to-cart-button">
                  <product-add-to-cart-button
                    :quantity="quantity"
                    :product="product"
                    :variant="currentVariant"
                    :allOptionsSelected="true"
                    :onlyOneOption="true"
                    :warranty="warrantySelected"
                    @addedToCart="quantity = 1"
                  />
                </div>
              </div>
            </div>
          </transition>
          <transition name="fade">
            <div class="mobile-variant-select" v-if="showMobileVariants">
              <div class="mobile-variant-select__close" @click="toggleMobileVariants">
                <Close />
              </div>
              <div class="product-select__controls__variant-color__text">
                <span class="product-select__controls__variant-color__text__label">Color: </span
                ><span class="product-select__controls__variant-color__text__selected-color">{{
                  currentVariant.title
                }}</span>
              </div>
              <product-options
                :options="allOptions"
                :variant="selectedVariant"
                @selectedOptionsSet="setSelected"
                :variants="product.variants"
                @clear="selectedOptions = []"
                :currentOption="currentVariant.selectedOptions[0].value"
                :key="3"
              />
              <div class="mobile-variant-select__shipping">
                <ShippingTime
                  :country="country"
                  :shipping-offset="variantShippingOffset || productShippingOffset"
                  :shipping-date="variantShippingDate || productShippingDate"
                />
              </div>
            </div>
          </transition>

          <modal name="extend-modal" height="auto" :adaptive="true">
            <div class="extend-modal__container">
              <div slot="top-right" @click="$modal.hide('extend-modal')">
                <Close />
              </div>
              <div class="extend-modal__svg-container">
                <BlnExtend />
              </div>
              <div class="extend-modal__text">
                <div class="extend-modal__text__block">
                  Keep your product protected from accidents right away, plus full coverage after
                  manufacturer warranties expire.
                </div>
              </div>
              <div class="extend-modal__text__list">
                <div class="extend-modal__text__list__subheading">
                  This plan covers:
                </div>
                <ul class="extend-modal__text__list__items">
                  <li>Fast and free product replacements</li>
                  <li>Accidental damage such as breaks, drops, and spills</li>
                  <li>Extended malfunction and wear-and-tear protection</li>
                </ul>

                <div class="extend-modal__text__plan-details">
                  <a
                    href="https://customers.extend.com/plan_details/10003-blendjet-adh-replace-1y"
                    target="_blank"
                    >Plan Details</a
                  >
                </div>
              </div>
              <div class="extend-modal__why-choose">
                <div class="extend-modal__why-choose__support">
                  <img
                    class="extend-modal__why-choose__support__icon"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgc3Ryb2tlLXdpZHRoPSIxLjM1OCIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgICAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CiAgICA8cGF0aAogICAgICBkPSJNMTMgMjIuODU4cy03LjU2Ny03LjYxLTkuOTU4LTEwLjI3N2MtMS4xNTMtMS4yODYtMS45NzYtMi45MDctMS45NzYtNC43N0E2Ljc0NSA2Ljc0NSAwIDAxMTMgMy41MDRhNi43NDUgNi43NDUgMCAwMTExLjkzNCA0LjMwOGMwIDEuODYyLS44MjMgMy40ODMtMS45NzYgNC43NjlDMjAuNTY4IDE1LjI0OSAxMyAyMi44NTggMTMgMjIuODU4eiIKICAgICAgc3Ryb2tlPSIjMjI0QkM1Ii8+CiAgICA8cGF0aCBkPSJNMy43MTcgOC4zODdhNC42NzYgNC42NzYgMCAwMTQuNjctNC42NyIgc3Ryb2tlPSIjMjdBRUU0Ii8+CiAgPC9nPgo8L3N2Zz4K"
                  />Friendly support 24/7
                </div>
                <div class="extend-modal__why-choose__fees">
                  <img
                    class="extend-modal__why-choose__fees__icon"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJub25lIj4KICAgIDxwYXRoCiAgICAgIGQ9Ik0yLjU1IDE2LjQyMnYtMS4zMTNDMS4wMTUgMTQuOTY0LjE3NiAxNC4wMDMuMDMyIDEyLjIyNWgxLjQzNWMuMDU0LjQ5Ni4xNjcuODczLjMzOCAxLjEzLjE3Mi4yNTguNDIuNDIyLjc0NS40OTR2LTMuMjM1bC0uMjMtLjA4MWMtLjczMS0uMjYyLTEuMjczLS42MS0xLjYyNS0xLjA0My0uMzUyLS40MzMtLjUyOC0uOTc1LS41MjgtMS42MjQgMC0uNjg2LjIxNy0xLjI2NC42NS0xLjczMy40MzMtLjQ3IDEuMDEtLjc0NSAxLjczMy0uODI2VjQuMTI5aC44NjZ2MS4xNzhjLjY2LjA3MiAxLjE4My4zMTYgMS41Ny43MzEuMzg5LjQxNS42NTUgMS4wMS44IDEuNzg3bC0xLjM0LjIxN2MtLjA5MS0uNDQzLS4yMTgtLjc4MS0uMzgtMS4wMTZhMS4xMiAxLjEyIDAgMDAtLjY1LS40NnYyLjkzOGwuMjg0LjA5NWMuNzY4LjI4IDEuMzI1LjY0IDEuNjcyIDEuMDgzLjM0OC40NDIuNTIyIDEuMDEuNTIyIDEuNzA1IDAgLjc1OS0uMjI0IDEuMzg0LS42NyAxLjg3NS0uNDQ3LjQ5Mi0xLjA1Ljc3NC0xLjgwOC44NDd2MS4zMTNIMi41NXptLjg2Ni0yLjU0NWMuMzQzLS4wNjQuNjA3LS4yMTcuNzkyLS40Ni4xODUtLjI0NC4yNzgtLjU2NS4yNzgtLjk2MiAwLS4zODgtLjA4Mi0uNy0uMjQ0LS45MzQtLjE2Mi0uMjM1LS40MzgtLjQzMy0uODI2LS41OTZ2Mi45NTJ6TTIuNTUgNi41MzljLS42NS4xMjYtLjk3NS41Ni0uOTc1IDEuMyAwIC4zNDMuMDcyLjYxMy4yMTcuODEyLjE0NC4xOTguMzk3LjM3NC43NTguNTI4di0yLjY0eiIKICAgICAgZmlsbD0iIzI3QUVFNCIvPgogICAgPHBhdGgKICAgICAgZD0iTTE1Ljg4NSAyMS42MzVjLTIuMDM0IDAtMy41NC0uODY1LTQuNTE3LTIuNTk2LS45NzgtMS43My0xLjQ2Ny00LjQwNS0xLjQ2Ny04LjAyMkM5LjkwMSAzLjg2IDExLjkzNS4yOCAxNi4wMDIuMjhjMi4wMzQgMCAzLjU0Ljg2NSA0LjUxNyAyLjU5Ni45NzggMS43MyAxLjQ2NyA0LjQwNSAxLjQ2NyA4LjAyMiAwIDcuMTU4LTIuMDM0IDEwLjczNi02LjEwMSAxMC43MzZ6bS4wMy0xLjUyNWMxLjUwNSAwIDIuNTk1LS43MjkgMy4yNy0yLjE4NS42NzQtMS40NTcgMS4wMTItMy43OSAxLjAxMi02Ljk5NiAwLTIuMTktLjE0Ny0zLjk1LS40NC01LjI4LS4yOTQtMS4zMy0uNzQ4LTIuMzAzLTEuMzY0LTIuOTE5LS42MTYtLjYxNi0xLjQyMy0uOTI0LTIuNDItLjkyNC0xLjUwNiAwLTIuNTk2LjcyOS0zLjI3IDIuMTg2LS42NzUgMS40NTYtMS4wMTMgMy43ODgtMS4wMTMgNi45OTUgMCAyLjE5LjE0NyAzLjk1LjQ0IDUuMjguMjk0IDEuMzMuNzQ4IDIuMzAzIDEuMzY0IDIuOTE5LjYxNi42MTYgMS40MjMuOTI0IDIuNDIuOTI0eiIKICAgICAgZmlsbD0iIzIyNEJDNSIvPgogIDwvZz4KPC9zdmc+Cg=="
                  />No fees. No deductibles.
                </div>
              </div>
            </div>
          </modal>

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

          <modal name="pay-with-modal" width="414px" height="auto" :adaptive="true">
            <div class="pay-with-modal__container">
              <div slot="top-right" @click="$modal.hide('pay-with-modal')">
                <Close />
              </div>
              <div class="pay-with-modal__container__text">
                Pay with
              </div>

              <div class="pay-with-modal__container__amazon" @click="expressCheckout">
                <img :src="optimizeSource({ url: '/images/blendjetPDP/amazonpay.png' })" />
              </div>
              <div
                v-if="applePay"
                class="pay-with-modal__container__apple"
                @click="expressCheckout"
              >
                <img :src="optimizeSource({ url: '/images/blendjetPDP/applepay.png' })" />
              </div>
              <div class="pay-with-modal__container__paypal" @click="expressCheckout">
                <img
                  class="pay-with-modal__container__paypal__logo"
                  :src="optimizeSource({ url: '/images/blendjetPDP/paypal.png' })"
                />
              </div>
            </div>
          </modal>
        </div>
      </div>

      <!-- BAILEYS SPECIAL DESCRIPTION SECTION -->
      <div
        v-if="['baileys-blendjet-2'].includes(product.handle)"
        :product="product"
        :page="page"
        class="blendjet-banner"
      >
        <div class="blendjet-banner__content-block">
          <h2>IF YOU LIKE PIÑA COLADAS...</h2>
          <p>
            Then you’ll love this BlendJet x Baileys collab! Kick back, relax, and escape to a
            tropical paradise with our limited run, special edition BlendJet, the perfect way to
            enjoy<strong data-v-621d5369="">&nbsp;</strong
            ><a
              style="color:white;"
              href="https://www.baileys.com/en-us/products/#baileys-colada"
              target="_blank"
              ><strong>Baileys Colada</strong></a
            >, the all new limited time offering that blends Baileys irresistible Irish cream with
            the rich flavors of creamy coconut and sweet pineapples.
          </p>
          <p style="padding: 10px;">
            <a
              href="https://www.baileys.com/en-us/products/#baileys-colada"
              target="_blank"
              style="font-weight: bold;/* padding: 10px; */"
              >BUY BAILEYS COLADA HERE</a
            >
          </p>
          <p style="font-size: 75%;">
            Please Enjoy Responsibly.
          </p>
          <p style="font-size: 70%;">
            BAILEYS Colada Irish Cream Liqueur. 17% Alc/Vol. Imported by Paddington, Ltd., New York,
            NY.
          </p>
        </div>
      </div>

      <!-- DEFAULT BLENDJET DESCRIPTION SECTION -->
      <div v-else-if="page && page.fields.headerText" class="blendjet-banner">
        <div class="blendjet-banner__content-block">
          <RichTextRenderer :document="page.fields.headerText" />
        </div>
      </div>

      <!-- STICKY TOP BANNER WITH PRODUCT INFORMATION  -->
      <transition name="fade">
        <div class="header-product-select" v-show="showDesktopHeader">
          <div class="header-product-select__info-container">
            <div class="header-product-select__thumbnail">
              <img
                class="header-product-select__thumbnail__img"
                :src="
                  optimizeSource({
                    url: currentVariant.featuredMedia.thumbnailSrc
                  })
                "
              />
            </div>
            <div class="header-product-select__title-container">
              <div class="header-product-select__title-container__title">
                {{ product.title }}
              </div>
              <div class="header-product-select__title-container__price">
                <product-price
                  v-if="currentVariant"
                  :price="currentVariant.price"
                  :variantId="currentVariant.id"
                />
                <product-price
                  v-if="
                    currentVariant.compareAtPrice &&
                      currentVariant.compareAtPrice !== currentVariant.price &&
                      compareAtPrice !== displayPrice
                  "
                  :price="currentVariant.compareAtPrice"
                  :strikethrough="true"
                  :variantId="currentVariant.id"
                />
              </div>
            </div>
          </div>
          <div class="header-product-select__controls-container">
            <div v-if="variants.length > 1" class="header-product-select__swatches">
              <div
                class="dropdown"
                tabindex="0"
                @focusout="showHeaderVariants = false"
                @click.prevent="toggleHeaderVariants"
              >
                <div class="dropbtn" role="button">
                  <div class="dropbtn__swatch">
                    <product-option-swatch
                      :value="currentVariant.selectedOptions[0].value"
                      :style="{}"
                      :optionName="'Color'"
                      :swatchStyle="'bubble'"
                      :class="{ selected: false }"
                      :variants="product.variants"
                      :selectedOptions="currentVariant.selectedOptions"
                    />
                  </div>
                  <div class="dropbtn__text">
                    <div class="dropbtn__text__color">
                      {{ currentVariant.title.replace('Lisa Frank ', '') }}
                    </div>
                    <div class="dropbtn__text__shipping">
                      <ShippingTime
                        :size="'short'"
                        :product="'blendjet-2'"
                        :country="country"
                        :shipping-offset="variantShippingOffset || productShippingOffset"
                        :shipping-date="variantShippingDate || productShippingDate"
                      />
                    </div>
                  </div>
                  <div class="dropbtn__caret-down">
                    <CaretDown />
                  </div>
                </div>
                <transition name="fade">
                  <div v-if="showHeaderVariants" class="dropdown-content">
                    <div class="dropdown-content__swatches">
                      <product-options
                        :options="allOptions"
                        :variant="selectedVariant"
                        @selectedOptionsSet="setSelected"
                        :variants="product.variants"
                        @clear="selectedOptions = []"
                        :currentOption="currentVariant.selectedOptions[0].value"
                        :key="2"
                      />
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="header-product-select__add-buttons">
              <div class="add-to-cart-buttons">
                <div class="quantity-select-container">
                  <quantity-selector :quantity.sync="quantity" />
                </div>
                <div class="add-to-cart">
                  <product-add-to-cart-button
                    :quantity="quantity"
                    :product="product"
                    :warranty="warrantySelected"
                    :variant="currentVariant"
                    :allOptionsSelected="true"
                    :onlyOneOption="true"
                    @addedToCart="quantity = 1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- BLENDJET FEATURES  -->
      <div class="media-content">
        <div v-if="heroImages.length > 0" class="media-content__carousel">
          <b-carousel
            class="media-content__carousel"
            :arrow="true"
            :arrow-hover="false"
            :repeat="true"
            :indicator="true"
            :has-drag="true"
            :autoplay="false"
            v-model="heroIndex"
          >
            <b-carousel-item v-for="(image, i) in heroImages" :key="i">
              <section class="`hero is-large`">
                <span class="image">
                  <img class="media-content__carousel__img" :src="optimizeSource({ url: image })" />
                </span>
              </section>
            </b-carousel-item>
          </b-carousel>
        </div>
        <div class="media-content__hero-banner"></div>
        <div class="media-content__main" v-if="loadDescription && page && page.fields.features">
          <div class="media-content__main__features">
            <div v-if="page && page.fields.features" class="features-container sticky">
              <div class="features-column">
                <div class="features-heading">
                  {{ page.fields.features.fields.title }}
                </div>
                <template v-if="page.fields.features.fields.features">
                  <div
                    v-for="(feature, i) in page.fields.features.fields.features"
                    :key="i"
                    class="features-row"
                  >
                    <div class="features-icon">
                      <ModelIcon :type="feature.fields.icon" />
                    </div>
                    <div class="features-text-block">
                      <div class="features-text-block__title">
                        {{ feature.fields.title }}
                      </div>
                      <div class="features-text-block__text">
                        <RichTextRenderer :document="feature.fields.description" />
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="media-content__main__details">
            <ProductMediaTile
              class="media-content__main__details__content-block"
              v-for="(section, i) of description"
              :key="i"
              :title="section.fields.heading"
              :text="section.fields.text"
              :contentful-media="section.fields.video"
              :external-media-url="section.fields.externalVideoUrl"
            />

            <div
              v-if="product.title.includes('BlendJet')"
              class="media-content__main__details__content-block"
            >
              <div class="media-content__main__details__specs__heading">
                DETAILS & SPECS
              </div>
              <div class="media-content__main__details__specs__text">
                Blend your favorite smoothies, shakes, margaritas, and more without the limitations
                of a regular blender - whenever, wherever you want!
              </div>

              <div
                v-if="['blendjet-2'].includes(product.handle)"
                class="media-content__main__details__content-block__image"
              >
                <img
                  class="media-content__main__details__content-block__img"
                  style="margin-bottom:35px"
                  :src="
                    optimizeSource({ url: '/images/blendjetPDP/Red-Dot-Design-Award-2021.png' })
                  "
                />
              </div>

              <div
                v-if="['blendjet-one'].includes(product.handle)"
                class="media-content__main__details__specs__list"
              >
                <ul>
                  <li>Compact Size: 9” x 3” (230mm x 76mm)</li>
                  <li>Product Weight: 1 lb (.45 kg)</li>
                  <li>12 oz Jar (475 mL)</li>
                  <li>10+ Blends Per 1 Hour Charge</li>
                  <li>Micro-USB Port</li>
                  <li>2000 mAh Rechargeable Battery</li>
                  <li>7.4V Electric Motor</li>
                  <li>6-Point Stainless Steel Blade</li>
                  <li>Durable Built-In Carrying Strap</li>
                </ul>
              </div>
              <div v-else class="media-content__main__details__specs__list">
                <ul>
                  <li>Compact Size: 9” x 3” (230mm x 76mm)</li>
                  <li>Product Weight: 1.34 lb (.61 kg)</li>
                  <li>Jar w/ Measurement Markings: 16 oz (475 mL)</li>
                  <li>15+ Blends Per 1 Hour Charge</li>
                  <li>Water-resistant USB-C Port</li>
                  <li>4000 mAh Rechargeable Battery</li>
                  <li>5V Electric Motor Spins 275 Times Per Second</li>
                  <li>6-Point Stainless Steel Blade</li>
                  <li>Durable Built-In Carrying Strap</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BLENDJET REVIEWS  -->
      <div class="reviews" id="reviews">
        <loox-product-reviews :product="product" />
      </div>

      <!-- JETPACKS CROSS-SELL -->
      <!-- TODO: THIS COMPONENT SHOULD BE VARIANT BASED -->
      <div class="jetpacks" v-if="loadDescription && productType == 'BlendJet'">
        <JetpackCrossSell :heading="'Power up with Jetpacks'" />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import ProductPrice from '~/components/nacelle/ProductPrice'
import vClickOutside from 'v-click-outside'
import ModelIcon from '~/components/ModelIcon'
import VarietySelect from '~/components/VarietySelect'
import ProductOptions from '~/components/nacelle/ProductOptions'
import ProductOptionSwatch from '~/components/nacelle/ProductOptionSwatch'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'
import allOptionsSelected from '~/mixins/allOptionsSelected'
import availableOptions from '~/mixins/availableOptions'
import carouselDragEvents from '~/mixins/carouselDragEvents'
import ShippingTime from '~/components/shippingTime'
import ProductMediaTile from '~/components/ProductMediaTile'

import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import { createClient } from '~/plugins/contentful.js'

import imageOptimize from '~/mixins/imageOptimize'
import debounce from 'lodash.debounce'
import { cloneDeep } from 'lodash'
import Guarantee from '~/components/svg/30dayGuarantee'
import Close from '~/components/svg/modalClose'
import Info from '~/components/svg/info'
import CaretDown from '~/components/svg/caretDown'
import BlnExtend from '~/components/svg/blnExtend'
import NextSlide from '~/components/svg/NextSlide'
import PrevSlide from '~/components/svg/PrevSlide'
const VideoContainer = () => import('~/components/VideoContainer')
const JetpackCrossSell = () => import('~/components/jetpackCrossSellVariants')

export default {
  data() {
    return {
      imageStyle: {
        height: '252px',
        width: 'auto'
      },
      currentVariant: null,
      extend1yr: null,
      extend2yr: null,
      extend3yr: null,
      warrantySelected: {},
      quantity: 1,
      variants: [],
      selectedOptions: [],
      showMobileVariants: false,
      showMobileHeader: false,
      showDesktopHeader: false,
      showHeaderVariants: false,
      loadDescription: false,
      scrollY: 0,
      screenWidth: null,
      heroUrl: null,
      imgWidth: 0,
      mcafeeLink: 'https://www.trustedsite.com/verify?host=blendjet.com',
      nortonLink: 'https://seal.digicert.com/seals/popup/?tag=6CDZP5Ti&url=blendjet.com',
      bbbLink:
        'https://www.bbb.org/us/ca/concord/profile/online-shopping/blendjet-1116-882016/#sealclick',
      description: [],
      variantMedia: {},
      applePay: false,
      country: 'US',
      currency: 'USD',
      displayPrice: 0,
      compareAtPrice: 0,
      heroIndex: 0,
      variantIndex: 0,
      showAfterPay: false,
      metaTitle: null,
      metaDescription: null,
      selectedBundle: cloneDeep(this.bundles),
      selectedBundleVarietyPack: cloneDeep(this.bundleVarietyPack),
      bundleTitle: this?.page?.fields?.bundles?.fields?.title,
      bundleVarietyOptions: [],
      selectedVarieryPackIndex: 0,
      varietyPackImage: [],
      imageInterval: null,
      bundleOptionsSelectorActive: {},
      varietyBundleSelectorActive: false,
      bundleSelectorVisible: false,
      varietyPackSelectorOptions: [],
      variantShippingOffset: null,
      variantShippingDate: null,
      productShippingOffset: null,
      productShippingDate: null,
      specialEdition: '',
      imageIndex: []
    }
  },
  components: {
    VarietySelect,
    ProductPrice,
    JetpackCrossSell,
    Guarantee,
    Close,
    Info,
    CaretDown,
    RichTextRenderer,
    ModelIcon,
    ProductOptions,
    ProductOptionSwatch,
    QuantitySelector,
    ProductAddToCartButton,
    ShippingTime,
    BlnExtend,
    NextSlide,
    PrevSlide,
    ProductMediaTile,
    VideoContainer
  },
  mixins: [imageOptimize, availableOptions, allOptionsSelected, carouselDragEvents],
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    page: {
      type: Object,
      default: () => {}
    },
    productType: {
      type: String
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
  computed: {
    ...mapState('user', ['locale']),
    ...mapGetters('cart', ['cartBalance']),
    hasBundle() {
      return !!this.bundles.length
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapMutations('cart', ['setCartError']),
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem'
    ]),
    ...mapActions('checkout', ['processCheckout']),
    addHashToLocation() {
      window.history.replaceState(
        {},
        null,
        this.$route.path + '?variant=' + this.formatVariantId(this.currentVariant.id)
      )
    },
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
    formatVariantId(value) {
      const url = atob(value)
      return url.replace('gid://shopify/ProductVariant/', '')
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
    setDefaultVariant() {
      if (this.currentVariant) {
        return this.currentVariant
      } else if (this.product && this.product.variants && this.product.variants.length) {
        if (this.$route.query && this.$route.query.variant) {
          const variantId = btoa(`gid://shopify/ProductVariant/${this.$route.query.variant}`)
          const foundVariant = this.product.variants.filter(variant => {
            return variant.id === variantId
          })
          if (foundVariant?.length) {
            return foundVariant[0]
          } else {
            return this.product.variants[0]
          }
        } else {
          for (let i = 0; i < this.product.variants.length; i++) {
            if (this.product.variants[i].availableForSale === true) {
              return this.product.variants[i]
            }
          }
        }
      }
      return undefined
    },
    setCoutry(data) {
      this.country = data
      switch (this.country) {
        case 'US':
          this.showAfterPay = true
          break
        case 'NZ':
          this.showAfterPay = true
          break
        case 'CA':
          this.showAfterPay = true
          break
        case 'AU':
          this.showAfterPay = true
          break
        case 'GB':
          this.showAfterPay = true
          break
        default:
          this.showAfterPay = false
      }
    },
    setDisplayPrice(data) {
      this.displayPrice = data
    },
    setCompareAtPrice(data) {
      this.compareAtPrice = data
    },
    setCurrency(data) {
      this.currency = data
    },
    handleScroll(event) {
      this.scrollY = window.scrollY
      if (this.screenWidth > 768) {
        if (window.scrollY > 300) {
          this.showDesktopHeader = true
        } else {
          this.showDesktopHeader = false
          this.showHeaderVariants = false
        }
      } else {
        if (window.scrollY < 900) {
          this.showMobileHeader = false
          if (this.showMobileVariants) {
            this.showMobileVariants = false
          }
        } else {
          this.showMobileHeader = true
        }
      }

      if (window.scrollY > 300) {
        this.loadDescription = true
      }
    },
    camelize(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
    },
    kebabCase(str) {
      if (str && typeof str === 'string') {
        return str.toLowerCase().replace(' ', '-')
      }
      return ''
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
          this.imageIndex = []
          for (let i = 0; i < this.selectedBundleVarietyPack?.length; i++) {
            this.imageIndex[i] = 0
          }
          this.selectedBundleVarietyPack.forEach(({ variants }, index) => {
            this.$set(
              this.varietyPackImage,
              index,
              variants?.[(this.imageIndex[index] + 1) % variants.length]?.featuredMedia.thumbnailSrc
            )
            this.imageIndex[index]++
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
    updateVariant(variant) {
      this.currentVariant = variant
      this.variantIndex = this.variants.findIndex(
        variant => variant.title === this.currentVariant.title
      )
    },
    incrementVariant() {
      if (this.variantIndex === this.variants.length - 1) {
        this.variantIndex = 0
      } else {
        this.variantIndex++
      }
      const newVar = this.variants[this.variantIndex]
      this.updateVariant(newVar)
    },
    decrementVariant() {
      if (this.variantIndex === 0) {
        this.variantIndex = this.variants.length - 1
      } else {
        this.variantIndex--
      }
      const newVar = this.variants[this.variantIndex]
      this.updateVariant(newVar)
    },
    toggleMobileVariants() {
      this.showMobileVariants = !this.showMobileVariants
    },
    toggleHeaderVariants() {
      this.showHeaderVariants = !this.showHeaderVariants
    },
    selectWarranty(warranty) {
      if (this.warrantySelected.handle === warranty.handle) {
        this.warrantySelected = {}
      } else {
        this.warrantySelected = { ...warranty }
      }
    },
    iOS() {
      return (
        ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
          navigator.platform
        ) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
      )
    },
    productId() {
      if (this.product && this.product.pimSyncSourceProductId) {
        return Buffer.from(this.product.pimSyncSourceProductId, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      }

      return null
    },

    expressAdd() {
      const lineItem = {
        image: this.product.featuredMedia,
        title: this.product.title,
        variant: this.currentVariant,
        quantity: this.quantity || 1,
        productId: this.product.id,
        handle: this.product.handle,
        vendor: this.product.vendor,
        tags: this.product.tags,
        metafields: []
      }

      if (Object.keys(this.warrantySelected).length) {
        const warrantyItem = {
          image: this.warrantySelected.featuredMedia,
          title: this.warrantySelected.title,
          variant: this.warrantySelected.variants[0],
          quantity: this.quantity || 1,
          productId: this.warrantySelected.id,
          handle: this.warrantySelected.handle,
          vendor: this.warrantySelected.vendor,
          tags: this.warrantySelected.tags,
          metafields: [
            {
              key: 'Ref',
              value: atob(this.currentVariant.id)
                .split('/')
                .pop()
            }
          ]
        }
        this.addLineItem(warrantyItem)
      }
      this.addLineItem(lineItem)
    },

    async expressCheckout() {
      if (this.currentVariant.availableForSale) {
        await this.expressAdd()
        if (this.cartBalance) {
          try {
            await this.processCheckout({
              async beforeCreate() {
                // Allows processing of cart before checkout creation.
              },
              async beforeRedirect() {
                // Allows processing after checkout create and before redirecting.
              }
            })
          } catch (err) {
            console.log(err)
            this.setCartError(err)
          }
        } else {
          this.showCart()
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
      var variantId = Buffer.from(variant.id, 'base64')
        .toString('binary')
        .split('/')
        .pop()
      var referrer = document.referrer.includes('marketplace') ? document.referrer : ''
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
                product_id: this.productId(),
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
      // console.log('wdl:', window.dataLayer)
    }
  },
  watch: {
    // Variant from mixin
    selectedVariant() {
      this.updateVariant(this.selectedVariant)
    },
    // varietyBundleSelectorActive(newVal) {
    //   if (newVal) {
    //     // lighten other bundle items
    //     for (let i = 0; i < 10; i++) {
    //       if (this.bundleOptionsSelectorActive[i] === true) {
    //         this.$set(this.bundleOptionsSelectorActive, i, false)
    //       }
    //     }
    //   }
    // },
    // Local Variant
    currentVariant() {
      if (this.variantMedia[this.camelize(this.currentVariant.title)]) {
        const variantImage = this.variantMedia[this.camelize(this.currentVariant.title)]
          .productImage
          ? this.variantMedia[this.camelize(this.currentVariant.title)].productImage
          : this.currentVariant.featuredMedia.src
        this.productImage = variantImage
        this.heroImages = this.variantMedia[this.camelize(this.currentVariant.title)].heroImages
        this.variantShippingOffset = this.variantMedia[
          this.camelize(this.currentVariant.title)
        ].shippingOffset
        this.variantShippingDate = this.variantMedia[
          this.camelize(this.currentVariant.title)
        ].shippingDate
      } else {
        this.productImage =
          'https://nacelle-assets.s3-us-west-2.amazonaws.com/default-product-image.svg'
        this.heroImages = []
      }
      this.heroIndex = 0
      this.specialEdition = this.variantMedia?.[
        this.camelize(this.currentVariant.title)
      ].specialEdition

      // const variantId = atob(this.currentVariant.id)
      //   .split('/')
      //   .pop()
      // const path = `${this.$route.path}?variant=${variantId}`

      // this.$router.push(path)
      this.addHashToLocation()
      this.elevarProductView()
      this.updateBundle()
    },
    quantity() {
      // Outsmartly discussed with John and both agreed it doesn't make sense to fire a "ViewContent"
      // event just because quantity changed. Removing this as noise.
      // this.elevarProductView())
    }
  },

  async mounted() {
    if (process.client) {
      this.client = createClient()
      this.extend1yr = await this.$nacelle.data.product({
        handle: '8862eff0-e8c2-47bc-a194-157f853043ec-10003-blendjet-adh-replace-1y'
      })
      this.extend2yr = await this.$nacelle.data.product({
        handle: '8862eff0-e8c2-47bc-a194-157f853043ec-10003-blendjet-adh-replace-2y'
      })
      this.extend3yr = await this.$nacelle.data.product({
        handle: '8862eff0-e8c2-47bc-a194-157f853043ec-10002-blendjet-adh-replace-3y'
      })

      this.screenWidth = window.innerWidth
      this.imgWidth = 2600

      this.variants = this.product.variants.filter(variant => variant.availableForSale)

      if (window.ApplePaySession) {
        this.applePay = true
      }
      const vm = this

      // Try to query this product's contentful data
      // Note - You can't use Nacelle's SDK due to a bug when querying content models with the title `product`
      await this.client
        .getEntries({
          content_type: 'product',
          'fields.handle': this.product.handle
        })
        .then(data => {
          if (!data || !Array.isArray(data.items) || data.items.length === 0) {
            // No content model found...
          } else {
            // Get first item
            const item = data.items[0]

            // For each variant content model...
            if (item.fields.variants) {
              item.fields.variants.forEach(node => {
                const productImage = node.fields.productImage
                  ? `https:${node.fields.productImage.fields.file.url}?w=2100`
                  : null
                vm.variantMedia[node.fields.title] = {
                  productImage: productImage,
                  heroImages: node.fields.heroImages.map(image => {
                    return `${image.fields.file.url}?w=2100`
                  }),
                  specialEdition: this.kebabCase(node.fields.specialEdition),
                  shippingOffset: node.fields.shippingOffset || null,
                  shippingDate: node.fields.shippingDate || null
                }
              })
            }
            const sections = item.fields.productDescription
            vm.specs = sections.pop()

            vm.description = sections

            if (item.fields.metaTitle) {
              this.metaTitle = item.fields.metaTitle
            }

            if (item.fields.metaDescription) {
              this.metaDescription = item.fields.metaDescription
            }

            if (item.fields.shippingOffset) {
              this.productShippingOffset = item.fields.shippingOffset
            }

            if (item.fields.shippingDate) {
              this.productShippingDate = item.fields.shippingDate
            }

            this.currentVariant = this.setDefaultVariant()
          }
        })
        .catch(console.error)

      /*
      // Original Code - Fetching a hard coded content model by its ID
      await this.client.getEntry('3h7GKFvs4RzAFkwj6H1XuQ')
          .then((entry) => {
            entry.fields.variants.forEach((node) => {
              vm.variantMedia[node.fields.title] = {
                productImage: `https:${node.fields.productImage.fields.file.url}?w=2100`,
                heroImages: node.fields.heroImages.map((image) => {
                  return `${image.fields.file.url}?w=2100`
                })
              }
            })

            let sections = entry.fields.productDescription
            vm.specs = sections.pop()

            vm.description = sections.map((node) => {
              return {
                heading: node.fields.heading,
                text: node.fields.text.content.map((p) => {
                  return p.content.map((line) => {
                    return line.value
                  })
                }),

                video: node.fields.video ? node.fields.video.fields.file.url : ''
              }
            })

            if(entry.fields.metaTitle) {
              this.metaTitle = entry.fields.metaTitle
            }

            if(entry.fields.metaDescription) {
              this.metaDescription = entry.fields.metaDescription
            }

            this.currentVariant = this.setDefaultVariant()
          })
          .catch(console.error) */

      this.handleScroll()
      this.handleDebouncedScroll = debounce(this.handleScroll, 0)

      window.addEventListener('scroll', this.handleDebouncedScroll, {
        passive: true
      })
    }
  },
  beforeRouteLeave() {
    clearInterval(this.imageInterval)
  },
  beforeDestroy() {
    clearInterval(this.imageInterval)
    if (process.client) {
      window.removeEventListener('scroll', this.handleDebouncedScroll)
    }
  }
}
</script>
<style lang="scss" scoped>
.price {
  margin-bottom: 1rem;
}

.product-select {
  display: flex;
  flex-flow: row nowrap;
  min-height: 900px;
  &.has-bundle {
    min-height: 1070px;
    @include respond-to('small') {
      min-height: auto;
    }
  }
  @include respond-to('small') {
    height: auto;
    min-height: none;
    flex-flow: row wrap;
  }

  &__image-carousel {
    background-image: linear-gradient(to bottom, #ededf5 1%, #ffffff 49%);
    width: 65%;
    display: flex;
    justify-content: center;
    height: 900px;
    position: relative;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */

    &.has-bundle {
      height: 1070px;
      @include respond-to('small') {
        height: 400px;
      }
    }
    @include respond-to('small') {
      width: 100%;
      padding-top: 0px;
      height: 400px;
    }

    &__prev-variant {
      position: absolute;
      top: 50%;
      left: 20px;
      cursor: pointer;
      @include respond-to('small') {
        left: 10px;
      }
    }

    &__next-variant {
      position: absolute;
      top: 50%;
      right: 20px;
      cursor: pointer;
      @include respond-to('small') {
        right: 10px;
      }
    }

    &__img-container {
      width: 100%;
      &.auto-width {
        width: auto;
      }
    }

    &__img {
      height: 900px;
      object-fit: cover;
      object-position: center;
      width: 100%;
      &.has-bundle {
        height: 1070px;
        @include respond-to('small') {
          height: 400px;
        }
      }
      @include respond-to('small') {
        height: auto;
        height: 400px;
      }
    }
  }

  &__controls {
    width: 35%;
    min-width: 550px;
    display: flex;
    flex-flow: column nowrap;
    background-color: $primary-purple-tint;
    text-align: center;
    padding: 0 75px 30px 75px;
    height: 900px;
    &.has-bundle {
      height: 1070px;
      @include respond-to('small') {
        height: auto;
      }
    }

    @include respond-to('small') {
      padding: 0;
      width: 100%;
      min-width: auto;
      height: auto;
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
      margin-top: 45px;
      color: $primary-purple;
      margin-bottom: 7px;
      text-align: center;
      text-transform: uppercase;

      @include respond-to('small') {
        font-size: 24px;
        line-height: 1.17;
        margin-top: 4px;
        margin-bottom: 4px;
      }
    }

    &__rating {
      display: flex;
      justify-content: center;
      font-family: Regular;
      font-size: 13px;
      color: $primary-purple;

      margin-bottom: 10px;

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
      margin-bottom: 31px;
      text-align: center;

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
        text-align: center;

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

      &__swatches {
        min-height: 170px;
        @include respond-to('small') {
          height: auto;
          min-height: 115px;
        }
      }
    }

    &__add-to-cart {
      ::v-deep .add-to-cart-button {
        width: 275px;
      }
      @include respond-to('small') {
        height: 75px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__button-group {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 1s ease-in-out;

        @include respond-to('small') {
          justify-content: space-between;
        }
      }

      &__add-to-cart-button {
        ::v-deep .add-to-cart-button {
          @include respond-to('small') {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      }

      &__mobile-float {
        @include respond-to('small') {
          position: fixed;
          width: 100%;
          bottom: 0;
          background-color: $primary-purple-tint;
          z-index: 10;
          height: 75px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &__selected-swatch {
        ::v-deep .bubble {
          margin-left: 0;
          margin-bottom: 0;
        }

        @media screen and (min-width: 768px) {
          display: none;
        }
      }

      &__quantity-select-container {
        margin-right: 10px;
        @include respond-to('small') {
          margin-right: 5px;
          margin-left: 2px;
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
      margin-top: 20px;
      height: 40px;
      text-transform: uppercase;

      @include respond-to('small') {
        margin-top: 10px;
        margin-bottom: 15px;
        height: auto;
      }

      &__label {
        color: $primary-purple;
      }

      &__countdown {
        color: $secondary-purple-2;
      }
    }

    &__extend-warranty {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      margin-bottom: 25px;
      cursor: pointer;
      @include respond-to('small') {
        margin-bottom: 10px;
      }

      &__text {
        font-family: Regular;
        margin-bottom: 15px;
        color: $primary-purple;
        font-size: 13px;
        letter-spacing: 0.46px;
        line-height: 1.38;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &__logo {
        margin-left: 7px;
      }

      &__button-group {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
      }

      &__button {
        font-size: 10px;
        letter-spacing: 0.83px;
        line-height: 1.4;
        padding: 0 16px;

        display: flex;
        align-items: center;
        cursor: pointer;

        @include respond-to('small') {
          padding: 0 10px;
        }

        &:first-child {
          margin-right: 7px;
        }

        &:last-child {
          margin-left: 7px;
        }
      }
    }

    &__payments {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 10px;

      &__paypal {
        @include button-primary('purple-ghost');
        width: 370px;
        background-color: #ffc51f;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        margin-bottom: 15px;
        margin-top: 20px; //hack to fix shipping counter on BJ2 page
        border: none;

        @media screen and (max-width: 320px) {
          width: 300px;
        }

        &__logo {
          height: 19px;
          margin-left: 10px;
        }
      }

      &__more-options {
        @include button-primary('purple-ghost');
        width: 370px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        @media screen and (max-width: 320px) {
          width: 300px;
        }
      }
    }

    &__value-props {
      display: flex;
      flex-flow: column nowrap;

      &__guarantee {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        cursor: pointer;

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
            margin-right: 25px;
          }
          &:last-child {
            margin-left: 25px;
          }
        }
      }
    }
  }
}

.mobile-swatch {
  margin-right: 5px;
  ::v-deep .bubble .inside-color {
    height: 44px;
    width: 44px;
  }
}

.extend-active {
  @include button-primary('purple');
  border: 2px solid #373975;
  height: 30px;
  padding: 0 16px;
  font-size: 10px;
  @include respond-to('small') {
    padding: 0 10px;
  }
}

.extend-inactive {
  @include button-primary('purple-ghost');
  height: 30px;
  padding: 0 16px;
  font-size: 10px;
  @include respond-to('small') {
    padding: 0 10px;
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

.extend-modal {
  &__container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    padding: 25px;
    font-family: Regular;
    font-size: 14px;
    line-height: 1.33;
    letter-spacing: 0.5px;
    color: $primary-purple;
  }

  &__svg-container {
    margin-bottom: 20px;
  }

  &__text {
    max-width: 340px;

    &__block {
      margin-bottom: 15px;
    }

    &__list {
      &__subheading {
        font-size: 16px;
        font-family: Bold;
        letter-spacing: 2.5px;
        margin-bottom: 15px;
      }

      &__items {
        display: list-item;
        list-style-type: disc;
        text-align: left;
      }
    }

    &__plan-details {
      font-size: 14px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }

  &__why-choose {
    &__support {
      display: flex;
      align-items: center;

      margin-bottom: 15px;

      &__icon {
        margin-right: 10px;
      }
    }

    &__fees {
      display: flex;
      align-items: center;

      &__icon {
        margin-right: 10px;
      }
    }
  }
}

.apple-pay-with {
  width: 370px;

  @media screen and (max-width: 320px) {
    width: 300px;
  }
}

.pay-with-modal {
  &__container {
    padding: 1rem;
    display: flex;
    justify-content: center;
    // align-items: center;
    flex-flow: column nowrap;

    &__text {
      font-family: Bold;
      color: $primary-purple;
      font-size: $text-small;
      text-transform: uppercase;
      line-height: 1.17;
      letter-spacing: 1.75px;
      margin-bottom: 20px;
      text-align: center;
    }
    &__amazon {
      @include button-primary('white');
      background-color: #ffc51f;
      height: 50px;
      margin-bottom: 15px;
    }

    &__apple {
      @include button-primary('white');
      background-color: black;
      height: 50px;
      margin-bottom: 15px;
    }

    &__paypal {
      @include button-primary('white');
      background-color: #ffc51f;
      height: 50px;

      &__logo {
        height: 19px;
      }
    }
  }
}

.mobile-variant-select {
  position: fixed;
  bottom: 75px;
  background-color: $primary-purple-tint;
  width: 100%;
  // height: 220px;
  z-index: 10;
  padding-top: 20px;

  &__shipping {
    font-size: $text-small;
    font-family: Bold;
    line-height: 1.33;
    letter-spacing: 1.75px;
    text-transform: uppercase;
    color: $secondary-purple-2;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

.blendjet-banner {
  height: auto;
  min-height: 205px;
  padding-top: 20px;
  padding-bottom: 20px;
  @include gradient-primary-purple-turquoise(to bottom right);
  display: flex;
  justify-content: center;
  align-items: center;

  &__content-block {
    max-width: 700px;
    color: $grayscale-white;
    text-align: center;
    font-family: Medium;

    @include respond-to('small') {
      width: auto;
      padding: 15px;
    }

    a {
      color: #ffd900;
    }

    h2 {
      font-size: 24px;
      line-height: 1.17;
      letter-spacing: 4px;
      margin-bottom: 15px;
      text-transform: uppercase;
    }

    &__content {
      font-size: 16px;
      line-height: 1.25;
      letter-spacing: 0.5px;
    }
  }
}

.header-product-select {
  height: 110px;
  background-color: $grayscale-white;
  display: flex;
  position: fixed;
  width: 100%;
  top: 100px;
  z-index: 10;
  padding-right: 45px;
  padding-left: 45px;

  @include respond-to('small') {
    display: none;
  }

  &__thumbnail {
    &__img {
      height: 75px;
    }
  }

  &__info-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 50%;
  }

  &__controls-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 50%;
  }

  &__title-container {
    margin-left: 32px;
    &__title {
      font-family: Medium;
      font-size: 24px;
      line-height: 1.33;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: $primary-purple;
    }

    &__price {
      font-size: $text-small;
      font-family: Bold;
      line-height: 1.17;
      letter-spacing: 1.75px;
      color: $primary-purple;
    }
  }

  &__swatches {
    margin-right: 20px;
  }

  &__add-buttons {
    .add-to-cart-buttons {
      display: flex;
      > * + * {
        margin-left: 15px;
      }
    }
  }
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
      width: 100%;
      object-fit: cover;
      object-position: center;
      @include respond-to('small') {
        height: 400px;
      }
    }
  }

  &__hero-banner {
    &__img {
      object-position: center;
      object-fit: cover;
    }
  }

  &__main {
    display: flex;
    flex-flow: row wrap;

    &__features {
      background-color: #33499d;
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
          max-width: 475px;

          @include respond-to('small') {
            font-size: 18px;
            line-height: 1.22;
            letter-spacing: 2.5px;
            padding: 0 15px;
          }
        }

        &__text {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.51px;
          line-height: 1.29;
          color: $grayscale-gray;
          text-align: center;
          margin-bottom: 35px;
          padding-right: 15px;
          padding-left: 15px;
        }

        &__media {
          &__video {
            width: 520px;
            object-fit: contain;

            @include respond-to('small') {
              height: auto;
              width: 100%;

              video {
                width: 100%;
              }
            }
          }
        }

        &__image-container {
          display: flex;
          justify-content: center;
        }

        &__img {
          border-radius: 12px;
          object-fit: cover;
          object-position: center;
          @include respond-to('small') {
            border-radius: 0;
          }
        }
      }

      &__specs {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        width: 520px;
        padding: 0 20px;
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
        }

        &__text {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.5px;
          line-height: 1.29;
          color: $grayscale-gray;
          text-align: center;
          margin-bottom: 35px;
          padding: 0 15px;
        }

        &__list {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.5px;
          line-height: 1.29;
          color: $grayscale-gray;
          & ul {
            list-style-type: square;
            padding: 0 35px;
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

.reviews {
  height: auto;
  padding: 20px;
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}

.dropbtn {
  color: $primary-purple;
  outline: none;
  display: flex;
  align-items: center;
  z-index: 10;
  width: 100%;

  &__swatch {
    ::v-deep .inside-color {
      width: 30px;
      height: 30px;
    }
  }

  &__caret-down {
    position: absolute;
    right: 15px;
  }
}

/* The container <div> - needed to position the dropdown content */
.dropdown:not(.variant-dropdown) {
  position: relative;
  color: $primary-purple;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border: 2px solid $grayscale-black;
  border-radius: 25px;
  align-items: center;
  width: 231px;
  font-family: Bold;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  font-size: $text-small;
  background-color: $grayscale-white;
  cursor: pointer;
  &:focus {
    outline: none;
  }
}

.dollar-strike {
  text-decoration: line-through;
  opacity: 0.3;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  position: absolute;
  top: -0.5px;
  background-color: $grayscale-white;
  border-radius: 25px;
  width: 231px;
  min-width: 160px;
  box-shadow: none;
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  border: 2px solid $grayscale-black;
  border-top: none;
  font-family: Bold;
  text-transform: uppercase;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;

  &__swatches {
    margin-top: 60px;
  }
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}

.slide-enter-active {
  animation: slideInLeft;
  animation-duration: 0.6s;
}

.slide-leave-active {
  animation: slideOutLeft;
  animation-duration: 0.6s;
}

.carousel-arrow .icon {
  background: #f6f5fd !important;
}

.expand-enter-active {
  animation: expand 0.6s;
}
.expand-leave-active {
  animation: expand 0.6s reverse;
}
@keyframes expand {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

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
  font-size: 24px;
  font-family: Medium;
  letter-spacing: 4px;
  line-height: 1.17;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 48px;
}

.features-column {
  width: 60%;
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
.has-special-edition {
  &.lisa-frank {
    .blendjet-banner {
      background: linear-gradient(to bottom right, #e9008d 0, #05aded);
    }
    .media-content__main__features {
      background: #05aded;
    }
    .add-to-cart-button {
      background: #05aded;
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
