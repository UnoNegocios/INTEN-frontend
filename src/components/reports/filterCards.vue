<template>
    <v-container class="ma-0 pa-0 pb-8">
        <v-row class="pt-10 px-8 pb-12">
            <strong>Filtros</strong>
            <v-spacer></v-spacer>
            <v-btn @click="removeFilter()" small class="elevation-0" style="border:solid 1px #dddddd;">
                <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
            </v-btn>

            <v-autocomplete @keydown.enter="filter()" v-model="quotation.company_id" :items="companyLists" :loading="isLoadingCompany" :search-input.sync="searchCompanies" hide-no-data item-value="id" item-text="name" label="Empresa(s)" placeholder="Escribe para buscar" attach chips multiple>
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

            <v-autocomplete @keydown.enter="filter()" v-model="quotation.user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Usuario(s)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>
            <v-autocomplete @keydown.enter="filter()" v-model="quotation.sales_man" :items="userList" hide-no-data item-value="id" item-text="name" label="Vendedor(es)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>
            <!--v-autocomplete @keydown.enter="filter()" v-model="quotation.last_updated_by_user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Editor(es)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete-->

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

            <v-select @keydown.enter="filter()" label="Recarga" v-model="quotation.bar" :items="booleans"></v-select>
            <v-select @keydown.enter="filter()" label="Serie" v-model="quotation.type" :items="series"></v-select>

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
        series:['Serie A', 'Serie B'],
        quotation:{
            //multiples axios
            company_id:'',
            //multiples store
            user_id:'',
            sales_man:'',
            //select data
            type:'',
            //boolean
            bar:'',
            //date
            date:[],
            created_at:[],
            updated_at:[],
        },
        entries:{
            companies: [],
        },
        isLoadingCompany: false,
        searchCompanies: null,
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
        if(localStorage.getItem('selectorFiltersCards')!=undefined){
            this.quotation = JSON.parse(localStorage.getItem('selectorFiltersCards'))
            this.entries = JSON.parse(localStorage.getItem('entriesFiltersCards'))
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
            var count = 0
            var filterSale = ''
            var filterCollection = ''
            var filterPastDue = ''
            if(this.quotation.company_id.length>0){
                //sale
                count = count+1
                filterSale = filterSale + '&filter[company_id]='
                var length = this.quotation.company_id.length
                for(var i=0; i<length; i++){
                    filterSale = filterSale + this.quotation.company_id[i]
                    if(length>1 && i<length-1){
                        filterSale = filterSale + ','
                    }
                }
                //past_due
                count = count+1
                filterPastDue = filterPastDue + '&filter[company_id]='
                var length = this.quotation.company_id.length
                for(var i=0; i<length; i++){
                    filterPastDue = filterPastDue + this.quotation.company_id[i]
                    if(length>1 && i<length-1){
                        filterPastDue = filterPastDue + ','
                    }
                }
                //collection
                filterCollection = filterCollection + '&filter[collection.company_id]='
                var length = this.quotation.company_id.length
                for(var i=0; i<length; i++){
                    filterCollection = filterCollection + this.quotation.company_id[i]
                    if(length>1 && i<length-1){
                        filterCollection = filterCollection + ','
                    }
                }
            }
            if(this.quotation.user_id.length>0){
                count = count+1
                //sale
                filterSale = filterSale + '&filter[user_id]='
                var length = this.quotation.user_id.length
                for(var i=0; i<length; i++){
                    filterSale = filterSale + this.quotation.user_id[i]
                    if(length>1 && i<length-1){
                        filterSale = filterSale + ','
                    }
                }
                //past_due
                filterPastDue = filterPastDue + '&filter[user_id]='
                var length = this.quotation.user_id.length
                for(var i=0; i<length; i++){
                    filterPastDue = filterPastDue + this.quotation.user_id[i]
                    if(length>1 && i<length-1){
                        filterPastDue = filterPastDue + ','
                    }
                }
                //collection
                filterCollection = filterCollection + '&filter[collection.user_id]='
                var length = this.quotation.user_id.length
                for(var i=0; i<length; i++){
                    filterCollection = filterCollection + this.quotation.user_id[i]
                    if(length>1 && i<length-1){
                        filterCollection = filterCollection + ','
                    }
                }
            }
            if(this.quotation.sales_man.length>0){
                count = count+1
                //sale
                filterSale = filterSale + '&filter[company.user_id]='
                var length = this.quotation.sales_man.length
                for(var i=0; i<length; i++){
                    filterSale = filterSale + this.quotation.sales_man[i]
                    if(length>1 && i<length-1){
                        filterSale = filterSale + ','
                    }
                }
                //past_due
                filterPastDue = filterPastDue + '&filter[company.user_id]='
                var length = this.quotation.sales_man.length
                for(var i=0; i<length; i++){
                    filterPastDue = filterPastDue + this.quotation.sales_man[i]
                    if(length>1 && i<length-1){
                        filterPastDue = filterPastDue + ','
                    }
                }
                //collection
                filterCollection = filterCollection + '&filter[company.user_id]='
                var length = this.quotation.sales_man.length
                for(var i=0; i<length; i++){
                    filterCollection = filterCollection + this.quotation.sales_man[i]
                    if(length>1 && i<length-1){
                        filterCollection = filterCollection + ','
                    }
                }
            }
            if(this.quotation.type!=''){
                count = count+1
                //sale
                filterSale = filterSale + '&filter[type]='+this.quotation.type
                //past_due
                filterPastDue = filterPastDue + '&filter[type]='+this.quotation.type
                //collection
                filterCollection = filterCollection + '&filter[sale.type]='+this.quotation.type
            }
            if(this.quotation.bar!==''){
                count = count+1
                //sale
                filterSale = filterSale + '&filter[bar]='+this.quotation.bar
                //past_due
                filterPastDue = filterPastDue + '&filter[bar]='+this.quotation.bar
                //collection
                filterCollection = filterCollection + '&filter[sale.bar]='+this.quotation.bar
            }
            //date
            if(this.quotation.date.length==2){
                count = count+1
                //sale & past_due
                filterSale = filterSale + '&filter[date_between]=' + this.quotation.date[0] + ',' + this.quotation.date[1]
                //collection
                filterCollection = filterCollection + '&filter[collection.date_between]=' + this.quotation.date[0] + ',' + this.quotation.date[1]
            }
            if(this.quotation.created_at.length==2){
                count = count+1
                //sale & past_due
                filterSale = filterSale + '&filter[created_between]=' + this.quotation.created_at[0] + ',' + this.quotation.created_at[1]
                //collection
                filterCollection = filterCollection + '&filter[created_between]=' + this.quotation.created_at[0] + ',' + this.quotation.created_at[1]
            }
            if(this.quotation.updated_at.length==2){
                count = count+1
                //sale & past_due
                filterSale = filterSale + '&filter[updated_between]=' + this.quotation.updated_at[0] + ',' + this.quotation.updated_at[1]
                //collection
                filterCollection = filterCollection + '&filter[updated_between]=' + this.quotation.updated_at[0] + ',' + this.quotation.updated_at[1]
            }

            localStorage.setItem('filtersCardsSale', JSON.stringify(filterSale.slice(1,filterSale.length)));
            localStorage.setItem('filtersCardsCollection', JSON.stringify(filterCollection.slice(1,filterCollection.length)));
            localStorage.setItem('filtersCardsPastDue', JSON.stringify(filterPastDue.slice(1,filterPastDue.length)));

            localStorage.setItem('selectorFiltersCards', JSON.stringify(this.quotation));
            localStorage.setItem('entriesFiltersCards', JSON.stringify(this.entries));
            localStorage.setItem('filtersCardsLength', count)

            this.$nextTick(() => {
                this.$emit("filterCards", false);
                this.$store.dispatch('cards/getSaleTotals')
                this.$store.dispatch('cards/getCollectionTotals')
            })
        },
        removeFilter(){
            this.quotation={
                company_id:'',
                user_id:'',
                created_by_user_id:'',
                last_updated_by_user_id:'',
                type:'',
                bar:'',
                date:[],
                created_at:[],
                updated_at:[],
            },
            this.entries={
                companies: [],
            },
            localStorage.removeItem("selectorFiltersCards")

            localStorage.removeItem("filtersCardsSale")
            localStorage.removeItem("filtersCardsCollection")
            localStorage.removeItem("filtersCardsPastDue")

            localStorage.removeItem("entriesFiltersCards")
            localStorage.removeItem("filtersCardsLength")
            this.$nextTick(() => {
                this.$store.dispatch('cards/getSaleTotals')
                this.$store.dispatch('cards/getCollectionTotals')
                this.$emit("filterCards", false);
            })
        }
    }
}
</script>

<style>
    .v-text-field {
        padding-top: 0px;
        margin-top: 0px;
    }
</style>