<template>
    <v-container>
        <v-btn @click="save()">save</v-btn>
        <v-data-table
        :items="records" 
        :headers="header"
        :footer-props="{'items-per-page-options':[15, 30, 50, totalSales]}"
        :options.sync="options"
        :server-items-length="totalSales"
        :loading="loading">
        </v-data-table>

    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        totalSales: 0,
        records: [],
        loading: true,
        options: {},
    }),
    computed:{
        header(){ return [
            {text: 'sale_id', value: 'sale_id'},
            {text: 'device_id', value: 'device_id'},
            {text: 'price', value: 'price'},
            {text: 'value', value: 'value'},
            {text: 'cost', value: 'cost'},
            {text: 'quantity', value: 'quantity'},
            {text: 'weight', value: 'weight'},
        ]},
    },
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.records = data.quotations_details
                this.totalSales = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var quotations_details = []
                var quotations = []
                var total = 0
                axios.get(process.env.VUE_APP_BACKEND + "api/v1/sales?page=" + page + "&itemsPerPage=" + 99999999).then(response => {
                    quotations = response.data.data//.map(quotation=>quotation.items)
                    quotations_details = []
                    for(var i=0; i<quotations.length; i++){
                        for(var j=0; j<quotations[i].items.length; j++){
                            quotations_details.push([quotations[i].items[j]].map(id=>{
                                return{
                                    sale_id: quotations[i].id,
                                    device_id: id.item,
                                    price: id.price*1,
                                    quantity: id.quantity*1,
                                    weight: id.weight*1,
                                    value:this.tieneValue(id.item),
                                    cost:this.tieneCost(id.item)
                                }
                            })[0])
                            total = total + 1
                        }
                    }
                    resolve({
                        quotations_details,
                        total,
                    })
                })
            })
        },
        save(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/sale_details/bulk-create", this.records)
        },
        tieneValue(item){
            if(item!=undefined){
                return 799
            }else{
                return ''
            }
        },
        tieneCost(item){
            if(item!=undefined){
                return 795
            }else{
                return ''
            }
        }
    },
}
</script>