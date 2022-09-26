<template>
<keep-alive>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterInventory @filtersItem="filtersItem"/>
        </v-navigation-drawer>
        <!-- Contenedor -->

        <v-data-table :headers="headers" :items="items" class="elevation-0 px-6 py-4"><!-- show-expand -->
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Productos | Servicios </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <!--v-btn icon>
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn-->
                </v-toolbar>
            </template>

            <template v-slot:[`item.gallery`]="{ item }">
                <v-icon v-if="item.gallery!=undefined" @click="viewGallery(item.images)" small>mdi-image-multiple</v-icon>
                <v-dialog v-model="dialogGallery" width="900">
                    <v-card>
                        <v-row justify="space-around" class="ma-0">
                            <v-col v-for="(image, n) in imagesGallery" :key="n" class="d-flex child-flex pa-0" cols="3" style="border: solid 1px #b7b7b7; border-collapse: collapse;">
                                <v-img :src="process.env.VUE_APP_BACKEND + 'files/items/'+image"
                                    aspect-ratio="1" class="grey lighten-2">
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="grey lighten-5" ></v-progress-circular>
                                        </v-row>
                                    </template>
                                    <a style="color:transparent!important; margin-left:10px;" :href="process.env.VUE_APP_BACKEND + 'files/items/'+image" :download="image" target="_blank"><v-icon>mdi-eye</v-icon></a>
                                </v-img>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog=false">Cerrar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>

            <!-- Detalle PC -->
            <template v-slot:expanded-item="{ headers, item }">
                <td style="padding:0px!important;" :colspan="headers.length">
                    <v-data-table :headers="headers2" :items="variations(item.id)" class="elevation-0 pa-5" style="background: #f7f7f7;!important" dense>
                        <template slot="no-data">
                            No existen productos registrados.
                        </template>
                        <template v-slot:[`item.price`]="{ item }">
                            {{money(item.price)}}
                        </template>
                        <template v-slot:[`item.cost`]="{ item }">
                            {{money(item.cost)}}
                        </template>
                        <template v-slot:[`item.is_published`]="{ item }">
                            <v-icon v-if="item.is_published==true" color="green">mdi-record</v-icon>
                            <v-icon v-else color="red">mdi-record</v-icon>
                        </template>
                        <template v-slot:[`item.unit_id`]="{ item }">
                            {{unit(item.unit_id)}}
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="edit(item.id)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </td>
            </template>

            <template slot="no-data">
                No existen productos registrados.
            </template>
            <template v-slot:[`item.price`]="{ item }">
                {{money(item.price)}}
            </template>
            <template v-slot:[`item.cost`]="{ item }">
                {{money(item.cost)}}
            </template>
            <!--template v-slot:[`item.weight`]="{ item }">
                {{item.weight}}kg
            </template-->
            <template v-slot:[`item.is_published`]="{ item }">
                <div v-if="item.product_type!='Variable'">
                    <v-icon v-if="item.is_published==true" color="green">mdi-record</v-icon>
                    <v-icon v-else color="red">mdi-record</v-icon>
                </div>
            </template>
            <template v-slot:[`item.unit_id`]="{ item }">
                {{unit(item.unit_id)}}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="edit(item.id)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
        <!-- Crear actividad -->
        <v-dialog v-model="createDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createItem @closeDialogItem="closeDialogItem"/>
        </v-dialog>
        <!-- editar -->
        <v-dialog v-model="editDialog" max-width="600px">
            <editItem @closeDialogItem="closeDialogItem" v-bind:editedItem="editedItem"/>
        </v-dialog> 
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</keep-alive>
</template>
<script>
import axios from "axios";
import editItem from "../inventory/edit"
import createItem from "../inventory/create"
import filterInventory from "../inventory/filter"
export default {
    components: {
        'editItem':editItem,
        'createItem':createItem,
        'filterInventory':filterInventory
    },
    data:()=>({ 
        search:'',
        items:'',
        dialogGallery:false,
        imagesGallery:[],
        snackbar: {
            show: false,
            message: null,
            color: null
        }, 
        filters: false,
        editDialog:false,
        createDialog:false,
        info:true,
        editedItem:'',
        headers2:[
            {text: 'Nombre', value: 'name'},
            //{text: 'Codigo', value: 'sku'},
            {text: 'Codigo Macro', value: 'macro'},
            //{text: 'Tipo', value: 'type'},
            //{text: 'Proveedor', value: 'provider_id'},
            {text: 'Unidad', value: 'unit_id'},
            //{text: 'Peso', value: 'weight'},
            {text: 'Precio', value: 'price'},
            {text: 'Costo', value: 'cost'},
            {text: 'Categoría', value: 'categories'},
            {text: 'Publicado', value: 'is_published'},
            {text: 'Inventario Ideal', value: 'ideal_inventory'},
            {text: 'Inventario', value: 'inventory'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        itemsList(){
            var perro = this.$store.state.item.items.filter(item=>item.product_type != 'Variable').map(id=>{
                    return{
                        id:id.id,
                        name:id.name,
                        sku:id.sku,
                        macro:id.macro,
                        is_published:id.is_published,
                        superiorID:id.superiorID,
                        type:id.type,
                        provider_id:this.provider(id.provider_id),
                        unit_id:this.searchUnit(id.unit_id, id.id),
                        cost:id.cost,
                        price:id.price,
                        product_type:id.product_type,
                        created_by_user_id:id.created_by_user_id,
                        weight:id.weight + ' kg',
                        inventory:this.inventoryCalc(id.id),
                        categories:this.category(id.categories, id.superiorID),
                        ideal_inventory:id.ideal_inventory,
                        images:id.images,

                        items:this.variations(id.id)
                        /*
                        weight:id.weight,
                        longitude:id.longitude,
                        heihgt:id.heihgt,
                        width:id.width,
                        discoiunt_price:id.discoiunt_price,
                        images:id.images,
                        featured:id.featured,
                        short_description:id.short_description,
                        description:id.description,
                        start_promo:id.start_promo,
                        end_promo:id.end_promo,
                        tax:id.tax,
                        tax_type:id.tax_type,
                        buy_when_available:id.buy_when_available,
                        */
                    }
                })
            if(this.search!=''&&this.search!=null&&this.search!=undefined){
                var words = this.search.split(" ")
                for(var i=0; i<words.length; i++){
                    perro = perro.filter(item=>this.lowerCase(JSON.stringify(item)).includes(words[i].toLowerCase()))
                }
            }
            return perro
        },
        headers(){
            this.items = this.itemsList
            return [
                //{text: '', value: 'data-table-expand' },
                {text: 'Nombre', value: 'name'},
                //{text: 'Codigo', value: 'sku'},
                {text: 'Codigo Macro', value: 'macro'},
                {text: 'Fotos', value: 'gallery', sortable: false },
                {text: 'Tipo', value: 'type'},
                {text: 'Proveedor', value: 'provider_id'},
                {text: 'Unidad', value: 'unit_id'},
                {text: 'Peso', value: 'weight'},
                {text: 'Precio', value: 'price'},
                {text: 'Costo', value: 'cost'},
                {text: 'Categoría', value: 'categories'},
                {text: 'Publicado', value: 'is_published'},
                {text: 'Inventario Ideal', value: 'ideal_inventory'},
                {text: 'Inventario', value: 'inventory'},
                {text: 'Acciones', value: 'actions', sortable: false },
            ]
        },
    },
    methods:{
        searchUnit(unit, id){
            if(unit!=undefined && unit!=null && unit!=''){
                return unit
            }else{
                var variation = this.$store.state.item.items.filter(item=>item.superiorID == id).map(item=>item.unit_id)[0]
                return variation
            }
        },
        inventoryCalc(id){
            var quantities = this.$store.state.inventory.inventories.filter(inventory=>inventory.item_id == id)
            var sum = 0
            for(var i=0; i<quantities.length; i++){
                if(quantities[i].type == 'Salida Producción' || quantities[i].type == 'Salida Venta'){
                    sum = sum - quantities[i].quantity
                }
                else if(quantities[i].type == 'Entrada Producción' || quantities[i].type == 'Entrada Compra' || quantities[i].type == 'Ajuste Manual' || quantities[i].type == 'Creación de Producto' || quantities[i].type == 'Ajuste Inventario Físico'){
                    sum = sum + quantities[i].quantity
                }
            }
            return sum
        },
        filtersItem: function(params) {
            this.items = ''
            var filterItems = this.$store.state.item.items.filter(item=>item.product_type != 'Variable')
            //name
            if(params.name!=''&&params.name!=undefined&&params.name!=null){
                filterItems=filterItems.filter(item=>this.lowerCase(item.name).includes(params.name.toLowerCase()))
            }
            //type
            if(params.type!==''&&params.type!==undefined&&params.type!==null){
                filterItems=filterItems.filter(item=>item.type === params.type)
            }
            //product_type
            if(params.product_type!==''&&params.product_type!==undefined&&params.product_type!==null){
                filterItems=filterItems.filter(item=>item.product_type === params.product_type)
            }
            //code
            if(params.code!=''&&params.code!=undefined&&params.code!=null){
                filterItems=filterItems.filter(item=>this.lowerCase(item.macro).includes(params.code.toLowerCase()))
            }
            //provider
            if(params.provider!=''&&params.provider!=undefined&&params.provider!=null){
                var uno = filterItems.filter(item=>item.provider_id == params.provider[0])
                for(var i=1; i<params.provider.length; i++){
                    uno=uno.concat(filterItems.filter(item=>item.provider_id == params.provider[i]))   
                }
                filterItems = this.removeDuplicates(uno, "id");
            }
            //category
            if(params.category!=''&&params.category!=undefined&&params.category!=null){
                var dos = filterItems.filter(item=>this.categoriesIds(item.categories, item.superiorID) == params.category[0])
                for(var i=1; i<params.category.length; i++){
                    dos=dos.concat(filterItems.filter(item=>this.categoriesIds(item.categories, item.superiorID) == params.category[i]))   
                }
                filterItems = this.removeDuplicates(dos, "id");
            }
            //publish
            if(params.publish!==''&&params.publish!==undefined&&params.publish!==null){
                filterItems=filterItems.filter(item=>item.is_published == params.publish)
            }
            this.items = filterItems.map(id=>{
                    return{
                        id:id.id,
                        name:id.name,
                        sku:id.sku,
                        macro:id.macro,
                        is_published:id.is_published,
                        superiorID:id.superiorID,
                        type:id.type,
                        provider_id:this.provider(id.provider_id),
                        unit_id:this.searchUnit(id.unit_id, id.id),
                        cost:id.cost,
                        price:id.price,
                        product_type:id.product_type,
                        created_by_user_id:id.created_by_user_id,
                        weight:id.weight + ' kg',
                        inventory:this.inventoryCalc(id.id),
                        categories:this.category(id.categories, id.superiorID),
                        ideal_inventory:id.ideal_inventory,
                        images:id.images,
                        items:this.variations(id.id)
                    }
                })
        },
        removeDuplicates(originalArray, prop) {
            var newArray = [];
            var lookupObject  = {};
            for(var i in originalArray) {
                lookupObject[originalArray[i][prop]] = originalArray[i];
            }
            for(i in lookupObject) {
                newArray.push(lookupObject[i]);
            }
            return newArray;
        },
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
        money(amount){
            if(amount!=undefined){
                return (amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
            }else{
                return '-'
            }
        },
        variations(item_id){
            var respuesta = this.$store.state.item.items.filter(item=>item.product_type == 'Variación').filter(item=>item.superiorID == item_id)
            return respuesta
        },
        provider(id){
            if(id!=undefined){
                return this.$store.state.provider.providers.filter(provider=>provider.id == id).map(provider=>provider.name)[0];
            }else{
                return '-'
            }
        },
        unit(id){
            if(id!=undefined){
                return this.$store.state.unit.units.filter(unit=>unit.id == id).map(unit=>unit.name)[0];
            }else{
                return '-'
            }
        },
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este producto/servicio?')) {
                axios.delete("https://unowipes.com/api/v1/item/delete/"+id).then(response => {
                    this.$store.dispatch('item/getItems')
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                });
            }
        },
        viewGallery(images){
            this.imagesGallery = images
            this.dialogGallery = true
        },
        edit(id){
            this.editedItem = this.$store.state.item.items.filter(item=>item.id == id)[0]
            console.log(this.editedItem)
            //this.editDialog = true
        },
        closeDialogItem: function(params) {
            this.editDialog = params;
            this.createDialog = params;
            this.$store.dispatch('item/getItems')
        },
        category(categoriesIds, superiorID){
            var categoriesNames = this.$store.state.category.categories
            if(categoriesIds.length>0){
                var catName = categoriesNames.filter(category=>category.id == categoriesIds[0]).map(category => category.name)[0];
                for(var i=1; i<categoriesIds.length; i++){
                    catName = catName + ', ' + categoriesNames.filter(category=>category.id == categoriesIds[i]).map(category => category.name)[0];
                }
                return catName
            }else if(superiorID!=undefined){
                var catsId = this.$store.state.item.items.filter(item=>item.id == superiorID).map(item=>item.categories)[0]

                var catName = categoriesNames.filter(category=>category.id == catsId[0]).map(category => category.name)[0];
                for(var i=1; i<catsId.length; i++){
                    catName = catName + ', ' + categoriesNames.filter(category=>category.id == catsId[i]).map(category => category.name)[0];
                }
                return catName
            }else{
                return '-'
            }
        },
        categoriesIds(ids, superiorID){
            if(superiorID==undefined){
                return ids
            }else{
                return this.$store.state.item.items.filter(item=>item.id == superiorID).map(item=>item.categories)[0]
            }
        },
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
        },
    },
}
</script>