export default class kefuCharacterControl extends Laya.Script3D {
    private _dir:Laya.Vector3;
    private _rotateUpDir:Laya.Vector3;
    private lookAtRotation:Laya.Quaternion;
    private monkey:Laya.MeshSprite3D;
    private target:Laya.MeshSprite3D;
    private isOpposite:boolean;
    
    constructor() {
        super(),
        this._dir = new Laya.Vector3;
        this._rotateUpDir = new Laya.Vector3(0,0,0);
        this.lookAtRotation = new Laya.Quaternion(0, 0, 0, 0);
        
    }
    public init(e, t):void {
        this.isOpposite = t,
        this.target = e
    }
    public onStart():void {
        this.monkey = this.owner as Laya.MeshSprite3D;
    }
    public onUpdate():void {
        if(this.target !== null) {
            this._dir.x = this.target.transform.position.x - this.monkey.transform.position.x;
            this._dir.y = 0;
            this._dir.z = this.target.transform.position.z - this.monkey.transform.position.z;
            this.isOpposite && (this._dir.x *= -1,this._dir.z *= -1)
            this._dir.z *= -1,
            Laya.Quaternion.rotationLookAt(this._dir, this._rotateUpDir, this.lookAtRotation);
            this.monkey.transform.rotation = this.lookAtRotation;
        }
    }
}