import { ui } from "../ui/layaMaxUI";

export default class Loading extends ui.LoadingUI {
    public progress:number = 0;
    public pro:Laya.ProgressBar;

    constructor() {
        super();
        Laya.init(600, 400, Laya.WebGL);
        Laya.stage.bgColor = "#FFF";//设置舞台背景颜色

        //加载自定义进度条资源，加载成功后执行onLoad回调方法
        Laya.loader.load(["UI/progress_loading.png","UI/progress_loading$bar.png"], Laya.Handler.create(this, onLoaded));
        function onLoaded() {
            //创建进度条对象，参数为皮肤地址(使用自定义进度条资源)，也可以用 skin 属性设置
            this.pro = new Laya.ProgressBar("ui/progress_loading.png");
            this.pro.width = 400;//组件长度
            this.pro.pos(60, 150);//组件显示的位置
            this.pro.value = 0;//当前的进度量.介于0和1之间,默认不设置时是0.5，即会出现在中间的位置
        
            //实例的进度条背景位图Image的有效缩放网格数据
            //数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔
            this.pro.sizeGrid = "5,5,5,5";
            Laya.stage.addChild(this.pro);
            // this.showInfo();
            //进度增加的帧循环
            Laya.timer.loop(10,this,this.changeProgressBar);
        }
    }

    //改变进度条的值
    public changeProgressBar():void {
        if (this.pro.value >= 1) {
            this.pro.value = 0;
        }
        this.pro.value += Math.random() * 0.1;
        this.tips.text = "正在加载中，请耐心等待：" + Math.floor(this.pro.value * 100) + " %";
    }
    
    //显示一个标签用于描述当前进度条的进度
    public showInfo():void {
        // this.tips = new Laya.Label();
        this.tips.text = "加载 0";
        this.tips.fontSize = 15;
    }

    // /*资源加载进度模拟（假进度）*/
    // public onLoop():void{
    //     //进度增加
    //     this.progress++;
    //     //最高100%进度
    //     if(this.progress > 100){
    //         this.progress = 100;
    //         this.tips.text = "加载完毕，即将进入展馆...";
    //         //清除所有事件监听，包括帧循环
    //         Laya.timer.clearAll(this);
    //         //进度100%后，自动移除界面
    //         this.removeSelf();
    //     }
    //     else{
    //         //更新组件显示进度
    //         this.pro.value = this.progress / 100;
    //         this.tips.text = "正在加载中，请耐心等待："+this.progress+"%!";
    //     }


    //     // if (this.pro.value >= 1) {
    //     //     this.pro.value = 0;
    //     // }
    //     // this.pro.value += Math.random() * 0.1;
    //     // this.tips.text = "加载 " + Math.floor(this.pro.value * 100) + " %";
    // }
}