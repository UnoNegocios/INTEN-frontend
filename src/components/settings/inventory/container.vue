

<template>
    <div class="padding1" style="background:#f4f5fa; min-height:80vh;">  
        <v-card v-if="info==true" style="background:transparent;" class="elevation-0 pb-6 px-7">
            <v-card-text class="py-3 px-6" style="background:#1976d1; color:white; border-radius: 5px;">
                <v-icon color="white" small class="mr-2">mdi-information-outline</v-icon>
                Lorem ipsum dolor sit amet consectetur adipiscing elit massa imperdiet, mauris tortor platea fringilla sodales ac magna sociosqu, natoque non rutrum nec auctor vestibulum congue eget. 
                <v-icon style="position:absolute!important; top:7px; right:30px;" color="white" @click="info=false" small class="mr-2">mdi-close</v-icon>
            </v-card-text>
        </v-card> 
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;">Productos | Servicios 
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn @click="createDialog=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <v-data-table show-expand :headers="headers" :items="items" class="elevation-0">
                <!-- Detalle PC -->
                    <template v-slot:expanded-item="{ headers, item }">
                        <td style="padding:0px!important;" :colspan="headers.length" v-if="item.product_type=='Variable'">
                            <v-data-table :headers="headers2" :items="variations(item.id)" class="elevation-0 pa-5" style="background: #f7f7f7;!important" dense>
                                <template slot="no-data">
                                    No existen procedencias registradas.
                                </template>
                                <template v-slot:[`item.categories`]="{ item }">
                                    <template v-for="(categori, index) in item.categories">
                                        <span v-bind:key="index">{{category(categori)}}, </span>
                                    </template>
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
                                <template v-slot:[`item.provider_id`]="{ item }">
                                    {{provider(item.provider_id)}}
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
                                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                                </template>
                            </v-data-table>
                        </td>
                    </template>
                <template slot="no-data">
                    No existen procedencias registradas.
                </template>
                <template v-slot:[`item.categories`]="{ item }">
                    <template v-for="(categori, index) in item.categories">
                        <span v-bind:key="index">{{category(categori)}}, </span>
                    </template>
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
                <template v-slot:[`item.provider_id`]="{ item }">
                    {{provider(item.provider_id)}}
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
            <v-dialog v-model="editDialog" max-width="600px">
                <editItem @closeDialogItem="closeDialogItem" v-bind:editedItem="editedItem"/>
            </v-dialog> 
            <v-dialog v-model="createDialog" max-width="600px">
                <createItem @closeDialogItem="closeDialogItem"/>
            </v-dialog> 
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>
<script>
import axios from "axios";
import editItem from "../inventory/edit"
import createItem from "../inventory/create"
export default {
    components: {
        'editItem':editItem,
        'createItem':createItem,
    },
    data:()=>({  
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        editDialog:false,
        createDialog:false,
        info:true,
        editedItem:'',
        headers:[
            { text: '', value: 'data-table-expand' },
            {text: 'Nombre', value: 'name'},
            {text: 'Codigo', value: 'sku'},
            {text: 'Codigo Macro', value: 'macro'},
            {text: 'Tipo', value: 'type'},
            {text: 'Proveedor', value: 'provider_id'},
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
        headers2:[
            {text: 'Nombre', value: 'name'},
            {text: 'Codigo', value: 'sku'},
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
        items:{
            get(){
                return this.$store.state.item.items.filter(item=>item.product_type != 'Variación').map(id=>{
                    return{
                        id:id.id,
                        name:id.name,
                        sku:id.sku,
                        macro:id.macro,
                        is_published:id.is_published,
                        superiorID:id.superiorID,
                        type:id.type,
                        provider_id:id.provider_id,
                        unit_id:id.unit_id,
                        cost:id.cost,//calcular despues
                        price:id.price,//calcular despues
                        product_type:id.product_type,
                        created_by_user_id:id.created_by_user_id,

                        //arrays
                        inventory:id.inventory,
                        categories:id.categories,
                        ideal_inventory:id.ideal_inventory,

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
                });
            }
        },
    },
    methods:{
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
        edit(item){
            this.editedItem = item
            this.editDialog = true
        },
        closeDialogItem: function(params) {
            this.editDialog = params;
            this.createDialog = params;
            this.$store.dispatch('item/getItems')
        },
        category(id){
            return this.$store.state.category.categories.filter(category=>category.id == id).map(category => category.name)[0];
        }
    },
}
</script>