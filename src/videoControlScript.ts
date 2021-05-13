export default class videoControlScript extends Laya.Script {
    constructor() {
        super()

    }
    // creatVideo(e) {
    //     let div = Laya.Browser.createElement("div");
    //     div.className = "div",
    //     this.divElement = div,
    //     Laya.Browser.document.body.appendChild(t);
    //     let i = new Laya.Size(this.owner.width,this.owner.height);
    //     Laya.Utils.fitDOMElementInArea(t, this.owner, 0, 0, i.width, i.height);
    //     let s = Laya.Browser.createElement("video");
    //     s.setAttribute("id", "myvideo"),
    //     this.videoElement = s,
    //     s.controls = !0,
    //     s.setAttribute("webkit-playsinline", !0),
    //     s.setAttribute("playsinline", !0),
    //     s.setAttribute("x5-video-player-type", "h5"),
    //     s.setAttribute("x-webkit-airplay", !0),
    //     s.setAttribute("x5-video-orientation", "portrait"),
    //     s.setAttribute("preload", "auto"),
    //     s.setAttribute("width", "100%"),
    //     s.setAttribute("height", "100%"),
    //     s.style.zInddex = Laya.Render.canvas.style.zIndex + 1,
    //     s.type = "vedio/mp4",
    //     s.src = e,
    //     t.appendChild(s),
    //     this.videoElement.play()
    // }
    // playVideo(e) {
    //     null != this.videoElement && (this.videoElement.pause(),
    //     this.videoElement.src = e,
    //     this.videoElement.play())
    // }
    // createBtnOpen(e) {
    //     let t = Laya.Browser.createElement("div");
    //     t.className = "video-img",
    //     t.style.zInddex = 999,
    //     t.style.position = "absolute",
    //     this._div = t,
    //     Laya.Browser.document.body.appendChild(t),
    //     Laya.Utils.fitDOMElementInArea(t, this.owner, this.owner.x - this.owner.width / 2, this.owner.y - this.owner.height / 2, this.owner.width, this.owner.height),
    //     this.imgDivElement = t;
    //     let i = Laya.Browser.createElement("img");
    //     t.appendChild(i),
    //     this._imgDiv = i,
    //     this.playVideo(e)
    // }
    // videoEvent() {
    //     this.videoElement.addEventListener("loadstart", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("progress", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("play", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("pause", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("seeking", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("seeked", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("waiting", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("timeupdate", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("ended", ()=>{}
    //     ),
    //     this.videoElement.addEventListener("error", ()=>{}
    //     )
    // }
    // myClear() {
    //     null != this.divElement && Laya.Browser.document.body.hasChildNodes(this.divElement) && Laya.Browser.document.body.removeChild(this.divElement),
    //     this.imgDivElement && Laya.Browser.document.body.removeChild(this.imgDivElement)
    // }
}