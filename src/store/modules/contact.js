import axios from "axios";
const state = {
    contacts:[]
};
const getters = {};

const actions = {
    getContacts( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/contact/all")
        .then(response => {
            commit('setContacts', response.data);
        });
    }
};

const mutations = {
    setContacts(state, data){
        state.contacts = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}