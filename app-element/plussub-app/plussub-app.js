/**
 * Created by sbreitenstein on 17/01/17.
 */
class PlussubAppElement extends Polymer.Element {
    static get is() {
        return "plussub-app";
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

    static triggerSubtitleSearchResetAction() {
        return {
            type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESET,
            meta: "appPage"
        };
    }

    static triggerMovieSearchResetAction() {
        return {
            type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESET,
            meta: "appPage"
        };
    }

    static removeLoadedSubtitleAction(){
        return {
            type: srtPlayer.Descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE,
            meta: "appPage"
        };
    }

    static resetMovieInfoAction(){
        return {
            type: srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.RESET,
            meta: "appPage"
        };
    }

    openSettingsPage() {
        this.openSettings.fn();
    }

    reset() {

        srtPlayer.Redux.dispatch(PlussubAppElement.removeLoadedSubtitleAction());
        srtPlayer.Redux.dispatch(PlussubAppElement.resetMovieInfoAction());
        srtPlayer.Redux.dispatch(PlussubAppElement.triggerSubtitleSearchResetAction());
        srtPlayer.Redux.dispatch(PlussubAppElement.triggerMovieSearchResetAction());

    }
}

customElements.define(PlussubAppElement.is, PlussubAppElement);
