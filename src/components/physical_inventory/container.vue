<template>
    <v-container style="max-width:100vw;">
        <!-- Header -->
        <v-toolbar flat class="px-6 py-3">
            <v-toolbar-title>Inventario Físico</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn rounded color="primary" @click="save()" class="elevation-0">Guardar</v-btn>
        </v-toolbar>

        <v-card class="elevation-0 pa-6 pr-10">
            <v-row class="ma-0">
                <v-col cols="8">
                    <v-text-field 
                        append-icon="mdi-magnify" 
                        class="ml-6" 
                        flat 
                        hide-details 
                        label="Buscar" 
                        solo 
                        background-color=#f5f6fa 
                        v-model="searchInput">
                    </v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-autocomplete class="mr-6 pt-2" outlined solo @keydown.enter="filter()" clearable v-model="categoryFilterValue" :items="categories" item-text="name" item-value="name" attach label="Categoría"></v-autocomplete>
                </v-col>
            </v-row>

            <v-data-table
            :headers="headers"
            :items="itemsList"
            :search="searchInput"
            :items-per-page="itemsList.length"
            hide-default-footer>

            <template v-slot:[`item.inventory`]="{ item }">
                <v-text-field 
                    label="Inventario" 
                    background-color=#f5f6fa 
                    class="pa-1"
                    hide-details
                    solo
                    filled
                    rounded
                    dense
                    v-model="item.inventory"
                    style="width:200px!important;"
                    >
                </v-text-field>
            </template>
            </v-data-table>
        </v-card>

        <v-snackbar text :color="snackbar.color" v-model="snackbar.show">
            <strong>{{ snackbar.message }}</strong>
        </v-snackbar>


        


        <v-dialog v-model="dialog" max-width="900px">
            <v-toolbar flat class="px-6 py-3">
                <v-toolbar-title>Resumen de Movimientos a Inventario</v-toolbar-title>
            </v-toolbar>
            <v-card class="elevation-0 pa-6 pr-10 pb-2">
                <v-data-table
                    :headers="headers"
                    :items="cretaeInventory"
                    :search="searchInput"
                    :items-per-page="cretaeInventory.length"
                    hide-default-footer
                    >
                </v-data-table>

                <v-card-actions>
                    <v-spacer class="hidden-md-and-down"></v-spacer>

                    <v-btn color="blue darken-1" text @click="dialog=false">
                        Cancelar
                    </v-btn>
                    <v-btn @click="save2" rounded color="primary" class="px-3 ml-4 elevation-0" :loading="gris" :disabled="gris">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        categoryFilterValue:null,
        filters:false,
        gris:false,
        cretaeInventory:'',
        editedItem:'',
        searchInput:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        dialog: false,
    }),
    computed: {
        headers(){return[
            { text: 'Codigo Macro', value: 'macro',},
            { text: 'Producto', value: 'name',},
            { text: 'Categoría(s)', value: 'categories', filter: this.categoryFilter},
            { text: 'Inventario', value: 'inventory',},
        ]},
        itemsList(){
            return this.$store.state.item.items.filter(item=>item.product_type != 'Variable').map(id=>{
                return{
                    buy_when_available:id.buy_when_available,
                    categories:this.categoriesName(id.superiorID, id.categories),
                    cost:id.cost,
                    created_at:id.created_at,
                    created_by_user_id:id.created_by_user_id,
                    description:id.description,
                    discoiunt_price:id.discoiunt_price,
                    end_promo:id.end_promo,
                    featured:id.featured,
                    heihgt:id.heihgt,
                    id:id.id,
                    ideal_inventory:id.ideal_inventory,
                    images:id.images,
                    inventory:'',
                    is_published:id.is_published,
                    longitude:id.longitude,
                    macro:id.macro,
                    name:id.name,
                    price:id.price,
                    product_type:id.product_type,
                    provider_id:id.provider_id,
                    short_description:id.short_description,
                    sku:id.sku,
                    start_promo:id.start_promo,
                    superiorID:id.superiorID,
                    tax:id.tax,
                    tax_type:id.tax_type,
                    type: id.type,
                    unit_id:id.unit_id,
                    updated_at:id.updated_at,
                    weight:id.weight,
                }
            })
        },
        itemsList2(){
            return this.$store.state.item.items.filter(item=>item.product_type != 'Variable').map(id=>{
                return{
                    inventory:this.inventoryCalc(id.id),
                }
            })
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        categories(){
            return this.$store.state.category.categories
        },
    },
    methods: {
        categoryFilter(value) {
            if (!this.categoryFilterValue) {
                return true;
            }
            return value==this.categoryFilterValue
            
        },
        categoriesName(superiorID, catego){
            if(superiorID!=undefined){
                var categories = this.$store.state.item.items.filter(item=>item.id==superiorID).map(item=>item.categories)[0]
                var respuesta = this.categories.filter(category=>category.id == categories[0]).map(category=>category.name)[0]
                for(var i=1; i<categories.length; i++){
                    respuesta = respuesta + ', ' + this.categories.filter(category=>category.id == categories[i]).map(category=>category.name)[0]
                }
            }else if(catego!=undefined){
                var categories = catego
                var respuesta = this.categories.filter(category=>category.id == categories[0]).map(category=>category.name)[0]
                for(var i=1; i<categories.length; i++){
                    respuesta = respuesta + ', ' + this.categories.filter(category=>category.id == categories[i]).map(category=>category.name)[0]
                }
            }
            return respuesta
        },
        itemName(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item=>item.name)[0]
        },
        inventoryCalc(id){
            var quantities = this.$store.state.inventory.inventories.filter(inventory=>inventory.item_id == id)
            var sum = 0
            for(var i=0; i<quantities.length; i++){
                if(quantities[i].type == 'Salida Producción' || quantities[i].type == 'Salida Venta'){
                    sum = sum - quantities[i].quantity
                }
                else if(quantities[i].type == 'Entrada Producción' || quantities[i].type == 'Entrada Compra' || quantities[i].type == 'Ajuste Manual' || quantities[i].type == 'Creación de Producto' || quantities[i].type == 'Ajuste Inventario Físico' || quantities[i].type == 'Ajuste Inventario Físico'){
                    sum = sum + quantities[i].quantity
                }
            }
            return sum
        },
        save(){
            var cretaeInventory = []
            for(var i=0; i<this.itemsList.length; i++){
                if(this.itemsList[i].inventory!=''){//&& this.itemsList[i].inventory != this.itemsList2[i].inventory
                    let inventario = {
                        created_by_user_id: this.currentUser.id,
                        type: 'Ajuste Inventario Físico',
                        item_id: this.itemsList[i].id,
                        quantity: (((this.itemsList2[i].inventory*1) - (this.itemsList[i].inventory*1)) * (-1)),
                        inventory: this.itemsList[i].inventory
                    }
                    cretaeInventory = cretaeInventory.concat(inventario)
                }
            }
            if(cretaeInventory.length>0){
                this.editedItem = cretaeInventory
                this.cretaeInventory = cretaeInventory.map(id=>{
                    return{
                        name: this.itemName(id.item_id),
                        inventory: id.inventory
                    }
                })
                this.dialog = true
            }
        },
        save2(){
            this.gris = true
            this.$nextTick(() => {
                if(this.editedItem.length>0){
                    axios.post(process.env.VUE_APP_BACKEND + "api/v1/inventory/bulkstore",Object.assign(this.editedItem)).then(response => {
                        this.gris = false
                        this.dialog = false
                        this.searchInput = ''
                        this.snackbar = {
                            message: 'Inventario realizado con exito.',
                            color: 'success',
                            show: true
                        }
                        this.$store.dispatch('inventory/getInventories')
                        this.$store.dispatch('item/getItems')
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                }
            })
        }
    }
}
</script>

<style>
.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%), 0px 1px 5px 0px rgb(0 0 0 / 0%)!important;
}
</style>
