import axios from "axios";
const state = {
    special_conditions:[]
};
const getters = {};

const actions = {
    getSpecialConditions( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/special_conditions")
        .then(response => {
            commit('setSpecialConditions', response.data);
        });
    }
};

const mutations = {
    setSpecialConditions(state, data){
        state.special_conditions = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}