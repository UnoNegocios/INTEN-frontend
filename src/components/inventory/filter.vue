<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8">
            <strong class="mb-3">Filtros</strong>

            <v-text-field v-model="items.name" clearable label="Nombre"></v-text-field>

            <v-select v-model="items.publish" clearable :items="sino" label="Publicado"></v-select>

            <v-select v-model="items.type" clearable :items="types" label="Tipo"></v-select>
            
            <v-select v-model="items.product_type" clearable :items="productTypes" label="Tipo de Producto"></v-select>

            <v-text-field v-model="items.code" v-if="catalogo!='catalogo'" clearable label="Macro"></v-text-field>

            <v-autocomplete @keydown.enter="filter()" v-if="catalogo!='catalogo'" v-model="items.provider" :items="providers" item-text="name" item-value="id" attach chips label="Proveedor" multiple>
            </v-autocomplete>

            <v-autocomplete @keydown.enter="filter()" v-model="items.category" :items="categories" item-text="name" item-value="id" attach chips label="Categoría" multiple>
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
    props:{
        catalogo:String
    },
    data: () => ({
        items:{
            name:'',
            type:'',
            product_type:'',
            code:'',
            provider:'',
            category:'',
            publish:'',
        },
        productTypes:[
            'Simple', 'Variable', 'Variación'
        ],
        types:[
            'Insumo', 'Fabricado', 'Producto Final'
        ],
        sino:[
            {text:'Si', value:true},{text:'No', value:false}
        ]
    }),
    created(){

    },
    computed: {
        categories(){
            return this.$store.state.category.categories
        },
        providers(){
            return this.$store.state.provider.providers
        }
    },
    created () {

    },
    methods: {
        filter(){
            this.$emit("filtersItem", this.items);
        },
    }
  }
</script>