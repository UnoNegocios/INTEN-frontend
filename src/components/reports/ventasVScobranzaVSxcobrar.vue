<template>
    <v-card class="elevation-0">
        <!-- Header -->
        <v-toolbar class="px-6 py-4 mb-6" flat >
            <v-toolbar-title class="mr-3">Reporte</v-toolbar-title>
            <v-menu offset-y :close-on-content-click="closeDatePicker">
                <template v-slot:activator="{ on, attrs }">
                    <v-chip small v-bind="attrs" v-on="on" class="mr-2">
                        <v-icon small class="mr-2">mdi-calendar-search</v-icon> {{dates[0]}} - {{dates[1]}}
                    </v-chip>
                </template>
                <v-date-picker v-model="dates" range></v-date-picker>
            </v-menu>
            <!--v-autocomplete 
            v-model="users" 
            :items="usersList" 
            hide-no-data 
            item-value="id" 
            item-text="name" 
            label="Vendedor(es)" 
            placeholder="Escribe para buscar" 

            chips 
            multiple
            deletable-chips
            small-chips
            rounded
            >
            <template v-slot:selection="{ item, index }">
                <v-chip style="max-width:80px;" class="mt-1" small v-if="index <= 2">
                    <span class="text-truncate">{{ item.name }} {{ item.last }}</span>
                </v-chip>
                <span v-if="index === 2" class="grey--text text-caption">
                (+{{ users.length - 3 }} más)
                </span>
            </template>
            </v-autocomplete-->
            <v-spacer></v-spacer>
            <v-btn @click="how='mes'" :class="button('mes')" style="margin-right:10px;" rounded>MES</v-btn>
            <v-btn @click="how='dia'" :class="button('dia')" rounded>DIA</v-btn>
        </v-toolbar>
        <div v-if="loading">perro </div>
        <apexchart v-else type="area" height="500" :options="optionsSales" :series="seriesSales"></apexchart>
    </v-card>
</template>

<script>
export default {
    created(){
        this.$store.dispatch('reports/getSalemanReport')
    },
    data: function () { 
        return{
            accumulator:0,
            dates:[],
            users:[],
            optionsSales: {
                xaxis: {
                    type: "datetime"
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return "$" + new Intl.NumberFormat("es-MX").format(value);
                        },
                    },
                },
                dataLabels: {
                    formatter: function (value) {
                        return "$" + new Intl.NumberFormat("es-MX").format(value);
                    },
                },
                colors: ['#1c256a', '#1f88fe', '#ff8500'],
            },
            how:'dia'
        }
    },
    computed: {
        loading(){
            return this.$store.state.reports.saleman_report_loader
        },
        usersList(){
            return this.$store.state.user.users.map(id => {
                return{
                    id:id.id,
                    name:id.name + id.last,
                }
            })
        },
        seriesSales(){
            var perro = [{
                name: 'Ventas',
                type: 'area',
                data: this.$store.state.reports.saleman_report.daily_sales_total,
            },{
                name: 'Cobranza',
                type: 'area',
                data: this.$store.state.reports.saleman_report.daily_collections_total,
                
            },{
                name: 'Cuentas por Cobrar',
                type: 'area',
                data: this.$store.state.reports.saleman_report.collection_pending_accounts_total,
            }]
            return perro
        },
        closeDatePicker(){
            if(this.dates.length==2){
                return true
            }else{
                return false
            }
        },
    },
    methods:{
        addUser(id){
            this.users = this.users.concat(id)
            this.search = ''
        },
        button(item){
            if(item == 'dia' && this.how=='dia'){
                return 'active elevation-0'
            }else if(item == 'mes' && this.how=='mes'){
                return 'active elevation-0'
            }else{
                return 'inactive elevation-0'
            }
        }
    }
}
</script>

<style>
.active{
    background-color: #1f88fe!important;
}
.inactive{
    background-color: transparent!important;
    border: solid 2px #1f88fe!important;
}
.active span{
    color:white!important;
}
.inactive span{
    color:#1f88fe!important;
}
</style>