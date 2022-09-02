<template>
    <v-container style="max-width:100vw;">

        <v-card class="pa-6">
            <v-autocomplete v-model="ana.user_id" :items="userLists" clearable item-text="name" item-value="id" label="Vendedor">
            </v-autocomplete>

            <v-autocomplete v-model="ana.consumptions" clearable :items="categoryLists" item-text="name" item-value="id" label="Categoría de Consumos">
            </v-autocomplete>

            <v-data-table sort-by="name" v-model="selected" item-key="email" show-select :headers="headers2" :items="anita"></v-data-table>
        </v-card>

        {{templates}}
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data:()=>({ 
        ana:{
            consumptions:'',
            user_id:''
        },
        selected: [],
        headers2:[
            {text: 'Empresa', value: 'name'},
            {text: 'Contacto', value: 'contacto'},
            {text: 'Email', value: 'email'},
            {text: 'Categoría', value: 'category'},
        ],
    }),
    computed: {
        templates(){
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + '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'
                }
            }
            const bodyParameters = {
                page_size: "100",
                summary: true,
            };
            axios.get("https://api.sendgrid.com/v3/designs", bodyParameters, config).then(response=>{
                return response
            })
        },
        userLists(){
            return this.$store.state.user.users;
        }, 
        categoryLists(){
            return this.$store.state.category.categories;
        },
        anita(){
            var clients = this.$store.state.company.companies
            if(this.ana.user_id!=''&&this.ana.user_id!=null&&this.ana.user_id!=undefined){
                clients = clients.filter(company=>company.user_id == this.ana.user_id)
            }
            if(this.ana.consumptions!=''&&this.ana.consumptions!=null&&this.ana.consumptions!=undefined){

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
    },
    methods:{
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
        user(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user=>user.name + ' ' + user.last)[0]
        },
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
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
        },
        send(){

        }
    }
}
</script>