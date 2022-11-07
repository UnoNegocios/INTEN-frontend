import axios from "axios";
const state = {
    users:[]
};
const getters = {};

const actions = {
    getUsers( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/users")
        .then(response => {
            commit('setUsers', response.data.data);
        });
    }
};

const mutations = {
    setUsers(state, data){
        state.users = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}