

<template>       
    <v-data-table expand-icon :headers="headers" :items="zones" class="elevation-0">
        <template slot="no-data">
            No existen Zonas registradas.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editZone @closeDialogZone="closeDialogZone" v-bind:editedZone="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editZone from "../zone/edit"
import axios from "axios";
export default {
    components: {
        'editZone':editZone,
    },
    data:()=>({  
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        editedItem:'',
        headers:[
            {text: 'Tipo de Cliente', value: 'zone'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        zones:{
            get(){
                return this.$store.state.zone.zones;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar esta zona?')) {
                axios.delete("https://unowipes.com/api/v1/zone/delete/"+id).then(response => {
                    this.$store.dispatch('zone/getZones')
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
        closeDialogZone: function(params) {
            this.dialog = params;
            this.$store.dispatch('zone/getZones')
        },
    },
    created(){
        this.$store.dispatch('zone/getZones')
    },
}
</script>