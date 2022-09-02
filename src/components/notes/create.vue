<template>
    <v-card>
        <v-card-title class="pb-0 pt-1" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span >Nueva Nota</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete v-if="permissions('assignNotes')" :rules="[v => !!v || 'Campo requerido']" clearable v-model="note.to_user_id" :items="usersLists" label="Vendedor" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else-if="note.to_user_id=currentUser.id" disabled v-model="note.to_user_id" :items="usersLists" label="Vendedor" item-text="name" item-value="id">                
                </v-autocomplete>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                        <v-autocomplete clearable v-model="note.company_id" :items="companyLists" label="Empresa" item-text="name" item-value="id">
                            <template slot="no-data"><div class="px-4 py-1">No existen empresas relacionadas. <v-btn rounded class="mx-3" color="primary" @click="createCompanyDialog=true" x-small>Crear</v-btn></div></template>                       
                        </v-autocomplete>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                        <v-autocomplete :disabled="note.company_id==null" clearable v-model="note.contact_id" :items="contactLists" label="Contacto" item-text="name" item-value="id">
                            <template slot="no-data"><div class="px-4 py-1">No existen contactos relacionados. <v-btn rounded class="mx-3" color="primary" @click="createContactDialog=true" x-small>Crear</v-btn></div></template>                   
                        </v-autocomplete>
                    </v-col> 
                </v-row>
                <v-container fluid>
                    <v-textarea v-model="note.comment" label="Descripcion"></v-textarea>
                </v-container>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" :loading="gris" :disabled="gris || !valid" text @click="save">
                Guardar
            </v-btn>
        </v-card-actions>

        <!-- Crear Contacto -->
        <v-dialog v-model="createContactDialog" max-width="600px">
            <createContact v-bind:company="note.company_id" @closeCreateDialogContact="closeCreateDialogContact"/>
        </v-dialog>
        <!-- Crear empresa -->
        <v-dialog v-model="createCompanyDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createCompany @closeCreateDialogCompany="closeCreateDialogCompany"/>
        </v-dialog>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from "axios";
import CreateContact from "../clients/contacts/create"
import CreateCompany from "../clients/companies/create"
    export default {
        components: {
            'createContact':CreateContact,
            'createCompany':CreateCompany,
        }, 
        props:{
            company:String
        },  
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris: false,
            createContactDialog: false,
            createCompanyDialog: false,
            note:{
                company_id:null,
                contact_id:'',
                from_user_id:'',
                to_user_id:'',
                comment:'',
                seen: false,
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
        }),
    computed: {
        valid(){
            if(this.note.to_user_id!=''&&this.note.to_user_id!=undefined&&this.note.to_user_id!=null){
                return true
            }else{
                return false
            }
        },
        companyLists(){
            return this.$store.state.company.companies;
        },
        contactLists(){
            return this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.note.company_id)
        }, 
        usersLists(){
            return this.$store.state.user.users;
        }, 
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        }    
    },
    mounted(){
        
    },
    created(){
        if(this.company!=undefined){
            this.note.company_id=Number(this.company)
        }
        
    },
    methods: {
        closeCreateDialogContact: function(params) {
            this.createContactDialog = params;
            this.$store.dispatch('contact/getContacts')
        },
        closeCreateDialogCompany: function(params) {
            this.createCompanyDialog = params;
            this.$store.dispatch('company/getCompanies')
        },
        permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        },
        close () {
            this.note = Object.assign({}, this.defaultItem)
            if(this.company!=undefined){
                this.note.company_id=Number(this.company)
            }
            this.gris = false
            this.$nextTick(() => {
                this.$emit("closeCreateDialogNote", false);
            })
        },
        save(){
            this.note.from_user_id = this.currentUser.id
            this.note.seen = false
            this.gris = true
            this.$nextTick(() => {
                axios.post("https://unowipes.com/api/v1/note/create",Object.assign(this.note)).then(response=>{
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
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
.v-picker__title.primary{
    display:none;
}
</style>