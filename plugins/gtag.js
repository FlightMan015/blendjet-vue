export default () => {
  if (typeof window !== "undefined") {
    const rootScript = document.getElementsByTagName("script")[0]
    const gtagScript = document.createElement("script")
    gtagScript.type = "text/javascript"
    gtagScript.defer = true
    gtagScript.src =
      "https://www.googletagmanager.com/gtag/js?id=AW-758185293"
    rootScript.parentNode.insertBefore(gtagScript, rootScript)

    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      dataLayer.push(arguments)
    }
    window.gtag("js", new Date())
    window.gtag("config", "AW-758185293")
    window.gtag("config", "AW-800828740")
    window.gtag('config', 'AW-707656444'); 
    window.gtag('config', 'DC-9973664');
  }
}