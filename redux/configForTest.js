/**
 * Created by stefa on 26.08.2017.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
}

srtPlayer.ReduxConfig = srtPlayer.ReduxConfig || (() => {

    return {
        getInitialState: () => null
    }
})();