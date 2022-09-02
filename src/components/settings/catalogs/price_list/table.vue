

<template>       
    <v-data-table expand-icon :headers="headers" :items="prices" class="elevation-0">
        <template slot="no-data">
            No existen listas de precio registradas.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editPriceList @closeDialogPriceList="closeDialogPriceList" v-bind:editedPriceList="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editPriceList from "../price_list/edit"
import axios from "axios";
export default {
    components: {
        'editPriceList':editPriceList,
    },
    data:()=>({  
        editedItem:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        headers:[
            {text: 'Tipo de Cliente', value: 'item'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        prices:{
            get(){
                return this.$store.state.price_list.price_lists;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar esta lista de precios?')) {
                axios.delete("https://unowipes.com/api/v1/price_list/delete/"+id).then(response => {
                    this.$store.dispatch('price_list/getPriceLists')
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                });
            }
        },
        edit(item){
            this.editedItem = item
            this.dialog = true
        },
        closeDialogPriceList: function(params) {
            this.dialog = params;
            this.$store.dispatch('price_list/getPriceLists')
        },
    },
    created(){
        this.$store.dispatch('price_list/getPriceLists')
    },
}
</script>