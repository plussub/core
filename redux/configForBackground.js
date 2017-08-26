srtPlayer.ReduxConfig = srtPlayer.ReduxConfig || (()=>{
    
        return {
            getInitialState:() => localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : null,
            shouldStoreState:false
        }
    })();