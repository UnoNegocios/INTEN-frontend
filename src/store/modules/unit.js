import axios from "axios";
const state = {
    units:[]
};
const getters = {};

const actions = {
    getUnits( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/unit/all")
        .then(response => {
            commit('setUnits', response.data);
        });
    }
};

const mutations = {
    setUnits(state, data){
        state.units = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}