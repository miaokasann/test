import constValue from './ConstEvent';
import Main from './Main';
import JoyStick from './script/RockerUI'
import Video from './script/VideoUI';

export default class CameraControlScript extends Laya.Script3D {
    /**最大滑动距离（超过距离则显示操纵杆） */
    private readonly _MaxMoveDistance: number = 10;
    /** 开始点击时的舞台X坐标 */
    private _startStageX: number;
    /** 开始点击时的舞台Y坐标 */
    private _startStageY: number;

    public _dirForward:Laya.Vector3 = new Laya.Vector3()

    public _tempVector3:Laya.Vector3 = new Laya.Vector3()
    public yawPitchRoll:Laya.Vector3 = new Laya.Vector3()
    public resultRotation:Laya.Quaternion = new Laya.Quaternion()
    public tempRotationZ:Laya.Quaternion = new Laya.Quaternion();
    public tempRotationX:Laya.Quaternion = new Laya.Quaternion();
    public tempRotationY:Laya.Quaternion = new Laya.Quaternion();
    public rotaionSpeed:number = 0.00010
    public lastMouseX:number = 0
    public lastMouseY:number = 0
    public isMouseDown:boolean = false

    public touchMove:boolean;

    private camera:Laya.Camera;

    private moveSpeed:number = 2;

    private clickMovePassedTime:number;
    private clickMoveTimer:number;


    /*检测移动区碰撞器的射线*/
    private ray:Laya.Ray;
    /*碰撞检测信息*/
    private outHitInfo:Laya.HitResult;


    public posX:number = 0.0;
	public posY:number = 0.0;
	public point:Laya.Vector2 = new Laya.Vector2();
	public _ray:Laya.Ray;
	public _outHitResult:Laya.HitResult = new Laya.HitResult();
	// public outs:Array<Laya.HitResult> = new Array<Laya.HitResult>();
	public outs:Laya.HitResult = new Laya.HitResult();

    public video:Video;

    /*摇杆控制器*/
    constructor() { 
        super(); 
        this.ray = new Laya.Ray(new Laya.Vector3(0,0,0),new Laya.Vector3(0,-2,0));
        this.outHitInfo = new Laya.HitResult();
        //射线初始化（必须初始化）
		this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
    }

    public onAwake():void{
		Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
		Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
		this.camera = this.owner as Laya.Camera;
	}
    public _onDestroy():void {
        //关闭监听函数
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
    }
    
    public onUpdate():void {
        var elapsedTime = Laya.timer.delta;
        if(JoyStick.angle != -1){
            let curRadians = Math.atan(this.GetForward.x/this.GetForward.z);
            console.log("当前指向角度:",curRadians);
            var speedX = Math.sin(JoyStick.radians+curRadians);
            console.log("弧度:",JoyStick.radians)
            console.log("角度:",JoyStick.angle);
            var speedZ = Math.cos(JoyStick.radians+curRadians);
            console.log("当前指向:",this.GetForward,"spx",speedX,"spz",speedZ);
            
            let x = Math.round(this.GetForward.x * 100)/100 >= 0 ? 1 : -1;
            let z = Math.round(this.GetForward.z * 100)/100 >= 0 ? 1 : -1;
            console.log("当前指向取整:",x,z);

            if(z>0){
                //转向右后方
                speedZ = -speedZ;
                speedX = -speedX;
            }
            this.moveForward(this.moveSpeed * elapsedTime * .001 * speedZ);
            this.moveRight(this.moveSpeed * elapsedTime * .001 * speedX);

            //为了碰撞时使用，当撞上墙的时候倒退10
            var lastX = speedX - 10;
            var lastZ = speedZ - 10;
            //获取方向
            var xV = speedX > 0 ? 1 : -1
            var zV = speedZ > 0 ? 1 : -1
           
            //撞墙的时候
            if(constValue.isTrigger) {
                console.log('是否碰撞', constValue.isTrigger)
                this.moveForward(this.moveSpeed * elapsedTime * .001 * lastZ * zV);
                this.moveRight(this.moveSpeed * elapsedTime * .001 * lastX * xV);
            }
            
            // //射线原点
            // var rayOrigin:Laya.Vector3 = new Laya.Vector3(0,0,0);
            // //根据角色位置计算射线原点
            // Laya.Vector3.add(this.camera.transform.position,new Laya.Vector3(speedX,0,speedZ),rayOrigin);
            // //射线原点位置更新
            // this.ray.origin = rayOrigin;
            // //物理射线与碰撞器相交检测
            // this.camera.parent.scene.physicsSimulation.rayCast(this.ray,this.outHitInfo);
            // //如果未有碰撞则返回
            // if(!this.outHitInfo.succeeded) {
            //     speedX = speedZ = 0;
            //     constValue.cameraTranslate = new Laya.Vector3(speedX,0,speedZ);
            // }
        } 
        // else if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown && !JoyStick._isTouchMove && !constValue.isClickVideoBtn) {
        //     //鼠标点击 摇杆以外区域
        //     this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
        //     this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
        //     //产生射线
        //     this.camera.viewportPointToRay(this.point,this._ray);
        //     //拿到射线碰撞的物体
        //     this.camera.parent.scene.physicsSimulation.rayCast(this._ray,this.outs);
        //     //如果碰撞到物体
        //     // if (this.outs.succeeded && this.outs.collider.owner.name == "dimianl")
        //     // {   
        //     //     if(this.touchMove != undefined && !this.touchMove) {
        //     //         console.log(this.outs.point)
        //     //         console.log(this.camera.transform.position)
        //     //         console.log("x",this.outs.point.x - this.camera.transform.position.x)
        //     //         console.log("z",this.outs.point.z - this.camera.transform.position.z)
        //     //         // var x = (this.outs.point.x - this.camera.transform.position.x) * elapsedTime * .001 * this.moveSpeed;
        //     //         // var z = (this.outs.point.z - this.camera.transform.position.z) * elapsedTime * .001 * this.moveSpeed
        //     //         // constValue.cameraTranslate = new Laya.Vector3(x,0,z)
        //     //         // Laya.timer.frameLoop(10,this,function(){
        //     //             this.moveRight((this.outs.point.x - this.camera.transform.position.x) * elapsedTime * .001 * this.moveSpeed)
        //     //             this.moveForward((this.outs.point.z - this.camera.transform.position.z) * elapsedTime * .001 * this.moveSpeed)
        //     //         // });
                    
        //     //     } else {
        //     //         constValue.cameraTranslate = new Laya.Vector3(0,0,0);
        //     //     }
        //     // }

        //     var offsetX = Laya.stage.mouseX - this.lastMouseX;
		// 	var offsetY = Laya.stage.mouseY - this.lastMouseY;
				
		// 	var yprElem = this.yawPitchRoll;
		// 	yprElem.x += offsetX * this.rotaionSpeed * elapsedTime;
		// 	yprElem.y += offsetY * this.rotaionSpeed * elapsedTime;
		// 	this.updateRotation();
		
        //     this.lastMouseX = Laya.stage.mouseX;
        //     this.lastMouseY = Laya.stage.mouseY;
        // } 
        // else if(constValue.isTurning) {
        //     constValue.cameraRotate = new Laya.Vector3(0,.001 * elapsedTime * constValue.turnSpeed,0);
        //     constValue.cameraTranslate = new Laya.Vector3(0,0,0);
        // } 
        else {
            if (Laya.KeyBoardManager.hasKeyDown(87)) {
                if(constValue.isTrigger) {
                    this.moveForward(0.001 * elapsedTime + 1);
                }
                this.moveForward(-0.001 * elapsedTime);//W
                
            }
            if(Laya.KeyBoardManager.hasKeyDown(83)) {
                if(constValue.isTrigger) {
                    this.moveForward(-0.001 * elapsedTime - 1);
                }
                this.moveForward(0.001 * elapsedTime);//S
            }
			if(Laya.KeyBoardManager.hasKeyDown(65)) {
                if(constValue.isTrigger) {
                    this.moveRight(0.001 * elapsedTime + 1);
                }
                this.moveRight(-0.001 * elapsedTime);//A
                
            }
            if(Laya.KeyBoardManager.hasKeyDown(68)) {
                if(constValue.isTrigger) {
                    this.moveRight(-0.001 * elapsedTime - 1);
                }
                this.moveRight(0.001 * elapsedTime);//D
            }
            
            constValue.cameraTranslate = new Laya.Vector3(0,0,0);
            constValue.cameraRotate = new Laya.Vector3(0,0,0);
        }
    }
    public get GetForward():Laya.Vector3 {
        this.camera.transform.getForward(this._dirForward);
        return this._dirForward
    }
    
    public mouseDown(e):void {
        //获得鼠标的旋转值
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
        //获得鼠标的xy值
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;

        // 记录点击的坐标点
        this._startStageX = e.stageX;
        this._startStageY = e.stageY;

        //设置bool值
        this.isMouseDown = true;
        this.touchMove = false
     
    }
    public mouseUp(e):void {
        //设置bool值
        this.isMouseDown = false;
    }
    public mouseMove(e):void {
        let moveDis: number = this.distanceSquare(this._startStageX, this._startStageY, e.stageX, e.stageY);
        this.touchMove = moveDis > 0 ? true : false

    }
    /**
     * 向前移动。
     */
    public moveForward(distance):void {
        this._tempVector3.x = 0;
        this._tempVector3.y = 0;
        this._tempVector3.z = distance;
        this.camera.transform.translate(new Laya.Vector3(0,0,distance), false);
    }
    /**
     * 向右移动。
     */
    public moveRight(distance):void {
        this._tempVector3.y = 0;
        this._tempVector3.z = 0;
        this._tempVector3.x = distance;
        this.camera.transform.translate(new Laya.Vector3(distance,0,0), false);
    }
    /**
     * 向上移动。
     */
    public moveVertical(distance):void {
        this._tempVector3.x = this._tempVector3.z = 0;
        // this._tempVector3.y = distance;
        this.camera.transform.translate(this._tempVector3, false);
    }
    public updateRotation():void {
        if (Math.abs(this.yawPitchRoll.y) < 0.50) {
            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            this.camera.transform.localRotation = this.camera.transform.localRotation;
        }
    }
    public onEnable(): void {

    }

    public onDisable(): void {
    }
    /**
      * 两点距离的平方
      * @param srcX 起始点X值
      * @param srcY 起始点Y值
      * @param desX 目标点X值
      * @param desY 目标点Y值
      */
     public distanceSquare(srcX: number, srcY: number, desX: number, desY: number): number {
        return (desX - srcX) * (desX - srcX) + (desY - srcY) * (desY - srcY);
    }
}