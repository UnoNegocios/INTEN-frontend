import axios from "axios";
const state = {
    collections:[],
    collection_details:[],
    new_collections:[],
    totals:[],
    total_loader:false,
};
const getters = {};

const actions = {
    getCollections( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/collection/all")
        .then(response => {
            commit('setCollections', response.data);
        });
    },
    getCollectionDetails( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v2/collection_details")
        .then(response => {
            commit('setCollectionDetails', response.data.data);
        });
    },
    getNewCollections( {commit}, request){
        if(localStorage.getItem('filtersCollections')==undefined&&localStorage.getItem('filtersCollections')==null){
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/collections?page=" + request.pageNumber + "&sort=" + request.sort)
            .then(response => {
                commit('setNewCollections', response.data);
            });
        }else{
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/collections?"+ JSON.parse(localStorage.getItem('filtersCollections')) + "&page=" + request.pageNumber + "&sort=" + request.sort)
            .then(response=>{
                commit('setNewCollections', response.data );
            })
        }
    },
    getTotals( {commit} ){
        state.total_loader = true
        var startDate = []
        var date = new Date()
        startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        //return new Promise((resolve, reject) => {
        if(localStorage.getItem('filtersCollections')==undefined&&localStorage.getItem('filtersCollections')==null){
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/collection/totals"+'?filter[date_between]='+startDate)
            .then(response => {
                commit('setTotals', response.data.values);
                state.total_loader = false
            });
        }else{
            axios
            .get(process.env.VUE_APP_BACKEND + "api/v2/collection/totals?"+ JSON.parse(localStorage.getItem('filtersCollections')))
            .then(response=>{
                commit('setTotals', response.data.values);
                state.total_loader = false
            })
        }
        //})
    },
};

const mutations = {
    setCollections(state, data){
        state.collections = data;
    },
    setCollectionDetails(state, data){
        state.collection_details = data;
    },
    setNewCollections(state, data){
        state.new_collections = data;
    },
    setTotals(state, data){
        state.totals = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}