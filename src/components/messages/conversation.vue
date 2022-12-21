<template>
    <v-card class="ma-0" v-if="client!=undefined">
        <v-toolbar class="pl-3 pr-6" color="#ededed" elevation="0" style="border-bottom:solid #ccd2d4 2px;">
            <v-list-item-avatar size="30" color="#ccd2d4">
                <v-img v-if="conversation!=undefined && conversation.client_picture!=null" :src="conversation.client_picture"></v-img>
                <span style="text-transform: uppercase; text-align: center; width: 30px;" class="white--text text-h6" v-else><strong>{{client.name.slice(0,1)}}</strong></span>
            </v-list-item-avatar>
            <div v-if="conversation!=undefined">
                <span>{{conversation.client_name}}</span> 
            </div>
            <v-spacer></v-spacer>
            <v-row class="my-0" style="transform:scale(0.8); margin-right: -8%;">
                <!--v-select style="width:80px;" class="mt-1" :items="funnels" rounded outlined dense v-model="newFunnel" small item-text="name" item-value="id"></v-select-->
                <v-select style="width:80px;" class="mt-1 mx-4" :items="phases" rounded outlined dense v-model="newPhase" small item-text="name" item-value="id"></v-select>
                <v-btn rounded color="primary" :disabled="buttonDisabled" @click="saveFunelAndFace()" class="elevation-0 mt-1">MOVER</v-btn>
            </v-row>
        </v-toolbar>
        <v-row class="ma-0">
            <v-col md=12 class="pa-0" style="border-right:solid #ccd2d4 2px;">
                <div  style="border-top:solid #ccd2d4 1px; background-color: white; background-repeat: repeat; background-size: 412.5px 749.25px; background-image: linear-gradient(120deg,rgb(229 221 213 / 90%) 60%,rgb(229 221 213 / 90%) 60%),url(https://unocrm.mx/wp-content/uploads/2021/07/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png)!important;">
                    <div v-if="conversation!=undefined" style="height:calc(100vh - 350px);" class="chat__body pl-7 pr-10 py-0" ref="container">
                        <infinite-loading direction="top" @infinite="getMessages"></infinite-loading>
                        <!-- Message -->
                        <div v-for="(message_item, index) in messages" :key="index">
                            <v-row class="ma-0 mb-2">
                                <v-spacer></v-spacer>
                                <v-chip small style="font-weight:500;" color="#f0f0f0" class="elevation-1" light v-if="(index>=1 && message_item.created_at.slice(0,10)!=messages[index-1].created_at.slice(0,10)) || index==0">
                                    {{dateFormat(message_item.meessage_datetime)}}
                                </v-chip>
                                <v-spacer></v-spacer>   
                            </v-row>
                            <p :class="message_item.direction === 'OUT' ? 'chat__sender chat__message': 'chat__reciever chat__message'" :style="'padding-right:'+ checkPadding(message_item.direction)"> 
                                
                                <span v-if="message_item.contents.type=='text' || message_item.contents.type=='template'">{{ message_item.contents.text }} </span>
                                 
                                <img v-else-if="message_item.contents.type=='file' && message_item.contents.fileMimeType=='image/png'" style="margin-right:-30px; margin-bottom:5px; width:60px; max-height:60px; object-fit:cover;" :src="message_item.contents.fileUrl"/>

                                <v-dialog content-class="elevation-0" v-else-if="message_item.contents.type=='file' && (message_item.contents.fileMimeType=='image/jpeg' || message_item.contents.fileMimeType=='jpeg' || message_item.contents.fileMimeType=='jpg' || message_item.contents.fileMimeType=='png')" style="height:auto; max-width:60px!important; max-width:600px!improtant;">
                                    <template v-slot:activator="{ on, attrs }">
                                        <img v-bind="attrs" v-on="on" :style="imageMargin(message_item.direction) + 'margin-bottom:5px; width:400px; max-height:400px; object-fit:cover;'" :src="message_item.contents.fileUrl"/>
                                    </template>
                                    <template v-slot:default="dialog">
                                        <div style="position: absolute; right: 0; top: 15px; width: 200px;">
                                            <v-btn icon class="mx-5" @click="downloadWithAxios(message_item.contents.fileUrl)">
                                                <v-icon color="white">mdi-download</v-icon>
                                            </v-btn>
                                            <v-btn icon color="primary" @click="dialog.value = false">
                                                <v-icon color="white">mdi-close-circle</v-icon>
                                            </v-btn>
                                        </div>
                                        <v-row class="ma-0 elevation-0">
                                            <v-spacer/>
                                            <img style="max-height:600px; width:auto;" :src="message_item.contents.fileUrl"/>
                                            <v-spacer/>
                                        </v-row>
                                    </template>
                                </v-dialog>

                                <video style="height: 60px; width: 300px!important; transform: scale(.8); margin: -16px -39px; filter: brightness(1.1);" v-else-if="message_item.contents.type=='file' && message_item.contents.fileMimeType!=undefined && message_item.contents.fileMimeType.includes('ogg')" controls="" :autoplay="false" name="media">
                                    <source :src="message_item.contents.fileUrl" type="audio/ogg">
                                </video>

                                <video style="margin-right:-30px; margin-bottom:5px; max-width:400px; max-height:400px; object-fit:cover;" controls v-else-if="message_item.contents.fileMimeType=='video/mp4'||message_item.contents.fileMimeType=='mp4'||message_item.contents.fileMimeType=='mov'">
                                    <source :src="message_item.contents.fileUrl" type="video/mp4"/>
                                </video>

                                <v-btn style="letter-spacing: 0px;" color="primary" text class="py-6" v-else-if="message_item.contents.fileMimeType!=undefined && message_item.contents.fileMimeType.includes('application')" v-bind:href="message_item.contents.fileUrl" target="_blank">
                                    <v-icon class="mr-2">mdi-file-document</v-icon><span>{{message_item.contents.fileName}}</span><v-icon class="ml-2">mdi-download-circle-outline</v-icon>
                                </v-btn>

                                <v-btn style="letter-spacing: 0px;" color="primary" text class="pt-6 pb-5 mr-8" v-else-if="message_item.contents.fileMimeType == 'pdf'||message_item.contents.fileMimeType == 'xlsx'||message_item.contents.fileMimeType == 'doc'||message_item.contents.fileMimeType == 'ppt'" v-bind:href="message_item.contents.fileUrl" target="_blank">
                                    <v-icon class="mr-2">mdi-file-document</v-icon><span>{{message_item.contents.fileName}}</span><v-icon class="ml-2">mdi-download-circle-outline</v-icon>
                                </v-btn>

                                <span v-else-if="message_item.contents.type=='location'">
                                    <iframe :src="'https://maps.google.com/maps?q=' + message_item.contents.latitude + ',' + message_item.contents.longitude + '&hl=es;z=14&amp;output=embed'" 
                                        width="535" 
                                        height="300" 
                                        style="border:0;" 
                                        allowfullscreen="" 
                                        loading="lazy" 
                                        referrerpolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </span>

                                <span v-else-if="message_item.contents.type=='card'">
                                    <span>{{ message_item.contents.text }} </span>
                                    <v-row class="ma-0 mt-1">
                                        <v-btn disabled v-for="(button, index) in message_item.contents.buttons" v-bind:key="index" class="elevation-0 mt-1" style="min-width: 100%;" small>{{ button.text }}</v-btn>
                                    </v-row>
                                </span>

                                <span v-else-if="message_item.contents.type=='button'">
                                    <span>{{ message_item.contents.body }} </span>
                                    <v-row class="ma-0 mt-1">
                                        <v-btn disabled v-for="(button, index) in message_item.contents.buttons" v-bind:key="index" class="elevation-0 mt-1" style="min-width: 100%;" small>{{ button.title }}</v-btn>
                                    </v-row>
                                </span>

                                <!-- Fecha y Hora -->
                                <span :style="message_item.direction === 'OUT' ? 'position:absolute!important; right:50px!important;': ''">
                                    <!-- Hour -->
                                    <span :style="message_item.direction === 'OUT' ? 'margin-left: 5px; bottom:-10px;': 'margin-left: 10px; bottom:2px;'" class="chat__timestamp">{{message_item.meessage_datetime.slice(11,16)}}</span>
                                    <!-- Seen -->
                                    <v-icon style="margin-bottom:-10px;" v-if="message_item.statuses!=undefined && message_item.direction === 'OUT' && message_item.statuses[message_item.statuses.length-1]!=undefined && message_item.statuses[message_item.statuses.length-1].code == 'CLOCK'" x-small color="grey" class="chat__checkmark">mdi-clock-outline</v-icon>
                                    <v-icon style="margin-bottom:-10px;" v-if="message_item.statuses!=undefined && message_item.direction === 'OUT' && message_item.statuses[message_item.statuses.length-1]!=undefined && message_item.statuses[message_item.statuses.length-1].code == 'SENT'" x-small color="grey" class="chat__checkmark">mdi-check</v-icon>
                                    <v-icon style="margin-bottom:-10px;" v-if="message_item.statuses!=undefined && message_item.direction === 'OUT' && message_item.statuses[message_item.statuses.length-1]!=undefined && message_item.statuses[message_item.statuses.length-1].code == 'DELIVERED'" x-small color="grey" class="chat__checkmark">mdi-check-all</v-icon>
                                    <v-icon style="margin-bottom:-10px;" v-if="message_item.statuses!=undefined && message_item.direction === 'OUT' && message_item.statuses[message_item.statuses.length-1]!=undefined && message_item.statuses[message_item.statuses.length-1].code == 'READ'" x-small color="primary" class="chat__checkmark">mdi-check-all</v-icon>
                                    <v-icon style="margin-bottom:-10px;" v-if="message_item.statuses!=undefined && message_item.direction === 'OUT' && message_item.statuses[message_item.statuses.length-1]!=undefined && message_item.statuses[message_item.statuses.length-1].code == 'REJECTED'" x-small color="red" class="chat__checkmark">mdi-alert-circle-outline</v-icon>
                                </span>
                            </p>

                        </div>
                    </div>

                    <div v-else style="height:calc(100vh - 290px); padding-top:25vh; background-image: linear-gradient(45deg, rgb(0 0 0 / 30%), rgb(0 0 0 / 30%));" ref="container">
                        <div style="text-align:center; color:white; font-weight:600;">
                            <v-dialog v-model="dialogPlantilla" width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    Este cliente aun no tiene una conversación
                                    <a style="color:white; background:#1976d2; font-size:14px; font-weight:500; border-radius:5px; padding:5px 10px;" @click="getTemplates()" v-bind="attrs" v-on="on">Envía un mensaje de plantilla</a> 
                                    y espera una respuesta para iniciar una conversación.
                                </template>
                                <v-card class="pt-2 pb-6">
                                    <v-card-title>
                                        Selecciona la plantilla a enviar
                                    </v-card-title>

                                    <v-progress-linear indeterminate rounded height="3" v-if="load_templates" style="width:90%; margin:auto;"></v-progress-linear>
                                    <v-row class="ma-0 px-4" v-else>
                                        <v-chip class="ma-1" v-for="template in templates" :key="template.id" @click="selectedTemplate = template" :color="templateColor(template.id)">
                                            {{template.name}}
                                        </v-chip>
                                    </v-row>

                                    <v-card-text class="mt-4" style="color:black;" v-if="selectedTemplate!=''">
                                        {{selectedTemplate.components.body.text.replace('clientName', client.name).replace('currentUserName', currentUser.name).replace(/[{}]+/g, '')}}
                                    </v-card-text>

                                    <v-card-title>
                                        Confirma el numero
                                    </v-card-title>
                                    
                                    <v-card-subtitle style="font-size:18px; line-height:40px;" v-if="!editPhone">{{client.phone}} <v-icon class="ml-2" v-if="editPhone==false" @click="editPhone=true" small>mdi-pencil</v-icon></v-card-subtitle>
                                    <v-text-field class="mx-6" v-else v-model="client.phone"  type="number" @click:append="savePhone()" append-icon="mdi-content-save" label="Teléfono" placeholder="Teléfono" outlined></v-text-field>
                                    
                                    <v-card-actions>
                                        <v-spacer/>
                                            <v-btn :disabled="selectedTemplate==''" class="elevation-0" color="primary" @click="startConversation()">Comenzar Conversación</v-btn>
                                        <v-spacer/>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>
                    </div>

                    <!-- Type Message-->
                    <v-row  v-if="conversation!=undefined" style="background:#f0f0f0; width:100%;" class="px-6 py-3 type ma-0">
                        <v-text-field 
                        v-if="expiration" 
                        full-width 
                        rows="1" 
                        no-resize
                        auto-grow 
                        v-model="message" 
                        filled 
                        rounded 
                        dense 
                        single-line 
                        hide-details 
                        label="Escribe un mensaje aquí" 
                        color="#919191" 
                        @keydown.enter="sendMessage()" 
                        prepend-icon="mdi-attachment" 
                        @click:prepend="fileDialog = true" 
                        append-outer-icon="mdi-send"
                        @click:append-outer="sendMessage()" 
                        ></v-text-field>
                        <div v-else style="text-align:center;">
                            Han pasado más de 24 horas de la utlima vez que el cliente envio un mensaje. 
                            <a style="color:white; background:#1976d2; font-size:14px; font-weight:500; border-radius:5px; padding:5px 10px;" @click="sendTemplateMessage()">Envía un mensaje de plantilla</a> 
                            y espera una respuesta para continuar con la conversación.
                        </div>
                    </v-row>
                    <v-dialog v-model="fileDialog" width="600">
                        <v-card class="pa-6">
                            <vue-dropzone 
                            ref="myVueDropzone" 
                            id="dropzone" 
                            :options="dropzoneOptions" 
                            v-on:vdropzone-success="uploadSuccess" 
                            v-on:vdropzone-error="uploadError" 
                            v-on:vdropzone-removed-file="fileRemoved"/>
                                <v-row class="ma-0">
                                    <v-spacer/>
                                    <v-btn class="mt-4 elevation-0" small color="primary" @click="sendImage()" :disabled="disableButtonFileSend">Enviar</v-btn>
                                </v-row>
                        </v-card>
                    </v-dialog>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>

import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from "axios";
import EmojiPicker from "vue-emoji-picker";
export default {
    data() {
        return {
            newPhase:'',
            load_templates:true,
            templates:[],
            dialogPlantilla:false,
            editPhone:false,
            imageDilog:false,
            disableButtonFileSend: true,
            fileDialog:false,
            messages:[],
            message:'',
            page:1,
            dropzoneOptions: {
                url: process.env.VUE_APP_BACKEND + "api/v1/message/upload-file",
                addRemoveLinks: true,
                maxFiles: 1,
                thumbnailWidth: 400,
                maxFilesize: 5,
                dictDefaultMessage: 'Haz clic aquí o arrastra tu imagen/archivo a subir.',
                dictFallbackMessage: "Tu navegador no puede subir archivos arrastarndolos a la pantalla.",
                dictFileTooBig: "El tamaño del arfchivo ({{filesize}}MB) supera el tamaño máximo permitido {{maxFilesize}}MB.",
                dictInvalidFileType: "No puede cargar archivos de este tipo.",
                dictCancelUpload: "Cancelar carga",
                dictCancelUploadConfirmation: "Estás seguro de que deseas cancelar esta carga?",
                dictRemoveFile: "Eliminar",
                dictMaxFilesExceeded: "No puedes subir más archivos.",
            },
            file:'',
            fileLink:'',
            fileMimeType:'',
            fileName:'',
            conversation:undefined,
            selectedTemplate:''
        }
    },
    computed:{
        buttonDisabled(){
            if(this.newPhase == this.client.funnel_phase.id){
                return true
            }else{
                return false
            }
        },
        phases(){
            return this.$store.state.funnel.phases.filter(phase=>phase.funnel_id == 3)
        },
        currentUser(){
            return this.$store.state.currentUser.user
        },
        expiration(){
            if(this.conversation!=undefined && this.conversation.channel == 'whatsapp' && this.conversation.latest_session_message_time!=null){
                var fechaInicio = new Date(this.conversation.latest_session_message_time).getTime();
                var fechaFin = new Date().getTime();
                var diff = (fechaFin - fechaInicio)/(1000*60*60);
                if(diff>24){
                    return false
                }else{
                    return true
                }
            }else if(this.conversation!=undefined && this.conversation.latest_session_message_time!=null){
                return true
            }else{
                return false
            }
        },
    },
    components: {
        EmojiPicker,
        vueDropzone: vue2Dropzone
    }, 
    props:{
        client:Object
    }, 
    created(){
        this.newPhase = this.client.funnel_phase.id*1
        axios.get(process.env.VUE_APP_BACKEND + "api/v1/conversations?filter[client_id]=" + this.client.id).then(response=>{
            this.conversation = response.data.data[0]
            this.scroll()
        })        
    },
    mounted() {
        Echo.channel('new_message').listen('NewMessageEvent', (e) => {
            console.log(e)
            var new_message = {}
            new_message = e[0]

            if(this.conversation!=undefined){
                this.conversation.latest_session_message_time = new_message.created_at
            }
            

            if(new_message.direction=='OUT'){
                var channelId = new_message.to
            }else if(new_message.direction=='IN'){
                var channelId = new_message.from
            }
            var index = this.messages.indexOf(new_message)
            if(new_message.direction=='IN' && channelId==this.conversation.channelId && index<0){
                this.messages.push(new_message)
                this.$nextTick(() => {
                    this.scroll()
                })
            }
        })
        Echo.channel('new_message_status_event').listen('NewMessageStatusEvent', (e) => {
            
        })
    },
    methods:{
        savePhone(){
            axios.patch(process.env.VUE_APP_BACKEND + "api/v1/clients/"+this.client.id, {phone:this.client.phone}).then(resp=>{
                editPhone = false
            })
            
        },
        saveFunelAndFace(){
            axios.patch(process.env.VUE_APP_BACKEND + "api/v1/clients/"+this.client.id, {funnel_phase_id:this.newPhase.toString()})
        },
        templateColor(template_id){
            if(this.selectedTemplate.id == template_id){
                return 'primary'
            }
        },
        getTemplates(){
            axios({
                method: "GET",
                url: "https://api.zenvia.com/v2/templates",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": process.env.VUE_APP_ZENVIA_X_API_TOKEN,
                },
                data: {
                    channel: 'WHATSAPP',
                    senderId: process.env.VUE_APP_ZENVIA_WHATSAPP_SERVER,
                    status: 'APPROVED'
                },
            }).then(response=>{
                this.load_templates = false
                this.templates = response.data.filter(temp=>!temp.name.includes('Seguimiento'))
            })
        },
        startConversation(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/conversations", {client_name:this.client.name, client_id:this.client.id, channel:'whatsapp', zenviaChannelId: process.env.VUE_APP_ZENVIA_WHATSAPP_SERVER, channelId: '521'+(this.client.phone*1)}).then(response=>{
                const conversation = response.data
                axios({
                    method: "POST",
                    url: "https://api.zenvia.com/v2/channels/whatsapp/messages",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-TOKEN": process.env.VUE_APP_ZENVIA_X_API_TOKEN,
                    },
                    data: {
                        from:process.env.VUE_APP_ZENVIA_WHATSAPP_SERVER,
                        to:'521'+(this.client.phone*1),
                        contents:[{
                            type:"template",
                            templateId:this.selectedTemplate.id,
                            fields:{
                                currentUserName:this.currentUser.name
                            }
                        }],
                    },
                }).then(resp => {
                    var messageInput = {
                        conversation_id: conversation.id,
                        user_id: this.currentUser.id,
                        contents:{
                            type:"template",
                            templateId:this.selectedTemplate,
                            fields:{
                                currentUserName:this.currentUser.name
                            },
                            text:this.selectedTemplate.text.replace('clientName', this.client.name).replace('currentUserName', this.currentUser.name).replace(/[{}]+/g, '')
                        },
                        channel: 'whatsapp',
                        uuid:resp.data.id,
                        from:resp.data.from,
                        to:resp.data.to,
                        direction:'OUT',
                        statuses:[{code:'SENT'}],
                        zenvia_timestamp: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                        created_at: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                        meessage_datetime: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                    }
                    axios.post(process.env.VUE_APP_BACKEND + "api/v1/messages", messageInput).then(r=>{
                        this.conversation = conversation
                    })
                })
            })     
        },
        imageMargin(direction){
            if(direction == 'OUT'){
                return 'margin-right:-10px;'
            }else if(direction == 'IN'){
                return 'margin-right:-30px;'
            }
        },
        downloadWithAxios(url) {
            axios({
                method: 'get',
                url,
                responseType: 'arraybuffer',
            }).then((response) => {
                this.forceFileDownload(response, 'UNOCRM_INETN_FILE_'+new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)+'_'+new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(11, 19)+'.jpg')
            }).catch(() => console.log('error occured'))
        },
        forceFileDownload(response, title) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', title)
            document.body.appendChild(link)
            link.click()
        },
        dateFormat(date){
            if(date!=undefined){
                // Creamos el objeto fecha instanciándolo con la clase Date
                const fecha = new Date(date.slice(0,10));
                // Creamos array con los días de la semana
                const dias_semana = ['Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                //Creamos constante para el dia de hoy
                const hoy = new Date(new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10))
                //sacamos diferencia
                const difference = (Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))/(1000*60*60*24)
                if((difference)<7){
                    if(difference==0){
                        return 'Hoy'
                    }else if(difference==1){
                        return 'Ayer'
                    }else{
                        return dias_semana[fecha.getDay()]
                    }
                }else{
                    // Creamos array con los meses del año
                    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                    // Construimos el formato de salida
                    if(fecha.getUTCFullYear()!=new Date().getUTCFullYear()){
                        return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()];
                    }else{
                        return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
                    }
                }
            }
        },
        scroll() {
            this.messages !== null &&
            this.messages !== undefined
            ? this.scrollToEnd()
            : null;
        },
        sendImage(){
            var messageInput = {
                conversation_id: this.conversation.id,
                user_id: this.currentUser.id,
                contents:{
                    type: "file",
                    fileUrl: this.fileLink,
                    fileMimeType: this.fileMimeType,
                    fileName: this.fileName
                },
                channel: this.conversation.channel,
                uuid:'',
                from:'',
                to:'',
                direction:'OUT',
                statuses:[{code:'CLOCK'}],
                zenvia_timestamp: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                created_at: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                meessage_datetime: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
            }
            this.messages.push(messageInput)
            if(this.conversation.channel == 'whatsapp'){
                var server = this.conversation.zenviaChannelId
            }else if(this.conversation.channel == 'facebook'){
                var server = process.env.VUE_APP_ZENVIA_FACEBOOK_SERVER
            }
            else if(this.conversation.channel == 'instagram'){
                var server = process.env.VUE_APP_ZENVIA_INSTAGRAM_SERVER
            }
            if(this.fileMimeType!='png'&&this.fileMimeType!='jpg'&&this.fileMimeType!='jpeg'){
                var zenvia_contents = [{
                    type: "file",
                    fileUrl: this.fileLink,
                    fileMimeType: this.fileMimeType,
                    fileName: this.fileName
                }]
            }else{
                {
                    var zenvia_contents = [{
                        type: "file",
                        fileUrl: this.fileLink
                    }]
                }
            }
            axios({
                method: "POST",
                url: "https://api.zenvia.com/v2/channels/" + this.conversation.channel + "/messages",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": process.env.VUE_APP_ZENVIA_X_API_TOKEN,
                },
                data: {
                    from:server,
                    to:this.conversation.channelId,
                    contents:zenvia_contents
                },
            }).then(response => {
                messageInput.statuses[0].code = 'SENT'
                messageInput.uuid = response.data.id,
                messageInput.from = response.data.from,
                messageInput.to = response.data.to,
                axios.post(process.env.VUE_APP_BACKEND + "api/v1/messages",Object.assign(messageInput)).then(response=>{
                    this.messages[this.messages.length-1] = messageInput
                    this.scroll()
                    this.$refs.myVueDropzone.removeFile(this.file)
                    this.fileDialog = false
                })
            })
        },
        sendMessage(){
            
            if(this.message!=''){
                var message = this.message
                this.message = ''
                var messageInput = {
                    conversation_id: this.conversation.id,
                    user_id: this.currentUser.id,
                    contents:{
                        type: "text",
                        text: message
                    },
                    channel: this.conversation.channel,
                    uuid:'',
                    from:'',
                    to:'',
                    direction:'OUT',
                    statuses:[{code:'CLOCK'}],
                    zenvia_timestamp: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                    created_at: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                    meessage_datetime: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                }
                this.messages.push(messageInput)
                if(this.conversation.channel == 'whatsapp'){
                    var server = this.conversation.zenviaChannelId
                }else if(this.conversation.channel == 'facebook'){
                    var server = process.env.VUE_APP_ZENVIA_FACEBOOK_SERVER
                }
                else if(this.conversation.channel == 'instagram'){
                    var server = process.env.VUE_APP_ZENVIA_INSTAGRAM_SERVER
                }
                axios({
                    method: "POST",
                    url: "https://api.zenvia.com/v2/channels/" + this.conversation.channel + "/messages",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-TOKEN": process.env.VUE_APP_ZENVIA_X_API_TOKEN,
                    },
                    data: {
                        from:server,
                        to:this.conversation.channelId,
                        contents:[{
                            type:"text",
                            text:message
                        }]
                    },
                }).then(response => {
                    messageInput.statuses[0].code = 'SENT'
                    messageInput.uuid = response.data.id,
                    messageInput.from = response.data.from,
                    messageInput.to = response.data.to,
                    axios.post(process.env.VUE_APP_BACKEND + "api/v1/messages",Object.assign(messageInput)).then(response=>{
                        this.messages[this.messages.length-1] = messageInput
                        this.scroll()
                    })
                })
            }else{
                //console.log(new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),)
            }
        },
        sendTemplateMessage(){
            if(this.conversation.zenviaChannelId == "5218185263303"){
                var zenviaTemplateId = "21fecd7d-2375-4e91-b8c1-fa3ae19b9f35"
            }else if(this.conversation.zenviaChannelId == "5218137058408"){
                var zenviaTemplateId = "e73c0b4a-191e-4fec-b636-f6461b147ffe"
            }
            var messageInput = {
                conversation_id: this.conversation.id,
                user_id: this.currentUser.id,
                contents:{
                    type:"template",
                    templateId:zenviaTemplateId,
                    fields:{
                        clientName:this.conversation.client_name,
                        currentUserName:this.currentUser.name
                    },
                    text:this.conversation.client_name + ", soy " + this.currentUser.name + " de Grupo Inten. Te confirmo que cargamos tu información. Podemos hablar por aquí en cualquier momento.¿Recibiste correctamente este mensaje?"
                },
                channel: this.conversation.channel,
                uuid:'',
                from:'',
                to:'',
                direction:'OUT',
                statuses:[{code:'CLOCK'}],
                zenvia_timestamp: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                created_at: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                meessage_datetime: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
            }
            this.messages.push(messageInput)
            if(this.conversation.channel == 'whatsapp'){
                var server = this.conversation.zenviaChannelId
            }else if(this.conversation.channel == 'facebook'){
                var server = process.env.VUE_APP_ZENVIA_FACEBOOK_SERVER
            }
            else if(this.conversation.channel == 'instagram'){
                var server = process.env.VUE_APP_ZENVIA_INSTAGRAM_SERVER
            }
            axios({
                method: "POST",
                url: "https://api.zenvia.com/v2/channels/" + this.conversation.channel + "/messages",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": process.env.VUE_APP_ZENVIA_X_API_TOKEN,
                },
                data: {
                    from:server,
                    to:this.conversation.channelId,
                    contents:[{
                        type:"template",
                        templateId:"0654aff4-1345-4fa3-934f-b5bde198c653",
                        fields:{
                            clientName:this.conversation.client_name,
                            currentUserName:this.currentUser.name
                        }
                    }],
                },
            }).then(response => {
                messageInput.statuses[0].code = 'SENT'
                messageInput.uuid = response.data.id,
                messageInput.from = response.data.from,
                messageInput.to = response.data.to,
                axios.post(process.env.VUE_APP_BACKEND + "api/v1/messages",Object.assign(messageInput)).then(response=>{
                    this.messages[this.messages.length-1] = messageInput
                    this.scroll()
                })
            })
        },
        getMessages($state) {
            axios.get(process.env.VUE_APP_BACKEND + "api/v1/messages?filter[conversation_id]=" + this.conversation.id + "&page=" + this.page)
            .then(response=>{
                if (response.data.data.length) {
                    var messages = response.data.data.sort(function(a,b){
                        return new Date(a.created_at) - new Date(b.created_at);
                    });
                    if(this.page == 1){
                        this.messages = messages
                    }else{
                        this.messages = this.messages.concat(messages).sort(function(a,b){
                            return new Date(a.created_at) - new Date(b.created_at);
                        });
                    }
                    $state.loaded();
                    this.page += 1;
                } else {
                    $state.complete();
                }
            })
        },
        checkPadding(direction){
            if(direction=='OUT'){
                return '20px!important; min-width:80px!important; min-height:40px!important; padding-bottom:12px!important;'
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
        uploadSuccess(file, response) {
            this.file = file
            console.log('File Successfully Uploaded with file name: ' + response.file);
            this.fileLink = process.env.VUE_APP_BACKEND + 'zenvia-files/' + response.file;
            this.fileMimeType = response.extension
            this.fileName = response.fileName
            this.disableButtonFileSend = false;
        },
        uploadError(file, message) {
            console.log('An Error Occurred');
        },
        fileRemoved(file) {
            this.$refs.myVueDropzone.removeFile(file)
            this.file = ''
            this.fileLink = ''
            this.fileMimeType = ''
            this.fileName = ''
        },
    },

}
</script>
<style>
    .dz-error-message {
        margin-left: 250px!important;
        margin-top: -70px!important;
    }
    .chat__timestamp {
        font-size: xx-small;
        position:absolute;
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
            max-height: 62vh!important;
            min-height: 5vh!important;
        }
        .altocel{
            height:calc(100vh - 60px - 56px)!important;
        }
        .altocel2{
            height:calc(100vh - 56px)!important;
        }
    }
    /*
    .space .theme--light.v-input input, .theme--light.v-input textarea {
        padding: 15px 20px;
    }
    .v-input__slot{
        margin-bottom: 0px!important;
    }
    */
</style>