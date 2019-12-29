// const Phaser = require('phaser');
// import Phaser from 'phaser';
import {Player} from './player'

import {ReadyGoText, ReadyState} from './readygo'

import {Bullet} from './bullet'

import * as global from './consts'
import axios from 'axios'
// import Phaser from 'phaser';


import * as zlib from 'browserify-zlib';
import {XorShift32} from './XorShift32.js';
import * as mathutil from './mathutil';


//

// for(var i=0; i<100; i++) {
//     console.log(rng1.randfloat());
// }
//
//


// var playerSprite = null;

var bulletGenInterval = 15;

// const wall = require('./assets/wall.png');
// const tail = require('./assets/tail_bullet.png');
// const player = require('./assets/player.png');
// import wall from './assets/wall.png'
// import tail from '.assets/tail_bullet.png'
// import player from './assets/player.png'



// export const haha:number = 3;






enum GameStep {
    before,
    playing,
    die 
}

export class GameScene extends Phaser.Scene {
    step: GameStep = GameStep.playing; 
    readyText!: ReadyGoText;
    playerSprite!: Player;
    bulletSprites : Bullet[] = [];
    timeDisplay!: Phaser.GameObjects.BitmapText;
    boundary! : Phaser.GameObjects.Graphics;
    boundaryRadius : number = global.HEIGHT / 2 - 50;
    boundaryTween! : Phaser.Tweens.Tween;
    circleImage! : Phaser.GameObjects.Image;
    gameRecords : any = {};
    randomObject : any = new XorShift32(); 
    frameNumber : number = 0;

    userId: string = 'emptyid';
    userName: string = 'emptyname';

    public constructor(some:string) { 
        super(some); // game, 0, 0, arrow);
        console.log("gamescene cstr");
        var config = {
            type: Phaser.AUTO,
            width: global.WIDTH,
            height: global.HEIGHT,
            fps: {
                target: 60
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            parent: 'phaser-example',
            scene: this
        };
        var game = new Phaser.Game(config);
        // console.log("phaser: ctr2");
        // var config = {
        //     type: Phaser.AUTO,
        //     width: global.WIDTH,
        //     height: global.HEIGHT,
        //     scene: this
        // };
        // this.scene.scene.add('ksoo', config, true);
        // var game = new Phaser.Game(config);
    }
    public preload = () => {
        // this.load.image('wall', wall);
        this.load.image('tail', 'assets/tail_bullet.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('bullet_red', 'assets/bullet_red.png');
        this.load.image('circle', 'assets/frame.png');
        this.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
        this.load.bitmapFont('gothic', 'assets/fonts/bitmap/gothic.png', 'assets/fonts/bitmap/gothic.xml');
        
    }
    public initGame() {
        // this.scale.setZoom(0.8); // (0.8);

        var randomSeed = Math.floor(Math.random() % 10000);
        randomSeed = 777;
        this.randomObject.seed(randomSeed);
        this.gameRecords["SEED"] = randomSeed;
        this.gameRecords["inputs"] = [];
        this.boundary = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});


        this.circleImage = this.add.image(0, 0, 'circle');
        this.circleImage.x = global.WIDTH / 2;
        this.circleImage.y = global.HEIGHT / 2;
        this.timeDisplay = this.add.bitmapText(global.WIDTH/2, 30, 'carrier_command', '00:00');
        this.timeDisplay.setCenterAlign();
        this.timeDisplay.setOrigin(0.5); 

        let s : Player = new Player(this, 'player'); // this.add.image(0, 0, 'tail');
        s.scaleX = 0.2;
        s.scaleY = 0.2;
        s.x = global.WIDTH / 2;
        s.y = global.HEIGHT / 2;
        this.playerSprite = s;
        const buffer1 = Buffer.from('eJztmstKAzEUht8l69m4KnRtn8CluPNWkFq0xUWZd1ek1LHamSSTy3dODmTx8Rfa5OTP7acHd7NaXbvlYrHo3Hqz3e/e3fL20Hdqm9tv3fLK4AzUNPe2fnreHUc3h+9fPzZf2GUQDan4y0mA/rSLnXt5ePyzmBrWDPXj92ncwZQh/GyOjGuLRCAXkOa9cTemHvvwqmaSWkk6Tz3eCp8zWtafcRnO+LA2sTFxwCPNbKkqrPpnggG9MoSgpTCTSMq1gBrReFo0wwwIyGVMCVVahtpv/YTSpYZe1uS+NeLKqNQP3UMP7kmPNsR9SJk2tiFKOHdS+xyRuMradkyiS+EJbPE93vNnqwSmwJDXRIZI45rLpCySLlGmRWqGiTDvV58aYajFCzvZCP1MOibCy88HoPfqsAdntRBvtLCzfyLGj7HWzpxtlkxEa1j62HP/z8ZE2NxBoPZOJVuiMaIoZjmBzpHOumcQGDAJSmRyISzaY8xyzsASYe6WHR+9UACRnhLtrEk+egKxZ/zZA+aHdiNtUnFJmmasG59Fp4hBwcys7R2yXcMNDkhhFSoBEScnV/VfoOdLs4q1WgZ+lpM6My09lgyZ79R6Ad4UIKY0CSUZG0thRCZqolDRMObBO1ld+iI2JIQbpnlrw0adJo9wMLQ1aVkY0qK3IqGe1VWogpjDmQAqpxDFE/qQDBye0ZZIhaoMPk3/Ls1/kplPWZe7/hONTIEB', 'base64');
        
        zlib.unzip(buffer1, (err, buffer) => {
            if (!err) {
                console.log("원본: ", buffer.toString());
                // this.playerSprite.recoredInput = JSON.parse(buffer.toString());
            } else {
                // handle error
            }
        });
        this.createBullet();

        this.readyText = new ReadyGoText(this); 
        this.add.existing(this.readyText);
        // bmpText.input.enabled = true;

        for(let i=0; i<10; i++) {
            this.createBullet();
        }

        this.boundaryTween = this.tweens.add({
            targets: this,
            loop: 0,
            onUpdateScope: this,
            onUpdate: function() {
            },
            onCompleteScope: this,
            onComplete: function() { 
                // console.log(this);
                // thiz.state = ReadyState._2;
            },
            onLoopParams: [],
            loopDelay: 0,
            boundaryRadius: {value: global.HEIGHT / 3, yoyo: true, duration:5000, ease: 'Quad.easeInOut' },
            repeat: -1
        });
        this.boundaryTween.pause(); 
    }
    public create() {
        console.log("phaser: create()");
        this.bulletSprites = [];
        this.boundaryRadius = global.HEIGHT / 2 - 50;
        this.step = GameStep.playing;
        this.frameNumber = 0;
        this.initGame(); 
        // bmpText.inputEnabled = true; 
        // this.playerSprite = this.add.image(0, 0, 'player');
        // this.playerSprite!.scaleX = 0.2;
        // this.playerSprite.scaleY = 0.2;
        // this.playerSprite.y = 200;
        // this.playerSprite.x = 200;
    }

    // circle : any;
    public update() {
        var circle = new Phaser.Geom.Circle(global.WIDTH / 2, global.HEIGHT / 2, this.boundaryRadius);
        this.boundary.clear();
        this.boundary.lineStyle(4, 0xff0000);
        this.boundary.strokeCircleShape(circle);
        // this.circleImage.setScale(this.boundaryRadius / 1000.0);
        // console.log(this.boundaryRadius);
        this.circleImage.setScale(1000 / 1500.0);
        // this.circleImage.setScale(this.boundaryRadius / 1000); 
        if(this.readyText.isFinish()) {
            if(this.step == GameStep.playing) {
                if(this.boundaryTween.isPaused()) {
                    this.boundaryTween.play();
                }

                var i = this.bulletSprites.length;
                while (i--) {
                    this.bulletSprites[i].update();
                    if(this.bulletSprites[i].active == false) {
                        this.bulletSprites.splice(i, 1); 
                    } 
                }
                this.playerSprite.update(this.gameRecords);
                if(mathutil.dist(this.playerSprite.x, this.playerSprite.y, circle.x, circle.y) > this.boundaryRadius) {
                    this.playerSprite.live = false;
                }

                var thiz = this;
                if(this.playerSprite.live == false) { 
                    const input = JSON.stringify(this.gameRecords);
                    zlib.deflate(input, (err, buffer) => {
                        if (!err) {
                            console.log(buffer.toString('base64'));
                            var rec = buffer.toString('base64');
                            var userEntity = {};
                            userEntity = JSON.parse(sessionStorage.getItem('jdodge_auth'));
                            console.log(userEntity);
                            this.step = GameStep.die;
                            var thiz = this; 
                            var base_url = global.APIURL + "/jdodge/service";
                            // var base_url = "https://api.ipify.org?format=json";

                            
                                                const buffer1 = Buffer.from(rec, 'base64');
                                                zlib.unzip(buffer1, (err, buffer) => {
                                                    if (!err) {
                                                        console.log("원본: ", buffer.toString());
                                                    } else {
                                                        // handle error
                                                    }
                                                });


                            axios.defaults.withCredentials = false;
                            axios.post(base_url, {
                                    cmd: "addRank",
                                    id: this.userId,
                                    score: thiz.frameNumber,
                                    replay_data: rec,
                                }

                            ).then( response => { 
                            } ) // SUCCESS
                                .catch( response => { console.log(response); } ); // ERROR
                        } else {
                            // handle error
                        }
                    });

                }
                // collisionDetect(); 
                this.generator();
            } else if(this.step == GameStep.die) {
                this.boundaryTween.pause();
            }
        }
    }
    public createBullet = () => {
        // let s : Bullet = this.add.image(0, 0, 'tail');
        let s : Bullet = new Bullet(this, this.boundaryRadius, this.randomObject);
        // s.anchorX = 0.5;
        // s.anchorY = 0.5;
        s.setTarget(this.playerSprite);
        this.bulletSprites.push(s);

        // var ksoo = this.add.image(0, 0, 'wall');
        // ksoo.x = s.x;
        // ksoo.y = s.y;
    }

    public generator = ()=> {
        this.frameNumber++;
        let remain = Math.floor((this.frameNumber % 60) / 60.0 * 100.0);
        let seconds = Math.floor(this.frameNumber/60.0);
        let remainStr = '';
        let secondsStr = '';
        if(remain < 10) {
            remainStr = '0' + remain;
        } else {
            remainStr = '' + remain;
        }
        if(seconds < 10) {
            secondsStr = '0' + seconds;
        } else {
            secondsStr = '' + seconds;
        }

        this.timeDisplay.setText(secondsStr + ':' + remainStr);
        if(this.frameNumber == 500) {
            // this.scene.restart();
        }
        if(this.frameNumber % bulletGenInterval == 5) {
            this.createBullet();
        }
    }


}

