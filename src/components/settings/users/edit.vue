<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Crear Usuario
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-stepper v-model="e1" class="elevation-0">
                <v-stepper-header class="elevation-0">
                    <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step style="font-weight:bolder!important;" step="2"></v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content step="1" class="pt-0">
                        <v-row class="py-3 px-6">
                            <v-col cols="12" sm="6" md="6">
                                <v-select v-model="editedItem.job_position" :items="positions" label="Área"></v-select>
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre"></v-text-field>
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.email" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-select :disabled="editedItem.job_position==''||editedItem.job_position==null||editedItem.job_position==undefined" v-model="editedItem.sub_job_position" :items="subPositions" label="Puesto"></v-select>
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.last" label="Apellido"></v-text-field>
                                <v-text-field v-model="editedItem.phone" label="Teléfono"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" type="password" v-model="editedPassword" label="Contraseña"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="8" class="pt-1">
                                <v-select v-if="currentUser.id == 1" v-model="editedItem.permissions" :items="permissions" item-text="text" item-value="value"  chips label="Permisos" multiple></v-select>
                                <v-select v-else v-model="editedItem.rol" :items="rolls" item-text="text" item-value="value" label="Permisos"></v-select>
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="2" class="pt-0">
                        <v-card-text class="pb-0 pt-0">
                            <strong>Datos de Empleado</strong>
                            <v-container>
                                <v-row class="mt-0">
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field clearable required v-model="editedItem.entry_date" label="Fecha de Ingreso" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker color="primary" v-model="editedItem.entry_date" @input="datePicker = false"></v-date-picker>
                                            </v-menu>
                                            <v-menu v-model="datePicker2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field clearable required v-model="editedItem.birth_date" label="Fecha Nacimiento" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker color="primary" v-model="editedItem.birth_date" @input="datePicker2 = false"></v-date-picker>
                                            </v-menu>
                                            <v-text-field v-if="lower(editedItem.sub_job_position)" type="number" clearable required v-model="editedItem.goal_amount" label="Meta de Venta" prepend-icon="mdi-currency-usd"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-menu v-model="datePicker3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field clearable required v-model="editedItem.departure_date" label="Fecha de Salida" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker color="primary" v-model="editedItem.departure_date" @input="datePicker3 = false"></v-date-picker>
                                            </v-menu>
                                            <v-text-field clearable required v-model="editedItem.daily_salary" label="Sueldo Diario" prepend-icon="mdi-currency-usd" type="number"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-form>
        <v-card-actions class="pt-4">
            <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                <template v-slot:activator="{ on }">
                    <v-chip class="ma-2 mt-0" :color="editedItem.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color Calendario</v-chip>
                </template>
                <v-color-picker :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.color" class="ma-2"></v-color-picker>
            </v-menu> 
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text  v-if="e1>1" @click="e1 = e1-1">
                <v-icon>mdi-chevron-left</v-icon>
                Regresar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1!=2" @click="e1 = e1+1">
                Siguiente
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
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
        editedItem:Object
    },
    data:()=>({
        datePicker: false,
        datePicker2: false,
        datePicker3: false,
        e1: 1, 
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
        editedPassword:'',
        editedRol:'',
        positions:[
            'Administración',
            'Almacén',
            'Chofer Ejecutivo',
            'Chofer Repartidor',
            'Comercial',
            'Dirección',
            'Producción',
            'Sistemas',
        ],
        disable:'',
        valid: true,
        rules: {
            required: value => !!value || 'Campo requerido',
        },
        createCategory:{
            name:'',
        },
    }),
    computed:{
        subPositions(){
            if(this.editedItem.job_position == 'Administración'){
                return ['Asistente dirección','Contabilidad']
            }else if(this.editedItem.job_position == 'Almacén'){
                return ['Calidad','Logística', 'Montacargas']
            }else if(this.editedItem.job_position == 'Comercial'){
                return ['Cobranza','Compras', 'Ecommerce','Publicidad','Ventas', 'Ventas Industria']
            }else if(this.editedItem.job_position == 'Producción'){
                return ['App','Trapo',]
            }
        },
        rolls(){
            return [
                {text: 'Director Comercial', value: 'director_comercial'},
                {text: 'Vendedor Cuentas Clave', value: 'vendedor_cuentas_clave'},
                {text: 'Vendedor General', value: 'vendedor_general'},
            ]
        },
        permissions(){
            return [
                {text: 'Acceso a Empresas', value: 'companies'},
                {text: 'Ver Empresas', value: 'viewCompanies'},//director comercial y vendedor general
                {text: 'Editar Empresas', value: 'editCompanies'},//director comercial
                {text: 'Eliminar Empresas', value: 'deleteCompanies'},//director comercial
                {text: 'Asignar Empresas', value: 'assignCompanies'},//vendedor general y director comercial
                {text: 'Reasignar Empresas', value: 'reassignCompanies'},//director comercial
                
                {text: 'Ver Contactos', value: 'viewContacts'},
                {text: 'Editar Contactos', value: 'editContacts'},
                {text: 'Eliminar Contactos', value: 'deleteContacts'},

                {text: 'Acceso a Cotizaciones', value: 'quotations'},
                {text: 'Ver Cotizaciones', value: 'viewQuotations'},
                {text: 'Editar Cotizaciones', value: 'editQuotations'},
                {text: 'Eliminar Cotizaciones', value: 'deleteQuotations'},
                {text: 'Asignar Cotizaciones', value: 'assignQuotations'},

                {text: 'Acceso a Cancelaciones', value: 'cancelations'},
                {text: 'Ver Cancelaciones', value: 'viewCancelations'},
                {text: 'Editar Cancelaciones', value: 'editCancelations'},
                {text: 'Eliminar Cancelaciones', value: 'deleteCancelations'},
                {text: 'Asignar Cancelaciones', value: 'assignCancelations'},

                {text: 'Acceso a Ventas', value: 'sales'},
                {text: 'Ver Ventas', value: 'viewSales'},
                {text: 'Editar Ventas', value: 'editSales'},
                {text: 'Eliminar Ventas', value: 'deleteSales'},
                {text: 'Asignar Ventas', value: 'assignSales'},
                {text: 'Imprimir Ticket', value: 'printTicket'},

                //compras calendario a proveedores
                //agenda para administracion
                {text: 'Acceso a Actividades', value: 'activities'},
                {text: 'Ver Actividades', value: 'viewActivities'},
                {text: 'Editar Actividades', value: 'editActivities'},
                {text: 'Eliminar Actividades', value: 'deleteActivities'},
                {text: 'Asignar Actividades', value: 'assignActivities'},

                //macro solo admin cobranza
                {text: 'Acceso a Cobranzas', value: 'collections'},
                {text: 'Ver Cobranzas', value: 'viewCollections'},
                {text: 'Editar Cobranzas', value: 'editCollections'},
                {text: 'Eliminar Cobranzas', value: 'deleteCollections'},
                //{text: 'Asignar Cobranzas', value: 'assignCollections'},
                
                {text: 'Acceso a Envíos', value: 'shippings'},
                {text: 'Ver Envíos', value: 'viewShippings'},
                {text: 'Editar Envíos', value: 'editShippings'},
                {text: 'Eliminar Envíos', value: 'deleteShippings'},
                //{text: 'Asignar Envíos', value: 'assignShippings'},
                {text: 'Imprimir Envíos', value: 'printShippings'},

                {text: 'Acceso a Ordenes de Envío', value: 'shipping_details'},
                {text: 'Ver Ordenes de Envío', value: 'viewShippingDetails'},
                {text: 'Editar Ordenes de Envío', value: 'editShippingDetails'},
                {text: 'Eliminar Ordenes de Envío', value: 'deleteShippingDetails'},
                //{text: 'Asignar Ordenes de Envío', value: 'assignShippingDetails'},

                {text: 'Acceso a Gastos', value: 'expenses'},
                {text: 'Ver Gastos', value: 'viewExpenses'},
                {text: 'Editar Gastos', value: 'editExpenses'},
                {text: 'Eliminar Gastos', value: 'deleteExpenses'},
                //{text: 'Asignar Gastos', value: 'assignExpenses'},

                {text: 'Acceso a Nominas', value: 'pay_rolls'},
                {text: 'Ver Nominas', value: 'viewPayRolls'},
                {text: 'Editar Nominas', value: 'editPayrolls'},
                {text: 'Eliminar Nominas', value: 'deletePayrolls'},
                {text: 'Imprimir Nominas', value: 'printPayrolls'},
                //{text: 'Asignar Nominas', value: 'assignPayRolls'},

                {text: 'Acceso a Compras', value: 'shoppings'},
                {text: 'Ver Compras', value: 'viewShoppings'},
                {text: 'Editar Compras', value: 'editShoppings'},
                {text: 'Eliminar Compras', value: 'deleteShoppings'},
                //{text: 'Asignar Compras', value: 'assignShoppings'},

                {text: 'Acceso a Detalle de Compras', value: 'shopping_details'},
                {text: 'Ver Detalle de Compras', value: 'viewShoppingDetails'},
                {text: 'Editar Detalle de Compras', value: 'editShoppingDetails'},
                {text: 'Eliminar Detalle de Compras', value: 'deleteShoppingDetails'},
                //{text: 'Asignar Detalle de Compras', value: 'assignShoppingDetails'},

                {text: 'Acceso a Solicitud de Compras', value: 'shopping_orders'},
                {text: 'Ver Solicitud de Compras', value: 'viewShoppingOrders'},
                {text: 'Editar Solicitud de Compras', value: 'editShoppingOrders'},
                {text: 'Eliminar Solicitud de Compras', value: 'deleteShoppingOrders'},
                //{text: 'Asignar Solicitud de Compras', value: 'assignShoppingOrders'},

                {text: 'Acceso a Proveedores', value: 'provider_payments'},
                {text: 'Ver Pagos a Proveedores', value: 'viewProviderPayments'},
                {text: 'Editar Pagos a Proveedores', value: 'editProviderPayments'},
                {text: 'Eliminar Pagos a Proveedores', value: 'deleteProviderPayments'},
                //{text: 'Asignar Pagos a Proveedores', value: 'assignProviderPayments'},

                {text: 'Acceso a Producción', value: 'productions'},
                {text: 'Ver Producción', value: 'viewProductions'},
                {text: 'Editar Producción', value: 'editProductions'},
                {text: 'Eliminar Producción', value: 'deleteProductions'},
                //{text: 'Asignar Producción', value: 'assignProductions'},

                {text: 'Acceso a Detalle de Producción', value: 'production_details'},
                {text: 'Ver Detalle de Producción', value: 'viewProductionDetails'},
                {text: 'Editar Detalle de Producción', value: 'editProductionDetails'},
                {text: 'Eliminar Detalle de Producción', value: 'deleteProductionDetails'},
                //{text: 'Asignar Detalle de Producción', value: 'assignProductionDetails'},

                {text: 'Acceso a Solicitud de Producción', value: 'production_orders'},
                {text: 'Ver Solicitud de Producción', value: 'viewProductionOrders'},
                {text: 'Editar Solicitud de Producción', value: 'editProductionOrders'},
                {text: 'Eliminar Solicitud de Producción', value: 'deleteProductionOrders'},
                //{text: 'Asignar Solicitud de Producción', value: 'assignProductionOrders'},

                {text: 'Acceso a Ajustes', value: 'adjustments'},
                {text: 'Ver Ajustes', value: 'viewAdjustments'},
                {text: 'Editar Ajustes', value: 'editAdjustments'},
                {text: 'Eliminar Ajustes', value: 'deleteAdjustments'},
                //{text: 'Asignar Ajustes', value: 'assignAdjustments'},

                {text: 'Acceso a Inventario Físico', value: 'physical_inventories'},
                {text: 'Ver Inventario Físico', value: 'viewPhysicalInventories'},
                {text: 'Editar Inventario Físico', value: 'editPhysicalInventories'},
                {text: 'Eliminar Inventario Físico', value: 'deletePhysicalInventories'},
                //{text: 'Asignar Inventario Físico', value: 'assignPhysicalInventories'},

                {text: 'Acceso a Grabaciones de Llamada', value: 'viewCallRecords'},

                {text: 'Acceso a Catálogos', value: 'catalogs'},
                {text: 'Acceso a Inventario', value: 'inventory'},
                {text: 'Reportes de Inventario', value: 'report_inventory'},
                {text: 'Eliminar Reportes de Inventario', value: 'delete_inventory_reports'},
                {text: 'Acceso a Usuarios', value: 'users'},
                {text: 'Acceso a Bitacoras', value: 'activityLog'},//sin acceso
                {text: 'Acceso a Reportes', value: 'reports'},
                {text: 'Descargar Excel', value: 'download'},//nadie 

                {text: 'Acceso a LLamadas', value: 'calls'},
                {text: 'Ver LLamadas', value: 'viewCalls'},

                {text: 'Acceso a Mensajes', value: 'messages'},
                {text: 'Ver Mensajes', value: 'viewMesages'},

                {text: 'Acceso a Caja', value: 'ferreteria'},

                {text: 'Asignar Notas', value: 'assignNotes'},

                {text: 'Acceso a Pedidos', value: 'orders'},

                {text: 'Acceso a Saldos Vencidos', value: 'balances'},

                 {text: 'Acceso a Utilidades', value: 'utilities'},

                {text: 'Ajuste de Costos', value: 'costs'}
            ]
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
    },
    methods:{
        lower(item){
            if(item!=undefined){
                if(item.toLowerCase().includes('venta')){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        },
        close () {
            this.gris = false
            this.e1= 1
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            axios.put("https://unowipes.com/api/v1/user/update",Object.assign(this.editedItem)).then(response=>{
                if(this.editedPassword!=''&&this.editedPassword!=undefined&&this.editedPassword!=null){
                    var newPass = this.editedItem
                    newPass.password = this.editedPassword
                    axios.put("https://unowipes.com/api/v1/user/password",Object.assign(newPass)).then(response=>{
                        if(this.editedRol!=''&&this.editedRol!=undefined&&this.editedRol!=null){
                            this.editedItem.permissions = this.rol(this.editedRol)
                            axios.put("https://unowipes.com/api/v1/user/update",Object.assign(this.editedItem)).then(response=>{
                                this.editedRol=''
                                this.close()
                            }).catch(error => {
                                this.snackbar = {
                                    message: error.response.data.message,
                                    color: 'error',
                                    show: true
                                }
                                this.gris = false
                            })
                        }else{
                            this.close()
                        }
                    })
                }else{
                    if(this.editedRol!=''&&this.editedRol!=undefined&&this.editedRol!=null){
                        this.editedItem.permissions = this.rol(this.editedRol)
                        axios.put("https://unowipes.com/api/v1/user/update",Object.assign(this.editedItem)).then(response=>{
                            this.editedRol=''
                            this.close()
                        }).catch(error => {
                            this.snackbar = {
                                message: error.response.data.message,
                                color: 'error',
                                show: true
                            }
                            this.gris = false
                        })
                    }else{
                        this.close()
                    }
                }
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
                this.gris = false
            })
        },
        rol(rol){
            if(rol == 'director_comercial'){
                return [
                'companies',
                'viewCompanies',
                'editCompanies',
                'deleteCompanies',
                'assignCompanies',
                'reassignCompanies',
                
                'contacts',
                'viewContacts',
                'editContacts',
                'deleteContacts',
                'assignContacts',

                'quotations',
                'viewQuotations',
                'editQuotations',
                'deleteQuotations',
                'assignQuotations',

                'cancelations',
                'viewCancelations',
                'editCancelations',
                'deleteCancelations',
                'assignCancelations',

                'sales',
                'viewSales',
                'editSales',
                'deleteSales',
                'assignSales',

                'activities',
                'viewActivities',
                'editActivities',
                'deleteActivities',
                'assignActivities',

                'collections',
                'viewCollections',
                'editCollections',
                'deleteCollections',
                'assignCollections'
            ]}else if(rol == 'vendedor_cuentas_clave'){
                return [
                'companies',
                'contacts',
                'quotations',
                'cancelations',
                'sales',
                'activities',
                'collections',
            ]}else if(rol == 'vendedor_general'){
                return [
                'companies',
                'viewCompanies',
                'assignCompanies',
                
                'contacts',
                'viewContacts',
                'assignContacts',

                'quotations',
                'viewQuotations',
                'assignQuotations',

                'cancelations',
                'viewCancelations',
                'assignCancelations',

                'sales',
                'viewSales',
                'assignSales',

                'activities',
                'viewActivities',
                'assignActivities',

                'collections',
                'viewCollections',
                'assignCollections'
            ]}
        }
    }
}
</script>