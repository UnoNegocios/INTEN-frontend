

<template>       
    <v-data-table expand-icon :headers="headers" :items="methods" class="elevation-0">
        <template slot="no-data">
            No existen métodos de pago registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editPaymentMethod @closeDialogPaymentMethod="closeDialogPaymentMethod" v-bind:editedPaymentMethod="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editPaymentMethod from "../payment_method/edit"
import axios from "axios";
export default {
    components: {
        'editPaymentMethod':editPaymentMethod,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Tipo de Cliente', value: 'method'},
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
        methods:{
            get(){
                return this.$store.state.payment_method.payment_methods;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este metodo de pago?')) {
                axios.delete("https://unowipes.com/api/v1/payment_methods/"+id).then(response => {
                    this.$store.dispatch('payment_method/getPaymentMethods')
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
        closeDialogPaymentMethod: function(params) {
            this.dialog = params;
            this.$store.dispatch('payment_method/getPaymentMethods')
        },
    },
    created(){
        this.$store.dispatch('payment_method/getPaymentMethods')
    },
}
</script>