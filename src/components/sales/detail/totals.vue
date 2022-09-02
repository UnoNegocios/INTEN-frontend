<template>
    <v-row class="ma-0 mb-4">
        <v-col md="2" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                <span style="font-size:12px;"><strong>Costo</strong></span>
                <br/>{{totals.sum_cost}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{totals.avg_subtotal}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#ff6d00" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Precio</strong></span>
                <br/>{{totals.sum_values}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{totals.avg_values}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#4385f3" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Precio Ajustado</strong></span>
                <br/>{{totals.sum_prices}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{totals.avg_prices}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#33a952" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Utilidades</strong></span>
                <br/>{{totals.sum_utilities}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{totals.avg_utilities}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#fbbc04" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Kilogramos</strong></span>
                <br/>{{totals.sum_weights}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{totals.avg_weights}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Piezas</strong></span>
                <br/>{{totals.sum_pieces}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{totals.avg_pieces}}</strong></span>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props:{
        totals:Object
    },
}
</script>