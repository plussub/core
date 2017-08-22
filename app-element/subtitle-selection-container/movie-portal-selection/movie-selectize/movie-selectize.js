/**
 * Created by sonste on 27.12.2016.
 */

class PlussubMovieSelectizeElement extends Polymer.mixinBehaviors([tms.MetaChannelBehavior, tms.ServiceChannelBehavior], Polymer.Element) {

    static get is() {
        return "movie-selectize";
    }

    async ready() {
        tms.ServiceChannelBehavior.ready.apply(this);
        tms.MetaChannelBehavior.ready.apply(this);

        super.ready();
    }

    static get properties() {
        return {
            currentSelected: {
                type: Object,
                value: () => {
                },
                observer: '_currentSelectedChanged'
            }
        }
    }

    _computeLoadFn() {
        return this.load.bind(this);
    }

    load(query, fn) {

        if (!query.length) {
            return fn();
        }


        this.$.movieSelection.clearOptions();

        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: query
        });

        this.serviceSubscribeOnce({
            topic: srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: fn
        });
    }

    _currentSelectedChanged(movieMeta) {
        "use strict";
        if (!movieMeta || Object.keys(movieMeta).length === 0) {
            this.$.movieSelection.clearOptions();
            this.$.movieSelection.setTextboxValue("");
            this.servicePublish({
                topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
                data: 'selected_movie'
            });
            return;
        }

        //notify
        this.metaPublish({
            topic: 'selected_movie.entry',
            data: movieMeta
        });
    }
}

customElements.define(PlussubMovieSelectizeElement.is, PlussubMovieSelectizeElement);