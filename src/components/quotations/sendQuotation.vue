<template>
    <v-container style="background:white;" class="text-center">
        <div class="pt-6">
        ¿A que correo quieres mandar esta cotización?
        </div>
        <v-autocomplete class="mb-4 mt-2" clearable item-text="email" v-model="email" :items="emailLists" item-value="email" label="Email" style="max-width:500px!important; margin:auto;">
            <template slot="no-data">
                <div class="px-4 py-1">
                    No existen correos relacionados. 
                    <v-text-field v-model="otroMail" type="email" label="Otro"></v-text-field>
                </div>
            </template>  
            <template v-slot:item="{item, attrs, on}">
                <v-list-item v-on="on" v-bind="attrs">
                    <v-list-item-content>
                        <v-list-item-title>
                            {{item.email}} <v-chip small class="ml-2"  style="font-size:8px;">{{item.job_position}}</v-chip>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template> 
        </v-autocomplete>
        <v-btn text @click="viewprintpdf">
        Ver Cotización
        </v-btn>
        <v-btn text color="primary" :disabled="button" @click="sendEmail()">
        Enviar
        </v-btn>
        <!-- Preview PDF -->
        <v-dialog v-model="viewPDF" max-width="800px">
            <viewPdf v-bind:quotation="quotation" @closeDialogPdf="closeDialogPdf"/>
        </v-dialog>
    </v-container>
</template>

<script>
    import emailjs from 'emailjs-com';
    import{ init } from 'emailjs-com';
    init("user_WUxyGFs4hsxhFsnulrFVq");
    import ViewPdf from "../quotations/viewPdf"
    import moment from 'moment';
    export default {
        props:{
            quotation:Object
        },
        components: {
            'viewPdf':ViewPdf,
        },
        data: () => ({
            otroMail:'',
            email:'',
            viewPDF:false,
            button:false,
        }),
        computed:{
            emailLists(){
                return this.$store.state.company.companies.filter(company=>company.id == this.quotation.company_id &&company.email!=null).concat(this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.quotation.company_id))
            }
        },
        created(){
            
        },
        methods:{
            viewprintpdf(){
                //localStorage.setItem("print", this.quotation);
                localStorage.setItem('print', JSON.stringify(this.quotation));
                window.open("/");
            },
            closeDialogPdf: function(params) {
                this.viewPDF = false;
            },
            sendEmail() {
                if(this.email==''||this.email==null||this.email==undefined){
                    this.email = this.otroMail
                }
                this.button=true
                this.$nextTick(() => {
                    emailjs.send("service_glykmzr","template_ox74hnq",{
                        credito: this.credito(this.creditDays(this.quotation.company_id)),
                        id: this.quotation.id,
                        company: this.companyName(this.quotation.company_id),
                        email: this.email,
                        items: this.table(this.quotation.items),
                        total: this.quotation.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                        reply_to: this.user(this.quotation.user_id).email,
                        currentUser: this.user(this.quotation.user_id).name + ' ' + this.user(this.quotation.user_id).last,
                        userEmail: this.user(this.quotation.user_id).email,
                        date: this.fecha(this.quotation.created_at)
                    }).then(response => {
                        location.reload();
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
            companyName(id){
                return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
            },
            creditDays(id){
                return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.credit_days)[0]
            },
            company(id){
                return this.$store.state.company.companies.filter(company=>company.id == id).map(company=>company.name)[0]
            },
            user(id){
                return this.$store.state.user.users.filter(user=>user.id == id)[0]
            },
            money(total){
                return (total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
            },
            itemName(id){
                return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.name)[0]
            }
        }
    }
</script>