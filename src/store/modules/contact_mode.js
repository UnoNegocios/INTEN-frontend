import axios from "axios";
const state = {
    contact_modes:[]
};
const getters = {};

const actions = {
    getContactModes( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/contact_modes")
        .then(response => {
            commit('setContactModes', response.data);
        });
    }
};

const mutations = {
    setContactModes(state, data){
        state.contact_modes = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}