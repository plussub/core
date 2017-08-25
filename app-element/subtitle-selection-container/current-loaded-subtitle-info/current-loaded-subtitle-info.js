/**
 * Created by sbreitenstein on 19/01/17.
 */

class PlussubCurrentLoadedSubtitleInfoElement extends Polymer.Element {
    static get is() {
        return "current-loaded-subtitle-info";
    }

    ready() {
        super.ready();
        // this.$.paperExpansionPanel.opened=true;

        let previousId = -1;

        srtPlayer.Redux.subscribe(()=>{
            let movieInfo = srtPlayer.Redux.getState().movieInfo;
            if(previousId !== movieInfo.id){
                previousId =  movieInfo.id;
                this._setMovieInfo(movieInfo)
            }
        });

        // this.setInformation(lastSelected);

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

    _setMovieInfo(info){
        this.title = info.title;
       // this.poster= data.movie.Poster;
        this.poster= info.poster;
        this.type=info.src;
    }

    manualReset(){
        this._reset();
    }

    _reset(){
        this.currentSelectionElement = null;
        this.type = '';
        this.title = '-';
        this.poster= null;


        srtPlayer.Redux.dispatch(PlussubCurrentLoadedSubtitleInfoElement.removeLoadedSubtitleAction());
        srtPlayer.Redux.dispatch(PlussubCurrentLoadedSubtitleInfoElement.resetMovieInfoAction());

    }

}

customElements.define(PlussubCurrentLoadedSubtitleInfoElement.is, PlussubCurrentLoadedSubtitleInfoElement);