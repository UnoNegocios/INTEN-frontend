<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            <span>Editar Producto</span>
        </v-card-title>

        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.macro" label="Código Macro"></v-text-field>
                    <v-checkbox v-model="editedItem.is_published" label="Publicado"></v-checkbox>
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Producto"></v-text-field>
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" type="number" v-model="editedItem.price" label="Precio"></v-text-field>
                    <v-autocomplete :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.provider_id" :items="providers" label="Proveedor" item-text="name" item-value="id">
                        <template slot="no-data">
                            <div class="px-6 pt-3">
                                No existen proveedores relacionados.
                                <v-text-field v-model="createProvider.name" label="Proveedor" append-icon="mdi-plus" @click:append="saveProvider()"></v-text-field>
                            </div>
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                    
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" type="number" v-model="editedItem.cost" label="Costo"></v-text-field>
                    <v-autocomplete :rules="[v => !!v || 'Campo requerido']" multiple v-model="editedItem.categories" v-if="editedItem.product_type!='Variación'" :items="categories" label="Categoría" item-text="name" item-value="id">
                        <template slot="no-data">
                            <div class="px-6 pt-3">
                                No existen categorías relacionadas.
                                <v-text-field v-model="createCategory.name" label="Nueva Categoría" append-icon="mdi-plus" @click:append="saveCategory()"></v-text-field>
                            </div>
                        </template>
                    </v-autocomplete>
                    <v-text-field v-model="editedItem.weight" label="Peso" suffix="Kg"></v-text-field>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text  :loading="gris" :disabled="gris || !valid" @click="save">Guardar</v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>
<script>
import axios from "axios";
//import vue2Dropzone from "vue2-dropzone";
//import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
    /*components: {
        vueDropzone: vue2Dropzone,
    },*/  
    props:{
        editedItem:Object
    },
    data:()=>({ 
        /*dropzoneOptions: {
            url: process.env.VUE_APP_BACKEND + "api/v1/item/files",
            addRemoveLinks: true,
            thumbnailWidth: 150,
            dictDefaultMessage: 'Haz clic aquí o arrastra la(s) imagen(es) a subir.',
            dictFallbackMessage: "Tu navegador no puede subir archivos arrastarndolos a la pantalla.",
            dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
            dictInvalidFileType: "No puede cargar archivos de este tipo.",
            dictCancelUpload: "Cancelar carga",
            dictCancelUploadConfirmation: "Estás seguro de que deseas cancelar esta carga?",
            dictRemoveFile: "Eliminar",
            dictMaxFilesExceeded: "No puedes subir más archivos.",
        },*/
        gris:false, 
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        /*snackbar2: {
            show: false,
            message: null,
            color: null
        },*/
        //index:0,
        //disable:'',
        valid: true,
        createCategory:{
            name:'',
        },
        createProvider:{
            name:'',
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    computed:{
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        categories:{
            get(){
                return this.$store.state.category.categories;
            }
        },
        providers:{
            get(){
                return this.$store.state.provider.providers;
            }
        },
    },
    methods:{
        close () {
            this.gris = false
            //this.index = 0
            //this.$refs.myVueDropzone.removeAllFiles()
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            this.$nextTick(() => {
                axios.patch(process.env.VUE_APP_BACKEND + "api/v1/cellular_plans/" + this.editedItem.id,Object.assign(this.editedItem)).then(response=>{
                    this.close()
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                    this.gris = false
                })
            })
        },
        saveCategory(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/consumption_categories",Object.assign(this.createCategory)).then(response=>{
                this.$store.dispatch('category/getCategories')
                //this.disable = true
                this.createCategory.name=''
            }) 
        },
        saveProvider(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/providers",Object.assign(this.createProvider)).then(response=>{
                this.$store.dispatch('provider/getProviders')
                //this.disable = true
                this.createProvider.name=''
            }) 
        },
        /*
        uploadSuccess(file, response) {
            console.log('File Successfully Uploaded with file name: ' + response.file);
            this.fileName = response.file;
            this.editedItem.images[this.index] = this.fileName;
            this.index = this.index+1
        },
        uploadError(file, message) {
            console.log('error')
            this.snackbar2 = {
                message: message.message,
                color: 'error',
                show: true
            }
        },
        fileRemoved(file) {
            var name = this.editedItem.images.filter(image=>image.includes(file.name))[0]
            var index = this.editedItem.images.indexOf(name)
            this.editedItem.images.splice(index, 1);
            this.index = this.index-1
        },
        deleteImage(index) {
            if (confirm('Seguro que deseas eliminar esta imagen?')) {
                this.editedItem.images.splice(index, 1);
                this.index = this.index-1
            }
        }
        */
    }
}
</script>