<template>
    <v-row class="ma-0 mb-4" v-if="loading">
        <div style="width:14.2857143%" class="px-2" v-for="(loader, index) in loaders" v-bind:key="index">
            <v-card class="pb-2 pt-3 px-4 elevation-0">
                <v-skeleton-loader type="text" width="40%"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="80%"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="80%"></v-skeleton-loader>
            </v-card>
        </div>
    </v-row>

    <v-row class="ma-0 mb-4" v-else>
        <div style="width:14.2857143%" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                <span style="font-size:12px;"><strong>Subtotal</strong></span>
                <br/>{{(totals.sum_subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </div>
        <div style="width:14.2857143%" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#ff6d00" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>IVA</strong></span>
                <br/>{{(totals.sum_iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </div>
        <div style="width:14.2857143%" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#4385f3" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Total</strong></span>
                <br/>{{(totals.sum_total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </div>
        
        <div style="width:14.2857143%" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#fbbc04" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Adeudo</strong></span>
                <br/>{{(totals.sum_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </div>
        <div style="width:14.2857143%" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Saldo Vencido</strong></span>
                <br/>{{(totals.sum_past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </div>
        <div style="width:14.2857143%" class="px-2" v-show="permissions('utilities')">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#2fc5ff" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Utilidades</strong></span>
                <br/>{{(totals.sum_utilities*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_utilities*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </div>
    </v-row>
</template>

<script>
export default {
    data: () => ({
        loaders:['loader-1', 'loader-2', 'loader-3', 'loader-4', 'loader-5', 'loader-6', 'loader-7'],
        count:0,
    }),
    created(){
        this.$store.dispatch('quotation/getTotals')
    },
    computed:{
        totals(){
            return this.$store.state.quotation.totals
        },
        loading(){
            return this.$store.state.quotation.total_loader
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        }
    },
    methods:{
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