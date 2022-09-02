<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8">
            <strong>Filtros</strong>
            <v-spacer></v-spacer>
            <v-btn @click="deleteFilters" small class="elevation-0" style="border:solid 1px #dddddd;">
                <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
            </v-btn>

            <div class="mt-4">
                Fecha de creación 
                <v-menu offset-y :close-on-content-click="closeDatePicker(client.created_at)">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="client.created_at" label="Fecha Creación" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="client.created_at" range></v-date-picker>
                </v-menu>
            </div>

            <v-text-field @keydown.enter="filter()" v-model="client.name" label="Nombre"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="client.address" label="Dirección"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="client.phone" label="Teléfono"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="client.email" label="Correo Electrónico"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="client.rfc" label="RFC"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="client.razon_social" label="Razón Social"></v-text-field>

            <v-select @keydown.enter="filter()" v-model="client.origins" :items="originLists" item-text="name" item-value="id" attach chips label="Procedencia" multiple>
            </v-select>

            <v-select @keydown.enter="filter()" v-model="client.statuses" :items="statusLists" item-text="name" item-value="id" attach chips label="Estatus" multiple>
            </v-select>

            <v-select @keydown.enter="filter()" v-model="client.users" :items="usersLists" item-text="name" item-value="id" attach chips label="Vendedor" multiple>
            </v-select>
        </v-row>

        <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary"><!-- # d71182 -->
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
        client:{
            users:'',
            origins:'',
            statuses:'',
            name:'',
            address:'',
            phone:'',
            email:'',
            rfc:'',
            razon_social:'',
            created_at:''
        },
    }),
    computed: {
        usersLists(){
            return this.$store.state.user.users;
        },
        originLists(){
            return this.$store.state.origin.origins;
        },
        statusLists(){
            return this.$store.state.status.statuses;
        },
    },
    created () {
        let params = JSON.parse(localStorage.getItem('filtersClients'))
        if(params!=undefined){
            this.client = params
        }
    },
    methods: {
        filter(){
            var count = 0
            var filter = ''
            //abierto
            if(this.client.name!=''){
                count = count+1
                filter = filter + '&filter[name]='+this.client.name
            }
            if(this.client.address!=''){
                count = count+1
                filter = filter + '&filter[address]='+this.client.address
            }
            if(this.client.phone!=''){
                count = count+1
                filter = filter + '&filter[phone]='+this.client.phone
            }
            if(this.client.email!=''){
                count = count+1
                filter = filter + '&filter[email]='+this.client.email
            }
            if(this.client.rfc!=''){
                count = count+1
                filter = filter + '&filter[rfc]='+this.client.rfc
            }
            if(this.client.razon_social!=''){
                count = count+1
                filter = filter + '&filter[razon_social]='+this.client.razon_social
            }
            //multiples
            if(this.client.users.length>0){
                count = count+1
                filter = filter + '&filter[user_id]='
                var length = this.client.users.length
                for(var i=0; i<length; i++){
                    filter = filter + this.client.users[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            //select
            if(this.client.origins!=''){
                count = count+1
                filter = filter + '&filter[origin_id]='+this.client.origins
            }
            if(this.client.statuses!=''){
                count = count+1
                filter = filter + '&filter[status_id]='+this.client.statuses
            }
            //date
            if(this.client.created_at.length==2){
                count = count+1
                filter = filter + '&filter[created_between]=' + this.client.created_at[0] + ',' + this.client.created_at[1]
            }
            localStorage.setItem('selectorFiltersClients', JSON.stringify(this.client));
            localStorage.setItem('entriesFiltersClients', JSON.stringify(this.entries));
            localStorage.setItem('filtersClients', JSON.stringify(filter.slice(1,filter.length)));
            localStorage.setItem('filtersClientsLength', count)
            this.$nextTick(() => {
                this.$emit("filtersClient", 'perro');
            })
        },
        closeDatePicker(dates){
            if(dates.length==2){
                return true
            }else{
                return false
            }
        },
        deleteFilters(){
            this.client = {
                users:'',
                origins:'',
                statuses:'',
                name:'',
                address:'',
                phone:'',
                email:'',
                rfc:'',
                razon_social:'',
                dateCreateFrom:'',
                dateCreateTo:'',
            }
            localStorage.removeItem("selectorFiltersClients")
            localStorage.removeItem("entriesFiltersClients")
            localStorage.removeItem("filtersClients")
            localStorage.removeItem("filtersClientsLength")
            this.$nextTick(() => {
                this.$emit("filtersClient", 'perro');
            })
        }
    }
  }
</script>