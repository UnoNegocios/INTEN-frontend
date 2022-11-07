

<template>       
    <v-data-table expand-icon :headers="headers" :items="origins" class="elevation-0">
        <template slot="no-data">
            No existen procedencias registradas.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editOrigin @closeDialogOrigin="closeDialogOrigin" v-bind:editedOrigin="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editOrigin from "../origins/edit"
import axios from "axios";
export default {
    components: {
        'editOrigin':editOrigin,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Procedencia', value: 'name'},
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
        origins:{
            get(){
                return this.$store.state.origin.origins;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar esta procedencia?')) {
                axios.delete(process.env.VUE_APP_BACKEND + "api/v1/origins/"+id).then(response => {
                    this.$store.dispatch('origin/getOrigins')
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
        closeDialogOrigin: function(params) {
            this.dialog = params;
            this.$store.dispatch('origin/getOrigins')
        },
    },
    created(){
        this.$store.dispatch('origin/getOrigins')
    },
}
</script>