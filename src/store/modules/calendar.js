import axios from "axios";
const state = {
    calendars:[],
};
const getters = {};

const actions = {
    getCalendars( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/calendar")
        .then(response => {
            commit('setCalendars', response.data);
        });
    }
};

const mutations = {
    setCalendars(state, data){
        state.calendars = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}