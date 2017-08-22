class PlussubOptionElement extends Polymer.Element {
    static get is() {
        return "plussub-option";
    }

    async ready() {

        super.ready();
        let previousLoadedCss = "";
        let previousLoadedSubtitleProperties = {};

        srtPlayer.Redux.subscribe(()=>{
            let css = srtPlayer.Redux.getState().option.css;
            if(previousLoadedCss !== css){
                previousLoadedCss = css;
                this.css = css;
            }

            let subtitleProperties = srtPlayer.Redux.getState().option.subtitleProperties;
            if(JSON.stringify(previousLoadedSubtitleProperties)!==JSON.stringify(subtitleProperties)){
                previousLoadedSubtitleProperties = subtitleProperties;
                Object.assign(this.cue, subtitleProperties);
                ["line","position","size","align", "vertical"].forEach((path)=>this.notifyPath(`cue.${path}`));
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

    static changeCssAction(css = "") {
        return {
            type: srtPlayer.Descriptor.OPTION.OPTION.PUB.CSS,
            payload: css,
            meta: "optionPage"
        };
    }

    static changeSubtitlePropertiesAction(properties= {}) {
        return {
            type: srtPlayer.Descriptor.OPTION.OPTION.PUB.SUBTITLE_PROPERTIES,
            payload: properties,
            meta: "optionPage"
        };
    }

    static resetOptionAction() {
        return {
            type: srtPlayer.Descriptor.OPTION.OPTION.PUB.RESET,
            meta: "optionPage"
        };
    }

    save() {
        srtPlayer.Redux.dispatch(PlussubOptionElement.changeCssAction(this.css));
        srtPlayer.Redux.dispatch(PlussubOptionElement.changeSubtitlePropertiesAction({
            line: this.cue.line,
            position: this.cue.position,
            size: this.cue.size,
            align: this.cue.align,
            vertical: this.cue.vertical
        }));

    }

    reset() {
        srtPlayer.Redux.dispatch(PlussubOptionElement.resetOptionAction());
    }
}
customElements.define(PlussubOptionElement.is, PlussubOptionElement);
