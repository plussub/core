/**
 * Created by sbreitenstein on 19/01/17.
 */
class PlussubSubtitleSelectionContainerElement extends Polymer.mixinBehaviors([tms.ServiceChannelBehavior], Polymer.Element) {

    static get is() {
        return "subtitle-selection-container";
    }

    ready(){
        tms.ServiceChannelBehavior.ready.apply(this);
        this.addEventListener("refreshSubtitle",this.onRefreshSubtitle);
        this.addEventListener("resetAllSubtitleSelections",this.onResetAllSubtitleSelections);
        super.ready();
    }

    onRefreshSubtitle(event){
        Array.from(this.querySelectorAll(".subtitle-selection-element"))
            .filter((selection) => selection !== event.detail.selectionElement)
            .forEach((notActualSelection) => notActualSelection.reset());
    }

    onResetAllSubtitleSelections(){
        Array.from(this.querySelectorAll(".subtitle-selection-element"))
            .forEach((selectionElement) => selectionElement.reset());

        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.PARSER.SUB.RESET,
            data: {}
        });
    }
}

customElements.define(PlussubSubtitleSelectionContainerElement.is, PlussubSubtitleSelectionContainerElement);
