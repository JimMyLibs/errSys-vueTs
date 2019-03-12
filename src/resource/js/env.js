/**
 * 获取当前环境信息，如操作系统，浏览器，你我金融app等信息
 */

const ua = navigator.userAgent.toLowerCase()



// 判断是否在你我金融app中
export function isApp() {
  return ua.includes('niiwoo') || ua.includes('sweet')
}

// 判断是否在微信中
export function isWechat() {
  return ua.includes('micromessenger')
}

// android终端
export function isAndroid() {
  return ua.includes('android') || ua.includes('linux')
}

// ios终端
export function isIOS() {
  let iosReg = /\(i[^;]+;( U;)? CPU.+Mac OS X/i
  return iosReg.test(ua)
}

// 获取你我金融app版本号
export function getAppVersion() {
  const matchArr = ua.match(/niiwoo\/([\d.]+)/)
  return matchArr
    ? matchArr[1]
    : ''
}


/**
 * [getOs 获取当前系统及系统版本信息]
 * @return {object} [版本信息]
 * @example
 * {os: 'Safari', version: '10.1.1'}
 */
export function getOs() {
  // const ua = "Mozilla/5.0 (Intel android 6.0.1) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4".toLowerCase()

  let os = ''
  let version = ''

  // apple移动设备正则
  let appleMobileRe = /iphone|ipad|midp|ipod/

  // apple移动设备操作系统正则
  let appleOsMobileRe = /(iphone os.*?|ipad os.*?|midp os.*?|ipod os.*?)(\d+(.\d+)+)/

  // 监测是否为 apple移动设备
  let amb = ua.match(appleMobileRe)

  if (amb) {
    // 监测apple操作系统正则
    let am = ua.match(appleOsMobileRe)
    if (am) {
      os = am[1]
      version = am[2]
    } else {
      os = amb[0]
    }
  } else if (ua.match(/mac/)) {
    // mac
    let macRe = /(mac os.*?)(\d+(.\d+)+)/
    let mm = ua.match(macRe)
    if (mm) {
      os = mm[1]
      version = mm[2]
    }
    os = os || 'Mac'
  } else if (ua.match(/android/)) {
    // android
    let aRe = /(android).*?([\d.]+)/
    let andm = ua.match(aRe)
    if (andm) {
      os = andm[1]
      version = andm[2]
    }
    os = os || 'android'
  } else {
    // windows
    if (ua.match(/windows/)) {
      let wRe = /(windows nt).*?([\d.]+)/
      let wm = ua.match(wRe)
      if (wm) {
        os = wm[1]
        version = wm[2]
      }
      os = os || 'windows'
    }
  }

  os = os
    ? os.replace(/( os)|( nt)/i, '')
    : ''

  return {
    os: os || '',
    version: version || ''
  }
}

/**
 * getBrowserInfo 获取浏览器名称及版本信息
 * @return {object} [浏览器名称及版本信息]
 * @example
 * {os: 'Safari', version: '10.1.1'}
 */
export function getBrowserInfo() {
  let browser = ''
  let version = ''

  // 浏览器匹配名称与浏览器名称转换
  let exchangeObj = {
    'msie': 'IE',
    'trident': 'Edge',
    'micromessenger': 'Wechat'
  }

  let re = /(msie|trident|firefox|opera|mqqbrowser|ucbrowser|baiduboxapp|micromessenger).*?([\d.]+)/

  let m = ua.match(re)
  if (m) {
    browser = m[1]
    version = m[2]
  } else if (ua.match(/niiwoo/)) {
    // niiwoo
    let nm = ua.match(/(niiwoo).*?([\d.]+)/)
    if (nm) {
      browser = nm[1]
      version = nm[2]
    }
  } else if (ua.match(/chrome/)) {
    // chrome
    let cm = ua.match(/(chrome).*?([\d.]+)/)
    if (cm) {
      browser = cm[1]
      version = cm[2]
    }
  } else {
    // safari
    let sm = ua.match(/(version).*?([\d.]+)/)
    if (sm && ua.match(/safari/)) {
      browser = 'safari'
      version = sm[2]
    }
  }

  browser = browser
    ? (exchangeObj[browser] || browser)
    : ''
  version = version
    ? version
    : ''

  return {browser: browser, version}
}
