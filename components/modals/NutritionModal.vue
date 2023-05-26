<template>
  <modal name="nutrition-modal" width="300px" height="auto" :adaptive="true">
    <div slot="top-right" @click="$modal.hide('nutrition-modal')" class="nutrition-modal__close">
      <Close />
    </div>
    <div v-html="content" class="nutrition-modal"></div>
  </modal>
</template>

<script>
import Close from '~/components/svg/modalClose'

export default {
  props: {
    content: { type: String, default: null },
  },
  components: {
    Close
  }
}
</script>
<style lang="scss">

  .nutrition-modal {
    position: relative;

    &__close {
      cursor: pointer;
    }
  }
  // Legacy CSS
  // Ryan added for Nutrition Facts
  .nutrition-modal {
    @font-face {
      font-family: "AB-Alt";
      src: url("//cdn.shopify.com/s/files/1/0066/4433/4658/files/AB-Alt.eot"); /* IE9 Compat Modes */
      src: url("//cdn.shopify.com/s/files/1/0066/4433/4658/files/AB-Alt.eot?#iefix") format("embedded-opentype"), /* IE6-IE8 */
        url("//cdn.shopify.com/s/files/1/0066/4433/4658/files/AB-Alt.otf") format("opentype"), /* Open Type Font */
        url("//cdn.shopify.com/s/files/1/0066/4433/4658/files/AB-Alt.svg") format("svg"), /* Legacy iOS */
        url("//cdn.shopify.com/s/files/1/0066/4433/4658/files/AB-Alt.ttf") format("truetype"), /* Safari, Android, iOS */
        url("//cdn.shopify.com/s/files/1/0066/4433/4658/files/AB-Alt.woff") format("woff"), /* Modern Browsers */
        url("//cdn.shopify.com/s/files/1/0066/4433/4658/files/AB-Alt.woff2") format("woff2"); /* Modern Browsers */
    }
    .nutrition-facts {
      margin: 0 auto;
      border: solid 2px #000;
      display: block;
      font: normal 11px/1.1  "Helvetica Neue",  Helvetica, Arial, sans-serif;
      padding: 0 5px 0;
      width: 264px;
      color: #000;
      margin-top:40px;
    }
    .nutrition-facts p {
    padding: 0;
        font: "Helvetica Neue",  Helvetica, Arial, sans-serif;
    }
    .nutrition-facts strong {
    text-transform: none;
    color: #000;
    font-weight:bolder !important;
    }
    .nutrition-facts th, .nutrition-facts tr {
    padding: auto;
    background-color: white;
    }
    .nutrition-facts table {
    border: none;
    color: #000;
    margin:0;
    }
    .nutrition-facts tr td {
    border: none;
    }
    .nutrition-facts input {
      border: 0;
      width: 25px;
      text-align: right;
    }
    .nutrition-facts input.cals {
      width: 100px;
    }
    .nutrition-facts h5, .nutrition-facts thead, .nutrition-facts strong {
      font-family: "Arial Black", "AB-Alt", "Arial Bold", "Arial-BoldMT", sans-serif;
      letter-spacing: -.03em;
    }
    .nutrition-facts h5 {
      border-bottom: solid 1px #000;
      font-size: 32px !important;
      font-weight: 300 !important;
      margin: -3px 0 4px;
    }
    .nutrition-facts header p {
      font-size: 14px;
      margin: 2px 0 -3px;
    }
    .nutrition-facts header p strong {
      font-size: 15px;
    }
    .nutrition-facts header span {
      float: right;
    }
    .nutrition-facts table {
      border-collapse: collapse;
      width: 100%;
    }
    .nutrition-facts table th, .nutrition-facts table td {
      letter-spacing: -.03em;
    }
    .nutrition-facts table th {
      font-weight: normal;
    }
    .nutrition-facts table td {
      min-width: 1em;
    }
    .nutrition-facts table thead th, .nutrition-facts table thead td, .nutrition-facts table tbody th, .nutrition-facts table tbody td {
      text-align: left;
      font-size: 13px;
      border-top: solid 1px #000;
      padding: 2px 0 2px;
    }
    .nutrition-facts table thead th.indent, .nutrition-facts table thead td.indent, .nutrition-facts table tbody th.indent, .nutrition-facts table tbody td.indent {
      border-top: 0;
    }
    .nutrition-facts table thead th strong, .nutrition-facts table tbody th strong {
      font-family: "Arial Black", "AB-Alt", "Arial Bold","Arial-BoldMT", sans-serif;
    }
    .nutrition-facts table thead td:last-child, .nutrition-facts table tbody td:last-child {
      text-align: right;
    }
    .nutrition-facts table thead .daily-value th, .nutrition-facts table tbody .daily-value th {
      font-size: 11px;
      text-align: right;
    }
    .nutrition-facts table thead td, .nutrition-facts table thead th {
      border-bottom: solid 4px black;
      padding-top: 3px;
      line-height: 1em;
    }
    .nutrition-facts table thead th strong {
      font-size: 28px;
      line-height: 28px;
    }
    .nutrition-facts table thead th span {
      font-size: 34px;
      float: right;
      line-height: 24px;
    }
    .nutrition-facts table.main-nutrients {
      border-top: solid 10px #000;
      border-bottom: solid 10px #000;
      margin-top: 8px;
    }
    .nutrition-facts table.main-nutrients tbody td:last-child {
      font-family: "Arial Black","AB-Alt", "Arial Bold","Arial-BoldMT", sans-serif;
    }
    .nutrition-facts table.main-nutrients tbody td:last-child p {
      text-align: left;
    }
    .nutrition-facts table.additional-nutrients {
      border-bottom: solid 5px #000;
    }
    .nutrition-facts table.additional-nutrients td .spacer {
      width: 1em;
      text-align: center;
    }
    .nutrition-facts table.additional-nutrients td:last-child {
      font-weight: normal;
      font-family: arial, sans-serif;
    }
    .nutrition-facts table.voluntary-nutrients {
      border-bottom: solid 5px #000;
    }
    .nutrition-facts .footnote {
      font-size: 9px;
      height: 4em;
      margin: 6px 0 -3px;
      padding-left: 1em;
      position: relative;
    }
    .nutrition-facts .footnote:before {
      content: "*";
      position: absolute;
      left: 0;
    }
    .nutrition-facts table.mobile-layout tr:nth-child(even) td {
    background:white;
    }
    .nutrition-facts table.mobile-layout .column-title{
    display: none;
    }
    .nutrition-facts table.mobile-layout tr td {
        width: unset;
        display: table-cell;
        border-top: 1px solid #000 !important;
        border-left: none;
        float: unset;
    }
    .nutrition-facts table.mobile-layout thead {
    display: contents;
    }
    /* END OF nutrition-facts */
  }
</style>
