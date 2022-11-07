import axios from "axios";
const state = {
    sale_totals:[],
    collection_totals:[],
    total_loader1:false,
    total_loader3:false,
    total_loader2:false,
    past_due_totals:[]
};
const getters = {};

const actions = {
    getSaleTotals( {commit} ){
        state.total_loader1 = true
        var startDate = []
        var date = new Date()
        startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        if(localStorage.getItem('filtersCardsSale')==undefined&&localStorage.getItem('filtersCardsSale')==null){
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/report/sum_total_indicators"+'?filter[date_between]='+startDate)
            .then(response => {
                state.total_loader1 = false
                commit('setSaleTotals', response.data);
            });
        }else{
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/report/sum_total_indicators?"+ JSON.parse(localStorage.getItem('filtersCardsSale')))
            .then(response=>{
                state.total_loader1 = false
                commit('setSaleTotals', response.data);
            })
        }
    },
    getPastDueTotals( {commit} ){
        state.total_loader3 = true
        if(localStorage.getItem('filtersCardsPastDue')==undefined&&localStorage.getItem('filtersCardsPastDue')==null){
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/report/due_balance_report")
            .then(response => {
                state.total_loader3 = false
                commit('setPastDueTotals', response.data);
            });
        }else{
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/report/due_balance_report?"+ JSON.parse(localStorage.getItem('filtersCardsPastDue')))
            .then(response=>{
                state.total_loader3 = false
                commit('setPastDueTotals', response.data);
            })
        }
    },
    getCollectionTotals( {commit} ){
        state.total_loader2 = true
        var startDate = []
        var date = new Date()
        startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        if(localStorage.getItem('filtersCardsCollection')==undefined&&localStorage.getItem('filtersCardsCollection')==null){
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/report/collection_total"+'?filter[collection.date_between]='+startDate)
            .then(response => {
                state.total_loader2 = false
                commit('setCollectionTotals', response.data);
            });
        }else{
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/report/collection_total?"+ JSON.parse(localStorage.getItem('filtersCardsCollection')))
            .then(response=>{
                state.total_loader2 = false
                commit('setCollectionTotals', response.data);
            })
        }
    },
};

const mutations = {
    setSaleTotals(state, data){
        state.sale_totals = data;
    },
    setCollectionTotals(state, data){
        state.collection_totals = data;
    },
    setPastDueTotals(state, data){
        state.past_due_totals = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}