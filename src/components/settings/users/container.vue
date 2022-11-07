

<template>
    <div class="padding1" style="background:#f4f5fa; min-height:80vh;">  
        <!--v-card v-if="info==true" style="background:transparent;" class="elevation-0 pb-6 px-7">
            <v-card-text class="py-3 px-6" style="background:#1976d1; color:white; border-radius: 5px;">
                <v-icon color="white" small class="mr-2">mdi-information-outline</v-icon>
                Lorem ipsum dolor sit amet consectetur adipiscing elit massa imperdiet, mauris tortor platea fringilla sodales ac magna sociosqu, natoque non rutrum nec auctor vestibulum congue eget. 
                <v-icon style="position:absolute!important; top:7px; right:30px;" color="white" @click="info=false" small class="mr-2">mdi-close</v-icon>
            </v-card-text>
        </v-card--> 
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;">Usuarios
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="createDialog=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <v-data-table expand-icon :headers="headers" :items="users" class="elevation-0">
                <template slot="no-data">
                    No existen procedencias registradas.
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                    <strong :style="'color:'+item.color+';'"> {{item.name}} {{item.last}}</strong>
                </template>
                <template v-slot:[`item.job_position`]="{ item }">
                    {{item.job_position}} / {{item.sub_job_position}}
                </template>
                <template v-slot:[`item.status`]="{ item }">
                    {{status(item.status)}}
                </template>
                <template v-slot:[`item.permissions`]="{ item }">
                    <div style="min-width:200px!important;">
                        <v-chip x-small v-for="(permission,i) in item.permissions" :key="i" class="my-0 mx-1 px-1" color="primary" text-color="white">
                            {{permissionText(permission)}}
                        </v-chip>
                    </div>
                </template>
            </v-data-table>
            <v-dialog v-model="editDialog" max-width="600px">
                <editItem @closeDialogItem="closeDialogItem" v-bind:editedItem="editedItem"/>
            </v-dialog> 
            <v-dialog v-model="createDialog" max-width="600px">
                <createItem @closeDialogItem="closeDialogItem"/>
            </v-dialog> 

        </v-card>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>
<script>
import axios from "axios";
import editItem from "../users/edit"
import createItem from "../users/create"
export default {
    components: {
        'editItem':editItem,
        'createItem':createItem,
    },
    data:()=>({  
        editDialog:false,
        createDialog:false,
        info:true,
        editedItem:'',
        headers:[
            {text: 'Nombre', value: 'name'},
            {text: 'Puesto', value: 'job_position'},
            {text: 'Permisos', value: 'permissions'},
            {text: 'Email', value: 'email'},
            {text: 'Teléfono', value: 'phone'},
            {text: 'Estatus', value: 'status'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),
    computed:{
        currentUser(){
            return this.$store.state.currentUser.user
        },
        users:{
            get(){
                return this.$store.state.user.users;
            }
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
                {text: 'Editar Nominas', value: 'editPayRolls'},
                {text: 'Eliminar Nominas', value: 'deletePayRolls'},
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
        }
    },
    methods:{
        permissionText(value){
            return this.permissions.filter(permission=>permission.value==value).map(permission=>permission.text)[0]
        },
        status(status){
            if(status==1){
                return 'Activo'
            }else{
                return 'Inactivo'
            }
        },
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este usuario?')) {
                axios.delete(process.env.VUE_APP_BACKEND + "api/v1/user/delete/"+id).then(response => {
                    this.$store.dispatch('user/getUsers')
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                });
            }
        },
        edit(item){
            this.editedItem = item
            this.editDialog = true
        },
        closeDialogItem: function(params) {
            this.editDialog = params;
            this.createDialog = params;
            this.$store.dispatch('user/getUsers')
        },
    },
    created(){
        
    },
}
</script>