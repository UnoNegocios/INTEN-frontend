

<template>       
    <v-data-table expand-icon :headers="headers" :items="zones" class="elevation-0">
        <template slot="no-data">
            No existen condiciones especiales registradas.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editSpecialCondition @closeDialogSpecialCondition="closeDialogSpecialCondition" v-bind:editedSpecialCondition="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editSpecialCondition from "../special_condition/edit"
import axios from "axios";
export default {
    components: {
        'editSpecialCondition':editSpecialCondition,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Condicion Especial', value: 'condition'},
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
        zones:{
            get(){
                return this.$store.state.special_condition.special_conditions;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar esta zona?')) {
                axios.delete(process.env.VUE_APP_BACKEND + "api/v1/special_conditions/"+id).then(response => {
                    this.$store.dispatch('special_condition/getSpecialConditions')
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
        closeDialogSpecialCondition: function(params) {
            this.dialog = params;
            this.$store.dispatch('special_condition/getSpecialConditions')
        },
    },
    created(){
        this.$store.dispatch('special_condition/getSpecialConditions')
    },
}
</script>