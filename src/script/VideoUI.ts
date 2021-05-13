import { ui } from "../ui/layaMaxUI";
import videoControlScript from "../videoControlScript";

export default class Video extends ui.VideoUI {
  public _currentPlayIndex:number;
  public _urls:string;
  public videoWin:Laya.Sprite;
  public videoCtl:any

  constructor() {
    super();
  }
  public onAwake(): void {
    this.width = Laya.stage.width
    this.videoWin.pos((Laya.stage.width - this.videoWin.width) / 2, this.videoWin.y)
    this.btn_close.on(Laya.Event.MOUSE_DOWN, this, this.onCloseClick)
    // u.registerScaleListener(this.btn_preview, this, this.onPreViewBtnClick, 1.2, !0),
    // u.registerScaleListener(this.btn_next, this, this.onNextBtnClick, 1.2, !0),
    this.videoWin.x = this.width / 2 - this.videoWin.width / 2
    this.videoWin.y = this.height / 2 - this.videoWin.height / 2
    this.videoCtl = this.videoWin.getComponent(videoControlScript)
  }
  public createVideo(e):void {
      this.videoCtl.creatVideo(e)
      // this.btn_preview.visible = !1,
      // this.btn_next.visible = !1
  }
  public createVideos(e):void {
      this._urls = e
      this._currentPlayIndex = 0
      this.videoCtl.creatVideo(e[0])
      // this.setBtnStatus()
  }
  // setBtnStatus() {
  //   if(this._urls.length > 1) {
  //     this.btn_preview.visible = this._currentPlayIndex > 0,
  //     this.btn_next.visible = this._currentPlayIndex < this._urls.length - 1
  //   } else {
  //     this.btn_preview.visible = false
  //     this.btn_next.visible = false
  //   }
  // }
  public onCloseClick():void {
      null != this.videoCtl && this.videoCtl.myClear()
      this.destroy()
      this.videoCtl = null
  }
  // onPreViewBtnClick() {
  //     this._currentPlayIndex <= 0 || null == this.videoCtl || (this._currentPlayIndex--,
  //     this.setBtnStatus(),
  //     this.videoCtl.playVideo(this._urls[this._currentPlayIndex]))
  // }
  // onNextBtnClick() {
  //     this._currentPlayIndex >= this._urls.length - 1 || null == this.videoCtl || (this._currentPlayIndex++,
  //     this.setBtnStatus(),
  //     this.videoCtl.playVideo(this._urls[this._currentPlayIndex]))
  // }
}