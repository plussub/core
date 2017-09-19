/**
 * Created by stefa on 05.03.2017.
 */
var expect = require('chai').expect;
var requirejs = require('requirejs');
var messageBus = require('../../../messagebus/MessageBus.js');
var nodeFetch = require('node-fetch');
var root = require('../SubtitleProvider.js');
var Descriptor = require('../../../descriptor/Descriptor.js').srtPlayer.Descriptor;


describe('Subtitle Provider', ()=> {

    var SERVICE_CHANNEL;
    var subtitleProvider;

    beforeEach(() => {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(Descriptor.CHANNEL.SERVICE);
        subtitleProvider = root.srtPlayer.SubtitleProvider(messageBus, nodeFetch);
    });


    it('should search correct subtitle', function (done) {

        this.timeout(20000);

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.PUB.SEARCH_RESULT,
            callback: (result) => {
                "use strict";
                expect(result.length).to.be.above(0);
                expect(result[0].movieTitle).to.equal('P.S. I Love You');
                done();
            }
        });


        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.SUB.SEARCH,
            data: {
                imdbid: "0431308", //P.S. I Love You
                iso639: "eng"
            }
        });
    });
    // array buffer not supported in node
    // it('should download correct subtitle', function (done) {
    //
    //     this.timeout(15000);
    //     setTimeout(()=>done(),12000);
    //     SERVICE_CHANNEL.publish({
    //         topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.SUB.DOWNLOAD,
    //         data:"http://dl.opensubtitles.org/en/download/src-api/vrf-e9750b7f/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/filead/154507.gz"
    //     });
    //
    // });
});