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

    openSettingsPage() {
        this.openSettings.fn();
    }

    reset() {
        this.shadowRoot.querySelector('subtitle-selection-container').onResetAllSubtitleSelections();
        this.shadowRoot.querySelector("current-loaded-subtitle-info").manualReset();
    }
}

customElements.define(PlussubAppElement.is, PlussubAppElement);
