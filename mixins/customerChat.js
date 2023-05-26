let shown = true
let source = null

function canChangeState(newSource, show) {
    return (source === null || source === newSource) && shown !== show
}

function updateState(newSource, show) {
    if (source === null) {
        source = newSource
        shown = show

        return
    }

    if (source === newSource) {
        source = null
        shown = show

        return
    }
}

export default {
    beforeMount() {
        let count = 0
        const intervalId = setInterval(() => {
            try {
                // Facebook SDK can be prohibited by AdBlockers, we don't want to run this check in every second.
                if ((count++) >= 10) {
                    window.console.warn('window.FB is prohibited, cannot handle its events.')
                    clearInterval(intervalId)
                    return
                }

                if (window?.FB) {
                    window.FB.Event.subscribe('customerchat.load', () => {
                        if (!shown) {
                            window.FB.CustomerChat.hide()
                        }
                    })

                    clearInterval(intervalId)
                } else {
                    window.console.warn('window.FB is not rendered.')
                }
            } catch (error) {
                window.console.error('Error happend while dealing with Customer Chat', error)
            }
        }, 1000)
    },
    methods: {
        showCustomerChat(source) {
            this.toggleCustomerChat(source, true)
        },
        hideCustomerChat(source) {
            this.toggleCustomerChat(source, false)
        },
        toggleCustomerChat(source, show = null) {
            if (canChangeState(source, (show === null ? !shown : show))) {
                if (!shown) {
                    window?.FB?.CustomerChat?.show(false)
                } else {
                    window?.FB?.CustomerChat?.hide()
                }

                updateState(source, !shown)
            }
        }
    }
}
