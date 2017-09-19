class PlussubOptionElement extends Polymer.Element {
    static get is() {
        return "plussub-option";
    }

    ready() {

        super.ready();
        let previousLoadedCss = "";
        let previousLoadedSubtitleProperties = {};

        srtPlayer.Redux.subscribe(()=>{
            let css = srtPlayer.Redux.getState().option.css;
            if(previousLoadedCss !== css){
                previousLoadedCss = css;
                this._setCss(css);
            }

            let subtitleProperties = srtPlayer.Redux.getState().option.subtitleProperties;
            if(JSON.stringify(previousLoadedSubtitleProperties)!==JSON.stringify(subtitleProperties)){
                previousLoadedSubtitleProperties = subtitleProperties;
                this._setSubtitleProperties(subtitleProperties);
            }
        });
    }

    static get properties() {
        return {
            cue: {
                type: Object,
                notify: true,
                value: () => {
                    let cue = new VTTCue(0, 60, "<c.srtPlayer> value </c.srtPlayer>");
                    return Object.assign(cue, {
                        position: 3,
                        line: 100,
                        size: 100
                    })
                }
            },
            css: {
                type: String,
                notify: true,
                value: () => {
                    var customSubtitleCss = '::cue(.srtPlayer) \
                    {\
                        background-color:yellow;\
                    }';
                    return css_beautify(customSubtitleCss);
                }
            }
        }
    }

    _setCss(css){
        this.css=css;
    }

    _setSubtitleProperties(properties){
        Object.assign(this.cue, properties);
        ["line","position","size","align", "vertical"].forEach((path)=>this.notifyPath(`cue.${path}`));
    }

    save() {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.changeCss(this.css));
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.changeSubtitleProperties({
            line: this.cue.line,
            position: this.cue.position,
            size: this.cue.size,
            align: this.cue.align,
            vertical: this.cue.vertical
        }));

    }

    reset() {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.resetOption());
    }
}
customElements.define(PlussubOptionElement.is, PlussubOptionElement);
