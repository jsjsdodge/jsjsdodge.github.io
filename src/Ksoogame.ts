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

var bulletGenInterval = 15; 
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

    jwt: string = 'emptyjwt';
    userName: string = 'emptyname';

    replayData: any = null; 
    game: Phaser.Game;
    mStore: any = null;
    public constructor(some:string, store: any) {
        super(some); // game, 0, 0, arrow);
        this.mStore = store;

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
        this.game = new Phaser.Game(config);
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
        if(this.replayData != null) {
            let randomSeed = this.replayData["SEED"];
            console.log("randomseed: ", randomSeed);
            // randomSeed = 777;
            this.randomObject.seed(randomSeed);
        } else {
            let randomSeed = Math.floor(Math.random() * 100000);
            console.log("randomseed: ", randomSeed);
            // randomSeed = 777;
            this.randomObject.seed(randomSeed);
        }

        this.gameRecords["SEED"] = this.randomObject.getBaseSeed(); 
        this.gameRecords["inputs"] = [];
        this.boundary = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }}); 
        this.circleImage = this.add.image(0, 0, 'circle');
        this.circleImage.x = global.WIDTH / 2;
        this.circleImage.y = global.HEIGHT / 2;
        this.timeDisplay = this.add.bitmapText(global.WIDTH/2, 30, 'carrier_command', '00:00');
        this.timeDisplay.setCenterAlign();
        this.timeDisplay.setOrigin(0.5); 

        console.log("player 생성~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        let s : Player = new Player(this, 'player'); // this.add.image(0, 0, 'tail');
        s.scaleX = 0.2;
        s.scaleY = 0.2;
        s.x = global.WIDTH / 2;
        s.y = global.HEIGHT / 2;
        if(this.replayData != null) {
            s.recoredInput = this.replayData;
        }
        this.playerSprite = s;

        this.createBullet();


        if(this.replayData == null) {
            this.readyText = new ReadyGoText(this, 'READY', 'PRESS ENTER TO START'); 
            this.add.existing(this.readyText);
        } 
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
            repeat: -1,
            useFrames: true
        });
        this.boundaryTween.setTimeScale(16.6); 
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

    private checkPlayerDie() {
        var thiz = this;
        if(this.playerSprite.live == false) { 
            this.step = GameStep.die;
            this.boundaryTween.pause();
            console.log("last boundary: ", this.boundaryRadius);
            const input = JSON.stringify(this.gameRecords);
            console.log("game frames: ", this.gameRecords.inputs.length);
            if(this.replayData == null) {
                zlib.deflate(input, (err, buffer) => {
                    if (!err) {
                        console.log(buffer.toString('base64'));
                        var rec = buffer.toString('base64');
                        var userEntity = {};
                        userEntity = JSON.parse(sessionStorage.getItem('jdodge_auth'));
                        console.log(userEntity);
                        var base_url = global.APIURL + "/jdodge/service";
                        var req = {
                            cmd: "addRank",
                            jwt: this.jwt,
                            score: "" + thiz.frameNumber,
                            replay_data: rec,
                        };
                        axios.defaults.withCredentials = false;
                        axios.post(base_url, req).then( response => { 
                            thiz.mStore.showMessage = true;
                            thiz.mStore.showMessageText = "랭킹 등록이 성공했습니다.";
                            var endText = new ReadyGoText(thiz, 'GAME OVER', 'PRESS ENTER TO RETRY', function() {
                                thiz.scene.restart();
                            }); 
                            thiz.add.existing(endText);
                        } ).catch( response => { 
                            thiz.mStore.showMessage = true;
                            thiz.mStore.showMessageText = "랭킹 등록이 실패했습니다.";
                            console.log(response);
                        } ); // ERROR
                    } else {
                        // handle error
                    }
                });
            } 
        }
    }
    // circle : any;
    public update() {
        var d = new Date();
        var n = d.getMilliseconds();
        // this.boundaryTween.update(n, 1/60.0);
        // this.tweens.update(n, 1/60.0);
        var circle = new Phaser.Geom.Circle(global.WIDTH / 2, global.HEIGHT / 2, this.boundaryRadius);
        this.boundary.clear();
        this.boundary.lineStyle(4, 0xff0000);
        this.boundary.strokeCircleShape(circle);
        // this.circleImage.setScale(this.boundaryRadius / 1000.0);
        // console.log(this.boundaryRadius);
        this.circleImage.setScale(1000 / 1500.0);
        // this.circleImage.setScale(this.boundaryRadius / 1000); 
        // console.log(this.replayData != null, this.readyText != null);
        let isPlayingGame = this.replayData != null || this.readyText != null && this.readyText.isFinish();
        if(isPlayingGame) {
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
                    console.log("last boundary: ", this.boundaryRadius);
                }
                // collisionDetect(); 
                this.checkPlayerDie();
                this.generator();
            } else if(this.step == GameStep.die) {

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

