/**
 * Created by sbreitenstein on 19/01/17.
 */
class PlussubMoviePortalSelectionElement extends Polymer.Element {
    static get is() {
        return "movie-portal-selection";
    }

    ready() {
        super.ready();

        this.$.languageSelection.load(iso639LanguageList);

        let previousMovieSearchResultId = -1;
        let previousMovieSearchSelected = -1;
        let previousLanguageSelection = "";

        let previousSubtitleSearchResultId = -1;
        let previousSubtitleSelected = -1;

        srtPlayer.Redux.subscribe(() => {
            let movieSearch = srtPlayer.Redux.getState().movieSearch;
            let subtitleSearch = srtPlayer.Redux.getState().subtitleSearch;

            this.$.movieSelection.loadingActive(movieSearch.isLoading);
            this.$.subtitleSelection.loadingActive(subtitleSearch.isLoading);

            if (previousMovieSearchResultId !== movieSearch.resultId) {
                previousMovieSearchResultId = movieSearch.resultId;
                this.$.movieSelection.clearOptions();
                this.$.movieSelection.load(movieSearch.result);
                console.log("load");
            }
            console.log(`c: ${movieSearch.selected} p: ${previousMovieSearchSelected}`)
            if (previousMovieSearchSelected !== movieSearch.selected) {
                previousMovieSearchSelected = movieSearch.selected;
                this.$.movieSelection.clear(true);//clear means clearItem
                if (previousMovieSearchSelected !== -1) {
                    this.$.movieSelection.addItem(movieSearch.result[movieSearch.selected].valueField, true);
                }
                console.log("set selected");
            }

            if (previousLanguageSelection !== subtitleSearch.language) {
                previousLanguageSelection = subtitleSearch.language;
                let index = iso639LanguageList.indexOf(iso639LanguageList.find(e => e.iso639 === subtitleSearch.language));

                this.$.languageSelection.clear(true);//clear means clearItem
                this.$.languageSelection.addItem(iso639LanguageList[index].valueField,true);
            }

            if (previousSubtitleSearchResultId !== subtitleSearch.resultId) {
                previousSubtitleSearchResultId = subtitleSearch.resultId;
                this.$.subtitleSelection.clearOptions();
                this.$.subtitleSelection.load(subtitleSearch.result);
            }


            if (previousSubtitleSelected !== subtitleSearch.selected) {
                previousSubtitleSelected = subtitleSearch.selected;
                this.$.subtitleSelection.clear(true);//clear means clearItem
                if (previousSubtitleSelected !== -1) {
                    this.$.subtitleSelection.addItem(subtitleSearch.result[subtitleSearch.selected].valueField, true);
                }
            }
        });
    }

    static get properties() {
        return {
            simpleName: {
                type: String,
                value: 'Movie Portal Selection'
            }
        }
    }

    static triggerSearchMovieAction(query) {
        return {
            type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SEARCH,
            payload: query,
            meta: "appPage"
        };
    }

    static setSelectedMovieSelection(index) {
        return {
            type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SET_SELECTED,
            payload: index,
            meta: "appPage"
        };
    }

    static triggerSubtitleSearchViaImdbId(imdbid) {
        return {
            type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_IMDB,
            payload: imdbid,
            meta: "appPage"
        };
    }

    static triggerSubtitleSearchViaLanguage(language) {
        return {
            type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_LANGUAGE,
            payload: language,
            meta: "appPage"
        };
    }

    static setSelectedSubtitleSelection(index) {
        return {
            type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SET_SELECTED,
            payload: index,
            meta: "appPage"
        };
    }

    static triggerSubtitleDownloadAction(link) {
        return {
            type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.DOWNLOAD,
            payload: link,
            meta: "appPage"
        };
    }


    _searchMoviesFn() {
        return (value) => {
            this._debouncer = Polymer.Debouncer.debounce(
                this._debouncer,
                Polymer.Async.timeOut.after(1500),
                () => srtPlayer.Redux.dispatch(PlussubMoviePortalSelectionElement.triggerSearchMovieAction(value))
            );
        }
    }

    _selectedMovieFn() {
        return () => {
            let imdbId = JSON.parse(this.$.movieSelection.getItems()[0]).imdbID;
            let searchResult = srtPlayer.Redux.getState().movieSearch.result;
            let index = searchResult.indexOf(searchResult.find(e => e.imdbID === imdbId));

            srtPlayer.Redux.dispatch(PlussubMoviePortalSelectionElement.setSelectedMovieSelection(index));
            srtPlayer.Redux.dispatch(PlussubMoviePortalSelectionElement.triggerSubtitleSearchViaImdbId(imdbId));
        }
    }

    _selectedLanguageFn() {
        return () => {
            let languageCode = JSON.parse(this.$.languageSelection.getItems()[0]).iso639;
            srtPlayer.Redux.dispatch(PlussubMoviePortalSelectionElement.triggerSubtitleSearchViaLanguage(languageCode));
        }
    }

    _selectedSubtitleFn() {
        return () => {
            let link = JSON.parse(this.$.subtitleSelection.getItems()[0]).downloadLink;
            let searchResult = srtPlayer.Redux.getState().subtitleSearch.result;
            let index = searchResult.indexOf(searchResult.find(e => e.downloadLink === link));
            console.log(index);
            srtPlayer.Redux.dispatch(PlussubMoviePortalSelectionElement.setSelectedSubtitleSelection(index));
            srtPlayer.Redux.dispatch(PlussubMoviePortalSelectionElement.triggerSubtitleDownloadAction(link));
        }
    }

    openThemoviedb() {
        chrome.tabs.create({url: this.$.themoviedbLink.href});
    }

    openOpenSubtitle() {
        chrome.tabs.create({url: this.$.openSubtitleLink.href});
    }
}

customElements.define(PlussubMoviePortalSelectionElement.is, PlussubMoviePortalSelectionElement);