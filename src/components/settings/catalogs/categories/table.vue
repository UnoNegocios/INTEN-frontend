

<template>       
    <v-data-table expand-icon :headers="headers" :items="categories" class="elevation-0">
        <template slot="no-data">
            No existen categorías de productos registradas.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editCategory @closeDialogCategory="closeDialogCategory" v-bind:editedCategory="editedItem"/>
            </v-dialog> 
        </template>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-data-table>
</template>
<script>
import editCategory from "../categories/edit"
import axios from "axios";
export default {
    components: {
        'editCategory':editCategory,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Categoría', value: 'name'},
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
        categories:{
            get(){
                return this.$store.state.category.categories;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar esta categoría de producto?')) {
                axios.delete("https://unowipes.com/api/v1/consumption_categories/"+id).then(response => {
                    this.$store.dispatch('category/getCategories')
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
        closeDialogCategory: function(params) {
            this.dialog = params;
            this.$store.dispatch('category/getCategories')
        },
    },
    created(){
        this.$store.dispatch('category/getCategories')
    },
}
</script>