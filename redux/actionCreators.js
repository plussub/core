/**
 * Created by stefa on 25.08.2017.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../descriptor/Descriptor').srtPlayer.Descriptor;
    srtPlayer.GuidService = require('../background/guid/GuidService').srtPlayer.GuidService;    
}


srtPlayer.ActionCreators = srtPlayer.ActionCreators || (() => {


        return {

            parseRawSubtitle: (raw) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE,
                    payload: raw,
                    meta: "appPage"
                }
            },

            setOffsetTimeForSubtitle: (delay = 0) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.OFFSET_TIME.PUB.VALUE,
                    payload: delay,
                    meta: "backgroundPage"
                };
            },

            removeLoadedSubtitle: () => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE,
                    meta: "appPage"
                };
            },

            parseRawSubtitle: (raw) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE,
                    payload: raw,
                    meta: "backgroundPage"
                };
            },

            parsedSubtitle: (subtitle = "") => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSED,
                    payload: {
                        subtitle: subtitle,
                        id: srtPlayer.GuidService.createGuid()
                    },
                    meta: "backgroundPage"
                };
            },

            triggerSearchMovie: (query) => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SEARCH,
                    payload: query,
                    meta: "appPage"
                };
            },

            setMovieSearchResult: (searchResult) => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESULT,
                    payload: {
                        resultId: srtPlayer.GuidService.createGuid(),
                        result: searchResult
                    },
                    meta: "backgroundPage"
                };
            },


            setSelectedMovieSelection: (index) => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SET_SELECTED,
                    payload: index,
                    meta: "appPage"
                };
            },

            triggerMovieSearchReset: () => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESET,
                    meta: "appPage"
                };
            },

            setMovieInfo: (movieInfo) => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.SET,
                    payload: movieInfo,
                    meta: "appPage"
                };
            },

            resetMovieInfo: () => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.RESET,
                    meta: "appPage"
                };
            },


            triggerSubtitleSearchViaImdbId: (imdbId) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_IMDB,
                    payload: imdbId,
                    meta: "appPage"
                };
            },


            triggerSubtitleSearchViaLanguage: (language) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_LANGUAGE,
                    payload: language,
                    meta: "appPage"
                };
            },

            setSelectedSubtitleSelection: (index) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SET_SELECTED,
                    payload: index,
                    meta: "appPage"
                };
            },

            setSubtitleSearchResult: (searchResult) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESULT,
                    payload: {
                        resultId:srtPlayer.GuidService.createGuid(),                        
                        result:searchResult
                    },
                    meta: "backgroundPage"
                };
            },

            triggerSubtitleDownload: (link) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.DOWNLOAD,
                    payload: link,
                    meta: "appPage"
                };
            },

            triggerSubtitleSearchReset: () => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESET,
                    meta: "appPage"
                };
            },

            changeCss: (css = "") => {
                return {
                    type: srtPlayer.Descriptor.OPTION.OPTION.PUB.CSS,
                    payload: css,
                    meta: "optionPage"
                };
            },

            changeSubtitleProperties: (properties = {}) => {
                return {
                    type: srtPlayer.Descriptor.OPTION.OPTION.PUB.SUBTITLE_PROPERTIES,
                    payload: properties,
                    meta: "optionPage"
                };
            },

            resetOption: () => {
                return {
                    type: srtPlayer.Descriptor.OPTION.OPTION.PUB.RESET,
                    meta: "optionPage"
                };
            },

            foundVideo: (video = null) => {
                return {
                    type: srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND,
                    payload: video,
                    meta: "contentScript"
                };
            },

            videoTick: (ms = 0) => {
                return {
                    type: srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME,
                    payload: ms,
                    meta: "contentScript"
                }
            },

            resetAll: () => {
                return {
                    type: srtPlayer.Descriptor.RESET.RESET.PUB.ALL,
                    meta: "test"
                }
            },

            sendHeartBeat: () => {
                return {
                    type: "<does not match>",
                    meta: "test"
                }
            },

            toggleShowDebugConsole:()=>{
                return {
                    type: srtPlayer.Descriptor.DEBUG.DEBUG.PUB.TOGGLE_CONSOLE,
                    meta: "appPage"
                }
            }
        }


    })();
