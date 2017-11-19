//class under test
const root = require('../SubtitleProvider.js');

//test framework dependencies
const expect = require('chai').expect;
const fetchMock = require('fetch-mock');

//application dependencies
const redux = require('../../../redux/redux.js').srtPlayer.Redux;
const actionCreators = require('../../../redux/actionCreators.js').srtPlayer.ActionCreators;
let Descriptor = require('../../../descriptor/Descriptor.js').srtPlayer.Descriptor;

//mocks
const srtInflaterResponseToAsciiMock = require('./InflaterMock.js').srtMock.srtInflaterResponseToAsciiMock;

//expected results
const DEFAULT_SUBTITLE_SEARCH_RESULT = require('./expectedResponse.js').DEFAULT_SUBTITLE_SEARCH_RESULT;


describe('SubtitleProvider', () => {

    let subtitleProvider;
    const BASE_URL = 'https://app.plus-sub.com/subtitle';


    let fakeFetch;

    beforeEach(() => {
        fakeFetch = fetchMock.sandbox();
        root.srtPlayer.Inflater = srtInflaterResponseToAsciiMock;
        subtitleProvider = root.srtPlayer.SubtitleProvider(fakeFetch);
    });

    afterEach(() => {
        fakeFetch.reset();
        subtitleProvider.shutdown();
        redux.dispatch(actionCreators.resetAll());
    });


    it('should search subtitle', (done) => {

        const imdbid = "0110912";
        const iso639 = "eng"; //default

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


    it('should handle connection errors properly when subtitle are searched', (done) => {


        const imdbid = "0110912";
        const iso639 = "eng"; //default

        fakeFetch.mock(`${BASE_URL}/${imdbid}/${iso639}`, () => {
            throw {
                type: "TypeError",
                message: "Failed to fetch"
            };
        });

        let validateResult = (subtitleSearch, errors) => {
            expect(subtitleSearch.imdbId).to.equal("");
            expect(errors.length).to.equal(1);
            expect(errors[0].message).to.equal("Failed to search subtitle. Are you Disconnected? Err: ([object Object])");
            expect(errors[0].src).to.equal("subtitleProvider");
        };


        let previousErrors = [];
        let unsubscribe = redux.subscribe(() => {
            let subtitleSearch = redux.getState().subtitleSearch;
            let errors = redux.getState().errors;
            if (previousErrors.length === errors.length) {
                return;
            }
            previousErrors = errors;

            if (errors.length > 0) {
                unsubscribe();
                validateResult(subtitleSearch, errors);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleSearchViaImdbId(imdbid));
    });


    it('should handle invalid http status codes properly when subtitle are searched', (done) => {


        const imdbid = "0110912";
        const iso639 = "eng"; //default

        fakeFetch.mock(`${BASE_URL}/${imdbid}/${iso639}`, {
            status: 404
        });

        let validateResult = (subtitleSearch, errors) => {
            expect(subtitleSearch.imdbId).to.equal("");
            expect(errors.length).to.equal(1);
            expect(errors[0].message).to.equal(`Failed to search subtitle. Status 404`);
            expect(errors[0].src).to.equal("subtitleProvider");

        };


        let previousErrors = [];
        let unsubscribe = redux.subscribe(() => {
            let subtitleSearch = redux.getState().subtitleSearch;
            let errors = redux.getState().errors;
            if (previousErrors.length === errors.length) {
                return;
            }
            previousErrors = errors;

            if (errors.length > 0) {
                unsubscribe();
                validateResult(subtitleSearch, errors);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleSearchViaImdbId(imdbid));
    });

    it('empty result should also notify', (done) => {

        const imdbid = "0110912";
        const iso639 = "eng"; //default

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

        redux.getState().subtitleSearch.language = "";

        const imdbid = "0110912";
        const iso639 = "ger";

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
        redux.dispatch(actionCreators.triggerSubtitleSearchViaLanguage(iso639));

    });

    it('should http downloadlink transform to https and download link content', (done) => {

        const downloadLinkResult = "zipped result";

        fakeFetch.mock(`https://somedownloadlink`, downloadLinkResult);

        let unsubscribe = redux.subscribe(() => {
            let subtitleDownload = redux.getState().subtitleDownload;
            if (subtitleDownload.result === downloadLinkResult) {
                unsubscribe();
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleDownload("http://somedownloadlink"));
    });

    it('should handle invalid http status codes properly when download link content', (done) => {

        fakeFetch.mock(`https://somedownloadlink`, {
            status: 404
        });

        let validateResult = (subtitleDownload, errors) => {
            expect(subtitleDownload.downloadLink).to.equal("");
            expect(errors.length).to.equal(1);
            expect(errors[0].message).to.equal(`Failed to download subtitle. Status 404`);
            expect(errors[0].src).to.equal("subtitleProvider");
        };

        let previousErrors = [];
        let unsubscribe = redux.subscribe(() => {
            let subtitleSearch = redux.getState().subtitleDownload;
            let errors = redux.getState().errors;
            if (previousErrors.length === errors.length) {
                return;
            }
            previousErrors = errors;

            if (errors.length > 0) {
                unsubscribe();
                validateResult(subtitleSearch, errors);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleDownload("http://somedownloadlink"));
    });


    it('should handle connection errors properly when download link content', (done) => {
        fakeFetch.mock(`https://somedownloadlink`, () => {
            throw {
                type: "TypeError",
                message: "Failed to fetch"
            }
        });

        let validateResult = (subtitleDownload, errors) => {
            expect(subtitleDownload.downloadLink).to.equal("");
            expect(errors.length).to.equal(1);
            expect(errors[0].message).to.equal("Failed to download subtitle. Are you Disconnected? Err: ([object Object])");
            expect(errors[0].src).to.equal("subtitleProvider");
        };

        let previousErrors = [];
        let unsubscribe = redux.subscribe(() => {
            let subtitleSearch = redux.getState().subtitleDownload;
            let errors = redux.getState().errors;
            if (previousErrors.length === errors.length) {
                return;
            }
            previousErrors = errors;

            if (errors.length > 0) {
                unsubscribe();
                validateResult(subtitleSearch, errors);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleDownload("http://somedownloadlink"));

    });
});
