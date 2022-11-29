<template>
    <v-container v-if="perro">
        <v-row class="ma-0">
            Folio: #{{sale.id}}
            <v-spacer></v-spacer>
            {{date}} 
        </v-row>
        <div style="text-align:center;">
            Razón Social:  {{sale.company.attributes.razon_social}}
            <br>
            Nombre Comercial: {{sale.company.attributes.name}}
            <br>
            # Macro: {{sale.company.attributes.macro}}
            <br>
            Vendedor: {{sale.user.name}} {{sale.user.last}}
            <br>
            Recarga: {{recarga(sale.pos_sale)}}
            <br>
            Fecha Programada: {{sale.date}}
            <br>
            Atendió: {{sale.created_by_user_id.name}} {{sale.created_by_user_id.last}} 
        </div>
        <div style="border-top:solid 1px black; border-bottom: solid 1px black; text-align:center;" class="py-2">Dirección: {{sale.company.attributes.delivery_address}}<br>
            Horario: {{sale.company.attributes.delivery_time}}
        </div>
        <v-row class="ma-0 pt-2">
            Peso: {{sale.sale_total_weight}} kg
            <v-spacer></v-spacer>
            {{sale.type}}
        </v-row>

        <v-row class="ma-0">
            <v-col cols="3" style="border-bottom:1px solid black;">
                Cant
            </v-col>
            <v-col cols="3" style="border-bottom:1px solid black;">
                Concepto
            </v-col>
            <v-col cols="3" style="border-bottom:1px solid black;">
                PU
            </v-col>
            <v-col cols="3" style="border-bottom:1px solid black;">
                Total
            </v-col>


            <v-row class="ma-0">
                <v-col cols="12" v-for="(item, index) in sale.items" v-bind:key="index" class="pa-0">
                    <v-row class="ma-0">
                        
                        <v-col cols="3" >
                            {{item.quantity}} {{item.item.unit.name}}
                        </v-col>
                        <v-col cols="3">
                            {{item.item.name}}
                        </v-col>

                        <v-col cols="3" v-show="sale.type=='Serie A'">
                            {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        </v-col>
                        <v-col cols="3" v-show="sale.type=='Serie A'">
                            {{(item.price*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        </v-col>
                        <v-col cols="3" v-show="sale.type=='Serie B'">
                            {{(item.price*1.08).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        </v-col>
                        <v-col cols="3" v-show="sale.type=='Serie B'">
                            {{((item.price*item.quantity)*1.08).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        </v-col>

                    </v-row>
                </v-col>
            </v-row>
        </v-row>

        <v-row class="ma-0" v-show="sale.type=='Serie A'">
            <v-spacer></v-spacer>
            <v-col cols="3" class="py-1 pt-2" style="border-top:1px solid black;">
                Subtotal
            </v-col>
            <v-col cols="3" class="py-1 pt-2" style="border-top:1px solid black;">
                {{sale.subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </v-col>
        </v-row>
        <v-row class="ma-0" v-show="sale.type=='Serie A'">
            <v-spacer></v-spacer>
            <v-col cols="3" class="py-1">
                IVA
            </v-col>
            <v-col cols="3" class="py-1">
                {{sale.iva.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </v-col>
        </v-row>
        <v-row class="ma-0">
            <v-spacer></v-spacer>
            <v-col cols="3" class="py-1">
                Total
            </v-col>
            <v-col cols="3" class="py-1">
                {{((sale.subtotal*1)+(sale.iva*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </v-col>
        </v-row>

        <div class="my-2 pb-6">
            Aclaraciones:
            <!--br> {{conditions(company(sale.company_id))}}-->
        </div>

        <v-row class="ma-0 tablaBorder">
            <v-col cols="4" class="tablaBorder">
                Cant
            </v-col>
            <v-col cols="4" class="tablaBorder">
                Cod
            </v-col>
            <v-col cols="4" class="tablaBorder">
                PU
            </v-col>

            <v-row class="ma-0">
                <v-col cols="12" v-for="(item, index) in sale.items" v-bind:key="index" class="pa-0">
                    <v-row class="ma-0">
                        <v-col cols="4" class="tablaBorder">
                            {{item.quantity}} {{item.item.unit.name}}
                        </v-col>
                        <v-col cols="4" class="tablaBorder">
                            {{item.item.macro}}
                        </v-col>
                        <v-col cols="4" class="tablaBorder" v-show="sale.type=='Serie A'">
                            {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        </v-col>
                        <v-col cols="4" class="tablaBorder" v-show="sale.type=='Serie B'">
                            {{(item.price*1.08).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-row>

        <div style="border-top:solid 1px black; text-align:center; margin-top:70px;">Firma de quien surte</div>
        <div style="border-top:solid 1px black; text-align:center; margin-top:50px;">Firma de quien entrega</div>

        <v-btn v-if="printButton==true" bottom color="#e25200" dark fab fixed right @click="dalecandela()">
            <v-icon color="white">  mdi-printer </v-icon>
        </v-btn> 
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        sale:[],
        printButton:true,
        perro:false
    }),
    created(){
        var id = localStorage.getItem('printTicket')
        axios.get(process.env.VUE_APP_BACKEND + "api/v1/sales/"+id).then(response => {
            this.sale = response.data.data
            this.perro = true
            localStorage.removeItem("printTicket")
        })
    },
    methods:{
        recarga(bar){
            if(bar!=1){
                return 'No'
            }else{
                return 'Si'
            }
        },
        itemDetail(item){
            return this.$store.state.item.items.filter(item=>item.id == item.id)[0]
        },
        dalecandela() {
            this.printButton=false
            this.$nextTick(() => {
                window.print();
                this.$nextTick(() => {
                    window.print();
                    this.$nextTick(() => {
                        window.close();
                    })
                })
            })
        },
    },
    computed:{
        date(){
            var hours = new Date().getHours();
            var minutes = new Date().getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return new Date().toLocaleDateString('es-MX') + ' ' + strTime
        }
    }
}
</script>
<style>
    .tablaBorder{
        border:solid 1px black!important;
    }
</style>