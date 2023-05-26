let shown = false
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

function updateAdapterAttribute (value) {
    const adapter = window.OptiMonk.Visitor.createAdapter()
    adapter.attr('hidePopup', String(!!value))
}

export default {
    beforeMount() {
        let count = 0
        const intervalId = setInterval(() => {
            try {
                // Optimonk SDK can be prohibited by AdBlockers, we don't want to run this check in every second.
                if ((count++) >= 10) {
                    window.console.warn('Optimonk is not loaded.')
                    clearInterval(intervalId)
                    return
                }

                if (window?.OptiMonk?.Visitor) {
                    updateAdapterAttribute(shown)
                    clearInterval(intervalId)
                } else {
                    window.console.warn('Optimonk is not loaded.')
                }
            } catch (error) {
                window.console.error('Error happend while dealing with Optimonk', error)
            }
        }, 1000)
    },
    methods: {
        showOptimonkPopup() {
            this.toggleOptimonkPopup(source, true)
        },
        hideOptimonkPopup() {
            this.toggleOptimonkPopup(source, false)
        },
        toggleOptimonkPopup(source, show = null) {
            show = (show === null ? !shown : show)
            if (canChangeState(source, show)) {
                try {
                    updateAdapterAttribute(show)
                    updateState(source, !!show)
                } catch (error) {
                    window.console.error('There is no Optimonk campaign enabled.')
                }
            }
        }
    }
}