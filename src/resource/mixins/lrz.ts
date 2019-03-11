import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import lrz from 'lrz';



const pic2Base64 = (file: any) => {
  const reader: any = new FileReader();
  reader.readAsDataURL(file); // 读出 base64
  return new Promise((resolve, reject) => {
    reader.onloadend = (): void => {
      // 图片的 base64 格式, 可以直接当成 img 的 src 属性值    
      resolve(reader.result)
    };
  })
}

@Component
export default class Lrz extends Mixins(VueMixin) {
  prevCheck(file: any): boolean {// 压缩前检查图片格式，及原图大小不得大于5M，否则影响压缩效率
    const allowType = 'image/jpg,image/jpeg,image/png'.indexOf(file.type) > -1;
    const isLt5M = file.size / 1024 / 1024 < 5;
    return allowType && isLt5M;
  }
  async minPic(e: Event): Promise<string> {
    // 压缩图片:::::::::开始
    let file = (e.target as any).files[0];
    if ((e.target as any).value && this.prevCheck(file)) {
      console.log("压缩前", file.name, "格式", file.type, "大小", (file.size / 1024).toFixed(2) + 'KB', file)
      this.$loading(true);// 压缩中……
      await lrz(file, { width: screen.width * window.devicePixelRatio, quality: 0.6 })// 压缩图片
        .then((rst: any): void => {
          // 处理成功会执行
          console.log("压缩后", file.name, "生成后的图片的大小", (rst.fileLen / 1024).toFixed(2) + 'KB', "生成后的base64的大小", (rst.base64Len / 1024).toFixed(2) + 'KB', file, rst)
          const isLt1M = rst.fileLen / 1024 / 1024 < 1;
          if (isLt1M) {// 压缩后图片小于1M允许上传 
            file.base64 = rst.base64;
          } else {
            this.$tip('压缩后图片仍大于1M，请重新上传!');
          }
        })
        .catch((err: any) => {
          // 处理失败会执行
          console.log('处理失败', err);
          this.$tip('处理失败');
        })
        .always(() => {
          this.$loading(false);// 压缩结束
          // 不管是成功失败，都会执行
        });
      // await pic2Base64(file).then((res: any) => {
      //   file.base64 = res;
      // })
      return file
    } else {
      this.$tip('格式错误');
    }
    // 压缩图片:::::::::结束		
  }
}
