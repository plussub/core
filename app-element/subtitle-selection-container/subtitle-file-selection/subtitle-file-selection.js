class PlussubSubtitleFileSelectionElement extends Polymer.mixinBehaviors([tms.MetaChannelBehavior, tms.ServiceChannelBehavior], Polymer.Element) {

    static get is() {
        return "subtitle-file-selection";
    }

    async ready() {
        tms.ServiceChannelBehavior.ready.apply(this);
        tms.MetaChannelBehavior.ready.apply(this);
        this.classList.add("subtitle-selection-element");

        super.ready();

        await this.onMetaReady();
        let [fileMeta] = await Promise.all(Array.of(this.resolveMeta("selected_subtitle_file.entry")));

        if (!fileMeta || Object.keys(fileMeta).length === 0) {
            this.reset();
            return;
        }

        this.fire('refreshSubtitle', {
            selectionElement: this,
            title: fileMeta.filename
        });

    }

    static get properties() {
        return {
            simpleName: {
                type: String,
                value: 'File Selection'
            }
        }
    }

    reset() {
        let form = document.createElement('form');
        Polymer.dom(form).appendChild(this.$.fileInput);
        form.reset();
        Polymer.dom(this.$.container).appendChild(this.$.fileInput);

        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
            data: 'selected_subtitle_file'
        });

        this.fire('resetSubtitle', {
            selectionElement: this
        });
    }

    fileSelected() {

        const reader = new FileReader();
        reader.readAsText(this.$.fileInput.inputElement.inputElement.files[0]);
        reader.onload = (file) => {
            let filename = this.$.fileInput.inputElement.inputElement.files[0].name;

            this.fire('refreshSubtitle', {
                title: filename,
                type: "fileinput"
            });

            //notify
            this.metaPublish({
                topic: 'selected_subtitle_file.entry',
                data: {
                    filename: filename
                }
            });

            this.metaPublish({
                topic: 'last_selected.entry',
                data: {
                    title: filename,
                    type: "fileinput"
                }
            });

            this.servicePublish({
                topic: srtPlayer.Descriptor.SERVICE.PARSER.SUB.PARSE,
                data: {
                    type: 'srt',
                    raw: reader.result
                }
            });
        };
    }
}


customElements.define(PlussubSubtitleFileSelectionElement.is, PlussubSubtitleFileSelectionElement);