// import Phaser from 'phaser';
import Vue from 'vue'
import Router from 'vue-router'

import {GameScene} from "./Ksoogame.ts";

import App from './App.vue';
import Game from './components/Game.vue';
import Login from './components/VueLogin.vue';
import Terms from './components/Terms.vue';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueDraggable from "vue-draggable";
import VueMeta from 'vue-meta'
import { LoaderPlugin } from 'vue-google-login';

Vue.use(Router)
Vue.use(VueDraggable)
Vue.use(BootstrapVue)
Vue.use(VueMeta)
Vue.use(LoaderPlugin, {
    client_id: "435678538765-9dp720935bq4r4tbhsfmf9onf6l6s0ao.apps.googleusercontent.com"
}); 
Vue.config.productionTip = false; 
const Home = { template: '<div>Home</div>'}
const Login2 = { template: '<div>LLLLLLLLLLLL</div>'}
const NotFound = { template: '<div>Not Found</div>'}
var router = new Router({
    routes: [
        { path: '/', component: Game },
        { path: '/login', component: Login },
        { path: '/terms', component: Terms },
    ]
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App),
    router
});
