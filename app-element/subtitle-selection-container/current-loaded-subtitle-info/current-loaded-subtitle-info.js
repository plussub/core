/**
 * Created by sbreitenstein on 19/01/17.
 */

class PlussubCurrentLoadedSubtitleInfoElement extends Polymer.mixinBehaviors([tms.MetaChannelBehavior, tms.ServiceChannelBehavior], Polymer.Element) {
    static get is() {
        return "current-loaded-subtitle-info";
    }

    async ready() {
        tms.ServiceChannelBehavior.ready.apply(this);
        tms.MetaChannelBehavior.ready.apply(this);

        this.addEventListener("refreshSubtitle",this.onRefreshSubtitle);
        this.addEventListener("resetSubtitle",this.onResetSubtitle);

        super.ready();
        //polymer does not like async functions, so do special stuff after call super.ready

        await this.onMetaReady();
        let [lastSelected] = await Promise.all(Array.of(this.resolveMeta("last_selected.entry")));

        if (!lastSelected || Object.keys(lastSelected).length===0) {
            return;
        }

        this.setInformation(lastSelected);
        // this.$.paperExpansionPanel.opened=true;

    }

    static get properties() {
        return {
            title: {
                type: String,
                value: '-'
            },
            type: {
                type: String,
                value: ''
            },
            currentSelectionElement: {
                type: Object,
                value: () => Object.assign({})
            }
        }
    }

    onRefreshSubtitle (event) {
        this.setInformation(event.detail);
    }

    setInformation(data){
        if(data.type==='selection') {
            this.title = data.subtitle.movieTitle;
            this.poster= data.movie.Poster;
            this.type="Selection";
        }
        else if(data.type==='fileinput'){
            this.title=data.title;
            this.poster=null;
            this.type="File input";

        }
    }

    onResetSubtitle (event) {
        if (!this.currentSelectionElement || this.currentSelectionElement !== event.detail.selectionElement) {
            return;
        }

        this._reset();
    }

    manualReset(){
        this._reset();
    }

    _reset(){
        this.currentSelectionElement = null;
        this.type = '';
        this.title = '-';
        this.poster= null;
        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
            data: 'last_selected'
        });
    }

}

customElements.define(PlussubCurrentLoadedSubtitleInfoElement.is, PlussubCurrentLoadedSubtitleInfoElement);