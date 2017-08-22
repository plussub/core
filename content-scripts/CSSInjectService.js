/**
 * Created by sonste on 15.03.2016.
 */
srtPlayer.CSSInjectService = srtPlayer.CSSInjectService || (() => {
        "use strict";
        const injectCssId = 'plussubInjectedCss';
        const options = Object.assign({
            nodeToInjectStyleElement: () => document.querySelectorAll("body")
        }, srtPlayer.InjectCssOptions);

        let previousLoadedCss = "";
        srtPlayer.Redux.subscribe(()=>{
            let css = srtPlayer.Redux.store.getState().option.css;
            if(previousLoadedCss === css){
                return;
            }
            previousLoadedCss = css;

            let parentNode = options.nodeToInjectStyleElement();
            let oldElement = parentNode.querySelector('#' + injectCssId);
            if (oldElement && oldElement.parentElement) {
                oldElement.parentElement.removeChild(oldElement);
            }

            let cssElement = document.createElement('style');
            cssElement.setAttribute('id', injectCssId);
            cssElement.innerHTML = css;
            parentNode.appendChild(cssElement);
        });
    });