/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import LoadingUI from "./script/LoadingUI"
import RockerUI from "./script/RockerUI"
import GameUI from "./script/GameUI"
import UIMainUI from "./script/UIMainUI"
import VideoUI from "./script/VideoUI"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=640;
    static height:number=1136;
    static scaleMode:string="fixedwidth";
    static screenMode:string="horizontal";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="Loading.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/LoadingUI.ts",LoadingUI);
        reg("script/RockerUI.ts",RockerUI);
        reg("script/GameUI.ts",GameUI);
        reg("script/UIMainUI.ts",UIMainUI);
        reg("script/VideoUI.ts",VideoUI);
    }
}
GameConfig.init();