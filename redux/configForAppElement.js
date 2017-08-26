/**
 * Created by stefa on 26.08.2017.
 */

srtPlayer.ReduxConfig = srtPlayer.ReduxConfig || (()=>{

    return {
        getInitialState:() => console.log("todo -> get state from background page"),
        shouldStoreState:false
    }
})();