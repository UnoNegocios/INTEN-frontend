<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterSales v-bind:company="company" @filtersUtility="filtersUtility"/>
        </v-navigation-drawer>

        <totals v-bind:totals="totals"/>

        <!--header-->
        <v-toolbar flat class="px-4 pt-3">
            <v-toolbar-title>
                Utilidades
                <br/>
                <span style="font-size:12px; color:grey; position: absolute;" v-if="filterStorage()">Últimos 30 días</span>
            </v-toolbar-title>
            <v-btn icon class="ml-6 pt-2">
                <v-icon @click="openFilter()">mdi-filter</v-icon>
            </v-btn>
            <!--v-btn icon>
                <v-icon @click="tableGraph=false" v-if="tableGraph">mdi-chart-bell-curve-cumulative</v-icon>
                <v-icon @click="tableGraph=true" v-else>mdi-periodic-table</v-icon>
            </v-btn-->
            <v-spacer></v-spacer>



            <v-btn icon v-show="permissions('download')">
                <v-icon @click="exportExcel">mdi-download</v-icon>
            </v-btn>
        </v-toolbar>
        <!-- Tabla -->
        <v-data-table 
            height="600"
            fixed-header
            :footer-props="{'items-per-page-options':[15, 30, 50, 100]}"
            v-if="showTable && tableGraph"
            :headers="headers" 
            :items="sales"
            class="elevation-0 px-6 py-4"
            :options.sync="options"
            :server-items-length="totalSales"
            :loading="loading"
            :item-class="itemRowBackground">
            <template v-slot:[`item.printed`]="{ item }">
                <v-icon v-if="item.printed!=true" color="grey"> mdi-close </v-icon>
                <v-icon v-else color="primary"> mdi-check </v-icon>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de ventas aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company}}</v-list-item>
            </template>
            <!-- Valeres -->
            <template v-slot:[`item.cost`]="{ item }">
                {{(item.cost*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.price`]="{ item }">
                {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.value`]="{ item }">
                {{(item.value*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.utility`]="{ item }">
                {{(item.utility*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.id)"  v-show="permissions('editSales')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item.id)"  v-show="permissions('deleteSales')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table>

        <!-- Grafica>
        <v-card class="elevation-0" v-if="showTable && tableGraph==false">
             
        </v-card-->
    </v-container>
</template>

<script>
import moment from 'moment';
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../detail/filter"
import Totals from "../detail/totals"
export default {
    props:{
        company:Number
    },
    components: {
        'filterSales':Filter,
        'totals':Totals
    }, 
    data: () => ({
        tableGraph:true,
        showTable:true,
        totalSales: 0,
        sales: [],
        loading: true,
        options: {},
        filters: false,
        totals:{}
    }),
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    computed: {
        showCompany(){
            if(this.company == null){
                return { text: 'Empresa', value: 'company_id',}
            }else{
                return false
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            return [
            { text: '', value: 'data-table-expand' },
            { text: 'Venta', value: 'quotation' },
            { text: 'Producto', value: 'item' },
            { text: 'Costo', value: 'cost' },
            { text: 'Precio', value: 'value' },
            { text: 'Precio Ajustado', value: 'price' },
            { text: 'Utilidad', value: 'utility' },
            { text: 'Kg', value: 'weight' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
    },
    methods: { 
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.editedBarSales
                this.sales = data.items
                this.totalSales = data.total
                this.loading = false
            })
        },
        filterStorage(){
            if(localStorage.getItem('filtersUtilities')!=null){
                false
            }else{
                return true
            }
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                if(localStorage.getItem('filtersUtilities')!=null){
                    var link = JSON.parse(localStorage.getItem('filtersUtilities'))+'&'
                }else{
                    var link = ''
                }
                axios.get("https://unowipes.com/api/v1/sale_utilities?itemsPerPage=" + itemsPerPage).then(response => {//" + link + "page=" + page + "
                    items = this.mapSales(response.data.data)
                    total = response.data.meta.total
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            axios
                            .get("https://unowipes.com/api/v1/sale_utilities?" + link + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapSales(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }else{
                            axios
                            .get("https://unowipes.com/api/v1/sale_utilities?" + link + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapSales(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }
                    }else{
                        resolve({
                            items,
                            total,
                        })
                    }
                })
            })
        },
        mapSales(sales){    
            if(this.company!='' && this.company!=undefined && this.company!=null){
                sales = sales.filter(sale=>sale.company_id == this.company)
            }
            sales = sales.map(id=>{
                return{
                    cost: id.cost * id.quantity,
                    item: id.item.macro + ' | ' + id.item.name,
                    price: id.price * id.quantity,
                    quantity: id.quantity,
                    quotation: id.quotation + ' | ' + id.company.attributes.name,
                    value: id.value * id.quantity,
                    weight: (id.item.weight * id.quantity).toFixed(2) + ' ' + this.kgpza(id.item.unit),
                    utility: (id.price * id.quantity) - (id.cost * id.quantity)
                }
            });
            return sales
        },
        nombre(empresa){
            if(empresa!=undefined){
                if(empresa.name == undefined || empresa.name == '' || empresa.name == null){
                    return empresa.razon_social
                }else{
                    return empresa.name
                }
            }
        },
        kgpza(value){
            if(value!=undefined){
                if(value.name == 'Kilo'){
                    return 'kgs'
                }else if(value.name == 'Pieza'){
                    return 'pzas'
                }else{
                    return value.name
                }
            }else{
                return ''
            }
        },
        itemRowBackground: function (item) {
            if(item.cost>item.price){
                return 'cost-price'
            }
            else if(item.price<item.value){
                return 'price-value'
            }else if(item.cost===0){
                return 'cost_null'
            }
        },
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
        },
        filtersUtility: function(params) {
            this.$store.dispatch('quotation/getSales', {'pageNumber':1, 'sort':'id'})
            this.showTable = false
            this.$nextTick(() => {
                this.showTable = true
            })
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.sales)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Utilidades'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        },
        editItem(id){

        },
        deleteItem(id){

        },
    }
}
</script>
<style>
    .price-value {
        background-color: #fff5d7
    }
    .cost-price {
        background-color: #ffc4c4
    }
    .cost_null {
        opacity: 0.5;
    }
</style>