import axios from "axios";
const state = {
    conversations:[]
};
const getters = {};

const actions = {
    getConversations( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/conversation")
        .then(response => {
            commit('setConversations', response.data);
        });
    }
};

const mutations = {
    setConversations(state, data){
        state.conversations = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}