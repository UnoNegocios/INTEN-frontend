<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            <span>Crear Producto</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
                <v-select :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.product_type" label="" :items="productTypes"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-select :rules="[v => !!v || 'Campo requerido']" v-if="editedItem.product_type=='Simple'" v-model="editedItem.type" label="Tipo de Producto" :items="types"></v-select>
                <v-autocomplete v-if="editedItem.product_type=='Variación'" :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.superiorID" :items="superiorProducts" label="Producto Padre" item-text="name" item-value="id">
                    <template slot="no-data">
                        No existen productos relacionados.
                    </template>
                </v-autocomplete>
            </v-col>
        </v-card-title>

        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.sku" label="Código"></v-text-field>
                    <v-autocomplete :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.unit_id" v-if="editedItem.product_type!='Variable'" :items="units" label="Unidad" item-text="name" item-value="id">
                        <template slot="no-data">
                            <div class="px-6 pt-3">
                                No existen unidades de medida relacionadas.
                                <v-text-field v-model="createUnit.name" label="Nueva Unidad de Medida" append-icon="mdi-plus" @click:append="saveUnit()"></v-text-field>
                            </div>
                        </template>
                    </v-autocomplete>
                    <v-checkbox v-model="editedItem.is_published" v-if="editedItem.product_type!='Variable'" label="Publicado"></v-checkbox>
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.macro" label="Código Macro"></v-text-field>
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" type="number" v-model="editedItem.price" label="Precio"></v-text-field>
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" type="number" v-model="editedItem.ideal_inventory" v-if="editedItem.product_type!='Variable'" label="Inventario Ideal"></v-text-field>
                    <v-autocomplete :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.provider_id" v-if="editedItem.type=='Insumo'" :items="providers" label="Proveedor" item-text="name" item-value="id">
                        <template slot="no-data">
                            <div class="px-6 pt-3">
                                No existen proveedores relacionados.
                                <v-text-field v-model="createProvider.name" label="Proveedor" append-icon="mdi-plus" @click:append="saveProvider()"></v-text-field>
                            </div>
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Producto"></v-text-field>
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" type="number" v-model="editedItem.cost" label="Costo"></v-text-field>
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" type="number" v-model="editedItem.inventory[0]" v-if="editedItem.product_type!='Variable'" label="Inventario"></v-text-field>
                    <v-autocomplete :rules="[v => !!v || 'Campo requerido']" multiple v-model="editedItem.categories" v-if="editedItem.product_type!='Variación'" :items="categories" label="Categoría" item-text="name" item-value="id">
                        <template slot="no-data">
                            <div class="px-6 pt-3">
                                No existen categorías relacionadas.
                                <v-text-field v-model="createCategory.name" label="Nueva Categoría" append-icon="mdi-plus" @click:append="saveCategory()"></v-text-field>
                            </div>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions class="pt-4">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text :loading="gris" :disabled="gris || !valid" @click="save">Guardar</v-btn>
        </v-card-actions>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    data:()=>({  
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
        disable:'',
        valid: true,
        editedItem: {
            product_type:'Simple',
            name:'',
            sku:'',
            macro:'',
            type:'',
            provider_id:'',
            unit_id:'',
            superiorID:'',
            price:'',
            categories:[],
            cost:'',
            is_published:true,
            ideal_inventory:'',
            //e-commerce
            tax:'',
            tax_type:'',
            featured:'',
            short_description:'',
            description:'',
            start_promo:'',
            end_promo:'',
            longitude:'',
            height:'',
            width:'',
            discoiunt_price:'',
            buy_when_available:'',
            inventory:[],
            images:[],
        },
        productTypes:[
            'Simple', 'Variable', 'Variación'
        ],
        types:[
            'Insumo', 'Fabricado', 'Producto Final'
        ],
        createCategory:{
            name:'',
        },
        createProvider:{
            name:'',
        },
        createUnit:{
            name:'',
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    created(){
        
    },
    computed:{
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        categories:{
            get(){
                return this.$store.state.category.categories;
            }
        },
        providers:{
            get(){
                return this.$store.state.provider.providers;
            }
        },
        superiorProducts:{
            get(){
                return this.$store.state.item.items.filter(item=>item.product_type == 'Variable');
            }
        },
        products:{
            get(){
                return this.$store.state.item.items;
            }
        },
        units:{
            get(){
                return this.$store.state.unit.units;
            }
        }
    },
    methods:{
        close () {
            this.gris = false
            this.editedItem.product_type='Simple'
            this.editedItem.name=''
            this.editedItem.sku=''
            this.editedItem.macro=''
            this.editedItem.type=''
            this.editedItem.provider_id=''
            this.editedItem.unit_id=''
            this.editedItem.superiorID=''
            this.editedItem.price=''
            this.editedItem.categories=[]
            this.editedItem.cost=''
            this.editedItem.is_published=true
            this.editedItem.ideal_inventory=''
            this.editedItem.inventory=[]
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            if(this.editedItem.product_type=='Simple'){
                this.cost=''
                this.price=''
                this.superiorID=''
            }else if(this.editedItem.product_type=='Variación'||this.editedItem.product_type=='Variable'){
                this.editedItem.type == 'Fabricado'
                this.provider_id=''
                if(this.editedItem.product_type=='Variable'){
                    this.editedItem.is_published=true
                    this.editedItem.ideal_inventory=''
                    this.editedItem.price=''
                    this.editedItem.superiorID=''
                    this.editedItem.unit_id=''
                    this.editedItem.provider_id=''
                }
                else if(this.editedItem.product_type=='Variación'){
                    this.editedItem.categories=[]
                    this.editedItem.provider_id=''
                }
            }
            this.$nextTick(() => {
                axios.post(process.env.VUE_APP_BACKEND + "api/v1/item/create",Object.assign(this.editedItem)).then(response=>{
                    var inventario = {
                        created_by_user_id: this.currentUser.id,
                        type:'Creación de Producto',
                        item_id:this.editedItem.id,
                        quantity: this.editedItem.inventory[0]
                    }
                    this.$nextTick(() => {
                        axios.post(process.env.VUE_APP_BACKEND + "api/v1/inventory/create",Object.assign(inventario)).then(response=>{
                            this.close()
                        }).catch(error => {
                            this.snackbar = {
                                message: error.response.data.message,
                                color: 'error',
                                show: true
                            }
                            this.gris = false
                        })
                    })
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                    this.gris = false
                }) 
            })
        },
        saveCategory(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/category/create",Object.assign(this.createCategory)).then(response=>{
                this.$store.dispatch('category/getCategories')
                this.disable = true
                this.createCategory.name=''
            }) 
        },
        saveProvider(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/provider/create",Object.assign(this.createProvider)).then(response=>{
                this.$store.dispatch('provider/getProviders')
                this.disable = true
                this.createProvider.name=''
            }) 
        },
        saveUnit(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/unit/create",Object.assign(this.createUnit)).then(response=>{
                this.$store.dispatch('unit/getUnits')
                this.disable = true
                this.createUnit.name=''
            }) 
        }
    }
}
</script>