<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            <span>Editar Producto</span>
            <v-spacer/>
            <v-checkbox v-model="editedItem.is_active" label="Publicado"></v-checkbox>
        </v-card-title>

        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                
                <v-col cols="12" sm="6" md="6">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Producto"></v-text-field>
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" type="number" v-model="editedItem.price" label="Precio"></v-text-field>
                    <v-autocomplete :rules="[v => !!v || 'Campo requerido']" multiple v-model="editedItem.category" :items="categories" label="Categoría" item-text="category" item-value="category">
                        <template slot="no-data">
                                No existen categorías relacionadas.
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6" md="6" class="pt-11">
                    <v-textarea label="Descripción" v-model="editedItem.description"></v-textarea>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text  :loading="gris" :disabled="gris || !valid" @click="save">Guardar</v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    props:{
        editedItem:Object
    },
    data:()=>({ 
        gris:false, 
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        valid: true,
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    computed:{
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        categories:{
            get(){
                return [{category:'PLUG'}, {category:'MÓVIL'}, {category:'MIFI'}]
            }
        },
    },
    methods:{
        close () {
            this.gris = false
            //this.index = 0
            //this.$refs.myVueDropzone.removeAllFiles()
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            this.$nextTick(() => {
                axios.patch(process.env.VUE_APP_BACKEND + "api/v1/cellular_plans/" + this.editedItem.id,Object.assign(this.editedItem)).then(response=>{
                    this.close()
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                    this.gris = false
                })
            })
        },
    }
}
</script>