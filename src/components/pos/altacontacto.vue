<template>
    <v-flex>
      <!-- Titulo del dialogo -->
      <v-card>
        <v-card-title>
          <span class="headline" v-if="cliente==null">Nuevo Cliente</span>
          <span class="headline" v-else>Editar Cliente</span>
        </v-card-title>
        <v-card-text> 
            <!-- Formulario contacto -->
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field :rules="[v => !!v || 'Campo requerido']" required v-model="altaContacto.nombre" label="Nombre"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="altaContacto.telefono" label="Teléfono"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="altaContacto.email" label="Correo Electrónico"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="altaContacto.razonsocial" label="Razón Social"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="altaContacto.rfc" label="RFC"></v-text-field>
                </v-col>
                <v-col v-if="(altaContacto.empresa==null) || (altaContacto.empresa=='') || (altaContacto.empresa==undefined)" cols="12" sm="6" md="4">
                  <v-text-field  v-model="altaContacto.direccion" label="Dirección"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
        </v-card-text>
        <!-- Cancelar y Guardar -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrar()">Cancelar</v-btn>
          <v-btn color="blue darken-1" text :disabled="!valid" @click="saveContacto">Guardar</v-btn>
        </v-card-actions>
      </v-card>
  </v-flex>
</template>

<script>
import axios from "axios";
export default {  
    props:{
      cliente:String
    }, 
    data: () => ({
      valid: true,
      falso: false,
      altaContacto:{
        id:'',
        nombre:'',
        telefono:'',
        email:'',
        vendedor:'',
        direccion:'',
      },
    }),
    computed: { 
      currentUser(){
        return this.$store.state.currentUser.user;
      },
      userLists() {
        return this.$store.state.user.users;
      }
    },
    created(){
      this.$store.dispatch('user/getUsers')
      this.contactos()
    },
    methods: { 
      contactos(){
        if(this.cliente!=''&&this.cliente!=null&&this.cliente!=undefined){
          var perro = this.$store.state.contacto.contactos.filter(contacto => contacto.id == this.cliente)[0]
          this.altaContacto.id=perro.id
          this.altaContacto.nombre=perro.nombre
          this.altaContacto.telefono=perro.telefono
          this.altaContacto.email=perro.email
          this.altaContacto.vendedor=perro.vendedor
          this.altaContacto.direccion=perro.direccion
        }
      },
      vendedor(id) {
        return this.userLists.filter(user => user.id === id).map(user => user.name)[0];
      },
      saveContacto () {
        if(this.cliente!=null){
          axios.put(process.env.VUE_APP_BACKEND + 'api/v1/contacto/actualizar',Object.assign(this.altaContacto)).then(resp => {
            this.cerrar()
          })
        }else{
          if(this.altaContacto.vendedor === ""){
              this.altaContacto.vendedor = this.currentUser.id;
            }
          axios.post(process.env.VUE_APP_BACKEND + 'api/v1/contacto/guardar',Object.assign(this.altaContacto)).then(resp => {
            this.cerrar();
          })
        }
      },
      resetForm() {
        this.$store.dispatch('contacto/getContactos')
        Object.keys(this.altaContacto).forEach(key => {
          return (this.altaContacto[key] = "");
        }); 
      },
      cerrar(){
          this.resetForm();
          this.$emit("cerrarContacto", this.falso);
      }
    },
}
</script>
