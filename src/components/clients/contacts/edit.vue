<template>
    <v-card>
        <v-card-title class="py-3" >
            <span >Crear contacto</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col class="py-1" cols="12" sm="6" md="2">
                        <v-list-item-avatar>
                            <img src=process.env.VUE_APP_BACKEND + "files/default.jpg">
                        </v-list-item-avatar>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.name" label="Nombre"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.last" label="Apellido"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4">mdi-email-outline</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="10">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.email" label="Correo Electrónico"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4">mdi-phone-outline</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="10">
                        <vue-tel-input-vuetify :rules="[v => !!v || 'Campo requerido']" v-model="contact.phone" label="Teléfono"></vue-tel-input-vuetify>
                    </v-col>
                    <!--v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4">mdi-domain</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-autocomplete disabled v-model="contact.company_id" :items="companyLists" label="Empresa" item-text="name" item-value="id">               
                        </v-autocomplete>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.job_position" label="Puesto"></v-text-field>
                    </v-col-->
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="save" :loading="gris" :disabled="gris">
                Guardar
            </v-btn>
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
            contact:Object
        },
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
    computed: {
        companyLists(){
            return this.$store.state.company.companies;
        },
    },
    created(){
        this.$store.dispatch('company/getCompanies')
    },
    methods: {
        close () {
            this.gris = false
            this.$nextTick(() => {
                this.$emit("closeDialogEditContact", false);
            })
        },
        save () {
            this.contact.phone = Number(this.contact.phone.replace(/\s/g, ''))
            this.gris = true
            this.$nextTick(() => {
                axios.patch(process.env.VUE_APP_BACKEND + "api/v1/contacts/" + this.contact.id,Object.assign(this.contact)).then(response=>{
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
    },
}
</script>

<style lang="css" scoped>
    .v-text-field >>> label{
        font-size: 14px!important;
    }
</style>
<style>
    .v-text-field input{
        font-size: 14px!important;
    }
</style>