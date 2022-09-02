
import axios from "axios";

const state = {
    shopping_details:[]
};

const getters = {};

const actions = {
    getShoppingDetails( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/shopping_detail/all")
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
