;(function() {
  'use strict'
  var cfg = document.currentScript
  if (!cfg) return

  var STORE_ID = cfg.getAttribute('data-store-id')
  var ENDPOINT = cfg.getAttribute('data-endpoint') || '/api/analytics/collect'
  if (!STORE_ID) return

  // Anonymous session ID — sessionStorage only, no cookies (ANALYTICS-RULE 2)
  var SID = sessionStorage.getItem('_tmz')
  if (!SID) {
    try {
      var arr = new Uint8Array(16)
      crypto.getRandomValues(arr)
      SID = Array.from(arr, function(b) {
        return b.toString(16).padStart(2, '0')
      }).join('')
    } catch(e) {
      SID = Math.random().toString(36).slice(2) + Date.now().toString(36)
    }
    sessionStorage.setItem('_tmz', SID)
  }

  function device() {
    var w = window.innerWidth
    return w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
  }

  function referrerDomain() {
    try {
      return document.referrer ? new URL(document.referrer).hostname : ''
    } catch(e) { return '' }
  }

  // Always use sendBeacon — never fetch (ANALYTICS-RULE 4)
  function send(data) {
    try {
      data.storeId = STORE_ID
      data.sessionId = SID
      data.ts = Date.now()
      navigator.sendBeacon(ENDPOINT, JSON.stringify(data))
    } catch(e) {}  // Always silent (ANALYTICS-RULE 4)
  }

  // Page view on load
  send({
    type: 'pageview',
    page: location.pathname,
    referrer: referrerDomain(),
    device: device(),
    browser: (navigator.userAgent.match(/(chrome|safari|firefox|edge|opera)/i) || [''])[0].toLowerCase()
  })

  // Scroll depth tracking — throttled 500ms (ANALYTICS-RULE 4)
  var maxDepth = 0
  var scrollTimer
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(function() {
      var h = document.body.scrollHeight - window.innerHeight
      if (h <= 0) return
      var d = Math.min(100, Math.round((window.scrollY / h) * 100))
      if (d > maxDepth) maxDepth = d
    }, 500)
  }, { passive: true })

  // Send scroll depth on exit
  window.addEventListener('beforeunload', function() {
    if (maxDepth > 0) {
      send({ type: 'scroll', page: location.pathname, depth: maxDepth })
    }
  })

  // Click heatmap
  document.addEventListener('click', function(e) {
    try {
      var h = Math.max(document.body.scrollHeight, 1)
      send({
        type: 'click',
        page: location.pathname,
        x: Math.round((e.clientX / window.innerWidth) * 100),
        y: Math.round((e.pageY / h) * 100),
        device: device()
      })
    } catch(e) {}
  })

  // Mouse move — throttled 100ms (ANALYTICS-RULE 4)
  var lastMove = 0
  document.addEventListener('mousemove', function(e) {
    var now = Date.now()
    if (now - lastMove < 100) return
    lastMove = now
    try {
      var h = Math.max(document.body.scrollHeight, 1)
      send({
        type: 'move',
        page: location.pathname,
        x: Math.round((e.clientX / window.innerWidth) * 100),
        y: Math.round((e.pageY / h) * 100),
        device: device()
      })
    } catch(e) {}
  }, { passive: true })

})()
