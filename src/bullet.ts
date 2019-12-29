
import {GameScene} from "./Ksoogame.ts";
import {Player} from './player.ts'; 
import {XorShift32} from './XorShift32.js';
import * as global from './consts.ts';
import * as mathutil from './mathutil.ts';

export class Bullet extends Phaser.GameObjects.Image {
    target!: Player;
    dir!: Phaser.GameObjects.Image;
    deltaAngle: number = 0.0;
    currentFrame : number = 0;
    delayFrame : number = 160;
    scene: GameScene;
    public custom: any;
    startAngle : number = 0.0;
    randomObject: any;

    public constructor(scene:GameScene, radius: number, randomObject : any) {
        super(scene, 0, 0, '');
        this.scene = scene;
        this.randomObject = randomObject;
        var newSpeed = this.randomObject.randFloatRange(2, 4);

        if(this.randomObject.randFloat() >= 0.95) {
            // fast
            newSpeed = this.randomObject.randFloatRange(4, 6); // 4 + Math.random() * 2;
            this.setTexture('bullet_red');
        } else {
            // slow 
            newSpeed = this.randomObject.randFloatRange(2, 3); //2 + Math.random() * 1;
            this.setTexture('wall');
        }
        

        this.deltaAngle = this.randomObject.randFloatRange(0.005, 0.020);
        this.custom = {};
        this.custom.speed = newSpeed;

        scene.add.existing(this);
        this.dir = scene.add.image(0, 0, 'wall');
        this.dir.scale = 0.1;

        this.startAngle = this.randomObject.randFloat() * Math.PI * 2;
        var centerY = global.HEIGHT / 2;
        var centerX = global.WIDTH / 2;
        var randomY = Math.sin(this.startAngle) * radius;
        var randomX = Math.cos(this.startAngle) * radius;
        this.y = centerY + randomY;
        this.x = centerX + randomX;
        this.custom.aim = true;
        // super(scene, 0,);
    }
    public setTarget(player: Player) {
        this.target = player;
        var dx = this.target.x - this.x;
        var dy = this.target.y - this.y;
        this.custom.angle = Math.atan2(dy, dx);
    }
    public update() {
        this.currentFrame++;
        if(this.delayFrame <= this.currentFrame) {
            var b = this;
            var yDiff = (b.y - this.target.y);
            yDiff *= yDiff;

            var xDiff = (b.x - this.target.x);
            xDiff *= xDiff; 
            var distance = yDiff + xDiff; 
            var dx = this.target.x - b.x;
            var dy = this.target.y - b.y; 
            if(distance < 70) {
                console.log("near!");
                this.target.live = false;
            }
            var dstAngle = Math.atan2(dy, dx); 
            var diff = Math.atan2(Math.sin(dstAngle - b.custom.angle), Math.cos(dstAngle - b.custom.angle));
            var deltaAngle = this.deltaAngle;
            if(Math.abs(diff) > Math.PI / 2) {
            } else {
                if(diff >= 0) {
                    b.custom.angle += deltaAngle;
                } else {
                    b.custom.angle -= deltaAngle;
                }
            }
            if(mathutil.dist(b.x, b.y, global.WIDTH / 2, global.HEIGHT / 2) > global.WIDTH / 2 + 100) {
                this.destroy(); 
                this.dir.destroy();
            } else {
                b.setRotation(b.custom.angle);
                b.x += b.custom.speed * Math.cos(b.custom.angle);
                b.y += b.custom.speed * Math.sin(b.custom.angle);
            }
            this.dir.setRotation(dstAngle);
            this.dir.x = b.x;
            this.dir.y = b.y; 
        } else {
            var centerY = global.HEIGHT / 2;
            var centerX = global.WIDTH / 2;
            var randomY = Math.sin(this.startAngle) * this.scene.boundaryRadius;
            var randomX = Math.cos(this.startAngle) * this.scene.boundaryRadius;
            this.y = centerY + randomY;
            this.x = centerX + randomX;
        }

    }

}
