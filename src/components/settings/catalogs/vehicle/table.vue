

<template>       
    <v-data-table expand-icon :headers="headers" :items="vehicles" class="elevation-0">
        <template slot="no-data">
            No existen vehiculos registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editVehicle @closeDialogVehicle="closeDialogVehicle" v-bind:editedVehicle="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editVehicle from "../vehicle/edit"
import axios from "axios";
export default {
    components: {
        'editVehicle':editVehicle,
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
        vehicles:{
            get(){
                return this.$store.state.vehicle.vehicles;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este vehiculo?')) {
                axios.delete(process.env.VUE_APP_BACKEND + "api/v1/vehicle/delete/"+id).then(response => {
                    this.$store.dispatch('vehicle/getVehicles')
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
        closeDialogVehicle: function(params) {
            this.dialog = params;
            this.$store.dispatch('vehicle/getVehicles')
        },
    },
    created(){
        this.$store.dispatch('vehicle/getVehicles')
    },
}
</script>