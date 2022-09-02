<template>
    <v-container style="max-width:100vw;" class="mb-6">
       <cards/>
    </v-container>
</template>

<script>
import Cards from "../reports/cards"
import ventasVScobranzaVSxcobrar from "../reports/ventasVScobranzaVSxcobrar"
export default {
    components: {
        'cards':Cards,
        'ventasVScobranzaVSxcobrar':ventasVScobranzaVSxcobrar,
    },
}
</script>
<style>
    .apexcharts-toolbar{
        display:none!important;
    }
</style>