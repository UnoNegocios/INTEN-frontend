
import axios from "axios";

const state = {
    shopping_details:[]
};

const getters = {};

const actions = {
    getShoppingDetails( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/shopping_detail/all")
        .then(response => {
            commit('setShoppingDetails', response.data);
        });
    }
};

const mutations = {
    setShoppingDetails(state, data){
        state.shopping_details = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
