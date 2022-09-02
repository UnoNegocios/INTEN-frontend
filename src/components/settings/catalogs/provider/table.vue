<template>       
    <v-data-table expand-icon :headers="headers" :items="providers" class="elevation-0">
        <template slot="no-data">
            No existen proveedores registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editProvider @closeDialogProvider="closeDialogProvider" v-bind:editedProvider="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editProvider from "../provider/edit"
import axios from "axios";
export default {
    components: {
        'editProvider':editProvider,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Motivo de Rechazo', value: 'name'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),
    computed:{
        providers:{
            get(){
                return this.$store.state.provider.providers;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este proveedor?')) {
                axios.delete("https://unowipes.com/api/v1/providers/"+id).then(response => {
                    this.$store.dispatch('provider/getProviders')
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
        closeDialogProvider: function(params) {
            this.dialog = params;
            this.$store.dispatch('provider/getProviders')
        },
    },
    created(){
        this.$store.dispatch('provider/getProviders')
    },
}
</script>