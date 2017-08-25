class PlussubSubtitleFileSelectionElement extends Polymer.Element {

    static get is() {
        return "subtitle-file-selection";
    }

    ready() {
        this.classList.add("subtitle-selection-element");
        super.ready();


    }

    static get properties() {
        return {
            simpleName: {
                type: String,
                value: 'File Selection'
            }
        }
    }

    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    static parseRawSubtitleAction(raw) {
        return {
            type: srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE,
            payload: raw,
            meta: "appPage"
        };
    }

    static setMovieInfoAction(movieInfo) {
        return {
            type: srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.SET,
            payload: movieInfo,
            meta: "appPage"
        };
    }

    // reset() {
    //     let form = document.createElement('form');
    //     Polymer.dom(form).appendChild(this.$.fileInput);
    //     form.reset();
    //     Polymer.dom(this.$.container).appendChild(this.$.fileInput);
    //
    //     this.servicePublish({
    //         topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
    //         data: 'selected_subtitle_file'
    //     });
    //
    //     this.fire('resetSubtitle', {
    //         selectionElement: this
    //     });
    // }

    fileSelected() {

        const reader = new FileReader();
        reader.readAsText(this.$.fileInput.inputElement.inputElement.files[0]);
        reader.onload = () => {
            const filename = this.$.fileInput.inputElement.inputElement.files[0].name;

            srtPlayer.Redux.dispatch(PlussubSubtitleFileSelectionElement.setMovieInfoAction({
                id:PlussubSubtitleFileSelectionElement.guid(),
                title: filename,
                src:"File selection"
            }));

            srtPlayer.Redux.dispatch(PlussubSubtitleFileSelectionElement.parseRawSubtitleAction(reader.result));
        };
    }
}


customElements.define(PlussubSubtitleFileSelectionElement.is, PlussubSubtitleFileSelectionElement);