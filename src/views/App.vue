<template>
<!--000043   fb360-->
  <v-app>
    <!-- sidebar -->
    <v-navigation-drawer color="#f4f5fa" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app> <!--style="box-shadow: 0px 13px 5px 0px rgb(112 112 115 / 30%)!important;z-index: 9;"-->
      <!-- sidebar-menu -->
      <v-list class="pl-0 pr-4 pt-3 sidebar" dense> 
        <!-- dashboard -->
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Prospectos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>Pantalla de inicio</span>
        </v-tooltip>
        <!-- Reportes -->
        <div v-show="permissions('reports')">
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/reports" v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon> mdi-chart-bar</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Reportes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Graficas mensuales y por día</span>
        </v-tooltip>
        </div>
        <v-divider class="ma-4"></v-divider>
        <!-- Actividades -->
        <v-expansion-panels class="sinsombra" v-show="permissions('activities')">
          <v-expansion-panel style="background:transparent!important;">
            <v-expansion-panel-header style="font-weight:500; font-size:0.8125rem; color:#202020;" class="px-4 py-0">
              <div>
                <v-icon class="mr-2">mdi-format-list-checks</v-icon> 
                Actividades
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- Calendario -->
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/calendar" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-calendar-multiple</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Calendario</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  </template>
                <span>Agenda de cotizaciónes en seguimiento</span>
              </v-tooltip>
              <!-- Lista de Actividades -->
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/activities" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-checkbox-marked-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Actividades</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  </template>
                <span>Lista de seguimientos de prospectos activos</span>
              </v-tooltip>
              <!-- Llamadas -->
              <!--div v-show="permissions('calls')">
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/calls" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-phone</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Llamadas</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  </template>
                <span>Registro de llamadas call picker</span>
              </v-tooltip>
              </div-->
              <!-- Mensajes -->
              <!--div v-show="permissions('messages')">
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/messages" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-message-minus-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Mensajes</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  </template>
                <span>Registro de conversacóones en WhatsApp, Facebook Messenger y Chat en Línea</span>
              </v-tooltip>
              </div-->
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- clientes -->
        <div v-show="permissions('companies')">
        <v-divider class="ma-4"></v-divider>
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/clients" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon> mdi-account-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Clientes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Lista de empresas a las que se les ha cotizado/vendido</span>
        </v-tooltip>
        </div>
        <!-- Ventas y Cobranza -->
        <div v-show="permissions('sales')">
        <v-divider class="ma-4"></v-divider>
        <v-expansion-panels class="sinsombra">
          <v-expansion-panel style="background:transparent!important;">
            <v-expansion-panel-header style="font-weight:500; font-size:0.8125rem; color:#202020; padding:0px!important;">
              <div>
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item link v-bind="attrs" v-on="on">
                      <v-list-item-action class="mr-3">
                        <v-icon>mdi-currency-usd</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Ventas y Cobranza</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Lista de gastos</span>
                </v-tooltip>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <!-- cotizaciones -->
                <div v-show="permissions('quotations')">
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item v-bind="attrs" v-on="on" to="/quotations" link >
                      <v-list-item-action class="mr-3">
                        <v-icon>  mdi-file-outline</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Cotizaciones</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <span>Prospectos de venta</span>
                </v-tooltip>
                </div>
                <!-- ventas -->
                <div v-show="permissions('sales')">
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item to="/new-sales" link v-bind="attrs" v-on="on">
                      <v-list-item-action class="mr-3">
                        <v-icon>mdi-currency-usd</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Ventas</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Lista de ventas cerradas</span>
                </v-tooltip>
                </div>
                <!-- cancelaciones -->
                <div v-show="permissions('cancelations')">
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item to="/canceled" link v-bind="attrs" v-on="on">
                      <v-list-item-action class="mr-3">
                        <v-icon>mdi-close-circle-outline</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Cancelaciones</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Cotizaciones que no se cerraron por algun motivo</span>
                </v-tooltip>
                </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        </div>
        <!-- Productos -->
        <v-divider class="ma-4"></v-divider>
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/products" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-palette-swatch</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Catálogo de Productos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Catálogo de Productos para Vendedores</span>
        </v-tooltip>
        <!-- Inventario >
        <div v-show="permissions('inventory')">
        <v-divider class="ma-4"></v-divider>
        <v-expansion-panels class="sinsombra">
          <v-expansion-panel style="background:transparent!important;">
            <v-expansion-panel-header style="font-weight:500; font-size:0.8125rem; color:#202020; padding:0px!important;">
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/inventory" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-format-list-bulleted</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Inventario</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  </template>
                <span>Lista de Productos e Insumos</span>
              </v-tooltip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
            <div v-show="permissions('physical_inventories')">
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/physical-inventory" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-clipboard-check-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Inventario Físico</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  </template>
                <span>Lista de ajustes a productos</span>
              </v-tooltip>
            </div>
            <div v-show="permissions('report_inventory')">
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/inventory-reports" v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon> mdi-chart-bar</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Reportes</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  </template>
                <span>Tabla de movimientos</span>
              </v-tooltip>
            </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        </div-->
        <!-- bitacora -->
        <div v-show="permissions('activityLog')">
          <v-divider class="ma-4"></v-divider>
          <v-tooltip right open-delay="1000">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item to="/activity-log" link v-bind="attrs" v-on="on">
                <v-list-item-action class="mr-3">
                  <v-icon>mdi-clipboard-text</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Bitacoras</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </template>
            <span>Registro de altas y cambios</span>
          </v-tooltip>
        </div>
      </v-list>
      <template v-slot:append>
        <div style="color:#9ca3a5; font-size: 12px;" class="pa-2">
          UNOCRM | v4.0.40 <v-icon> mdi-settings</v-icon>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- header -->
    <v-app-bar class="elevation-0 px-0" :clipped-left="$vuetify.breakpoint.lgAndUp" app  color="#f4f5fa" dark><!-- box-shadow: 0px 0px 5px 0px rgb(112 112 115 / 30%)!important; -->
        <v-icon @click.stop="drawer = !drawer" class="mr-5" color="grey"> mdi-menu</v-icon>
        <img style="height: 24px;" src="/logo.png">
        <v-spacer></v-spacer>  
        <v-btn class="hidden-sm-and-down pa-0" icon to="/" link>
          <v-icon color="#707073">mdi-apps</v-icon>
        </v-btn>
        <!-- notification button -->
        <v-menu bottom left offset-y origin="top right" transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon class="ml-2 mr-1" min-width="0" text v-bind="attrs" v-on="on">
              <v-badge overlap color="#e25104">
                <template v-slot:badge>
                  {{notes.length}}
                </template>
                <v-icon color="#707073">mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <!-- dropdown notification -->
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item to="/notes" link>
                <v-list-item-action>
                  <v-icon> mdi-clipboard-text</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Notas ({{notes.length}})</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <!-- account button -->
        <v-menu bottom left offset-y origin="top right" transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn class="ml-2 mr-1" text v-bind="attrs" v-on="on">
                <v-avatar size="32px">
                  <img :src="currentUser.profile_photo_url" >
                </v-avatar>
                <span class="hidden-sm-and-down" style="color:#707073; margin-left:10px; text-transform: initial; letter-spacing: 0px; font-size:16px; font-weight: 400;"> {{currentUser.name}} {{currentUser.last}}</span> <v-icon color="#707073">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <!-- dropdown account -->
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item link to="/settings">
                <v-list-item-action>
                  <v-icon> mdi-cog</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Ajustes</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="logout">
                <v-list-item-action>
                  <v-icon>mdi-power</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Cerrar Sesión</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
            </v-list-item-group>
          </v-list>
        </v-menu>
    </v-app-bar>
    <v-main class="pa-0" style="background-color:#f4f5fa;">
      <v-container class="pa-0" fluid>
          <router-view @closeDrawer="closeDrawer"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<!----------------------- Scripts ----------------------->
<script>
  export default {
    name: 'AppContainer',
    data: () => ({
      drawer: true,
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
    }),
    mounted() {
      Echo.channel('test').listen('Test', (e) => {
        console.log(e)
      })
    },
    methods:{
      closeDrawer: function(params) {
        this.drawer = params;
      },
      logout(){
        this.$store.dispatch('currentUser/logoutUser')
      },
      permissions(permission){
        if(this.currentUser.id==1){
          return true
        }else if(this.currentUser.permissions!=undefined){
          if(this.currentUser.permissions.includes(permission)){
            return true
          }else{
            return false
          }
        }else{
          return false
        }
      },      
    },
    computed:{
      notes(){
        return this.$store.state.note.notes.filter(note=>note.seen == false);
      },
      currentUser:{
        get(){
          return this.$store.state.currentUser.user;
        }
      }
    },
    created(){
      this.$store.dispatch('user/getUsers') 
      this.$store.dispatch('currentUser/getUser')
      this.$store.dispatch('status/getStatuses')
      this.$store.dispatch('funnel/getFunnels')
      this.$store.dispatch('item/getItems')
      
      /*
      this.$store.dispatch('type/getTypes')
      this.$store.dispatch('cfdi/getCfdi')
      this.$store.dispatch('frequency/getFrequencies')
      this.$store.dispatch('contact_mode/getContactModes')
      this.$store.dispatch('special_condition/getSpecialConditions')
      this.$store.dispatch('company/getCompanies')
      this.$store.dispatch('contact/getContacts') 
      
      this.$store.dispatch('category/getCategories')
      
      this.$store.dispatch('unit/getUnits')

      this.$store.dispatch('origin/getOrigins')
      
      this.$store.dispatch('phase/getPhases')
      
      this.$store.dispatch('price_list/getPriceLists')
      this.$store.dispatch('payment_method/getPaymentMethods')
      
      this.$store.dispatch('rejection/getRejections')
      this.$store.dispatch('quotation/getQuotations')
      this.$store.dispatch('quotation/getOnlyQuotations')
      
      this.$store.dispatch('vehicle/getVehicles')
      this.$store.dispatch('shipping/getShippings')
      this.$store.dispatch('shipping_detail/getShippingDetails')

      this.$store.dispatch('provider/getProviders')

      this.$store.dispatch('expense/getExpenses')
      this.$store.dispatch('expense_type/getExpenseTypes')
      this.$store.dispatch('shopping/getShoppings')
      this.$store.dispatch('shopping_detail/getShoppingDetails')
      this.$store.dispatch('provider_payment/getProviderPayments')
      this.$store.dispatch('production/getProductions')
      this.$store.dispatch('production_detail/getProductionDetails')
      this.$store.dispatch('adjustment/getAdjustments')
      this.$store.dispatch('inventory/getInventories')
      this.$store.dispatch('payroll/getPayrolls')
      this.$store.dispatch('collection/getCollectionDetails')
      this.$store.dispatch('collection/getCollections')
      */
    },
  }
</script>


<!-- Styles -->      
<style>
  .v-navigation-drawer__border{
    display:none!important;
  }
  .sidebar .v-list-item.v-list-item--link.theme--light:hover{
    background-color:#e9edf8!important; 
    border-radius: 0px 20px 20px 0px!important;
  }
  .sidebar .v-list-item.v-list-item--link.theme--light:hover i::before{
    color: #1f88fe!important;
  }
  .sidebar .v-list-item--active{
    background-color:#e9edf8!important; 
    border-radius: 0px 20px 20px 0px!important;
  }
  .sidebar .v-list-item--active i::before{
    color: #1f88fe!important;
  }
  .sidebar .theme--light.v-list-item--active:hover::before, .theme--light.v-list-item--active::before {
    opacity: 0!important;
  }
  .sidebar .theme--light.v-list-item:hover::before {
    opacity: 0;
  }
  .v-window__prev, .v-window__next {
    background: transparent!important;;
  }
  .v-carousel__controls{
    display:none!important;
  }
  .v-application--wrap {
    min-height: calc(100vh - 65px)!important;
  }
  .sinsombra .v-expansion-panel::before{
    box-shadow: none!important;
  }
</style>