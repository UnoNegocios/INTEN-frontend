<template>
  <div class="padding" style="overflow: hidden">
    <v-card class="elevation-0" style="background-color: transparent !important;">
      <v-toolbar flat color="#f4f5fa">
        <v-toolbar-title>Ajustes</v-toolbar-title>
      </v-toolbar>
      <v-tabs class=" hidden-sm-and-down" vertical style="background-color: transparent!important; height: calc(100vh - 64px - 64px);">

        <!-- Mi cuenta -->
        <v-tab style="justify-content:left!important;" class="my-2 pr-10">
            <v-icon left>
              mdi-account
            </v-icon>
            Mi Cuenta
        </v-tab>
        <!-- Catálogos -->
        <v-tab v-show="permissions('catalogs')" style="justify-content:left!important;" class="my-2 pr-10">
            <v-icon left>
              mdi-view-dashboard
            </v-icon>
            Catálogo
        </v-tab>
        <!-- Inventario 
        <v-tab v-show="permissions('inventory')" style="justify-content:left!important;" class="my-2 pr-10">
            <v-icon left>
               mdi-format-list-bulleted
            </v-icon>
            Productos
        </v-tab>-->
        <!-- Usuarios -->
        <v-tab v-show="permissions('users')" style="justify-content:left!important;" class="my-2 pr-10">
            <v-icon left>
              mdi-account-multiple
            </v-icon>
            Usuarios
        </v-tab>
        <!-- Aplicaciones -->
        <v-tab disable style="justify-content:left!important; filter: opacity(0.5); pointer-events: none;" class="my-2 pr-10">
            <v-icon left>
              mdi-apps
            </v-icon>
            Aplicaciones
        </v-tab>

        <!-- Mi Cuenta -->
        <v-tab-item style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <account/>
          </v-card>
        </v-tab-item>
        <!-- Catálogos -->
        <v-tab-item v-show="permissions('catalogs')" style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <catalogs/>
          </v-card>
        </v-tab-item>
         <!-- Inventario 
        <v-tab-item v-show="permissions('inventory')" style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <inventory/>
          </v-card>
        </v-tab-item>-->
         <!-- Usuarios -->
        <v-tab-item v-show="permissions('users')" style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <users/>
          </v-card>
        </v-tab-item>
         <!-- Aplicaciones  -->
        <v-tab-item style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <apps/>
          </v-card>
        </v-tab-item>
      </v-tabs>

      <!-- celular -->
      <v-tabs class="py-2 hidden-md-and-up" style="background-color: transparent !important;">
        <!-- Mi cuenta -->
        <v-tab style="justify-content:left!important;" class="my-2 pr-10">
            <v-icon left>
              mdi-account
            </v-icon>
            Mi Cuenta
        </v-tab>
        <!-- Catálogos -->
        <v-tab v-show="permissions('catalogs')" style="justify-content:left!important;" class="my-2 pr-10">
            <v-icon left>
              mdi-view-dashboard
            </v-icon>
            Catálogo
        </v-tab>
        <!-- Inventario
        <v-tab v-show="permissions('inventory')" style="justify-content:left!important;" class="my-2 pr-10">
            <v-icon left>
               mdi-format-list-bulleted
            </v-icon>
            Productos
        </v-tab>-->
        <!-- Usuarios -->
        <v-tab v-show="permissions('users')" style="justify-content:left!important;" class="my-2 pr-10">
            <v-icon left>
              mdi-account-multiple
            </v-icon>
            Usuarios
        </v-tab>
        <!-- Aplicaciones -->
        <v-tab disable style="justify-content:left!important; filter: opacity(0.5); pointer-events: none;" class="my-2 pr-10">
            <v-icon left>
              mdi-apps
            </v-icon>
            Aplicaciones
        </v-tab>

        <!-- Mi Cuenta -->
        <v-tab-item style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <account/>
          </v-card>
        </v-tab-item>
        <!-- Catálogos -->
        <v-tab-item v-show="permissions('catalogs')" style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <catalogs/>
          </v-card>
        </v-tab-item>
         <!-- Inventario 
        <v-tab-item v-show="permissions('inventory')" style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <inventory/>
          </v-card>
        </v-tab-item>-->
         <!-- Usuarios -->
        <v-tab-item v-show="permissions('users')" style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <users/>
          </v-card>
        </v-tab-item>
         <!-- Aplicaciones  -->
        <v-tab-item style="background-color: transparent !important; max-height:calc(100vh - 64px); -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important; overflow-y:scroll!important;">
          <v-card flat style="background-color: transparent !important;">
            <apps/>
          </v-card>
        </v-tab-item>

      </v-tabs>
    </v-card>
  </div>
</template>


<script>
    import Catalogs from "../settings/catalogs/container"
    import Account from "../settings/account/container"
    import Users from "../settings/users/container"
    import Apps from "../settings/apps/container"
    import inventory from "../settings/inventory/container"
    export default {
        components: {
            'catalogs':Catalogs,
            'account':Account,
            'users':Users,
            'apps':Apps,
            'inventory':inventory,
        },
        computed:{
          currentUserMail:{
            get(){
              var perro = this.$store.state.currentUser.user
              return perro.email.replace('@', '%40')
            }
          },
          currentUser:{
            get(){
              return this.$store.state.currentUser.user
            }
          }
        },
        methods:{
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
        created(){
          
        },
    }
</script>

<style>
.theme--light.v-tabs > .v-tabs-bar {
    max-height:390px;
}
.theme--light.v-tabs-items {
    background-color: transparent;
}

@media (min-width: 980px){
  .padding{
    padding-right: 16px !important;
    padding-left: 16px !important;
  }
}

</style>
