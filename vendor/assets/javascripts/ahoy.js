/*jslint browser: true, indent: 2, plusplus: true, vars: true */

(function (window) {
  "use strict";

  var debugMode = false;
  var ahoy_visitTtl, ahoy_visitorTtl;
  var $ = window.jQuery || window.Zepto || window.$;
  var ahoy_visitToken, ahoy_visitorToken;

  if (debugMode) {
    ahoy_visitTtl = 0.2;
    ahoy_visitorTtl = 5; // 5 minutes
  } else {
    ahoy_visitTtl = 4 * 60; // 4 hours
    ahoy_visitorTtl = 2 * 365 * 24 * 60; // 2 years
  }

  // cookies

  // http://www.quirksmode.org/js/cookies.html
  function setCookie(name, value, ttl) {
    var expires = "";
    if (ttl) {
      var date = new Date();
      date.setTime(date.getTime() + (ttl * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function getCookie(name) {
    var i, c;
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (i = 0; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  // ids

  // https://github.com/klughammer/node-randomstring
  function generateToken() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
    var length = 32;
    var string = '';
    var i, randomNumber;

    for (i = 0; i < length; i++) {
      randomNumber = Math.floor(Math.random() * chars.length);
      string += chars.substring(randomNumber, randomNumber + 1);
    }

    return string;
  }

  function debug(message) {
    if (debugMode) {
      window.console.log(message, ahoy_visitToken, ahoy_visitorToken);
    }
  }

  // main

  ahoy_visitToken = getCookie("ahoy_ahoy_visit");
  ahoy_visitorToken = getCookie("ahoy_ahoy_visitor");

  if (ahoy_visitToken && ahoy_visitorToken) {
    // TODO keep visit alive?
    debug("Active ahoy_visit");
  } else {
    if (!ahoy_visitorToken) {
      ahoy_visitorToken = generateToken();
      setCookie("ahoy_ahoy_visitor", ahoy_visitorToken, ahoy_visitorTtl);
    }

    // always generate a new ahoy_visit id here
    ahoy_visitToken = generateToken();
    setCookie("ahoy_ahoy_visit", ahoy_visitToken, ahoy_visitTtl);

    // make sure cookies are enabled
    if (getCookie("ahoy_ahoy_visit")) {
      debug("ahoy_visit started");

      var data = {
        ahoy_visit_token: ahoy_visitToken,
        ahoy_visitor_token: ahoy_visitorToken,
        landing_page: window.location.href
      };

      // referrer
      if (document.referrer.length > 0) {
        data.referrer = document.referrer;
      }

      debug(data);

      $.post("/ahoy/ahoy_visits", data);
    } else {
      debug("Cookies disabled");
    }
  }

}(window));
