import constValue from './ConstEvent';
export default class videoControlScript extends Laya.Script {
    public divElement:any;
    public videoElement:any;
    public reference:Laya.Sprite;
    public videoOwner;
    constructor() {
        super()
        
    }
    public onAwake():void{
		this.videoOwner = this.owner as Laya.Sprite;
	}
    creatVideo(e) {
        let div = Laya.Browser.createElement("div");
        div.className = "div",
        this.divElement = div,
        Laya.Browser.document.body.appendChild(div);
        let i = new Laya.Size(this.videoOwner.width,this.videoOwner.height);
        Laya.Utils.fitDOMElementInArea(div, this.videoOwner, 0, 0, i.width, i.height);
        let video = Laya.Browser.createElement("video");
        video.setAttribute("id", "myvideo"),
        this.videoElement = video,
        video.controls = true,
        video.setAttribute("webkit-playsinline", true),
        video.setAttribute("playsinline", true),
        video.setAttribute("x5-video-player-type", "h5"),
        video.setAttribute("x-webkit-airplay", true),
        video.setAttribute("x5-video-orientation", "portrait"),
        video.setAttribute("preload", "auto"),
        video.setAttribute("width", "100%"),
        video.setAttribute("height", "100%"),
        video.setAttribute("autoplay", "true"),
        video.style.zInddex = Laya.Render.canvas.style.zIndex + 1,
        
        video.type = "vedio/mp4",
        video.src = e,
        div.appendChild(video)

        // const Sprite = Laya.Sprite;
        // this.reference = new Sprite();
        // Laya.stage.addChild(this.reference);
        // this.reference.pos(0, 0);
        // this.reference.size(Laya.stage.width, Laya.stage.height);
        // this.reference.graphics.drawRect(0, 0, this.reference.width, this.reference.height, "rgba(0,0,0,.4)");

        // this.reference.on(Laya.Event.CLICK, this, this.mouseHandler);

        // //创建遮罩对象
        // var cMask = new Laya.Sprite();
        // //画一个圆形的遮罩区域
        // cMask.graphics.drawCircle(80,80,50,"#ff0000");
        // //圆形所在的位置坐标
        // cMask.pos(120,50);
        // //实现img显示对象的遮罩效果
        // video.mask = cMask;
        // // this.videoElement.play()
        // 每次舞台尺寸变更时，都会调用Utils.fitDOMElementInArea设置Video的位置，对齐的位置和refence重合
        // Laya.stage.on(Laya.Event.RESIZE, this, Laya.Utils.fitDOMElementInArea, [this.videoElement, this.reference, 0, 0, this.reference.width, this.reference.height]);
    }
    // mouseHandler() {
        
    //     constValue.isClickVideoBtn = true;
    //     debugger
    // }
    playVideo(e) {
        null != this.videoElement && (this.videoElement.pause(),
        this.videoElement.src = e,
        this.videoElement.play())
    }
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
    videoEvent() {
        this.videoElement.addEventListener("loadstart", ()=>{}
        ),
        this.videoElement.addEventListener("progress", ()=>{}
        ),
        this.videoElement.addEventListener("play", ()=>{}
        ),
        this.videoElement.addEventListener("pause", ()=>{}
        ),
        this.videoElement.addEventListener("seeking", ()=>{}
        ),
        this.videoElement.addEventListener("seeked", ()=>{}
        ),
        this.videoElement.addEventListener("waiting", ()=>{}
        ),
        this.videoElement.addEventListener("timeupdate", ()=>{}
        ),
        this.videoElement.addEventListener("ended", ()=>{}
        ),
        this.videoElement.addEventListener("error", ()=>{}
        )
    }
    myClear() {
        console.log(Laya.Browser.document.body.hasChildNodes(this.divElement))
        null != this.divElement && Laya.Browser.document.body.hasChildNodes(this.divElement) && Laya.Browser.document.body.removeChild(this.divElement)
        constValue.isClickVideoBtn = false
        // this.imgDivElement && Laya.Browser.document.body.removeChild(this.imgDivElement)
    }
}