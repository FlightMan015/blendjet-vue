export default {
  methods: {
    decodeBase64Id(encodedId) {
      if (encodedId && typeof encodedId === "string") {
        const base64id = encodedId.split("::").shift()
        return Buffer.from(base64id, "base64")
          .toString("binary")
          .split("/")
          .pop()
      }
    }
  }
}
