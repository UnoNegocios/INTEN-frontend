<template>
  <v-app>  
    <v-row no-gutters>
      <!-- left-area -->
      <v-col class="hidden-sm-and-down bg mr-12" md="7">
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="8">
              <v-card dark class="elevation-0 bgt">
                <v-card-title style="font-size:36px; line-height:40px;" class="py-0 pb-2">El tiempo de tu negocio se <br> encuentra aquí</v-card-title>                  
                <v-card-text style="font-size:18px;" class="py-0">
                  Los errores que cometiste en el pasado, ahora no existirán. Una razón más para usar Uno CRM.
                </v-card-text>
                <v-card-actions>
                  <v-btn elevation="0" outlined dark  type="submit" @click="login" class=" my-2 mr-4 px-4">Conoce más</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <!-- login form -->
      <v-col md="4" class="bg2">
        <v-container class="fill-height" fluid>
          <v-tooltip v-model="show" left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn fixed right top class="elevation-0"  icon v-bind="attrs" v-on="on">
                <v-icon color="grey lighten-1">mdi-information-outline</v-icon>
              </v-btn>
              <v-btn fixed right bottom class="elevation-0 text-capitalize text--disabled" depressed small color="transparent">
            Terminos y Condiciones | derechos reservados
          </v-btn>
            </template>
            <span>Preguntas Frecuentes</span>
          </v-tooltip>
          <v-row align="center" justify="start">
            <v-col cols="12" sm="8" md="10" >
              
              <v-card class="elevation-0 bgt">
                    <v-img  class="mb-3" width="30px" v-bind:src="'https://uno.unocrm.mx/files/' + 'logo_unonegocios_circulo.png'" alt="Vuetify"></v-img>
                  <v-toolbar-title>Iniciar sesión</v-toolbar-title>
                  <v-card-text style="font-size:18px;" class="pt-2 pa-0">
                    Conoce un <strong>CRM</strong> diferente
                  </v-card-text>

                  <v-alert class="mt-5" text dense type="error" v-if="alerta"> 
                    <strong>Usuario</strong> y/o <strong>contraseña</strong> incorrecta(s)
                  </v-alert>


                <v-card-text class="px-0 pb-0">
                  <v-form>
                    <v-text-field 
                    :rules="[rules.required, rules.email]"
                    @keydown.enter="login" class="blanco" label="Correo Electrónico" name="login" type="email" v-model="user.email" aria-describedby="emailHelp" outlined></v-text-field>
                    <v-text-field 
                    class="blanco"
                    :rules="[rules.required]"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    name="password"
                    label="Contraseña"
                    @click:append="show1 = !show1"
                    @keydown.enter="login" v-model="user.password" outlined></v-text-field>
                  </v-form>
                </v-card-text>
                
                <v-card-actions class="pa-0">
                  <v-spacer></v-spacer>
                  <v-btn block dark color="orange darken-4" type="submit" @click="login" class="btn btn-primary px-4 "><strong>Acceder</strong></v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-app>
</template>

<!----------------------- Scripts ----------------------->
<script>
export default{
    data:()=>({
      alerta: false,
      show: false,
      show1: false,
      password: 'Password',
      rules: {
          required: value => !!value || 'Contraseña requerida.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'E-mail inavlido.'
          }
      },
      user:{
          email: "",
          password: "",
      }
    }),
    methods:{
        login(){
            this.$store.dispatch('currentUser/loginUser', this.user );
            this.alerta = localStorage.getItem("nosepudo")
        }, 
    }
}
</script>

<style scoped>
  .bg{
    background-image:url("https://uno.unocrm.mx/files/unonegocios.jpg");
    background-size:cover;
    background-position: center;
    height: 100vh!important;
  }
  .bg2{
    background-image:url("https://uno.unocrm.mx/files/logistic-map.jpg");
    background-size:fit;
    background-position: center;
  }
  .bgt{
    background-color:transparent!important;
    box-shadow:none;
  }
  .blanco{
    background:white;
  }
</style>