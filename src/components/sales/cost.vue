<template>
  <v-container>
      <v-btn @click="save">save</v-btn>
      <v-data-table :items="collectionsDetails" :headers="header"></v-data-table>
      <!--v-data-table :items="logs" :headers="header"></v-data-table-->
  </v-container>
</template>

<script>
import axios from "axios";
export default {
    computed:{
        collectionsDetails(){
            var collcetion_details = this.$store.state.collection.collections
            var sales = []
            for(var i=0; i<collcetion_details.length; i++){
                for(var j=0; j<collcetion_details[i].salesID.length; j++){
                    sales = sales.concat([collcetion_details[i].salesID[j]].map(id=>{
                        return{
                            amount: id.amount,
                            due: id.due,
                            new_due: id.newDue,
                            collection_id: collcetion_details[i].id,
                            sale_id: id.id,
                            created_at: new Date(collcetion_details[i].created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 18),
                            updated_at: new Date(collcetion_details[i].updated_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 18),
                        }
                    }))
                }
            }
            return sales
        },
        header(){ return [
            { text: 'amount', value: 'amount' },
            { text: 'due', value: 'due' },
            { text: 'new_due', value: 'new_due' },
            { text: 'collection_id', value: 'collection_id' },
            { text: 'sale_id', value: 'sale_id' },
            { text: 'created_at', value: 'created_at' },
            { text: 'updated_at', value: 'updated_at' },
        ]},
    },
    methods:{
        save(){
            axios.post("https://unowipes.com/api/v1/collection/bulk-collection-detail",Object.assign(this.collectionsDetails))
        }
    }
}
</script>

<style>

</style>