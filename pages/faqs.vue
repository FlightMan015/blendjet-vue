<template>
  <div class="page-container">
    <div class="page-heading">
      {{ title }}
    </div>

    <div class="faq-container">
      <div v-for="faq in faqList" :key="faq.sys.id" class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">{{ faq.fields.title }}</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              <RichTextRenderer :document="faq.fields.description" />
            </div>
          </template>
        </Collapse>
      </div>
    </div>
  </div>
</template>

<script>
import Collapse from '~/components/collapse'
import { createClient } from '~/plugins/contentful.js'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
const client = createClient()
export default {
  components: {
    RichTextRenderer,
    Collapse
  },
  async asyncData() {
    const faqPage = await client.getEntry('14wksLiEhIb1GivTNvi8pZ').then(async res => {
      return res
    })
    return {
      title: faqPage?.fields?.title,
      faqList: faqPage?.fields?.faqList,
      metaInfo: faqPage?.fields?.metaInfo
    }
  },

  head() {
    const meta = []
    const mdescription = this.metaInfo?.fields?.metaDescription
    const title = this.metaInfo?.fields?.metaTitle
    meta.push({
      hid: 'description',
      name: 'description',
      content: mdescription
    })

    return { title, meta }
  }
}
</script>
<style lang="scss">
.faq-container {
  .expand-panel {
    padding: 0 25px 15px 25px;
  }
}
</style>
<style lang="scss" scoped>
.page-container {
  @include gradient-primary-purple-turquoise(to bottom);
  width: 100vw;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  padding-bottom: 50px;
}

.page-heading {
  font-family: Medium;
  font-size: 38px;
  // color: $primary-purple;
  color: $grayscale-white;
  line-height: 1.29;
  letter-spacing: 6px;

  margin-top: 60px;
  margin-bottom: 60px;

  @include respond-to('small') {
    font-size: 28px;
    letter-spacing: 3.5px;
    margin-top: 35px;
    margin-bottom: 35px;
  }
}

.c-heading {
  font-family: Bold;
  font-size: 18px;
  line-height: 1.33;
  letter-spacing: 3.5px;
  color: $primary-purple;
  text-transform: uppercase;
  margin-right: 35px;
  // width: 810px;

  @include respond-to('small') {
    font-size: $text-small;
    line-height: 1.5;
    letter-spacing: 1.75px;
  }
}

.faq-container {
  width: 900px;

  @include respond-to('small') {
    width: 90vw;
  }
}

.faq-expand {
  font-family: Regular;
  font-size: 14px;
  letter-spacing: 0.5px;
  line-height: 1.21;
  color: $primary-purple;

  & p {
    margin-bottom: 15px;
  }
}

.faq-section {
  margin-bottom: 35px;

  @include respond-to('small') {
    margin-bottom: 20px;
  }
}
</style>
