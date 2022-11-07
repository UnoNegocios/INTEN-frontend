<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Editar Rango de Consumo
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-12">
                <!--v-col cols="12" sm="6" md="3"-->
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedPhase.name" label="Rango de Consumo"></v-text-field>
                <!--/v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedPhase.days" label="Dias"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-select :rules="[v => !!v || 'Campo requerido']" v-model="editedPhase.status_id" :items="status" label="Estatus"></v-select>
                </v-col>
                <v-col class="pt-5" cols="12" sm="6" md="4">
                    <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                        <template v-slot:activator="{ on }">
                            <v-chip class="ma-2" :color="editedPhase.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color</v-chip>
                        </template>
                        <v-color-picker :rules="[v => !!v || 'Campo requerido']" v-model="editedPhase.color" class="ma-2"></v-color-picker>
                    </v-menu> 
                </v-col-->
            </v-row>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text :loading="gris" :disabled="gris || !valid" @click="save">Guardar</v-btn>
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
        editedPhase:Object
    },
    data:()=>({  
        valid: true,
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
    created(){
        this.$store.dispatch('status/getStatuses')
    },
    computed:{
        status:{
            get(){
                return this.$store.state.status.statuses;
            }
        },
    },
    methods:{
        close () {
            this.gris = false
            this.$emit("closeDialogPhase", false);
        },
        save () {
            axios.put(process.env.VUE_APP_BACKEND + "api/v1/client_phases",Object.assign(this.editedPhase)).then(response=>{
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