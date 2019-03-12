
const maxWidth: number = 750

function setFontSize(): void {
  let htmlEle: any = document.querySelector('html')
  let docWidth: any = document.documentElement.clientWidth
  let realWidth: any = docWidth > maxWidth ? maxWidth : docWidth
  htmlEle.style.fontSize = realWidth / 7.5 + 'px'
}

function setRem(): void {
  setFontSize()
  window.addEventListener('resize', setFontSize, false)
}

setRem()
