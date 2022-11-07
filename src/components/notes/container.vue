<template>
    <v-container style="max-width:100vw;">
        <!-- Header -->
        <v-toolbar class="px-6 py-4" flat >
            <v-toolbar-title>{{header}}</v-toolbar-title>
            <v-btn icon>
                <v-icon @click="openFilter()">mdi-filter</v-icon> 
            </v-btn>
            <v-spacer></v-spacer>
        </v-toolbar>
        <!-- Filters -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterNotes v-bind:company="company" @filtersNotes="filtersNotes"/> 
        </v-navigation-drawer>
        
        <!-- Content -->
        <v-list three-line>
          <template v-for="(note, index) in notes">
            <v-list-item v-bind:key="index" class="notas">
              <v-list-item-content>

                <v-row class="ma-2 mb-3">
                  <v-col class="pa-0" cols="10">
                    <v-list-item-title>{{companyName(note.client_id)}} <!--| {{contact(note.contact_id)}}--></v-list-item-title>
                  </v-col>
                  <v-col class="pa-0" cols="1">
                    <v-icon v-if="note.seen==false" @click="editItem(note)" small>mdi-check-all</v-icon>
                    <v-icon v-if="note.seen==true" small color="primary">mdi-check-all</v-icon>
                  </v-col>
                  <v-col class="pa-0" cols="1">
                    <v-icon class="d-flex justify-end" v-if="permissions('deleteNotes')==true||currentUser.id==1" @click="deleteItem(note.id)" small>mdi-delete</v-icon>
                  </v-col>
                </v-row>
                
                <div style="font-size:15px; line-height:21px; color:#665f47;" class="pt-2">{{note.comment}}</div>

                <v-divider class="mt-4 mb-2"></v-divider>
                <v-row>
                  <v-col cols="6">
                    <v-list-item-subtitle class="mt-2">De: {{user(note.from_user_id)}}</v-list-item-subtitle>
                    <v-list-item-subtitle class="mt-2">Para: {{user(note.to_user_id)}}</v-list-item-subtitle>
                  </v-col>
                  <v-col cols="6">
                    <v-list-item-subtitle class="text-lg-right mt-8" v-html="new Date(note.created_at).toLocaleString()"></v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>

        <!-- Crear nota -->
        <v-dialog v-model="createDialog" max-width="450px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:company="company" @closeCreateDialogNote="closeCreateDialogNote"/>
        </v-dialog>

        <!-- Dialogo confirmación de eliminación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta nota?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteNote()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
  import axios from "axios";
  import Filter from "../notes/filter"
  import Create from "../notes/create"
  export default {
    props:{
      company:String
    },
    components: {
      'filterNotes':Filter,
      'create':Create,
    }, 
    data: () => ({
      snackbar: {
          show: false,
          message: null,
          color: null
      },
      createDialog:false,
      filters: false,
      limit:12,
      deleteId:'',
      sheet:'',
      notes:''

    }),
    computed:{
      currentUser:{
        get(){
          return this.$store.state.currentUser.user
        }
      }, 
      notesLists() {
          var response = this.notes;
          if(this.company!=''&&this.company!=undefined&&this.company!=null){
              response = response.filter(note=>note.client_id == this.company.id)
          }
          return this.limit ? response.slice(0,this.limit) : this.response
      },
      header(){
        this.notes = this.notesStore
          return 'Notas'
      },
      notesStore(){
        if(this.company!=undefined){
          return this.$store.state.note.notes.filter(note=>note.client_id==this.company)
        }else{
          return this.$store.state.note.notes
        }
      }
    },
    created(){
      this.$store.dispatch('company/getCompanies')
      this.$store.dispatch('note/getNotes')
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
      editItem(item){
        item.seen = true
        axios.put(process.env.VUE_APP_BACKEND + "api/v1/notes/" + item.id,Object.assign(item)).then(response=>{
            this.$store.dispatch('note/getNotes')
        }).catch(error => {
            this.snackbar = {
                message: error.response.data.message,
                color: 'error',
                show: true
            }
        })
      },
      deleteNote(){
        axios.delete(process.env.VUE_APP_BACKEND + "api/v1/notes/"+this.deleteId).then(response => {
          this.deleteId = ''
          this.sheet = false
          this.$store.dispatch('note/getNotes')
        }).catch(error => {
            this.snackbar = {
                message: error.response.data.message,
                color: 'error',
                show: true
            }
        });
      },
      cancel(){
        this.deleteId = ''
        this.sheet = false
      },
      deleteItem(id){
        this.deleteId = id
        this.sheet = true
      },
      closeCreateDialogNote: function(params) {
        this.createDialog = false;
        this.$store.dispatch('note/getNotes')
      },
      openFilter(){
          if(this.filters == false){
              this.$emit("closeDrawer", false);
              this.filters = true
          }else{
              this.$emit("closeDrawer", true);
              this.filters = false
          }
      },
      user(id){
        return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.name)[0]
      },
      contact(id){
        return this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact => contact.name + ' ' + contact.last)[0]
      },
      companyName(id){
        var company_name = this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
        return company_name
      },
      filtersNotes: function(params) {
        var filterNotes = this.notesStore
        if(this.company == undefined && params.client_id!=''&&params.client_id!=undefined&&params.client_id!=null){
          var uno = filterNotes.filter(note=>note.client_id == params.client_id[0])
          for(var i=1; i<params.client_id.length; i++){
            uno=uno.concat(filterNotes.filter(note=>note.client_id == params.client_id[i]))   
          }
          filterNotes = this.removeDuplicates(uno, "id");
        }
        if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
            var dos = filterNotes.filter(note=>note.contact_id == params.contact_id[0])
            for(var i=1; i<params.contact_id.length; i++){
                dos=dos.concat(filterNotes.filter(note=>note.contact_id == params.contact_id[i]))   
            }
            filterNotes = this.removeDuplicates(dos, "id");
        }
        if(params.from_user_id!=''&&params.from_user_id!=undefined&&params.from_user_id!=null){
            var tres = filterNotes.filter(note=>note.from_user_id == params.from_user_id[0])
            for(var i=1; i<params.from_user_id.length; i++){
                tres=tres.concat(filterNotes.filter(note=>note.from_user_id == params.from_user_id[i]))   
            }
            filterNotes = this.removeDuplicates(tres, "id");
        }
        if(params.to_user_id!=''&&params.to_user_id!=undefined&&params.to_user_id!=null){
            var cuatro = filterNotes.filter(note=>note.to_user_id == params.to_user_id[0])
            for(var i=1; i<params.to_user_id.length; i++){
                cuatro=cuatro.concat(filterNotes.filter(note=>note.to_user_id == params.to_user_id[i]))   
            }
            filterNotes = this.removeDuplicates(cuatro, "id");
        }
        if(params.dateFrom!='' && params.dateFrom!=null && params.dateFrom!=undefined){
            filterNotes=filterNotes.filter(note=>new Date(note.created_at) > new Date(params.dateFrom))
        }
        if(params.dateTo!='' && params.dateTo!=null && params.dateTo!=undefined){
            var dateTwo = new Date(new Date(params.dateTo).setDate(new Date(params.dateTo).getDate() + 1))
            filterNotes=filterNotes.filter(note=>new Date(note.created_at) <= dateTwo)
        }

        if(params.seenTrue==false){
          filterNotes=filterNotes.filter(note=>note.seen != true)
        }
        if(params.seenFalse==false){
          filterNotes=filterNotes.filter(note=>note.seen != false)
        }
        
        this.notes = filterNotes
      },
      removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};
        for(var i in originalArray) {
          lookupObject[originalArray[i][prop]] = originalArray[i];
        }
        for(i in lookupObject) {
          newArray.push(lookupObject[i]);
        }
        return newArray;
      },
      exportExcel: function () {
        let data = XLSX.utils.json_to_sheet(this.activityLogLists)
        const workbook = XLSX.utils.book_new()
        const filename = 'Bitacora del '
        XLSX.utils.book_append_sheet(workbook, data, filename)
        XLSX.writeFile(workbook, `${filename}.xlsx`)
      },
    },
  }
</script>

<style>
  .notas{
    background-color:#ffedb3;
    margin: 2%!important;
    width: 29%!important;
    display: inline-block;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }
  @media(max-width: 980px){
    .notas{
      margin: 4% 5%!important;
      width: 90%!important;
    }
  }
</style>