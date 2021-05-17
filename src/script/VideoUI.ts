import { ui } from "../ui/layaMaxUI";
import videoControlScript from "../videoControlScript";
import constValue from '../ConstEvent';

export default class Video extends ui.VideoUI {
  public _currentPlayIndex:number;
  public _urls:string;
  public videoWin:Laya.Sprite;
  public videoBg:Laya.Sprite;
  public videoCtl:any

  constructor() {
    super();

  }
  public onAwake(): void {
    console.log(this)

    this.width = Laya.stage.width
    this.videoWin.pos((Laya.stage.width - this.videoWin.width) / 2, this.videoWin.y)
    this.btn_close.pos(((Laya.stage.width - this.videoWin.width) / 2) + this.videoWin.width,this.videoWin.y)
    this.btn_close.on(Laya.Event.MOUSE_DOWN, this, this.onCloseClick)
    // u.registerScaleListener(this.btn_preview, this, this.onPreViewBtnClick, 1.2, !0),
    // u.registerScaleListener(this.btn_next, this, this.onNextBtnClick, 1.2, !0),
    this.videoWin.x = this.width / 2 - this.videoWin.width / 2
    this.videoWin.y = this.height / 2 - this.videoWin.height / 2
    console.log('videoWin.x', this.videoWin.x)
    console.log('videoWin.y', this.videoWin.y)
    this.videoCtl = this.videoWin.addComponent(videoControlScript)

    this.videoBg.pos(0, 0);
    this.videoBg.size(Laya.stage.width, Laya.stage.height);
    this.videoBg.graphics.drawRect(0, 0, this.videoBg.width, this.videoBg.height, "rgba(0,0,0,.4)");

    this.videoBg.on(Laya.Event.MOUSE_DOWN, this, this.mouseHandler);
    // let reference: Laya.Sprite = new Laya.Sprite();
    // Laya.stage.addChild(reference);
    // reference.pos(0, 0);
    // reference.size(Laya.stage.width, Laya.stage.height);
    // reference.graphics.drawRect(0, 0, reference.width, reference.height, "rgba(0,0,0,.4)");
    
  }
  // public fitDOM():void {
  //   // 设置画布上的对齐参照物
    
  //   Laya.Utils.fitDOMElementInArea(this.videoWin, reference, 0, 0, reference.width, reference.height);
  // }
  public mouseHandler() {
    constValue.isClickVideoBtn = true
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
      constValue.isClickVideoBtn = true;
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