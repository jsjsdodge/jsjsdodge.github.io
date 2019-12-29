<template>

<div>
    <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">JDODGE </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#">Link</b-nav-item>

                <b-nav-item href="#" disabled>Disabled</b-nav-item>
                <b-nav-item href="#"><button v-on:click="testButton">test</button></b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                    <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                </b-nav-form>

                <b-nav-item-dropdown text="Lang" right>
                    <b-dropdown-item href="#">EN</b-dropdown-item>
                    <b-dropdown-item href="#">ES</b-dropdown-item>
                    <b-dropdown-item href="#">RU</b-dropdown-item>
                    <b-dropdown-item href="#">FA</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->

                    <template v-if="username != ''" v-slot:button-content >
                        <em>{{ username }}({{ userid }}), Hi!</em>
                    </template>
                    <template v-else v-slot:button-content >
                        <em>User</em>
                    </template>
                    <template v-if="username != ''">
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
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
            username: "",
            userid: ""
        };
    },
    methods: {
        onGroupsChange(e) {
            console.log({ e });
        },
        onSuccess(googleUser) {
            console.log("onSuccess Login");
            // this.loggedIn = true;
            var t = googleUser.getBasicProfile();
            // this.username = t.getName();

            var myUserEntity = {};
            myUserEntity.Id = t.getId();
            myUserEntity.Name = t.getName();
            sessionStorage.setItem('jdodge_auth',JSON.stringify(myUserEntity)); 
            this.username = t.getName();
            this.userid = t.getId();
            EventBus.$emit("userinfo", myUserEntity);

            var base_url = global.APIURL + "/jdodge/service?cmd=login&id=" + this.userid + "&name=" + this.username;
            // var base_url = "https://api.ipify.org?format=json";
            axios.get(base_url)
                .then( response => { 
                    // var json = JSON.parse(response.data);
                    console.log(response); 
                } ) // SUCCESS
                .catch( response => { console.log(response); } ); // ERROR 
            console.log(t.getName()); 
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
        }
    },
    mounted() {
        // Vue.GoogleUser.then(auth2 => {
        //     console.log(auth2);
        //     // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", auth2.isSignedIn.get());
        // }); 

    },
    beforeCreate() {
        console.log("before create");
        var thiz = this;
        Vue.GoogleAuth.then(auth2 => {
            // console.log(auth2.getBasicProfile());
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", auth2.isSignedIn.get());
            if(auth2.isSignedIn.get() == false) {
                // auth2.signIn();
            } else {
                var t = sessionStorage.getItem('jdodge_auth');
                var t2 = JSON.parse(t);
                if(t == null){
                    console.log("a");
                    auth2.signOut();
                } else {
                    thiz.username = t2.Name;
                    thiz.userid = t2.Id;
                    EventBus.$emit("userinfo", t2);
                    console.log("b");
                }
            }
            auth2.isSignedIn.listen(function(abc) {
                console.log("login is changed => ", abc);
                if(abc == false) {
                    sessionStorage.clear();
                    // var myUserEntity = {};
                    // myUserEntity.Id = "";
                    // myUserEntity.Name = "";
                    thiz.username = "";
                    thiz.userid = "";
                    EventBus.$emit("userinfo", {Id:this.userid, Name: this.username});
                }
            }); 
            
        }); 
    }
};
</script>

<style lang="scss">
$ease-out: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
$to-do: #f4ce46;
$in-progress: #2a92bf;
$approved: #00b961;

* {
    box-sizing: border-box;
}

body {
    background: #33363d;
    color: white;
    font-family: "Roboto Mono", serif;
    font-weight: 300;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
}

ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.drag-container {
    max-width: 1000px;
    margin: 20px auto;
}

.drag-list {
    display: flex;
    align-items: flex-start;

    @media (max-width: 690px) {
        display: block;
    }
}

.drag-column {
    flex: 1;
    margin: 0 10px;
    position: relative;
    background: rgba(black, 0.2);
    overflow: hidden;

    @media (max-width: 690px) {
        margin-bottom: 30px;
    }

    h2 {
        font-size: 0.8rem;
        margin: 0;
        text-transform: uppercase;
        font-weight: 600;
    }

    &-to-do {
        .drag-column-header,
        .drag-options {
            background: $to-do;
        }
    }

    &-in-progress {
        .drag-column-header,
        .drag-options {
            background: $in-progress;
        }
    }

    &-approved {
        .drag-column-header,
        .drag-options {
            background: $approved;
        }
    }
}

.drag-column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    user-select: none;
}

.drag-inner-list {
    height: 85vh;
    overflow: auto;
}

.drag-item {
    margin: 10px;
    height: 100px;
    background: rgba(black, 0.4);
    transition: $ease-out;

    /* items grabbed state */
    &[aria-grabbed="true"] {
        background: #5cc1a6;
        color: #fff;
    }

    .drag-item-text {
        font-size: 1rem;
        padding-left: 1rem;
        padding-top: 1rem;
    }
}

.drag-header-more {
    cursor: pointer;
}

@keyframes nodeInserted {
    from {
        opacity: 0.2;
    }
    to {
        opacity: 0.8;
    }
}

.item-dropzone-area {
    height: 6rem;
    background: #888;
    opacity: 0.8;
    animation-duration: 0.5s;
    animation-name: nodeInserted;
    margin-left: 0.6rem;
    margin-right: 0.6rem;
}
</style>

