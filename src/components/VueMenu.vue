<template>

<div>
    <b-navbar toggleable="lg">
        <b-navbar-brand href="#/">JDODGE</b-navbar-brand>
        <b-navbar-brand href="#/game">PLAY</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item-dropdown text="Leader Board" href="#/leaderboard/top100" right>
                    <b-dropdown-item href="#/leaderboard/top100">TOP100</b-dropdown-item>
                    <b-dropdown-item href="#/leaderboard/monthly">월간</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item href="#"><button v-on:click="testButton">test</button></b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">

                <b-nav-item-dropdown text="Lang" right>
                    <b-dropdown-item href="#">EN</b-dropdown-item>
                    <b-dropdown-item href="#">ES</b-dropdown-item>
                    <b-dropdown-item href="#">RU</b-dropdown-item>
                    <b-dropdown-item href="#">FA</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->

                    <template v-if="$store.state.jwt != ''" v-slot:button-content >
                        <em>{{ $store.state.username }}, Hi!</em>
                    </template>
                    <template v-else v-slot:button-content >
                        <em>User</em>
                    </template>
                    <template v-if="$store.state.jwt  != ''">
                        <b-dropdown-item href="#/profile">Profile</b-dropdown-item>
                        <b-dropdown-item href="#">
                            <GoogleLogin :params="params" :logoutButton=true :onSuccess="onLogout" :onFailure="onLogoutFail">Logout</GoogleLogin>
                        </b-dropdown-item>
                    </template>
                    <template v-else>
                        <b-dropdown-item href="#">
                            <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess" :onFailure="onFailure"></GoogleLogin>
                        </b-dropdown-item>
                    </template>

                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    <b-alert v-model="$store.state.showMessage" variant="info" dismissible>
        {{ $store.state.showMessageText }} 
    </b-alert>
</div>

</template>
<script>
import GoogleLogin from 'vue-google-login';
import * as global from '../consts.ts';
import axios from 'axios';
import Vue from 'vue'
import { EventBus } from "@/event-bus";
export default {
    components: {
        GoogleLogin, 
    }, 
    props: ["topTitle"], 
    data() {
        return {
            params: {
                client_id: "435678538765-9dp720935bq4r4tbhsfmf9onf6l6s0ao.apps.googleusercontent.com"
            },
            renderParams: {
                width: 250,
                height: 50,
                longtitle: true
            },
        };
    },
    computed: {
    },
    methods: {
        onGroupsChange(e) {
            console.log({ e });
        },
        onSuccess(googleUser) {
            console.log("onSuccess Login");
            var basic = googleUser.getBasicProfile();
            this.$store.state.username = basic.getName();
            this.$store.state.userid = basic.getId();
            // this.loggedIn = true;
            // // This only gets the user information: id, name, imageUrl and email
            // console.log(googleUser.getBasicProfile());
        },
        onFailure(err) {
            console.log("onf", err);
        },
        onLogout() {
            console.log("logout: ");
        },
        onLogoutFail(err) {
            console.log("onf", err);
        },
        testButton() {
            this.$store.state.counter++;
        },
        doLogin(memberid, name) {
            this.$store.state.username = name;
            this.$store.state.userid = memberid;

            var base_url = global.APIURL + "/jdodge/service";
            // var base_url = "https://api.ipify.org?format=json";
            var thiz = this;
            axios.post(base_url,
                       {
                           cmd: "login",
                           id: thiz.$store.state.userid,
                           name: thiz.$store.state.username
                       })
                .then( response => { 
                    // var json = JSON.parse(response.data);
                    console.log("[result] login: ", response.data); 
                    thiz.$store.state.jwt = response.data.data.jwt;
                    thiz.$store.state.username = response.data.data.name;
                    // thiz.$store.state.username = thiz.$store.state.username.replace('Welcome, ', '');

                    var myUserEntity = {};
                    myUserEntity.Jwt = thiz.$store.state.jwt;
                    myUserEntity.Name = thiz.$store.state.username;
                    EventBus.$emit("userinfo", myUserEntity);
                } ) // SUCCESS
                .catch( response => { console.log(response); } ); // ERROR 
        }
    },
    mounted() {
        console.log(this.$store.state.userid);
        console.log(this.$store.state.username);
        // Vue.GoogleUser.then(auth2 => {
        //     console.log(auth2);
        //     // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", auth2.isSignedIn.get());
        // }); 

    },
    beforeCreate() {
        console.log("before create");
        var thiz = this;
        console.log(thiz.$store.state);
        Vue.GoogleAuth.then(auth2 => {
            // console.log(auth2.getBasicProfile());
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", auth2.isSignedIn.get());
            console.log(thiz.$store.state);
            var t = auth2.currentUser.get();
            var basic = t.getBasicProfile();
            if(auth2.isSignedIn.get() == false) {
                // auth2.signIn();
            } else {
                thiz.doLogin(basic.getId(), basic.getName());
                console.log("b");
            }
            auth2.isSignedIn.listen(function(abc) {
                console.log("login is changed => ", abc);
                var t = auth2.currentUser.get();
                var basic = t.getBasicProfile();
                
                if(abc == false) {
                    // sessionStorage.clear();
                    // var myUserEntity = {};
                    // myUserEntity.Id = "";
                    // myUserEntity.Name = "";
                    console.log("abc == false");
                    thiz.$store.state.username = "";
                    thiz.$store.state.jwt = "";
                    EventBus.$emit("userinfo", {Jwt:thiz.$store.state.jwt, Name: thiz.$store.state.username});
                } else {
                    thiz.doLogin(basic.getId(), basic.getName());
                }
            }); 
            
        }); 
    }
};
</script>

<style>
</style>

