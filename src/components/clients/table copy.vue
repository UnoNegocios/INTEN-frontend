<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <filterClients @filtersCompanies="filtersCompanies"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table v-if="renderComponent" :headers="headers" :items="companies" class="elevation-0 px-6 py-4">
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
                        <v-list-item @click="editItem(item)" v-show="permissions('editCompanies')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)" v-show="permissions('editCompanies')">
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
                        <v-chip  v-bind="attrs" v-on="on" class="pa-2" small :style="{'background':'linear-gradient(0deg, rgb(255 255 255 / 85%), rgb(255 255 255 / 85%)) rgb(0, 198, 255)', 'background-color':colorStatus(item.status), 'color':colorStatus(item.status)}">{{item.status}}</v-chip>
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
                <div class="perro" :style="{ backgroundColor: color(item) }"></div> <v-btn class="gato" icon :to="{ path: '/clients/client/'+ item.id}"><v-icon small> mdi-eye</v-icon></v-btn>
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
        renderComponent: true,
        sheet: false,
        company:'',
        filters: false,
        editDialog: false,
        createDialog: false,
        deleteId:'',
        companies: '',
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
            this.companies = this.companiesLists
            return [
            { value: 'view', sortable: false, align: 'start', },
            { text: 'Empresa', value: 'name', width: '100%'},
            { text: 'Código Macro', value: 'number',},
            { text: 'Procedencia', value: 'origin' },
            { text: 'Estatus', value: 'status' },

            { text: 'Fecha de Contrato', value: '' },
      
            { text: 'Responsable', value: 'salesman' },
            { text: 'Creación', value: 'created_at' },
            { text: 'Actualización', value: 'updated_at' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        companiesLists(){
            
        },
    },
    methods: {
        cual(name, razon){
            if(name==null || name==undefined || name==''){
                return razon
            }else{
                return name
            }
        },
        changeStatus(id, status){
            var editedItem = this.$store.state.company.companies.filter(company=>company.id == id)[0]
            editedItem.status_id = status
            axios.put(process.env.VUE_APP_BACKEND + "api/v1/company/update",Object.assign(editedItem)).then(response=>{
                this.$store.dispatch('company/getCompanies')
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
        filtersCompanies: function(params) {
            this.renderComponent = false;
            this.$nextTick(() => {
                this.renderComponent = true;
            });
        },
        closeDialogEditCompany: function(params) {
            this.editDialog = params;
            this.$store.dispatch('company/getCompanies')
        },
        closeCreateDialogCompany: function(params) {
            this.createDialog = params;
            this.$store.dispatch('company/getCompanies')
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.companies)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Empresas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        color(item){
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
        },
        deleteCompany(){
            axios.delete(process.env.VUE_APP_BACKEND + "api/v1/company/delete/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.$store.dispatch('company/getCompanies')
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
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(item){
            this.company = this.$store.state.company.companies.filter(company=>company.id == item.id)[0]
            this.editDialog = true
        },
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