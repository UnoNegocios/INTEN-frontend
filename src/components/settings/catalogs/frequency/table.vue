

<template>       
    <v-data-table expand-icon :headers="headers" :items="frequencies" class="elevation-0">
        <template slot="no-data">
            No existen frecuencias de consumo registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editFrequency @closeDialogFrequency="closeDialogFrequency" v-bind:editedFrequency="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editFrequency from "../frequency/edit"
import axios from "axios";
export default {
    components: {
        'editFrequency':editFrequency,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Frecuencia de Consumo', value: 'frequency'},
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
        frequencies:{
            get(){
                return this.$store.state.frequency.frequencies;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar esta frecuencia de consumo?')) {
                axios.delete(process.env.VUE_APP_BACKEND + "api/v1/frequency/delete/"+id).then(response => {
                    this.$store.dispatch('frequency/getFrequencies')
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
        closeDialogFrequency: function(params) {
            this.dialog = params;
            this.$store.dispatch('frequency/getFrequencies')
        },
    },
    created(){
        this.$store.dispatch('frequency/getFrequencies')
    },
}
</script>