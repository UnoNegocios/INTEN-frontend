<template>
    <v-container class="pl-9">
        <!-- open car -->
        <v-btn class="ma-4" bottom color="#32241c" dark fab fixed right>
            <v-icon @click.stop="carrito = !carrito" color="white"> mdi-cash-multiple</v-icon>
        </v-btn>
        <v-navigation-drawer right v-model="carrito" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <carrito @closeCreateDialogCalendar="closeCreateDialogCalendar"></carrito>
        </v-navigation-drawer>
        <!-- Filtro -->
        <v-row v-if="search=='filtro'" class="py-4">
            <v-col cols="3" class="pt-0">
                <v-text-field prepend-inner-icon="search" v-model="productoFilterValue" clearable label="Producto"></v-text-field>
            </v-col>
            <v-col cols="3" class="pt-0">
                <v-autocomplete v-model="categoriaFilterValue" clearable :items="categoriaLists" label="Categoría" item-text="categoria" item-value="id">
                    <template slot="no-data" class="pa-2">No existen categorías relacionadas.</template>                      
                </v-autocomplete>
            </v-col>
            <v-col cols="2" class="pt-0">
                <v-autocomplete v-model="colorFilterValue" clearable :items="servicios" label="Color" item-text="color" item-value="color">
                    <template slot="no-data" class="pa-2">No existen colores relacionados.</template>                      
                </v-autocomplete>
            </v-col>
            <v-col cols="3">
                <v-range-slider v-model="range" :max="max" :min="min" hide-details class="align-center">
                    <template v-slot:prepend>
                        <v-text-field prefix="$" :value="range[0]" class="mt-0 pt-0" hide-details single-line type="number" style="width: 70px" @change="$set(range, 0, $event)"></v-text-field>
                    </template>
                    <template v-slot:append>
                        <v-text-field prefix="$" :value="range[1]" class="mt-0 pt-0" hide-details single-line type="number" style="width: 70px" @change="$set(range, 1, $event)"></v-text-field>
                    </template>
                </v-range-slider>
            </v-col>
        </v-row>
        <v-row justify="center" v-if="renderComponent">
            <v-col class="my-4 mx-0" v-for="(servicio,k) in servicios" :key="k">
                <v-card :disabled="servicio.disponible" @click="addToCart(servicio.id)" width="19vw">
                    <v-img height="150px" width="19vw" v-bind:src="process.env.VUE_APP_BACKEND + 'files/' + servicio.imagen"></v-img>
                    <v-card-subtitle class="pb-0">{{servicio.servicio}}</v-card-subtitle>
                    <v-card-text class="text--primary">
                        <div>{{(servicio.valor).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-divider class="my-6 mx-12"></v-divider>
                <button @click="limit = limit+12">Ver Más</button>
            <v-divider  class="my-6 mx-12"></v-divider>
        </v-row>
    </v-container>    
</template>
<script>
import axios from "axios";
import Carrito from "../pos/Carrito"
export default {
    components: {
        'carrito':Carrito,
    },
    data:()=>({ 
        search:'', 
        renderComponent:true,
        limit:12,
        carrito:true,
        min: 0,
        max: 3000,
        range: [0, 3000],
        productoFilterValue:'',
        categoriaFilterValue:'',
        colorFilterValue:'',
    }),
    computed:{
        cart() {
            return this.$store.state.carrito.carritos
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        categoriaLists() {
            return this.$store.state.category.categories;
        },
        servicios:{
            get(){
                var respuesta = this.$store.state.item.items.filter(item=>item.type!='variable').filter(item=>item.price>0).map(id=>{
                    return{
                        disponible:this.inventario(id.inventory, id.id),
                        imagen:id.images,
                        servicio:id.name,
                        valor:id.price*1,
                        id:id.id,
                        inventario:id.inventory,
                        sku:id.sku,
                        codigo:id.macro
                    }
                });
                if(this.search!='' && this.search!='filtro') {
                    respuesta = respuesta.filter(servicio => 
                        servicio.name.toLowerCase().includes(this.search.toLowerCase()) 
                        || ((servicio.macro+'fdl').toLowerCase().includes(this.search.toLowerCase()+'fdl'))
                        || ((servicio.sku+'fdl').toLowerCase().includes(this.search.toLowerCase()+'fdl'))
                    )
                    return this.limit ? respuesta.slice(0,this.limit) : this.respuesta
                }
                else if(this.search=='filtro') {
                    if(this.productoFilterValue!='' && this.productoFilterValue!=null && this.productoFilterValue!=undefined){
                        respuesta = respuesta.filter(servicio => servicio.name.toLowerCase().includes(this.productoFilterValue.toLowerCase()))
                    }
                    if(this.categoriaFilterValue!='' && this.categoriaFilterValue!=null && this.categoriaFilterValue!=undefined){
                        respuesta = respuesta.filter(servicio => servicio.categoria == this.categoriaFilterValue)
                    }
                    if(this.colorFilterValue!='' && this.colorFilterValue!=null && this.colorFilterValue!=undefined ){
                        respuesta = respuesta.filter(servicio => servicio.color == this.colorFilterValue)
                    }
                    if(this.range!=[0, 10000]){
                        respuesta = respuesta.filter(servicio => servicio.valor >= this.range[0])
                        respuesta = respuesta.filter(servicio => servicio.valor <= this.range[1])
                    }
                    return this.limit ? respuesta.slice(0,this.limit) : this.respuesta
                }else{
                    return this.limit ? respuesta.slice(0,this.limit) : this.respuesta
                }
            }
        },
    },
    methods:{
        addToCart(id) {
            this.$store.dispatch("carrito/addItem", id);
            this.$store.dispatch('item/getItems')
        },
        closeCreateDialogCalendar: function(params) {
            this.$store.dispatch('item/getItems')
            this.renderComponent = false;
            this.$nextTick(() => {
                this.renderComponent = true;
            });
        },
        cantidaDisponible(inventario){
            if(this.currentUser.name == 'Sucursal 1'){
                return inventario.arboleda
            }
            else if(this.currentUser.name == 'Sucursal 2'){
                return inventario.plazavita
            }
        },
        inventario(inventario, id){  
            var disponibles = inventario
            if(this.currentUser.name == 'Sucursal 1'){
                if(disponibles.arboleda>0){
                    for(var i=0; i<this.cart.length; i++){
                        if(this.cart[i]==id){
                            -- disponibles.arboleda
                        }
                    }
                    if(disponibles.arboleda>0){
                        return false
                    }else{
                        return true
                    }
                }else{
                    return true
                }
            } 

            
            else if(this.currentUser.name == 'Sucursal 2'){
                if(disponibles.plazavita>0){
                    for(var i=0; i<this.cart.length; i++){
                        if(this.cart[i]==id){
                            -- disponibles.plazavita
                        }
                    }
                    if(disponibles.plazavita>0){
                        return false
                    }else{
                        return true
                    }
                }else{
                    return true
                }
            }
            
        }
    }
}
</script>