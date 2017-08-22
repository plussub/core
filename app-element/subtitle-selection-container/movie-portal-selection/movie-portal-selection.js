/**
 * Created by sbreitenstein on 19/01/17.
 */
class PlussubMoviePortalSelectionElement extends Polymer.Element {
    static get is() {
        return "movie-portal-selection";
    }

    async ready() {
        this.classList.add("subtitle-selection-element");
        this.addEventListener("refreshSubtitle",this.retargetingSelectionElement);
        this.addEventListener("resetSubtitle",this.retargetingSelectionElement);

        super.ready();
    }

    static get properties() {
        return {
            simpleName: {
                type: String,
                value: 'Movie Portal Selection'
            }
        }
    }

    retargetingSelectionElement (event) {
        Object.assign(event.detail, {selectionElement: this});
    }

    openThemoviedb () {
        chrome.tabs.create({url: this.$.themoviedbLink.href});
    }

    openOpenSubtitle () {
        chrome.tabs.create({url: this.$.openSubtitleLink.href});
    }

    reset(){
        this.$.movieSelectize.currentSelected = null;
        this.$.subtitleSelectize.currentSelected = null;
    }
}

customElements.define(PlussubMoviePortalSelectionElement.is, PlussubMoviePortalSelectionElement);