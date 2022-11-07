

<template>       
    <v-data-table expand-icon :headers="headers" :items="types" class="elevation-0">
        <template slot="no-data">
            No existen tipos de cliente registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editType @closeDialogClientType="closeDialogClientType" v-bind:editedType="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editType from "../client_type/edit"
import axios from "axios";
export default {
    components: {
        'editType':editType,
    },
    data:()=>({  
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        editedItem:'',
        headers:[
            {text: 'Tipo de Cliente', value: 'type'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        types:{
            get(){
                return this.$store.state.type.types;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este tipo de cliente?')) {
                axios.delete(process.env.VUE_APP_BACKEND + "api/v1/type/delete/"+id).then(response => {
                    this.$store.dispatch('type/getTypes')
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
        closeDialogClientType: function(params) {
            this.dialog = params;
            this.$store.dispatch('type/getTypes')
        },
    },
    created(){
        this.$store.dispatch('type/getTypes')
    },
}
</script>