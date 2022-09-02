<template>
    <div class="padding1" style="background:#f4f5fa;">
        <v-card v-if="info==true" style="background:transparent;" class="elevation-0 pb-6 px-7">
            <v-card-text class="py-3 px-6" style="background:#1976d1; color:white; border-radius: 5px;">
                <v-icon color="white" small class="mr-2">mdi-information-outline</v-icon>
                    Genera opciones personalizadas para los formularios de unocrm que serán afectados donde el catálogo exista.
                <v-icon style="position:absolute!important; top:7px; right:30px;" color="white" @click="info=false" small class="mr-2">mdi-close</v-icon>
            </v-card-text>
        </v-card>
        <!-- Statuses -->
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;">Estatus 
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Define las opciones de estatus en los que pueden estar tus clientes en el CRM.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-text-field v-if="dialogStatus==true" label="Nombre del Estatus"></v-text-field>                
                <v-btn @click="dialogStatus=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <statuses class="px-6"/>
            <v-dialog v-model="dialogStatus" max-width="600px">
                <createStatus @closeDialogStatus="closeDialogStatus"/>
            </v-dialog> 
        </v-card>
        <!-- Etapas de Clientes (rango de consumo)>
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Rango de Consumo
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Establece los rangos de consumo aproximados para asignarlos a tus clientes.</span>
                </v-tooltip>
                <v-spacer></v-spacer>              
                <v-btn @click="dialogPhase=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <phases class="px-6"/>
            <v-dialog v-model="dialogPhase" max-width="600px">
                <createPhases @closeDialogPhase="closeDialogPhase"/>
            </v-dialog> 
        </v-card-->
        <!-- Origins -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Procedencias
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Agrega todos los medios por los cuales un cliente puede conocer tu negocio.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn @click="dialogOrigin=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nueva</v-btn>
            </v-card-title>
            <origins class="px-6"/>
            <v-dialog v-model="dialogOrigin" max-width="600px">
                <createOrigins @closeDialogOrigin="closeDialogOrigin"/>
            </v-dialog> 
        </v-card>
        <!-- Types -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Tipos de Actividad
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>En este catalogo podras colocar los diferentes tipos de actividades que realizan tus vendedores, tales como llamadas, visitas, mensajes, correos, etc.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn @click="dialogType=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <types class="px-6"/>
            <v-dialog v-model="dialogType" max-width="350px">
                <createTypes @closeDialogType="closeDialogType"/>
            </v-dialog> 
        </v-card>
        <!-- Rejections -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Motivos de Rechazo
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Aquí podras agregar los motivos por los cuales se puede cancelar una venta o cotización (precios, tiempos, etc.).</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogRejection=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <rejections class="px-6"/>
            <v-dialog v-model="dialogRejection" max-width="350px">
                <createRejections @closeDialogRejection="closeDialogRejection"/>
            </v-dialog> 
        </v-card>
        <!-- Medios de contacto >
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Medios de Contacto
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Este catalogo sirve para definir por que medio de contacto tu cliente prefiere que lo localices.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogMode=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <contactMode class="px-6"/>
            <v-dialog v-model="dialogMode" max-width="350px">
                <createContactMode @closeDialogMode="closeDialogMode"/>
            </v-dialog> 
        </v-card-->
        <!-- CFDI >
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Usos de CFDI
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Usos de CFDI que se utilizan para el giro de tu negocio.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogCfdi=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <cfdi class="px-6"/>
            <v-dialog v-model="dialogCfdi" max-width="350px">
                <createCfdi @closeDialogCfdi="closeDialogCfdi"/>
            </v-dialog> 
        </v-card-->
        <!-- Tipo de Cliente >
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Tipos de cliente
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Etiqueta y diferencía a tus clientes por grupos generando tipos de clientes.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogClientType=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <type class="px-6"/>
            <v-dialog v-model="dialogClientType" max-width="350px">
                <createType @closeDialogClientType="closeDialogClientType"/>
            </v-dialog> 
        </v-card-->
        <!-- Zona >
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Zonas
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Este catálogo almacena las diferentes zonas de tu ciudad, estado, municipio.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogZone=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nueva</v-btn>
            </v-card-title>
            <zone class="px-6"/>
            <v-dialog v-model="dialogZone" max-width="350px">
                <createZone @closeDialogZone="closeDialogZone"/>
            </v-dialog> 
        </v-card-->
        <!-- Frecuencia de consumo >
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Frecuencia de consumo
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Diferencía que clientes te compran de manera anual, semestral, semanal, etc.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogFrequency=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nueva</v-btn>
            </v-card-title>
            <frequency class="px-6"/>
            <v-dialog v-model="dialogFrequency" max-width="350px">
                <createFrequency @closeDialogFrequency="closeDialogFrequency"/>
            </v-dialog> 
        </v-card-->
        <!-- Condiciones especiales >
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Condiciones Especiales
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Genera un catálogo de condiciones que te solicitan tus clientes al ofrecer tu producto/servicio.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogSpecialCondition=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nueva</v-btn>
            </v-card-title>
            <specialCondition class="px-6"/>
            <v-dialog v-model="dialogSpecialCondition" max-width="350px">
                <createSpecialCondition @closeDialogSpecialCondition="closeDialogSpecialCondition"/>
            </v-dialog> 
        </v-card-->
        <!-- Lista de Precios >
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Lista de Precios
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Define si algunos clientes tienen un precio diferente que otros.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogPriceList=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nueva</v-btn>
            </v-card-title>
            <priceList class="px-6"/>
            <v-dialog v-model="dialogPriceList" max-width="350px">
                <createPriceList @closeDialogPriceList="closeDialogPriceList"/>
            </v-dialog> 
        </v-card-->
        <!-- Métodos de Pago -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Métodos de Pago
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Define que métodos de pago son admitidos por tu negocio.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogPaymentMethod=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <paymentMethod class="px-6"/>
            <v-dialog v-model="dialogPaymentMethod" max-width="350px">
                <createPaymentMethod @closeDialogPaymentMethod="closeDialogPaymentMethod"/>
            </v-dialog> 
        </v-card>
        <!-- Vehiculos >
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Vehiculos
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>¿Manejas entregas? este catalogo te ayudara a registrar los vehículos de tu negocio y asignarlos en los envíos.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogVehicle=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <vehicle class="px-6"/>
            <v-dialog v-model="dialogVehicle" max-width="350px">
                <createVehicle @closeDialogVehicle="closeDialogVehicle"/>
            </v-dialog> 
        </v-card-->
        <!-- Proveedores -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Proveedores
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Ten a la mano el nombre de tus proveedores al momento de capturar una compra o un producto nuevo.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogProvider=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <provider class="px-6"/>
            <v-dialog v-model="dialogProvider" max-width="350px">
                <createProvider @closeDialogProvider="closeDialogProvider"/>
            </v-dialog> 
        </v-card>
        <!-- Categorias de Productos -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Categorías de Productos
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Agrupa tus productos por categorías para llevar un mejor control de los mismos.</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogCategory=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <category class="px-6"/>
            <v-dialog v-model="dialogCategory" max-width="350px">
                <createCategory @closeDialogCategory="closeDialogCategory"/>
            </v-dialog> 
        </v-card>
        
    </div>
</template>

<script>
    //containers
    import SpecialCondition from "../catalogs/special_condition/table"
    import PaymentMethod from "../catalogs/payment_method/table"
    import PriceList from "../catalogs/price_list/table"

    import Vehicle from "../catalogs/vehicle/table"
    import Provider from "../catalogs/provider/table"
    import Category from "../catalogs/categories/table"

    import Frequency from "../catalogs/frequency/table"
    import Zone from "../catalogs/zone/table"
    import Type from "../catalogs/client_type/table"
    import Cfdi from "../catalogs/cfdi/table"
    import ContactMode from "../catalogs/contact_mode/table"
    import Statuses from "../catalogs/statuses/table"
    import Phases from "../catalogs/phases/client/table"
    import Origins from "../catalogs/origins/table"
    import Rejections from "../catalogs/rejections/table"
    import Types from "../catalogs/types/table"
    //creadores
    import createPriceList from "../catalogs/price_list/create"
    import createPaymentMethod from "../catalogs/payment_method/create"
    import createSpecialCondition from "../catalogs/special_condition/create"

    import createVehicle from "../catalogs/vehicle/create"
    import createProvider from "../catalogs/provider/create"
    import createCategory from "../catalogs/categories/create"
    
    import createFrequency from "../catalogs/frequency/create"
    import createZone from "../catalogs/zone/create"
    import createType from "../catalogs/client_type/create"
    import createCfdi from "../catalogs/cfdi/create"
    import createContactMode from "../catalogs/contact_mode/create"
    import createStatus from "../catalogs/statuses/create"
    import createPhases from "../catalogs/phases/client/create"
    import createOrigins from "../catalogs/origins/create"
    import createRejections from "../catalogs/rejections/create"
    import createTypes from "../catalogs/types/create"
    export default {
        components: {
            //tables
            'priceList':PriceList,
            'paymentMethod':PaymentMethod,
            'specialCondition':SpecialCondition,
            'vehicle':Vehicle,
            'provider':Provider,
            'category':Category,

            'frequency':Frequency,
            'zone':Zone,
            'type':Type,
            'cfdi':Cfdi,
            'contactMode':ContactMode,
            'statuses':Statuses,
            'phases':Phases,
            'origins':Origins,
            'types':Types,
            'rejections':Rejections,
            //dialogs
            'createPriceList':createPriceList,
            'createPaymentMethod':createPaymentMethod,
            'createSpecialCondition':createSpecialCondition,

            'createVehicle':createVehicle,
            'createProvider':createProvider,
            'createCategory':createCategory,

            'createFrequency':createFrequency,
            'createZone':createZone,
            'createType':createType,
            'createCfdi':createCfdi,
            'createContactMode':createContactMode,
            'createStatus':createStatus,
            'createPhases':createPhases,
            'createOrigins':createOrigins,
            'createRejections':createRejections,
            'createTypes':createTypes,
        }, 
        data () {
            return {
                info:true,
                dialogFrequency:false,
                dialogPhase:false,
                dialogOrigin:false,
                dialogType:false,
                dialogRejection:false,
                dialogStatus:false,
                dialogMode:false,
                dialogCfdi:false,
                dialogClientType:false,
                dialogZone:false,
                dialogSpecialCondition:false,
                dialogPaymentMethod:false,
                dialogPriceList:false,
                dialogVehicle:false,
                dialogProvider:false,
                dialogCategory:false,
            }
        },
        methods:{
            closeDialogSpecialCondition: function(params) {
                this.dialogSpecialCondition = params;
                this.$store.dispatch('special_condition/getSpecialConditions')
            },
            closeDialogPaymentMethod: function(params) {
                this.dialogPaymentMethod = params;
                this.$store.dispatch('payment_method/getPaymentMethods')
            },
            closeDialogPriceList: function(params) {
                this.dialogPriceList = params;
                this.$store.dispatch('price_list/getPriceLists')
            },

            closeDialogProvider: function(params) {
                this.dialogProvider = params;
                this.$store.dispatch('provider/getProviders')
            },
            closeDialogVehicle: function(params) {
                this.dialogVehicle = params;
                this.$store.dispatch('vehicle/getVehicles')
            },

            closeDialogFrequency: function(params) {
                this.dialogFrequency = params;
                this.$store.dispatch('frequency/getFrequencies')
            },
            closeDialogClientType: function(params) {
                this.dialogClientType = params;
                this.$store.dispatch('type/getTypes')
            },
            closeDialogZone: function(params) {
                this.dialogZone = params;
                this.$store.dispatch('zone/getZones')
            },
            closeDialogCfdi: function(params) {
                this.dialogCfdi = params;
                this.$store.dispatch('cfdi/getCfdi')
            },
            closeDialogMode: function(params) {
                this.dialogMode = params;
                this.$store.dispatch('contact_mode/getContactModes')
            },
            closeDialogPhase: function(params) {
                this.dialogPhase = params;
                this.$store.dispatch('phase/getPhases')
            },
            closeDialogType: function(params) {
                this.dialogType = params;
                this.$store.dispatch('activity/getActivities')
            },
            closeDialogStatus: function(params) {
                this.dialogStatus = params;
                this.$store.dispatch('status/getStatuses')
            },
            closeDialogOrigin: function(params) {
                this.dialogOrigin = params;
                this.$store.dispatch('origin/getOrigins')
            },
            closeDialogRejection: function(params) {
                this.dialogRejection = params;
                this.$store.dispatch('rejection/getRejections')
            },

            closeDialogCategory: function(params) {
                this.dialogCategory = params;
                this.$store.dispatch('category/getCategories')
            },
        }
    }
</script>

<style>
@media (min-width: 980px){
    .padding1{
        padding-left: 24px !important;
        padding-right: 48px !important;
        padding-bottom: 100px!important;
    }
    .padding2{
        padding-right: 28px !important;
        padding-left: 28px !important;
    }
}
@media (max-width: 980px){
    .padding1{
        padding-top:20px!important;
    }
}
</style>