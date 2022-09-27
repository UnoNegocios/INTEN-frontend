<template>
    <v-card>
        <v-card-title class="py-2">
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span>Nuevo Prospecto</span>
            <v-spacer></v-spacer>
            <v-autocomplete  :rules="[v => !!v || 'Campo requerido']" v-if="permissions('assignLeads')" clearable v-model="lead.user_id" :items="usersList" label="Vendedor" item-text="name" item-value="id">
                <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
            </v-autocomplete>
            <v-autocomplete v-else-if="lead.user_id=currentUser.id" disabled v-model="lead.user_id" :items="usersList" label="Vendedor" item-text="name" item-value="id">                
            </v-autocomplete>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">

            <v-row class="ma-0">
                <v-col class="pt-0" cols="12" sm="6" md="6">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" required v-model="lead.name" label="Nombre"></v-text-field>
                </v-col>
                <v-col class="pt-0" cols="12" sm="6" md="6">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" required v-model="lead.last" label="Apellido"></v-text-field>
                </v-col> 
            </v-row>

            <v-row class="ma-0">
                <v-col class="pt-0" cols="12" sm="6" md="6">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" required v-model="lead.phone" type="phone" label="Teléfono"></v-text-field>
                </v-col>
                <v-col class="pt-0" cols="12" sm="6" md="6">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" required v-model="lead.email" type="email" label="Correo Electrónico"></v-text-field>
                </v-col> 
            </v-row>

            <v-row class="ma-0">
                <v-col class="pt-0" cols="12" sm="6" md="4">
                    <v-autocomplete clearable v-model="lead.funnel_id" :items="funnelsList" label="Funnel" item-text="name" item-value="id">
                        <template slot="no-data" class="pa-2">No existen funnels relacionados.</template>
                    </v-autocomplete>
                </v-col>
                <v-col class="pt-0" cols="12" sm="6" md="4">
                    <v-autocomplete clearable v-model="lead.funnel_phase_id" :items="funnelPhasesList" label="Fase" item-text="name" item-value="id">
                        <template slot="no-data" class="pa-2">No existen fases relacionadas.</template>                      
                    </v-autocomplete>
                </v-col>
                <v-col class="pt-0" cols="12" sm="6" md="4">
                    <v-autocomplete clearable v-model="lead.status_id" :items="statusesList" label="Status">
                        <template slot="no-data" class="pa-2">No existen status relacionados.</template>                      
                    </v-autocomplete>
                </v-col>
            </v-row>

        </v-card-text>
        <v-card-actions>
            <v-spacer class="hidden-md-and-down"></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="save" :loading="loadingSave" :disabled="diasbledSave">
                Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import axios from "axios"
export default {
    data() {
        return {
            lead:{
                user_id:'',
                name:'',
                last:'',
                phone:'',
                email:'',
                funnel_id:'',
                funnel_phase_id:'',
                status_id:'',
                channel:'Carga Manual'
            },
            loadingSave:false,
            diasbledSave:true
        }
    },
    computed:{
        usersList(){
            return this.$store.state.user.users
        },
        funnelsList(){
            return this.$store.state.funnel.funnels
        },
        funnelPhasesList(){
            return this.$store.state.funnel.phases
        },
        statusesList(){

        },
        currentUser(){
            return this.$store.state.currentUser.user
        },
    },
    beforeUpdate(){
        if(this.lead.user_id!=''&&
            this.lead.name!=''&&
            this.lead.last!=''&&
            this.lead.phone!=''&&
            this.lead.email!=''&&
            this.lead.funnel_id!=''&&
            this.lead.funnel_phase_id!=''){
            this.diasbledSave = false
        }
    },
    methods:{
        save(){
            this.loadingSave = true
            this.$nextTick(() => {
                if(this.lead.user_id==''&& this.lead.user_id==null){
                    this.lead.user_id = this.currentUser.id
                }
                axios.post("https://unowipes.com/api/v1/leads",Object.assign(this.lead)).then(response=>{
                    console.log('1')
                    this.close()
                })
            })
        },
        close(){
            console.log('2')
            this.$emit("closeCreateDialogLead", this.lead);
            this.lead = Object.assign({}, this.defaultItem);
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
    }
}
</script>
