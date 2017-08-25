/**
 * Created by sbreitenstein on 19/01/17.
 */
class PlussubSubtitleSelectionContainerElement extends Polymer.Element {

    static get is() {
        return "subtitle-selection-container";
    }

    ready(){
        super.ready();
    }
}

customElements.define(PlussubSubtitleSelectionContainerElement.is, PlussubSubtitleSelectionContainerElement);
