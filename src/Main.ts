import GameConfig from "./GameConfig";

import JoyStick from "./script/RockerUI";
import CameraControlScript from './CameraControlScript';
import constValue from './ConstEvent';
import kefuCharacterControl from './kefuCharacterControl';
import Video from './script/VideoUI';
import triggerScript from "./triggerScript";

export default class Main {
	/*3D摄像机*/
	public camera:Laya.Camera;
	/*摇杆控制器*/
	public static rocker:JoyStick;
	public static video:Video;
	public scene:Laya.Scene3D;

	private changeActionButton:Laya.Button;


	public posX:number = 0.0;
	public posY:number = 0.0;
	public point:Laya.Vector2 = new Laya.Vector2();
	public _ray:Laya.Ray;
	public _outHitResult:Laya.HitResult = new Laya.HitResult();
	// public outs:Array<Laya.HitResult> = new Array<Laya.HitResult>();
	public outs:Laya.HitResult = new Laya.HitResult();
	public _tempVector3:Laya.Vector3 = new Laya.Vector3()

	private sprite3D:Laya.Sprite3D;

	constructor() {
		//使用视网膜画布模式，在init之前使用
		Config.useRetinalCanvas = true;
		Config.isAntialias = true;
		Config.isAlpha = true;

		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);

		Laya.stage.screenMode = "horizontal";
		Laya.stage.bgColor = null;

		/*这个用来设置摄像机移动向量*/
		constValue.cameraTranslate = new Laya.Vector3;
		constValue.cameraRotate = new Laya.Vector3;
		constValue.turnSpeed = 0;
		// constValue.isTurning = false;
		constValue.isClickVideoBtn = false;

		//射线初始化（必须初始化）
		this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		//批量预加载方式
		this.PreloadingRes();

	}
	//批量预加载方式
	PreloadingRes(){
		//预加载所有资源
		var resource = [
			"res/LayaScene_changjing/Conventional/changjing.ls",
			"res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm",
			"res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat",
			"res/threeDimen/skyBox/skyBox2/SkyBox2.lmat",
			"res/atlas/kefu2d.png",
			"res/atlas/play.png"
		];
		Laya.loader.create(resource, Laya.Handler.create(this, this.on3DComplete));	
	}

	private on3DComplete():void{
		//加载完成获取到了Scene3d，把他放到舞台上
		this.scene = Laya.stage.addChild(Laya.Loader.getRes("res/LayaScene_changjing/Conventional/changjing.ls")) as Laya.Scene3D;
		console.log(this.scene)
		//设置场景环境光
		this.scene.ambientColor = new Laya.Vector3(0.6, 0, 0);

		//获取场景中的摄像机
		this.camera = this.scene.getChildByName("Main Camera") as Laya.Camera;
		//调整相机位置
		// this.camera.transform.translate(new Laya.Vector3(0,0,-10))
		//设置相机横纵比
		// this.camera.aspectRatio = 0;
		// //设置相机近距裁剪
		// this.camera.nearPlane = 0.1;
		// //设置相机远距裁剪
		// this.camera.farPlane = 1000;
		// //相机设置清除标记
		// this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
		// //设置摄像机视野范围（角度）
		// this.camera.fieldOfView = 70;

		this.camera.enableHDR = false; 

		//给摄像机添加控制脚本
		this.camera.addComponent(CameraControlScript);

		// this.camera.addComponent(Laya.CharacterController);
		//创建刚体碰撞器
		// let camera = this.camera.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
		// debugger
		// //开启运动类型刚体
		// camera.isKinematic = true;
		// camera.isTrigger = true;
		this.camera.addComponent(triggerScript)

		//加载摄像机到场景
		this.scene.addChild(this.camera);

		this.scene.physicsSimulation.continuousCollisionDetection = true; 

		

		// //创建方向光
		// var light = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
		// //移动灯光位置
		// light.transform.translate(new Laya.Vector3(0, 2, 5));
		// //调整灯光方向
		// var mat:Laya.Matrix4x4 = light.transform.worldMatrix;
		// mat.setForward(new Laya.Vector3(0, -5, 1));
		// light.transform.worldMatrix=mat;
		// //设置灯光漫反射颜色
		// light.diffuseColor = new Laya.Vector3(0.3, 0.3, 0.3);


		// var cube = this.scene.getChildAt(0) as Laya.Sprite3D;

		var cub1 = this.scene.getChildByName('zhanguan');	
		var cub2 = cub1.getChildByName('dimianl');
		var cub3 = cub1.getChildByName('dianshiqiang');
		var cub4 = cub1.getChildByName('qiang');
		var cub5 = cub1.getChildByName('qiangbianshang');
		var cub6 = cub1.getChildByName('wenziqiang');

		// debugger
		// cub3.addComponent(triggerScript)
		// cub4.addComponent(triggerScript)
		// cub5.addComponent(triggerScript)

		// //设置碰撞
    // //获取物理碰撞器
    // var cubeCollider:Laya.PhysicsCollider = cub1.getComponent(Laya.PhysicsCollider);
		var cubeCollider2:Laya.PhysicsCollider = cub2.getComponent(Laya.PhysicsCollider);
		var cubeCollider3:Laya.PhysicsCollider = cub3.getComponent(Laya.PhysicsCollider);
		var cubeCollider4:Laya.PhysicsCollider = cub4.getComponent(Laya.PhysicsCollider);
		var cubeCollider5:Laya.PhysicsCollider = cub5.getComponent(Laya.PhysicsCollider);
		var cubeCollider6:Laya.PhysicsCollider = cub6.getComponent(Laya.PhysicsCollider);
		

		// //物理碰撞体设置摩擦力
		// cubeCollider.friction = 2;
		// //物理碰撞体设置弹力
		// cubeCollider.restitution = 0.3;

		// //物理碰撞体设置摩擦力
		// cubeCollider2.friction = 2;
		// //物理碰撞体设置弹力
		// cubeCollider2.restitution = 0.3;
		// //标记为触发器,取消物理反馈
		// cubeCollider2.isTrigger = true;
		// //物理碰撞体设置摩擦力
		cubeCollider3.friction = 2;
		//物理碰撞体设置弹力
		cubeCollider3.restitution = 0.3;
		// //标记为触发器,取消物理反馈
		// cubeCollider3.isTrigger = true;
		// //物理碰撞体设置摩擦力
		cubeCollider4.friction = 2;
		//物理碰撞体设置弹力
		cubeCollider4.restitution = 0.3;
		// //标记为触发器,取消物理反馈
		// cubeCollider4.isTrigger = true;
		// //物理碰撞体设置摩擦力
		cubeCollider5.friction = 2;
		//物理碰撞体设置弹力
		cubeCollider5.restitution = 0.3;
		// //标记为触发器,取消物理反馈
		// cubeCollider5.isTrigger = true;
		
		//物理碰撞体设置摩擦力
		cubeCollider6.friction = 2;
		//物理碰撞体设置弹力
		cubeCollider6.restitution = 0.3;
		// //标记为触发器,取消物理反馈
		// cubeCollider6.isTrigger = true;

		constValue.video = new Video()


		//实例化一个遥杆
		Main.rocker = new JoyStick(Laya.stage)
		Laya.stage.addChild(Main.rocker);

		Main.rocker.x = 25;
    Main.rocker.y = Laya.stage.height - 120;

		//这个是要实现点击按钮能360度旋转
		// this.addButton(Laya.stage.width - 80, Laya.stage.height - 100, 10, 10, "→", function(e:Laya.Event):void {
		// 	e.stopPropagation()
		// 	this.beginTurn(true)
		
		// },function(e:Laya.Event):void {
		// 	e.stopPropagation()
		// 	this.stopTurn()
		// });
		
		//添加客服纸片人
		var kefuMat = new Laya.UnlitMaterial();
		kefuMat.albedoTexture = Laya.Loader.getRes("res/atlas/kefu2d.png");
		kefuMat.albedoIntensity = 1;
		//设置背景透明
		kefuMat.alphaTest = true;
		kefuMat.alphaTestValue = 0.6;
		kefuMat.renderQueue = Laya.Material.RENDERQUEUE_ALPHATEST
		
		//设置材质颜色（不需要）
		// earthMat._Color = new Laya.Vector4(0, 0, 0, 0.1);
		var kefu = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createQuad(0.6, 1.7))) as Laya.MeshSprite3D;//0.8 * (kefuMat.albedoTexture.width / kefuMat.albedoTexture.height)
		kefu.transform.translate(new Laya.Vector3(-1, 1, 2.3));
		kefu.meshRenderer.material = kefuMat;
		//添加朝向摄像机脚本
		kefu.addComponent(kefuCharacterControl).init(this.camera,false)


		// let rect:Laya.Sprite = new Laya.Sprite();
		// rect.graphics.drawRect(0, 0, 200, 200, "#D2691E");
		// rect.transform.translate(new Laya.Vector3(0.1, 1.8, -2.4));
		// rect.size(200, 200);
		// Laya.stage.addChild(rect);

		//添加视频播放按钮
		var anniuMat = new Laya.UnlitMaterial();
		anniuMat.albedoTexture = Laya.Loader.getRes("res/atlas/play.png");
		anniuMat.albedoIntensity = 1;
		//设置背景透明
		anniuMat.alphaTest = true;
		anniuMat.alphaTestValue = 0.6;
		anniuMat.renderQueue = Laya.Material.RENDERQUEUE_ALPHATEST
		var anniu = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createQuad(0.6, 0.6))) as Laya.MeshSprite3D;//0.8 * (kefuMat.albedoTexture.width / kefuMat.albedoTexture.height)
		anniu.transform.translate(new Laya.Vector3(0.1, 1.8, -2.8));
		anniu.meshRenderer.material = anniuMat;

		//平面添加物理碰撞体组件
		var planeStaticCollider:Laya.PhysicsCollider = anniu.addComponent(Laya.PhysicsCollider);
		//创建盒子形状碰撞器
		var planeShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(10, 0, 10);
		//物理碰撞体设置形状
		planeStaticCollider.colliderShape = planeShape;
		//物理碰撞体设置摩擦力
		planeStaticCollider.friction = 2;
		//物理碰撞体设置弹力
		planeStaticCollider.restitution = 0.3;

		//添加朝向摄像机脚本
		anniu.addComponent(kefuCharacterControl).init(this.camera,false)

		// //创建一个精灵
		// this.sprite3D = new Laya.Sprite3D();
		// this.scene.addChild(this.sprite3D);
		// //获取Mesh资源
		// var mesh = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm");
		// //为精灵设置Mesh资源
		// var layaMonkey = new Laya.MeshSprite3D(mesh);
		// this.sprite3D.addChild(layaMonkey);
		// layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
		// layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
		// layaMonkey.transform.translate(new Laya.Vector3(5, 3, 13));

		// var matt = Laya.loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat")
		// layaMonkey.meshRenderer.material = matt
		// layaMonkey.addComponent(kefuCharacterControl).init(this.camera,false)

		// Laya.Material.load("res/threeDimen/skyBox/skyBox2/SkyBox2.lmat", Laya.Handler.create(this, function(mat:Laya.Material):void {
		// 	var skyRenderer = this.camera.skyRenderer;
		// 	skyRenderer.mesh = Laya.SkyBox.instance;
		// 	skyRenderer.material = mat;
		// }));
	

		this.addMouseEvent()
		
		//游戏帧循环
		Laya.timer.frameLoop(100,this,this.onFrameLoop);
	}

	public addMouseEvent():void{
		//鼠标事件监听
		Laya.stage.on(Laya.Event.MOUSE_DOWN,this, this.onMouseDown);
	}
	public onMouseDown():void {
		if(JoyStick._isTouchMove) return;
		this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
		this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
		//产生射线
		this.camera.viewportPointToRay(this.point,this._ray);
		//拿到射线碰撞的物体
		this.scene.physicsSimulation.rayCast(this._ray,this.outs);
		//如果碰撞到物体
		if (this.outs)
		{
			if(this.outs.collider.owner.name == 'dianshiqiang' && !constValue.isClickVideoBtn) {
				constValue.video = new Video()
				Laya.stage.addChild(constValue.video);
				let url = 'https://2dhall-video.ciftis.org/trans-video/20200813/08b05b19efc64b498ca7124746505234.mp4'
				constValue.video.createVideo(url)
			}
		}
	}
	/**
     * 向前移动。
     */
		public moveForward(distance):void {
			this._tempVector3.x = 0;
			// this._tempVector3.y = 0;
			this._tempVector3.z = distance;
			this.camera.transform.translate(this._tempVector3);
	}
	/**
	 * 向右移动。
	 */
	public moveRight(distance):void {
			// this._tempVector3.y = 0;
			this._tempVector3.z = 0;
			this._tempVector3.x = distance;
			this.camera.transform.translate(this._tempVector3);
	}

	// public beginTurn(isLeft):void {
	// 	constValue.turnSpeed = isLeft ? -50 : 50,
	// 	constValue.isTurning = true
	// 	this.changeActionButton.scale(1.2,1.2)
	// }
	// public stopTurn():void {
	// 	constValue.isTurning = false
	// 	this.changeActionButton.scale(1,1)
	// }

	// private addButton(x:number, y:number, width:number, height:number, text:string, clikFun:Function, stopClick:Function):void {
	// 	Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function():void {
	// 		this.changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", text)) as Laya.Button;
	// 		this.changeActionButton.size(width, height);
	// 		this.changeActionButton.labelBold = true;
	// 		this.changeActionButton.labelSize = 10;
	// 		this.changeActionButton.sizeGrid = "4,4,4,4";
	// 		this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
	// 		this.changeActionButton.pos(x, y);
	// 		this.changeActionButton.on(Laya.Event.MOUSE_DOWN, this, clikFun);
	// 		this.changeActionButton.on(Laya.Event.MOUSE_UP, this, stopClick);
	// 	}));
  // }

	/*游戏帧循环*/
	private onFrameLoop():void{
			//摄像机位置改变
			this.camera.transform.translate(constValue.cameraTranslate, false);
			this.camera.transform.rotate(constValue.cameraRotate, true, false)
	}
}
//激活启动类
new Main();