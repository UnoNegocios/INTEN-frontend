import axios from "axios";
const state = {
    notes:[]
};
const getters = {};

const actions = {
    getNotes( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/notes")
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