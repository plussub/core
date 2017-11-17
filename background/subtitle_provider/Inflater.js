var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
}

srtPlayer.Inflater = srtPlayer.Inflater|| (() => {

    return{
        inflate: async (response)=>{
            pako.inflate(new Uint8Array(await response.arrayBuffer()), {to: "string"});
        }
    };
});
