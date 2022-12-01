<template>
<keep-alive>
    <v-container style="max-width:100vw;">
        <!-- Filtros >
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterInventory @filtersItem="filtersItem"/>
        </v-navigation-drawer-->
        <!-- Contenedor -->
        <v-data-table :headers="headers" :items="items" class="elevation-0 px-6 py-4"
        height="600"
        fixed-header
        :footer-props="{'items-per-page-options':[15, 30, 50, totalItems]}"
        :options.sync="options"
        :server-items-length="totalItems"
        :loading="loading"><!-- show-expand -->
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Productos | Servicios </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                        @keydown.enter="getDataFromApi()"
                    ></v-text-field>
                    <!--v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn-->
                </v-toolbar>
            </template>
            <template slot="no-data">
                No existen productos registrados.
            </template>
            <template v-slot:[`item.price`]="{ item }">
                {{money(item.price)}}
            </template>
            <template v-slot:[`item.cost`]="{ item }">
                {{money(item.cost)}}
            </template>
            <template v-slot:[`item.weight`]="{ item }">
                {{item.weight}}kg
            </template>
            <template v-slot:[`item.is_active`]="{ item }">
                <v-icon v-if="item.is_active==true" color="green">mdi-record</v-icon>
                <v-icon v-else color="red">mdi-record</v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="edit(item.id)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
        <!-- Crear actividad -->
        <v-dialog v-model="createDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createItem @closeDialogItem="closeDialogItem"/>
        </v-dialog>
        <!-- editar -->
        <v-dialog v-model="editDialog" max-width="600px">
            <editItem @closeDialogItem="closeDialogItem" v-bind:editedItem="editedItem"/>
        </v-dialog> 
        <!-- alertas -->
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</keep-alive>
</template>
<script>
import axios from "axios";
import editItem from "../inventory/edit"
import createItem from "../inventory/create"
//import filterInventory from "../inventory/filter"
export default {
    components: {
        'editItem':editItem,
        'createItem':createItem,
        //'filterInventory':filterInventory
    },
    data:()=>({ 
        search:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        }, 
        filters: false,
        editDialog:false,
        createDialog:false,
        editedItem:'',
        dialog:false,
        totalItems:0,
        items: [],
        options: {},
        loading: true,
    }),
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    computed:{
        headers(){
            return [
                {text: 'Nombre', value: 'name'},
                //{text: 'Codigo Macro', value: 'macro'},
                //{text: 'Tipo', value: 'type'},
                //{text: 'Proveedor', value: 'provider_id'},
                //{text: 'Peso', value: 'weight'},
                {text: 'Precio', value: 'price'},
                //{text: 'Costo', value: 'cost'},
                {text: 'Categoría', value: 'category'},
                {text: 'Publicado', value: 'is_active'},
                {text: 'Acciones', value: 'actions', sortable: false },
            ]
        },
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.items = data.items
                this.totalItems = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = ''
                if(this.search!=''){
                    link = 'filter[name]=' + this.search// + '&'
                }
                axios.get(process.env.VUE_APP_BACKEND + "api/v1/cellular_plans?" + link)// + "page=" + page + "&itemsPerPage=" + itemsPerPage)
                .then(response => {
                    items = this.mapItems(response.data)
                    total = response.data.length
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            axios
                            .get(process.env.VUE_APP_BACKEND + "api/v1/cellular_plans?" + link)// + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapItems(response.data)
                                total = response.data.length
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }else{
                            axios
                            .get(process.env.VUE_APP_BACKEND + "api/v1/cellular_plans?" + link)// + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapItems(response.data)
                                total = response.data.length
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
        mapItems(items){
            return items/*.map(id=>{
                return{
                    id:id.id,
                    name: id.name,
                    macro: id.macro,
                    type: id.type,
                    provider_id: this.provider(id.provider_id),
                    weight: id.weight,
                    price: id.price,
                    cost: id.cost,
                    categories: this.category(id.categories),
                    is_published: id.is_published,
                    editedItem:id
                }
            });*/
        },
        /*filtersItem: function(params) {
            
        },*/
        money(amount){
            if(amount!=undefined){
                return (amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
            }else{
                return '-'
            }
        },
        provider(id){
            if(id!=undefined){
                return this.$store.state.provider.providers.filter(provider=>provider.id == id).map(provider=>provider.name)[0];
            }else{
                return '-'
            }
        },
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este producto/servicio?')) {
                axios.delete(process.env.VUE_APP_BACKEND + "api/v1/cellular_plans/"+id).then(response => {
                    this.getDataFromApi()
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                });
            }
        },
        edit(id){
            this.editedItem = this.$store.state.item.items.filter(item=>item.id == id)[0]

            this.editDialog = true
        },
        closeDialogItem: function(params) {
            this.editDialog = params;
            this.createDialog = params;
            this.getDataFromApi()
        },
        category(categoriesIds){
            if(categoriesIds!=undefined){
            var categoriesNames = this.$store.state.category.categories
            if(categoriesIds.length>0){
                var catName = categoriesNames.filter(category=>category.id == categoriesIds[0]).map(category => category.name)[0];
                for(var i=1; i<categoriesIds.length; i++){
                    catName = catName + ', ' + categoriesNames.filter(category=>category.id == categoriesIds[i]).map(category => category.name)[0];
                }
                return catName
            }else{
                return '-'
            }
            }else{
                return '-'
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
    },
}
</script>