import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('user', ['country'])
  },
  methods: {
    /**
     * Checks a section for the `displayCountries` field.
     * If present, compares the value to the user's country
     * to determine if the section should render.
     * @param {Object} contentModel - a contentful content model
     * @return {Boolean} - whether the section should render for the user's detected country
     */
    isVisibleToUserCountry(contentModel) {
      const displayCountries = contentModel?.fields?.displayCountries || null
      const isVisible = Array.isArray(displayCountries)
        ? displayCountries.indexOf(this.country) !== -1
        : true

      return isVisible
    }
  }
}
