import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";

@Component
export default class PreviewPic extends Mixins(VueMixin) {
  picSrc: string = '';// picSrc用于预览
  picIndex: number = NaN;// picSrc用于删除
  galleryShow: boolean = false;
  beforeRouteLeave(to: any, from: any, next: any): void {
    this.$nextTick(() => {
      if (to.name === 'index' || to.name === 'order' || to.name === 'orderDetail') {
        if (this.galleryShow) {// 预览图片：退出
          this.galleryShow = false;
          next(false);
        } else {
          next();// 允许返回，否则没有历史记录         
        }
      } else {
        next();// 允许返回，否则没有历史记录                 
      }
    })
  }
  previewPic(base64: string, index: number): void {// 预览图片   
    if(base64){
      this.picSrc = base64;// picSrc用于预览
      this.picIndex = index;
      this.galleryShow = true;
    }else{
      console.log('图片为空');
    }
  }
  prevPicUrl(item: string): string {
    if (item) {
      // item = item.replace(/\\/g, '\/');
      if (item.indexOf('data:') === 0 || item.indexOf('http') === 0) {// base64
        return encodeURI(item);
      } else {// 远程图片
        return this.$getApiUrl() + item;
      }
    }else{
      return encodeURI(item);
    }
  }
}