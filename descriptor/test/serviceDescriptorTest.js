/**
 * Created by sonste on 07.03.2016.
 */

var expect = require('chai').expect;
var requirejs = require('requirejs');


describe('Descriptor', ()=> {


    var descriptor;
    beforeEach(()=> {
        descriptor = require('../Descriptor').srtPlayer.Descriptor;
    });

    it('should generate path', ()=> {
        
        expect(descriptor.SUBTITLE.OFFSET_TIME.PUB.VALUE).to.equal('subtitleOffset.value');
        expect(descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE).to.equal('remove.currentSubtitle');
    });
});