srtPlayer.ReduxConfig = srtPlayer.ReduxConfig || (()=>{
    
        return {
            getInitialState:() => localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : null,
            shouldStoreState:true,
            createStore:(reducers,initialState)=>{
                let store = Redux.createStore(reducers, initialState);
                srtPlayer.BackgroundBridge(store);
                return store;
            }
        }
    })();