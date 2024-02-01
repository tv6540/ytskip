// ==UserScript==
// @name         Youtube Skip Ad
// @namespace    http://tampermonkey.net/
// @version      v0.0.1
// @description  Skip ad if possible!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM.xmlHttpRequest
// ==/UserScript==
(function () {
  'use strict';
  var winX = -100, winY = -100

  const api = (method, url, data, headers) => {
    return new Promise(resolve => {
      GM.xmlHttpRequest({
        method: method,
        url: url,
        data: data ? JSON.stringify(data) : '',
        headers: headers,
        onload: function (response) {
          resolve(response.response);
        },
        onerror: function (error) {
          console.log('unexpected error while calling ' + url + " , " + error)
        }
      });
    });
  }

  const debounce = (fn, delay) => {
    let timer
    return function (...args) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn(...args)
      }, delay)
    }
  }

  window.addEventListener("mousemove", debounce((event) => {
    winX = event.screenX - event.clientX
    winY = event.screenY - event.clientY
    console.debug(`winXY: ${winX}, ${winY}`)
  }, 1000));

  const interval = setInterval(async () => {
    const slotElem = document.querySelector(".ytp-ad-skip-button-slot")
    const containerElem = document.querySelector(".ytp-ad-skip-button-container")
    const skipAdBtn = document.querySelector(".ytp-skip-ad-button")
    if (containerElem) {
      if (!containerElem.style.display || containerElem.style.display !== 'none') {
        const skipBtn = containerElem.querySelector('button')
        if (skipBtn) {
          const bounds = skipBtn.getBoundingClientRect()
          const x = Math.round(winX + bounds.x + (skipBtn.offsetWidth / 2))
          const y = Math.round(winY + bounds.y + (skipBtn.offsetHeight / 2))
          const rspTxt = await api('GET', `http://localhost:8080/ytskip/click/${x}/${y}`, null, {
            "Content-Type": "application/json"
          })
          console.log(`clicking skipBtn, ${interval} @ ${x}, ${y} => ${rspTxt}`)
        } else {
          console.debug(`no skipBtn, ${interval}`)
        }
      } else if (slotElem) {
        if (!slotElem.style.display || slotElem.style.display !== 'none') {
          const skipBtn = slotElem.querySelector('button')
          if (skipBtn) {
            skipBtn.click()
          } else {
            console.debug(`no skipBtn, ${interval}`)
          }
        } else {
          console.debug(`no slotElem style, ${interval}`)
        }
      } else {
        console.debug(`no containerElem style, ${interval}`)
      }
    } else if (skipAdBtn) {
          const skipReady = document.querySelector(".ytp-preview-ad")?.style?.display === 'none'
          if(skipReady) {
              const bounds = skipAdBtn.getBoundingClientRect()
              const x = Math.round(winX + bounds.x + (skipAdBtn.offsetWidth / 2))
              const y = Math.round(winY + bounds.y + (skipAdBtn.offsetHeight / 2))
              const rspTxt = await api('GET', `http://localhost:8080/ytskip/click/${x}/${y}`, null, {
                  "Content-Type": "application/json"
              })
              console.log(`clicking skipAdBtn, ${interval} @ ${x}, ${y} => ${rspTxt}`)
          } else {
              console.debug(`not ready skipAdBtn, ${interval} @ ${x}, ${y} => ${rspTxt}`)
          }
      } else {
      console.debug(`no slotElem, ${interval}`)
    }
  }, 1000)
  console.log(`YTAS, interval: ${interval}`)
})();
