export default {
  methods: {
    formatFollowCount(followers, decimal = 0) {
      if (!followers) {
        return null
      }
      let count = Number(followers)
      count = count / 1000
      if (count / 1000 >= 1) {
        count = count / 1000
        count = count.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0]
        count = count + 'M'
      } else {
        const split = count.toString().split('.')
        const units = split[1].substring(0, decimal)
        if (units) {
          count = split[0] + '.' + units
        } else {
          count = split[0]
        }
        count = count + 'K'
      }
      return count
    }
  }
}
