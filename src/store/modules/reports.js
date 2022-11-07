import axios from "axios";
const state = {
    saleman_report:[],
    saleman_report_loader:false
};
const getters = {};

const actions = {
    getSalemanReport( {commit} ){
        state.total_loader = true
        var dates = []
        var date = new Date()
        dates[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        dates[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        axios.post(process.env.VUE_APP_BACKEND + "api/v1/saleman_report?date_from=" + dates[0] + "&date_to=" + dates[1] + "&user_id=13").then(response => {
            state.saleman_report_loader = false
            commit('setSalemanReport', response.data);
        })
    },
}

const mutations = {
    setSalemanReport(state, data){
        state.saleman_report = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}