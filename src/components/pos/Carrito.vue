<template>
    <v-container >
        <v-row class="pl-5">
            <strong>Carrito ({{cartCount}})</strong>
        </v-row>
        <v-row  id="scroll-target" style="height: 40vh" class="overflow-y-auto">
            <v-list class="pb-0">
                <v-list-item v-for="(item,index) in cart" :key="index" style="border-bottom:1px solid #e0e0e0; margin-left:5px"> <!-- @click="" -->
                    <v-list-item-avatar class="mt-0">
                        <v-img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fbazarcuerna.mx%2Fproducts&psig=AOvVaw0kp0L4QgaPvUVRU7zL4Em5&ust=1602863137355000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCNDazNT4tuwCFQAAAAAdAAAAABAD"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content style="padding-top: 0px!important;">
                        <v-row>
                            <v-col col="11" style="padding-top: 28px!important; font-size: 16px!important;">
                                <v-list-item-title style="font-size: 14px!important;">{{item.name}}</v-list-item-title>
                                <div>{{(item.price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</div>
                            </v-col>
                            <v-col col="1">
                                <!--v-text-field style="width:40px!important" type="number"></v-text-field-->
                                <v-btn icon @click="removeItem(index)"><v-icon>  mdi-close </v-icon></v-btn>
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>   
            </v-list>
        </v-row>
        <v-row>
            <v-col class="total pa-0">
                <v-card tile class="pa-6">
                    <div v-if="contacto(cliente)!=null">Cliente: {{contacto(cliente)}}</div>
                    <a v-else style="cursor:pointer; text-decoration:none; color:black;" href='/#/clientes'> Cliente: </a>
                    <v-divider class="py-2"></v-divider>
                    <v-row>
                        <v-col cols="2" class="pb-0">
                            <v-icon class="pt-2" @click="desc='percent'" v-if="desc=='amount'" > mdi-currency-usd</v-icon>
                            <v-icon class="pt-2" @click="desc='amount'" v-else> mdi-percent</v-icon>
                        </v-col>
                        <v-col cols="10" class="pb-0">
                            <v-text-field class="pt-0" v-model="rebajo" label="Descuento"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-switch class="mt-0" inset v-model="switch1" :label="`${conosiniva().toString()}`"></v-switch>
                    <strong>Sub-Total:</strong> {{(subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <br>
                    <strong>Descuento:</strong> {{(descuento*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <a v-if="switch1==true" style="color:black;"><br><strong>IVA:</strong> {{(iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</a>
                    <br>
                    <strong>Total:</strong> 
                        <span v-if="desc=='percent'">{{(suma-((suma/100)*rebajo)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <span v-if="desc=='amount'">{{(suma-rebajo).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                </v-card>
                <v-card tile color="#1776d1"><!-- # d71182 -->
                    <v-list-item link @click="pagar()" dark>
                        <v-list-item-content style="color:white;"><!-- #32241c -->
                            <strong>PAGAR</strong>
                        </v-list-item-content>
                    </v-list-item>    
                </v-card>
            </v-col>
        </v-row>

        <!-- Dialogo ticket -->
        <v-dialog v-model="dialogTicket" max-width="350px">
            <ticket @cerrar="cerrarTicket" v-bind:id="orden"></ticket>
        </v-dialog> 
        <!-- Dialogo ticket -->
        <v-dialog v-model="dialogPago" max-width="720px">
            <v-card>
              <!-- Titulo -->
              <v-card-title>
                <span class="headline">Metodo de Pago</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <!-- Formulario -->
                  <v-row>
                    <v-row class="form-group px-6 py-2" v-for="(metodo,k) in ticket.metodos" :key="k">
                        <v-col cols="5" class="py-0 my-0">
                            <v-select :items="metodosLists" v-model="metodo.metodo" label="Metodo de pago"></v-select>
                        </v-col>
                        <v-col cols="4" class="py-0 my-0">
                            <v-text-field v-model="metodo.monto" prefix="$" suffix="c/u" label="Monto"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-icon @click="remove(k)" v-show="k || ( !k && ticket.metodos.length > 1)" color="red">mdi-close</v-icon>
                            <v-icon @click="add(k)" v-show="k == ticket.metodos.length-1" color="primary">mdi-plus</v-icon>
                        </v-col>
                    </v-row>
                  </v-row>
                </v-container>
              </v-card-text>
              
              <v-divider class="mx-12 my-6 mt-0"></v-divider>
              <div class="text-center">
                <v-btn v-if="perro=='no'" color="grey" @click="perro='si'" text>Agendar Envío</v-btn>
                <v-btn v-if="perro=='si'" color="grey" @click="perro='no'" text><v-icon> mdi-chevron-up</v-icon></v-btn>
              </div>
              <!-- Notas -->
              <v-card-subtitle class="pb-0" v-if="perro=='si'">
                <h3><strong>Notas</strong></h3>
              </v-card-subtitle>
              <v-card-text v-if="perro=='si'">
                <v-container>
                  <!-- Formulario -->
                  <v-row>
                    <!-- Mensaje personalizado -->
                    <v-col cols="12" class="pt-0" sm="6" md="7">
                      <v-textarea v-model="ticket.comentario" label="Mensaje personalizado"></v-textarea>
                    </v-col>
                    <!-- Fecha de entrega -->
                    <v-col cols="12" class="pt-0" sm="6" md="5">
                        <!-- Dia -->
                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                            <v-text-field clearable required v-model="ticket.fecha.dia" label="Fecha de entrega" prepend-icon="mdi-calendar-blank" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="ticket.fecha.dia" @input="menu = false"></v-date-picker>
                        </v-menu>
                        <!-- Hora -->
                        <v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="menu2" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="ticket.fecha.hora" label="Hora de entrega" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-time-picker v-if="menu2" v-model="ticket.fecha.hora" full-width @update:period="$refs.menu.save(ticket.fecha.hora)"></v-time-picker>
                        </v-menu>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <!-- Cancelar y Guardar -->
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" @click="cerrarTicket()" text >Cancelar</v-btn>
                  <v-btn color="blue darken-1" @click="save()" :disabled="botongris" text>Guardar</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog> 
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    props:{
        cliente:String,
    },
    data:()=>({
        apagado: false,
        switch1: true,
        metodosLists:[
            'Tarjeta de Credito',
            'Tarjeta de Debito',
            'Efectivo',
            'Transferencia',
        ],
        perro:'no',
        rebajo:'',
        desc:'percent',
        dialogPago:false,
        orden:'',
        dialogTicket:false,
        menu:false,
        menu2:false,
        ticket:{
            contacto:'',
            inputs:{
                id:'',
                cantidad:1,
            },
            valor:'',
            vendedor:'',
            estatus:'',
            descuento:0,
            iva:'',
            metodos:[{
                metodo:'',
                monto:'',
            }],
            fecha:[{
                dia:'',
                hora:'',
            }],
            comentario:'',
        },

        quotation:{
            company_id:null,
            contact_id:'',
            user_id:'',
            amount:'',
            pdf:'',
            note:'',
            items:[{
                quantity:1,
                item:'',
                value:'',
                price:'',
                weight:'',
            }],
            bar:false,
            status:'vendido',
            subtotal:'',
            date:'',
            type:'',
            iva:'',
            total:'',
            invoice:'',
            printed:'',
            created_by_user_id:'',
            last_updated_by_user_id:'',
            invoice_date:'',
            due_date:''
        },







    }),
    computed: {
        botongris(){
            if(this.apagado==true || this.ticket.metodos[0].metodo==''){
                return true
            }else{
                return false
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        StoreCart() {
            return this.$store.state.carrito.carritos
        },
        cartCount() {
            return this.StoreCart.length;
        },
        subtotal: function(){
            var sum = 0;
            this.cart.forEach(e => {
                sum += Number(e.price);
            });
            return sum.toFixed(2)
        },
        iva: function(){
            if(this.switch1==true){
                var sum = 0;
                this.cart.forEach(e => {
                    sum += (Number(e.price));
                });
                if(this.rebajo!=''){
                    var subtotal = sum
                    if(this.desc=='percent'){
                        subtotal = sum-((sum/100)*this.rebajo)
                    }
                    if(this.desc=='amount'){
                        subtotal = sum-this.rebajo
                    }
                    return (subtotal*.16).toFixed(2)
                }else{
                    return (sum*.16).toFixed(2)
                }
            }else{
                return 16*0
            }
        },
        suma: function(){
            
            var sum = 0;
            this.cart.forEach(e => {
                sum += (Number(e.price));
            });
            if(this.switch1==true){
                return (sum*1.16).toFixed(2)
            }else{
                return sum.toFixed(2)
            }
        },
        descuento: function(){
            var sum = 0;
            this.cart.forEach(e => {
                sum += (Number(e.price));
            });
            var subtotal = sum
            if(this.desc=='percent'){
                subtotal = sum-((sum/100)*this.rebajo)
            }
            if(this.desc=='amount'){
                subtotal = sum-this.rebajo
            }
            return (subtotal-sum).toFixed(2)
        },
        cart() {
            return this.$store.state.carrito.carritos.map(cartitems => {
                return this.$store.state.carrito.servicios.find(itemForSale => {
                    return cartitems === itemForSale.id;
                });
            });
        },
    },
    created(){
        this.$store.dispatch('carrito/getServicios')
        this.$store.dispatch('currentUser/getUser')
        this.$store.dispatch('item/getItems')
    },
    methods: {
        conosiniva(){
            if(this.switch1==true){
                return 'con IVA'
            }else{
                return 'sin IVA'
            }
        },
        pagar(){
            this.ticket.metodos[0].monto = this.suma
            this.dialogPago = true
        },
        add(index) {
            var sum = 0
            var resultado = 0
            this.ticket.metodos.forEach(e => {
                sum += (Number(e.monto));
            });
            resultado = this.suma - sum
            this.ticket.metodos.push({ metodo: '', monto: resultado.toFixed(2) });
        },
        remove(index) {
            this.ticket.metodos.splice(index, 1);
        },
        removeItem(index) {
            this.$store.dispatch('carrito/removeItem', index);
            this.$emit("closeCreateDialogCalendar", 'perro');
        },
        save(){
            this.apagado = true
            this.$nextTick(() => {
                //rellena variables venta
                var value = this.suma
                this.ticket.iva = this.iva;
                this.ticket.descuento = this.descuento;
                this.ticket.valor = value;
                this.ticket.vendedor = this.currentUser.id;
                this.ticket.contacto = this.cliente;
                this.ticket.inputs = this.$store.state.carrito.carritos;
                this.ticket.productos = this.ticket.inputs;
                if(this.ticket.fecha.dia!=undefined){
                    this.ticket.fecha = this.ticket.fecha.dia + ' ' +this.ticket.fecha.hora + ':00'
                }else{
                    this.ticket.fecha = ''
                }
                this.ticket.estatus = 'cerrado'
                //actualiza el inventario
                axios
                .get("https://unowipes.com/api/v1/servicio/all")
                .then(response => {
                    var gato = response.data
                    for(var i=0; i<this.ticket.inputs.length; i++){
                        var perro = gato.filter(servicio=>servicio.id == this.ticket.inputs[i])[0]               
                        if(this.currentUser.name == "Sucursal 1"){
                            perro.inventario.arboleda = perro.inventario.arboleda - 1
                        }
                        if(this.currentUser.name == "Sucursal 2"){
                            perro.inventario.plazavita = perro.inventario.plazavita - 1
                        }
                        axios.put(process.env.VUE_APP_BACKEND + 'api/v1/servicio/actualizar',Object.assign(perro))
                    }
                })
                //guarda la venta
                axios.post(process.env.VUE_APP_BACKEND + 'api/v1/venta/guardar',Object.assign(this.ticket)).then(resp => {
                    this.ticket.valor = value;
                    this.orden = resp.data.id;
                    this.dialogTicket=true;
                })
            });
        },
        cerrarTicket: function(params) {
            this.dialogTicket=false;
            location.reload();
        },
        contacto(id) {
            return this.$store.state.contact.contacts.filter(contacto => contacto.id === id).map(contacto => contacto.name)[0];;
        },
    },
};
</script>

<style>
.total{
    position:absolute!important; 
    bottom:0!important;
}
</style>