import { ui } from "./../ui/layaMaxUI";
/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
export default class GameUI extends ui.test.TestSceneUI {
    private scene1:Laya.Scene3D;
    private position:Laya.Vector3 = new Laya.Vector3(0, 0, 0); 
    private position1:Laya.Vector3 = new Laya.Vector3(0, 0, 0);
	private rotate1:Laya.Vector3 = new Laya.Vector3(0, 1, 0);
    private box_clone1:Laya.Sprite3D;
    private scaleValue:number = 0;
    private scaleDelta:number = 0;

	private clone1Transform:Laya.Transform3D;
    constructor() {
        super();
		
        //创建场景
		this.scene1 = new Laya.Scene3D();
		Laya.stage.addChild(this.scene1);

        //添加照相机
        var camera: Laya.Camera = (this.scene1.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 3, 3));
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

        //添加方向光
        var directionLight: Laya.DirectionLight = this.scene1.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        console.log(this.scene1)
        this.onComplete()
    }
    onComplete() {
        //添加自定义模型
        var box: Laya.MeshSprite3D = this.scene1.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1))) as Laya.MeshSprite3D;
        box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function(tex:Laya.Texture2D) {
			material.albedoTexture = tex;
		}));
        box.meshRenderer.material = material;

        //设置旋转
        box.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);

        box.removeSelf();

        //克隆sprite3d
        this.box_clone1 = Laya.Sprite3D.instantiate(box, this.scene1, false, this.position1);
		//得到三个Transform3D
		this.clone1Transform = this.box_clone1.transform;

        //旋转
        this.rotate1.setValue(60, 60, 60);
        this.clone1Transform.rotate(this.rotate1, false, false);

        //设置定时器执行,定时重复执行(基于帧率)
		Laya.timer.frameLoop(30, this, this.animate);
    }
    animate() {
        this.scaleValue = Math.sin(this.scaleDelta += 0.1);
    
        this.position.y = Math.max(0, this.scaleValue / 2);;
        // this.box_clone1.transform.position = this.position;

        this.box_clone1.transform.rotate(this.rotate1, false, false);
        // this.scaleValue = Math.sin(this.scaleDelta += 0.1);
        
        // this.position.y = Math.max(0, this.scaleValue / 2);;
        // this.layaMonkey_clone1.transform.position = this.position;
        
        // this.layaMonkey_clone2.transform.rotate(this.rotate, false, false);
        
        // this.scale.x = this.scale.y = this.scale.z = Math.abs(this.scaleValue) / 5;
        // this.layaMonkey_clone3.transform.localScale = this.scale;
    }
}