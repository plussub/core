/**
 * Created by sbreitenstein on 17/01/17.
 */
class PlussubAppElement extends Polymer.Element {
    static get is() {
        return "plussub-app";
    }
    
    ready(){
        super.ready();
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.sendHeartBeat());
    }

    static get properties() {
        return {
            selectedMode: {
                type: String,
                value: "0",
                notify: true
            },
            openSettings: {
                type: Object,
                value: () => Object.assign({fn: () => chrome.tabs.create({url: "/src/html/option.html"})})
            }
        }
    }

    openSettingsPage() {
        this.openSettings.fn();
    }

    debugConsole() {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.toggleShowDebugConsole());
    }

    reset() {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.removeLoadedSubtitle());
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.resetMovieInfo());
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.triggerSubtitleSearchReset());
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.triggerMovieSearchReset());
    }
}

customElements.define(PlussubAppElement.is, PlussubAppElement);
