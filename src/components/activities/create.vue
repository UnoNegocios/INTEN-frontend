<template>
    <v-card>
        <v-card-title class="pb-0 pt-1" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4"> mdi-calendar</v-icon>
            <span >Nueva Actividad</span> 
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete v-if="permissions('assignActivities')" :rules="[v => !!v || 'Campo requerido']" clearable v-model="calendar.user_id" :items="usersLists" label="Vendedor" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else-if="calendar.user_id=currentUser.id" disabled v-model="calendar.user_id" :items="usersLists" label="Vendedor" item-text="name" item-value="id">                
                </v-autocomplete>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                        <v-autocomplete :rules="[v => !!v || 'Campo requerido']" clearable v-model="calendar.activity_type_id" :items="activityLists" label="Actividad" item-text="name" item-value="id">
                            <template slot="no-data" class="pa-2">No existen actividades relacionadas.</template>                      
                        </v-autocomplete>

                        <v-btn x-small v-if="clientType=='empresa'" @click="clientType='empresa', calendar.lead_id=''" color="primary" class="elevation-0" style="border-radius: 5px 0px 0px 5px;">Cliente</v-btn>
                        <v-btn x-small v-if="clientType!='empresa'" @click="clientType='empresa', calendar.lead_id=''" class="elevation-0" style="border-radius: 5px 0px 0px 5px;">Cliente</v-btn>
                        <v-btn x-small v-if="clientType=='prospecto'" @click="clientType='prospecto', calendar.client_id=''" color="primary" class="elevation-0" style="border-radius: 0px 5px 5px 0px;">Prospecto</v-btn>
                        <v-btn x-small v-if="clientType!='prospecto'" @click="clientType='prospecto', calendar.client_id=''" class="elevation-0" style="border-radius: 0px 5px 5px 0px;">Prospecto</v-btn>

                        <v-row v-if="clientType=='empresa'" class="mb-2 mt-0">
                            <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-autocomplete @keydown.enter="filter()" v-model="calendar.client_id" :items="companyLists" :loading="isLoadingCompany" :search-input.sync="searchCompanies" hide-no-data item-value="id" item-text="name" label="Empresa(s)" placeholder="Escribe para buscar" attach>
                                    <template v-slot:item="{item, attrs, on}">
                                        <v-list-item v-on="on" v-bind="attrs">
                                            <v-list-item-content>
                                                <v-list-item-title v-if="item.name!=null">
                                                    <span v-if="item.macro!=null">{{item.macro}}</span>{{item.name}}
                                                    <div v-if="item.razon_social!=null">
                                                        <span style="font-size:12px;">{{item.razon_social}}</span>
                                                    </div>
                                                </v-list-item-title>
                                                <v-list-item-title v-else-if="item.razon_social!=null">
                                                    {{item.razon_social}}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template> 
                                    <template slot="no-data"><div class="px-4 py-1">No existen empresas relacionadas. <v-btn rounded class="mx-3" color="primary" @click="createCompanyDialog=true" x-small>Crear</v-btn></div></template>                     
                                </v-autocomplete>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6" md="6">

                            <v-autocomplete :disabled="calendar.client_id==null" @keydown.enter="filter()" v-model="calendar.contact_id" :items="contactList" :loading="isLoadingContact" :search-input.sync="searchContacts" hide-no-data item-value="id" item-text="name" label="Contacto(s)" placeholder="Escribe para buscar" attach chips multiple>
                                <template v-slot:item="{item, attrs, on}">
                                    <v-list-item v-on="on" v-bind="attrs">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{item.name}} <span v-if="item.last!=undefined">{{item.last}}</span>
                                                <div>
                                                    <span style="font-size:12px;">{{item.company}}</span>
                                                </div>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template> 
                                <template slot="no-data"><div class="px-4 py-1">No existen contactos relacionados. <v-btn rounded class="mx-3" color="primary" @click="createContactDialog=true" x-small>Crear</v-btn></div></template>                    
                            </v-autocomplete>
                            </v-col>  
                        </v-row>  

                        <v-autocomplete v-else-if="clientType=='prospecto'" class="pt-0 mt-2 mb-2" :rules="[v => !!v || 'Campo requerido']" hide-no-data :loading="isLoadingLead" :search-input.sync="searchLeads" clearable v-model="calendar.lead_id" :items="leadLists" label="Prospecto" item-text="name" item-value="id" placeholder="Escribe para buscar" attach>
                            <template slot="no-data"><div class="px-4 py-1">No existen prospectos relacionados. </div></template>                     
                        </v-autocomplete>

                        <v-row>
                            <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="calendar.only_date" label="Fecha" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker color="primary" v-model="calendar.only_date" @input="datePicker = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-autocomplete clearable v-model="calendar.only_time" prepend-icon="mdi-clock-outline" :items="hours" label="Hora">               
                                </v-autocomplete>
                            </v-col>  
                        </v-row>  
                    </v-col>
                    <v-col class="pb-0 pt-2" cols="12" sm="6" md="6">
                        <v-container fluid>
                            <v-textarea v-model="calendar.description" label="Descripcion"></v-textarea>
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" :loading="gris" :disabled="valid || gris" text @click="save">
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
import CreateContact from "../clients/contacts/create"
import CreateCompany from "../clients/companies/create"
export default {
    components: {
        'createContact':CreateContact,
        'createCompany':CreateCompany,
    }, 
    props:{
        lead:Object,
        company:Object
    },
    data: () => ({
        clientType:'empresa',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
        createContactDialog: false,
        createCompanyDialog: false,
        timePicker:'',
        datePicker:'',
        calendar:{
            client_id:null,
            contact_id:'',
            activity_type_id:'',
            only_date:'',
            only_time:'',
            description:'',
            status:'pending',
            user_id:'',
            lead_id:''
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
        isLoadingCompany: false,
        isLoadingContact: false,
        isLoadingLead: false,
        searchCompanies: null,
        searchContacts: null,
        searchLeads: null,
        entries:{
            companies: [],
            contacts:[],
            leads:[]
        },
    }),
    watch: {
        searchLeads(val){
            if (this.leadLists.length > 0) return
            if (this.isLoadingLead) return
            this.isLoadingLead = true
            axios.get(process.env.VUE_APP_BACKEND + 'api/v1/lead/search?filter[name]='+val)
            .then(res => {
                this.entries.leads = res.data.data
            }).finally(() => (this.isLoadingLead = false))
        },
        searchCompanies(val){
            if (this.companyLists.length > 0) return
            if (this.isLoadingCompany) return
            this.isLoadingCompany = true
            axios.get(process.env.VUE_APP_BACKEND + 'api/v1/client/search?filter[name]='+val)
            .then(res => {
                this.entries.companies = res.data.data
            }).finally(() => (this.isLoadingCompany = false))
        },
        searchContacts(val){
            if (this.contactList.length > 0) return
            if (this.isLoadingContact) return
            this.isLoadingContact = true

            var length = this.calendar.client_id.length
            
            if(length>0){
                var filter = 'filter[client_id]='
                for(var i=0; i<length; i++){
                    filter = filter + this.calendar.client_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }else{
                        filter = filter + "&"
                    }
                }
            }else{
                var filter = ''
            }
            axios.get(process.env.VUE_APP_BACKEND + 'api/v1/contact/search?' + filter + "filter[name]=" + val)
            .then(res => {
                this.entries.contacts = res.data.data
            }).finally(() => (this.isLoadingContact = false))
        },
    },
    computed: {
        leadLists(){
            return this.entries.leads.map(id => {
                return{
                    id:id.id,
                    name:id.name,
                }
            })
        },
        companyLists(){
            return this.entries.companies.map(id => {
                return{
                    id:id.id,
                    name:id.name,
                    razon_social:id.razon_social
                }
            })
        },
        contactList(){
            return this.entries.contacts.map(id => {
                return{
                    id:id.id,
                    name:id.name + ' ' + id.last,
                    company:id.company.name,
                    job_position:id.job_position
                }
            })
        },
        valid(){
            if(((this.calendar.client_id!=''&&this.calendar.client_id!=undefined&&this.calendar.client_id!=null)||
                (this.calendar.lead_id!=''&&this.calendar.lead_id!=undefined&&this.calendar.lead_id!=null))&&
                (this.calendar.activity_type_id!=''&&this.calendar.activity_type_id!=undefined&&this.calendar.activity_type_id!=null)&&
                (this.calendar.only_date!=''&&this.calendar.only_date!=undefined&&this.calendar.only_date!=null)&&
                (this.calendar.only_time!=''&&this.calendar.only_time!=undefined&&this.calendar.only_time!=null)&&
                (this.calendar.user_id!=''&&this.calendar.user_id!=undefined&&this.calendar.user_id!=null)
            ){
                return false
            }else{
                return true
            }
        },
        hours(){
            var arr = [], i, j;
            for(i=0; i<24; i++) {
                for(j=0; j<4; j++) {
                    arr.push(this.cero(i) + ":" + (j===0 ? "00" : 15*j) + ":00");
                }
            }
            return arr
        },
        activityLists(){
            return this.$store.state.activity.activities;
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
    created(){
        this.$store.dispatch('activity/getActivities')
        if(this.lead!=undefined){
            this.clientType = 'prospecto'
        }
    },
    beforeUpdate(){
        if(this.company!=undefined && this.company!=null && this.company!=''){
            this.entries.companies.push(this.company)
            this.calendar.client_id=this.company.id
        }
        if(this.lead!=undefined && this.lead!=null && this.lead!=''){
            this.entries.leads.push(this.lead)
            this.calendar.lead_id=this.lead.id
        }
    },
    methods: {
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
        cero(i){
            if(i<10){
                return '0' + i
            }else{
                return i
            }
        },
        close () {
            this.calendar = Object.assign({}, this.defaultItem)
            if(this.company!=undefined){
                this.calendar.client_id=Number(this.company)
            }
            this.gris = false
            this.$nextTick(() => {
                this.$emit("closeCreateDialogCalendar", false);
            })
        },
        save(){
            this.gris = true
            this.calendar.date = this.calendar.only_date + ' ' + this.calendar.only_time
            this.$nextTick(() => {
                axios.post("https://unowipes.com/api/v1/activities",Object.assign(this.calendar)).then(response=>{
                    this.$nextTick(() => {
                        this.$emit("closeCreateDialogCalendar", response.data.data);
                    })
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