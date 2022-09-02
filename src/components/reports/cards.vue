<template>
    <v-container>
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filter-cards @filterCards="filterCards"/>
        </v-navigation-drawer>
        <!-- Header -->
        <v-toolbar flat class="px-4 pt-0 mb-6">
            <v-toolbar-title class="mb-4" v-if="filterStorage()">
                Totalizadores
                <br/>
                <span style="font-size:12px; color:grey; position: absolute;">Mes Actual</span>
            </v-toolbar-title>
            <v-toolbar-title class="mb-0" v-else>
                Totalizadores
            </v-toolbar-title>
            <v-spacer/>
            <v-btn icon class="ml-6" v-if="filterStorageLength== undefined" @click="openFilter()">
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
        </v-toolbar>
        <!-- Cards -->
        <div>
            <strong>Ventas</strong>
            <v-row class="ma-0 mb-4">
                <v-col md="4" class="px-2">
                    <v-card class="py-4 px-4 elevation-0">
                        <div v-if="!loading1">
                            <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                            <span style="font-size:14px;"><strong>Subtotal</strong></span>
                            <br/>{{(saleTotals.sum_subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                            <br/><span style="font-size:14px; color:grey;">Promedio:<strong>{{(saleTotals.avg_subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                        </div>
                        <div class="text-center" v-else>
                            <v-progress-circular indeterminate class="my-5" color="grey"></v-progress-circular>
                        </div>
                    </v-card>
                </v-col>
                <v-col md="4" class="px-2">
                    <v-card class="py-4 px-4 elevation-0">
                        <div v-if="!loading1">
                            <v-icon x-small color="#ff6d00" class="mr-1">mdi-circle</v-icon> 
                            <span style="font-size:14px;"><strong>IVA</strong></span>
                            <br/>{{(saleTotals.sum_iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                            <br/><span style="font-size:14px; color:grey;">Promedio:<strong>{{(saleTotals.avg_iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                        </div>
                        <div class="text-center" v-else>
                            <v-progress-circular indeterminate class="my-5" color="grey"></v-progress-circular>
                        </div>
                    </v-card>
                </v-col>
                <v-col md="4" class="px-2">
                    <v-card class="py-4 px-4 elevation-0">
                        <div v-if="!loading1">
                            <v-icon x-small color="#4385f3" class="mr-1">mdi-circle</v-icon> 
                            <span style="font-size:14px;"><strong>Total</strong></span>
                            <br/>{{(saleTotals.sum_total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                            <br/><span style="font-size:14px; color:grey;">Promedio:<strong>{{(saleTotals.avg_total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                        </div>
                        <div class="text-center" v-else>
                            <v-progress-circular indeterminate class="my-5" color="grey"></v-progress-circular>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <strong>Cobranza</strong>
            <v-row class="ma-0">
                <v-col md="4" class="px-2">
                    <v-card class="py-4 px-4 elevation-0">
                        <div v-if="!loading2">
                            <v-icon x-small color="#33a952" class="mr-1">mdi-circle</v-icon> 
                            <span style="font-size:14px;"><strong>Cobrado</strong></span>
                            <br/>{{(collectionTotals.collections_total_sum*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                            <br/><span style="font-size:14px; color:grey;">Promedio:<strong>{{(collectionTotals.collections_total_avg*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                        </div>
                        <div class="text-center" v-else>
                            <v-progress-circular indeterminate class="my-5" color="grey"></v-progress-circular>
                        </div>
                    </v-card>
                </v-col>

                <v-col md="4" class="px-2">
                    <v-card class="py-4 px-4 elevation-0">
                        <div v-if="!loading3">
                            <v-icon x-small color="#fbbc04" class="mr-1">mdi-circle</v-icon> 
                            <span style="font-size:14px;"><strong>Cuentas por Cobrar</strong></span>
                            <br/>{{(pastDueTotals.sum_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                            <br/><span style="font-size:14px; color:grey;">Promedio:<strong>{{(pastDueTotals.avg_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                        </div>
                        <div class="text-center" v-else>
                            <v-progress-circular indeterminate class="my-5" color="grey"></v-progress-circular>
                        </div>
                    </v-card>
                </v-col>
                
                <v-col md="4" class="px-2">
                    <v-card class="py-4 px-4 elevation-0">
                        <div v-if="!loading3">
                            <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                            <span style="font-size:14px;"><strong>Cobranza Vencida</strong></span>
                            <br/>{{(pastDueTotals.sum_past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                            <br/><span style="font-size:14px; color:grey;">Promedio:<strong>{{(pastDueTotals.avg_past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                        </div>
                        <div class="text-center" v-else>
                            <v-progress-circular indeterminate class="my-5" color="grey"></v-progress-circular>
                        </div>
                    </v-card>
                </v-col>

            </v-row>
        </div>
    </v-container>
</template>

<script>
import FilterCards from "../reports/filterCards"
export default {
    components: {
        'filter-cards':FilterCards,
    }, 
    data: () => ({
        loaders:['loader-1', 'loader-2', 'loader-3', 'loader-4', 'loader-5', 'loader-6'],
        count:0,
        filters: false,
        filterStorageLength:undefined
    }),
    created(){
        this.$store.dispatch('cards/getSaleTotals')
        this.$store.dispatch('cards/getPastDueTotals')
        this.$store.dispatch('cards/getCollectionTotals')
    },
    computed:{
        saleTotals(){
            return this.$store.state.cards.sale_totals
        },
        collectionTotals(){
            return this.$store.state.cards.collection_totals
        },
        pastDueTotals(){
            return this.$store.state.cards.past_due_totals
        },
        loading1(){
            return this.$store.state.cards.total_loader1
        },
        loading2(){
            return this.$store.state.cards.total_loader2
        },
        loading3(){
            return this.$store.state.cards.total_loader3
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
    },
    methods:{
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
        },
        filterCards: function(params) {
            this.filterStorageLength = localStorage.getItem('filtersCardsLength')
            this.$store.dispatch('cards/getSaleTotals')
            this.$store.dispatch('cards/getPastDueTotals')
            this.$store.dispatch('cards/getCollectionTotals')
        },
        filterStorage(){
            if(localStorage.getItem('filtersCardsLength')!=null){
                false
            }else{
                return true
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
    }
}
</script>
<style>
.botonPerron {
    background: white;
    border-radius: 5px;
    height: 25px!important;
    margin-bottom: -17px;
    width: 90px!important;
}
</style>