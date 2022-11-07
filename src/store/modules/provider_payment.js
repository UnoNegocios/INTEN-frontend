
import axios from "axios";

const state = {
    provider_payments:[]
};

const getters = {};

const actions = {
    getProviderPayments( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/provider_payment/all")
        .then(response => {
            commit('setProviderPayments', response.data);
        });
    }
};

const mutations = {
    setProviderPayments(state, data){
        state.provider_payments = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
