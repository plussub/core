var expect = require('chai').expect;
var fetchMock = require('fetch-mock');
var nodeFetch = require('node-fetch');
var requirejs = require('requirejs');
var redux = require('../../../redux/redux.js').srtPlayer.Redux;
var actionCreators = require('../../../redux/actionCreators.js').srtPlayer.ActionCreators;
var root = require('../SubtitleProvider.js');
var Descriptor = require('../../../descriptor/Descriptor.js').srtPlayer.Descriptor;



describe('SubtitleProvider', () => {

    var subtitleProvider;
    var BASE_URL = 'https://app.plus-sub.com/subtitle';

    var DEFAULT_SUBTITLE_SEARCH_RESULT = [
        {
            "SubActualCD": "3",
            "MovieName": "Pulp Fiction",
            "SubBad": "0",
            "MovieHash": "0",
            "SubFileName": "Pulp_Fiction_(DivX_DVDrip)_-_CD_2.English.srt",
            "SubSumCD": "4",
            "ZipDownloadLink": "http://dl.opensubtitles.org/en/download/src-api/vrf-e95e0b77/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/subad/113540",
            "MovieNameEng": "",
            "SubSize": "63902",
            "IDSubtitleFile": "154506",
            "SubHash": "d78540d4c71a86ead6e832699b563216",
            "SubFeatured": "0",
            "SubAuthorComment": "",
            "SubDownloadsCnt": "533",
            "SubAddDate": "2005-03-01 00:00:00",
            "SubLastTS": "00:58:50",
            "SubAutoTranslation": "0",
            "MovieReleaseName": "Pulp Fiction",
            "SeriesIMDBParent": "0",
            "UserNickName": "original_masken (a)",
            "SubHearingImpaired": "0",
            "SubTSGroup": "79",
            "SubLanguageID": "eng",
            "SubFormat": "srt",
            "LanguageName": "English",
            "SubTranslator": "",
            "SeriesEpisode": "0",
            "UserRank": "bronze member",
            "MovieImdbRating": "8.9",
            "MovieTimeMS": "0",
            "MovieYear": "1994",
            "SubEncoding": "ASCII",
            "QueryNumber": "0",
            "SubHD": "0",
            "UserID": "39934",
            "MovieByteSize": "0",
            "MovieFPS": "0.000",
            "SubtitlesLink": "http://www.opensubtitles.org/en/subtitles/113540/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/pulp-fiction-en",
            "IDSubMovieFile": "0",
            "ISO639": "en",
            "SeriesSeason": "0",
            "SubFromTrusted": "0",
            "SubTSGroupHash": "2b63fa88c9cdee2f225fbcb20939f9c6",
            "MatchedBy": "imdbid",
            "SubDownloadLink": "http://dl.opensubtitles.org/en/download/src-api/vrf-e9740b7e/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/filead/154506.gz",
            "SubRating": "0.0",
            "QueryParameters": {
                "imdbid": "0110912",
                "sublanguageid": "eng"
            },
            "SubComments": "0",
            "MovieKind": "movie",
            "IDMovie": "60",
            "IDMovieImdb": "110912",
            "SubForeignPartsOnly": "0",
            "IDSubtitle": "113540"
        },
        {
            "SubActualCD": "2",
            "MovieName": "Pulp Fiction",
            "SubBad": "0",
            "MovieHash": "0",
            "SubFileName": "Pulp_Fiction_(DivX_DVDrip)_-_CD_1.Swedish.srt",
            "SubSumCD": "4",
            "ZipDownloadLink": "http://dl.opensubtitles.org/en/download/src-api/vrf-e95e0b77/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/subad/113540",
            "MovieNameEng": "",
            "SubSize": "65320",
            "IDSubtitleFile": "154507",
            "SubHash": "93576df6508d13e3b76da6f0d8f00f9e",
            "SubFeatured": "0",
            "SubAuthorComment": "",
            "SubDownloadsCnt": "533",
            "SubAddDate": "2005-03-01 00:00:00",
            "SubLastTS": "01:24:24",
            "SubAutoTranslation": "0",
            "MovieReleaseName": "Pulp Fiction",
            "SeriesIMDBParent": "0",
            "UserNickName": "original_masken (a)",
            "SubHearingImpaired": "0",
            "SubTSGroup": "36",
            "SubLanguageID": "eng",
            "SubFormat": "srt",
            "LanguageName": "English",
            "SubTranslator": "",
            "SeriesEpisode": "0",
            "UserRank": "bronze member",
            "MovieImdbRating": "8.9",
            "MovieTimeMS": "0",
            "MovieYear": "1994",
            "SubEncoding": "ASCII",
            "QueryNumber": "0",
            "SubHD": "0",
            "UserID": "39934",
            "MovieByteSize": "0",
            "MovieFPS": "0.000",
            "SubtitlesLink": "http://www.opensubtitles.org/en/subtitles/113540/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/pulp-fiction-en",
            "IDSubMovieFile": "0",
            "ISO639": "en",
            "SeriesSeason": "0",
            "SubFromTrusted": "0",
            "SubTSGroupHash": "5dda2ce3493edf07e9246586396e9919",
            "MatchedBy": "imdbid",
            "SubDownloadLink": "http://dl.opensubtitles.org/en/download/src-api/vrf-e9750b7f/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/filead/154507.gz",
            "SubRating": "0.0",
            "QueryParameters": {
                "imdbid": "0110912",
                "sublanguageid": "eng"
            },
            "SubComments": "0",
            "MovieKind": "movie",
            "IDMovie": "60",
            "IDMovieImdb": "110912",
            "SubForeignPartsOnly": "0",
            "IDSubtitle": "113540"
        }
    ];

    var fakeFetch;

    beforeEach(() => {
        fakeFetch = fetchMock.sandbox();
        subtitleProvider = root.srtPlayer.SubtitleProvider(fakeFetch);
    });

    afterEach(() => {
        fakeFetch.reset();
        subtitleProvider.shutdown();
        redux.dispatch(actionCreators.resetAll());
    });


    it('should search subtitle', (done) => {

        var imdbid = "0110912";
        var iso639 = "eng"; //default

        fakeFetch.mock(`${BASE_URL}/${imdbid}/${iso639}`, DEFAULT_SUBTITLE_SEARCH_RESULT);

        let validateResult = (result) => {
            expect(result.length).to.be.above(0);
            expect(result[0].movieTitle).to.equal('Pulp Fiction');
        };

        let unsubscribe = redux.subscribe(() => {
            let subtitleSearch = redux.getState().subtitleSearch;
            if (!subtitleSearch.isLoading && subtitleSearch.resultId !== -1) {
                unsubscribe();
                validateResult(subtitleSearch.result);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleSearchViaImdbId(imdbid))
    });


    it('empty result should also notify', (done) => {
        
        var imdbid = "0110912";
        var iso639 = "eng"; //default

        fakeFetch.mock(`${BASE_URL}/${imdbid}/${iso639}`, []);

        let validateResult = (result) => {
            expect(result.length).to.equal(0);
        };

        let unsubscribe = redux.subscribe(() => {
            let subtitleSearch = redux.getState().subtitleSearch;
            if (!subtitleSearch.isLoading && subtitleSearch.resultId !== -1) {
                unsubscribe();
                validateResult(subtitleSearch.result);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleSearchViaImdbId(imdbid))
    });

    it('missing language should not trigger a search', (done) => {

        redux.getState().subtitleSearch.language="";

        var imdbid = "0110912";
        var iso639 = "ger";

        fakeFetch.mock(`${BASE_URL}/${imdbid}/${iso639}`, []);

        let validateResult = (result) => {
            expect(result.length).to.equal(0);
        };

        let unsubscribe = redux.subscribe(() => {
            let subtitleSearch = redux.getState().subtitleSearch;
            if (!subtitleSearch.isLoading && subtitleSearch.resultId !== -1) {
                unsubscribe();
                validateResult(subtitleSearch.result);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleSearchViaImdbId(imdbid));
        redux.dispatch(actionCreators.triggerSubtitleSearchViaLanguage(iso639))
        
    });
});
