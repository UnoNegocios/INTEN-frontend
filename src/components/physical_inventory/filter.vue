<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8">
            <strong>Filtros</strong>

            <div class="mt-4">
                Fecha 
                <v-menu v-model="menuFrom" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="inventory.dateFrom" label="Desde" clearable prepend-icon="mdi-calendar-today" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="inventory.dateFrom" @input="menuFrom = false"></v-date-picker>
                </v-menu>
                <v-menu v-model="menuTo" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="inventory.dateTo" label="Hasta" clearable prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="inventory.dateTo" @input="menuTo = false"></v-date-picker>
                </v-menu>
            </div>

            <v-autocomplete @keydown.enter="filter()" v-model="inventory.user_id" :items="userLists" item-text="name" item-value="id" attach chips label="Responsable" multiple>
                <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>  
            </v-autocomplete>

            <v-autocomplete @keydown.enter="filter()" v-model="inventory.item_id" :items="itemLists" item-text="name" item-value="id" attach chips label="Producto" multiple>
                <template slot="no-data" class="pa-2">No existen productos relacionados.</template>  
            </v-autocomplete>

            <v-autocomplete @keydown.enter="filter()" v-model="inventory.type" :items="typeLists" item-text="text" item-value="value" attach chips label="Tipo de Movimiento" multiple>
                <template slot="no-data" class="pa-2">No existen movimientos relacionados.</template>  
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
    data: () => ({
        menuTo:false,
        menuFrom:false,
        inventory:{
            dateFrom:'',
            dateTo:'',
            user_id:'',
            product_id:'',
            type:'',
        },
    }),
    computed: {
        userLists(){
            return this.$store.state.user.users.map(id=>{
                return{
                    id:id.id,
                    name:id.name + ' ' + id.last
                }
            });
        }, 
        typeLists(){
            return [
                { text: 'Entrada Producción', value: 'Entrada Producción'}, 
                { text: 'Entrada Compra', value: 'Entrada Compra'}, 
                { text: 'Ajuste Manual', value: 'Ajuste Manual'}, 
                { text: 'Creación Producto', value: 'Creación de Producto'}, 
                { text: 'Ajuste IF', value: 'Ajuste Inventario Físico'}, 
                { text: 'Salida Producción', value: 'Salida Producción'}, 
                { text: 'Salida Venta', value: 'Salida Venta'}
            ]
        },
        itemLists(){
            return this.$store.state.item.items.filter(item=>item.product_type != 'Variable')
        }, 
    },
    methods: {
        filter(){
            this.$emit("filtersInventory", this.inventory);
        }
    }
  }
</script>