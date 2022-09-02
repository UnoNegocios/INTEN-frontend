<template>
    <v-row class="ma-0 mb-4" v-if="loading">
        <div style="width:25%" class="px-4" v-for="(loader, index) in loaders" v-bind:key="index">
            <v-card class="pb-4 pt-5 px-4 elevation-0">
                <v-skeleton-loader type="text" width="40%"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="100%"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="100%"></v-skeleton-loader>
            </v-card>
        </div>
    </v-row>

    <v-row class="ma-0 mb-4" v-else>
        <div style="width:25%" class="px-2" v-for="(total, index) in totals" v-bind:key="index">
            <v-card class="py-4 px-6 elevation-0">
                <v-row class="ma-0 mb-2">
                    <v-icon x-small :color="colors[index]" class="mr-1">mdi-record</v-icon> 
                    <span style="font-size:14px;"><strong>{{total.method}}</strong></span>
                    <v-spacer></v-spacer>
                    <span style="font-size:14px; color:grey;">Total:<strong>{{(total.total).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                </v-row>
                <span style="font-size:13px;">Serie A: </span>
                <strong>{{(total.sum_serie_a).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                <br/>
                <span style="font-size:13px;">Serie B: </span>
                <strong>{{(total.sum_serie_b).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
            </v-card>
        </div>
    </v-row>
</template>

<script>
export default {
    data: () => ({
        colors:['#47bdc6', '#ff6d00', '#4385f3', '#33a952'],
        loaders:['loader-1', 'loader-2', 'loader-3', 'loader-4'],
        count:0,
    }),
    created(){
        this.$store.dispatch('collection/getTotals')
    },
    computed:{
        totals(){
            var perro = this.$store.state.collection.totals
            return perro
        },
        loading(){
            return this.$store.state.collection.total_loader
        }
    }
}
</script>