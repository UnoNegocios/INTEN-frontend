<template>
    <v-container style="max-width:100vw;">
        <!-- Header -->
        <v-toolbar class="px-6 py-4" flat >
            <v-toolbar-title>{{header}}</v-toolbar-title>
            <v-btn icon>
                <v-icon @click="openFilter()">mdi-filter</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <!--v-btn icon>
                <v-icon @click="exportExcel">mdi-download</v-icon>
            </v-btn-->
        </v-toolbar>
        <!-- Filters -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterLogs v-bind:company="company" @filtersLogs="filtersLogs"/>
        </v-navigation-drawer>
        <!-- Content -->
        <v-list class="px-6 py-4" three-line id="app">
            <template v-for="(activityLog, index, index2) in activityLogs">
                <v-list-item v-bind:key="index"> <!-- @click="" -->
                    <v-list-item-avatar class=" hidden-sm-and-down" >
                        <v-img v-if="activityLog.causer_id!=undefined" v-bind:src="'https://efibackend.unocrm.mx/files/' + avatar(activityLog.causer_id)"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="pt-4 mb-4" v-if="activityLog.description=='updated'">{{user(activityLog.causer_id)}} - Edición de {{spanish(activityLog.subject_type.slice(11,100))}}</v-list-item-title>
                        <v-list-item-title class="mb-4" v-else>{{user(activityLog.causer_id)}} - Alta de {{spanish(activityLog.subject_type.slice(11,100))}}</v-list-item-title>
                        <v-row>
                            <!-- Viejo -->
                            <v-col cols="12" md="6" v-if="(activityLog.properties.old!=null) && (activityLog.properties.old!='') && (activityLog.properties.old!=undefined)">
                                <v-list-item>
                                    <v-list-item-avatar>
                                        <v-icon color="red" style="float: right"> mdi-close </v-icon> 
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <!-- Fiscales -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.razon_social!=null) && (activityLog.properties.old.razon_social!='') && (activityLog.properties.old.razon_social!=undefined)"><strong>Razón Social: </strong>{{activityLog.properties.old.razon_social}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.rfc!=null) && (activityLog.properties.old.rfc!='') && (activityLog.properties.old.rfc!=undefined)"><strong>RFC: </strong>{{activityLog.properties.old.rfc}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.addres!=null) && (activityLog.properties.old.addres!='') && (activityLog.properties.old.addres!=undefined)"><strong>Direción: </strong>{{activityLog.properties.old.addres}}</v-list-item-subtitle>
                                        <!-- Datos de contacto -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.name!=null) && (activityLog.properties.old.name!='') && (activityLog.properties.old.name!=undefined)"><strong>Nombre: </strong>{{activityLog.properties.old.name}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.phone!=null) && (activityLog.properties.old.phone!='') && (activityLog.properties.old.phone!=undefined)"><strong>Teléfono: </strong>{{activityLog.properties.old.phone}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.email!=null) && (activityLog.properties.old.email!='') && (activityLog.properties.old.email!=undefined)"><strong>Correo Electrónico: </strong>{{activityLog.properties.old.email}}</v-list-item-subtitle>
                                        <!-- Foraneos -->
                                        <v-list-item class="px-0" style="min-height:0px!important; color:#666666!important; font-size:14px;" :to="{ path: '/clients/client/'+ activityLog.properties.attributes.company_id}" v-if="(activityLog.properties.old.company_id!=null) && (activityLog.properties.old.company_id!='') && (activityLog.properties.old.company_id!=undefined)"><strong>Empresa: </strong>{{companyName(activityLog.properties.old.company_id)}}</v-list-item>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.contact_id!=null) && (activityLog.properties.old.contact_id!='') && (activityLog.properties.old.contact_id!=undefined)"><strong>Contacto: </strong>{{contact(activityLog.properties.old.contact_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.user_id!=null) && (activityLog.properties.old.user_id!='') && (activityLog.properties.old.user_id!=undefined)"><strong>Vendedor: </strong>{{user(activityLog.properties.old.user_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.activity_id!=null) && (activityLog.properties.old.activity_id!='') && (activityLog.properties.old.activity_id!=undefined)"><strong>Actividad: </strong>{{activity(activityLog.properties.old.user_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.phase_id!=null) && (activityLog.properties.old.phase_id!='') && (activityLog.properties.old.phase_id!=undefined)"><strong>Rango de Consumo: </strong>{{phase(activityLog.properties.old.user_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.origin_id!=null) && (activityLog.properties.old.origin_id!='') && (activityLog.properties.old.origin_id!=undefined)"><strong>Origen: </strong>{{origin(activityLog.properties.old.user_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.status_id!=null) && (activityLog.properties.old.status_id!='') && (activityLog.properties.old.status_id!=undefined)"><strong>Estatus: </strong>{{status(activityLog.properties.old.status_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.rejection_id!=null) && (activityLog.properties.old.rejection_id!='') && (activityLog.properties.old.rejection_id!=undefined)"><strong>Motivo de Rechazo: </strong>{{rejection(activityLog.properties.old.rejection_id)}}</v-list-item-subtitle>
                                        <!-- Contactos -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.job_position!=null) && (activityLog.properties.old.job_position!='') && (activityLog.properties.old.job_position!=undefined)"><strong>Puesto: </strong>{{activityLog.properties.old.job_position}}</v-list-item-subtitle>
                                        <!-- Calendar -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.date!=null) && (activityLog.properties.old.date!='') && (activityLog.properties.old.date!=undefined)"><strong>Fecha y Hora: </strong>{{activityLog.properties.old.date}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.description!=null) && (activityLog.properties.old.description!='') && (activityLog.properties.old.description!=undefined)"><strong>Descripción: </strong>{{activityLog.properties.old.description}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.completed!=null) && (activityLog.properties.old.completed!='') && (activityLog.properties.old.completed!=undefined)"><strong>Realizado: </strong>
                                            <v-icon v-if="activityLog.properties.old.completed<=new Date() && activityLog.properties.old.completed==0" color="red"> mdi-close </v-icon>
                                            <v-icon v-else-if="(activityLog.properties.old.completed==1)" color="green"> mdi-check </v-icon>
                                            <v-icon v-else color="primary">  mdi-calendar-clock</v-icon>
                                        </v-list-item-subtitle>
                                        <!-- Venta -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.amount!=null) && (activityLog.properties.old.amount!='') && (activityLog.properties.old.amount!=undefined)"><strong>Valor: </strong>{{activityLog.properties.old.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.note!=null) && (activityLog.properties.old.note!='') && (activityLog.properties.old.note!=undefined)"><strong>Nota: </strong>{{activityLog.properties.old.note}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.old.status!=null) && (activityLog.properties.old.status!='') && (activityLog.properties.old.status!=undefined)"><strong>Estatus: </strong>{{activityLog.properties.old.status}}</v-list-item-subtitle>
                                        <v-list-item-subtitle class="pt-2" v-if="(activityLog.properties.old.amount!=null) && (activityLog.properties.old.amount!='') && (activityLog.properties.old.amount!=undefined)"><strong>PDF: </strong>
                                            <v-btn v-if="activityLog.properties.old.pdf!=undefined" v-bind:href="'https://efibackend.unocrm.mx/files/' + activityLog.properties.old.pdf" target="_blank" x-small text>
                                                <v-icon >mdi-file-pdf-outline</v-icon>
                                            </v-btn>
                                        </v-list-item-subtitle>
                                        <div class="pt-1" v-if="(activityLog.properties.old.items!=null) && (activityLog.properties.old.items!='') && (activityLog.properties.old.items!=undefined)">
                                            <v-list-item-subtitle> <strong>Productos|Servicios: </strong></v-list-item-subtitle>
                                            <template v-for="item in activityLog.properties.old.items">
                                                <v-list-item-subtitle v-bind:key="item.quantity">
                                                    {{item.quantity}}
                                                    {{items(item.item)}}
                                                    {{prices(item.item, item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                                </v-list-item-subtitle>
                                            </template>
                                        </div>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                            <!-- Nuevo -->
                            <v-col cols="12" md="6">
                                <v-list-item>
                                    <v-list-item-avatar>
                                        <v-icon color="primary" style="float: right" v-if="activityLog.description=='updated'"> mdi-refresh</v-icon>
                                        <v-icon color="green" v-else style="float: right"> mdi-plus</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content v-if="(activityLog.properties.attributes!=null) && (activityLog.properties.attributes!='') && (activityLog.properties.attributes!=undefined)">
                                        <!-- Fiscales -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.razon_social!=null) && (activityLog.properties.attributes.razon_social!='') && (activityLog.properties.attributes.razon_social!=undefined)"><strong>Razón Social: </strong>{{activityLog.properties.attributes.razon_social}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.rfc!=null) && (activityLog.properties.attributes.rfc!='') && (activityLog.properties.attributes.rfc!=undefined)"><strong>RFC: </strong>{{activityLog.properties.attributes.rfc}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.addres!=null) && (activityLog.properties.attributes.addres!='') && (activityLog.properties.attributes.addres!=undefined)"><strong>Direción: </strong>{{activityLog.properties.attributes.addres}}</v-list-item-subtitle>
                                        <!-- Datos de contacto -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.name!=null) && (activityLog.properties.attributes.name!='') && (activityLog.properties.attributes.name!=undefined)"><strong>Nombre: </strong>{{activityLog.properties.attributes.name}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.phone!=null) && (activityLog.properties.attributes.phone!='') && (activityLog.properties.attributes.phone!=undefined)"><strong>Teléfono: </strong>{{activityLog.properties.attributes.phone}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.email!=null) && (activityLog.properties.attributes.email!='') && (activityLog.properties.attributes.email!=undefined)"><strong>Correo Electrónico: </strong>{{activityLog.properties.attributes.email}}</v-list-item-subtitle>
                                        <!-- Foraneos -->
                                        <v-list-item class="px-0" style="min-height:0px!important; color:#666666!important; font-size:14px;"  v-if="(activityLog.properties.attributes.company_id!=null) && (activityLog.properties.attributes.company_id!='') && (activityLog.properties.attributes.company_id!=undefined)" :to="{ path: '/clients/client/'+ activityLog.properties.attributes.company_id}"><strong>Empresa: </strong>{{companyName(activityLog.properties.attributes.company_id)}}</v-list-item>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.contact_id!=null) && (activityLog.properties.attributes.contact_id!='') && (activityLog.properties.attributes.contact_id!=undefined)"><strong>Contacto: </strong>{{contact(activityLog.properties.attributes.contact_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.user_id!=null) && (activityLog.properties.attributes.user_id!='') && (activityLog.properties.attributes.user_id!=undefined)"><strong>Vendedor: </strong>{{user(activityLog.properties.attributes.user_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.activity_id!=null) && (activityLog.properties.attributes.activity_id!='') && (activityLog.properties.attributes.activity_id!=undefined)"><strong>Actividad: </strong>{{activity(activityLog.properties.attributes.user_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.phase_id!=null) && (activityLog.properties.attributes.phase_id!='') && (activityLog.properties.attributes.phase_id!=undefined)"><strong>Rango de Consumo: </strong>{{phase(activityLog.properties.attributes.user_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.origin_id!=null) && (activityLog.properties.attributes.origin_id!='') && (activityLog.properties.attributes.origin_id!=undefined)"><strong>Origen: </strong>{{origin(activityLog.properties.attributes.user_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.status_id!=null) && (activityLog.properties.attributes.status_id!='') && (activityLog.properties.attributes.status_id!=undefined)"><strong>Estatus: </strong>{{status(activityLog.properties.attributes.status_id)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.rejection_id!=null) && (activityLog.properties.attributes.rejection_id!='') && (activityLog.properties.attributes.rejection_id!=undefined)"><strong>Motivo de Rechazo: </strong>{{rejection(activityLog.properties.attributes.rejection_id)}}</v-list-item-subtitle>
                                        <!-- Contactos -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.job_position!=null) && (activityLog.properties.attributes.job_position!='') && (activityLog.properties.attributes.job_position!=undefined)"><strong>Puesto: </strong>{{activityLog.properties.attributes.job_position}}</v-list-item-subtitle>
                                        <!-- Calendar -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.date!=null) && (activityLog.properties.attributes.date!='') && (activityLog.properties.attributes.date!=undefined)"><strong>Fecha y Hora: </strong>{{activityLog.properties.attributes.date}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.description!=null) && (activityLog.properties.attributes.description!='') && (activityLog.properties.attributes.description!=undefined)"><strong>Descripción: </strong>{{activityLog.properties.attributes.description}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.completed!=null) && (activityLog.properties.attributes.completed!='') && (activityLog.properties.attributes.completed!=undefined)"><strong>Realizado: </strong>
                                            <v-icon v-if="activityLog.properties.attributes.completed<=new Date() && activityLog.properties.attributes.completed==0" color="red"> mdi-close </v-icon>
                                            <v-icon v-else-if="(activityLog.properties.attributes.completed==1)" color="green"> mdi-check </v-icon>
                                            <v-icon v-else color="primary">  mdi-calendar-clock</v-icon>
                                        </v-list-item-subtitle>
                                        <!-- Venta -->
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.amount!=null) && (activityLog.properties.attributes.amount!='') && (activityLog.properties.attributes.amount!=undefined)"><strong>Valor: </strong>{{activityLog.properties.attributes.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.note!=null) && (activityLog.properties.attributes.note!='') && (activityLog.properties.attributes.note!=undefined)"><strong>Nota: </strong>{{activityLog.properties.attributes.note}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="(activityLog.properties.attributes.status!=null) && (activityLog.properties.attributes.status!='') && (activityLog.properties.attributes.status!=undefined)"><strong>Estatus: </strong>{{activityLog.properties.attributes.status}}</v-list-item-subtitle>
                                        <v-list-item-subtitle class="pt-2" v-if="(activityLog.properties.attributes.amount!=null) && (activityLog.properties.attributes.amount!='') && (activityLog.properties.attributes.amount!=undefined)"><strong>PDF: </strong>
                                            <v-btn v-if="activityLog.properties.attributes.pdf!=undefined" v-bind:href="'https://efibackend.unocrm.mx/files/' + activityLog.properties.attributes.pdf" target="_blank" x-small text>
                                                <v-icon >mdi-file-pdf-outline</v-icon>
                                            </v-btn>
                                        </v-list-item-subtitle>
                                        <div class="pt-1" v-if="(activityLog.properties.attributes.items!=null) && (activityLog.properties.attributes.items!='') && (activityLog.properties.attributes.items!=undefined)">
                                            <v-list-item-subtitle> <strong>Productos|Servicios: </strong></v-list-item-subtitle>
                                            <template v-for="item in activityLog.properties.attributes.items">
                                                <v-list-item-subtitle v-bind:key="item.quantity">
                                                    {{item.quantity}}
                                                    {{items(item.item)}}
                                                    {{prices(item.item, item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                                </v-list-item-subtitle>
                                            </template>
                                        </div>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                        </v-row>
                        <v-list-item-subtitle class="text-lg-right"><v-icon right>mdi-calendar-clock </v-icon> {{new Date(activityLog.updated_at).toLocaleString()}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider v-bind:key="index2" :inset="true"></v-divider>
            </template>

            <v-row class="mt-2" justify="center">
                    <v-btn class="mb-6 mt-5" color="primary" v-if="limit<perro && limitefiltro==false" @click="limit = limit+20">Ver Más {{limit}} de {{perro}}</v-btn> 
                    <v-btn class="mb-6 mt-5" color="primary" v-if="limitFilter<perro && limitefiltro==true" @click="mas()">Ver Más {{limitFilter}} de {{perro}}</v-btn> 
            </v-row>
        </v-list>
    </v-container>
</template>

<script>
    import XLSX from 'xlsx';
    import Filter from "../activitylog/filter"
    export default {
        props:{
            company:String
        },
        components: {
            'filterLogs':Filter,
        }, 
        data: () => ({
            limitefiltro: false,
            filters: false,
            activityLogs:'',
            limit:20,
            limitFilter:20,
            perro:'',
        }),
        computed:{
            activityLogLists() {
                var respuesta = this.activityLogsss;
                this.perro = respuesta.length
                return this.limit ? respuesta.slice(0,this.limit) : this.respuesta
            },
            header(){
                this.activityLogs = this.activityLogLists
                return 'Bitacora'
            },
            activityLogsss(){
                var logssss = this.$store.state.log.logs//.filter(log=>log.causer_id == 3)
                if(this.company!=''&&this.company!=undefined&&this.company!=null){
                    return logssss.filter(log=>this.perrosss(log.properties.attributes) == this.company)
                }
                else{
                    return logssss  
                } 
            }
        },
        created(){
            this.$store.dispatch('log/getLogs')
            this.activityLogs = this.activityLogLists
        },
        methods:{
            perrosss(item){
                if(item!=undefined){
                    return item.company_id
                }
                else{
                    return ''
                }
            },
            openFilter(){
                if(this.filters == false){
                    this.$emit("closeDrawer", false);
                    this.filters = true
                }else{
                    this.$emit("closeDrawer", true);
                    this.filters = false
                }
            },
            spanish(text){
                switch(text){
                    case "User":
                        return 'Usuario'
                    break;
                    case "Quotation":
                        return 'Cotización'
                    break;
                    case "Calendar":
                        return 'Actividad'
                    break;
                    case "Contact":
                        return 'Contacto'
                    break;
                    case "Company":
                        return 'Empresa'
                    break;
                    case "Note":
                        return 'Nota'
                    break;
                    case "Adjustment":
                        return 'Ajuste'
                    break;
                    case "Collection":
                        return 'Cobranza'
                    break;
                    case "Expense":
                        return 'Gasto'
                    break;
                    case "Inventory":
                        return 'Inventario'
                    break;
                    case "Item":
                        return 'Producto'
                    break;
                    case "Payroll":
                        return 'Nomina'
                    break;
                    case "PhysicalInventory":
                        return 'Inventario Físico'
                    break;
                    case "Production":
                        return 'Producción'
                    break;
                    case "ProductionDetail":
                        return 'Detalle de Producción'
                    break;
                    case "ProductionOrder":
                        return 'Orden de Producción'
                    break;
                    case "ProviderPayment":
                        return 'Pago Provedor'
                    break;
                    case "Shipping":
                        return 'Envío'
                    break;
                    case "ShippingDetail":
                        return 'Detalle de Envío'
                    break;
                }
            },
            rejection(id){
                return this.$store.state.rejection.rejections.filter(rejection=>rejection.id == id).map(rejection=>rejection.name)[0]
            },
            user(id){
                return this.$store.state.user.users.filter(user=>user.id == id).map(user=>user.name + ' ' + user.last)[0]
            },
            avatar(id){
                return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.avatar)[0]
            },
            contact(id){
                return this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact => contact.name + ' ' + contact.last)[0]
            },
            companyName(id){
                return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
            },
            activity(id){
                return this.$store.state.activity.activities.filter(activity=>activity.id == id).map(activity => activity.type)[0]
            },
            items(id){
                return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.name)[0]
            },
            prices(id, quantity){
                return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.price)[0]*quantity
            },
            phase(id){
                return this.$store.state.phase.phases.filter(phase=>phase.id == id).map(phase => phase.name)[0]
            },
            status(id){
                return this.$store.state.status.statuses.filter(status=>status.id == id).map(status => status.name)[0]
            },
            origin(id){
                return this.$store.state.origin.origins.filter(origin=>origin.id == id).map(origin => origin.name)[0]
            },
            userID(element){
                if(element!=undefined){
                    return element.user_id
                }else{
                    return ''
                }
            },
            contactID(element){
                if(element!=undefined){
                    return element.contact_id
                }else{
                    return ''
                }
            },
            companyID(element){
                if(element!=undefined){
                    return element.company_id
                }else{
                    return ''
                }
            },
            filtersLogs: function(params) {
                this.limitFilter = 20
                this.activityLogs = ''
                var filterLog = this.activityLogsss
                if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
                    var uno = filterLog.filter(log=>this.companyID(log.properties.attributes) == params.company_id[0])
                    for(var i=1; i<params.company_id.length; i++){
                        uno=uno.concat(filterLog.filter(log=>this.companyID(log.properties.attributes) == params.company_id[i]))   
                    }
                    filterLog = this.removeDuplicates(uno, "id");
                }
                if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
                    var dos = filterLog.filter(log=>this.contactID(log.properties.attributes) == params.contact_id[0])
                    for(var i=1; i<params.contact_id.length; i++){
                        dos=dos.concat(filterLog.filter(log=>this.contactID(log.properties.attributes) == params.contact_id[i]))   
                    }
                    filterLog = this.removeDuplicates(dos, "id");
                }
                if(params.salesmen!=''&&params.salesmen!=undefined&&params.salesmen!=null){
                    var tres = filterLog.filter(log=>this.userID(log.properties.attributes) == params.salesmen[0])
                    for(var i=1; i<params.salesmen.length; i++){
                        tres=tres.concat(filterLog.filter(log=>this.userID(log.properties.attributes.user_id) == params.salesmen[i]))   
                    }
                    filterLog = this.removeDuplicates(tres, "id");
                }
                if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                    var cuatro = filterLog.filter(log=>log.causer_id == params.user_id[0])
                    for(var i=1; i<params.user_id.length; i++){
                        cuatro=cuatro.concat(filterLog.filter(log=>log.causer_id == params.user_id[i]))   
                    }
                    filterLog = this.removeDuplicates(cuatro, "id");
                }
                if(params.type!=''&&params.type!=undefined&&params.type!=null){
                    var cinco = filterLog.filter(log=>log.subject_type.includes(params.type[0]))
                    for(var i=1; i<params.type.length; i++){
                        cinco=cinco.concat(filterLog.filter(log=>log.subject_type.includes(params.type[i])))   
                    }
                    filterLog = this.removeDuplicates(cinco, "id");
                }
                if(params.what.create==false){
                    filterLog=filterLog.filter(log=>log.description == 'updated')
                }
                if(params.what.update==false){
                    filterLog=filterLog.filter(log=>log.description == 'created')
                }
                if(params.dateFrom!='' && params.dateFrom!=null && params.dateFrom!=undefined){
                    filterLog=filterLog.filter(log=>new Date(log.created_at) > new Date(params.dateFrom))
                }
                if(params.dateTo!='' && params.dateTo!=null && params.dateTo!=undefined){
                    var dateTwo = new Date(new Date(params.dateTo).setDate(new Date(params.dateTo).getDate() + 1))
                    filterLog=filterLog.filter(log=>new Date(log.created_at) <= dateTwo)
                }

                
                this.activityLogsStore = filterLog
                
                this.activityLogs = this.activityLogsStore.slice(0,this.limitFilter)

                this.limitefiltro = true 

                //this.limit ? filterLog.slice(0,this.limit) : this.respuesta
            },
            mas(){
                this.limitFilter = this.limitFilter+20
                var respuesta = this.activityLogsStore;
                this.perro = respuesta.length
                this.activityLogs = this.limitFilter ? respuesta.slice(0,this.limitFilter) : this.respuesta
            },
            removeDuplicates(originalArray, prop) {
                var newArray = [];
                var lookupObject  = {};
                for(var i in originalArray) {
                    lookupObject[originalArray[i][prop]] = originalArray[i];
                }
                for(i in lookupObject) {
                    newArray.push(lookupObject[i]);
                }
                return newArray;
            },
            exportExcel: function () {
                let data = XLSX.utils.json_to_sheet(this.activityLogLists)
                const workbook = XLSX.utils.book_new()
                const filename = 'Bitacora del '
                XLSX.utils.book_append_sheet(workbook, data, filename)
                XLSX.writeFile(workbook, `${filename}.xlsx`)
            },
        },
        mounted () {

        }
    }
</script>