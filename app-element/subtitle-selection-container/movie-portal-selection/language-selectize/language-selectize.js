/**
 * Created by sonste on 28.12.2016.
 */

class PlussubLanguageSelectizeElement extends Polymer.mixinBehaviors([tms.MetaChannelBehavior, tms.ServiceChannelBehavior], Polymer.Element) {

    static get is() {
        return "language-selectize";
    }


    async ready() {
        tms.ServiceChannelBehavior.ready.apply(this);
        tms.MetaChannelBehavior.ready.apply(this);

        super.ready();

        this.$.languageSelection.load(iso639LanguageList);

        await this.onMetaReady();
        let [language] = await Promise.all(Array.of(this.resolveMeta("selected_subtitle_language.entry")));
        let languageAsString = JSON.stringify(language);

        this.$.languageSelection.addOption(Object.assign({}, language, {valueField: languageAsString}));
        this.$.languageSelection.addItem(languageAsString);
    }


    static get properties() {
        return {
            currentSelected: {
                type: Object,
                value: () => {
                    return {};
                },
                observer: '_currentSelectedChanged'
            }
        }
    }

    _currentSelectedChanged(language) {

        if (!language || Object.keys(language).length===0) {
            this.servicePublish({
                topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
                data: 'selected_subtitle_language'
            });
            return;
        }

        this.metaPublish({
            topic: 'selected_subtitle_language.entry',
            data:language
        });
    }


}
customElements.define(PlussubLanguageSelectizeElement.is, PlussubLanguageSelectizeElement);