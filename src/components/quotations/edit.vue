<template>
    <v-card>
        <v-card-title class="pb-0 pt-1" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span >Editar {{quole}}</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="3">
                <v-autocomplete  :rules="[v => !!v || 'Campo requerido']" v-if="permissions('assignQuotations')" clearable v-model="quotation.user_id" :items="usersLists" label="Vendedor" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else-if="quotation.user_id=currentUser.id" disabled v-model="quotation.user_id" :items="usersLists" label="Vendedor" item-text="name" item-value="id">                
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="2" class="pb-0 mb-0">
                <v-checkbox v-model="quotation.pos_sale" label="Recarga"></v-checkbox>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row class="py-6">
                    <v-col class="pt-0" cols="12" sm="6" md="6">
                        <v-autocomplete v-model="quotation.client_id" :items="clientsList" :loading="isLoadingClients" :search-input.sync="searchClients" hide-no-data item-value="id" item-text="name" label="Cliente" placeholder="Escribe para buscar" attach>
                            <template v-slot:item="{item, attrs, on}">
                                <v-list-item v-on="on" v-bind="attrs">
                                    <v-list-item-content>
                                        <v-list-item-title v-if="item.name!=null">
                                            {{item.name}}
                                        </v-list-item-title>
                                        <v-list-item-title v-else-if="item.razon_social!=null">
                                            {{item.razon_social}}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template> 
                        </v-autocomplete>
                    </v-col>
                    <v-col class="pt-0" cols="12" sm="6" md="6">
                        <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.activation_date" label="Fecha de Activaci??n" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="quotation.activation_date" @input="datePicker = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <!--v-col class="pt-0" cols="12" sm="6" md="4">
                        <v-autocomplete clearable v-model="quotation.activation_hour" prepend-icon="mdi-clock-outline" :items="hours" label="Hora de Activaci??n">               
                        </v-autocomplete>
                    </v-col--> 
                </v-row>
                <!--ALAN-->
                <!--v-row class="pb-6 mt-0 pt-0">
                     <v-col class="pt-0" cols="12" sm="6" md="4">
                        <v-text-field v-model="quotation.imei" label="IMEI"></v-text-field>
                    </v-col>
                    <v-col class="pt-0" cols="12" sm="6" md="4">
                        <v-text-field v-model="quotation.nir" label="NIR"></v-text-field>
                    </v-col>
                     <v-col class="pt-0" cols="12" sm="6" md="4">
                        <v-text-field v-model="quotation.sim" label="SIM"></v-text-field>
                    </v-col>
                </v-row-->
                <!--ALAN-->
                <v-row style="background-color: #94949417;" class="px-2 ma-0 py-2 " v-for="(item,k) in quotation.items" :key="k">
                    <v-col ols="12" sm ="4" md="1" class="py-0 my-0">
                        <v-text-field type=number v-model="item.quantity" label="Cantidad"></v-text-field><!--:disabled="yanohay(item.quantity, item.item, k)" -->
                    </v-col>
                    <v-col ols="12" sm ="8" md="6" class="py-0 my-0">
                         <v-autocomplete v-model="item.cellular_plan_id" :items="devicesList" item-value="id" item-text="name" label="Producto"> 
                            <template v-slot:item="{item, attrs, on}">
                                <v-list-item v-on="on" v-bind="attrs">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{item.name}} | {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template> 
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm ="8" md="4" class="py-0 my-0" v-if="item.cellular_plan_id!=''">
                        <v-text-field disabled v-model="item.price" prefix="$" suffix="c/u" label="Precio"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm ="4" md="1">
                        <v-icon @click="remove(k)" v-show="k || ( !k && quotation.items.length > 1)" color="red">mdi-close</v-icon>
                        <v-icon @click="add(k)" v-show="k == quotation.items.length-1" color="primary">mdi-plus</v-icon>
                    </v-col>
                </v-row>

                <v-row class="mt-1 px-6">
                    <v-col cols="12" sm="6" md="6">
                        <v-container fluid>
                            <v-textarea v-model="quotation.description" label="Descripcion"></v-textarea>
                        </v-container>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <!--v-autocomplete clearable  v-model="quotation.payment_method_id" :items="paymentMethods" item-value="id" item-text="method" label="Metodo de Pago">
                        <template slot="no-data" class="pa-2">No existen Metodos de Pago relacionados.</template>
                        </v-autocomplete-->
                        <v-text-field class="my-4" disabled v-if="quotation.subtotal=totalQuotation" v-model="quotation.subtotal" prefix="$" label="Monto en Pesos"></v-text-field>
                    </v-col>
                </v-row>
                
            </v-container>
        </v-card-text>
        <v-row class="ma-0 pa-0">
            <v-col cols="12" sm="12" md="6">
                <v-menu top offset-x class="hidden-md-and-down">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn style="font-size:12px;" text v-bind="attrs" v-on="on">
                            <v-icon class="mr-2">mdi-attachment</v-icon> Adjuntar archivo
                        </v-btn>
                    </template>
                    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
                </v-menu>
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-card-actions>
                    <v-spacer class="hidden-md-and-down"></v-spacer>

                    <v-btn color="blue darken-1" text @click="close">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save"  :loading="gris" :disabled="gris || grey">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
        <!-- Crear empresa -->
        <v-dialog v-model="createCompanyDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e74919" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createCompany @closeCreateDialogCompany="closeCreateDialogCompany"/>
        </v-dialog>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>

<script>
    import vue2Dropzone from "vue2-dropzone";
    import "vue2-dropzone/dist/vue2Dropzone.min.css";
    import CreateCompany from "../clients/companies/create"
    import axios from "axios";
    export default {
        props:{
            message:Array,
            quotation:Object
        }, 
        components: {
            vueDropzone: vue2Dropzone,
            'createCompany':CreateCompany,
        },   
        
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            company:'',
            status:'',
            datePicker:'',
            datePicker2:'',
            createContactDialog: false,
            createCompanyDialog: false,
            datePicker:'',
            dropzoneOptions: {
                url: process.env.VUE_APP_BACKEND + "api/v1/quotation/files",
                addRemoveLinks: true,
                maxFiles: 1
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
            isLoadingClients: false,
            isLoadingDevices: false,
            searchClients: null,
            searchDevices: null,
            entries:{
                clients: [],
                devices: []
            },
        }),
        watch: {
            quotation:{
                handler(){
                    this.entries.clients = [this.quotation.client] 
                }, deep:true
            },
            items:{
                handler(){
                    for(var i=0; i<this.quotation.items.length; i++){
                        this.quotation.items[i].price = this.devicesList.filter(item=>item.id == this.quotation.items[i].cellular_plan_id).map(item=>item.price)[0]
                    }
                },deep:true
            },
            searchClients(val){
                //if (this.clientsList.length > 0) return
                if (this.isLoadingClients) return
                this.isLoadingClients= true
                axios.get(process.env.VUE_APP_BACKEND + 'api/v1/client/search?filter[name]='+val)
                .then(res => {
                    if(this.entries.clients.length>0){
                        this.entries.clients.concat(res.data.data)
                    }else{
                        this.entries.clients = res.data.data
                    }
                }).finally(() => (this.isLoadingClients = false))
            },
        },
        computed: {
            items(){
                return this.quotation.items
            },
            grey(){
                var items = 0
                for(var i=0; i<this.quotation.items.length; i++){
                    if(this.quotation.items[i].cellular_plan_id!=''&&this.quotation.items[i].cellular_plan_id!=null&&this.quotation.items[i].cellular_plan_id!=undefined){
                        items = items+1
                    }
                }
                if((this.quotation.client_id==''||this.quotation.client_id==null||this.quotation.client_id==undefined)||items!=this.quotation.items.length){
                    return true
                }else{
                    return false
                }
            },
            clientsList(){
                return this.entries.clients.map(id => {
                    return{
                        id:id.id,
                        name:id.name,
                        razon_social:id.razon_social
                    }
                })
            },
            devicesList(){
                return this.$store.state.item.items
            },
            usersLists(){
                return this.$store.state.user.users;
            }, 
            paymentMethods(){
                return this.$store.state.payment_method.payment_methods;
            },
            totalQuotation(){
                var total=0
                if(this.quotation.items.length!=0){
                for(var i=0; i<this.quotation.items.length; i++){
                    if(this.quotation.items[i].price!=undefined){
                        total = total+(this.quotation.items[i].price*this.quotation.items[i].quantity)
                    }
                }
                return total
                }
            }, 
            currentUser:{
                get(){
                    return this.$store.state.currentUser.user
                }
            },
            quole(){
                if(this.status=='vendido'){
                    return 'Venta'
                }else if(this.status=='quotation'){
                    return 'Cotizaci??n'
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
        },
        created(){
            this.entries.clients = [this.quotation.client]      
        },
        methods: {
            cero(i){
                if(i<10){
                    return '0' + i
                }else{
                    return i
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
            uploadSuccess(file, response) {
                console.log('File Successfully Uploaded with file name: ' + response.file);
                this.fileName = response.file;
                this.quotation.pdf = this.fileName;
            },
            uploadError(file, message) {
                console.log('An Error Occurred');
            },
            fileRemoved() {
                
            },
            add(index) {
                this.quotation.items.push({ quantity: 1, item: '', value:'' });
            },
            remove(index) {
                this.quotation.items.splice(index, 1);
            },
            close () {
                this.gris = false
                this.$nextTick(() => {
                    this.$emit("closeDialogEditQuotation", false);
                })
            },
            save(){
                this.quotation.last_updated_by_user_id = this.currentUser.id
                this.quotation.status = this.status
                for(var i=0; i<this.quotation.items.length; i++){
                    this.quotation.items[i].value = this.devicesList.filter(item=>item.id == this.quotation.items[i].cellular_plan_id).map(item=>item.price)[0]
                    //this.quotation.items[i].cost = this.devicesList.filter(item=>item.id == this.quotation.items[i].item).map(item=>item.cost)[0]
                }
                this.$nextTick(() => {
                    
                    axios.patch(process.env.VUE_APP_BACKEND + "api/v1/sales/"+this.quotation.id,Object.assign(this.quotation)).then(response=>{
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
            closeCreateDialogCompany: function(params) {
                this.createCompanyDialog = params;
                this.$store.dispatch('company/getCompanies')
            },
        },
    }
</script>
<style lang="css" scoped>
    .v-text-field >>> label{
        font-size: 14px!important;
    }
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