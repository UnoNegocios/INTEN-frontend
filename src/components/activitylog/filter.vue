<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8">
            <strong>Filtros</strong>
            <v-row class="pt-2">
                <v-col cols="6">
                    <v-switch small v-model="logs.what.create" label="Creación"></v-switch>
                </v-col>
                <v-col cols="6">
                    <v-switch small v-model="logs.what.update" label="Edición"></v-switch>
                </v-col>
            </v-row>
            <v-select @keydown.enter="filter()" v-model="logs.type" :items="types" item-text="label" item-value="value" attach chips label="Tipo" multiple>
            </v-select>
            <v-select @keydown.enter="filter()" v-model="logs.user_id" :items="userLists" item-text="name" item-value="id" attach chips label="Usuario" multiple>
            </v-select>
            <div class="mt-4">
                Fecha 
                <v-menu v-model="menuFrom" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="logs.dateFrom" label="Desde" clearable prepend-icon="mdi-calendar-today" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="logs.dateFrom" @input="menuFrom = false" clearable></v-date-picker>
                </v-menu>

                <v-menu v-model="menuTo" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="logs.dateTo" label="Hasta" clearable prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="logs.dateTo" @input="menuTo = false"></v-date-picker>
                </v-menu>
            </div>


            <v-autocomplete v-if="company==undefined" @keydown.enter="filter()" v-model="logs.company_id" :items="companyLists" item-text="name" item-value="id" attach chips label="Empresa" multiple>
            </v-autocomplete>


            <v-autocomplete @keydown.enter="filter()" item-text="name" v-model="logs.contact_id" :items="contactLists" item-value="id" attach chips label="Contacto" multiple>
                <template slot="no-data" class="pa-2">No existen contactos relacionados.</template>  
                <template v-slot:item="{item, attrs, on}">
                    <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                        <v-list-item-action class="mr-2">
                            <v-checkbox :input-value="active"></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{item.name}} <v-chip v-if="logs.company_id==null || logs.company_id.length>1 || logs.company_id.length==0" small class="ml-2"  style="font-size:8px;">{{companyName(item.company_id)}}</v-chip>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template> 
            </v-autocomplete>
            
            
            <v-autocomplete @keydown.enter="filter()" v-model="logs.salesmen" :items="userLists" item-text="name" item-value="id" attach chips label="Vendedor" multiple>
            </v-autocomplete>
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
  export default {
    props:{
        company:String
    },
    data: () => ({
        menuTo:false,
        menuFrom:false,
        logs:{
            company_id:null,
            contact_id:'',
            dateFrom:'',
            dateTo:'',
            user_id:'',
            salesmen:'',
            type:'',
            what:{create:true,update:true}
        },
        types:[
            {label:'Actividades',value:'Calendar'},
            {label:'Cotizaciones',value:'Quotation'},
            {label:'Empresas',value:'Company'},
            {label:'Contactos',value:'Contact'}]
    }),
    computed: {
        companyLists(){
            return this.$store.state.company.companies;
        },
        contactLists(){
            if(this.logs.company_id!=null){
                if(this.logs.company_id.length==0){
                    return this.$store.state.contact.contacts
                }
                else{
                    var cuatro = this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.logs.company_id[0]);
                    for(var i=1; i<this.logs.company_id.length; i++){
                        cuatro=cuatro.concat(this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.logs.company_id[i]))   
                    }
                    return  cuatro
                }
            }
            else{
                return this.$store.state.contact.contacts
            }
        },
        activityLists(){
            return this.$store.state.activity.activities;
        },  
        userLists(){
            return this.$store.state.user.users;
        }, 
    },
    created () {
        if(this.company!=undefined){
            this.logs.company_id=Number(this.company)
        }
    },
    methods: {
        companyName(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company=>company.name)[0];
        },
        mes(month){
            if(month.length<2){
                return ('0'+month)
            }else{
                return month
            }
        },
        filter(){
            
            if(this.logs.dateFrom==''||this.logs.dateFrom==null||this.logs.dateFrom==undefined){
                this.logs.dateFrom = new Date().getFullYear() + '-' + this.mes((new Date().getMonth()+1).toString()) + '-' + this.zfill(1,2)
            }
            if(this.logs.dateTo==''||this.logs.dateTo==null||this.logs.dateTo==undefined){
                /*if((new Date().getMonth()+1)==2){
                    this.logs.dateTo = new Date().getFullYear() + '-' + this.mes((new Date().getMonth()+1).toString()) + '-28'
                }else{*/
                    this.logs.dateTo = new Date().getFullYear() + '-' + this.mes((new Date().getMonth()+1).toString()) + '-' + this.zfill(new Date().getDate(),2)
                //}
            }
            this.$emit("filtersLogs", this.logs);
        },
        zfill(number, width) {
            var numberOutput = Math.abs(number); /* Valor absoluto del número */
            var length = number.toString().length; /* Largo del número */ 
            var zero = "0"; /* String de cero */  
            
            if (width <= length) {
                if (number < 0) {
                    return ("-" + numberOutput.toString()); 
                } else {
                    return numberOutput.toString(); 
                }
            } else {
                if (number < 0) {
                    return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
                } else {
                    return ((zero.repeat(width - length)) + numberOutput.toString()); 
                }
            }
        }
    }
  }
</script>