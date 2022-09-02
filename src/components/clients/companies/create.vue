<template>
    <v-card>
        <v-card-title class="pb-0 pt-3 pb-2" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-domain</v-icon>
            <span >Nuevo Cliente</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete v-if="permissions('assignCompanies')" outlined  dense clearable v-model="company.user_id" :items="usersLists" label="Vendedor*" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-stepper v-model="e1" class="elevation-0">
            <v-stepper-header class="elevation-0">
                <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 2" step="2"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step style="font-weight:bolder!important;" step="3"></v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <v-container>
                            <v-row>
                                <v-col cols="12" class="py-0" sm="4" md="4">
                                    <v-text-field prepend-inner-icon="mdi-domain" :rules="[v => !!v || 'Campo requerido']" v-model="company.name" label="Empresa o Cliente*"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="py-0" sm="4" md="4">
                                    <vue-tel-input-vuetify type="number" v-model="company.phone" label="Teléfono"></vue-tel-input-vuetify>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-text-field prepend-inner-icon="mdi-email" v-model="company.email" label="Correo Electrónico"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="py-4">
                                <v-col class="py-0" cols="12" sm="4" md="6">
                                    <v-autocomplete outlined class="mt-3" dense rounded filled :rules="[v => !!v || 'Campo requerido']" clearable v-model="company.origin_id" :items="originLists" label="Procedencia*" item-text="name" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen procedencias relacionadas.</template>                      
                                    </v-autocomplete>
                                </v-col>
                                <v-col class="py-0" cols="12" sm="4" md="6">
                                    <v-autocomplete outlined class="mt-3" dense rounded filled :rules="[v => !!v || 'Campo requerido']" clearable v-model="company.status_id" :items="statusLists" label="Estatus*" item-text="name" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen estatus relacionados.</template>                      
                                    </v-autocomplete>
                                </v-col>

                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
                <v-stepper-content step="2" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <strong>Condiciones Comerciales</strong>
                        <v-container>
                            <v-row class="mt-0">

                                    <v-text-field prepend-inner-icon="mdi-map-marker" v-model="company.delivery_address" label="Dirección de Entrega"></v-text-field>
                               
                                <v-row class="ma-0">
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-select outlined class="mt-3" dense clearable v-model="company.consumptions" :items="categoryLists" item-text="name" item-value="id" label="Categoría de Consumos" multiple>
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip style="max-width:80px;" class="mt-1" small v-if="index <= 1">
                                                <span class="text-truncate">{{ item.name }}</span>
                                            </v-chip>
                                            <span v-if="index === 1" class="grey--text text-caption mt-1">
                                            (+{{ company.consumptions.length - 2 }} más)
                                            </span>
                                        </template>
                                    </v-select>
                                    
                                    <v-textarea filled class="mt-4" v-model="company.opportunity_area" label="Area de Oportunidad"></v-textarea>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-text-field v-model="company.contact_medium" label="Medio de Contacto Preferido"></v-text-field>
                                    <v-textarea filled class="mt-4" v-model="company.special_note" label="Nota Especial"></v-textarea>
                                </v-col>

                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="company.contract_date" label="Fecha de Contrato" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker color="primary" v-model="company.contract_date" @input="datePicker = false"></v-date-picker>
                                        </v-menu>
                                    <v-textarea filled class="mt-4" v-model="company.delivery_time" label="Horario de Entrega"></v-textarea>
                                </v-col>
                            </v-row>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
                <v-stepper-content step="3" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <strong>Datos Fiscales</strong>
                        <v-container>
                            <v-row>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-text-field v-model="company.razon_social" label="Razon Social"></v-text-field>

                                    
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-text-field v-model="company.rfc" label="RFC"></v-text-field>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-text-field prepend-inner-icon="mdi-map-marker" v-model="company.address" label="Dirección Fiscal"></v-text-field>

                                    
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-autocomplete outlined class="mt-4" dense clearable v-model="company.cfdi" :items="cfdiLists" label="Uso de CFDI">
                                        <template slot="no-data" class="pa-2">No existen usos relacionados.</template>                      
                                    </v-autocomplete>
                                    <v-autocomplete outlined class="mt-2" dense clearable v-model="company.payment_method_id" :items="methodLists" label="Método de Pago" item-text="method" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen metodos relacionados.</template>                      
                                    </v-autocomplete>

                                    <v-text-field class="mt-0" v-model="company.bank_account_number" label="Numero de Cuenta"></v-text-field>
                                </v-col>
                                <v-col v-if="currentUser.job_position != 'vendedor'"  class="pt-0" cols="12" sm="4" md="8">
                                    <v-textarea filled class="mt-7"  v-model="company.payment_conditions" label="Condiciones de Pago"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-card-actions class="pr-6 pb-6">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-2" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1>1" @click="e1 = e1-1">
                <v-icon>mdi-chevron-left</v-icon>
                Regresar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1!=3" @click="e1 = e1+1" :disabled="grey">
                Siguiente
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn color="primary" class="px-3" @click="save" :loading="gris" :disabled="gris || grey">
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
        data: () => ({
            datePicker:false,
            days:['3', '15', '30', '45', '60', '90'],
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            e1: 1,
            fiscales:false,
            gris:false,
            company:{
                contract_date:'',
                delivery_time:'',
                user_id:'',
                origin_id:'',
                status_id:'',
                name:'',
                address:'',
                phone:'',
                email:'',
                rfc:'',
                razon_social:'',
                payment_method_id:'',
                payment_conditions:'',
                opportunity_area:'',
                consumptions:'',
                delivery_address:'',
                contact_medium:'',
                special_note:'',
                cfdi:'',
                bank_account_number:'',
                created_by_user_id:'',
                last_updated_by_user_id:''
                /*
                phase_id:'',
                city_id:'',
                number:'',
                type_id:'',
                frequency_id:'',
                price_list_id:'',
                zone_id:'',
                special_conditions:'',
                credit_limit:'',
                credit_days:'',
                */
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
    computed: {
        grey(){
            return false
            if( this.company.origin_id==''||this.company.origin_id==null||this.company.origin_id==undefined||
                //this.company.status_id==''||this.company.status_id==null||this.company.status_id==undefined||
                this.company.name==''||this.company.name==null||this.company.name==undefined){
                    return true
            }else{
                return false
            }
        },
        cfdiLists(){
            return ['G01 Adquisición de mercancías.',
                'G02 Devoluciones, descuentos o bonificaciones.',
                'G03 Gastos en general.',
                'I01 Construcciones.',
                'I02 Mobilario y equipo de oficina por inversiones.',
                'I03 Equipo de transporte.',
                'I04 Equipo de computo y accesorios.',
                'I05 Dados, troqueles, moldes, matrices y herramental.',
                'I06 Comunicaciones telefónicas.',
                'I07 Comunicaciones satelitales.',
                'I08 Otra maquinaria y equipo.',
                'D01 Honorarios médicos, dentales y gastos hospitalarios.',
                'D02 Gastos médicos por incapacidad o discapacidad.',
                'D03 Gastos funerales.',
                'D04 Donativos.',
                'D05 Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).',
                'D06 Aportaciones voluntarias al SAR.',
                'D07 Primas por seguros de gastos médicos.',
                'D08 Gastos de transportación escolar obligatoria.',
                'D09 Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.',
                'D10 Pagos por servicios educativos (colegiaturas).',
                'P01 Por definir.']
        },
        methodLists(){
            return this.$store.state.payment_method.payment_methods;
        },
        mediumLists(){
            return this.$store.state.contact_mode.contact_modes;
        },
        categoryLists(){
            return this.$store.state.category.categories;
        },
        conditionLists(){
            return this.$store.state.special_condition.special_conditions;
        },
        usersLists(){
            return this.$store.state.user.users;
        },
        originLists(){
            return this.$store.state.origin.origins;
        },
        statusLists(){
            return this.$store.state.status.statuses;
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        }
    },
    created(){
        this.$store.dispatch('currentUser/getUser')
        this.$store.dispatch('user/getUsers')
        this.$store.dispatch('origin/getOrigins')
        this.$store.dispatch('status/getStatuses')
        this.$store.dispatch('payment_method/getPaymentMethod')
        this.$store.dispatch('contact_mode/getContactModes')
        this.$store.dispatch('special_condition/getSpecialConditions')
        this.$store.dispatch('category/getCategories')
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
        close () {
            this.company = Object.assign({}, this.defaultItem)
            this.e1=1
            this.gris = false
            this.$nextTick(() => {
                this.$emit("closeCreateDialogCompany", false);
            })
        },
        save () {
            if(this.company.user_id==''||this.company.user_id==undefined||this.company.user_id==null){
                this.company.user_id = this.currentUser.id
            }
            this.company.created_by_user_id = this.currentUser.id
            this.company.last_updated_by_user_id = this.currentUser.id
            this.company.phone = (Number(this.company.phone.replace(/\s/g, ''))).toString()
            this.gris = true
            this.$nextTick(() => {
                axios.post("https://unowipes.com/api/v1/clients",Object.assign(this.company)).then(response=>{
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
.v-text-field__details{
    display: none !important;
}
</style>