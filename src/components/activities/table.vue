<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterCalendar v-bind:company="company" @filtersActivities="filtersActivities"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table :headers="headers" :items="calendars" class="elevation-0 px-6 py-4"
            height="600"
            fixed-header
            :footer-props="{'items-per-page-options':[15, 30, 50, calendarsLength]}"
            v-if="showTable"
            :options.sync="options"
            :server-items-length="totalCalendars"
            :loading="loading">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Actividades</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon v-show="permissions('download')">
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left v-if="permissions('editActivities')==true || permissions('deleteActivities')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item)" v-show="permissions('editActivities')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)" v-show="permissions('deleteActivities')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Actividad -->
            <template v-slot:[`item.activity`]="{ item }">
                <v-chip outlined class="pa-2" small :color="item.activity.color">{{item.activity.name}}</v-chip>
            </template>
            <!-- Estatus -->
            <template v-slot:[`item.status`]="{ item }">
                <v-icon @click="status(item.id,'completed')" v-if="item.status == 'not completed'" color="red"> mdi-close </v-icon>
                <v-icon @click="status(item.id, 'pending')" v-else-if="item.status == 'completed'" color="green"> mdi-check </v-icon>
                <v-icon @click="status(item.id,'completed')" v-else-if="item.status == 'pending'" color="primary">  mdi-calendar-clock</v-icon>
            </template >
            <!-- Creación -->
            <template v-slot:[`item.created_at`]="{ item }" style="padding:0px!important; margin:0px!important;">
                {{item.created_at.slice(0, 10)}}
            </template>

            <!-- Empresa -->
            <template v-show="item.company!=false" v-slot:[`item.company`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company}}</v-list-item>
            </template>
            <!-- Actualización -->
            <template v-slot:[`item.updated_at`]="{ item }">
                {{item.updated_at.slice(0, 10)}}
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de actividades aún
            </template>
        </v-data-table>
        <!-- Crear actividad -->
        <v-dialog v-model="createDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:company="company" @closeCreateDialogCalendar="closeCreateDialogCalendar"/>
        </v-dialog>
        <!-- Editar actividad -->
        <v-dialog v-model="editDialog" max-width="900px">
          <edit v-bind:calendar="calendar" @closeDialogEditCalendar="closeDialogEditCalendar"/>
        </v-dialog>
        <!-- Dialogo confirmación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta actividad?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteCalendar()">
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
import FilterCalendar from "../activities/filter"
import Create from "../activities/create"
import Edit from "../activities/edit"
export default {
    props:{
        company:Object
    },
    components: {
        'filterCalendar':FilterCalendar,
        'create':Create,
        'edit':Edit,
    }, 
    data: () => ({
        calendarsLength:0,
        showTable:true,
        totalCalendars:0,
        calendars: [],
        options: {},
        loading: true,

        calendar:'',
        sheet: false,
        filters: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        deleteId:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
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
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        showCompany(){
            if(this.company == null){
                return { text: 'Empresa', value: 'company',}
            }else{
                return false
            }
        },
        headers(){ 
            return [
            { text: 'Fecha', value: 'date' },
            this.showCompany,
            { text: 'Contacto', value: 'contact' },
            { text: 'Actividad', value: 'activity' },
            { text: 'Descripción', value: 'description' },
            { text: 'Estado', value: 'status', sortable: false },
            { text: 'Vendedor', value: 'salesman'},
            { text: 'Usuario', value: 'user' },
            { text: 'Creación', value: 'created_at' },
            { text: 'Edición', value: 'updated_at' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
    },
    methods: {
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.calendars = data.items
                this.totalCalendars = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersActivitiesLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = ''
                if(this.company!=undefined){
                    link = link + 'filter[client_id]='+this.company.id+'&'
                }
                if(localStorage.getItem('filtersActivities')!=null){
                    link = link + JSON.parse(localStorage.getItem('filtersActivities'))+'&'
                }/*else{
                    var startDate = []
                    var date = new Date()
                    startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    link = link + 'filter[date_between]='+startDate+'&'
                }*/
                axios.get("https://unowipes.com/api/v1/activities?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    this.calendarsLength = response.data.meta.total
                    items = this.mapCalendars(response.data.data)
                    total = response.data.meta.total
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            axios
                            .get("https://unowipes.com/api/v1/activities?" + link + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapCalendars(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }else{
                            axios
                            .get("https://unowipes.com/api/v1/activities?" + link + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapCalendars(response.data.data)
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
        mapCalendars(calendars){
            return calendars.map(id=>{
                return{
                    id: id.id,
                    date: id.date,
                    company: this.cual(id.client, id.lead),
                    contact: this.contact(id.contact),
                    activity: id.activity_type,
                    description: id.description,
                    status: id.status,
                    salesman: this.user(id.user),
                    user: id.id,
                    created_at: id.created_at.slice(0,10),
                    updated_at: id.updated_at.slice(0,10),
                }
            });
        },
        cual(client, lead){
        if(client!=undefined){
            if(client.name == undefined || client.name == '' || client.name == null){
                return client.razon_social
            }else{
                return client.name
            }
            }else if(lead!=undefined){
                return lead.name
            }
        },
        user(element){
            if(element!=null&&element!=undefined&&element!=''){
                return element.name + ' ' + element.last
            }else{
                return ''
            }
        },
        contact(element){
            if(element!=null&&element!=undefined&&element!=''){
                return element.name
            }else{
                return ''
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
        status(activity_id, new_status){
            var editedItem={
                id:activity_id,
                status:new_status,
            }
            this.$nextTick(() => {
            axios.patch("https://unowipes.com/api/v1/activities/" + activity_id,Object.assign(editedItem)).then(response=>{
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
            })
        },
        filtersActivities: function(params) {
            this.getDataFromApi()
        },
        closeDialogEditCalendar: function(params) {
            this.getDataFromApi()
            this.editDialog = false;
        },
        closeCreateDialogCalendar: function(params) {
            /*
            if(params!=false){
            this.calendars.push(this.mapCalendars([params])[0])
            }
            */
           this.getDataFromApi()
            this.createDialog = false;
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.calendars)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Actividades'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteCalendar(){
            axios.delete("https://unowipes.com/api/v1/activities/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
        },
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(item){
            this.calendar = item
            this.editDialog = true
        },
    }
}
</script>


<style>
    .bordercolor{
        width: 3px;
        content: ' ';
        height: 47px;
        position: absolute;
        border-radius:5px 0px 0px 5px;
    }
    @media(min-width: 980px){
        .bordercolor{
            margin-top: -13px;
            margin-left: -19px;
        }
    }
    @media(max-width: 980px){
        .bordercolor {
            height: 360px;
            left: 9px;
        }
    }
</style>