<template>
  <v-app :dark="true">
    <v-main>
      <app v-if="token!=null"></app>
      <login v-else></login>
    </v-main>
    <v-snackbar top :value="updateExists" color="primary" timeout="999999999" style="margin-top:-72px;" content-class="py-1"><!--updateExists-->
      <span style="font-size:16px;">Hay una actualización disponible!</span>
      <v-btn class="ml-4 elevation-0" small style="margin-top:-4px;" color="white" light @click="refreshApp">
        Actualizar
      </v-btn>
    </v-snackbar>
    <v-snackbar top :value="!online" color="primary" timeout="0" style="margin-top:-72px;" content-class="py-1"><!--updateExists-->
      <span style="font-size:16px;">Se perdio la conexión</span>
      <br/>
      <span style="font-size:12px;">Asegúrate de que tu computadora tenga una conexión activa y estable a Internet. </span>
      <v-btn class="ml-4 elevation-0" small style="margin-top:-25px;" color="white" light @click="reload()">
        Reconectar
      </v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
import update from './mixins/update'
import App from "../src/views/App"
import Login from "../src/views/Login"
import axios from "axios"
export default {
  mixins: [update],
  name: 'App',
  data: () => ({
    online:true,
    token:localStorage.getItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg"),
  }),
  components:{ 
    'app':App, 
    'login':Login,
  },
  mounted(){
    axios.get(process.env.VUE_APP_BACKEND + "api/v1/user/current").catch(error => {
      localStorage.removeItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg");
      this.token = null
    });
  },
  watch:{
    connection:{
      handler(){
        if(this.connection){
          this.online = false
        }
      },deep: true
    }
  },
  computed:{
    connection(){
      return this.isOffline
    }
  },
  methods:{
    reload(){
      location.reload()
    }
  }
};
</script>