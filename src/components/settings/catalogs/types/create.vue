<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Crear Tipo de Actividad
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="8">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Type"></v-text-field>
                </v-col>
                <v-col class="pt-5" cols="12" sm="6" md="4">
                    <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                        <template v-slot:activator="{ on }">
                            <v-chip class="ma-2" :color="editedItem.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color</v-chip>
                        </template>
                        <v-color-picker :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.color" class="ma-2"></v-color-picker>
                    </v-menu> 
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
    data:()=>({  
        valid: true,
        editedItem: {
            name:'',
            color:'',
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
    }),
    methods:{
        colorNo(){
            return this.editedItem.color+'bd'
        },
        close () {
            this.gris = false
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedItem.color = '#e0e0e0'
            this.$nextTick(() => {
                this.$emit("closeDialogType", false);
            })
        },
        save () {
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/activity_types",Object.assign(this.editedItem)).then(response=>{
                this.close()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
                this.gris = false
            })
        },
    }
}
</script>