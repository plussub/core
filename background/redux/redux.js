srtPlayer.Redux = srtPlayer.Redux || (() => {

        let initialState = {
            option: {
                css: "#editCSS{ font-size:20px;} \n ::cue(.srtPlayer){ \/* background-color:black; \n color:white; \n font-size:20px; *\/}",
                subtitleProperties:{}
            },

            subtitle: {
                id: -1,
                parsed: ""
            },

            //videoMeta is transient
            videoMeta: {
                tickInMs: 0,
                foundVideo: false,
                currentVideos: []
            }
        };

        function reducers(state = initialState, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND:
                case srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME:
                    return {...state, videoMeta: contentReducers(state.videoMeta, action)};
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.CSS:
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.SUBTITLE_PROPERTIES:
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.RESET:
                    return {...state, option: optionReducers(state.option, action)};
                case srtPlayer.Descriptor.SERVICE.PARSER.PUB.PARSED:
                    return {...state, subtitle: subtitleReducers(state.subtitle, action)};
                default:
                    return state
            }
        }

        function subtitleReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.SERVICE.PARSER.PUB.PARSED:
                    return {...state, parsed: action.payload.subtitle, id:action.payload.id};
                default:
                    return state;
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

        const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : initialState;
        let store = Redux.createStore(reducers, persistedState);

        store.subscribe(() => {
            let state = Object.assign({}, store.getState());
            //It makes no sense to safe founded videos or the current time of the video
            //because, when the app will reloaded, entirely other pages could be loaded.
            //Also currentVideos contains circular dependencies because it is a video-html5 instance;
            state.videoMeta = initialState.videoMeta;

            localStorage.setItem('reduxState', JSON.stringify(state))
        });

        return {
            reducers: reducers,
            store: store,
            subscribe: store.subscribe,
            dispatch: store.dispatch,
            getState: () => store.getState()
        }
    })();