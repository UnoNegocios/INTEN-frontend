<template>
    <v-card class="ma-0" v-if="propData.lead!=undefined">
        <v-toolbar class="pl-3 pr-6" color="#ededed" elevation="0" style="border-bottom:solid #ccd2d4 2px;">
            <v-list-item-avatar size="30" color="#ccd2d4">
                <v-img v-if="lead.conversation!=undefined && lead.conversation.client_picture!=null" :src="lead.conversation.client_picture"></v-img>
                <span style="text-transform: uppercase; text-align: center; width: 30px;" class="white--text text-h6" v-else><strong>{{lead.name.slice(0,1)}}</strong></span>
            </v-list-item-avatar>
            <div v-if="lead.name!=undefined">
                <span>{{lead.name}} {{lead.last}}</span> 
            </div>
            <v-spacer></v-spacer>
            <v-row class="my-0" style="transform:scale(0.8); margin-right: -8%;">
                <v-select style="width:80px;" class="mt-1" :items="funnels" rounded outlined dense v-model="newFunnel" small item-text="name" item-value="id"></v-select>
                <v-select style="width:80px;" class="mt-1 mx-4" :items="phases" rounded outlined dense v-model="newPhase" small item-text="name" item-value="id"></v-select>
                <v-btn rounded color="primary" :disabled="buttonDisabled" @click="saveFunelAndFace()" class="elevation-0 mt-1">MOVER</v-btn>
            </v-row>
            <!--v-btn icon>
                <v-icon color="#919191">mdi-magnify</v-icon>
            </v-btn-->
        </v-toolbar>
        <v-row class="ma-0">
            <v-col md=9 class="pa-0" style="border-right:solid #ccd2d4 2px;">
                <!--v-toolbar class="px-2" color="white" elevation="0">
                    // :input="changePhase()"<v-select outlined dense class="mr-2" :items="funnel_phases" v-model="lead.funnel_phase.id" item-text="name" item-value="id" style="width:25%;"></v-select>
                    <v-select outlined dense class="mr-2" v-if="lead.user!=null" v-model="lead.user.id" :items="users" item-text="name" item-value="id" style="width:25%;">
                        <template v-slot:selection="{ item }">
                            <v-avatar size="32px" class="mr-4">
                                <img :src="item.profile_photo_url">
                            </v-avatar>
                            <span>{{item.name}} {{item.last}}</span>
                        </template>
                        <template v-slot:item="{ item }">
                            <v-avatar size="32px" class="mr-4">
                                <img :src="item.profile_photo_url">
                            </v-avatar>
                            <span>{{item.name}} {{item.last}}</span>
                        </template>
                    </v-select>
                    <v-spacer></v-spacer>
                </v-toolbar-->
                <div  style="border-top:solid #ccd2d4 1px; background-color: white; background-repeat: repeat; background-size: 412.5px 749.25px; background-image: linear-gradient(120deg,rgb(229 221 213 / 90%) 60%,rgb(229 221 213 / 90%) 60%),url(https://unocrm.mx/wp-content/uploads/2021/07/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png)!important;">
                    <div style="height:72vh;" class="chat__body pl-7 pr-10 py-0" ref="container">
                        <infinite-loading direction="top" @infinite="getMessages"></infinite-loading>
                        <!-- Message -->
                        <div v-for="(message_item, index) in messages" :key="index">
                            <v-row class="ma-0 mb-2">
                                <v-spacer></v-spacer>
                                <v-chip small style="font-weight:500;" color="#f0f0f0" class="elevation-1" light v-if="(index>=1 && message_item.zenvia_timestamp.slice(0,10)!=messages[index-1].zenvia_timestamp.slice(0,10)) || index==0">
                                    {{dateFormat(message_item.zenvia_timestamp)}}
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

                                <video style="height: 60px; width: 300px!important; transform: scale(.8); margin: -16px -39px; filter: brightness(1.1);" v-else-if="message_item.contents.type=='file' && message_item.contents.fileMimeType=='audio/ogg'" controls="" :autoplay="false" name="media">
                                    <source src="https://chat.zenvia.com/storage/files/0a7e6096fb7a42c242b146f04498d59b6b437fafa613bc27b1f1d9bcfcf8bd05.bin" type="audio/ogg">
                                </video>

                                <video style="margin-right:-30px; margin-bottom:5px; max-width:400px; max-height:400px; object-fit:cover;" controls v-if="message_item.contents.fileMimeType=='video/mp4'||message_item.contents.fileMimeType=='mp4'||message_item.contents.fileMimeType=='mov'">
                                    <source :src="message_item.contents.fileUrl" type="video/mp4"/>
                                </video>

                                <span v-if="message_item.contents.type=='card'">
                                    <span>{{ message_item.contents.text }} </span>
                                    <v-row class="ma-0 mt-1">
                                        <v-btn disabled v-for="(button, index) in message_item.contents.buttons" v-bind:key="index" class="elevation-0 mt-1" style="min-width: 100%;" small>{{ button.text }}</v-btn>
                                    </v-row>
                                </span>

                                <span v-if="message_item.contents.type=='button'">
                                    <span>{{ message_item.contents.body }} </span>
                                    <v-row class="ma-0 mt-1">
                                        <v-btn disabled v-for="(button, index) in message_item.contents.buttons" v-bind:key="index" class="elevation-0 mt-1" style="min-width: 100%;" small>{{ button.title }}</v-btn>
                                    </v-row>
                                </span>

                                    <span :style="message_item.direction === 'OUT' ? 'position:absolute!important; right:50px!important;': ''">
                                        <!-- Hour -->
                                        <span :style="message_item.direction === 'OUT' ? 'margin-left: 5px; bottom:-10px;': 'margin-left: 10px; bottom:2px;'" class="chat__timestamp">{{new Date(message_item.zenvia_timestamp).toLocaleTimeString('it-IT', {hour: '2-digit', minute: '2-digit',})}}</span>
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
                    <!-- Type Message-->
                    <v-row style="background:#f0f0f0; width:100%;" class="px-6 py-3 type ma-0">
                        <v-text-field 
                        v-if="expiration(lead.conversation.channel, lead.conversation.latest_session_message_time)" 
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
                        @keydown.enter="sendMessage" 
                        prepend-icon="mdi-attachment" 
                        @click:prepend="fileDialog = true" 
                        append-outer-icon="mdi-send"
                        @click:append-outer="sendMessage()" 
                        ></v-text-field><!-- prepend-icon="mdi-attachment"  -->
                        <!--v-btn small style="margin:6.3px;" class="mr-0" v-else-if="!recording" icon @click="recordAudio"><v-icon>mdi-microphone</v-icon></v-btn>
                        <v-btn small style="margin:6.3px;" class="mr-0" v-else icon @click="stop()"><v-icon> mdi-stop-circle-outline </v-icon></v-btn-->
                        <div v-else style="text-align:center;">
                            Han pasado más de 24 horas de la utlima vez que el cliente envio un mensaje. 
                            <a style="color:white; background:#1976d2; font-size:14px; font-weight:500; border-radius:5px; padding:5px 10px;" @click="sendTemplateMessage()">Envía un mensaje de plantilla</a> 
                            y espera una respuesta para continuar con la conversación.
                            
                        </div>
                    </v-row>
                    <div id="audio" class="audio" controls></div>
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
            <v-col md="3" class="pa-0">
                <leadDetail v-bind:lead="lead"/>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>

//import InfiniteLoading from 'vue-infinite-loading';
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import leadDetail from '../leads/detail.vue'
import axios from "axios";
import EmojiPicker from "vue-emoji-picker";
export default {
    data() {
        return {
            interests:['plug', 'movil', 'mifi'],
            lead_interest:'',
            imageDilog:false,
            disableButtonFileSend: true,
            fileDialog:false,
            newFunnel:'',
            newPhase:'',
            client:{
                contract_date:'',
                delivery_time:'',
                user_id:'',
                origin_id:'',
                status_id:'',
                name:'',
                address:'',
                phone:'',
                email:'',
                rfc:'',
                razon_social:'',
                payment_method_id:'',
                payment_conditions:'',
                opportunity_area:'',
                consumptions:'',
                delivery_address:'',
                contact_medium:'',
                special_note:'',
                cfdi:'',
                bank_account_number:'',
                created_by_user_id:'',
                last_updated_by_user_id:''
            },
            tab:null,
            messages:[],
            asociarDialog:false,
            message:'',
            lead:'',
            funnel_phases:'',
            editInterest:false,
            editPhone:false,
            editEmail:false,
            page:1,
            pause:'no',
            recorder: null,
            chunks: [],
            device: null,
            blobObj: null,
            recording:false,
            pauseChange:true,
            dropzoneOptions: {
                url: "https://unowipes.com/api/v1/message/upload-file",
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
            fileMimeType:''
        }
    },
    computed:{
        funnels(){
            return this.$store.state.funnel.funnels
        },
        users(){
            return this.$store.state.user.users
        },
        currentUser(){
            return this.$store.state.currentUser.user
        },
        phases(){
            return this.$store.state.funnel.phases.filter(phase=>phase.funnel_id == this.newFunnel).filter(phase=>phase.id>0)
        },
        buttonDisabled(){
            if(this.newFunnel == this.lead.funnel_phase.funnel.id && this.newPhase == this.lead.funnel_phase.id){
                return true
            }else{
                return false
            }
        }
    },
    components: {
        EmojiPicker,
        'leadDetail':leadDetail,
        vueDropzone: vue2Dropzone
    }, 
    props:{
        propData:Object
    }, 
    created(){
        if(this.lead.additional_data!=null){
            this.lead_interest = this.lead.additional_data.interest
        }
        this.lead = this.propData.lead
        this.newPhase = this.lead.funnel_phase.id*1
        this.newFunnel = this.lead.funnel_phase.funnel.id*1
        this.funnel_phases = this.propData.funnel_phases
        if(this.propData.lead.conversation!=undefined){
            this.messages.push(this.propData.lead.conversation.latest_message)
        }
        this.scroll()
    },
    mounted() {
        
        Echo.channel('new_message').listen('NewMessageEvent', (e) => {
            var new_message = {}
            new_message = e[0]
            this.lead.conversation.latest_session_message_time = new_message.created_at

            if(new_message.direction=='OUT'){
                var channelId = new_message.to
            }else if(new_message.direction=='IN'){
                var channelId = new_message.from
            }

            if(channelId==this.lead.conversation.channelId){
                this.messages.push(new_message)
                this.$nextTick(() => {
                    this.scroll()
                })
            }
        })
        Echo.channel('new_message_status_event').listen('NewMessageStatusEvent', (e) => {
            console.log(e)
            console.log('perro')
        })
    },
    methods:{
        imageMargin(direction){
            if(direction == 'OUT'){
                return 'margin-right:-10px;'
            }else if(direction == 'IN'){
                return 'margin-right:-30px;'
            }
        },
        expiration(channel, date){
            console.log(channel)
            console.log(date)
            if(channel == 'whatsapp'){
                var fechaInicio = new Date(date).getTime();
                var fechaFin = new Date().getTime();
                var diff = (fechaFin - fechaInicio)/(1000*60*60);
                if(diff>24){
                    return false
                }else{
                    return true
                }
            }else{
                return true
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
        saveFunelAndFace(){
            axios.patch("https://unowipes.com/api/v1/leads/"+this.lead.id, {funnel_phase_id:this.newPhase.toString()})
        },
        convertToClient(){

        },
        recordAudio() {
            this.recording = true
            this.device = navigator.mediaDevices.getUserMedia({ audio: true });
            this.device.then((stream) => {
                this.recorder = new MediaRecorder(stream);
                this.recorder.ondataavailable = (e) => {
                    this.chunks.push(e.data);
                    if (this.recorder.state === "inactive") {
                        var audio = document.getElementById("audio");
                        var mainaudio = document.createElement("audio");
                        mainaudio.setAttribute("controls", "controls");
                        audio.appendChild(mainaudio);
                        var url = URL.createObjectURL(new Blob(this.chunks, { type: "audio/wav" }))
                        mainaudio.innerHTML = '<source src="' + url.slice(5,url.length) + '" type="audio/wav" />';
                        //console.log(url.slice(5,url.length))
                        this.chunks = [];
                        this.blobObj = null;
                    }
                };
                this.recorder.start();
            });
        },
        stop() {
            this.recording = false
            this.recorder.stop();
        },
        callback (data) {
            console.debug(data)
        },
        dateFormat(date){
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
        },
        scroll() {
            this.messages !== null &&
            this.messages !== undefined
            ? this.scrollToEnd()
            : null;
        },
        save(){
            var editedItem = {
                id: this.lead.id,
                additional_data:{interest: this.lead_interest},
                phone: this.lead.phone,
                email: this.lead.email
            }
            axios.patch("https://unowipes.com/api/v1/leads",Object.assign(editedItem)).then(response=>{
                this.editInterest = false
                this.lead_interest = ''
                this.editPhone = false
                this.editEmail = false
            })
        },
        sendImage(){
            var messageInput = {
                conversation_id: this.propData.lead.conversation.id,
                user_id: this.currentUser.id,
                contents:{
                    type: "file",
                    fileUrl: this.fileLink,
                    fileMimeType: this.fileMimeType
                },
                channel: this.propData.lead.conversation.channel,
                uuid:'',
                from:'',
                to:'',
                direction:'OUT',
                statuses:[{code:'CLOCK'}],
                zenvia_timestamp: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
            }
            this.messages.push(messageInput)
            if(this.propData.lead.conversation.channel == 'whatsapp'){
                var server = this.propData.lead.conversation.zenviaChannelId
            }else if(this.propData.lead.conversation.channel == 'facebook'){
                var server = process.env.VUE_APP_ZENVIA_FACEBOOK_SERVER
            }
            else if(this.propData.lead.conversation.channel == 'instagram'){
                var server = process.env.VUE_APP_ZENVIA_INSTAGRAM_SERVER
            }
            axios({
                method: "POST",
                url: "https://api.zenvia.com/v2/channels/" + this.propData.lead.conversation.channel + "/messages",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": process.env.VUE_APP_ZENVIA_X_API_TOKEN,
                },
                data: {
                    from:server,
                    to:this.propData.lead.conversation.channelId,
                    contents:[{
                        type: "file",
                        fileUrl: this.fileLink
                    }]
                },
            }).then(response => {
                messageInput.statuses[0].code = 'SENT'
                messageInput.uuid = response.data.id,
                messageInput.from = response.data.from,
                messageInput.to = response.data.to,
                axios.post("https://unowipes.com/api/v1/messages",Object.assign(messageInput)).then(response=>{
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
                    conversation_id: this.propData.lead.conversation.id,
                    user_id: this.currentUser.id,
                    contents:{
                        type: "text",
                        text: message
                    },
                    channel: this.propData.lead.conversation.channel,
                    uuid:'',
                    from:'',
                    to:'',
                    direction:'OUT',
                    statuses:[{code:'CLOCK'}],
                    zenvia_timestamp: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
                }
                this.messages.push(messageInput)
                if(this.propData.lead.conversation.channel == 'whatsapp'){
                    var server = this.propData.lead.conversation.zenviaChannelId
                }else if(this.propData.lead.conversation.channel == 'facebook'){
                    var server = process.env.VUE_APP_ZENVIA_FACEBOOK_SERVER
                }
                else if(this.propData.lead.conversation.channel == 'instagram'){
                    var server = process.env.VUE_APP_ZENVIA_INSTAGRAM_SERVER
                }
                axios({
                    method: "POST",
                    url: "https://api.zenvia.com/v2/channels/" + this.propData.lead.conversation.channel + "/messages",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-TOKEN": process.env.VUE_APP_ZENVIA_X_API_TOKEN,
                    },
                    data: {
                        from:server,
                        to:this.propData.lead.conversation.channelId,
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
                    axios.post("https://unowipes.com/api/v1/messages",Object.assign(messageInput)).then(response=>{
                        this.messages[this.messages.length-1] = messageInput
                        this.scroll()
                    })
                })
            }else{
                
            }
        },
        sendTemplateMessage(){
            var messageInput = {
                conversation_id: this.propData.lead.conversation.id,
                user_id: this.currentUser.id,
                contents:{
                    type:"template",
                    templateId:"21fecd7d-2375-4e91-b8c1-fa3ae19b9f35",
                    fields:{
                        clientName:this.propData.lead.name,
                        currentUserName:this.currentUser.name
                    },
                    text:this.propData.lead.name + ", soy " + this.currentUser.name + " de Grupo Inten. Te confirmo que cargamos tu información. Podemos hablar por aquí en cualquier momento.¿Recibiste correctamente este mensaje?"
                },
                channel: this.propData.lead.conversation.channel,
                uuid:'',
                from:'',
                to:'',
                direction:'OUT',
                statuses:[{code:'CLOCK'}],
                zenvia_timestamp: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}),
            }
            this.messages.push(messageInput)
            if(this.propData.lead.conversation.channel == 'whatsapp'){
                var server = this.propData.lead.conversation.zenviaChannelId
            }else if(this.propData.lead.conversation.channel == 'facebook'){
                var server = process.env.VUE_APP_ZENVIA_FACEBOOK_SERVER
            }
            else if(this.propData.lead.conversation.channel == 'instagram'){
                var server = process.env.VUE_APP_ZENVIA_INSTAGRAM_SERVER
            }
            axios({
                method: "POST",
                url: "https://api.zenvia.com/v2/channels/" + this.propData.lead.conversation.channel + "/messages",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": process.env.VUE_APP_ZENVIA_X_API_TOKEN,
                },
                data: {
                    from:server,
                    to:this.propData.lead.conversation.channelId,
                    contents:[{
                        type:"template",
                        templateId:"0654aff4-1345-4fa3-934f-b5bde198c653",
                        fields:{
                            clientName:this.propData.lead.name,
                            currentUserName:this.currentUser.name
                        }
                    }],
                },
            }).then(response => {
                messageInput.statuses[0].code = 'SENT'
                messageInput.uuid = response.data.id,
                messageInput.from = response.data.from,
                messageInput.to = response.data.to,
                axios.post("https://unowipes.com/api/v1/messages",Object.assign(messageInput)).then(response=>{
                    this.messages[this.messages.length-1] = messageInput
                    this.scroll()
                })
            })
        },
        getMessages($state) {
            axios.get("https://unowipes.com/api/v1/messages?filter[conversation_id]=" + this.propData.lead.conversation.id + "&page=" + this.page)
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
            this.fileLink = 'https://unowipes.com/zenvia-files/' + response.file;
            this.fileMimeType = response.extension
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
            max-height: 5vh!important;
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