<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterCalls v-bind:company="company" @filtersCall="filtersCall"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table :headers="headers" :items="calls" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Llamadas</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon v-show="permissions('download')">
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de cotiaciones aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ companyID(item.company)}">{{item.company}}</v-list-item>
            </template>
            <!-- Grabación -->
            <template v-slot:[`item.duration`]="{ item }" v-if="permissions('viewCallRecords')">
                <v-bottom-sheet inset v-if="item.duration>=1" class="sjkhdjf">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="grey" rounded small outlined dark v-bind="attrs" v-on="on">
                            <v-icon small class="mr-2">mdi-play</v-icon>{{item.duration}} minutos
                        </v-btn>
                    </template>
                    <template v-for="(record, index) in item.records">
                        <v-list-item v-bind:key="index" >
                                <audio class="mb-4" :src="record" controls="true" style="width:100%;"></audio>
                        </v-list-item>
                    </template>
                </v-bottom-sheet>
            </template>
            <template v-slot:[`item.duration`]="{ item }" v-else>
                {{item.duration}} minutos
            </template>
            <!-- Icono -->
            <template v-slot:[`item.call_type`]="{ item }">
                <div v-if="item.call_type=='outbound'">
                    <v-chip icon v-if="item.call_status=='Redirected'" outlined color="#26c83f" class="px-2">
                        <v-icon color="#26c83f" small>mdi-phone-outgoing</v-icon>
                    </v-chip>
                    <v-chip icon v-if="item.call_status=='Lost'" color="#ff5e57" outlined class="px-2">
                        <v-icon color="#ff5e57" small>mdi-phone-outgoing</v-icon>
                    </v-chip>
                    <v-chip icon v-if="item.call_status=='Self-service'" color="#febc2d" outlined class="px-2">
                        <v-icon color="#febc2d" small>mdi-phone-outgoing</v-icon>
                    </v-chip>
                    <v-chip icon v-if="item.call_status=='Lost_by_agent'" outlined class="px-2">
                        <v-icon small>mdi-alert</v-icon>
                    </v-chip>
                    <v-chip icon v-if="item.call_status=='Voicemail'" color="primary" outlined class="px-2">
                        <v-icon color="primary" small>mdi-voicemail</v-icon>
                    </v-chip>
                </div>
                <div v-if="item.call_type=='inbound'">
                    <v-chip icon v-if="item.call_status=='Redirected'" color="#26c83f" class="px-2">
                        <v-icon small color="white" >mdi-phone-incoming</v-icon>
                    </v-chip>
                    <v-chip icon v-if="item.call_status=='Lost'" color="#ff5e57" class="px-2">
                        <v-icon small color="white">mdi-phone-incoming</v-icon>
                    </v-chip>
                    <v-chip icon v-if="item.call_status=='Self-service'" color="#febc2d" class="px-2">
                        <v-icon small color="white">mdi-phone-incoming</v-icon>
                    </v-chip>
                    <v-chip icon v-if="item.call_status=='Lost_by_agent'" class="px-2">
                        <v-icon small>mdi-alert</v-icon>
                    </v-chip>
                    <v-chip icon v-if="item.call_status=='Voicemail'" color="primary" class="px-2">
                        <v-icon small color="white">mdi-voicemail</v-icon>
                    </v-chip>
                </div>
            </template>
            <!-- Nota -->
            <template v-slot:[`item.noteIcon`]="{ item }">
                <v-chip icon @click="writeNote(item)" color="amber lighten-4" class="px-1 botonsote" style="height:25px;">
                    <v-icon small>mdi-note-outline</v-icon>
                </v-chip>
            </template>
        </v-data-table>
        <!--Dialogo de nota-->
        <v-dialog v-model="dialogNote" width="400px">
            <v-card class="px-6 pa-6" outlined>
                <div class="mb-2">
                    <span style="font-size:18px; line-height:30px;">Nota de la llamada</span>
                    <br>
                    <span style="font-size:14px;" v-if="editedItem!=null">
                        <strong v-if="companyName(phone(editedItem.call_type, editedItem.dialed_number, editedItem.caller_id))!=undefined">{{this.companyName(this.phone(this.editedItem.call_type, this.editedItem.dialed_number, this.editedItem.caller_id))}} |</strong> 
                        <strong v-else>{{phone(editedItem.call_type, editedItem.dialed_number, editedItem.caller_id)}} |</strong> 
                        {{this.editedItem.date}}
                    </span>
                </div>
                <v-textarea class="space" background-color="amber lighten-4" v-model="note"></v-textarea>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn @click="saveNote()" text :loading="gris" :disabled="gris">
                    GUARDAR
                  </v-btn>
                </v-row>
            </v-card>
        </v-dialog>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../calls/filter"
export default {
    props:{
        company:String
    },
    components: {
        'filterCalls':Filter,
    }, 
    data: () => ({
        filters: false,
        calls: '',
        note:'',
        dialogNote:false,
        editedItem:null,
        gris:false,
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
            this.calls = this.callsLists
            return [
            { text: 'Estado', value: 'call_type', sortable: false},
            this.showCompany,
            { text: 'Contacto', value: 'contact' },
            { text: 'Número Telefónico', value: 'phone' },
            { text: 'Duración', value: 'duration' },
            { text: 'Agente', value: 'user' },
            { text: 'Fecha', value: 'date', align: 'start'},
            { text: 'Nota', value: 'noteIcon'},
        ]},
        callsLists(){
            var calls = this.$store.state.call.calls
            calls = calls.map(id=>{
                return{
                    id:id.id,
                    call_type:id.call_type,
                    call_status:id.call_status,
                    date:id.date,
                    duration:id.duration,
                    phone:this.phone(id.call_type, id.dialed_number, id.caller_id),
                    user:this.salesman(id.callpicker_number),
                    records:this.perro(id.records),
                    company:this.companyName(this.phone(id.call_type, id.dialed_number, id.caller_id)),
                    contact:this.contactName(this.phone(id.call_type, id.dialed_number, id.caller_id)),
                    note:id.note
                }
            });

            if(this.company!='' && this.company!=undefined && this.company!=null){
                calls = calls.filter(call=>this.phone(call.call_type, call.dialed_number, call.caller_id) == this.company)
            }

            return calls
        },
    },
    created () {
        this.$store.dispatch('call/getCalls')
        this.calls = this.callsLists   
    },
    mounted() {
            //websockets
            Echo.channel('test').listen('Test', (e) => {
                this.$store.dispatch('call/getCalls')

            })
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
        writeNote(item){
            this.note=item.note
            this.dialogNote = true
            this.editedItem = this.$store.state.call.calls.filter(call=>call.id == item.id)[0]
        },
        saveNote(){
            this.editedItem.note = this.note
            this.gris = true
            this.$nextTick(() => {
                axios.put(process.env.VUE_APP_BACKEND + "api/v1/call/update",Object.assign(this.editedItem)).then(response=>{
                    this.note=''
                    this.dialogNote = false
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            })
        },
        perro(a){
            if(a!=null){
                var b = a.split(','), c=[]
                for(var i=0; i<b.length; i++){
                    c[i] = b[i].replace(/['"]+/g, '').replace(/[\[\]']+/g,'')
                }
            }
            return c
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
        
        filtersCall: function(params) {
            if(this.company!='' && this.company!=undefined && this.company!=null){
                var filterCall = this.$store.state.call.calls.filter(call=>call.status == 'vendido').filter(call=>call.company_id == this.company)
            }else{
                var filterCall = this.$store.state.call.calls.filter(call=>call.status == 'vendido')
            }
            if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
                var uno = filterCall.filter(call=>call.company_id == params.company_id[0])
                for(var i=1; i<params.company_id.length; i++){
                    uno=uno.concat(filterCall.filter(call=>call.company_id == params.company_id[i]))   
                }
                filterCall = this.removeDuplicates(uno, "id");
            }
            if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
                var dos = filterCall.filter(call=>call.contact_id == params.contact_id[0])
                for(var i=1; i<params.contact_id.length; i++){
                    dos=dos.concat(filterCall.filter(call=>call.contact_id == params.contact_id[i]))   
                }
                filterCall = this.removeDuplicates(dos, "id");
            }
            if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                var tres = filterCall.filter(call=>call.user_id == params.user_id[0])
                for(var i=1; i<params.user_id.length; i++){
                    tres=tres.concat(filterCall.filter(call=>call.user_id == params.user_id[i]))   
                }
                filterCall = this.removeDuplicates(tres, "id");
            }
            if(params.items!=''&&params.items!=undefined&&params.items!=null){
                var cinco = filterCall.filter(call=>this.check(call.items, params.items[0]) == 'contain')
                for(var i=1; i<params.items.length; i++){
                    cinco=cinco.concat(filterCall.filter(call=>this.check(call.items, params.items[0]) == 'contain'))   
                }
                filterCall = this.removeDuplicates(cinco, "id");
            }
            if(params.note!=''){
                filterCall=filterCall.filter(call=>this.lowerCase(call.note).includes(params.note.toLowerCase()))
            }
            if(params.dateCreateFrom!='' && params.dateCreateFrom!=null && params.dateCreateFrom!=undefined){
                filterCall=filterCall.filter(call=>new Date(call.updated_at) > new Date(params.dateCreateFrom))
            }
            if(params.dateCreateTo!='' && params.dateCreateTo!=null && params.dateCreateTo!=undefined){
                var dateTwo = new Date(new Date(params.dateCreateTo).setDate(new Date(params.dateCreateTo).getDate() + 1))
                filterCall=filterCall.filter(call=>new Date(call.updated_at) <= dateTwo)
            }
            this.calls = filterCall.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
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
            let data = XLSX.utils.json_to_sheet(this.calls)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Cotizaciones'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        salesman(phone){
            return this.$store.state.user.users.filter(user=>user.phone == phone).map(user => user.name)[0]
        },
        companyID(name){
            return this.$store.state.company.companies.filter(company=>company.name == name).map(company => company.id)[0]
        },
        companyName(phone){
            if(this.contactName(phone)!=undefined){
                return this.$store.state.company.companies.filter(company=>company.id == this.contactId(phone)).map(company => company.name)[0]
            }else{
                return this.$store.state.company.companies.filter(company=>company.phone == phone).map(company => company.name)[0]
            }
        },
        contactName(phone){
            return this.$store.state.contact.contacts.filter(contact=>contact.phone == phone).map(contact => contact.name + " " + contact.last)[0]
        },
        contactId(phone){
            return this.$store.state.contact.contacts.filter(contact=>contact.phone == phone).map(contact => contact.company_id)[0]
        },
        
        phone(type, dialed_number, caller_id){
            if(type=='inbound'){
                return caller_id
            }
            if(type=='outbound'){
                return dialed_number
            }
        }
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
    .v-bottom-sheet{
        box-shadow: none!important;
    }
    .botonsote:hover{
        transform: scale(1.3);
        transition-property: transform;
        transition-duration: .7s;
    }
</style>