import constValue from './ConstEvent';
export default class triggerScript extends Laya.Script3D {
    public currentName:string;
    constructor() { 
        super();
        this.currentName = ''
        console.log('triggerScript')
     }
    //  OnControllerColliderHit(e) {
    //      debugger
    //  }
    //  onCollisionEnter(e) {
    //     debugger
    //  }
    //  onCollisionExit(e) {
    //     debugger
    //  }
     onTriggerEnter(e) {
        console.log('enter:' + e.owner.name)
        if(e.owner.name == 'dianshi' || e.owner.name == 'dianshiqiang' || e.owner.name == 'wenziqiang') {
            constValue.isTrigger = true;
            console.log(constValue.isTrigger)
        } else {
            constValue.isTrigger = false;
        }
        // if (1 != Y.instance.loadType)
        //     return;
        // Y.instance.isInCompanyEx = !0,
        // this.currentName != e.owner.name && "" != this.currentName && _.LeaveCompnay(parseInt(this.currentName)),
        // this.currentName = e.owner.name;
        // let t = w.getInstance();
        // t.currentCompanyNew = t.findCompnay(parseInt(e.owner.name)),
        // p.event("SetDaoHangList")
    }
    onTriggerExit(e) {
        console.log('exit:' + e.owner.name)
        if(e.owner.name == 'dianshi' || e.owner.name == 'dianshiqiang' || e.owner.name == 'wenziqiang') {
            constValue.isTrigger = false;
        } else {
            constValue.isTrigger = true;
        }
        // 1 == Y.instance.loadType && this.currentName == e.owner.name && (Y.instance.isInCompanyEx = !1,
        // p.event("SetCompanyDaoHangDownList", !1),
        // _.LeaveCompnay(parseInt(this.currentName)),
        // this.currentName = "")
    }
}