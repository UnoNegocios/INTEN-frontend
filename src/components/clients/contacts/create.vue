<template>
    <v-card>
        <v-card-title class="py-3" >
            <span >Nuevo contacto</span> 
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col class="pt-2 pb-0" cols="12" sm="6" md="2">
                        <v-list-item-avatar class="ml-2">
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
                        <v-icon class="pa-4" color="primary">mdi-email-outline</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="10">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.email" label="Correo Electrónico"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4" color="primary">mdi-phone-outline</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="10">
                        <vue-tel-input-vuetify :rules="[v => !!v || 'Campo requerido']" type="number" v-model="contact.phone" label="Teléfono"></vue-tel-input-vuetify>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4" color="primary">mdi-domain</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field disabled v-model="company.name"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.job_position" label="Puesto"></v-text-field>
                    </v-col>
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
            company:Object
        },
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            contact:{
                name:'',
                last:'',
                phone:'',
                email:'',
                company_id:'',
                job_position:'',
                user_id:''
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
    computed: {
        companyLists(){
            return [this.company];
        }
    },
    methods: {
        close () {
            this.gris = false
            this.contact = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeCreateDialogContact", false);
            })
        },
        save(){
            this.contact.user_id = this.company.user.id
            this.contact.company_id = this.company.id
            this.contact.phone = (Number(this.contact.phone.replace(/\s/g, ''))).toString()
            this.gris = true
            this.$nextTick(() => {
                axios.post(process.env.VUE_APP_BACKEND + "api/v1/contacts",Object.assign(this.contact))
                .then(response => {
                    this.close()
                })
                .catch(error => {
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
.v-text-field input, .v-label {
    font-size: 14px;
}
</style>