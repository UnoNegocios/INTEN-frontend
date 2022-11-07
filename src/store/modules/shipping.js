import axios from "axios";
const state = {
    shippings:[],
};
const getters = {};

const actions = {
    getShippings( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/shipping/all")
        .then(response => {
            commit('setShippings', response.data);
        });
    }
};

const mutations = {
    setShippings(state, data){
        state.shippings = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}