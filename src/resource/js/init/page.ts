
const maxWidth = 750

function setFontSize() {
  let htmlEle = document.querySelector('html')
  let docWidth = document.documentElement.clientWidth
  let realWidth = docWidth > maxWidth ? maxWidth : docWidth
  htmlEle.style.fontSize = realWidth / 7.5 + 'px'
}

function setRem() {
  setFontSize()
  window.addEventListener('resize', setFontSize, false)
}

setRem()
