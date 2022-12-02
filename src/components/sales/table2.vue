<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterSales v-bind:company="company" @filtersSale="filtersSale"/>
        </v-navigation-drawer>
        <!-- Totalizadores -->
        <!--totals v-if="this.company==undefined"/-->
        <!--header-->
        <v-toolbar flat class="px-4 pt-3">
            <v-toolbar-title>
                Ventas
                <br/>
                <span style="font-size:12px; color:grey; position: absolute;" v-if="filterStorage()">Mes Actual</span>
            </v-toolbar-title>
            
            <v-btn icon class="ml-6 pt-2" v-if="filterStorageLength== undefined" @click="openFilter()">
                <v-icon>mdi-filter</v-icon>
            </v-btn>

             <v-btn icon class="ml-6" v-else @click="openFilter()">
                <v-badge overlap color="primary">
                    <template v-slot:badge>
                        {{filterStorageLength}}
                    </template>
                    <v-icon>mdi-filter</v-icon>
                </v-badge>
            </v-btn>
            <v-spacer/>
            <v-btn icon v-show="permissions('download')">
                <v-icon @click="exportExcel">mdi-download</v-icon>
            </v-btn>
        </v-toolbar>
        <!-- Tabla -->
        <v-data-table 
        height="600"
        fixed-header
        :footer-props="{'items-per-page-options':[15, 30, 50, salesLength]}"
        v-if="showTable && tableGraph"
        :headers="headers" 
        :items="sales"
        class="elevation-0 px-6 pb-4 pt-10"
        :options.sync="options"
        :server-items-length="totalSales"
        :loading="loading"
        :item-class="itemRowBackground">
            <template v-slot:[`item.printed`]="{ item }">
                <v-icon v-if="item.printed!=true" color="grey"> mdi-close </v-icon>
                <v-icon v-else color="primary"> mdi-check </v-icon>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.id)" v-show="permissions('editSales')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)" v-show="permissions('deleteSales')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>

                        <!--v-list-item @click="sendEmail(item.id)">
                            <v-icon small class="mr-2">
                                mdi-email
                            </v-icon>
                            Enviar Correo
                        </v-list-item-->
                        <!--v-list-item @click="printTicket(item)" v-show="permissions('printTicket')==true">
                            <v-icon small class="mr-2">
                                mdi-printer
                            </v-icon>
                            Imprimir ticket
                        </v-list-item-->
                    </v-list>
                </v-menu>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de ventas aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company_id`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company_id}}</v-list-item>
            </template>
            <!-- Recarga -->
            <template v-slot:[`item.pos_sale`]="{ item }">
                <v-icon v-if="item.pos_sale==true">mdi-check</v-icon>
                <v-icon v-else>mdi-close</v-icon>
            </template>
        </v-data-table>
        <!-- Crear venta -->
        <v-dialog v-model="createDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:message="[company, statusss]" @closeCreateDialogQuotation="closeCreateDialogQuotation"/>
        </v-dialog>
        <!-- Editar venta -->
        <v-dialog v-model="editDialog" max-width="900px">
          <edit v-bind:quotation="sale" @closeDialogEditQuotation="closeDialogEditQuotation"/>
        </v-dialog>
        <!-- Enviar email -->
        <v-dialog v-model="emailDialog" max-width="700px">
          <email v-bind:quotation="sale" @closeDialogEmailQuotation="closeDialogEmailQuotation"/>
        </v-dialog>
        <!-- Dialogo confirmación de eliminación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta venta?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteSale()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Dialogo confirmación de cambio de estatus -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet2" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas cambiar el estatus de esta cotización a "Cancelación"?
                    </div>
                    <v-btn class="mt-4" text color="primary" @click="confirmRejection()">
                    Si
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    No
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Motivo de Rechazo -->
        <v-dialog v-model="rejectionDialog" max-width="800px">
            <v-card class="px-12 pb-6 pt-8 elevtion-0" style="background-color:white;">
                Motivo de Rechazo:

                <v-autocomplete clearable v-model="editedItem.rejection_id" :items="rejectionsLists" label="Motivo de Cancelación" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen motivos relacionados.</template>                      
                </v-autocomplete>
                <v-textarea v-model="editedItem.rejection_comment" label="Descripcion"></v-textarea>

                <br>Inventario:<br>

                <v-list-item v-for="(item, i) in editedItem.items" :key="i" style="border-bottom:solid 1px grey;">
                    <v-list-item-content>
                        <span>{{item.quantity}} {{item.item.unit.name}} | {{item.item.name}}</span>
                    </v-list-item-content>
                    <v-list-item-action style="width:200px!important">
                        <v-select :items="merma" v-model="item.rejection_status" label="Merma/Devolción" x-small rounded dense outlined></v-select>
                    </v-list-item-action>
                </v-list-item>
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" class="mt-3" text @click="rejectionDialog=false">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" class="mt-3" text @click="saveRejection" :disabled="disbaledCancellation">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Editar detalle de venta -->
        <v-dialog v-model="editDialogDetail" max-width="650px">
          <edit-detail v-bind:editedDetail="editedDetail" @closeDialogEditDetail="closeDialogEditDetail"/>
        </v-dialog>
        <!-- Agregar detalle de venta -->
        <v-dialog v-model="addDialogDetail" max-width="650px">
          <add-detail v-bind:addDetail="addDetail" @closeDialogAddDetail="closeDialogAddDetail"/>
        </v-dialog>
        <v-dialog v-model="filterMobile" fullscreen hide-overlay transition="dialog-bottom-transition">
            <filterSales style="background:white;" v-bind:company="company" @filtersSale="filtersSale"/>
        </v-dialog>
    </v-container>
</template>

<script>
import Totals from "../sales/totals"
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../sales/filter"
import Create from "../quotations/create"
import Edit from "../quotations/edit"
//import Email from "../quotations/sendQuotation"
import EditDetail from "../sales/detail/edit"
import AddDetail  from "../sales/detail/create"
export default {
    props:{
        company:Object
    },
    components: {
        'filterSales':Filter,
        'create':Create,
        'edit':Edit,
        //'email':Email,
        'totals':Totals,
        'edit-detail':EditDetail,
        'add-detail':AddDetail
    }, 
    data: () => ({
        salesLength:0,
        filterMobile:false,
        editDialogDetail:false,
        addDialogDetail:false,
        editedDetail:'',
        addDetail:'',
        merma:['Merma', 'Devolución'],
        editedItem:{
            id:'',
            status:'',
            rejection_comment:'',
            rejection_id:'',
            items: [],
            last_updated_by_user_id:''
        },
        totals:'',
        editedBarSales:'',
        searchInput:'',
        tableGraph:true,
        showTable:true,
        totalSales: 0,
        sales: [],
        loading: true,
        options: {},
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
        statusss:'vendido',
        sale:'',
        invoiceDialog: false,
        sheet2: false,
        sheet: false,
        filters: false,
        emailDialog: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        rejectionDialog:false,
        deleteId:'',
        rejectionData:'',
        rejectionId:'',
        filterStorageLength:0,
        headers2:[
            { text: 'Codigo Macro', value: 'macro',},
            { text: 'Producto | Servicio', value: 'item',},
            { text: 'Cantidad', value: 'totalWeight',},
            { text: 'Precio Ajustado', value: 'price',},
            { text: 'Total', value: 'total',},
            { text: 'Costo Unitario', value: 'cost',},
            { text: 'Costo Total', value: 'total_cost',},
            { text: 'Utilidad Unitaria', value: 'utility_per_item',},
            { text: 'Utilidad Total', value: 'utility',},
            { value: 'actions', sortable: false, align: 'end', },
            
        ],
    }),
   
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    computed: {
        disbaledCancellation(){
            for(var i=0; i<this.editedItem.items.length; i++){
                if(this.editedItem.items[i].rejection_status==null){
                    return true
                }
            }
            return false
        },
        utilityPermission(){
            if(this.permissions('utility')){
                return {text: 'Utilidad', value:'utility'}
            }else{
                return false
            }
        },
        showCompany(){
            if(this.company == null){
                return { text: 'Empresa o Cliente', value: 'company_id',}
            }else{
                return false
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            return [
            { text: 'Folio', value: 'id' },
            this.showCompany,
            //{ text: 'Hora de Creación', value: 'created_at' },
            { text: 'Fecha de Activación', value: 'activation_date' },
            //{ text: 'Hora de Activación', value: 'activation_hour' },
            { text: 'Producto/Servicio', value: 'items' },
            //{ text: 'IMEI', value: 'imei' },
            //{ text: 'NIR', value: 'nir' },
            //{ text: 'SIM', value: 'sim' },
            //{ text: 'Paquete', value: 'sale_item_detail.category.name' },
            //{ text: 'Metodo de Pago', value: 'payment_method' },
            //{ text: 'Subtotal', value: 'subtotal' },
            //{ text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
            { text: 'Recarga', value: 'pos_sale' },
            { text: 'Usuario', value: 'user.name' },
            //{ text: 'Tipo de Usuario', value: 'user.job_position' },
            { text: 'Comentarios', value: 'description' },
            { text: 'Creación', value: 'created_at' },
            { text: 'Creador', value: 'created_by_user_id' },
            { text: 'Edición', value: 'updated_at' },
            { text: 'Editor', value: 'last_updated_by_user_id' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        rejectionsLists(){
            return this.$store.state.rejection.rejections;
        },
    },
    methods: { 
        rejectionSwitchLabel(value){
            if(value == null || value){
                return 'Devolución'
            }else{
                return 'Merma'
            }
        },
        rejection(item){
            this.editedItem.id = item.id
            this.editedItem.status = 'cancelled'
            this.editedItem.items = item.items
            this.rejectionDialog = true
        },
        saveRejection(){
            this.sheet2 = true
        },
        confirmRejection(){
            this.editedItem.last_updated_by_user_id = this.currentUser.id
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/sale/cancel",Object.assign(this.editedItem)).then(response=>{
                this.getDataFromApi()
                this.cancel()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        },
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.editedBarSales
                this.sales = data.items
                this.totalSales = data.total
                this.loading = false
            })
        },
        filterStorage(){
            if(localStorage.getItem('filtersSales')!=null){
                false
            }else{
                return true
            }
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersSalesLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = ''
                if(this.company!=undefined){
                    link = link + 'filter[client_id]='+this.company.id+'&'
                }

                if(localStorage.getItem('filtersSales')!=null){
                    link = link + JSON.parse(localStorage.getItem('filtersSales'))+'&'
                }else{
                    var startDate = []
                    var date = new Date()
                    startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    link = link + 'filter[date_between]='+startDate+'&'
                }
                axios.get(process.env.VUE_APP_BACKEND + "api/v1/sales?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    this.salesLength = response.data.meta.total
                    items = this.mapSales(response.data.data)
                    total = response.data.meta.total
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            axios
                            .get(process.env.VUE_APP_BACKEND + "api/v1/sales?" + link + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapSales(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }else{
                            axios
                            .get(process.env.VUE_APP_BACKEND + "api/v1/sales?" + link + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapSales(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }
                    }else{
                        resolve({
                            items,
                            total,
                        })
                    }
                })
            })
        },
        salesman(user){
            if(user!=undefined){
                if(user.last!=null){
                    return user.name + ' ' + user.last
                }else{
                    return user.name
                }
            }
        },
        mapSales(sales){
            sales = sales.map(id=>{
                return{
                    id:id.id,
                    company_id: this.nombre(id.client),
                    companyID: id.client.id,
                    created_at:new Date(id.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 18),
                    
                    pos_sale:id.pos_sale,
                    updated_at:new Date(id.updated_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 18),
                    user:id.user,
                    created_by_user_id:this.salesman(id.created_by_user_id),
                    last_updated_by_user_id:this.salesman(id.last_updated_by_user_id),

                    /*
                    delivery_address:id.client.delivery_address,
                    razon_social: id.client.razon_social,
                    direccion: id.client.address,
                    delivery_time: id.client.delivery_time,
                    */
                    
                    pdf:id.pdf,
                    description:id.description,
                    type:id.type,

                    subtotal:(this.subtotal(id.items)/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    total:(this.subtotal(id.items)*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    iva:(this.subtotal(id.items)*.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),    

                    invoice:id.invoice,
                    items:this.items(id.items),

                    activation_date:id.activation_date,
                    activation_hour:id.activation_hour,
                    //sale_item_detail.item,
                    //sale_item_detail.category.name,
                    imei:id.imei,
                    nir:id.nir,
                    sim:id.sim,
                    payment_method:id.payment_method,
                }
            });
            return sales
        },
        subtotal(items){
            var sum=0
            for(var i=0; i<items.length; i++){
                sum = sum + items[i].price*1
            }
            return sum
        },
        items(items){
            var respuesta=''
            for(var i=0; i<items.length; i++){
                respuesta = respuesta + items[i].cellular_plan.name
                if(i<(items.length-1)){
                    respuesta = respuesta + ', '
                }
            }
            return respuesta
        },
        nombre(empresa){
            if(empresa!=undefined){
                if(empresa.name == undefined || empresa.name == '' || empresa.name == null){
                    return empresa.razon_social
                }else{
                    return empresa.name
                }
            }
        },
        printTicket(item){
            axios.put(process.env.VUE_APP_BACKEND + "api/v1/quotation/print-sale",Object.assign(item)).then(response=>{
                localStorage.setItem('printTicket', item.id);
                window.open("/");
                this.$nextTick(() => {
                    if (this.options.sortBy.length === 1 && this.options.sortDesc.length === 1) {
                        if(this.options.sortDesc){
                            var sort = '-' + this.options.sortBy[0]
                            this.$store.dispatch('quotation/getSales', {'pageNumber':this.options.page, 'sort':sort})
                        }else{
                            var sort = this.options.sortBy[0]
                            this.$store.dispatch('quotation/getSales', {'pageNumber':this.options.page, 'sort':sort})
                        }
                        
                    }else{
                        this.$store.dispatch('quotation/getSales', {'pageNumber':this.options.page, 'sort':'id'})
                    }
                })
            })
        },
        itemRowBackground: function (item) {
            return item.status == 'cancelled' ? 'cancelled' : 'normal'
        },
        openFilter(){
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.filterMobile = true
            }else{
                if(this.filters == false){
                    this.$emit("closeDrawer", false);
                    this.filters = true
                }else{
                    this.$emit("closeDrawer", true);
                    this.filters = false
                }
            }
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
        filtersSale: function(params) {
            this.getDataFromApi()
            this.showTable = false
            this.filterMobile = false
            this.$nextTick(() => {
                this.showTable = true
            })
        },
        closeDialogEditQuotation: function(params) {
            this.editDialog = false;
            //this.$store.dispatch('quotation/getQuotations')
            this.getDataFromApi()
        },
        closeCreateDialogQuotation: function(params) {
            this.createDialog = false;
            //this.$store.dispatch('quotation/getQuotations')
            this.getDataFromApi()
        },
        closeDialogEmailQuotation: function(params) {
            this.emailDialog = false;
        },
        closeDialogEditDetail: function(params) {
            this.editDialogDetail = false
            this.getDataFromApi()
        },
        closeDialogAddDetail: function(params) {
            this.addDialogDetail = false
            this.getDataFromApi()
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.sales.filter(sale=>sale.status == 'vendido').map(id=>{
                return{
                    id:id.id,
                    empresa: id.company_id,
                    recarga: id.pos_sale,
                    fecha_programada: id.date,
                    serie: id.type,
                    subtotal: id.subtotal,
                    iva: id.iva,
                    total: id.total,
                    pagos: id.payments,
                    adeudo: id.due_balance,
                    saldo_vencido: id.past_due_balance,
                    factura: id.invoice,	
                    remisison: id.remission,	
                    status_de_pago:id.payment_status
                }
            }))
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Ventas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteSale(){
            axios.delete(process.env.VUE_APP_BACKEND + "api/v1/sales/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
        sendEmail (id) {
            this.sale = this.$store.state.quotation.quotations.filter(quotation=>quotation.id == id)[0]
            this.emailDialog = true
        },
        cancel(){
            this.editedItem={
                id:'',
                status:'',
                rejection_comment:'',
                rejection_id:'',
                items: [],
                last_updated_by_user_id:''
            },
            this.rejectionDialog = false
            this.sheet = false
            this.sheet2 = false
        },
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(id){
            axios.get(process.env.VUE_APP_BACKEND + "api/v1/sales?filter[id]=" + id).then(response => {
                this.sale = response.data.data.map(id=>{
                    return{
                        id:id.id,
                        client_id:this.existe(id.client),
                        pdf:id.pdf,
                        description:id.description,
                        items:id.items.map(item=>{return{
                            quantity:item.quantity,
                            cellular_plan_id:this.existe(item.cellular_plan),
                            value:item.value,
                            price:item.price,
                        }}),
                        pos_sale:id.pos_sale,
                        last_updated_by_user_id:this.existe(id.last_updated_by_user_id),
                        imei:id.imei,
                        nir:id.nir,
                        sim:id.sim,
                        payment_method_id:this.existe(id.payment_method),
                        activation_date:id.activation_date,
                        activation_hour:id.activation_hour,
                        subtotal: '',
                        user_id:this.existe(id.user),
                        client:id.client,
                        
                    }
                })[0]
                this.editDialog = true
            })
        },
        existe(item){
            if(item!=null){
                return item.id*1
            }else{
                return ''
            }
        },
        saveInvoice(){
            this.gris = true
            var edited = []
            for(var i=0; i<this.editedBarSales.length; i++){
                if(this.editedBarSales[i].invoice!=''&&this.editedBarSales[i].invoice_date!=null){
                    edited=edited.concat(this.editedBarSales[i])
                }
            }
            this.$nextTick(() => {
                axios.put(process.env.VUE_APP_BACKEND + "api/v1/quotation/bar-bulk-update",Object.assign(edited)).then(response=>{
                    this.$store.dispatch('quotation/getSales')
                    this.gris = false
                    this.searchInput = ''
                    this.invoiceDialog = false
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
                
            })
        },
        editDetail(id){
            axios.get(process.env.VUE_APP_BACKEND + 'api/v1/sale_items/' + id).then(response => {
                this.editedDetail = response.data
                this.editDialogDetail = true
            })
        },
        deleteDetail(id){
            axios.delete(process.env.VUE_APP_BACKEND + "api/v1/sale_items/" + id).then(response => {
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
    }
}
</script>
<style>
    .cancelled {
        background-color: #fff5d7
    }
    .normal {
        background-color: white
    }
    .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
        box-shadow: none!important;
        background: #f7f7f7;
    }
    .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%), 0px 1px 5px 0px rgb(0 0 0 / 0%)!important;
    }
    .v-data-footer {
        justify-content: flex-start!important;
        padding: 10px 0px 0px 30px!important;
    }
</style>