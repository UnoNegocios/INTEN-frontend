<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterQuotations v-bind:company="company" @filtersQuotation="filtersQuotation"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table show-expand :headers="headers" :items="quotations" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Cotizaciones</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon v-show="permissions('download')">
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            
            <!-- Footer -->
            <template v-slot:footer>
                <v-container style="margin-bottom:-67px!important;">
                    <v-select :items="sumavg" v-model="totalType" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <v-select :items="campos" v-model="campo" item-text="text" item-value="value" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <strong v-if="totalType=='sum'">Total = {{ sumField(campo) }}</strong>
                    <strong v-if="totalType=='avg'">Promedio = {{ avgField(campo) }}</strong>
                </v-container>
            </template> 

            <template v-slot:[`item.total`]="{ item }">
                {{item.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.subtotal`]="{ item }">
                {{item.subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.iva`]="{ item }">
                {{item.iva.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.payments`]="{ item }">
                {{item.payments.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.debt`]="{ item }">
                {{item.debt.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
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
                        <v-list-item @click="editItem(item.id)"  v-show="permissions('editQuotations')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)"  v-show="permissions('deleteQuotations')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                        <v-list-item @click="sendEmail(item.id)">
                            <v-icon small class="mr-2">
                                mdi-email
                            </v-icon>
                            Enviar Correo
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Creación -->
            <template v-slot:[`item.created_at`]="{ item }">
                {{item.created_at.slice(0, 10)}}
            </template>
            <!-- Actualización -->
            <template v-slot:[`item.updated_at`]="{ item }">
                {{item.updated_at.slice(0, 10)}}
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de cotiaciones aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company}}</v-list-item>
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.pos_sale`]="{ item }">
                <v-icon v-if="item.pos_sale==true">mdi-check</v-icon>
                <v-icon v-else>mdi-close</v-icon>
            </template>
            <!-- Detalle PC -->
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <v-row class="pa-6">
                        <v-col cols="12" sm="6" md="6">
                            <v-data-table :headers="headers2" :items="item.items" v-if="item.items!=undefined" class="elevation-0" style="background: #f7f7f7;!important" dense>
                                <template v-slot:[`item.item`]="{ item }">
                                    {{ items(item.item) }}
                                </template>
                                <template v-slot:[`item.value`]="{ item }">
                                    {{ item.value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}
                                </template>
                                <template v-slot:[`item.price`]="{ item }">
                                    {{ (item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }} 
                                </template>
                                <template v-slot:[`item.total`]="{ item }">
                                    {{ (item.price*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}
                                </template>
                                <template v-slot:[`item.weight`]="{ item }">
                                    {{ calcWeight(item.item) }} kg
                                </template>
                                <template v-slot:[`item.totalWeight`]="{ item }">
                                    {{ calcWeight(item.item)*item.quantity }} kg
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" class="px-6">
                            <div class="px-4 py-3" style="background-color:#ffedb3; border-radius: 0px 10px 10px 10px; min-height:120px;" >
                                <strong>Notas:</strong><br>
                                <span>{{item.note}}</span>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="1">
                            <v-btn v-if="item.pdf!=undefined" v-bind:href="process.env.VUE_APP_BACKEND + 'files/' + item.pdf" target="_blank" text style="margin:auto; display:block;">
                                PDF:
                                <br>
                                <v-icon >mdi-file-pdf-outline</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                            <!-- Boton Cerrado -->   
                            <v-btn outlined rounded color="green" class="mb-4" @click="confirmStatus(item.id, 'vendido')" style="font-size:12px; height:30px!important; margin-left: auto; margin-right: auto; display: block;">Cerrado</v-btn>
                            <!-- Boton Cancelado -->   
                            <v-btn outlined rounded color="red" class="mt-4" @click="rejection(item.id)" style="font-size:12px; height:30px!important; margin-left: auto; margin-right: auto; display: block;">Cancelado</v-btn>
                        </v-col>
                    </v-row>
                </td>
            </template>
            <!-- Monto >
            <template v-slot:[`item.total`]="{ item }">
                {{item.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template-->
        </v-data-table>
        <!-- Crear quotation -->
        <v-dialog v-model="createDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:message="[company, statusss]" @closeCreateDialogQuotation="closeCreateDialogQuotation"/>
        </v-dialog>
        <!-- Editar quotation -->
        <v-dialog v-model="editDialog" max-width="650px">
          <edit v-bind:quotation="quotation" @closeDialogEditQuotation="closeDialogEditQuotation"/>
        </v-dialog>
        <!-- Enviar email -->
        <v-dialog v-model="emailDialog" max-width="700px">
          <email v-bind:quotation="quotation" @closeDialogEmailQuotation="closeDialogEmailQuotation"/>
        </v-dialog>
        <!-- Dialogo confirmación de eliminación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta cotizaión?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteQuotation()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Dialogo confirmación de estatus -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet2" inset>
                <v-sheet class="text-center" height="210px">
                    <v-row class="pt-6" v-if="statusData=='vendido'">
                        <v-col class="pt-0" cols="12" sm="6" md="4">
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6" md="4">
                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                <template v-slot:activator="{ on }">
                                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="programing_date" label="Fecha Programada" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="primary" v-model="programing_date" @input="datePicker = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6" md="4">
                        </v-col>
                    </v-row>
                    <div class="pt-6">
                    ¿Seguro que deseas cambiar el estatus de esta cotización a {{statusData}}?
                    </div>
                    <v-btn class="mt-4" :disabled="programing_date=='' && statusData=='vendido'" text color="primary" @click="status()">
                    Si
                    </v-btn>
                    <v-btn class="mt-4" text color="red" @click="cancel()">
                    No
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Motivo de Rechazo -->
        <v-dialog v-model="rejectionDialog" max-width="400px">
            <div class="px-12 py-6" style="background-color:white;">
                Motivo de Rechazo: 
                <v-autocomplete clearable v-model="rejectionId" :items="rejectionsLists" label="Motivo de Cancelación" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen motivos relacionados.</template>                      
                </v-autocomplete>
                <v-textarea v-model="rejectionData" label="Descripcion"></v-textarea>
                <v-btn color="blue darken-1" text @click="rejectionDialog=false">
                    Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="confirmStatus(statusId, 'cancelado')">
                    Guardar
                </v-btn>
            </div>
        </v-dialog>
        
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import moment from 'moment';
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../quotations/filter"
import Create from "../quotations/create"
import Edit from "../quotations/edit"
import Email from "../quotations/sendQuotation"
export default {
    props:{
        company:String
    },
    components: {
        'filterQuotations':Filter,
        'create':Create,
        'edit':Edit,
        'email':Email,
    }, 
    data: () => ({
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        campo:'total',
        campos:[
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
        ],
        totalType:'sum',
        sumavg:['sum', 'avg'],
        datePicker:false,
        programing_date:'',
        statusss:'quotation',
        statusData:'',
        statusId:'',
        quotation:'',
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
        quotations: '',
        headers2:[
            { text: 'Cantidad', value: 'quantity',},
            { text: 'Peso', value: 'weight',},
            { text: 'Peso Total', value: 'totalWeight',},
            { text: 'Producto | Servicio', value: 'item',},
            //{ text: 'Valor', value: 'value',},
            { text: 'Precio Ajustado', value: 'price',},
            { text: 'Total', value: 'total',},
        ]
    }),
    computed: {
        showCompany(){
            if(this.company == null){
                return { text: 'Empresa', value: 'company',}
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
            this.quotations = this.quotationsLists
            return [
            { text: '', value: 'data-table-expand' },
            { text: 'Folio', value: 'id' },
            //{ text: 'Fecha Programada', value: 'date' },
            this.showCompany,
            { text: 'Contacto', value: 'contact' },

            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
            //{ text: 'Pagos', value: 'payments' },
            //{ text: 'Adeudo', value: 'debt' },
            //{ text: 'Saldo Vencido', value: 'expired_debt'},

            { text: 'Lista de Precios', value: 'priceList' },
            //{ text: 'Estatus', value: 'status' },
            //{ text: 'Estatus de Pago', value: 'paymentStatus' },
            //{ text: 'Fecha Factura', value: 'invoice_date' },
            //{ text: 'Fecha de Vencimiento', value: 'expiration' },
            { text: 'Recarga', value: 'bar' },
            //{ text: 'Peso', value: 'kg' },
            { text: 'Fecha de Entrega', value: 'delivery' },
            //{ text: 'Serie', value: 'type' },
            //{ text: 'Factura', value: 'invoice' },
            //{ text: 'Impresa', value: 'printed' },
            //{ text: 'Días Factura', value: 'invoiceDays' },
            //{ text: 'Días Vencido', value: 'expirationDays' },
            { text: 'Vendedor', value: 'salesman' },
            { text: 'Creación', value: 'created_at' },
            { text: 'Creador', value: 'created_by_user_id' },
            { text: 'Edición', value: 'updated_at' },
            { text: 'Editor', value: 'last_updated_by_user_id' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        quotationsLists(){
            var quotations = this.$store.state.quotation.only_quotations
            if(this.company!='' && this.company!=undefined && this.company!=null){
                quotations = quotations.filter(quotation=>quotation.company_id == this.company)
            }
            quotations = quotations.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    total:id.total,//.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    pdf:id.pdf,
                    note:id.note,
                    serie:id.serie,
                    bar:id.pos_sale,
                    //date:id.date.slice(0, 10),
                    type:id.type,
                    items:id.items,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                    subtotal:id.subtotal,//.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    iva:id.iva,//.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),                    
                    invoice:id.invoice,
                    printed:id.printed,
                    created_by_user_id:this.salesman(id.created_by_user_id),
                    last_updated_by_user_id:this.salesman(id.last_updated_by_user_id),
                    priceList:this.priceList(id.company_id),
                    kg:this.weight(id.items),
                    delivery:this.delivery(id.id),
                    expiration:this.expiration(id.invoice_date, id.company_id),
                    invoice_date:id.invoice_date,
                    invoiceDays:this.invoiceDays(id.invoice_date),
                    expirationDays:this.expirationDays(id.invoice_date, id.company_id),
                    payments:this.payments(id.id),//.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    debt:this.debt(id.total, id.id),//.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    expired_debt:this.expired_debt(id.id, id.total, id.invoice_date, id.company_id).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    paymentStatus:this.paymentStatus(id.id, id.total, id.invoice_date, id.company_id),
                    status:this.statuses(id.id, id.pos_sale, id.total, id.company_id),
                }
            });
            return quotations
        },
        rejectionsLists(){
            return this.$store.state.rejection.rejections;
        },
        quotationsList(){
            return this.$store.state.quotation.only_quotations
        }
    },
    created () {
        this.quotations = this.quotationsLists   
    },
    methods: {
        sumField(key) {//suma
            // sum data in give key (property)
            var suma=this.quotations.reduce((a, b) => a + (b[key] || 0), 0)
            return suma.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
        },
        avgField(key){//primedio
            var suma=this.quotations.reduce((a, b) => a + (b[key] || 0), 0)
            return (suma/this.quotations.length).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
        },
        statuses(id, bar, total, companyId){
            if(bar==true){
                return 'Recarga'
            }else if(new Date(this.delivery(id)) > new Date()){
                return 'Por entregar'
            }else if(this.debt(total, id)<1){
                return 'Pagado'
            }else if(this.$store.state.company.companies.filter(company=>company.id == companyId).map(company=>company.credit_days)[0]==0){
                return 'Por cobrar'
            }else{
                return 'En plazo de crédito'
            }
        },
        paymentStatus(id, total, invoice_date, company_id){
            if(this.expirationDays(invoice_date, company_id)){
                return 'Vencida'
            }
            else if(this.debt(total, id)<1){
                return 'Pagada'
            }
            else{
                return 'En credito'
            }
            
        },
        contiene(sales, id){
            var khe = sales.filter(sale=>sale.id == id)
            if(khe.length>0){
                return true
            }else{
                return false
            }
        },
        payments(id){
            var collections = this.$store.state.collection.collections
            .filter(collection=>this.contiene(collection.salesID, id))
            .map(collection=>collection.salesID)

            if(collections.length>0){
                var respuesta = 0
                for(var i=0; i<collections.length; i++){
                    for(var j=0; j<collections[i].length; j++){
                        if(collections[i][j].id == id){
                            respuesta = respuesta + collections[i][j].amount
                        }
                    }
                }
                return respuesta
            }else{
                return 0
            }
        },
        debt(total, id){
            return ((total*1) - (this.payments(id)*1))
        },
        expired_debt(id, total, invoice_date, company_id){
            if(this.expirationDays(invoice_date, company_id)){
                return this.debt(total, id)
            }else{
                return 0
            }
        },
        invoiceDays(invoice_date){
            if(invoice_date!=undefined){
                return moment(new Date()).diff(moment(new Date(invoice_date)), 'days')
            }
        },
        expirationDays(invoice_date, company_id){
            var credit_days = this.$store.state.company.companies.filter(company=>company.id == company_id).map(company=>company.credit_days)[0]
            var invoice_days = this.invoiceDays(invoice_date)
            if(invoice_days>credit_days){
                return ((invoice_days*1)-(credit_days*1))
            }
        },
        expiration(date, companyId){
            if(date!=undefined){
                var credit_days = this.$store.state.company.companies.filter(company=>company.id == companyId).map(company=>company.credit_days)[0]
                return moment(date, "YYYY-MM-DD").add(credit_days, 'days').format().slice(0, 10);
            }
        },
        delivery(id){
            var shipping_id = this.$store.state.shipping_detail.shipping_details.filter(detail=>detail.sale_id == id).map(detail=>detail.shipping_id)[0]
            var date = this.$store.state.shipping.shippings.filter(shipping=>shipping.id == shipping_id).map(shipping=>shipping.date)[0]
            if(date!=undefined){
                return date
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
        rejection(id){
            this.statusId = id
            this.rejectionDialog = true
        },
        confirmStatus(id, status){
            this.statusId = id
            this.statusData = status
            this.sheet2 = true
        },
        status(){
            var editedItem = this.quotationsList.filter(quotation=>quotation.id == this.statusId)[0]
            editedItem.date = this.programing_date
            editedItem.status = this.statusData
            editedItem.rejection_id = this.rejectionId
            editedItem.rejection_comment = this.rejectionData
            editedItem.last_updated_by_user_id = this.currentUser.id
            var joel = editedItem.items
            this.$nextTick(() => {
                axios.put(process.env.VUE_APP_BACKEND + "api/v1/quotation/update",Object.assign(editedItem)).then(response=>{
                    if(this.statusData == 'vendido'){
                        for(var i=0; i<joel.length; i++){
                            var inventario = {
                                created_by_user_id: this.currentUser.id,
                                type: 'Salida Venta',
                                item_id: joel[i].item,
                                quantity: joel[i].quantity,
                            }
                            this.$nextTick(() => {
                                axios.post(process.env.VUE_APP_BACKEND + "api/v1/inventory/create",Object.assign(inventario)).catch(error => {
                                    this.snackbar = {
                                        message: error.response.data.message,
                                        color: 'error',
                                        show: true
                                    }
                                    this.gris = false
                                })
                            })
                        }
                    }
                    this.statusId = ''
                    this.statusData = ''
                    this.sheet2 = false
                    this.rejectionId = ''
                    this.rejectionData = ''
                    this.rejectionDialog = false
                    this.$store.dispatch('quotation/getQuotations')
                    this.$store.dispatch('quotation/getSales')
                    this.$store.dispatch('quotation/getCancellations')
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            })
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
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
        filtersQuotation: function(params) {
            this.quotations = ''
            var filterQuotation = this.quotationsLists

            for(var i=0; i<params.length; i++){
                switch(params[i].que){
                    /* N U M B E R */
                    case 'id':
                        var dos = ''
                        switch(params[i].como){
                            case 'contiene':
                                dos=filterQuotation.filter(quotation=>(quotation.id.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                dos=filterQuotation.filter(quotation=>!(quotation.id.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                dos=filterQuotation.filter(quotation=>quotation.id == params[i].valor)
                            break;
                            case 'no es igual a':
                                dos=filterQuotation.filter(quotation=>quotation.id != params[i].valor)
                            break;
                            case 'es mayor que':
                                dos=filterQuotation.filter(quotation=>quotation.id > params[i].valor)
                            break;
                            case 'es menor que':
                                dos=filterQuotation.filter(quotation=>quotation.id < params[i].valor)
                            break;
                            case 'desde':
                                dos=filterQuotation.filter(quotation=>quotation.id >= params[i].valor)
                            break;
                            case 'hasta':
                                dos=filterQuotation.filter(quotation=>quotation.id <= params[i].valor)
                            break;
                            case 'está vacío':
                                dos=filterQuotation.filter(quotation=>quotation.id == '' || quotation.id == null || quotation.id == undefined)
                            break;
                            case 'no está vacío':
                                dos=filterQuotation.filter(quotation=>quotation.id != '' && quotation.id != null && quotation.id != undefined)
                            break;
                            case 'inicia con':
                                dos=filterQuotation.filter(quotation=>quotation.id.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(dos, "id");
                    break;
                    case 'kg':
                        var nueve = ''
                        switch(params[i].como){
                            case 'contiene':
                                nueve=filterQuotation.filter(quotation=>(quotation.kg.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                nueve=filterQuotation.filter(quotation=>!(quotation.kg.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                nueve=filterQuotation.filter(quotation=>quotation.kg == params[i].valor)
                            break;
                            case 'no es igual a':
                                nueve=filterQuotation.filter(quotation=>quotation.kg != params[i].valor)
                            break;
                            case 'es mayor que':
                                nueve=filterQuotation.filter(quotation=>quotation.kg > params[i].valor)
                            break;
                            case 'es menor que':
                                nueve=filterQuotation.filter(quotation=>quotation.kg < params[i].valor)
                            break;
                            case 'desde':
                                nueve=filterQuotation.filter(quotation=>quotation.kg >= params[i].valor)
                            break;
                            case 'hasta':
                                nueve=filterQuotation.filter(quotation=>quotation.kg <= params[i].valor)
                            break;
                            case 'está vacío':
                                nueve=filterQuotation.filter(quotation=>quotation.kg == '' || quotation.kg == null || quotation.kg == undefined)
                            break;
                            case 'no está vacío':
                                nueve=filterQuotation.filter(quotation=>quotation.kg != '' && quotation.kg != null && quotation.kg != undefined)
                            break;
                            case 'inicia con':
                                nueve=filterQuotation.filter(quotation=>quotation.kg.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(nueve, "id");
                    break;
                    case 'subtotal':
                        var dieciocho = ''
                        switch(params[i].como){
                            case 'contiene':
                                dieciocho=filterQuotation.filter(quotation=>(quotation.subtotal.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                dieciocho=filterQuotation.filter(quotation=>!(quotation.subtotal.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal == params[i].valor)
                            break;
                            case 'no es igual a':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal != params[i].valor)
                            break;
                            case 'es mayor que':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal > params[i].valor)
                            break;
                            case 'es menor que':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal < params[i].valor)
                            break;
                            case 'desde':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal >= params[i].valor)
                            break;
                            case 'hasta':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal <= params[i].valor)
                            break;
                            case 'está vacío':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal == '' || quotation.subtotal == null || quotation.subtotal == undefined)
                            break;
                            case 'no está vacío':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal != '' && quotation.subtotal != null && quotation.subtotal != undefined)
                            break;
                            case 'inicia con':
                                dieciocho=filterQuotation.filter(quotation=>quotation.subtotal.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(dieciocho, "id");
                    break;
                    case 'iva':
                        var diecinueve = ''
                        switch(params[i].como){
                            case 'contiene':
                                diecinueve=filterQuotation.filter(quotation=>(quotation.iva.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                diecinueve=filterQuotation.filter(quotation=>!(quotation.iva.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva == params[i].valor)
                            break;
                            case 'no es igual a':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva != params[i].valor)
                            break;
                            case 'es mayor que':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva > params[i].valor)
                            break;
                            case 'es menor que':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva < params[i].valor)
                            break;
                            case 'desde':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva >= params[i].valor)
                            break;
                            case 'hasta':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva <= params[i].valor)
                            break;
                            case 'está vacío':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva == '' || quotation.iva == null || quotation.iva == undefined)
                            break;
                            case 'no está vacío':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva != '' && quotation.iva != null && quotation.iva != undefined)
                            break;
                            case 'inicia con':
                                diecinueve=filterQuotation.filter(quotation=>quotation.iva.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(diecinueve, "id");
                    break;
                    case 'total':
                        var veinte = ''
                        switch(params[i].como){
                            case 'contiene':
                                veinte=filterQuotation.filter(quotation=>(quotation.total.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                veinte=filterQuotation.filter(quotation=>!(quotation.total.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                veinte=filterQuotation.filter(quotation=>quotation.total == params[i].valor)
                            break;
                            case 'no es igual a':
                                veinte=filterQuotation.filter(quotation=>quotation.total != params[i].valor)
                            break;
                            case 'es mayor que':
                                veinte=filterQuotation.filter(quotation=>quotation.total > params[i].valor)
                            break;
                            case 'es menor que':
                                veinte=filterQuotation.filter(quotation=>quotation.total < params[i].valor)
                            break;
                            case 'desde':
                                veinte=filterQuotation.filter(quotation=>quotation.total >= params[i].valor)
                            break;
                            case 'hasta':
                                veinte=filterQuotation.filter(quotation=>quotation.total <= params[i].valor)
                            break;
                            case 'está vacío':
                                veinte=filterQuotation.filter(quotation=>quotation.total == '' || quotation.total == null || quotation.total == undefined)
                            break;
                            case 'no está vacío':
                                veinte=filterQuotation.filter(quotation=>quotation.total != '' && quotation.total != null && quotation.total != undefined)
                            break;
                            case 'inicia con':
                                veinte=filterQuotation.filter(quotation=>quotation.total.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(veinte, "id");
                    break;
                    case 'payments':
                        var veintiuno = ''
                        switch(params[i].como){
                            case 'contiene':
                                veintiuno=filterQuotation.filter(quotation=>(quotation.payments.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                veintiuno=filterQuotation.filter(quotation=>!(quotation.payments.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments == params[i].valor)
                            break;
                            case 'no es igual a':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments != params[i].valor)
                            break;
                            case 'es mayor que':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments > params[i].valor)
                            break;
                            case 'es menor que':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments < params[i].valor)
                            break;
                            case 'desde':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments >= params[i].valor)
                            break;
                            case 'hasta':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments <= params[i].valor)
                            break;
                            case 'está vacío':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments == '' || quotation.payments == null || quotation.payments == undefined)
                            break;
                            case 'no está vacío':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments != '' && quotation.payments != null && quotation.payments != undefined)
                            break;
                            case 'inicia con':
                                veintiuno=filterQuotation.filter(quotation=>quotation.payments.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(veintiuno, "id");
                    break;
                    case 'debt':
                        var veintidos = ''
                        switch(params[i].como){
                            case 'contiene':
                                veintidos=filterQuotation.filter(quotation=>(quotation.debt.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                veintidos=filterQuotation.filter(quotation=>!(quotation.debt.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt == params[i].valor)
                            break;
                            case 'no es igual a':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt != params[i].valor)
                            break;
                            case 'es mayor que':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt > params[i].valor)
                            break;
                            case 'es menor que':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt < params[i].valor)
                            break;
                            case 'desde':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt >= params[i].valor)
                            break;
                            case 'hasta':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt <= params[i].valor)
                            break;
                            case 'está vacío':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt == '' || quotation.debt == null || quotation.debt == undefined)
                            break;
                            case 'no está vacío':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt != '' && quotation.debt != null && quotation.debt != undefined)
                            break;
                            case 'inicia con':
                                veintidos=filterQuotation.filter(quotation=>quotation.debt.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(veintidos, "id");
                    break;
                    case 'invoiceDays':
                        var veintitres = ''
                        switch(params[i].como){
                            case 'contiene':
                                veintitres=filterQuotation.filter(quotation=>(quotation.invoiceDays.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                veintitres=filterQuotation.filter(quotation=>!(quotation.invoiceDays.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays == params[i].valor)
                            break;
                            case 'no es igual a':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays != params[i].valor)
                            break;
                            case 'es mayor que':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays > params[i].valor)
                            break;
                            case 'es menor que':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays < params[i].valor)
                            break;
                            case 'desde':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays >= params[i].valor)
                            break;
                            case 'hasta':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays <= params[i].valor)
                            break;
                            case 'está vacío':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays == '' || quotation.invoiceDays == null || quotation.invoiceDays == undefined)
                            break;
                            case 'no está vacío':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays != '' && quotation.invoiceDays != null && quotation.invoiceDays != undefined)
                            break;
                            case 'inicia con':
                                veintitres=filterQuotation.filter(quotation=>quotation.invoiceDays.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(veintitres, "id");
                    break;
                    case 'expirationDays':
                        var veinticuatro = ''
                        switch(params[i].como){
                            case 'contiene':
                                veinticuatro=filterQuotation.filter(quotation=>(quotation.expirationDays.toString()).includes(params[i].valor))
                            break;
                            case 'no contiene':
                                veinticuatro=filterQuotation.filter(quotation=>!(quotation.expirationDays.toString()).includes(params[i].valor))
                            break;
                            case 'es igual a':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays == params[i].valor)
                            break;
                            case 'no es igual a':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays != params[i].valor)
                            break;
                            case 'es mayor que':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays > params[i].valor)
                            break;
                            case 'es menor que':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays < params[i].valor)
                            break;
                            case 'desde':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays >= params[i].valor)
                            break;
                            case 'hasta':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays <= params[i].valor)
                            break;
                            case 'está vacío':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays == '' || quotation.expirationDays == null || quotation.expirationDays == undefined)
                            break;
                            case 'no está vacío':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays != '' && quotation.expirationDays != null && quotation.expirationDays != undefined)
                            break;
                            case 'inicia con':
                                veinticuatro=filterQuotation.filter(quotation=>quotation.expirationDays.toString().slice(0,params[i].valor.length) == params[i].valor)
                            break;
                        }
                        filterQuotation = this.removeDuplicates(veinticuatro, "id");
                    break;

                    /* S T R I N G */
                    case 'company':
                        var uno = ''
                        switch(params[i].como){
                            case 'contiene':
                                uno=filterQuotation.filter(quotation=>this.lowerCase(quotation.company).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                uno=filterQuotation.filter(quotation=>!this.lowerCase(quotation.company).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'es igual a':
                                uno=filterQuotation.filter(quotation=>this.lowerCase(quotation.company) == params[i].valor.toLowerCase())
                            break;
                            case 'no es igual a':
                                uno=filterQuotation.filter(quotation=>this.lowerCase(quotation.company) != params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                uno=filterQuotation.filter(quotation=>quotation.company == '' || quotation.company == null || quotation.company == undefined)
                            break;
                            case 'no está vacío':
                                uno=filterQuotation.filter(quotation=>quotation.company != '' && quotation.company != null && quotation.company != undefined)
                            break;
                            case 'inicia con':
                                uno=filterQuotation.filter(quotation=>this.lowerCase(quotation.company).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(uno, "id");
                    break;
                    case 'contact':
                        var tres = ''
                        switch(params[i].como){
                            case 'contiene':
                                tres=filterQuotation.filter(quotation=>this.lowerCase(quotation.contact).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                tres=filterQuotation.filter(quotation=>!this.lowerCase(quotation.contact).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'es igual a':
                                tres=filterQuotation.filter(quotation=>this.lowerCase(quotation.contact) == params[i].valor.toLowerCase())
                            break;
                            case 'no es igual a':
                                tres=filterQuotation.filter(quotation=>this.lowerCase(quotation.contact) != params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                tres=filterQuotation.filter(quotation=>quotation.id == '' || quotation.contact == null || quotation.contact == undefined)
                            break;
                            case 'no está vacío':
                                tres=filterQuotation.filter(quotation=>quotation.id != '' && quotation.contact != null && quotation.contact != undefined)
                            break;
                            case 'inicia con':
                                tres=filterQuotation.filter(quotation=>this.lowerCase(quotation.contact).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(tres, "id");
                    break;
                    case 'priceList':
                        var cuatro = ''
                        switch(params[i].como){
                            case 'contiene':
                                cuatro=filterQuotation.filter(quotation=>this.lowerCase(quotation.priceList).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                cuatro=filterQuotation.filter(quotation=>!this.lowerCase(quotation.priceList).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'es igual a':
                                cuatro=filterQuotation.filter(quotation=>this.lowerCase(quotation.priceList) == params[i].valor.toLowerCase())
                            break;
                            case 'no es igual a':
                                cuatro=filterQuotation.filter(quotation=>this.lowerCase(quotation.priceList) != params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                cuatro=filterQuotation.filter(quotation=>quotation.id == '' || quotation.priceList == null || quotation.priceList == undefined)
                            break;
                            case 'no está vacío':
                                cuatro=filterQuotation.filter(quotation=>quotation.id != '' && quotation.priceList != null && quotation.priceList != undefined)
                            break;
                            case 'inicia con':
                                cuatro=filterQuotation.filter(quotation=>this.lowerCase(quotation.priceList).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(cuatro, "id");
                    break;
                    case 'status':
                        var seis = ''
                        switch(params[i].como){
                            case 'contiene':
                                seis=filterQuotation.filter(quotation=>this.lowerCase(quotation.status).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                seis=filterQuotation.filter(quotation=>!this.lowerCase(quotation.status).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'es igual a':
                                seis=filterQuotation.filter(quotation=>this.lowerCase(quotation.status) == params[i].valor.toLowerCase())
                            break;
                            case 'no es igual a':
                                seis=filterQuotation.filter(quotation=>this.lowerCase(quotation.status) != params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                seis=filterQuotation.filter(quotation=>quotation.id == '' || quotation.status == null || quotation.status == undefined)
                            break;
                            case 'no está vacío':
                                seis=filterQuotation.filter(quotation=>quotation.id != '' && quotation.status != null && quotation.status != undefined)
                            break;
                            case 'inicia con':
                                seis=filterQuotation.filter(quotation=>this.lowerCase(quotation.status).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(seis, "id");
                    break;
                    case 'paymentStatus':
                        var siete = ''
                        switch(params[i].como){
                            case 'contiene':
                                siete=filterQuotation.filter(quotation=>this.lowerCase(quotation.paymentStatus).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                siete=filterQuotation.filter(quotation=>!this.lowerCase(quotation.paymentStatus).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'es igual a':
                                siete=filterQuotation.filter(quotation=>this.lowerCase(quotation.paymentStatus) == params[i].valor.toLowerCase())
                            break;
                            case 'no es igual a':
                                siete=filterQuotation.filter(quotation=>this.lowerCase(quotation.paymentStatus) != params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                siete=filterQuotation.filter(quotation=>quotation.id == '' || quotation.paymentStatus == null || quotation.paymentStatus == undefined)
                            break;
                            case 'no está vacío':
                                siete=filterQuotation.filter(quotation=>quotation.id != '' && quotation.paymentStatus != null && quotation.paymentStatus != undefined)
                            break;
                            case 'inicia con':
                                siete=filterQuotation.filter(quotation=>this.lowerCase(quotation.paymentStatus).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(siete, "id");
                    break;
                    case 'delivery':
                        var diez = ''
                        switch(params[i].como){
                            case 'contiene':
                                diez=filterQuotation.filter(quotation=>this.lowerCase(quotation.kg).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                diez=filterQuotation.filter(quotation=>!this.lowerCase(quotation.kg).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'es igual a':
                                diez=filterQuotation.filter(quotation=>this.lowerCase(quotation.kg) == params[i].valor.toLowerCase())
                            break;
                            case 'no es igual a':
                                diez=filterQuotation.filter(quotation=>this.lowerCase(quotation.kg) != params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                diez=filterQuotation.filter(quotation=>quotation.id == '' || quotation.kg == null || quotation.kg == undefined)
                            break;
                            case 'no está vacío':
                                diez=filterQuotation.filter(quotation=>quotation.id != '' && quotation.kg != null && quotation.kg != undefined)
                            break;
                            case 'inicia con':
                                diez=filterQuotation.filter(quotation=>this.lowerCase(quotation.kg).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(diez, "id");
                    break;
                    case 'type':
                        var uno = ''
                        switch(params[i].como){
                            case 'contiene':
                                uno=filterQuotation.filter(quotation=>this.lowerCase(quotation.company).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                uno=filterQuotation.filter(quotation=>!this.lowerCase(quotation.company).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'desde':
                                uno=filterQuotation.filter(quotation=>this.lowerCase(quotation.company) >= params[i].valor.toLowerCase())
                            break;
                            case 'hasta':
                                uno=filterQuotation.filter(quotation=>this.lowerCase(quotation.company) <= params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                uno=filterQuotation.filter(quotation=>quotation.company == '' || quotation.company == null || quotation.company == undefined)
                            break;
                            case 'no está vacío':
                                uno=filterQuotation.filter(quotation=>quotation.company != '' && quotation.company != null && quotation.company != undefined)
                            break;
                            case 'inicia con':
                                uno=filterQuotation.filter(quotation=>this.lowerCase(quotation.company).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(uno, "id");
                    break;
                    case 'invoice':
                        var catorce = ''
                        switch(params[i].como){
                            case 'contiene':
                                catorce=filterQuotation.filter(quotation=>this.lowerCase(quotation.invoice).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                catorce=filterQuotation.filter(quotation=>!this.lowerCase(quotation.invoice).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'desde':
                                catorce=filterQuotation.filter(quotation=>this.lowerCase(quotation.invoice) >= params[i].valor.toLowerCase())
                            break;
                            case 'hasta':
                                catorce=filterQuotation.filter(quotation=>this.lowerCase(quotation.invoice) <= params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                catorce=filterQuotation.filter(quotation=>quotation.invoice == '' || quotation.invoice == null || quotation.invoice == undefined)
                            break;
                            case 'no está vacío':
                                catorce=filterQuotation.filter(quotation=>quotation.invoice != '' && quotation.invoice != null && quotation.invoice != undefined)
                            break;
                            case 'inicia con':
                                catorce=filterQuotation.filter(quotation=>this.lowerCase(quotation.invoice).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(catorce, "id");
                    break;
                    case 'salesman':
                        var quince = ''
                        switch(params[i].como){
                            case 'contiene':
                                quince=filterQuotation.filter(quotation=>this.lowerCase(quotation.salesman).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                quince=filterQuotation.filter(quotation=>!this.lowerCase(quotation.salesman).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'desde':
                                quince=filterQuotation.filter(quotation=>this.lowerCase(quotation.salesman) >= params[i].valor.toLowerCase())
                            break;
                            case 'hasta':
                                quince=filterQuotation.filter(quotation=>this.lowerCase(quotation.salesman) <= params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                quince=filterQuotation.filter(quotation=>quotation.salesman == '' || quotation.salesman == null || quotation.salesman == undefined)
                            break;
                            case 'no está vacío':
                                quince=filterQuotation.filter(quotation=>quotation.salesman != '' && quotation.salesman != null && quotation.salesman != undefined)
                            break;
                            case 'inicia con':
                                quince=filterQuotation.filter(quotation=>this.lowerCase(quotation.salesman).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(quince, "id");
                    break;
                    case 'created_by_user_id':
                        var dieciseis = ''
                        switch(params[i].como){
                            case 'contiene':
                                dieciseis=filterQuotation.filter(quotation=>this.lowerCase(quotation.created_by_user_id).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                dieciseis=filterQuotation.filter(quotation=>!this.lowerCase(quotation.created_by_user_id).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'desde':
                                dieciseis=filterQuotation.filter(quotation=>this.lowerCase(quotation.created_by_user_id) >= params[i].valor.toLowerCase())
                            break;
                            case 'hasta':
                                dieciseis=filterQuotation.filter(quotation=>this.lowerCase(quotation.created_by_user_id) <= params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                dieciseis=filterQuotation.filter(quotation=>quotation.created_by_user_id == '' || quotation.created_by_user_id == null || quotation.created_by_user_id == undefined)
                            break;
                            case 'no está vacío':
                                dieciseis=filterQuotation.filter(quotation=>quotation.created_by_user_id != '' && quotation.created_by_user_id != null && quotation.created_by_user_id != undefined)
                            break;
                            case 'inicia con':
                                dieciseis=filterQuotation.filter(quotation=>this.lowerCase(quotation.created_by_user_id).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(dieciseis, "id");
                    break;
                    case 'last_updated_by_user_id':
                        var diecisiete = ''
                        switch(params[i].como){
                            case 'contiene':
                                diecisiete=filterQuotation.filter(quotation=>this.lowerCase(quotation.last_updated_by_user_id).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'no contiene':
                                diecisiete=filterQuotation.filter(quotation=>!this.lowerCase(quotation.last_updated_by_user_id).includes(params[i].valor.toLowerCase()))
                            break;
                            case 'desde':
                                diecisiete=filterQuotation.filter(quotation=>this.lowerCase(quotation.last_updated_by_user_id) >= params[i].valor.toLowerCase())
                            break;
                            case 'hasta':
                                diecisiete=filterQuotation.filter(quotation=>this.lowerCase(quotation.last_updated_by_user_id) <= params[i].valor.toLowerCase())
                            break;
                            case 'está vacío':
                                diecisiete=filterQuotation.filter(quotation=>quotation.last_updated_by_user_id == '' || quotation.last_updated_by_user_id == null || quotation.last_updated_by_user_id == undefined)
                            break;
                            case 'no está vacío':
                                diecisiete=filterQuotation.filter(quotation=>quotation.last_updated_by_user_id != '' && quotation.last_updated_by_user_id != null && quotation.last_updated_by_user_id != undefined)
                            break;
                            case 'inicia con':
                                diecisiete=filterQuotation.filter(quotation=>this.lowerCase(quotation.last_updated_by_user_id).slice(0,params[i].valor.length) == params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(diecisiete, "id");
                    break;

                    /* B O O L E A N */
                    case 'printed':
                        var trece = ''
                        switch(params[i].como){
                            case 'es igual a':
                                trece=filterQuotation.filter(quotation=>this.lowerCase(quotation.pos_sale) == params[i].valor.toLowerCase())
                            break;
                            case 'no es igual a':
                                trece=filterQuotation.filter(quotation=>this.lowerCase(quotation.pos_sale) != params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(trece, "id");
                    break;
                    case 'bar':
                        var ocho = ''
                        switch(params[i].como){
                            case 'es igual a':
                                ocho=filterQuotation.filter(quotation=>this.lowerCase(quotation.pos_sale) == params[i].valor.toLowerCase())
                            break;
                            case 'no es igual a':
                                ocho=filterQuotation.filter(quotation=>this.lowerCase(quotation.pos_sale) != params[i].valor.toLowerCase())
                            break;
                        }
                        filterQuotation = this.removeDuplicates(ocho, "id");
                    break;

                    /* D A T E S */
                    case 'invoice_date':
                        var veinticinco = ''
                        switch(params[i].como){
                            case 'es igual a':
                                veinticinco=filterQuotation.filter(quotation=>moment(quotation.invoice_date, "YYYY-MM-DD").format().slice(0, 10) == moment(params[i].valor, "YYYY-MM-DD").format().slice(0, 10))
                            break;
                            case 'desde':
                                veinticinco=filterQuotation.filter(quotation=>new Date(quotation.invoice_date) >= new Date(params[i].valor))
                            break;
                            case 'hasta':
                                veinticinco=filterQuotation.filter(quotation=>new Date(quotation.invoice_date) <= new Date(params[i].valor))
                            break;
                        }
                        filterQuotation = this.removeDuplicates(veinticinco, "id");
                    break;
                    case 'date':
                        var cinco = ''
                        switch(params[i].como){
                            case 'es igual a':
                                cinco=filterQuotation.filter(quotation=>moment(quotation.date, "YYYY-MM-DD").format().slice(0, 10) == moment(params[i].valor, "YYYY-MM-DD").format().slice(0, 10))
                            break;
                            case 'desde':
                                cinco=filterQuotation.filter(quotation=>new Date(quotation.date) >= new Date(params[i].valor))
                            break;
                            case 'hasta':
                                cinco=filterQuotation.filter(quotation=>new Date(quotation.date) <= new Date(params[i].valor))
                            break;
                        }
                        filterQuotation = this.removeDuplicates(cinco, "id");
                    break;
                    case 'expiration':
                        var ocho = ''
                        switch(params[i].como){
                            case 'es igual a':
                                ocho=filterQuotation.filter(quotation=>moment(quotation.expiration, "YYYY-MM-DD").format().slice(0, 10) == moment(params[i].valor, "YYYY-MM-DD").format().slice(0, 10))
                            break;
                            case 'desde':
                                ocho=filterQuotation.filter(quotation=>new Date(quotation.expiration) >= new Date(params[i].valor))
                            break;
                            case 'hasta':
                                ocho=filterQuotation.filter(quotation=>new Date(quotation.expiration) <= new Date(params[i].valor))
                            break;
                        }
                        filterQuotation = this.removeDuplicates(ocho, "id");
                    break;
                    case 'created_at':
                        var once = ''
                        switch(params[i].como){
                            case 'es igual a':
                                once=filterQuotation.filter(quotation=>moment(quotation.created_at, "YYYY-MM-DD").format().slice(0, 10) == moment(params[i].valor, "YYYY-MM-DD").format().slice(0, 10))
                            break;
                            case 'desde':
                                once=filterQuotation.filter(quotation=>new Date(quotation.created_at) >= new Date(params[i].valor))
                            break;
                            case 'hasta':
                                once=filterQuotation.filter(quotation=>new Date(quotation.created_at) <= new Date(params[i].valor))
                            break;
                        }
                        filterQuotation = this.removeDuplicates(once, "id");
                    break;
                    case 'updated_at':
                        var doce = ''
                        switch(params[i].como){
                            case 'es igual a':
                                doce=filterQuotation.filter(quotation=>moment(quotation.updated_at, "YYYY-MM-DD").format().slice(0, 10) == moment(params[i].valor, "YYYY-MM-DD").format().slice(0, 10))
                            break;
                            case 'desde':
                                doce=filterQuotation.filter(quotation=>new Date(quotation.updated_at) >= new Date(params[i].valor))
                            break;
                            case 'hasta':
                                doce=filterQuotation.filter(quotation=>new Date(quotation.updated_at) <= new Date(params[i].valor))
                            break;
                        }
                        filterQuotation = this.removeDuplicates(doce, "id");
                    break;
                }
            }
            this.quotations = filterQuotation
        },
        check(items, param){
            if(items!=undefined&&items!=''&&items!=null){
                for(var i=0; i<items.length; i++){
                    if(items[i].item == param){
                        return 'contain'
                    }
                }  
            }
        },
        weight(items){
            var weight = ''
            for(var i=0; i<items.length; i++){
                weight = weight + (items[i].weight*items[i].quantity)
            }
            return weight + ' kg'
        },
        closeDialogEditQuotation: function(params) {
            this.editDialog = false;
            this.$store.dispatch('quotation/getQuotations')
        },
        closeCreateDialogQuotation: function(params) {
            this.createDialog = false;
            this.$store.dispatch('quotation/getQuotations')
        },
        closeDialogEmailQuotation: function(params) {
            this.emailDialog = false;
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.quotations)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Cotizaciones'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteQuotation(){
            axios.delete(process.env.VUE_APP_BACKEND + "api/v1/quotation/delete/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.$store.dispatch('quotation/getQuotations')
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
        sendEmail (id) {
            this.quotation = this.quotationsList.filter(quotation=>quotation.id == id)[0]
            this.emailDialog = true
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
            this.sheet2 = false
        },
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(id){
            this.quotation = this.quotationsList.filter(quotation=>quotation.id == id)[0]
            this.editDialog = true
        },
        salesman(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.name)[0]
        },
        contact(id){
            return this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact => contact.name + ' ' + contact.last)[0]
        },
        companyName(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
        },
        priceList(id){
            var priceList = this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.price_list_id)[0]
            return this.$store.state.price_list.price_lists.filter(price=>price.id == priceList).map(price => price.item)[0]
        },
        items(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.name)[0]
        },
        calcWeight(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.weight)[0]
        },
        prices(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.price)[0]
        },
    }
}
</script>
<style>
    .bordercolor{
        width: 3px;
        content: ' ';
        height: 47px;
        position: absolute;
        border-radius:5px 0px 0px 5px;
    }
    @media(min-width: 980px){
        .bordercolor{
            margin-top: -13px;
            margin-left: -19px;
        }
    }
    @media(max-width: 980px){
        .bordercolor {
            height: 360px;
            left: 9px;
        }
    }
    .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
        box-shadow: none!important;
        background: #f7f7f7;
    }
</style>