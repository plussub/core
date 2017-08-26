var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../descriptor/Descriptor').srtPlayer.Descriptor;
    srtPlayer.ReduxConfig = require('./configForTest').srtPlayer.ReduxConfig;

    var Redux = require('../../redux/index');
}


srtPlayer.Redux = srtPlayer.Redux || (() => {

        let initialState = {
            option: {
                css: "#editCSS{ font-size:20px;} \n ::cue(.srtPlayer){ \/* background-color:black; \n color:white; \n font-size:20px; *\/}",
                subtitleProperties: {} //cue properties
            },

            subtitle: {
                id: -1,
                parsed: [],
                pastOffsetTime: 0,
                offsetTime: 0,
                offsetTimeApplied: true,
                raw: ""
            },

            movieSearch: {
                query: "",
                isLoading: false,
                resultId: -1,
                result: [],
                selected: -1,
            },

            movieInfo: {
                id: -1,
                title: "-",
                poster: null,
                src: ""
            },

            subtitleSearch: {
                imdbId: "",
                language: "eng",
                isLoading: false,
                resultId: -1,
                result: [],
                downloadLink: "",
                selected: -1,

            },

            //videoMeta is transient
            videoMeta: {
                tickInMs: 0,
                foundVideo: false,
                currentVideos: []
            },

            debug: {
                showDebugConsole: false,
                redux: false,
                reduxStore: false,
                disableStoreReduxState: false
            }
        };

        function reducers(state = initialState, action) {

            if (state.debug.redux) {
                console.log(action.type);
            }

            switch (action.type) {
                case srtPlayer.Descriptor.RESET.RESET.PUB.ALL:
                    return {...state, ...initialState};
                case srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND:
                case srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME:
                    return {...state, videoMeta: contentReducers(state.videoMeta, action)};
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.CSS:
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.SUBTITLE_PROPERTIES:
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.RESET:
                    return {...state, option: optionReducers(state.option, action)};
                case srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSED:
                case srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE:
                case srtPlayer.Descriptor.SUBTITLE.OFFSET_TIME.PUB.VALUE:
                case srtPlayer.Descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE:
                    return {...state, subtitle: subtitleReducers(state.subtitle, action)};
                case srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.SET:
                case srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.RESET:
                    return {...state, movieInfo: movieInformationReducers(state.movieInfo, action)};
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SEARCH:
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESULT:
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SET_SELECTED:
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESET:
                    return {...state, movieSearch: movieSearchReducers(state.movieSearch, action)};
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_IMDB:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_LANGUAGE:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESULT:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.DOWNLOAD:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SET_SELECTED:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESET:
                    return {...state, subtitleSearch: subtitleSearchReducers(state.subtitleSearch, action)};
                case srtPlayer.Descriptor.DEBUG.DEBUG.PUB.TOGGLE_CONSOLE:
                    return {...state, debug: debugReducers(state.debug, action)};
                default:
                    return state
            }
        }

        function contentReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND:
                    return {...state, foundVideo: true, currentVideos: [...state.currentVideos, action.payload]};
                case srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME:
                    return {...state, tickInMs: action.payload};
                default:
                    return state
            }
        }

        function optionReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.CSS:
                    return {...state, css: action.payload};
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.SUBTITLE_PROPERTIES:
                    return {...state, subtitleProperties: action.payload};
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.RESET:
                    return {...state, ...initialState.option};
                default:
                    return state;
            }
        }

        function subtitleReducers(state, action) {

            switch (action.type) {
                case srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE:
                    return {
                        ...state,
                        id: -1,
                        raw: action.payload,
                        parsed: [],
                        offsetTimeApplied: true,
                        pastOffsetTime: 0
                    };
                case srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSED:
                    return {
                        ...state,
                        id: action.payload.id,
                        parsed: action.payload.subtitle,
                        pastOffsetTime: 0,
                        offsetTimeApplied: true
                    };
                case srtPlayer.Descriptor.SUBTITLE.OFFSET_TIME.PUB.VALUE:
                    if (isNaN(action.payload)) {
                        throw "OffsetTime is not a number (NaN)";
                    }
                    if (action.payload === state.offsetTime) {
                        return state;
                    }

                    return {
                        ...state,
                        offsetTime: action.payload,
                        pastOffsetTime: state.offsetTime,
                        offsetTimeApplied: false
                    };
                case srtPlayer.Descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE:
                    return {...state, id: -1, raw: "", parsed: [], pastOffsetTime: 0, offsetTimeApplied: true};
                default:
                    return state;
            }
        }

        function movieInformationReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.SET:
                    return {...state, ...action.payload};
                case srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.RESET:
                    return {...state, ...initialState.movieInfo};
                default:
                    return state;
            }
        }

        function movieSearchReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SEARCH:
                    return {...state, query: action.payload, isLoading: true, result: [], resultId: -1, selected: -1};
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESULT:
                    return {
                        ...state,
                        isLoading: false,
                        result: action.payload.result,
                        resultId: action.payload.resultId,
                        selected: -1
                    };
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SET_SELECTED:
                    return {
                        ...state,
                        selected: action.payload
                    };
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESET:
                    return {...state, ...initialState.movieSearch};
                default:
                    return state;
            }
        }

        function subtitleSearchReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_IMDB:
                    if (state.imdbId === action.payload) {
                        return state;
                    }

                    return {
                        ...state,
                        imdbId: action.payload,
                        isLoading: true,
                        result: [],
                        resultId: -1,
                        downloadLink: "",
                        selected: -1
                    };
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_LANGUAGE:
                    if (state.language === action.payload) {
                        return state;
                    }

                    return {
                        ...state,
                        language: action.payload,
                        isLoading: true,
                        result: [],
                        resultId: -1,
                        downloadLink: "",
                        selected: -1
                    };
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESULT:
                    return {
                        ...state,
                        isLoading: false,
                        resultId: action.payload.resultId,
                        result: action.payload.result,
                    };
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.DOWNLOAD:
                    return {...state, downloadLink: action.payload};
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SET_SELECTED:
                    return {...state, selected: action.payload};
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESET:
                    return {...state, ...initialState.subtitleSearch};
                default:
                    return state;
            }
        }

        function debugReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.DEBUG.DEBUG.PUB.TOGGLE_CONSOLE:
                    return {...state, showDebugConsole: !state.showDebugConsole};
                default:
                    return state;
            }
        }

        console.log(srtPlayer.ReduxConfig);
        let _initialState = srtPlayer.ReduxConfig.getInitialState();
        _initialState = _initialState ? _initialState : initialState; 

        if (_initialState.debug.reduxStore) {
            console.log(`load state: ${_initialState}`);
        }

        let store = Redux.createStore(reducers, _initialState);
        store.subscribe(() => {
            let state = Object.assign({}, store.getState());
            if (typeof localStorage === 'undefined' || state.debug.disableStoreReduxState) {
                return;
            }
            //It makes no sense to safe founded videos or the current time of the video
            //because, when the app will reloaded, entirely other pages could be loaded.
            //Also currentVideos contains circular dependencies because it is a video-html5 instance;
            state.videoMeta = initialState.videoMeta;

            if (state.debug.reduxStore) {
                console.log(JSON.stringify(state));
            }

            localStorage.setItem('reduxState', JSON.stringify(state));
        });

        return {
            reducers: reducers,
            store: store,
            subscribe: store.subscribe,
            dispatch: store.dispatch,
            getState: () => store.getState()
        }
    })();