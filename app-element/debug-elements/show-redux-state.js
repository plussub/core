/**
 * Created by stefa on 06.03.2017.
 */
class PlussubShowReduxStateElement extends Polymer.Element {
    static get is() {
        return "show-redux-state";
    }

    ready() {
        super.ready();
        srtPlayer.Redux.subscribe(() => {
            let state = Object.assign({}, srtPlayer.Redux.getState());
            //It makes no sense to safe founded videos or the current time of the video
            //because, when the app will reloaded, entirely other pages could be loaded.
            //Also currentVideos contains circular dependencies because it is a video-html5 instance;
            state.videoMeta = {};
            this.reduxState = JSON.stringify(state,null,2);
        });
    }

    static get properties() {
        return {
            reduxState: {
                type: String,
                value: '-'
            }
        }
    }
}

customElements.define(PlussubShowReduxStateElement.is, PlussubShowReduxStateElement);
