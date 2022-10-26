<template>
    <v-container class="ma-0 pa-0 pb-8">
        <v-row class="pt-10 px-8 pb-12">
            <strong>Filtros</strong>
            <v-spacer></v-spacer>
            <v-btn @click="removeFilter()" small class="elevation-0" style="border:solid 1px #dddddd;">
                <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
            </v-btn>

            <v-autocomplete v-model="quotation.client_id" :items="clientsList" :loading="isLoadingClients" :search-input.sync="searchClients" hide-no-data item-value="id" item-text="name" label="Cliente" placeholder="Escribe para buscar" attach chips multiple>
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

            <v-autocomplete @keydown.enter="filter()" v-model="quotation.user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Usuario(s)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>
            <v-autocomplete @keydown.enter="filter()" v-model="quotation.created_by_user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Creador(es)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>
            <v-autocomplete @keydown.enter="filter()" v-model="quotation.last_updated_by_user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Editor(es)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>

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
            
            <v-select @keydown.enter="filter()" label="Mostrador" v-model="quotation.bar" :items="booleans"></v-select>

            <v-text-field @keydown.enter="filter()" label="Id" v-model="quotation.id"></v-text-field>
            <v-text-field @keydown.enter="filter()" label="IMEI" v-model="quotation.imei"></v-text-field>
            <v-text-field @keydown.enter="filter()" label="NIR" v-model="quotation.nir"></v-text-field>
            <v-text-field @keydown.enter="filter()" label="SIM" v-model="quotation.sim"></v-text-field>
            <v-text-field @keydown.enter="filter()" label="Descripción" v-model="quotation.description"></v-text-field>

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
        quotation:{
            //multiples axios
            client_id:'',
            //multiples store
            user_id:'',
            created_by_user_id:'',
            last_updated_by_user_id:'',
            //abierto
            id:'',
            description:'',
            imei:'',
            nir:'',
            sim:'',
            //boolean
            pos_sale:'',
            //date
            date:[],
            created_at:[],
            updated_at:[]
        },
        isLoadingClients: false,
        searchClients: null,
        entries:{
            clients: []
        },
    }),
    watch: {
        searchClients(val){
            if (this.clientsList.length > 0) return
            if (this.isLoadingClients) return
            this.isLoadingClients= true
            axios.get(process.env.VUE_APP_BACKEND + 'api/v1/client/search?filter[name]='+val)
            .then(res => {
                this.entries.clients = res.data.data
            }).finally(() => (this.isLoadingClients = false))
        },
    },
    computed:{
        clientsList(){
            return this.entries.clients.map(id => {
                return{
                    id:id.id,
                    name:id.name,
                    razon_social:id.razon_social
                }
            })
        },
        userList(){
            return this.$store.state.user.users.map(id => {
                return{
                    id:id.id,
                    name:id.name + id.last,
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
            if(dates!=null){
                if(dates.length==2){
                    return true
                }else{
                    return false
                }
            }else{
                this.quotation.date = []
            }
        },
        filter(){
            var count = 0
            var filter = ''
            //abierto
            if(this.quotation.id!=''){
                count = count+1
                filter = filter + '&filter[id]='+this.quotation.id
            }
            if(this.quotation.description!=''){
                count = count+1
                filter = filter + '&filter[description]='+this.quotation.description
            }
            if(this.quotation.imei!=''){
                count = count+1
                filter = filter + '&filter[imei]='+this.quotation.imei
            }
            if(this.quotation.nir!=''){
                count = count+1
                filter = filter + '&filter[nir]='+this.quotation.nir
            }
            if(this.quotation.sim!=''){
                count = count+1
                filter = filter + '&filter[sim]='+this.quotation.sim
            }
            //multiples
            if(this.quotation.client_id.length>0){
                count = count+1
                filter = filter + '&filter[client_id]='
                var length = this.quotation.client_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.client_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.quotation.user_id.length>0){
                count = count+1
                filter = filter + '&filter[user_id]='
                var length = this.quotation.user_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.user_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.quotation.created_by_user_id.length>0){
                count = count+1
                filter = filter + '&filter[created_by_user_id]='
                var length = this.quotation.created_by_user_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.created_by_user_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            console.log('0')
            if(this.quotation.last_updated_by_user_id.length>0){
                count = count+1
                filter = filter + '&filter[last_updated_by_user_id]='
                var length = this.quotation.last_updated_by_user_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.last_updated_by_user_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            console.log('1')
            //select
            if(this.quotation.pos_sale!==''){
                count = count+1
                filter = filter + '&filter[pos_sale]='+this.quotation.pos_sale
            }
            console.log('2')
            //date
            if(this.quotation.date.length==2){
                count = count+1
                filter = filter + '&filter[date_between]=' + this.quotation.date[0] + ',' + this.quotation.date[1]
            }
            console.log('3')
            if(this.quotation.created_at.length==2){
                count = count+1
                filter = filter + '&filter[created_between]=' + this.quotation.created_at[0] + ',' + this.quotation.created_at[1]
            }
            console.log('4')
            if(this.quotation.updated_at.length==2){
                count = count+1
                filter = filter + '&filter[updated_between]=' + this.quotation.updated_at[0] + ',' + this.quotation.updated_at[1]
            }
            console.log('5')
            localStorage.setItem('selectorFiltersSales', JSON.stringify(this.quotation));
            localStorage.setItem('entriesFiltersSales', JSON.stringify(this.entries));
            console.log('6')
            localStorage.setItem('filtersSales', JSON.stringify(filter.slice(1,filter.length)));
            localStorage.setItem('filtersSalesLength', count)

            this.$nextTick(() => {
                this.$emit("filtersSale", false);
                this.$store.dispatch('quotation/getTotals')
            })
        },
        removeFilter(){
            this.quotation={
                //multiples axios
                client_id:'',
                //multiples store
                user_id:'',
                created_by_user_id:'',
                last_updated_by_user_id:'',
                //abierto
                id:'',
                description:'',
                imei:'',
                nir:'',
                sim:'',
                //boolean
                pos_sale:'',
                //date
                date:[],
                created_at:[],
                updated_at:[]
            },
            this.entries={
                companies: [],
                contacts:[]
            },
            localStorage.removeItem("selectorFiltersSales")
            localStorage.removeItem("filtersSales")
            localStorage.removeItem("entriesFiltersSales")
            localStorage.removeItem("filtersSalesLength")
            this.$nextTick(() => {
                this.$store.dispatch('quotation/getTotals')
                this.$emit("filtersSale", false);
            })
        }
    }
}
</script>

<style>

</style>