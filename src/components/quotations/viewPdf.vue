<template>
    <v-app class="pa-0" style="background-color:white;">

        <div class="invoice-box" style="background-color:white;" id="divName" elevation="0">
            <table cellpadding="0" cellspacing="0" class="divName" style="max-width:644px!important;">
                <tr class="top">
                <td colspan="4">
                    <table>
                        <tr>
                            <td class="title" style="padding-bottom:5px!important;">
                            <img src="logoEFI.jpg" style="width:100%; max-width:200px;">
                            </td>
                            <td style="font-size:15px; line-height:1.5em;">
                            Cotización #: {{quotation.id}}<br> {{fecha(quotation.created_at)}}<br> <strong>{{companyName(quotation.company_id)}}</strong>
                            </td>
                        </tr>
                    </table>
                </td>
                </tr>
                <div style="height: 1px; background: #eeeeee; width: 644px; position: absolute;"></div>
                <div style="height:10px;"></div>
                <tr class="information" style="font-size:14px; line-height:1.5em;">
                    <td colspan="4" style="padding-bottom:0px!important;">
                        <table>
                        <tr>
                            <td style="padding-bottom:30px!important;">
                            Av. Jose Vasconcelos Pte #230, <br>col. Del Valle, 66220 <br>San Pedro Garza García, N.L. México.
                            </td>
                            <td style="padding-bottom:0px!important;">
                            EFI Industrial S.A. de C.V.<br> 
                            RFC: EIN121213EAA<br>
                            {{currentUser.name}} {{currentUser.last}} | {{currentUser.email}}
                            </td>
                        </tr>
                        </table>
                    </td>
                </tr>
                <tr class="heading">
                    <td style="text-align:center;">Cantidad</td>
                    <td style="text-align:center;">Producto</td>
                    <td style="text-align:center;">Precio Unitario</td>
                    <td style="text-align:center;">Total</td>
                </tr>
                <tr class="item" v-for="(item, index) in quotation.items" :key="index">
                    <td style="text-align:center;">{{item.quantity}}</td>
                    <td style="text-align:center;">{{itemName(item.item)}}</td>
                    <td style="text-align:center;">{{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</td>
                    <td style="text-align:center;">{{ ((item.quantity*1)*(item.price*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td>
                </tr>
                <div style="height:20px;"></div>
                <!--div style="position:absolute;" v-if="(quotation.total*.1)>((quotation.total*1)-(quotation.subtotal*1))">*Precios + REMISIÓN</div>
                <div style="position:absolute;" v-else>*Precios + IVA</div-->
                <div style="position:absolute; font-size:14px; line-height: 1.6em;">
                    <div v-if="creditDays(quotation.company_id)>=1"><strong>Condiciones de pago:</strong> {{creditDays(quotation.company_id)}} días de credito</div>
                    <v-row style="padding:5px 5px 1px 5px; margin:15px 0px; background:#eeeeee;">
                        <img src="banregio.jpg" style="width:auto; max-height:40px;">
                        
                        <div style="padding:0px 10px;">
                        <strong>Cuenta: </strong>025028060010<br/><strong>Clabe: </strong>058580250280600102
                        </div>
                    </v-row>
                </div>
                <!--tr>
                    <td colspan="3"></td>
                    <td>Subotal: {{ quotation.subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td><br>
                </tr>
                <tr >
                    <td colspan="3"></td>
                    <td>IVA: {{ ((quotation.total*1)-(quotation.subtotal*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td><br>
                </tr-->
                <tr class="total">
                    <td colspan="3"></td>
                    <td>Total: {{ quotation.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td>
                </tr>
                <div style="height:30px; margin-top:30px;"></div>
                <tr>
                    <td colspan="4" style="font-size:12px; line-height: 1.6em;" class="pt-10">
                        <strong>CONDICIONES: </strong><br>
                        - Entrega sin costo en el Area Metropolitana en compras mayores a $2,000 + IVA <br>
                        - Cualquier maniobra requerida adicional a la descarga libre a bordo, genera costo extra. <br>
                        - Entregas a domicilio en todo el estado de Nuevo León, rutas foráneas sujetas a tarifa de costo extra <br>
                        - La información contenida en la presente, es exclusivamente para la persona y/o empresa a la que esta dirigida. <br>
                        - Todos los precios señalados están sujetos a cambios sin previo aviso.<br>
                        - En cambio o devolución sin justificación, se generara un cargo de 10% <br>siendo responsabilidad de cliente los gastos de envio.
                    </td>
                </tr>
                <span style="font-size:12px; position:absolute;">Esta cotización tiene valides hasta el {{new Date(quotation.due_date).toLocaleDateString()}}</span>
            </table>
            <div style="height:120px;"></div>
            <div style="background:#363536; color:white; font-size:12px; line-height:1.5em; position:absolute; bottom:0; width: 644px;" class="mt-6 pa-4">
                <v-row class="px-6 pt-2 pb-5">
                    www.efiindustrial.com 
                    <v-divider style="border-color: transparent!important;"></v-divider>
                    <v-icon class="mr-3" small color="white">mdi-phone</v-icon>(81) 8359 7575
                </v-row>
                <v-row class="px-6 pb-2">
                    <v-icon class="mr-3" small color="white">mdi-map-marker</v-icon>Elías Reynoso Santana 314, Buenos Aires 64800, Monterrey, N.L.
                    <v-divider style="border-color: transparent!important;"></v-divider>
                    <v-icon class="mr-3" small color="white">mdi-whatsapp</v-icon>(81) 2474 0479
                </v-row>
            </div>
        </div>

        <VueHtml2pdf :manual-pagination="true" :enable-download="true" ref="DownloadComp" :image="{ type: 'jpg', quality: 1 }"><!-- :html-to-pdf-options="htmlToPdfOptions" -->
            <section slot="pdf-content">
                <div class="invoice-box" style="background-color:white; padding:30px!important;" id="divName" elevation="0">
                    <table cellpadding="0" cellspacing="0" class="divName">
                        <tr class="top">
                        <td colspan="4">
                            <table>
                                <tr>
                                    <td class="title" style="padding-bottom:5px!important;">
                                    <img src="/logoEFI.jpg" style="width:100%; max-width:200px;">
                                    </td>
                                    <td style="font-size:15px; line-height:1.5em;">
                                    Cotización #: {{quotation.id}}<br> {{fecha(quotation.created_at)}}<br> <strong>{{companyName(quotation.company_id)}}</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        </tr>
                        <div style="height: 1px; background: #eeeeee; width: 644px; position: absolute;"></div>
                        <div style="height:10px;"></div>
                        <tr class="information" style="font-size:14px; line-height:1.5em;">
                            <td colspan="4" style="padding-bottom:0px!important;">
                                <table>
                                <tr>
                                    <td style="padding-bottom:30px!important;">
                                    Av. Jose Vasconcelos Pte #230, <br>col. Del Valle, 66220 <br>San Pedro Garza García, N.L. México.
                                    </td>
                                    <td style="padding-bottom:0px!important;">
                                    EFI Industrial S.A. de C.V.<br> 
                                    RFC: EIN121213EAA<br>
                                    {{currentUser.name}} {{currentUser.last}} | {{currentUser.email}}
                                    </td>
                                </tr>
                                </table>
                            </td>
                        </tr>
                        <div style="max-width:644px!important;">
                            <tr class="heading">
                                <td style="text-align:center;">Cantidad</td>
                                <td style="text-align:center;">Producto</td>
                                <td style="text-align:center;">Precio Unitario</td>
                                <td style="text-align:center;">Total</td>
                            </tr>
                            <tr class="item" v-for="(item, index) in quotation.items" :key="index">
                                <td style="text-align:center;">{{item.quantity}}</td>
                                <td style="text-align:center;">{{itemName(item.item)}}</td>
                                <td style="text-align:center;">{{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</td>
                                <td style="text-align:center;">{{ ((item.quantity*1)*(item.price*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td>
                            </tr>
                        </div>
                        <div style="height:20px;"></div>
                        <!--div style="position:absolute;" v-if="(quotation.total*.1)>((quotation.total*1)-(quotation.subtotal*1))">*Precios + REMISIÓN</div>
                        <div style="position:absolute;" v-else>*Precios + IVA</div-->
                        <div style="position:absolute; font-size:14px; line-height: 1.6em;">
                            <div v-if="creditDays(quotation.company_id)>=1"><strong>Condiciones de pago:</strong> {{creditDays(quotation.company_id)}} días de credito</div>
                            <v-row style="padding:5px 5px 1px 5px; margin:15px 0px; background:#eeeeee;">
                                <img src="banregio.jpg" style="width:auto; max-height:40px;">
                                <v-divider style="border-color: transparent!important;"></v-divider>
                                <div style="padding:0px 10px;">
                                <strong>Cuenta: </strong>025028060010<br/><strong>Clabe: </strong>058580250280600102
                                </div>
                            </v-row>
                        </div>
                        <!--tr>
                            <td colspan="3"></td>
                            <td>Subotal: {{ quotation.subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td><br>
                        </tr>
                        <tr >
                            <td colspan="3"></td>
                            <td>IVA: {{ ((quotation.total*1)-(quotation.subtotal*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td><br>
                        </tr-->
                        <tr class="total">
                            <td colspan="3"></td>
                            <td>Total: {{ quotation.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td>
                        </tr>
                        <div style="height:30px; margin-top:30px;"></div>
                        <tr>
                            <td colspan="4" style="font-size:12px; line-height: 1.6em;" class="pt-10">
                                <strong>CONDICIONES: </strong><br>
                                - Entrega sin costo en el Area Metropolitana en compras mayores a $2,000 + IVA <br>
                                - Cualquier maniobra requerida adicional a la descarga libre a bordo, genera costo extra. <br>
                                - Entregas a domicilio en todo el estado de Nuevo León, rutas foráneas sujetas a tarifa de costo extra <br>
                                - La información contenida en la presente, es exclusivamente para la persona y/o empresa a la que esta dirigida. <br>
                                - Todos los precios señalados están sujetos a cambios sin previo aviso.<br>
                                - En cambio o devolución sin justificación, se generara un cargo de 10% <br>siendo responsabilidad de cliente los gastos de envio.
                            </td>
                        </tr>
                    </table>
                    <div style="background:#363536; color:white; font-size:12px; line-height:1.5em; padding:20px 30px!important; margin-top:50px;">
                        <v-row class="px-6 pt-2 pb-5" style="margin-bottom:20px!important;">
                            www.efiindustrial.com 
                            <v-divider style="border-color: transparent!important;"></v-divider>
                            <v-icon class="mr-3" small color="white" style="color:white!important; margin-right:10px; padding-top:3px;">mdi-phone</v-icon>(81) 8359 7575
                        </v-row>
                        <v-row class="px-6 pb-2">
                            <v-icon class="mr-3" small color="white" style="color:white!important; margin-right:10px; padding-top:3px;">mdi-map-marker</v-icon>Elías Reynoso Santana 314, Buenos Aires 64800, Monterrey, N.L.
                            <v-divider style="border-color: transparent!important;"></v-divider>
                            <v-icon class="mr-3" small color="white" style="color:white!important; margin-right:10px; padding-top:3px;">mdi-whatsapp</v-icon>(81) 2474 0479
                        </v-row>
                    </div>
                </div>
            </section>
        </VueHtml2pdf>




        <!--v-btn v-if="printButton==true" bottom color="primary" dark fab fixed right style="bottom:165px;" @click="sendEmail()">
            <v-icon color="white">mdi-email</v-icon>
        </v-btn--> 
        <v-btn v-if="printButton==true" bottom color="#1c256a" dark fab fixed right style="bottom:90px;" @click="downloadPDF()">
            <v-icon color="white">mdi-download</v-icon>
        </v-btn> 
        <v-btn v-if="printButton==true" bottom color="#e25200" dark fab fixed right @click="dalecandela()">
            <v-icon color="white">  mdi-printer </v-icon>
        </v-btn> 
    </v-app>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import moment from 'moment';
import emailjs from 'emailjs-com';
import{ init } from 'emailjs-com';
init("user_WUxyGFs4hsxhFsnulrFVq");
export default {
    data: () => ({
        printButton:true,
        /*
        htmlToPdfOptions: { 
            image: { 
                type: 'svg',
            }, 
            tml2canvas: {
                useCORS: true
            },
        }
        */
    }),
    methods:{
        sendEmail() {
            this.printButton=false
            this.$nextTick(() => {
                emailjs.send("service_glykmzr","template_ox74hnq",{
                    credito: this.credito(this.creditDays(this.quotation.company_id)),
                    id: this.quotation.id,
                    company: this.companyName(this.quotation.company_id),
                    email: 'joelf@unonegocios.com',
                    items: this.table(this.quotation.items),
                    total: this.quotation.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    reply_to: this.user(this.quotation.user_id).email,
                    currentUser: this.user(this.quotation.user_id).name + ' ' + this.user(this.quotation.user_id).last,
                    userEmail: this.user(this.quotation.user_id).email,
                    date: this.fecha(this.quotation.created_at)
                }).then(response => {
                    this.$nextTick(() => {
                        localStorage.removeItem("print");
                        window.close();
                    })
                }).catch(error =>{ 
                    this.sendEmail()
                })
            })
        },
        credito(days){
            if(days>0){
                return '<br><strong>Condiciones de pago: </strong>' + days + 'días de credito' 
            }
        },
        table(items){
            var products = '<tr class="heading">'+
            '<td style="text-align:center; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; width:25%!important;">Cantidad</td>'+
            '<td style="text-align:center; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; width:25%!important;">Producto</td>'+
            '<td style="text-align:center; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; width:25%!important;">Precio Unitario</td>'+
            '<td style="text-align:center; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; width:25%!important;">Total</td>'+
            '</tr>'
            for (let i = 0; i < items.length; i++) {
                products = products + 
                '<tr class="item">'+
                    '<td style="text-align:center; border-bottom: 1px solid #eee;">' + items[i].quantity + '</td>' +
                    '<td style="text-align:center; border-bottom: 1px solid #eee;">' + this.itemName(items[i].item) + '*</td>' + 
                    '<td style="text-align:center; border-bottom: 1px solid #eee;">' + (items[i].price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) + '</td>' +
                    '<td style="text-align:center; border-bottom: 1px solid #eee;">' + ((items[i].quantity*1)*(items[i].price*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) + '*</td></tr>'
            }
            return products
        },
        fecha(date){
            return moment(date).format('LL')
        },
        itemName(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.name)[0]
        },
        companyName(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
        },
        creditDays(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.credit_days)[0]
        },
        user(id){
            return this.$store.state.user.users.filter(user=>user.id == id)[0]
        },
        downloadPDF () {
            this.$refs.DownloadComp.generatePdf()
        },
        dalecandela() {
            this.printButton=false
            this.$nextTick(() => {
                window.print();
                this.$nextTick(() => {
                    localStorage.removeItem("print");
                    window.close();
                })
            })
        },
    },
    computed: {
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
    },
    created(){
        this.quotation = JSON.parse(localStorage.getItem('print'));
        this.$store.dispatch('item/getItems') 
        this.$store.dispatch('company/getCompanies') 
        this.$store.dispatch('currentUser/getUser')
        this.$store.dispatch('user/getUsers')
        localStorage.removeItem("print");
    },
    components: {
        VueHtml2pdf
    }

}
</script>

<style>
.divName{
    font-family: "Roboto", sans-serif!important;
}
.invoice-box {
  max-width: 800px;
  margin: auto;
  /*padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);*/
  font-size: 16px;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(n + 2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.item input {
  padding-left: 5px;
}

.invoice-box table tr.item td:first-child input {
  margin-left: -5px;
  width: 100%;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

.invoice-box input[type="number"] {
  width: 60px;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}

/** RTL **/
.rtl {
  direction: rtl;
  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
    sans-serif;
}

.rtl table {
  text-align: right;
}

.rtl table tr td:nth-child(2) {
  text-align: left;
}
</style>