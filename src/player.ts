// import Phaser from 'phaser';
import * as zlib from 'browserify-zlib';

export class Player extends Phaser.GameObjects.Image {
    upKey! : Phaser.Input.Keyboard.Key;
    downKey! : Phaser.Input.Keyboard.Key;
    leftKey! : Phaser.Input.Keyboard.Key;
    rightKey! : Phaser.Input.Keyboard.Key;
    playerSpeed : number = 3; 
    live : boolean = true;
    public recoredInput : any;
    frameNumber : number = 0;
    public constructor(scene:Phaser.Scene, texture:string) {
        super(scene, 0, 0, texture);
        scene.add.existing(this);
        this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.recoredInput = null;
        // super(scene, 0,);
    }
    public setRecoredInput(ri: any) {
        this.recoredInput = ri;
    }
    public update(gameRecords:any) {
        // for(let aa=0; aa<=10; aa++) {
        // }
        // console.log("hh", this.recoredInput);
        if(this.recoredInput != null) {
            // console.log(this.frameNumber, ": " + this.recoredInput.inputs[this.frameNumber]);
            if(this.recoredInput.inputs.length > this.frameNumber) {
                var input = this.recoredInput.inputs[this.frameNumber];
                if(input["left"]) {
                    this.x -= this.playerSpeed;
                }

                if(input["right"]) {
                    this.x += this.playerSpeed;
                }
                if(input["up"]) {
                    this.y -= this.playerSpeed;
                }
                if(input["down"]) {
                    this.y += this.playerSpeed;
                }
            } else {
                // window.alert("exceed");
                console.log(this.recoredInput.inputs.length, this.frameNumber);
            }
            // for(let i=0; i<this.recoredInput.inputs.length; i++) {
            // }
        } else {
            let inputObj : any = {};
            if(this.upKey.isDown) {
                inputObj.up = 1;
                this.y -= this.playerSpeed;
            }
            if(this.downKey.isDown) {
                inputObj.down = 1;
                this.y += this.playerSpeed;
            }
            if(this.leftKey.isDown) {
                inputObj.left = 1;
                this.x -= this.playerSpeed;
            }
            if(this.rightKey.isDown) {
                inputObj.right = 1;
                this.x += this.playerSpeed;
            } 
            gameRecords["inputs"].push(inputObj);
        }

        if(this.live == false) {
        }
        this.frameNumber++;
    }

    public custom: any;
}
