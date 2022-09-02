

<template>       
    <v-data-table expand-icon :headers="headers" :items="statuses" class="elevation-0">
        <template slot="no-data">
            No existen estatus registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:[`item.color`]="{ item }">
            <v-chip outlined class="pa-2" small :color="item.color"> Color Etiqueta</v-chip>
        </template >
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editStatus @closeDialogStatus="closeDialogStatus" v-bind:editedStatus="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editStatus from "../statuses/edit"
import axios from "axios";
export default {
    components: {
        'editStatus':editStatus,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Estatus', value: 'name'},
            {text: 'Color', value: 'color'},
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
        statuses:{
            get(){
                return this.$store.state.status.statuses;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este estatus?')) {
                axios.delete("https://unowipes.com/api/v1/statuses/"+id).then(response => {
                    this.$store.dispatch('status/getStatuses')
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
        closeDialogStatus: function(params) {
            this.dialog = params;
            this.$store.dispatch('status/getStatuses')
        },
    },
    created(){
        this.$store.dispatch('status/getStatuses')
    },
}
</script>