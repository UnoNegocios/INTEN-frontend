
import axios from "axios";

const state = {
    production_details:[]
};

const getters = {};

const actions = {
    getProductionDetails( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/production_detail/all")
        .then(response => {
            commit('setProductionDetails', response.data);
        });
    }
};

const mutations = {
    setProductionDetails(state, data){
        state.production_details = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
