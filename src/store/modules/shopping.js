
import axios from "axios";

const state = {
    shoppings:[]
};

const getters = {};

const actions = {
    getShoppings( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/shopping/all")
        .then(response => {
            commit('setShoppings', response.data);
        });
    }
};

const mutations = {
    setShoppings(state, data){
        state.shoppings = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
