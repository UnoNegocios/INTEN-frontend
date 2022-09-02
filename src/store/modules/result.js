
import axios from "axios";

const state = {
    results:[]
};

const getters = {};

const actions = {
    getResults( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/result/all")
        .then(response => {
            commit('setResults', response.data);
        });
    }
};

const mutations = {
    setResults(state, data){
        state.results = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
