<template>
  <header>
    <div class="tags-date">
      <div v-if="hasTags" class="article-tags">
        {{ tags.join(', ') }}
      </div>
      <div v-if="hasTags" class="vertical-divider">
        |
      </div>
      <div class="article-published">
        {{ absoluteDate }}
      </div>
    </div>
    <!-- <slot name="tags" :tags="tags">
      <h5 v-if="hasTags" class="article-tags">{{ tags.join(', ') }}</h5>
    </slot> -->
    <slot name="title" :title="title">
      <div class="article-title">{{ title }}</div>
    </slot>

    <div class="social">
      <div class="social__icon">
        <ShareNetwork
          network="facebook"
          :url="`https://blendjet.com/blog/${article.handle}`"
          :title="article.title"
          :description="article.excerpt"
          tag="div"
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <title>fb</title>
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(-654.000000, -436.000000)">
                <g transform="translate(654.000000, 436.000000)">
                  <circle
                    id="Oval"
                    stroke="#4267B1"
                    stroke-width="1.5"
                    cx="16"
                    cy="16"
                    r="15.25"
                  ></circle>
                  <path
                    d="M16.6737536,23.9999619 L16.6737536,16.9999785 L19.0077934,16.9999785 L19.4521893,14.1043556 L16.6737536,14.1043556 L16.6737536,12.2253012 C16.6737536,11.4331278 17.0618752,10.6609434 18.306257,10.6609434 L19.5693765,10.6609434 L19.5693765,8.19561721 C19.5693765,8.19561721 18.4231085,8 17.3271944,8 C15.0390529,8 13.543451,9.38686803 13.543451,11.8974822 L13.543451,14.1043556 L11,14.1043556 L11,16.9999785 L13.543451,16.9999785 L13.543451,23.9999619 L16.6737536,23.9999619 Z"
                    fill="#4267B1"
                    fill-rule="nonzero"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </ShareNetwork>
      </div>
      <div class="social__icon">
        <ShareNetwork
          network="twitter"
          :url="`https://blendjet.com/blog/${article.handle}`"
          :title="article.title"
          tag="div"
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <title>tweet</title>
            <g id="Blog" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="D-BlendJet-Blog-Article" transform="translate(-704.000000, -436.000000)">
                <g id="social" transform="translate(654.000000, 436.000000)">
                  <g id="tweet" transform="translate(50.000000, 0.000000)">
                    <circle
                      id="Oval"
                      stroke="#1D96E0"
                      stroke-width="1.5"
                      cx="16"
                      cy="16"
                      r="15.25"
                    ></circle>
                    <path
                      d="M13.0355105,22.9948726 C19.0659831,22.9948726 22.3654443,17.9999504 22.3654443,13.6649693 C22.3654443,13.5228493 22.3654443,13.3806682 22.3552819,13.2385482 C22.9948678,12.7715388 23.5532771,12.1928659 23.9999008,11.5431482 C23.4110961,11.7969318 22.7715102,11.9797011 22.1115997,12.0507458 C22.7917738,11.6446799 23.3095338,11.005094 23.5532161,10.2436518 C22.9237315,10.6192917 22.2131009,10.8934 21.4720138,11.03552 C20.8729857,10.3959341 20.020235,10 19.0760539,10 C17.258828,10 15.7968869,11.4720729 15.7968869,13.279167 C15.7968869,13.5329811 15.8273434,13.7867647 15.878094,14.0304164 C13.1573363,13.8882659 10.73092,12.5888 9.11672707,10.5989671 C8.83242599,11.0862706 8.67004235,11.6446494 8.67004235,12.2537788 C8.67004235,13.3908305 9.24868477,14.3958941 10.1319224,14.9847293 C9.59389879,14.9644657 9.08624009,14.8121834 8.64971769,14.5685316 L8.64971769,14.6091199 C8.64971769,16.2030187 9.77663761,17.5227787 11.279167,17.8273739 C11.0050893,17.8984187 10.7106564,17.9390375 10.416254,17.9390375 C10.2030282,17.9390375 10,17.9187433 9.79693175,17.8882869 C10.2131905,19.1877833 11.4213175,20.1319339 12.862934,20.1624208 C11.736014,21.0456585 10.3248236,21.5634185 8.79186823,21.5634185 C8.51776,21.5634185 8.26397642,21.5532561 8,21.5228302 C9.45177877,22.4567879 11.1776352,22.9948726 13.0355105,22.9948726 Z"
                      id=""
                      fill="#1D96E0"
                      fill-rule="nonzero"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </ShareNetwork>
      </div>
      <div class="social__icon">
        <ShareNetwork
          network="linkedin"
          :url="`https://blendjet.com/blog/${article.handle}`"
          :title="article.title"
          tag="div"
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <title>pin</title>
            <g id="Blog" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="D-BlendJet-Blog-Article" transform="translate(-754.000000, -436.000000)">
                <g id="social" transform="translate(654.000000, 436.000000)">
                  <g id="pin" transform="translate(100.000000, 0.000000)">
                    <circle
                      id="Oval"
                      stroke="#0372B1"
                      stroke-width="1.5"
                      cx="16"
                      cy="16"
                      r="15.25"
                    ></circle>
                    <path
                      d="M10.8010058,11.6191585 C11.795105,11.6191585 12.6020115,10.7954929 12.6020115,9.80104503 C12.6020115,8.80689146 11.7951704,8 10.8010058,8 C9.80684117,8 9,8.80689146 9,9.80104503 C9,10.7954929 9.80657959,11.6191585 10.8010058,11.6191585 Z M17.4120614,23 L17.4120614,18.0411996 C17.4120614,16.7353676 17.6598097,15.4730568 19.2766636,15.4730568 C20.8700736,15.4730568 20.8935176,16.9630446 20.8935176,18.1249068 L20.8935176,23 L24,23 L24,17.4987706 C24,14.8067345 23.4214194,12.7341643 20.274098,12.7341643 C18.7610583,12.7341643 17.7468828,13.564533 17.3316912,14.3513805 L17.288171,14.3513805 L17.288171,12.9852858 L14.305579,12.9852858 L14.305579,23 L17.4120614,23 Z M12.3575984,23 L12.3575984,12.9852858 L9.24778094,12.9852858 L9.24778094,23 L12.3575984,23 Z"
                      id=""
                      fill="#0372B1"
                      fill-rule="nonzero"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </ShareNetwork>
      </div>
    </div>
    <!-- <slot name="author" :author="author">
      <p class="article-author">
        <span v-if="author.firstName">{{ author.firstName }}</span>
        <span v-if="author.lastName">{{ author.lastName }}</span>
      </p>
    </slot> -->
    <!-- <slot name="date" :date="absoluteDate">
      <p class="article-published">Published on {{ absoluteDate }}</p>
    </slot> -->
    <slot></slot>
  </header>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    author: {
      type: Object,
      default: () => {
        return {
          firstName: '',
          lastName: ''
        }
      }
    },
    tags: {
      type: Array,
      default: () => []
    },
    publishDate: {
      type: Number,
      default: -1
    },
    dateFormatString: {
      type: String,
      default: 'MMMM D, YYYY'
    },
    article: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    hasTags() {
      return this.tags && this.tags.length > 0
    },
    absoluteDate() {
      if (this.publishDate > -1) {
        return dayjs(this.publishDate * 1000).format(this.dateFormatString)
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.article-title {
  font-family: Medium;
  font-size: 54px;
  line-height: 1.19;
  letter-spacing: 10px;
  text-transform: uppercase;
  color: $primary-purple;
  max-width: 891px;
}

.tags-date {
  display: flex;
  justify-content: center;
  font-family: Bold;
  font-size: 16px;
  line-height: 0.88;
  letter-spacing: 2.33px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.social {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;

  &__icon {
    margin: 9px;
    cursor: pointer;
  }
}

.article-tags {
  color: $secondary-purple-3;
}

.vertical-divider {
  color: $grayscale-gray;
  margin: 0 1rem;
  // font-family:
}

.article-published {
  color: $grayscale-gray;
}
</style>
