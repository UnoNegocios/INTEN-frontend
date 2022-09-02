import axios from "axios";
const state = {
    new_quotations:[],
    quotations:[],
    cancellations:[],
    sales:[],
    company_quotations:[],
    totals:[],
    total_loader:false,
    quotation_items:[],
    only_quotations:[],
    orders:[],
    dispatched_sales:[]
};
const getters = {};

const actions = {
    newSale({}, sale) {
        state.quotations = state.quotations.concat(sale)
    },
    getNewQuotations( {commit}, request){
        if(localStorage.getItem('filtersSales')==undefined&&localStorage.getItem('filtersSales')==null){
            axios
            .get("https://unowipes.com/api/v2/q?page=" + request.pageNumber + "&sort=" + request.sort)
            .then(response => {
                commit('setNewQuotations', response.data);
            });
        }else{
            axios
            .get("https://unowipes.com/api/v2/q?"+ JSON.parse(localStorage.getItem('filtersSales')) + "&page=" + request.pageNumber + "&sort=" + request.sort)
            .then(response=>{
                commit('setNewQuotations', response.data );
            })
        }
    },
    getSales( {commit}, request){
        if(localStorage.getItem('filtersSales')==undefined&&localStorage.getItem('filtersSales')==null){
            axios
            .get("https://unowipes.com/api/v2/sales?page=" + request.pageNumber + "&sort=" + request.sort)
            .then(response => {
                commit('setSales', response.data);
            });
        }else{
            axios
            .get("https://unowipes.com/api/v2/sales?"+ JSON.parse(localStorage.getItem('filtersSales')) + "&page=" + request.pageNumber + "&sort=" + request.sort)
            .then(response=>{
                commit('setSales', response.data );
            })
        }
    },
    getCancellations( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/quotation/cancellations")
        .then(response => {
            commit('setCancellations', response.data);
        });
    },
    async getCompanyQuotations( {commit}, company_id ){
        await axios
        .get("https://unowipes.com/api/v2/company/sales", {params:{id:company_id}})
        .then(response => {
            commit('setCompanyQuotations', response.data);
        });
    },
    getQuotations( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/quotation/all")
        .then(response => {
            commit('setQuotations', response.data);
        });
    },
    getOnlyQuotations( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/quotation/quotations")
        .then(response => {
            commit('setOnlyQuotations', response.data);
        });
    },
    getTotals( {commit} ){
        state.total_loader = true
        var startDate = []
        var date = new Date()
        startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        //return new Promise((resolve, reject) => {
        if(localStorage.getItem('filtersSales')==undefined&&localStorage.getItem('filtersSales')==null){
            axios
            .get("https://unowipes.com/api/v2/sale/totals"+'?filter[date_between]='+startDate)
            .then(response => {
                state.total_loader = false
                commit('setTotals', response.data);
            });
        }else{
            axios
            .get("https://unowipes.com/api/v2/sale/totals?"+ JSON.parse(localStorage.getItem('filtersSales')))
            .then(response=>{
                state.total_loader = false
                commit('setTotals', response.data);
            })
        }
        //})
    },
    getQuotationItems( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/qi")
        .then(response => {
            commit('setQuoationItems', response.data);
        });
    },
    getOrders( {commit}, request){
        if(localStorage.getItem('filtersOrders')==undefined&&localStorage.getItem('filtersOrders')==null){
            axios
            .get("https://unowipes.com/api/v2/orders/dispatched_orders?page=" + request.pageNumber + "&sort=" + request.sort)
            .then(response => {
                commit('setOrders', response.data);
            });
        }else{
            axios
            .get("https://unowipes.com/api/v2/orders/dispatched_orders?"+ JSON.parse(localStorage.getItem('filtersOrders')) + "&page=" + request.pageNumber + "&sort=" + request.sort)
            .then(response=>{
                commit('setOrders', response.data );
            })
        }
    }
};

const mutations = {
    setOnlyQuotations(state, data){
        state.only_quotations = data;
    },
    setQuotations(state, data){
        state.quotations = data;
    },
    setCancellations(state, data){
        state.cancellations = data;
    },
    setSales(state, data){
        state.sales = data;
    },
    setCompanyQuotations(state, data){
        state.company_quotations = data.data
    },
    setNewQuotations(state, data){
        state.new_quotations = data;
    },
    setTotals(state, data){
        state.totals = data;
    },
    setQuoationItems(state, data){
        state.quotation_items = data;
    },
    setOrders(state, data){
        state.orders = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}