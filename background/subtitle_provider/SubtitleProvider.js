var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../../descriptor/Descriptor.js').srtPlayer.Descriptor;
    srtPlayer.Redux = require('../../redux/redux').srtPlayer.Redux;
    srtPlayer.ActionCreators = require('../../redux/actionCreators').srtPlayer.ActionCreators;        
}

srtPlayer.SubtitleProvider = srtPlayer.SubtitleProvider || ((fetch = window.fetch) => {

        let previousImdbId = srtPlayer.Redux.getState().subtitleSearch.imdbId;
        let previousLanguage = srtPlayer.Redux.getState().subtitleSearch.language;
        let previousLink = srtPlayer.Redux.getState().subtitleSearch.downloadLink;
        
        let unsubscribe = srtPlayer.Redux.subscribe(() => {
            let subtitleSearch = srtPlayer.Redux.getState().subtitleSearch;
            if (previousImdbId !== subtitleSearch.imdbId || previousLanguage !== subtitleSearch.language) {
                previousImdbId = subtitleSearch.imdbId;
                previousLanguage = subtitleSearch.language;
               
                if(subtitleSearch.imdbId !== "" && subtitleSearch.language!==""){
                    search(subtitleSearch.imdbId, subtitleSearch.language);
                }
            }

            if (previousLink !== subtitleSearch.downloadLink && subtitleSearch.downloadLink !== "") {
                previousLink = subtitleSearch.downloadLink;
                if(subtitleSearch.downloadLink!="") {
                    download(subtitleSearch.downloadLink);
                }
            }
        });


        /**
         * imdbid -> movie id from imdb
         * language -> language iso639 code for subtitle
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

                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSubtitleSearchResult(result.map(entry => Object.assign({}, entry, {valueField: JSON.stringify(entry)}))));

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
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.parseRawSubtitle(raw));

            } catch (err) {
                console.error();
            }
        }

        return {
            shutdown:unsubscribe
        }

    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.SubtitleProvider === 'function') {
    srtPlayer.SubtitleProvider = srtPlayer.SubtitleProvider();
}