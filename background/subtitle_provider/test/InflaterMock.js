var srtMock = srtMock || {};
if (typeof exports !== 'undefined') {
    require('es6-promise').polyfill();
    exports.srtMock = srtMock;
}

srtMock.srtInflaterResponseToAsciiMock = srtMock.srtInflaterResponseToAsciiMock || (() => {

        return {
            inflate: async (response) => {
                return await response.text();
            }
        };
    });
