import axios from "axios";
const state = {
    notes:[]
};
const getters = {};

const actions = {
    getNotes( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/note/all")
        .then(response => {
            commit('setNotes', response.data);
        });
    }
};

const mutations = {
    setNotes(state, data){
        state.notes = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}