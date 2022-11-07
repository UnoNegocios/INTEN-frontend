<template>
    <div class="padding1" style="background:#f4f5fa; min-height:calc(100vh - 125px);">
        <!--v-card v-if="info==true" style="background:transparent;" class="elevation-0 pb-6 px-7">
            <v-card-text class="py-3 px-6" style="background:#1976d1; color:white; border-radius: 5px;">
                <v-icon color="white" small class="mr-2">mdi-information-outline</v-icon>
                Lorem ipsum dolor sit amet consectetur adipiscing elit massa imperdiet, mauris tortor platea fringilla sodales ac magna sociosqu, natoque non rutrum nec auctor vestibulum congue eget. 
                <v-icon style="position:absolute!important; top:7px; right:30px;" color="white" @click="info=false" small class="mr-2">mdi-close</v-icon>
            </v-card-text>
        </v-card-->

        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;"> 
                <v-icon class="mr-4">mdi-account</v-icon>
                Mi Cuenta
            </v-card-title>

            <v-card-subtitle style="background:white;" class="py-5 pl-6" >Es posible que otros usuarios puedan ver parte de la información al usar los servicios de <strong>UNO CRM</strong>.</v-card-subtitle>
            
            <div style="background:white;" class="px-6 pb-5">
                <v-row class="p-4">
                    <v-col cols="3" class="pb-6 pt-7">Foto</v-col>
                    <v-col cols="7" class="pb-6 pt-7">Puedes personalizar tu cuenta con una foto</v-col>
                    <v-col cols="2">



                        <v-dialog v-model="dialog" width="325">
                            <template v-slot:activator="{ on, attrs }">
                                <v-avatar v-bind="attrs" v-on="on" elevation="2" size="50px">
                                    <v-img alt="user" :src="link + 'files/'+currentUser.avatar"></v-img>
                                </v-avatar>
                            </template>
                            <v-card>
                                <vue-dropzone 
                                    ref="myVueDropzone" 
                                    id="dropzone" 
                                    :options="dropzoneOptions" 
                                    v-on:vdropzone-success="uploadSuccess" 
                                    v-on:vdropzone-error="uploadError" 
                                    v-on:vdropzone-removed-file="fileRemoved"/>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-snackbar :color="snackbar2.color" v-model="snackbar2.show">
                                {{ snackbar2.message }}
                            </v-snackbar>
                        </v-dialog>





                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Nombre</v-col>
                    <v-col cols="7">
                        <span v-if="editName==false">{{currentUser.name}} {{currentUser.last}}</span>
                        <v-text-field v-else v-model="currentUser.name"  @click:append="save" append-icon="mdi-content-save" label="Nombre" placeholder="Nombre" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editName==false" @click="editName=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editName==true" @click="editName=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Correo Electrónico</v-col>
                    <v-col cols="7">
                        <span v-if="editEmail==false">{{currentUser.email}}</span>
                        <v-text-field v-model="currentUser.email" @click:append="save" append-icon="mdi-content-save" v-else label="Correo Electrónico" placeholder="Correo Electrónico" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editEmail==false" @click="editEmail=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editEmail==true" @click="editEmail=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Contraseña</v-col>
                    <v-col cols="7">
                        <span v-if="editPassword==false">* * * * * * * *</span>
                        <v-text-field v-model="editedPassword.password" @click:append="savePassword" append-icon="mdi-content-save" v-else label="Contraseña" placeholder="Contraseña" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editPassword==false" @click="editPassword=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editPassword==true" @click="editPassword=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Teléfono</v-col>
                    <v-col cols="7">
                        <span v-if="editPhone==false">{{currentUser.phone}}</span>
                        <v-text-field v-model="currentUser.phone" @click:append="save" append-icon="mdi-content-save" v-else label="Teléfono" placeholder="Teléfono" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editPhone==false" @click="editPhone=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editPhone==true" @click="editPhone=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
            </div>
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>

<script>
    import vue2Dropzone from "vue2-dropzone";
    import "vue2-dropzone/dist/vue2Dropzone.min.css";
    import axios from "axios";
    export default {
        components: {
            vueDropzone: vue2Dropzone,
        },  
        data () {
            return {
                dialog: false,
                snackbar2: {
                    show: false,
                    message: null,
                    color: null
                },
                dropzoneOptions: {
                    url: process.env.VUE_APP_BACKEND + "api/v1/user/photo",
                    addRemoveLinks: true,
                    maxFiles: 1,
                    thumbnailWidth: 250,
                    dictDefaultMessage: 'Haz clic aquí o arrastra una imagen.',
                    dictFallbackMessage: "Tu navegador no puede subir archivos arrastarndolos a la pantalla.",
                    dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                    dictInvalidFileType: "No puede cargar archivos de este tipo.",
                    dictCancelUpload: "Cancelar carga",
                    dictCancelUploadConfirmation: "Estás seguro de que deseas cancelar esta carga?",
                    dictRemoveFile: "Eliminar",
                    dictMaxFilesExceeded: "No puedes subir más archivos.",
                },
                info:true,
                editName:false,
                editPhoto:false,
                editEmail:false,
                editPassword:false,
                editPhone:false,
                editedPassword:{
                    password:''
                },
                snackbar: {
                    show: false,
                    message: null,
                    color: null
                },
            }
        },
        methods:{
            save(){
                axios.put(process.env.VUE_APP_BACKEND + "api/v1/user/update",Object.assign(this.currentUser)).then(response=>{
                    this.$store.dispatch('currentUser/getUser')
                    this.editName=false
                    this.editPhoto=false
                    this.editEmail=false
                    this.editPhone=false
                    this.dialog=false
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            },
            savePassword(){
                axios.put(process.env.VUE_APP_BACKEND + "api/v1/user/password",Object.assign(this.currentUser, this.editedPassword)).then(response=>{
                    this.editedPassword=''
                    this.editPassword=false
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            },

            uploadSuccess(file, response) {
                console.log('File Successfully Uploaded with file name: ' + response.file);
                this.fileName = response.file
                this.currentUser.avatar = this.fileName
                this.index = this.index+1
            },
            uploadError(file, message) {
                this.snackbar2 = {
                    message: message.message,
                    color: 'error',
                    show: true
                }
            },
            fileRemoved(file) {
                this.currentUser.avatar = ''
            },
        },
        computed:{
            link(){
                return process.env.VUE_APP_BACKEND 
            },
          currentUser:{
            get(){
              return this.$store.state.currentUser.user
            }
          }
        },
        created(){
          
        },
    }
</script>

<style>
@media (min-width: 980px){
    .padding1{
        padding-left: 24px !important;
        padding-right: 48px !important;
    }
    .padding3{
        padding-right: 36px !important;
        padding-left: 36px !important;
    }
}
@media (max-width: 980px){
    .padding1{
        padding-top:20px!important;
    }
}
.v-sheet--offset {
    top: -50px;
    position: relative;
    margin: auto;
    display: block;
    border-radius: 50%!important;
    margin-bottom: -30px;
  }
</style>