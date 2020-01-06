<template>
    <div id="app"> 
        <VueMenu v-bind:topTitle="`HOME`" /> 
        <b-container class="bv-example-row" fluid> 
            <b-row>
                <b-col cols="8">
                    <div id="phaser-example" style="display:block"></div>
                </b-col>
                <b-col cols="2"> 
                    <b-table striped hover
                             id="my-table"
                             :items="records"
                             :per-page="perPage"
                             :current-page="currentPage"
                             :fields="fields"
                             small
                             >
                    </b-table>
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                        aria-controls="my-table"
                        ></b-pagination>
                    <p class="mt-3">Current Page: {{ currentPage }}</p>
                </b-col>
            </b-row>
        </b-container> 
        <p> {{ message }} </p>
        <h1>{{ msg }}</h1>

        <footer><address>서울특별시 강서구 내발산동</address></footer> 

    </div>


</template>

<script>


import VueMenu from "./VueMenu.vue";
import {GameScene, EmptyScene } from "../Ksoogame.ts";
import axios from 'axios';
import * as zlib from 'browserify-zlib'; 
import { EventBus } from "@/event-bus";

// var gameScene = null;

export default {
    components: {
        VueMenu, 
    },
    name: 'game',
    data () {
        return {
            element: [
                {name: "han", id:"sd"},
                {name: "han1", id:"sd2"}
            ],
            msg: 'Welcome to Your Vue.js App',
            message: '이 페이지는 ' + new Date() + ' 에 로드 되었습니다' ,
            seen: true,
            todos: [
                {some: "abc"},
                {some: "abc1"},
                {some: "abc2"},
                {some: "abcs3"},
            ],
            fields: ['name', 'score'],
            records: [{"name":"han", "score":123}],
            ksoo: 'kso1233123o',
            perPage: 10,
            currentPage: 1,
            gameScene: null,
        }
    },
    created() {
        var thiz = this;
        EventBus.$on("userinfo", userinfo => {
            console.log("ui: ", userinfo);
            thiz.gameScene.userId = userinfo.Id;
            thiz.gameScene.userName = userinfo.Name;
            // this.receivedClickCount = clickedCount;
        });
        console.log("game.vue created@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2");
        this.updateRecords();
    },
    destroyed() {
        console.log("game.vue destroyed");
        this.gameScene.game.destroy();
    },
    computed: {
        rows() {
            return this.records.length;
        }
    },
    mounted () {
        // new EmptyScene('Game'); 
        console.log("before gameScene: ", this.gameScene);
        this.gameScene = new GameScene('tt'); 
        // gameScene = new GameScene('tt'); 
    },
    methods:
    {
        updateRecords: function() {
            var thiz = this;
            // thiz.records = [{"name":"han", "score":124443, "replay_data":"etc"}];
            var updater = function() {
                var base_url = "https://api.emalron.com:8443/jdodge/service";
                // var base_url = "https://api.ipify.org?format=json";
                axios.post(base_url, {
                    cmd: "showAllRanks",
                }

                )
                    .then( response => { 
                        // var json = JSON.parse(response.data);
                        console.log(response.data.message); 

                        if(response.data.result && response.data.result >= 0) {
                            thiz.records = response.data.message;
                        } else {
                        }

                    } ) // SUCCESS
                    .catch( response => { console.log(response); } ); // ERROR

            };
            updater();
        },
        viewReplay: function(data) {
            console.log("view replay!!", data);
            //1332 frames
            const buffer1 = Buffer.from('eJztm71uwzAMhN9Fs4dmyJK5eYKORbf+BSjSoE3QofC7Fy3SwYkjSw4lHqkDNHy9IVYomibP6Xe4W69vw2q5WC5uurDZ7g77z7C6/+67siu8PT3vw2rhBw87WSh+Ah+bl9f/zUvx3+a7cwk/HFxcKis8vn9tj8lOHOCwkFQTL3HsE4hlYk6WfRBTqiSdVvnsVrIr2VwSQOD8lM0rJhAtaMlKHOY8KrQYtZ2KL4jQ1QyvUhPuT9TciSgOihI1atTEtEZQMbynz3PtUCQEyDAC3mKTGi4CzB9eFUI4K48Y2d0yzLAfsw4wvq6tQrAA4RBTApYAuFf1m3SvDscQSekswVUtUFiXbXQBzKNZ/ibi6fgTDSPEoE+/rrXjakaj7UQFdGRH+8pFFMNoP8O0IGuB7Ll+EEol7u9f+F0OGAps0UzoqZlNUxlE8KSidqvU3VS7hsA5I95FMrk1rvGOJAuAxk00xevwSmX23UK4otCUKnqtcY1nCF/jG2PA/r4tkVhxVsfxmKileG/p6/osmb4EQL1Ojcb4gAB43tSANSJxGlvI2ARbIFaOy7QwGN/bk2IatMfxRiUyPkMkiiEJmWm7zEOAt/W6O9HJkb5IHyh7Odetu13spx2d7E+rWqqPF+/GxOYRYNwRH5KSfxkxSG12dpDSbIgsqftGFyCOh5J5iRzl3sL/CoH/PBCgX2jvh5ix/lso+S4tscQlSiHSkO1Mw0WkKHnRiA35xv5Esl0GTCdA0RNDGASUIlKyg9AL+s1MqVMpC4DcAZ8uQxxH38RpiA/9D/ZTvWM=', 'base64');

            var thiz = this;
            zlib.unzip(buffer1, (err, buffer) => {
                if (!err) {
                    console.log("원본: ", buffer.toString());
                    var obj = JSON.parse(buffer.toString());
                    thiz.gameScene.scene.restart();
                    thiz.gameScene.replayData = JSON.parse(buffer.toString());
                    console.log("replay set~~");
                } else {
                    // handle error
                }
            });
        }
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}
</style>
