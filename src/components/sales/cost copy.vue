<template>
  <v-container>
      <v-btn @click="save">save</v-btn>
      <v-data-table :items="sales" :headers="header"></v-data-table>
      <!--v-data-table :items="logs" :headers="header"></v-data-table-->
  </v-container>
</template>

<script>
import axios from "axios";
export default {
    computed:{
        sales(){
            return this.$store.state.quotation.quotations
            .filter(quotation=>quotation.invoice_date==null || quotation.invoice==null)
            .map(id=>{
                return{
                    id: id.id,
                    invoice: this.invoiceFromShipping(id.id, id.invoice),
                    invoice_date: this.invoiceDateFromShipping(id.id, id.invoice_date)
                }
            }).filter(quotation=>quotation.invoice_date!=null || quotation.invoice!=null)
        },
        header(){ return [
            { text: 'id', value: 'id' },
            { text: 'Factura', value: 'invoice' },
            { text: 'Fecha', value: 'invoice_date' },
        ]},
    },
    methods:{
        invoiceFromShipping(sale_id, invoice){
            if(invoice==null){
                var shippingInvoice = this.$store.state.shipping_detail.shipping_details.filter(shipping=>shipping.sale_id == sale_id).map(shipping=>shipping.invoice)[0]
                if(shippingInvoice!=undefined && shippingInvoice!='' && shippingInvoice!=null){
                    return shippingInvoice
                }else{
                    return null
                }
            }else{
                return invoice
            }
        },
        invoiceDateFromShipping(sale_id, invoice_date){
            if(invoice_date==null){
                var shippingInvoice = this.$store.state.shipping_detail.shipping_details.filter(shipping=>shipping.sale_id == sale_id).map(shipping=>shipping.created_at)[0]
                if(shippingInvoice!=undefined && shippingInvoice!='' && shippingInvoice!=null){
                    return new Date(shippingInvoice).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                }else{
                    return null
                }
            }else{
                return invoice_date
            }
        },
        save(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/bulk-collection-detail",Object.assign(this.sales))
        }
    }
}
</script>

<style>

</style>