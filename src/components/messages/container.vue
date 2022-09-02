<template>
    <v-row style="background:white;">  
        <!-- Sidebar -->
        <v-col cols="12" md="3" style="border-right:1px solid #dadada;" class="pr-0">
            <!-- header -->
            <v-toolbar v-if="!isMobile()" color="#ededed" dark elevation="0" class="px-3">
                <v-list-item-avatar>
                    <img src="https://unocrm.mx/wp-content/uploads/2020/04/cropped-Recurso-1.png">
                </v-list-item-avatar>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon color="#919191">mdi-message-text-outline</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon color="#919191">mdi-dots-vertical</v-icon>
                </v-btn>
            </v-toolbar>
            <!-- Search & Conversations -->
            <v-card style="height:calc(100vh - 140px)!important;" class="elevation-0 altocel2">
                <v-list two-line class="pa-0">
                    <!-- Search -->
                    <v-subheader style="background:#f6f6f6; height:62px;" class="pt-3 pb-2 search-bar">
                        <v-text-field label="Busca un chat" v-model="searchConversation" filled rounded dense solo prepend-inner-icon="mdi-magnify"></v-text-field>
                    </v-subheader>
                    <!-- Conversations List -->
                    <v-card id="scroll-target" style="height: calc(100vh - 190px)" class="altocel overflow-y-auto pl-3 pr-1">
                        <template v-for="(item, index) in conversations">
                            <v-list-item :key="item.phone" @click="select(item)" class="py-1">
                                    <v-badge class="khe" avatar bordered overlap>
                                        <template v-slot:badge>
                                        <v-avatar>
                                            <v-img :src="logito(item.phone, item.facebookId, item.instagramId)"></v-img>
                                        </v-avatar>
                                        </template>
                                        <v-avatar size="40" color="#ccd2d4">
                                            <img v-if="item.client_picture!=null" :src="item.client_picture">
                                            <span style="text-transform: uppercase;" class="white--text text-h6" v-else><strong>{{item.client_name.slice(0,1)}}</strong></span>
                                        </v-avatar>
                                    </v-badge>
                                <v-list-item-content class="ml-3">
                                    <v-list-item-title v-html="item.client_name"></v-list-item-title>
                                    <v-list-item-subtitle v-html="companyName(item.company_id)"></v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mr-4" :key="index"></v-divider>
                        </template>
                    </v-card>
                </v-list>
            </v-card>
        </v-col>
        <!-- Conversation -->
        <!-- PC -->
        <v-col class="px-0" v-if="conversationId!='' && !isMobile()" cols="12" md="9" style="background-color: white; background-repeat: repeat; background-size: 412.5px 749.25px; background-image: linear-gradient(120deg,rgb(229 221 213 / 90%) 60%,rgb(229 221 213 / 90%) 60%),url(https://unocrm.mx/wp-content/uploads/2021/07/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png)!important;">
            <!-- Header -->
            <v-toolbar class="pl-3 pr-6" color="#ededed" dark elevation="0" >
                <v-list-item-avatar>
                    <img src="https://unocrm.mx/wp-content/uploads/2020/04/cropped-Recurso-1.png">
                </v-list-item-avatar>
                <div v-if="clientName(to)!=undefined">
                    <span style="color:black;">{{clientName(to)}}</span> 
                </div>
                <div v-else>
                    <span style="color:black;">{{to}}</span> <v-btn x-small @click="asociarDialog=true" class="ml-4 elevation-0" rounded color="primary">Asociar</v-btn>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon color="#919191">mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon color="#919191">mdi-dots-vertical</v-icon>
                </v-btn>
            </v-toolbar>
            <!-- Messages -->
            <div style="max-height:calc(100vh - 64px - 64px - 64px);" class="chat__body pl-7 pr-10 pt-5 pb-0" ref="container">
                <!-- Message -->
                <p v-for="(message, index) in messages" :key="index" :class="message.direction === 'OUT' ? 'chat__sender chat__message'
                    : 'chat__reciever chat__message'" :style="{'padding-right':palomitas(message.direction),}"> {{ message.contents.text }}  
                    <!-- Hour -->
                    <span class="chat__timestamp">{{new Date(message.zenvia_timestamp).getHours()}}:{{new Date(message.zenvia_timestamp).getMinutes()}}</span>
                    <!-- Seen -->
                    <v-icon v-if="message.direction === 'OUT'" x-small :color="colorVisto(message.messageId)" class="chat__checkmark">{{visto(message.messageId)}}</v-icon>
                </p>
            </div>
            <!-- Type Message-->
            <div style="position:absolute; bottom:0; background:#f0f0f0; width:76.2%;" class="px-6 py-3 perros">
                <v-textarea full-width rows="1" no-resize auto-grow v-model="message" :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'" prepend-icon="mdi-attachment" filled rounded 
                dense single-line hide-details @keydown.enter="sendMessage" label="Escribe un mensaje aquí" @click:append-outer="sendMessage" @click:prepend="changeIcon" color="#919191"
                ></v-textarea>
            </div>
        </v-col>
        <!-- celular -->
        <v-dialog v-else v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" style="background:white!important;">
            <v-col v-if="conversationId!=''" cols="12" md="9" class="px-0" style="background-color: white; background-repeat: repeat; background-size: 412.5px 749.25px; background-image: linear-gradient(120deg,rgb(229 221 213 / 90%) 60%,rgb(229 221 213 / 90%) 60%),url(https://unocrm.mx/wp-content/uploads/2021/07/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png)!important;">
                <!-- Header -->
                <v-toolbar class="pl-0 pr-6" color="#ededed" dark elevation="0" >
                    <v-btn icon @click="dialog=false">
                        <v-icon color="#919191">mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-list-item-avatar class="mr-4">
                        <img src="https://unocrm.mx/wp-content/uploads/2020/04/cropped-Recurso-1.png">
                    </v-list-item-avatar>
                    <div v-if="clientName(to)!=undefined">
                        <span style="color:black;">{{clientName(to)}}</span> 
                    </div>
                    <div v-else>
                        <span style="color:black;">{{to}}</span> <v-btn x-small class="ml-4 elevation-0"  @click="asociarDialog=true" rounded color="primary">Asociar</v-btn>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon color="#919191">mdi-dots-vertical</v-icon>
                    </v-btn>
                </v-toolbar>
                <!-- Messages -->
                <div style="max-height:calc(100vh - 64px - 64px - 64px);" class="chat__body pl-7 pr-10 pt-5 pb-0" ref="container">
                    <p v-for="(message, index) in messages" :key="index"
                    :class="message.direction === 'OUT'
                        ? 'chat__sender chat__message'
                        : 'chat__reciever chat__message'" :style="{'padding-right':palomitas(message.direction),}">
                        {{ message.contents.text }}
                        <!-- hora -->
                        <span class="chat__timestamp">{{new Date(message.zenvia_timestamp).getHours()}}:{{new Date(message.zenvia_timestamp).getMinutes()}}</span>
                        <!-- palomitas -->
                        <v-icon v-if="message.direction === 'OUT'" x-small :color="colorVisto(message.messageId)" class="chat__checkmark">{{visto(message.messageId)}}</v-icon>
                    </p>
                </div>
                <!-- Type Message-->
                <div style="position:absolute; bottom:0; background:#f0f0f0; width:76.2%;" class="px-6 py-3 perros">
                    <v-textarea
                        full-width 
                        rows="1" 
                        no-resize 
                        auto-grow
                        v-model="message"
                        :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'"
                        prepend-icon="mdi-attachment"
                        filled
                        rounded
                        dense
                        single-line
                        hide-details
                        @keydown.enter="sendMessage"
                        label="Escribe un mensaje aquí"
                        @click:append-outer="sendMessage"
                        @click:prepend="changeIcon"
                        color="#919191"
                    ></v-textarea>
                </div>
            </v-col>
        </v-dialog>
        <!-- Asociar Conversación a Cliente-->
        <v-dialog v-model="asociarDialog" max-width="700px">
            <v-card class="px-8 py-4">
                <v-card-title class="px-0 mb-2">Selecciona la emprea o contacto a asociar</v-card-title>
                <v-row class="mb-1">
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete clearable v-model="company_id" :items="companyLists" label="Empresa" item-text="name" item-value="id">
                            <template slot="no-data"><div class="px-4 py-1">No existen empresas relacionadas. <v-btn rounded class="mx-3" color="primary" @click="createCompanyDialog=true" x-small>Crear</v-btn></div></template>                      
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete :disabled="company_id==null" clearable v-model="contact_id" :items="contactLists" label="Contacto" item-text="name" item-value="id">
                            <template slot="no-data"><div class="px-4 py-1">No existen contactos relacionados. <v-btn rounded class="mx-3" color="primary" @click="createContactDialog=true" x-small>Crear</v-btn></div></template>                      
                        </v-autocomplete>
                    </v-col> 
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="company_id==null && contact_id==null" disabled class="px-4" small rounded color="primary">Asignar</v-btn>
                    <v-btn @click="asociarEmpresa" v-else-if="company_id!=null && contact_id==null" class="px-4" small rounded color="primary">Asignar a Empresa</v-btn>
                    <v-btn @click="asociarContacto" v-else class="px-4" small rounded color="primary">Asignar a Contacto</v-btn>
                </v-card-actions>
                <!-- Crear Contacto -->
                <v-dialog v-model="createContactDialog" max-width="600px">
                    <createContact v-bind:company="company_id" @closeCreateDialogContact="closeCreateDialogContact"/>
                </v-dialog>
                <!-- Crear empresa -->
                <v-dialog v-model="createCompanyDialog" max-width="700px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                        <v-icon color="white">  mdi-plus </v-icon>
                    </v-btn> 
                </template>
                <createCompany @closeCreateDialogCompany="closeCreateDialogCompany"/>
                </v-dialog>
            </v-card>
        </v-dialog>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-row>
</template>

<script>
import EmojiPicker from "vue-emoji-picker";
import axios from "axios";
import CreateContact from "../clients/contacts/create"
import CreateCompany from "../clients/companies/create"
    export default {
        components: {
            EmojiPicker,
            'createContact':CreateContact,
            'createCompany':CreateCompany,
        }, 
        data: () => ({
            contact_id:null,
            company_id:null,
            createContactDialog: false,
            createCompanyDialog: false,
            asociarDialog:false,
            dialog:false,
            conversationId:'',
            to:'',
            password: 'Password',
            show: false,
            message: '',
            marker: true,
            iconIndex: 0,
            input: '',
            search: '',
            messageInput:{
                conversation_id:'',
                messageId:'',
                user_id:'',
                contents:{
                    type:'',
                    text:''
                },
                from:'',
                to:'',
                direction:'',
                channel:'',
            },
            vistoono:'',
            searchConversation:'',
            snackbar: {
                show: false,
                message: null,
                color: null
            },
        }),
        computed:{
            companyLists(){
                return this.$store.state.company.companies
            },
            contactLists(){
                return this.$store.state.contact.contacts
            },
            messages(){
                return this.$store.state.message.messages
            },
            conversations(){
                var conversaciones = this.$store.state.conversation.conversations
                if(this.searchConversation!=null && this.searchConversation!=undefined && this.searchConversation!=''){
                    return conversaciones.filter(conversation=>
                        conversation.client_name.toString().toLowerCase().includes(this.searchConversation.toString().toLowerCase())
                        //|| this.companyName(conversation.company_id).toString().includes(this.searchConversation.toString())
                        //|| conversation.phone.toString().includes(this.searchConversation.toString())
                    )
                }else{
                    return conversaciones
                }
            },
            currentUser:{
                get(){
                    return this.$store.state.currentUser.user;
                }
            },
            messageStatus(){
                return this.$store.state.message_status.statuses;
            },
        },
        updated() {
            this.messages !== null &&
            this.messages !== undefined
            ? this.scrollToEnd()
            : null;
        },
        mounted() {
            Echo.channel('test').listen('Test', (e) => {
                this.$store.dispatch('conversation/getConversations')
                this.$store.dispatch('message/getMessages')
            })
            this.messages !== null &&
            this.messages !== undefined
            ? this.scrollToEnd()
            : null;
        },
        methods: {
            asociarEmpresa(){
                var editedItem = this.conversations.filter(conversation=>conversation.id == this.conversationId)[0]
                editedItem.company_id = this.company_id
                this.$nextTick(() => {
                    axios.put("https://unowipes.com/api/v1/conversation/update",Object.assign(editedItem)).then(response=>{
                        this.company_id = null
                        this.asociarDialog = false
                        this.$nextTick(() => {
                            this.$store.dispatch('conversation/getConversations')
                        })
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                })
            },
            asociarContacto(){
                var editedItem = this.conversations.filter(conversation=>conversation.id == this.conversationId)[0]
                editedItem.contact_id = this.contact_id
                this.$nextTick(() => {
                    axios.put("https://unowipes.com/api/v1/conversation/update",Object.assign(editedItem)).then(response=>{
                        this.contact_id = null
                        this.company_id = null
                        this.asociarDialog = false
                        this.$nextTick(() => {
                            this.$store.dispatch('conversation/getConversations')
                        })
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                })
            },
            isMobile() {
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    return true
                } else {
                    return false
                }
            },
            clientName(to){
                
            },
            visto(messageId){
                var what = this.messageStatus.filter(status=>status.messageId == messageId).sort(function(a,b){
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                if(what[0]!=undefined){
                    switch(what[0].code){
                        case undefined: return 'mdi-clock-outline'
                        case "SENT": return 'mdi-check';
                        case "DELIVERED": return 'mdi-check-all';
                        case "READ": return 'mdi-check-all';
                    }
                }
            },
            colorVisto(messageId){
                var what = this.messageStatus.filter(status=>status.messageId == messageId).sort(function(a,b){
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                if(what[0]!=undefined){
                    if(what[0].code === "READ"){
                        return 'blue'
                    }else{
                        return 'grey'
                    }
                }
            },
            select(item){
                this.dialog = true
                this.conversationId = item.id
                localStorage.setItem("conversacionId", item.id)
                if(item.instagramId==undefined&&item.facebookId==undefined&&item.phone!=undefined){
                    this.to = item.phone
                    this.channel = 'whatsapp'
                }else if(item.instagramId==undefined&&item.phone==undefined&&item.facebookId!=undefined){
                    this.to = item.facebookId
                    this.channel = 'facebook'
                }else if(item.instagramId!=undefined&&item.phone==undefined&&item.facebookId==undefined){
                    this.to = item.instagramId
                    this.channel = 'instagram'
                }
                this.$store.dispatch('message/getMessages')
                this.$store.dispatch('message_status/getStatuses')   
            },
            sendMessage(){
                if(this.messageInput.channel == 'whatsapp'){
                    var gato = "fearless-plain"
                }else{
                    var gato = "clear-pruner"
                }
                var perro = this.message
                this.message = ''
                axios({
                    method: "POST",
                    url: "https://api.zenvia.com/v2/channels/" + this.channel + "/messages",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-TOKEN": "6xk4uuY_WH-kGMb9y2o_E78KShJ34TlW-HPb"
                    },
                    data: {
                        from:gato,
                        to:this.to,
                        contents:[{
                            type:"text",
                            text:perro
                        }]
                    },
                }).then(response => {
                    this.messageInput.conversation_id = this.conversationId
                    this.messageInput.messageId = response.data.id
                    this.messageInput.user_id = this.currentUser.id
                    this.messageInput.contents.type="text",
                    this.messageInput.contents.text=perro
                    this.messageInput.from = response.data.from
                    this.messageInput.to = response.data.to
                    this.messageInput.direction = response.data.direction
                    this.messageInput.channel = this.channel
                    axios.post("https://unowipes.com/api/v1/message/create",Object.assign(this.messageInput)).then(response=>{
                        this.$store.dispatch('message/getMessages')
                    })
                })  
            },
            companyName(id){
                return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
            },
            logito(phone, facebookId, instagramId){
                if(instagramId==undefined&&facebookId==undefined&&phone!=undefined){
                    return 'https://unocrm.mx/wp-content/uploads/2021/08/whatsapp-icon-seeklogo.com_.svg'
                }else if(instagramId==undefined&&phone==undefined&&facebookId!=undefined){
                    return 'https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg'
                }else if(instagramId!=undefined&&phone==undefined&&facebookId==undefined){
                    return 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg'
                }
            },
            palomitas(direction){
                if(direction=='OUT'){
                    return '45px!important'
                }else if(direction=='IN'){
                    return '40px!important'
                }
            },
            scrollToEnd() {
                const content = this.$refs.container;
                if(content!=undefined){
                    content.scrollTop = content.scrollHeight;
                }
            },
            salesman(id){
                return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.name)[0]
            },
            align(direction){
                if(direction=='OUT'){
                    return 'right'
                }else if(direction=='IN'){
                    return 'left'
                }
            },
            append(emoji) {
                this.input += emoji
            },
            toggleMarker () {
                this.marker = !this.marker
            },
            sendMessageIcon () {
                this.resetIcon()
                this.clearMessage()
            },
            clearMessage () {
                this.message = ''
            },
            resetIcon () {
                this.iconIndex = 0
            },
            changeIcon () {
                this.iconIndex === this.icons.length - 1
                ? this.iconIndex = 0
                : this.iconIndex++
            },
            closeCreateDialogContact: function(params) {
                this.createContactDialog = params;
                this.$store.dispatch('contact/getContacts')
            },
            closeCreateDialogCompany: function(params) {
                this.createCompanyDialog = params;
                this.$store.dispatch('company/getCompanies')
            },
        },
        created(){
            localStorage.removeItem("conversacionId");
            this.$store.dispatch('conversation/getConversations')
        }
    }
</script>

<!--style>
    .chat__timestamp {
    margin-left: 10px;
    font-size: xx-small;
    position:absolute;
    bottom:2px;
    }
    .chat__checkmark {
    position:absolute;
    bottom:-9px;
    right:-37px;
    }
    .chat__message {
    position: relative;
    font-size: 14.2px;
    padding: 6px 0px 8px 9px;
    border-radius: 7.5px;
    background-color: #ffffff;
    width: fit-content;
    margin-bottom: 30px;
    max-width: 65%;
    }
    .chat__reciever:after {
    content: "";
    position: absolute;
    margin-top: -6px;
    margin-left: -5px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #ffffff !important;
    transform: rotate(42deg);
    left: -6px;
    top: 4px;
    }
    .chat__sender {
    margin-left: auto;
    background-color: #dcf8c6;
    }
    .chat__sender:after {
    content: "";
    position: absolute;
    margin-top: -6px;
    margin-left: -5px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #dcf8c6 !important;
    transform: rotate(-42deg);
    right: -10px;
    top: 4px;
    }
    .chat__body{
        flex: 1;
        overflow: scroll;
    }
    .search-bar .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
        box-shadow: 0px 3px 1px -2px rgba(255, 255, 255, 0), 0px 2px 2px 0px rgba(255, 255, 255, 0), 0px 1px 5px 0px rgba(255, 255, 255, 0)!important;
    }
    .search-bar .v-label {
        font-size: 15px;
        color:#919191;
    }
    .search-bar .mdi-magnify::before {
        font-size: 18px;
        color:#919191;
    }
    .wrapper {
    position: relative;
    display: inline-block;
    }
    .regular-input {
    padding: 0.5rem 1rem;
    border-radius: 3px;
    border: 1px solid #ccc;
    width: 20rem;
    height: 12rem;
    outline: none;
    }
    .regular-input:focus {
    box-shadow: 0 0 0 3px rgba(66,153,225,.5);
    }
    .wrapper {
    position: relative;
    display: inline-block;
    }
    .regular-input {
    padding: 0.5rem 1rem;
    border-radius: 3px;
    border: 1px solid #ccc;
    width: 20rem;
    height: 12rem;
    outline: none;
    }
    .regular-input:focus {
    box-shadow: 0 0 0 3px rgba(66,153,225,.5);
    }
/*
.emoji-invoker {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.emoji-invoker:hover {
  transform: scale(1.1);
}
.emoji-invoker > svg {
  fill: #b1c6d0;
}
.emoji-picker {
  position: absolute;
  z-index: 1;
  border: 1px solid #ccc;
  width: 15rem;
  height: 20rem;
  overflow: scroll;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: "";
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
*/
    .perros .theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
        background: white;
    }
    .perros textarea{
        overflow: auto!important;
        max-height: 120px!important;
    }
    .v-icon.notranslate.v-icon--link.mdi.theme--light{
        color:#919191!important;
    }
    .perros .v-input__control{
        margin: 0px 10px!important;
    }
    .khe .v-badge__badge.primary{    
        inset: auto auto -5px -5px!important;
    }
    @media (max-width: 980px){
        .perros{
            width: 100vw!important;
        }
        header{
            margin-top:-13px;
        }
        .chat__body{
            max-height: calc(100vh - 120px)!important;
            min-height: calc(100vh - 120px)!important;
        }
        .altocel{
            height:calc(100vh - 60px - 56px)!important;
        }
        .altocel2{
            height:calc(100vh - 56px)!important;
        }
    }
</style-->