

<template>       
    <v-data-table expand-icon :headers="headers" :items="cfdis" class="elevation-0">
        <template slot="no-data">
            No existen usos de CFDI registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editCfdi @closeDialogCfdi="closeDialogCfdi" v-bind:editedCfdi="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editCfdi from "../cfdi/edit"
import axios from "axios";
export default {
    components: {
        'editCfdi':editCfdi,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Uso de CFDI', value: 'cfdi'},
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
        cfdis:{
            get(){
                return this.$store.state.cfdi.cfdis;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este uso de CFDI?')) {
                axios.delete("https://unowipes.com/api/v1/cfdi/delete/"+id).then(response => {
                    this.$store.dispatch('cfdi/getCfdi')
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
        closeDialogCfdi: function(params) {
            this.dialog = params;
            this.$store.dispatch('cfdi/getCfdi')
        },
    },
    created(){
        this.$store.dispatch('cfdi/getCfdi')
    },
}
</script>