<template>
    <div class="text-center background">
        <div id="divName">  
            <v-card class="divName">
                    <v-avatar size="100" class="my-4">
                    
                        <v-img src="/files/logo.png"></v-img>
                    
                    </v-avatar>
                <div class="text-center">
                    <h3>Ticket de Compra</h3>
                </div>
                <span v-if="imprimir.created_at!=null">{{new Date(imprimir.created_at).getFullYear(imprimir.created_at)+'-'+(new Date(imprimir.created_at).getMonth()+1)+'-'+new Date(imprimir.created_at).getDate() + ' ' + new Date(imprimir.created_at).getHours() + ":" + new Date(imprimir.created_at).getMinutes() + ":" + new Date(imprimir.created_at).getSeconds()}}</span>
                <span v-else>{{new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate() + ' ' + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()}}</span>
                <br><span style="font-size:13px;">Folio: {{imprimir.index}}</span>
                <v-simple-table class="ma-6">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Cant.</th>
                                <th class="text-left">Producto</th>
                                <th v-if="regalo=='no'" class="text-left">$</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="input in imprimir.inputs" :key="input">
                                <td class="text-left">1</td>
                                <td class="text-left">{{ producto(input) }}</td>
                                <td v-if="regalo=='no'" class="text-left">{{ valor(input).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                <div v-if="regalo=='no'">
                    <strong>Sub-Total:</strong>
                    {{(imprimir.valor/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <br>
                    <strong>Descuento:</strong> {{((imprimir.descuento)*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <a v-if="imprimir.iva!=0" style="color:black;">
                    <br>
                    <strong>IVA:</strong> {{((imprimir.iva)*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    </a>
                    <br>
                    <strong>Total:</strong> {{((imprimir.valor*1)+(imprimir.descuento*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <br><br>
                </div>
                <div>
                    <i>Gracias por su compra!!!</i>
                    <br>
                    <br>
                    <i style="font-size:12px;">No hay devoluciones. <br>Garantía y Cambios máximo 15 días<br>* Aplican restricciones.</i>
                </div>
            </v-card>
        </div>  
        <v-card-actions>
            <v-btn color="blue darken-1" text @click="dalecandela('divName')">Imprimir</v-btn>
            <v-btn color="blue darken-1" v-if="this.correo(this.imprimir.contacto)!=null&&this.correo(this.imprimir.contacto)!=''&&this.correo(this.imprimir.contacto)!=undefined" text @click="sendEmail()">Enviar</v-btn>
            <v-btn color="blue darken-1" text @click="ticketRegalo('divName')">Ticket de Regalo</v-btn>
        </v-card-actions>
    </div>
</template>

<script>
    import emailjs from 'emailjs-com';
    import{ init } from 'emailjs-com';
    init("user_8a0ZvcQvBK8YSEM7Sades");
    export default {
        props:{
            id:Number
        },
        data: () => ({
            falso: false,
            regalo:'no',
        }),
        computed: { 
            productos:{
                get(){
                    return this.$store.state.servicio.servicios;
                }
            },
            contactos:{
                get(){
                    return this.$store.state.contacto.contactos;
                }
            },
            imprimir:{
                get(){
                    var perro = this.ventasSat.concat(this.ventasChanchuyescas).sort(function(a,b){
                        return new Date(a.created_at) - new Date(b.created_at)
                    }).map((id, index)=>{
                        return{
                            index: id.index,
                            comentario: id.comentario,
                            contacto: id.contacto,
                            created_at: id.created_at,
                            descripcion: id.descripcion,
                            descuento: id.descuento,
                            empresa: id.empresa,
                            envio: id.envio,
                            estatus: id.estatus,
                            etapa: id.etapa,
                            fecha: id.fecha,
                            //folio: id.folio,
                            id: index + 1,
                            iva: id.iva,
                            metodos: id.metodos,
                            motivoderechazo: id.motivoderechazo,
                            pdf: id.pdf,
                            procedencia: id.procedencia,
                            productos: id.productos,
                            realizado: id.realizado,
                            servicio: id.servicio,
                            updated_at: id.updated_at,
                            valor: id.valor,
                            vendedor: id.vendedor,
                        }
                    }).sort(function(a,b){
                        return new Date(b.created_at) - new Date(a.created_at)
                    }).filter(venta=>venta.id == this.id)[0];
                    return perro
                }
            },
            ventasSat(){
                var respuesta = this.ventasList
                .filter(quotation => this.contiene(quotation.metodos) == true)
                .sort(function(a,b){
                return new Date(a.created_at) - new Date(b.created_at)
                })
                .map((id, index)=>{
                return{
                    index: 'T-' + (index+1),
                    comentario: id.comentario,
                    contacto: id.contacto,
                    created_at: id.created_at,
                    descripcion: id.descripcion,
                    descuento: id.descuento,
                    empresa: id.empresa,
                    envio: id.envio,
                    estatus: id.estatus,
                    etapa: id.etapa,
                    fecha: id.fecha,
                    //folio: id.folio,
                    id: id.id,
                    iva: id.iva,
                    metodos: id.metodos,
                    motivoderechazo: id.motivoderechazo,
                    pdf: id.pdf,
                    procedencia: id.procedencia,
                    productos: id.productos,
                    realizado: id.realizado,
                    servicio: id.servicio,
                    updated_at: id.updated_at,
                    valor: id.valor,
                    vendedor: id.vendedor,
                }
                });
                return respuesta
            },
            ventasChanchuyescas(){
                var respuesta = this.ventasList
                .filter(quotation => this.contiene(quotation.metodos) == false)
                .sort(function(a,b){
                return new Date(a.created_at) - new Date(b.created_at)
                })
                .map((id, index)=>{
                return{
                    index: 'E-' + (index+1),
                    comentario: id.comentario,
                    contacto: id.contacto,
                    created_at: id.created_at,
                    descripcion: id.descripcion,
                    descuento: id.descuento,
                    empresa: id.empresa,
                    envio: id.envio,
                    estatus: id.estatus,
                    etapa: id.etapa,
                    fecha: id.fecha,
                    folio: id.folio,
                    id: id.id,
                    iva: id.iva,
                    metodos: id.metodos,
                    motivoderechazo: id.motivoderechazo,
                    pdf: id.pdf,
                    procedencia: id.procedencia,
                    productos: id.productos,
                    realizado: id.realizado,
                    servicio: id.servicio,
                    updated_at: id.updated_at,
                    valor: id.valor,
                    vendedor: id.vendedor,
                }
                });
                return respuesta
            },
            ventasList:{
                get(){
                    return this.$store.state.venta.cerrados
                }
            },
        },
        methods:{
            contiene(methods){
                var found = false;
                if(methods!=undefined){
                    for(var i = 0; i < methods.length; i++) {
                        if (methods[i].metodo == 'Tarjeta de Credito' || methods[i].metodo == 'Tarjeta de Debito') {
                            found = true;
                            break;
                        }
                    }
                }
                return found
            },
            sendEmail() {
                emailjs.send("service_kjstmjc","template_3o9pox9",{
                    fecha: this.fechita(),
                    cliente: this.cliente(this.imprimir.contacto),
                    email: this.correo(this.imprimir.contacto),
                    productos: this.losproductos(this.imprimir.productos),
                    valor: this.imprimir.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    subtotal:(this.imprimir.valor/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    iva:(this.imprimir.valor-(this.imprimir.valor/1.16)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    descuento:((this.imprimir.descuento)*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                }).then(response => {
                    location.reload();
                })
                .catch(error =>{ 
                    this.sendEmail()
                })
            },
            losproductos(items){
                var perro = ''
                for (let i = 0; i < items.length; i++) {
                        perro = perro + this.producto(items[i]) + ' ' + this.valor(items[i]).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) + '\n'
                }
                return perro
            },
            cliente(id) {
                return this.contactos.filter(contacto => contacto.id === id).map(contacto => contacto.nombre)[0];
            },
            correo(id) {
                return this.contactos.filter(contacto => contacto.id === id).map(contacto => contacto.email)[0];
            },
            producto(id) {
                return this.productos.filter(producto => producto.id === id).map(producto => producto.servicio)[0];
            },
            valor(id) {
                return this.productos.filter(producto => producto.id === id).map(producto => producto.valor)[0];
            },
            ticketRegalo(divName){
                this.regalo = 'si'
                this.$nextTick(() => {
                    this.dalecandela(divName)
                })
            },
            dalecandela(divName) {
                var printContents = document.getElementById(divName).innerHTML;
                var originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;

                window.print();


                this.$nextTick(() => {
                        var is_opera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
                        var is_Edge = navigator.userAgent.indexOf("Edge") > -1;
                        var is_chrome = !!window.chrome && !is_opera && !is_Edge;
                        var is_explorer= typeof document !== 'undefined' && !!document.documentMode && !is_Edge;
                        var is_firefox = typeof window.InstallTrigger !== 'undefined';
                        var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                    if(is_opera || is_Edge || is_chrome || is_explorer || is_firefox){
                        document.body.innerHTML = originalContents;
                        this.$emit("cerrarTicket", this.falso);
                        location.reload();
                    }

                    
                })

                /*
                this.$nextTick(() => {
                    document.body.innerHTML = originalContents;
                    this.$emit("cerrarTicket", this.falso);
                    location.reload();
                })
                */
            },
            dalecandelamovil(divName) {
                var printContents = document.getElementById(divName).innerHTML;
                var originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print()
                /*
                .then(resp=>{
                    document.body.innerHTML = originalContents;
                    this.$emit("cerrarTicket", this.falso);
                    location.reload();
                })
                */
            },
            daledoblecandela(divName){
                var printContents = document.getElementById(divName).innerHTML;
                var originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                this.$emit("cerrarTicket", this.falso);
            },
            cerrar(){
                this.$emit("cerrar", 'hola');
            },
            fechita(){
                if(this.imprimir.created_at!=null){
                    return new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date(this.imprimir.created_at).getDate() + ' ' + new Date(this.imprimir.created_at).getHours() + ":" + new Date(this.imprimir.created_at).getMinutes() + ":" + new Date(this.imprimir.created_at).getSeconds()
                }else{
                    return  new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate() + ' ' + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
                }
            }
        }
    }
</script>

<style>
    .divName{
        font-family: "Roboto", sans-serif!important;
        text-align: center !important;
        padding: 30px 20px;
    }
    .background{
        background-color: white!important;
    }
</style>





<!--
compras@unonegocios.com -> 17/04/2020 11:55:10
contabilidad@unonegocios.com -> 25/11/2020 13:14:49
administracion@unonegocios.com -> 25/11/2020 13:14:14
-->