
import Vue from "vue";
import axios from "axios";

import Vuex from "vuex";
Vue.use(Vuex);

const state = {
    servicios:[],
    carritos:[]
};
const getters = {
};
const actions = {
    getServicios( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/item/all")
        .then(response => {
            commit('setServicios', response.data);
        });
    },
    addItem(context, id) {
        context.commit("ADD_Item", id);
    },
    removeItem(context, index) {
        context.commit("REMOVE_Item", index);
    },
};
const mutations = {
    setServicios(state, data){
        state.servicios = data;
    },

    ADD_Item(state, id) {
        state.carritos.push(id);
    },
    REMOVE_Item(state, index) {
        state.carritos.splice(index, 1);
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};