<template>
    <div id="app"> 
        <VueMenu v-bind:topTitle="`PROFILE`" /> 
        <b-row class="justify-content-md-center">

            <b-col cols="12" md="auto">
                <b-card
                    title="Profile"
                    img-top
                    tag="article"
                    style="max-width: 20rem;"
                    class="justify-content-md-center"
                    >
                    <b-card-text>
                        개인정보를 수정하는 곳입니다.
                        <b-form @submit="onSubmit" @reset="onReset">
                            <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
                                <b-form-input
                                    id="input-2"
                                    v-model="username"
                                    :value="world"
                                    required
                                    placeholder="Enter name"
                                    ></b-form-input>
                            </b-form-group> 
                    <b-button type="submit" variant="primary">Submit</b-button>
                        </b-form>
                    </b-card-text>
                </b-card>

            </b-col>

        </b-row>
        <footer><address>경기도 단비집</address></footer> 
    </div> 
</template>

<script>


import VueMenu from "./VueMenu.vue";
import {GameScene, EmptyScene } from "../Ksoogame.ts";
import axios from 'axios';
import * as zlib from 'browserify-zlib'; 
import { EventBus } from "@/event-bus";
import * as global from '../consts'

var gameScene = null;

export default {
    components: {
        VueMenu, 
    },
    name: 'game',
    data () {
        return {
            foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
            msg: 'Welcome to Your Vue.js App',
            message: '이 페이지는 ' + new Date() + ' 에 로드 되었습니다' ,
            username: "TTT"
        }
    },
    created() {
        // this.username = this.$store.state.username;
    },
    computed: {
        world: function() {
            console.log("world:", this.$store.state.username);
            this.username = this.$store.state.username;
            return this.$store.state.username;
        }
    },
    beforeCreate() {
        console.log(this.$store.state);
        console.log(this.$store.state);
    },
    mounted () {
        // new EmptyScene('Game'); 
        console.log(this.$store.state.userid);
    },
    methods:
    {
        onSubmit(evt) {
            console.log("submot!!");
            var base_url = global.APIURL + "/jdodge/service";
            var req = {
                jwt: this.$store.state.jwt,
                name: this.username, // this.$store.state.username ,
                lang: "ko",
                cmd: "alterUserInfo"
            };
            var thiz = this;
            axios.post(base_url, req).then( response => { 
                console.log("alteruser");
                thiz.$store.state.showMessage = true; 
                thiz.$store.state.showMessageText = "닉네임 변경 성공!";
            } ).catch( response => { 
                console.log("[fail] alterUserInfo: ", response);
                thiz.$store.state.showMessage = true; 
                thiz.$store.state.showMessageText = "닉네임 변경이 실패했습니다.";
            } ); // ERROR
            // alert(JSON.stringify(this.form))
            evt.preventDefault()
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset our form values
            this.form.email = ''
            this.form.name = ''
            this.form.food = null
            this.form.checked = []
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}
</style>
