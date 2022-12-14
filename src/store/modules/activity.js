
import axios from "axios";

const state = {
    activities:[]
};

const getters = {};

const actions = {
    getActivities( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/activity_types")
        .then(response => {
            commit('setActivities', response.data.data);
        });
    }
};

const mutations = {
    setActivities(state, data){
        state.activities = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
