/**
 * Created by sonste on 27.02.2016.
 */

var srtPlayer = srtPlayer || {};

srtPlayer.FindVideoService = srtPlayer.FindVideoService || (() => {
        "use strict";

        const options = Object.assign({
            collectNodeListOfFoundedVideos:() => document.querySelectorAll("video"),
            observedNodeToDetectedAddedVideos:() => document.querySelector("body")
        },srtPlayer.FindVideoServiceOptions);

        const cssTag = "plussubDetectedVideo";

        const detectNotTaggedVideos = function () {
            const videoList = Array.from(options.collectNodeListOfFoundedVideos());
            videoList
                .filter(video => !video.classList.contains(cssTag))
                .forEach(video => {
                    video.classList.add(cssTag);
                    srtPlayer.Redux.dispatch(foundVideoAction(video));
                });
        };
        detectNotTaggedVideos();

        new MutationObserver(detectNotTaggedVideos).observe(options.observedNodeToDetectedAddedVideos(), {childList: true, subtree: true});

        function foundVideoAction(video = null) {
            return {
                type: srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND,
                payload: video,
                meta: "contentScript"
            };
        }
    });