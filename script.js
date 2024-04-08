// ==UserScript==
// @name         Load Time Tracker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Track load times in web applications
// @match        http://localhost:5173/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// ==/UserScript==

(function() {
    const runs = 5;
    let url = "http://localhost:5173/";

    function measure() {
        'use strict';
        console.log("Load time tracking script running");
        let startTime = performance.now();
        window.addEventListener("allModelsLoaded", () => {
            console.log("Load time calculating");
            let endTime = performance.now();
            let loadTime = endTime - startTime;
            console.log('Load Time: ' + loadTime + ' ms');
            saveAndCheckLoadTime(loadTime);
        });
    }

    function saveAndCheckLoadTime(loadTime) {
        let loadTimes = GM_getValue('loadTimes', []);
        loadTimes.push(loadTime);
        GM_setValue('loadTimes', loadTimes);
        if (loadTimes.length >= runs) {
            console.log('All Load Times:', loadTimes);
            download();
        } else {
            reload();
        }
    }

    function download() {
        setTimeout(() => {
            let results = GM_getValue('loadTimes',[]);
            const resultsJSON = JSON.stringify(results, null, 2);
            const blob = new Blob([resultsJSON], { type: 'application/json' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'results.json';
            downloadLink.textContent = 'Download Results';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            GM_setValue('loadTimes', []);
        }, 5000);
    }

    function reload() {
        setTimeout(() => {
            window.location.href = url;
        }, 5000);
    }

    measure();
})();