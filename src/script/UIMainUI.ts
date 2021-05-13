import { ui } from "../ui/layaMaxUI";
import JoyStick from "./RockerUI"

export default class UIMain extends ui.UIMainUI {
  public static joystick: JoyStick;
  constructor() {
    super()
    //3d场景加载
    // Laya.Scene3D.load("res/XunLongShi/XunLongShi.ls",Laya.Handler.create(null,function(scene){
    //   //加载完成获取到了Scene3d
    //   Laya.stage.addChild(scene);
    //   //获取摄像机
    //   var camera = scene.getChildByName("Main Camera");
    //   //清除摄像机的标记
    //   // camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
    //   //添加光照
    //   var directionLight = scene.addChild(new Laya.DirectionLight());
    //   directionLight.color = new Laya.Vector3(1, 1, 1);
    //   directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));

     

    // }));
  }
  public static initJoystick():void {
    
    let joystick: JoyStick = new JoyStick(Laya.stage);
    Laya.stage.addChild(joystick);
    joystick.zOrder = 9999;
    joystick.x = 200;
    joystick.y =  joystick.height - 200;
    alert(1111)
  }
}
