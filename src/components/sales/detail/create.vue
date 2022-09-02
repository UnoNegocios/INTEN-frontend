<template>
    <v-card class="pa-6 pb-2">
        Agregar Producto a la Venta {{addDetail}}
        <v-row class="ma-0 mt-4">
            <v-col ols="12" sm ="4" md="2" class="py-0 my-0">
                <v-text-field type=number v-model="sale_item.quantity" label="Cantidad"></v-text-field><!--:disabled="yanohay(item.quantity, item.item, k)" -->
            </v-col>
            <v-col ols="12" sm ="8" md="6" class="py-0 my-0">
                <v-autocomplete :items="itemLists" item-text="detail" item-value="id" label="Producto" clearable v-model="sale_item.item_id">
                    <template slot="no-data" class="pa-2">No existen productos relacionados.</template>  
                    <template v-slot:item="{item, attrs, on}">
                        <v-list-item v-on="on" v-bind="attrs">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{item.name}} | {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                    <div>
                                        <span style="font-size:12px;">Categoría:</span>
                                        <template v-for="(category, index) in item.categories">
                                            <v-chip  v-bind:key="index" small class="ml-2"  style="font-size:8px;">{{categoryName(category)}}</v-chip>
                                        </template>
                                    </div>
                                    <div>
                                        <span style="font-size:14px;">Inventario:
                                            <strong v-if="item.inventory<1" style="color:red!important;">{{item.inventory}}</strong>
                                            <strong v-else style="color:green!important;">{{item.inventory}}</strong>
                                        </span>
                                    </div>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template> 
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm ="8" md="4" class="py-0 my-0">
                <v-text-field v-model="sale_item.price" prefix="$" suffix="c/u" label="Precio Ajustado"></v-text-field>
            </v-col>
        </v-row>
        <v-card-actions>
            <v-spacer class="hidden-md-and-down"></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="save"  :loading="gris" :disabled="gris">
                Guardar
            </v-btn>
        </v-card-actions>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from "axios"
export default {
    props:{
        addDetail:Number
    },
    data: () => ({
        gris: false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        sale_item:{
            quantity:1,
            item_id:'',
            price:'',
            quotation_id:''
        }
    }),
    computed:{
         itemLists(){
            return this.$store.state.item.items.filter(item=>item.is_published == true).filter(item=>item.product_type != 'Variable').map(id=>{
                return{
                    id:id.id,
                    name:id.name,
                    detail: id.name + ' (' + this.categories(id.categories) + ')',
                    categories:id.categories,
                    inventory:this.inventoryCalc(id.id),
                    price:id.price,
                    weight:id.weight
                }
            });
        },
    },
    methods:{
        categories(categories){
            var respuesta = ''
            for(var i=0; i<categories.length; i++){
                if(i>0){
                    respuesta = respuesta + ', ' + this.categoryName(categories[i])
                }
                else{
                    respuesta = this.categoryName(categories[i])
                }
            }
            return respuesta
        },
        categoryName(id){
            return this.$store.state.category.categories.filter(category => category.id == id).map(category => category.name)[0];
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
        close () {
            this.gris = false
            this.$nextTick(() => {
                this.$emit("closeDialogAddDetail", false);
            })
        },
        save(){
            this.sale_item.quotation_id = this.addDetail
            this.gris = true
            this.$nextTick(() => {
                axios.post("https://unowipes.com/api/v2/sale_items", this.sale_item).then(response => {
                    this.close()
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                    this.gris = false
                    this.close()
                })
            })
        },
    }
}
</script>

<style>

</style>