/**
 * Created by sonste on 07.02.2016.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.Descriptor = require('../../descriptor/Descriptor.js').srtPlayer.Descriptor;
}


srtPlayer.ParserService = srtPlayer.ParserService || ((messageBusLocal = messageBus) => {

        var SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        var META_WRITE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.META_WRITE);
        var META_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.META);

        var SERVICE_CONST = srtPlayer.Descriptor.SERVICE.PARSER;
        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.PARSE,
            callback: (data) => {
                if (data.type !== 'srt') {
                    console.error("unknown subtitle type: %s", data.type);
                    throw 'unknown type';
                }

                let parsedSubtitle = srtPlayer.SRTParser().parse(data.raw);
                srtPlayer.Redux.dispatch(parsedSubtitleAction(parsedSubtitle));


                META_WRITE_CHANNEL.publish({
                    topic: 'parsed_subtitle.parsedSubtitle',
                    data: JSON.stringify(parsedSubtitle)
                });

                META_WRITE_CHANNEL.publish({
                    topic: 'parsed_subtitle.isParsed',
                    data: true
                });
            }
        });


        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.RESET,
            callback: () => {
                SERVICE_CHANNEL.publish({
                    topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
                    data: 'parsed_subtitle'
                });
            }
        });



        function parsedSubtitleAction(subtitle = "") {
            return {
                type: srtPlayer.Descriptor.SERVICE.PARSER.PUB.PARSED,
                payload: {
                    subtitle:subtitle,
                    id:guid()
                },
                meta: "backgroundPage"
            };
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.ParserService === 'function') {
    srtPlayer.ParserService = srtPlayer.ParserService();
}