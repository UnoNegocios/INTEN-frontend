<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8">
            <strong>Filtros</strong>

            <v-autocomplete v-model="que" :items="headers" item-text="text" item-value="value" label="Campo">
            </v-autocomplete>

            <v-select v-if="que!=undefined && que!='' && format!='boolean'" :items="what" v-model="como" label="Condicional"></v-select>

            <v-select class="mt-4" v-if="format=='boolean'" :items="sino" v-model="valor" label="Valor"></v-select>

            <v-text-field class="mt-6" v-if="format=='string'" v-model="valor" label="Valor" outlined dense rounded @keydown.enter="filter()"></v-text-field>

            <v-text-field class="mt-6" v-else-if="format=='number'" v-model="valor" label="Valor" type="number" outlined dense rounded @keydown.enter="filter()"></v-text-field>

            <v-menu v-else-if="format=='date'" v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                <template v-slot:activator="{ on }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="valor" label="Fecha" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker color="primary" v-model="valor" @input="datePicker = false"></v-date-picker>
            </v-menu>

            <div class="mt-6 pa-2">
                <template v-for="(item,k) in filters">
                    <v-chip class="mb-2" small :key="k" v-if="item.que!=''&&item.valor!=''" close @click:close="remove(k)" v-show="k || ( !k && filters.length > 1)">{{name(item.que)}} {{item.como}} {{item.valor}}</v-chip>
                </template>
            </div>
        </v-row>
        <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary">
            <v-list-item link @click="filter()" dark>
                <v-list-item-content>
                    <strong>Filtrar ({{index}})</strong>
                </v-list-item-content>
            </v-list-item>    
        </v-card>
    </v-container>
</template>
<script>
  export default {
    props:{
        company:Object
    },
    data: () => ({
        valor:'',
        que:'',
        como:'',
        index:0,
        headers:[
            { text: 'Folio', value: 'id' },
            { text: 'Empresa', value: 'company' },
            { text: 'Contacto', value: 'contact' },
            { text: 'Lista de Precios', value: 'priceList' },
            { text: 'Fecha Programada', value: 'date' },
            //{ text: 'Estatus', value: 'status' },
            { text: 'Estatus de Pago', value: 'paymentStatus' },
            { text: 'Vencimiento', value: 'expiration' },
            { text: 'Mostrador', value: 'bar' },
            { text: 'Peso', value: 'kg' },
            { text: 'Fecha de Entrega', value: 'delivery' },
            { text: 'Serie', value: 'type' },
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
            { text: 'Pagos', value: 'payments' },
            { text: 'Adeudo', value: 'debt' },
            { text: 'Factura', value: 'invoice' },
            { text: 'Impresa', value: 'printed' },
            { text: 'Días Factura', value: 'invoiceDays' },
            { text: 'Días Vencido', value: 'expirationDays' },
            { text: 'Vendedor', value: 'salesman' },
            { text: 'Creación', value: 'created_at' },
            { text: 'Creador', value: 'created_by_user_id' },
            { text: 'Edición', value: 'updated_at' },
            { text: 'Editor', value: 'last_updated_by_user_id' },
            { text: 'Fecha Factura', value: 'invoice_date' },
            { text: 'Fecha de Vencimiento', value: 'expired_debt' },
        ],
        filters:[{ que: '', como: '', valor:'' }],
        removeindex:false,
        format:'',
        datePicker:false,
    }),
    computed: {
        what(){
            if( this.que=='company'||
                this.que=='contact'||
                this.que=='priceList'||
                this.que=='status'||
                this.que=='paymentStatus'||
                this.que=='type'||
                this.que=='invoice'||
                this.que=='salesman'||
                this.que=='created_by_user_id'||
                this.que=='last_updated_by_user_id'){

                this.format = 'string'
                return ['contiene', 'no contiene', 'es igual a', 'no es igual a', 'está vacío', 'no está vacío', 'inicia con']
            
            }if(this.que=='bar'||this.que=='printed'){
                this.format = 'boolean'
                return ['es igual a', 'no es igual a']

            }if(this.que=='invoice_date'||
                this.que=='delivery'||
                this.que=='expiration'||
                this.que=='date'||
                this.que=='updated_at'||
                this.que=='created_at'){

                this.format = 'date'
                return ['es igual a', 'desde', 'hasta']

            }if(this.que=='id'||
                this.que=='kg'||
                this.que=='subtotal'||
                this.que=='iva'||
                this.que=='total'||
                this.que=='payments'||
                this.que=='debt'||
                this.que=='expired_debt'||
                this.que=='invoiceDays'||
                this.que=='expirationDays'){

                this.format = 'number'
                return ['contiene', 'no contiene', 'es igual a', 'no es igual a', 'es mayor que', 'es menor que', 'desde', 'hasta', 'está vacío', 'no está vacío', 'inicia con']

            }
        },
        sino(){
            return ['Si', 'No']
        }
    },
    methods: {
        name(value){
            return this.headers.filter(header=>header.value == value).map(header=>header.text)[0]
        },
        filter(){
            if(this.como=='está vacío'){
                this.valor = ' '
            }else if(this.como=='no está vacío'){
                this.valor = ' '
            }
            this.filters[this.index].que = this.que
            this.filters[this.index].como = this.como
            this.filters[this.index].valor = this.valor
            this.filters.push({ que: '', como: '', valor:'' });
            this.que = ''
            this.como = ''
            this.valor = ''
            this.$emit("filtersQuotation", this.filters);
            if(this.removeindex==false){
                this.index = this.index+1
            }
            this.removeindex=false
        },
        remove(index) {
            this.removeindex=true
            this.index = this.index - 1
            this.filters.splice(index, 1);
            this.filter()
            this.$nextTick(() => {
                this.index = this.index
            });
        },
    }
  }
</script>