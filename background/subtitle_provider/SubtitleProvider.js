var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.Descriptor = require('../../descriptor/Descriptor.js').srtPlayer.Descriptor;
}

srtPlayer.SubtitleProvider = srtPlayer.SubtitleProvider || ((messageBusLocal = messageBus, fetch = window.fetch) => {

        let previousImdbId = srtPlayer.Redux.getState().subtitleSearch.imdbId;
        let previousLanguage = srtPlayer.Redux.getState().subtitleSearch.language;
        let previousLink = srtPlayer.Redux.getState().subtitleSearch.downloadLink;

        srtPlayer.Redux.subscribe(() => {
            let subtitleSearch = srtPlayer.Redux.getState().subtitleSearch;

            if (previousImdbId !== subtitleSearch.imdbId || previousLanguage !== subtitleSearch.language) {
                console.log("LOAD SUBTITLE");
                previousImdbId = subtitleSearch.imdbId;
                previousLanguage = subtitleSearch.language;
                search(subtitleSearch.imdbId, subtitleSearch.language);
            }

            if (previousLink !== subtitleSearch.downloadLink && subtitleSearch.downloadLink !== "") {
                previousLink = subtitleSearch.downloadLink;
                download(subtitleSearch.downloadLink);
            }
        });

        function setSubtitleSearchResultAction(searchResult) {
            return {
                type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESULT,
                payload: searchResult,
                meta: "backgroundPage"
            };
        }

        function parseRawSubtitleAction(raw) {
            return {
                type: srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE,
                payload: raw,
                meta: "backgroundPage"
            };
        }

        /**
         * data.imdbid -> movie id from imdb
         * data.iso639 -> language code for subtitle
         * @param data
         */
        async function search(imdbId, language = "en") {

            if (!imdbId) {
                console.log(`invalid imdbid parameter: ${imdbId}`);
                return;
            }

            try {
                const response = await fetch(`https://app.plus-sub.com/subtitle/${imdbId}/${language}`)
                if (response.status !== 200) {
                    console.log('Invalid Status Code: ' + response.status);
                    return;
                }
                const responseObject = await response.json();
                const result = responseObject.map(entry =>
                    Object.assign({}, {
                        movieTitle: entry.MovieName,
                        subtitleLanguage: entry.LanguageName,
                        idSubtitleFile: entry.IDSubtitleFile,
                        subtitleRating: entry.SubRating,
                        downloadLink: entry.SubDownloadLink
                    }));

                srtPlayer.Redux.dispatch(setSubtitleSearchResultAction({
                    resultId: srtPlayer.GuidService.createGuid(),
                    result: result.map(entry => Object.assign({}, entry, {valueField: JSON.stringify(entry)}))
                }));

            } catch (err) {
                console.error(err);
            }
        }

        async function download(downloadLink) {
            let link = downloadLink.replace('http://', 'https://');
            try {
                const response = await fetch(link);
                if (response.status !== 200) {
                    console.log('Invalid Status Code: ' + response.status);
                    return;
                }
                const raw = await pako.inflate(new Uint8Array(await response.arrayBuffer()), {to: "string"});
                srtPlayer.Redux.dispatch(parseRawSubtitleAction(raw));

            } catch (err) {
                console.error();
            }
        }


    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.SubtitleProvider === 'function') {
    srtPlayer.SubtitleProvider = srtPlayer.SubtitleProvider();
}