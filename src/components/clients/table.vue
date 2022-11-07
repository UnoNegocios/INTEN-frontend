<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <filterClients @filtersClient="filtersClient"/>
        </v-navigation-drawer>
        <!-- Contenedor -->

            <v-data-table 
            height="600"
            fixed-header
            :footer-props="{'items-per-page-options':[15, 30, 50, clientsLength]}"
            v-if="showTable"
            :headers="headers" 
            :items="clients"
            class="elevation-0 px-6 pb-4 pt-10"
            :options.sync="options"
            :server-items-length="totalClients"
            :loading="loading">

            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon v-show="permissions('download')">
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left v-if="permissions('editCompanies')==true || permissions('deleteCompanies')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.id)" v-show="permissions('editCompanies')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item.id)" v-show="permissions('editCompanies')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Estatus -->
            <template v-slot:[`item.status`]="{ item }">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }" >
                        <v-chip v-if="item.status!=null"  v-bind="attrs" v-on="on" class="pa-2" small :style="{'background':'linear-gradient(0deg, rgb(255 255 255 / 85%), rgb(255 255 255 / 85%)) rgb(0, 198, 255)', 'background-color':item.status.color, 'color':item.status.color}">{{item.status.name}}</v-chip>
                    </template>
                    <v-list>
                        <v-list-item v-for="(status,index) in statusesLists" :key="index" > <!--  -->
                            <v-list-item-content class="pa-0">
                                <v-list-item-title><v-btn @click="changeStatus(item.id, status.id)" small text>{{status.name}}</v-btn></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>   
                    </v-list>
                </v-menu>
            </template>
            <!-- empresa -->
            <template v-slot:[`item.name`]="{ item }">
                <strong>{{item.name}}</strong>
                <br>
                <span v-show="item.razon_social!=null && item.name.toLowerCase()!=item.razon_social.toLowerCase()">{{item.razon_social}}</span>
            </template>
            <!-- Ver más -->
            <template v-slot:[`item.view`]="{ item }">
                <!--div class="perro" :style="{ backgroundColor: color(item) }"></div class="gato" --> <v-btn icon :to="{ path: '/clients/client/'+ item.id}"><v-icon small> mdi-eye</v-icon></v-btn>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de clientes aún
            </template>
        </v-data-table>
        <!-- Crear empresa -->
        <v-dialog v-model="createDialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create @closeCreateDialogCompany="closeCreateDialogCompany"/>
        </v-dialog>
        <!-- Editar empresa -->
        <v-dialog v-model="editDialog" max-width="700px">
          <edit v-bind:company="company" @closeDialogEditCompany="closeDialogEditCompany"/>
        </v-dialog>
        <!-- editar empresa -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta empresa?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteCompany()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../clients/filter"
import Create from "../clients/companies/create"
import Edit from "../clients/companies/edit"
export default {
    components: {
        'filterClients':Filter,
        'create':Create,
        'edit':Edit
    }, 
    data: () => ({
        clientsLength:0,
        showTable:true,
        totalClients:0,
        sheet: false,
        company:'',
        filters: false,
        editDialog: false,
        createDialog: false,
        deleteId:'',
        clients: [],
        options: {},
        loading: true,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),
    computed: {
        statusesLists(){
            return this.$store.state.status.statuses
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            return [
            { value: 'view', sortable: false, align: 'start', },
            { text: 'Empresa', value: 'name', width: '100%'},
            { text: 'Procedencia', value: 'origin' },
            { text: 'Estatus', value: 'status' },
            { text: 'Fecha de Contrato', value: 'contract_date' },
            { text: 'Responsable', value: 'salesman' },
            { text: 'Creación', value: 'created_at' },
            { text: 'Actualización', value: 'updated_at' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
    },
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods: {
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.clients = data.items
                this.totalClients = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersClientsLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = ''
                if(localStorage.getItem('filtersClients')!=null){
                    link = link + JSON.parse(localStorage.getItem('filtersClients')).toString() +'&'
                }/*else{
                    var startDate = []
                    var date = new Date()
                    startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    link = link + 'filter[date_between]='+startDate+'&'
                }*/
                axios.get(process.env.VUE_APP_BACKEND + "api/v1/clients?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    this.clientsLength = response.data.meta.total
                    items = this.mapClients(response.data.data)
                    total = response.data.meta.total
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            axios
                            .get(process.env.VUE_APP_BACKEND + "api/v1/clients?" + link + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapClients(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }else{
                            axios
                            .get(process.env.VUE_APP_BACKEND + "api/v1/clients?" + link + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapClients(response.data.data)
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
        mapClients(clients){
            return clients.map(id=>{
                return{
                    id: id.id,
                    name: this.cual(id.name, id.razon_social),
                    origin: this.origin(id.origin),
                    status: id.status,
                    contract_date: id.contract_date,
                    salesman: id.user.name + ' ' + id.user.last,
                    created_at: id.created_at.slice(0,10),
                    updated_at: id.updated_at.slice(0,10),
                }
            });
        },
        origin(origin){
            if(origin!=null){
                return origin.name
            }else{
                return ''
            }
        },
        cual(name, razon){
            if(name==null || name==undefined || name==''){
                return razon
            }else{
                return name
            }
        },
        changeStatus(id, status){
            axios.patch(process.env.VUE_APP_BACKEND + "api/v1/clients/" + id, {'status_id':status}).then(response=>{
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
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
        filtersClient: function(params) {
            this.getDataFromApi()
        },
        closeDialogEditCompany: function(params) {
            this.editDialog = params;
            this.getDataFromApi()
        },
        closeCreateDialogCompany: function(params) {
            this.createDialog = params;
            this.getDataFromApi()
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.clients)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Empresas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        /*color(item){
            var green = this.$store.state.calendar.calendars.filter(calendar=>calendar.company_id == item.id).filter(calendar=>new Date(calendar.date) > new Date()).length
            var yellow = this.$store.state.calendar.calendars.filter(calendar=>calendar.company_id == item.id).filter(calendar=>new Date(calendar.date) == new Date()).length
            if(green>=1){
                return '#4CAF50'
            }
            else if(item.status=='Cancelado' || (green==0 && yellow==0)){
                return '#FF5252'
            }
            else if((yellow>=1)){
                return '#FFC107'
            }
        },*/
        deleteCompany(){
            axios.delete(process.env.VUE_APP_BACKEND + "api/v1/company/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
        },
        deleteItem (id) {
            this.deleteId = id
            this.sheet = true
        },
        editItem(id){
            axios.get(process.env.VUE_APP_BACKEND + "api/v1/clients?filter[id]=" + id).then(response => {
                this.company = response.data.data.map(id=>{
                    return{
                        id:id.id,
                        contract_date:id.contract_date,
                        user_id:this.existe(id.user),
                        origin_id:this.existe(id.origin),
                        status_id:this.existe(id.status),
                        name:id.name,
                        address:id.address,
                        phone:id.phone,
                        email:id.email,
                        rfc:id.rfc,
                        razon_social:id.razon_social,
                        delivery_address:id.delivery_address,
                        //consumptions:id.consumptions,
                        //payment_method_id:id.payment_method_id,
                        opportunity_area:id.opportunity_area,
                        //contact_mode_id:id.contact_mode_id,
                        //special_conditions:id.special_conditions,
                        special_note:id.special_note,
                        cfdi:id.cfdi,
                        bank_account_number:id.bank_account_number,
                        delivery_time:id.delivery_time,
                        payment_conditions:id.payment_conditions
                    }
                })[0]
                this.editDialog = true
            })
        },
        existe(item){
            if(item!=null){
                return item.id
            }else{
                return ''
            }
        }
    }
}
</script>


<style>
    .perro{
        content: ' ';
        position: absolute;
        border-radius:50%;
    }
    
    @media(min-width: 980px){
        .perro{
            width: 8px;
            height: 8px;
            margin-top: 13px;
            margin-left: -10px;
        }
        .gato{
            transform: translateX(14px);
        }
    }
    @media(max-width: 980px){
        .perro {
            width: 12px;
            height: 12px;
            left: 9px;
            margin-left: 40px!important;
            margin-top: 20px!important;
        }
    }
    
</style>