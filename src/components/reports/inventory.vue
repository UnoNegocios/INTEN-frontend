<template>
    <v-container style="max-width:100vw;">
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterInventory @filtersInventory="filtersInventory"/>
        </v-navigation-drawer>
        <!-- Contenedor show-select -->
        <v-data-table :headers="headers" :items="inventory" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat style="z-index:9!important;">
                    <v-toolbar-title> Movimientos de Inventario </v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>

                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                    ></v-text-field>

                    <v-list v-show="search!=''" dense class="pa-2 elevation-1" style="position: absolute; right: 0; top: 50px; background:white!important; overflow: scroll; max-height:50vh; min-width:45%;">
                        <v-list-item v-show="filter.length>0" @click="searchAction(item)" v-for="(item, i) in filter" :key="i" style="border-bottom:solid 1px #e0e0e0;">
                            {{item}}
                        </v-list-item>
                        <div class="pa-4" v-show="filter.length==0">No hay resultados relacionados</div>
                    </v-list>

                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }" >
                <v-icon v-show="permissions('delete_inventory_reports')" small @click="deleteItem(item.id)">mdi-delete</v-icon>
            </template>
        </v-data-table>

        <!--v-card class="pa-6">
            <v-autocomplete v-model="ana.user_id" :items="userLists" item-text="name" item-value="id" label="Vendedor">
            </v-autocomplete>

            <v-autocomplete v-model="ana.consumptions" :items="categoryLists" item-text="name" item-value="id" label="Categoría de Consumos">
            </v-autocomplete>

            <v-data-table sort-by="name" v-model="selected" item-key="email" show-select :headers="headers2" :items="anita"></v-data-table>
        </v-card>

        {{selected.map(perro=>perro.email)}}-->



    </v-container>
</template>

<script>
import axios from "axios";
import filterInventory from "../physical_inventory/filter"
export default {
    components: {
        'filterInventory':filterInventory
    },
    data:()=>({ 
        ana:{
            consumptions:'',
            user_id:''
        },
        headers2:[
            {text: 'Empresa', value: 'name'},
            {text: 'Contacto', value: 'contacto'},
            {text: 'Email', value: 'email'},
            {text: 'Categoría', value: 'category'},
        ],
        search:'',
        itemFilterValue:'',
        filters:false,
        inventory: '',
        selected: [],
    }),
    computed: {
        headers(){ 
            this.inventoryGenerate
            return [
            { text: 'Tipo', value: 'type' },
            { text: 'Cantidad', value: 'inventory' },
            { text: 'Producto', value: 'item_id', filter: this.itemFilter},

            { text: 'Fecha', value: 'created_at' },
            { text: 'Responsable', value: 'created_by_user_id' },
            
            { text: 'Producción', value: 'production_id' },
            { text: 'Venta', value: 'sale_id' },
            { text: 'Compra', value: 'shopping_id' },

            { text: 'Ajuste', value: 'quantity' },

            {text: 'Acciones', value: 'actions', sortable: false },
        ]},
        inventoryGenerate(){
            var perro = this.$store.state.inventory.inventories.map(id=>{
                return{
                    id: id.id,
                    type: id.type,
                    quantity: id.quantity,
                    inventory: this.cerono(id.inventory),
                    item_id: this.item(id.item_id),
                    created_at: new Date(id.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).split('T'),
                    created_by_user_id: this.user(id.created_by_user_id),
                    production_id: id.production_id,
                    sale_id: id.sale_id,
                    shopping_id: id.shopping_id,
                }
            })
            this.inventory = perro
        },
        userLists(){
            return this.$store.state.user.users;
        }, 
        categoryLists(){
            return this.$store.state.category.categories;
        },
        anita(){
            var clients = this.$store.state.company.companies
            if(this.ana.user_id!=''){
                clients = clients.filter(company=>company.user_id == this.ana.user_id)
            }
            if(this.ana.consumptions!=''){

                clients = clients.filter(company=>this.estac(company.consumptions, this.ana.consumptions))

            }
            var emails = []
            for(var i=0; i<clients.length; i++){
                emails = emails.concat(this.$store.state.contact.contacts.filter(contact=>contact.company_id == clients[i].id).map(id=>{
                    return{
                        email:id.email,
                        name: this.companyName(id.company_id),
                        contacto: id.name,
                        category: this.category(id.company_id)
                    }
                }))
            }
            clients = clients.map(id=>{
                return{
                    email:id.email,
                    name: id.name,
                    contacto:'',
                    category: this.categoryName(id.consumptions)
                }
            })
            var respuesta = clients.concat(emails)
            var gato = respuesta.filter(resp=>resp.email!=undefined && resp.email!=null && resp.email!='')
            return this.removeDuplicates(gato, "email")
        },
        currentUser(){
            return this.$store.state.currentUser.user
        },
        filter(){
            if(this.search!=''&&this.search!=null&&this.search!=undefined){
                var perro = this.$store.state.item.items

                var words = this.search.split(" ")
                for(var i=0; i<words.length; i++){
                    perro = perro.filter(item=>this.lowerCase(JSON.stringify(item.name)).includes(words[i].toLowerCase()))
                }

                return perro.map(item=>item.name)
            }
            else{
                return ''
            }
        },
    },
    methods:{
        searchAction(item){
            this.itemFilterValue=item
            this.search = ''
        },
        itemFilter(value) {
            if (!this.itemFilterValue) {
                return true;
            }
            return value==this.itemFilterValue
            
        },
        permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        },
        category(id){
            return this.categoryName(this.$store.state.company.companies.filter(a=>a.id == id).map(a=>a.consumptions)[0])
        },
        categoryName(ids){
            if(ids!=undefined){
                var perro = this.$store.state.category.categories.filter(category=>category.id == ids[0]).map(category=>category.name)[0]
                for(var i=1; i<ids.length; i++){
                    perro = perro + ', ' + this.$store.state.category.categories.filter(category=>category.id == ids[i]).map(category=>category.name)[0]
                }
                return perro
            }
        },
        companyName(id){
            return this.$store.state.company.companies.filter(a=>a.id == id).map(a=>a.name)[0]
        },
        hora(h){
            if(h>6){
                return h-6
            }else{
                switch(h){
                    case 0: return 18
                    case 1: return 19
                    case 2: return 20
                    case 3: return 21
                    case 4: return 22
                    case 5: return 23
                    case 6: return 0
                }
            }
        },
        filtersInventory: function(params) {
            this.items = ''
            var filterInventory = this.$store.state.inventory.inventories

            //fecha
            if(params.dateFrom!='' && params.dateFrom!=null && params.dateFrom!=undefined){
                filterInventory=filterInventory.filter(inventory=>new Date(inventory.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}) >= new Date(params.dateFrom + ' 00:00:00').toLocaleString("sv-SE", {timeZone: "America/Monterrey"}))
            }
            if(params.dateTo!='' && params.dateTo!=null && params.dateTo!=undefined){
                filterInventory=filterInventory.filter(inventory=>new Date(inventory.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}) <= new Date(params.dateTo + ' 23:59:59').toLocaleString("sv-SE", {timeZone: "America/Monterrey"}))
            }

            //responsable
            if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                var uno = filterInventory.filter(item=>item.created_by_user_id == params.user_id[0])
                for(var i=1; i<params.user_id.length; i++){
                    uno=uno.concat(filterInventory.filter(item=>item.created_by_user_id == params.user_id[i]))   
                }
                filterInventory = this.removeDuplicates(uno, "id");
            }
            //producto
            if(params.item_id!=''&&params.item_id!=undefined&&params.item_id!=null){
                var dos = filterInventory.filter(item=>item.item_id == params.item_id[0])
                for(var i=1; i<params.item_id.length; i++){
                    dos=dos.concat(filterInventory.filter(item=>item.item_id == params.item_id[i]))   
                }
                filterInventory = this.removeDuplicates(dos, "id");
            }
            //tipo
            if(params.type!=''&&params.type!=undefined&&params.type!=null){
                var tres = filterInventory.filter(item=>item.type == params.type[0])
                for(var i=1; i<params.type.length; i++){
                    tres=tres.concat(filterInventory.filter(item=>item.type == params.type[i]))   
                }
                filterInventory = this.removeDuplicates(tres, "id");
            }

            this.inventory = filterInventory.map(id=>{
                return{
                    id: id.id,
                    type: id.type,
                    quantity: id.quantity,
                    inventory: this.cerono(id.inventory),
                    item_id: this.item(id.item_id),
                    created_at: new Date(id.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).split('T'),
                    created_by_user_id: this.user(id.created_by_user_id),
                    production_id: id.production_id,
                    sale_id: id.sale_id,
                    shopping_id: id.shopping_id,
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
        cerono(value){
            if(value>=0 || value<=0){
                return value
            }else{
                return ''
            }
        },
        user(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user=>user.name + ' ' + user.last)[0]
        },
        item(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item=>item.name)[0]
        },
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
        deleteItem (id) {
            if (confirm('¿Seguro que deseas borrar este movimiento de inventario?')) {
                axios.delete(process.env.VUE_APP_BACKEND + "api/v1/inventory/delete/"+id).then(response => {
                    this.$store.dispatch('inventory/getInventories')
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                });
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
        estac(ids, param){
            if(ids!=undefined){
                for(var i=0; i<ids.length; i++){
                    if(ids[i]==param){
                        return true
                    }
                }
            }
        }
    }
}
</script>