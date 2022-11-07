<template>
      <v-card v-if="companyDetail!=undefined">
        <!-- header -->
        <v-app-bar class="elevation-0" dark color="#1f88fe">
          <v-avatar size="32px" class="mr-4">
            <img :src="'https://logo.clearbit.com/'+logito(companyDetail.email)" >
          </v-avatar>
          <v-toolbar-title >{{companyDetail.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- botones contacto pc -->
          <div class="hidden-md-and-down">
            <v-btn v-bind:href="'tel:'+companyDetail.phone" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-phone-outline</v-icon>
                </template>
                <span>Llamar al {{companyDetail.phone}}</span>
              </v-tooltip>
            </v-btn>
            <v-btn @click="whatsapp()" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-whatsapp</v-icon>
                </template>
                <span>WhatsApp {{companyDetail.phone}}</span>
              </v-tooltip>
            </v-btn>
            <v-btn v-bind:href="'mailto:'+companyDetail.email" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-email-outline</v-icon>
                </template>
                <span>{{companyDetail.email}}</span>
              </v-tooltip>
            </v-btn>
            <v-btn v-bind:href="'https://www.google.com.mx/maps/place/' + companyDetail.delivery_address + '/@'" target="_blank" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-map-marker-outline</v-icon>
                </template>
                <span>{{companyDetail.delivery_address}}</span>
              </v-tooltip>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="back()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <!-- container -->
        <v-sheet id="scrolling-techniques-6" class="overflow-y-auto" max-height="calc(100vh - 64px)" min-height="calc(100vh - 64px)" style="max-width: 100vw; margin:auto; background:#f4f5fa;">
          <v-row style="max-width: 100vw; margin:auto;">
            <!-- sidebar -->
            <v-col class="px-4 py-7" cols="12" md="3" >
              <v-card outlined>
                <contacts v-bind:client="companyDetail"/>
              </v-card>
              <v-card class="px-6 pa-6 my-4" outlined>
                <div class="overline mb-2">
                  Recordatorio/Nota Especial
                </div>
                <v-textarea class="space" background-color="amber lighten-4" v-model="companyDetail.special_note"></v-textarea>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn @click="saveNote()" text :loading="gris" :disabled="gris">
                    GUARDAR
                  </v-btn>
                </v-row>
              </v-card>
              <v-expansion-panels class="elevatinone">
                <v-expansion-panel class="mb-4 newBorder">
                  <v-expansion-panel-header class="overline">
                    Datos Fiscales
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>RFC: </strong> 
                        {{companyDetail.rfc}}
                      </span>
                    </div>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Razón Social: </strong> 
                        {{companyDetail.razon_social}}
                      </span>
                    </div>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Uso de CFDI: </strong> 
                        {{companyDetail.cfdi_id}}
                      </span>
                    </div>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Dirección: </strong> 
                        {{companyDetail.address}}
                      </span>
                    </div>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Metodo de Pago: </strong> 
                        {{companyDetail.payment_method}}
                      </span>
                    </div>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Cuenta Bancaria: </strong> 
                        {{companyDetail.bank_account_number}}
                      </span>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel class="mb-4 newBorder">
                  <v-expansion-panel-header class="overline">
                    Datos de Entrega
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Dirección de Entrega: </strong> 
                        {{companyDetail.delivery_address}}
                      </span>
                    </div>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Horario de Entrega: </strong> 
                        {{companyDetail.delivery_time}}
                      </span>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel class="mb-4 newBorder">
                  <v-expansion-panel-header class="overline">
                    Datos de Contacto
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Teléfono: </strong> 
                        {{companyDetail.phone}}
                      </span>
                    </div>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Email: </strong> 
                        {{companyDetail.email}}
                      </span>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel class="mb-4 newBorder">
                  <v-expansion-panel-header class="overline">
                    Condiciones Comerciales
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <span style="font-size:16px;" class="my-2">
                        <strong>Area de Oportunidad: </strong> 
                        {{companyDetail.opportunity_area}}
                      </span>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>

              </v-expansion-panels>
            </v-col>
            <!-- tabs -->
            <v-col style="background:#f4f5fa;" class="py-6 px-4 mt-2" cols="12" md="9">
                <v-tabs grow class="paddingtab">
                  <v-tab background-color="transparent" color="basil" grow>
                    Actividades
                  </v-tab>
                  <v-tab-item>
                    <activities v-bind:company="companyDetail"/>
                  </v-tab-item>
                  <v-tab background-color="transparent" color="basil" grow>
                    Cotizaciones
                  </v-tab>
                  <v-tab-item>
                    <quotations v-bind:company="company"/>
                  </v-tab-item>
                  <v-tab background-color="transparent" color="basil" grow>
                    Ventas
                  </v-tab>
                  <v-tab-item>
                    <sales v-bind:company="companyDetail"/>
                  </v-tab-item>
                  <v-tab background-color="transparent" color="basil" grow>
                    Cancelaciones
                  </v-tab>
                  <v-tab-item>
                    <canceled v-bind:company="company"/>
                  </v-tab-item>
                  <v-tab background-color="transparent" color="basil" grow>
                    Notas
                  </v-tab>
                  <v-tab-item>
                    <notes v-bind:company="company"/>
                  </v-tab-item>
                  <v-tab v-show="permissions('activityLog')" background-color="transparent" color="basil" grow>
                    Bitacora
                  </v-tab>
                  <v-tab-item v-show="permissions('activityLog')">
                    <activitylog v-bind:company="company"/>
                  </v-tab-item>
                </v-tabs>
            </v-col>
          </v-row>
        </v-sheet>
        <!-- botones contacto movil -->
        <v-bottom-navigation style="background:#2b2b2b;" class="hidden-md-and-up" fixed bottom>
          <v-btn v-bind:href="'tel:'+company.phone" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-phone-outline</v-icon>
              </template>
              <span>Llamar al {{company.phone}}</span>
            </v-tooltip>
          </v-btn>
          <v-btn @click="whatsapp()" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-whatsapp</v-icon>
              </template>
              <span>WhatsApp {{company.phone}}</span>
            </v-tooltip>
          </v-btn>
          <v-btn v-bind:href="'mailto:'+company.email" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-email-outline</v-icon>
              </template>
              <span>{{company.email}}</span>
            </v-tooltip>
          </v-btn>
          <v-btn v-bind:href="'https://www.google.com.mx/maps/place/' + company.delivery_address + '/@'" target="_blank" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-map-marker-outline</v-icon>
              </template>
              <span>{{company.delivery_address}}</span>
            </v-tooltip>
          </v-btn>
        </v-bottom-navigation>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
      </v-card>
</template>
<script>
import axios from "axios";
import Contacts from "../contacts/container"
import Activities from "../../activities/table"
import Quotations from "../../quotations/table"
import Sales from "../../sales/table2"
import Canceled from "../../canceled/table"
import Notes from "../../notes/container"
import ActivityLog from "../../activitylog/container"
  export default {
    components: {
      'contacts':Contacts,
      'quotations':Quotations,
      'activities':Activities,
      'sales':Sales,
      'canceled':Canceled,
      'notes':Notes,
      'activitylog':ActivityLog,
    }, 
    data () {
      return {
        companyDetail:undefined,
        company: this.$route.params.id,
        gris:false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
      }
    },
    created(){
      this.$emit("closeDrawer", false);
      this.apiCall().then(response => {
        this.companyDetail = response
      })
    },
    computed:{
      currentUser:{
        get(){
          return this.$store.state.currentUser.user
        }
      },
    },
    methods: {
      apiCall () {
        return new Promise((resolve, reject) => {
            axios.get(process.env.VUE_APP_BACKEND + "api/v1/clients?filter[id]=" + this.company).then(response => {
              resolve(response.data.data[0])
            })
        })
    },
      logito(mail){
        if(mail!=undefined){
          var indiceArroba = mail.indexOf("@")+1;
          var logo = mail.slice(indiceArroba, mail.length)
          if(logo=='gmail.com'||logo=='hotmail.com'||logo=='yahoo.com'||logo=='icloud.com'){
            return 'unonegocios.com'
          }
          return logo
        }else{
          return 'unonegocios.com'
        }
      },
      saveNote(){
        this.gris = true
        this.$nextTick(() => {
          axios.put(process.env.VUE_APP_BACKEND + "api/v1/company/update",Object.assign(this.companyDetail)).then(response=>{
            this.$store.dispatch('company/getCompanies')
          }).catch(error => {
            this.snackbar = {
              message: error.response.data.message,
              color: 'error',
              show: true
            }
          })
        })
      },
      back(){
        this.$emit("closeDrawer", true);
        window.history.back();
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
      close () {
        this.$nextTick(() => {
          this.$emit("closeDialogDetailCompany", false);
        })
      },
      whatsapp(){
        if( /Android|iPhone|BlackBerry/i.test(navigator.userAgent) ) {
          var link = "https://wa.me/521"+this.company.phone
          location.replace(link, '_blank')
        }else if(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){
          var link = "https://web.whatsapp.com/send?phone=521"+this.company.phone
          location.replace(link, '_blank')
        }else{
          var link = "https://web.whatsapp.com/send?phone=521"+this.company.phone
          window.open(link, '_blank')
        }
      }
    }
  }
</script>

<style>
.v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
    display: none!important;
}

@media (max-width: 980px){
  .paddingtab .v-data-table {
      padding-right: 0px !important;
      padding-left: 0px !important;
  }
  .paddingtab .detail{
    display: none!important;
  }
}

.space .theme--light.v-input input, .theme--light.v-input textarea {
  padding: 15px 20px;
}
.elevatinone .v-expansion-panel::before{
  box-shadow: none!important;
}
.newBorder{
  border: thin solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
.theme--light.v-expansion-panels .v-expansion-panel:not(:first-child)::after {
    display: none!important;
}
</style>