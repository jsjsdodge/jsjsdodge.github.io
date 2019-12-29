<template>
    <div id="app"> 
        <VueMenu />

        <b-container class="bv-example-row" fluid> 
            <b-row>
                <b-col cols="8">
                    <div id="phaser-example"></div>
                </b-col>
                <b-col cols="2"> 
                    <b-table striped hover
                             id="my-table"
                             :items="records"
                             :per-page="perPage"
                             :current-page="currentPage"
                             small
                             >
                             <template v-slot:cell(replay_data)="data">
                                 <button v-on:click="viewReplay(data.value)">VIEW REPLAY</button>
                             </template>
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


        <img src="../assets/logo.png" />
        <img src="../assets/rain.png" />
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

var gameScene = null;

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
            records: [{"name":"han", "score":123}],
            ksoo: 'kso1233123o',
            perPage: 10,
            currentPage: 1,
        }
    },
    created() {
        EventBus.$on("userinfo", userinfo => {
            console.log("ui: ", userinfo);
            gameScene.userId = userinfo.Id;
            gameScene.userName = userinfo.Name;
            // this.receivedClickCount = clickedCount;
        });
    },
    computed: {
        rows() {
            return this.records.length;
        }
    },
    mounted () {
        // new EmptyScene('Game'); 
        gameScene = new GameScene('tt'); 
        this.updateRecords();
    },
    methods:
    {
        updateRecords: function() {
            var thiz = this;
            thiz.records = [{"name":"han", "score":124443, "replay_data":"etc"}];
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
            const buffer1 = Buffer.from('eJztms1OGzEURt9l1tlUQq3EujxBl1V3/UOqKGpBXaB597KAkqSZMJOJfc+1j+TF0RECj33tzP3Cw/Dh6ur9cPnm4uLtu81wfXN7f/d7uPz4MG7CxvDjy9e7xylVwvvbR9hoNBPmnKX96/rb9+dfXoAdjrOP4fPPPzdPtbYaT/n7hQ+NLKP56fRslMqSsjruX/RR8zgf7rw96lguMZKWkeQa6fnFpBvXkKkJtGfvZ+WDtnv7bROthAIrG8QjIUQqX47lToS8noGdff0yPlbZsFoF7pdYB4GRXGopGhUmcP0hafV7cwZfmlxmJvwbhOCiMaiag8lyB3x8EGZIzTEW4v7Ksi/ERvZIua5oRQgimjagm75jERGDvS2icRDIEFaZGfDgIEys+bvNvV2MwBcESLJNmuGqV6xmMaTbAnaIQLlzPeauiC6lzGFgeShbPZj1v7VTqc6rhK4AFEBoNMzqnZ9mTf40DLGzBQZCgUHUGJMEiCIYSS2lMo1Me5mmykB6Y07nrupJCVFAa5RfrRfilYZZO82EEUVzIF11VwHDG9H1OFZIBwv/k+ALlnmS1dPq8kpLgcB4SfkslzLwEXItII05KUkP6uWTczKwWP6bLR0zNyENgHKjyonU9nDhEFtCQ2CTpVuDY8qv8WFIKoVuXPrLrDkkNu57wwasvJLl3hhx8Bao1ABq2lYYLGTrZY+MTGumCa8pUnuj0+mwbizXTpbophfL6njgwzs6zxCDM6DqaZFckE2iZBkQ/vSRLYFa1/y5EW0RiOnBYaQtREYjVkNgq63juzn4/wjvVtcjaRNKb6AYW2kmKxU4drVTS1kmMyciQcctoMZveQQCSI6bKQ3atmuKnvsOLxKQIWBExY7T/66H3Yv5g3tqQirgtFVeVMPAbEV3fpcYScsYstyMh1hwiXv/ZCouTiDWs5RlWa7JnOStByXAYXtUPYeLXx128dUBWV9uuEMzWJysQRKSejWdrnW3/2kTff6zYSsxRMFJno77xUnou+T5zOnfSjd+c0az7+R1kfa+35kRFt0B7ffEtXvYYzds9NvgzmTWP3d8b3AIP41/AdOlMlU=', 'base64');

            zlib.unzip(buffer1, (err, buffer) => {
                if (!err) {
                    console.log("원본: ", buffer.toString());
                    var obj = JSON.parse(buffer.toString());
                    gameScene.scene.restart();
                    gameScene.replayData = JSON.parse(buffer.toString());
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
