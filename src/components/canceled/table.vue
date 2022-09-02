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
                    <v-toolbar-title>Cancelaciones</v-toolbar-title>
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
                <v-container style="margin-bottom:-75px!important;">
                    <v-select :items="sumavg" v-model="totalType" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <v-select :items="campos" v-model="campo" item-text="text" item-value="value" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <strong v-if="totalType=='sum'">Total = {{ sumField(campo) }}</strong>
                    <strong v-if="totalType=='avg'">Promedio = {{ avgField(campo) }}</strong>
                </v-container>
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
            <template v-slot:[`item.expired_debt`]="{ item }">
                {{item.expired_debt.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
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
            <!-- Detalle -->
            <template  v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <v-row class="pa-6">
                        <v-col cols="12" sm="6" md="7">
                            <v-data-table :headers="headers2" :items="item.items" v-if="item.items!=undefined" class="elevation-0" style="background: #f7f7f7;!important" dense>
                                <template v-slot:[`item.item`]="{ item }">
                                    {{ items(item.item) }}
                                </template>
                                <template v-slot:[`item.value`]="{ item }">
                                    {{ prices(item.item).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}
                                </template>
                                <template v-slot:[`item.total`]="{ item }">
                                    {{ (prices(item.item)*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" class="px-6">
                            <div class="px-4 py-3" style="background-color:#ffedb3; border-radius: 0px 10px 10px 10px; min-height:120px;" >
                                <strong>Notas:</strong><br>
                                <span>{{item.note}}</span>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                            <v-btn v-if="item.pdf!=undefined" v-bind:href="process.env.VUE_APP_BACKEND + 'files/' + item.pdf" target="_blank" text style="margin:auto; display:block;">
                                PDF:
                                <br>
                                <v-icon >mdi-file-pdf-outline</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                            <v-btn outlined rounded color="primary" class="mb-4" @click="confirmStatus(item.id, 'quotation')" style="font-size:12px; height:30px!important; margin-left: auto; margin-right: auto; display: block;">Retomar</v-btn>
                        </v-col>
                    </v-row>
                </td>
            </template>
            <!-- Monto -->
            <template v-slot:[`item.total`]="{ item }">
                {{item.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
        </v-data-table>
        <!-- Dialogo confirmación de estatus -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet2" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas reactivar la cotizacion cancelada?
                    <br>
                    <span style="font-size:13px; color:grey;">Esto movera la cotización cancelada a la sección de "Cotizaciones"</span>
                    </div>
                    <v-btn class="mt-4" text color="primary" @click="status()">
                    Si
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    No
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../reports/filter"
export default {
    props:{
        company:String
    },
    components: {
        'filterQuotations':Filter,
    }, 
    data: () => ({
        campo:'total',
        campos:[
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
        ],
        totalType:'sum',
        sumavg:['sum', 'avg'],
        filters: false,
        sheet2:false,
        statusId:'',
        statusData:'',
        quotations: '',
        headers2:[
            { text: 'Cantidad', value: 'quantity',},
            { text: 'Producto | Servicio', value: 'item',},
            { text: 'Precio Ajustado', value: 'value',},
            { text: 'Total', value: 'total',},
        ],
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),
    computed: {
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        showCompany(){
            if(this.company == null){
                return { text: 'Empresa', value: 'company',}
            }else{
                return false
            }
        },
        headers(){ 
            this.quotations = this.quotationsLists
            return [
            { text: '', value: 'data-table-expand' },
            this.showCompany,
            { text: 'Contacto', value: 'contact' },
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
            { text: 'Vendedor', value: 'salesman', sortable: false },
            { text: 'Motivo', value: 'rejection_id' },
            { text: 'Comentario', value: 'rejection_comment' },
            { text: 'Cotizado', value: 'created_at' },
            { text: 'Cancelado', value: 'updated_at' },
        ]},
        quotationsLists(){
            var quotations = this.$store.state.quotation.cancellations
            if(this.company!='' && this.company!=undefined && this.company!=null){
                quotations = quotations.filter(quotation=>quotation.company_id == this.company)
            }
            quotations = quotations.map(id=>{
                return{
                    id:id.id,
                    subtotal:id.subtotal,
                    iva:id.iva,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    rejection_comment:id.rejection_comment,
                    rejection_id:this.rejection(id.rejection_id),
                    total:id.total,
                    pdf:id.pdf,
                    note:id.note,
                    items:id.items,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                }
            });

            return quotations
        },
    },
    created () { 
        this.$store.dispatch('quotation/getCancellations')
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
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
        },
        rejection(id){
            return this.$store.state.rejection.rejections.filter(rejection=>rejection.id == id).map(rejection=>rejection.name)[0];
        },
        confirmStatus(id, status){
            this.statusId = id
            this.statusData = status
            this.sheet2 = true
        },
        status(){
            var editedItem = this.$store.state.quotation.cancellations.filter(quotation=>quotation.id == this.statusId)[0]
            editedItem.status = this.statusData
            this.$nextTick(() => {
                axios.put("https://unowipes.com/api/v1/quotation/update",Object.assign(editedItem)).then(response=>{
                    this.statusId = ''
                    this.statusData = ''
                    this.sheet2 = false
                    this.$store.dispatch('quotation/getQuotations')
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
        cancel(){
            this.sheet2 = false
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
            if(this.company!='' && this.company!=undefined && this.company!=null){
                var filterQuotation = this.$store.state.quotation.cancellations.filter(quotation=>quotation.company_id == this.company)
            }else{
                var filterQuotation = this.$store.state.quotation.cancellations
            }
            if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
                var uno = filterQuotation.filter(quotation=>quotation.company_id == params.company_id[0])
                for(var i=1; i<params.company_id.length; i++){
                    uno=uno.concat(filterQuotation.filter(quotation=>quotation.company_id == params.company_id[i]))   
                }
                filterQuotation = this.removeDuplicates(uno, "id");
            }
            if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
                var dos = filterQuotation.filter(quotation=>quotation.contact_id == params.contact_id[0])
                for(var i=1; i<params.contact_id.length; i++){
                    dos=dos.concat(filterQuotation.filter(quotation=>quotation.contact_id == params.contact_id[i]))   
                }
                filterQuotation = this.removeDuplicates(dos, "id");
            }
            if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                var tres = filterQuotation.filter(quotation=>quotation.user_id == params.user_id[0])
                for(var i=1; i<params.user_id.length; i++){
                    tres=tres.concat(filterQuotation.filter(quotation=>quotation.user_id == params.user_id[i]))   
                }
                filterQuotation = this.removeDuplicates(tres, "id");
            }
            if(params.items!=''&&params.items!=undefined&&params.items!=null){
                var cinco = filterQuotation.filter(quotation=>this.check(quotation.items, params.items[0]) == 'contain')
                for(var i=1; i<params.items.length; i++){
                    cinco=cinco.concat(filterQuotation.filter(quotation=>this.check(quotation.items, params.items[0]) == 'contain'))   
                }
                filterQuotation = this.removeDuplicates(cinco, "id");
            }
            /* text fields */
            if(params.note!=''){
                filterQuotation=filterQuotation.filter(quotation=>this.lowerCase(quotation.note).includes(params.note.toLowerCase()))
            }

            /* Fecha creación */
            if(params.dateCreateFrom!='' && params.dateCreateFrom!=null && params.dateCreateFrom!=undefined){
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) > new Date(params.dateCreateFrom))
            }
            if(params.dateCreateTo!='' && params.dateCreateTo!=null && params.dateCreateTo!=undefined){
                var dateTwo = new Date(new Date(params.dateCreateTo).setDate(new Date(params.dateCreateTo).getDate() + 1))
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) <= dateTwo)
            }


            this.quotations = filterQuotation.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    rejection_comment:id.rejection_comment,
                    rejection_id:this.rejection(id.rejection_id),
                    amount:id.amount,
                    pdf:id.pdf,
                    note:id.note,
                    items:id.items,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                }
            });
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
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.quotations)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Cotizaciones'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
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
        items(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.name)[0]
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