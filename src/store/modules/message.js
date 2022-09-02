import axios from "axios";
const state = {
    messages:[]
};
const getters = {};

const actions = {
    getMessages( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/message/all/" + localStorage.getItem("conversacionId"))
        .then(response => {
            commit('setMessages', response.data);
        });
    }
};

const mutations = {
    setMessages(state, data){
        state.messages = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}