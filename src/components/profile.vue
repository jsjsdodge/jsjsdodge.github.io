<template>
    <div id="app"> 
        <VueMenu v-bind:topTitle="`PROFILE`" /> 
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
                id="input-group-1"
                label="Your ID"
                label-for="input-1"
                >
                <b-form-input
                    id="input-1"
                    v-model="$store.state.userid"
                    required
                    ></b-form-input>
                </b-form-group>

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
                id: this.$store.state.userid,
                name: this.username, // this.$store.state.username ,
                lang: "ko",
                cmd: "alterUserInfo"
            };
            axios.post(base_url, req).then( response => { 
                console.log("alteruser");
            } ) // SUCCESS
                .catch( response => { console.log(response); } ); // ERROR
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
