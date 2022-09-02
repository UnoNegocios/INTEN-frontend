<template>
    
    <v-list-item three-line>
        <v-list-item-content>
            <!-- Header -->
            <div class="overline mb-2">
                Contactos
                <!-- Crear -->
                <v-dialog v-model="createDialog" max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" style="font-size:12px; float:right;" height="24px" rounded outlined>Crear</v-btn>
                    </template>
                    <create v-bind:company="client" @closeCreateDialogContact="closeCreateDialogContact"/>
                </v-dialog>
            </div>
            <!-- Content -->
            <div class="ma-0 pa-1" v-for="(contact,c) in contacts" :key="c">
                <v-menu :nudge-width="250" :close-on-content-click="false"  offset-x>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on" style="font-size:16px;" class="my-2"><v-icon style="transform:translatey(-2px); margin-right:5px;">mdi-account</v-icon>{{contact.name}} {{contact.last}}</span>
                    </template>
                    <v-card>
                        <v-list>
                            <v-list-item>
                                <v-list-item-avatar>
                                    <img src="https://unowipes.com/files/default.jpg">
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>{{contact.name}} {{contact.last}}</v-list-item-title>
                                    <v-list-item-subtitle>{{contact.job_position}}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <div>
                                        <v-btn icon class="mr-4" @click="deleteItem(contact.id)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                        <v-btn icon @click="editItem(contact.id)">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </div>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                        <v-divider></v-divider>
                        <v-row class="pa-4">
                            <v-col cols="12" md="5">
                                <span @click="whatsapp(contact.phone)" style="font-size:14px; color:#1f88fe; cursor: pointer;"><v-icon small color="#1f88fe" class="mr-2">mdi-phone</v-icon>{{contact.phone}}</span>
                            </v-col>
                            <v-col cols="12" md="7">
                                <span v-bind:href="'mailto:'+contact.email" style="font-size:14px; color:#1f88fe; cursor: pointer;"><v-icon small color="#1f88fe" class="mr-2">mdi-email</v-icon>{{contact.email}}</span>
                            </v-col> 
                        </v-row>
                    </v-card>
                </v-menu>
            </div>
        </v-list-item-content>
        <!-- Editar -->
        <v-dialog v-model="editDialog" max-width="700px">
          <edit v-bind:contact="contact" @closeDialogEditContact="closeDialogEditContact"/>
        </v-dialog>
        <!-- confirmación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar este contacto?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteContact()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-list-item>
</template>

<script>
import axios from "axios";
import Create from "../contacts/create"
import Edit from "../contacts/edit"
export default {
    props:{
        client:Object
    },
    components: {
        'create':Create,
        'edit':Edit,
    }, 
    data (){
        return{
            company:'',
            contact:'',
            editDialog: false,
            createDialog: false,
            deleteId:'',
            sheet: false,
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            contacts:[]
        }
    },
    mounted(){
        this.apiCall().then(response => {
            this.contacts = response
        })
    },
    methods:{
        apiCall () {
            return new Promise((resolve, reject) => {
                axios.get("https://unowipes.com/api/v1/contacts?filter[client_id]=" + this.client.id).then(response => {
                    resolve(response.data.data.map(id=>{
                        return{
                            id:id.id,
                            name:id.name,
                            last:id.last,
                            email:id.email,
                            phone:id.phone,
                            client_id:id.client.id,
                            client:id.client
                        }
                    }))
                })
            })
        },
        editItem(id){
            this.contact = this.contacts.filter(contact=>contact.id == id)[0]
            this.contact.phone = this.contact.phone.toString()
            this.editDialog = true
        },
        closeDialogEditContact: function(params) {
            this.editDialog = params;
        },
        closeCreateDialogContact: function(params) {
            this.createDialog = params;
        },
        deleteItem (id) {
            this.deleteId = id
            this.sheet = true
        },
        deleteContact(){
            axios.delete("https://unowipes.com/api/v1/contact/delete/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.$store.dispatch('contact/getContacts')
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
        },
        whatsapp(phone){
            if( /Android|iPhone|BlackBerry/i.test(navigator.userAgent) ) {
                var link = "https://wa.me/521"+phone
                location.replace(link, '_blank')
            }else if(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){
                var link = "https://web.whatsapp.com/send?phone=521"+phone
                location.replace(link, '_blank')
            }else{
                var link = "https://web.whatsapp.com/send?phone=521"+phone
                window.open(link, '_blank')
            }
        }
    },
    created(){
        
    }
}
</script>

<style>

</style>