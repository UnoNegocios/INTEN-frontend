<template>
    <v-container class="ma-0 pa-0 pb-8">
        <v-row class="pt-10 px-8 pb-12">
            <strong>Filtros</strong>
            <v-spacer></v-spacer>
            <v-btn @click="removeFilter()" small class="elevation-0" style="border:solid 1px #dddddd;">
                <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
            </v-btn>

            <v-autocomplete v-model="quotation.company_id" :items="companyLists" :loading="isLoadingCompany" :search-input.sync="searchCompanies" hide-no-data item-value="id" item-text="name" label="Empresa(s)" placeholder="Escribe para buscar" attach chips multiple>
                <template v-slot:item="{item, attrs, on}">
                    <v-list-item v-on="on" v-bind="attrs">
                        <v-list-item-content>
                            <v-list-item-title v-if="item.name!=null">
                                <span v-if="item.macro!=null">{{item.macro}}</span>{{item.name}}
                                <div v-if="item.razon_social!=null">
                                    <span style="font-size:12px;">{{item.razon_social}}</span>
                                </div>
                            </v-list-item-title>
                            <v-list-item-title v-else-if="item.razon_social!=null">
                                {{item.razon_social}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template> 
            </v-autocomplete>

            <v-autocomplete v-model="quotation.contact_id" :items="contactList" :loading="isLoadingContact" :search-input.sync="searchContacts" hide-no-data item-value="id" item-text="name" label="Contacto(s)" placeholder="Escribe para buscar" attach chips multiple>
                <template v-slot:item="{item, attrs, on}">
                    <v-list-item v-on="on" v-bind="attrs">
                        <v-list-item-content>
                            <v-list-item-title>
                                {{item.name}} <span v-if="item.last!=undefined">{{item.last}}</span>
                                <div>
                                    <span style="font-size:12px;">{{item.company}}</span>
                                </div>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template> 
            </v-autocomplete>

            <v-autocomplete v-model="quotation.user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Responsable(s)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>
            <v-autocomplete v-model="quotation.created_by_user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Creador(es)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>
            <v-autocomplete v-model="quotation.last_updated_by_user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Editor(es)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>

            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.date" label="Fecha" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.date" range></v-date-picker>
            </v-menu>
            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.created_at)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.created_at" label="Fecha Creación" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.created_at" range></v-date-picker>
            </v-menu>
            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.updated_at)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.updated_at" label="Fecha Edición" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.updated_at" range></v-date-picker>
            </v-menu>
            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.invoice_date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.invoice_date" label="Fecha Factura" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.invoice_date" range></v-date-picker>
            </v-menu>
            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.shipping_date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.shipping_date" label="Fecha Envío" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.shipping_date" range></v-date-picker>
            </v-menu>

            <v-select label="Impreso" v-model="quotation.printed" :items="booleans"></v-select>
            <v-select label="Surtido" v-model="quotation.production_dispatched" :items="booleans"></v-select>
            <v-select label="Recarga" v-model="quotation.pos_sale" :items="booleans"></v-select>
            <v-select label="Serie" v-model="quotation.type" :items="series"></v-select>

            <v-text-field label="ID" v-model="quotation.id"></v-text-field>
            <v-text-field label="Nota" v-model="quotation.note"></v-text-field>
            <v-text-field label="Factura/Remisión" v-model="quotation.invoice"></v-text-field>

        </v-row>
        <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary">
            <v-list-item link @click="filter()" dark>
                <v-list-item-content>
                    <strong>Filtrar (0)</strong>
                </v-list-item-content>
            </v-list-item>    
        </v-card>
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        booleans:[{text:'Si', value:1}, {text:'No', value:0}],
        payment_status:['Pagada', 'Pendiente de Pago', 'Vencida', 'En Credito', 'Por Cobrar'],
        series:['Serie A', 'Serie B'],
        quotation:{
            //multiples axios
            company_id:'',
            //multiples store
            user_id:'',
            //abierto
            type:'',
            bar:'',
            //date
            date:[],
            created_at:[],
            updated_at:[],
            invoice_date:[],
            shipping_date:[],
            payment_status:''
        },
        entries:{
            companies: [],
            contacts:[]
        },
        isLoadingCompany: false,
        isLoadingContact: false,
        searchCompanies: null,
        searchContacts: null,
    }),
    watch: {
        searchCompanies(val){
            if (this.companyLists.length > 0) return
            if (this.isLoadingCompany) return
            this.isLoadingCompany = true
            axios.get(process.env.VUE_APP_BACKEND + 'api/v2/company_p?filter[name]='+val)
            .then(res => {
                this.entries.companies = res.data.data
            }).finally(() => (this.isLoadingCompany = false))
        },
        searchContacts(val){
            if (this.contactList.length > 0) return
            if (this.isLoadingContact) return
            this.isLoadingContact = true

            var length = this.quotation.company_id.length
            if(length>0){
                var filter = 'filter[company_id]='
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.company_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }else{
                        filter = filter + "&"
                    }
                }
            }else{
                var filter = ''
            }
            axios.get(process.env.VUE_APP_BACKEND + 'api/v2/contact_p?' + filter + "filter[name]=" + val)
            .then(res => {
                this.entries.contacts = res.data.data
            }).finally(() => (this.isLoadingContact = false))
        },
    },
    computed:{
        companyLists(){
            return this.entries.companies.map(id => {
                return{
                    id:id.id,
                    macro:id.macro,
                    name:id.name,
                    razon_social:id.razon_social
                }
            })
        },
        contactList(){
            return this.entries.contacts.map(id => {
                return{
                    id:id.id,
                    name:id.name,
                    last:id.last,
                    company:id.company.name,
                    job_position:id.job_position
                }
            })
        },
        userList(){
            return this.$store.state.user.users.map(id => {
                return{
                    id:id.id,
                    name:id.name + id.name,
                }
            })
        },
    },
    created(){
        if(localStorage.getItem('selectorFiltersSales')!=undefined){
            this.quotation = JSON.parse(localStorage.getItem('selectorFiltersSales'))
            this.entries = JSON.parse(localStorage.getItem('entriesFiltersSales'))
        }
    },
    methods:{
        closeDatePicker(dates){
            if(dates.length==2){
                return true
            }else{
                return false
            }
        },
        filter(){
            var filter = ''
            //abierto
            if(this.quotation.id!=''){
                filter = filter + '&filter[id]='+this.quotation.id
            }
            if(this.quotation.note!=''){
                filter = filter + '&filter[note]='+this.quotation.note
            }
            if(this.quotation.invoice!=''){
                filter = filter + '&filter[invoice]='+this.quotation.invoice
            }
            //multiples
            if(this.quotation.company_id.length>0){
                filter = filter + '&filter[company_id]='
                var length = this.quotation.company_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.company_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.quotation.contact_id.length>0){
                filter = filter + '&filter[contact_id]='
                var length = this.quotation.contact_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.contact_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.quotation.created_by_user_id.length>0){
                filter = filter + '&filter[created_by_user_id]='
                var length = this.quotation.created_by_user_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.created_by_user_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.quotation.last_updated_by_user_id.length>0){
                filter = filter + '&filter[last_updated_by_user_id]='
                var length = this.quotation.last_updated_by_user_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.last_updated_by_user_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.quotation.user_id.length>0){
                filter = filter + '&filter[user_id]='
                var length = this.quotation.user_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.user_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            //select
            if(this.quotation.type!=''){
                filter = filter + '&filter[type]='+this.quotation.type
            }
            if(this.quotation.printed!==''){
                filter = filter + '&filter[printed]='+this.quotation.printed
            }
            if(this.quotation.production_dispatched!==''){
                filter = filter + '&filter[production_dispatched]='+this.quotation.production_dispatched
            }
            if(this.quotation.pos_sale!==''){
                filter = filter + '&filter[pos_sale]='+this.quotation.pos_sale
            }
            if(this.payment_status!==''){
                filter = filter + '&filter[payment_status]='+this.quotation.payment_status
            }
            //date
            if(this.quotation.date.length==2){
                filter = filter + '&filter[date_between]='+this.quotation.date[0]+','+this.quotation.date[1]
            }
            if(this.quotation.created_at.length==2){
                filter = filter + '&filter[created_at]='+this.quotation.created_at
            }
            if(this.quotation.updated_at.length==2){
                filter = filter + '&filter[updated_at]='+this.quotation.updated_at
            }
            localStorage.setItem('selectorFiltersSales', JSON.stringify(this.quotation));
            localStorage.setItem('entriesFiltersSales', JSON.stringify(this.entries));
            localStorage.setItem('filtersSales', JSON.stringify(filter.slice(1,filter.length)));
            this.$nextTick(() => {
                this.$emit("filtersSale", false);
            })

        },
        removeFilter(){
            this.quotation={
                //multiples axios
                company_id:'',
                contact_id:'',
                //multiples store
                user_id:'',
                created_by_user_id:'',
                last_updated_by_user_id:'',
                //abierto
                id:'',
                note:'',
                invoice:'',
                //select data
                type:'',
                //boolean
                printed:'',
                production_dispatched:'',
                bar:'',
                //date
                date:[],
                created_at:[],
                updated_at:[],
                invoice_date:[]
            },
            localStorage.removeItem("selectorFiltersSales")
            localStorage.removeItem("filtersSales")
            localStorage.removeItem("entriesFiltersSales")
            this.$nextTick(() => {
                this.$emit("filtersSale", false);
            })
        }
    }
}
</script>

<style>

</style>