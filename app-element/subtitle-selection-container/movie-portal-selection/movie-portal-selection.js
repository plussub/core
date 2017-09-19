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
            }
            if (previousMovieSearchSelected !== movieSearch.selected) {
                previousMovieSearchSelected = movieSearch.selected;
                this.$.movieSelection.clear(true);//clear means clearItem
                if (previousMovieSearchSelected !== -1) {
                    this.$.movieSelection.addItem(movieSearch.result[movieSearch.selected].valueField, true);
                }
            }

            if (previousLanguageSelection !== subtitleSearch.language) {
                previousLanguageSelection = subtitleSearch.language;
                let index = iso639LanguageList.indexOf(iso639LanguageList.find(e => e.iso639 === subtitleSearch.language));

                this.$.languageSelection.clear(true);//clear means clearItem
                this.$.languageSelection.addItem(iso639LanguageList[index].valueField, true);
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

    _searchMoviesFn() {
        return (value) => {
            this._debouncer = Polymer.Debouncer.debounce(
                this._debouncer,
                Polymer.Async.timeOut.after(1500),
                () => srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.triggerSearchMovie(value))
            );
        }
    }

    _selectedMovieFn() {
        return () => {
            let imdbId = JSON.parse(this.$.movieSelection.getItems()[0]).imdbID;
            let searchResult = srtPlayer.Redux.getState().movieSearch.result;
            let index = searchResult.indexOf(searchResult.find(e => e.imdbID === imdbId));

            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSelectedMovieSelection(index));
            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.triggerSubtitleSearchViaImdbId(imdbId));
        }
    }

    _selectedLanguageFn() {
        return () => {
            let languageCode = JSON.parse(this.$.languageSelection.getItems()[0]).iso639;
            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.triggerSubtitleSearchViaLanguage(languageCode));
        }
    }

    _selectedSubtitleFn() {
        return () => {
            let link = JSON.parse(this.$.subtitleSelection.getItems()[0]).downloadLink;
            let searchResult = srtPlayer.Redux.getState().subtitleSearch.result;
            let index = searchResult.indexOf(searchResult.find(e => e.downloadLink === link));
            let selectedMovie = srtPlayer.Redux.getState().movieSearch.result[srtPlayer.Redux.getState().movieSearch.selected];

            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSelectedSubtitleSelection(index));
            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.triggerSubtitleDownload(link));
            if (index === -1) {
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setMovieInfo({
                    id: srtPlayer.GuidService.createGuid(),
                    title: "-",
                    src: "MoviePortal Selection"
                }));
            } else {
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setMovieInfo({
                    id: srtPlayer.GuidService.createGuid(),
                    title: selectedMovie.Title,
                    src: "MoviePortal Selection"
                }));
            }
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