<template>
    <v-card class="ma-0" v-if="propData.lead!=undefined">
        <v-toolbar class="pl-3 pr-6" color="#ededed" dark elevation="0" style="border-bottom:solid #ccd2d4 2px;">

            <v-list-item-avatar size="30" color="#ccd2d4">
                <span style="text-transform: uppercase; text-align: center; width: 30px;" class="white--text text-h6"><strong>{{lead.name.slice(0,1)}}</strong></span>
            </v-list-item-avatar>

            <div v-if="lead.name!=undefined">
                <span style="color:black;">{{lead.name}} {{lead.last}}</span> 
            </div>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon color="#919191">mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon color="#919191">mdi-dots-vertical</v-icon>
            </v-btn>
        </v-toolbar>

        <v-row class="ma-0">
            <v-col md="8" class="pa-0" style="border-right:solid #ccd2d4 2px;">
                <v-toolbar class="px-2" color="white" elevation="0">
                    <v-select :input="changePhase()" outlined dense class="mr-2" :items="funnel_phases" v-model="lead.funnel_phase.id" item-text="name" item-value="id" style="width:25%;"></v-select>

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

                    <!--v-select label="Status" outlined dense class="mr-2" style="width:25%;">
                        <template v-slot:selection="{ item }">
                            <v-icon :color="item.color">mdi-square-rounded</v-icon>
                            <span>{{item.name}}</span>
                        </template>
                        <template v-slot:item="{ item }">
                            <v-icon :color="item.color">mdi-square-rounded</v-icon>
                            <span>{{item.name}}</span>
                        </template>
                    </v-select-->

                    <v-spacer></v-spacer>
                    <div>
                        <!--v-btn icon small><v-icon>mdi-close</v-icon></v-btn>
                        <v-btn icon small class="mx-2"><v-icon>mdi-close</v-icon></v-btn>
                        <v-btn icon small><v-icon>mdi-close</v-icon></v-btn-->
                        <v-btn class="elevation-0" small color="primary">Convertir en Cliente</v-btn>
                    </div>
                </v-toolbar>
                <div style="border-top:solid #ccd2d4 1px; background-color: white; background-repeat: repeat; background-size: 412.5px 749.25px; background-image: linear-gradient(120deg,rgb(229 221 213 / 90%) 60%,rgb(229 221 213 / 90%) 60%),url(https://unocrm.mx/wp-content/uploads/2021/07/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png)!important;">
                    <div style="height:70vh;" class="chat__body pl-7 pr-10 pt-5 pb-0" ref="container">
                        <!-- Message -->
                        <div v-for="(message_item, index) in conversation(lead.additional_data.conversation)" :key="index">
                            <p :class="message_item.includes('asesor: ') ? 'chat__sender chat__message': 'chat__reciever chat__message'" :style="{'padding-right':checkPadding(message_item),}"> 
                                <span>{{ message_item.replaceAll('cliente: ','').replaceAll('asesor: ','') }} </span>
                            </p>
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col md="4" class="pa-0">
                <leadDetail v-bind:lead="lead"/>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>

//import InfiniteLoading from 'vue-infinite-loading';
import axios from "axios";
import EmojiPicker from "vue-emoji-picker";
import leadDetail from '../dashboard/detail.vue'
export default {
    data() {
        return {
            scrolledToBottom: false,
            tab:null,
            asociarDialog:false,
            lead:'',
            funnel_phases:'',
            editInterest:false,
            editPhone:false,
            editEmail:false,
            page:1,
            pause:'no',
            pauseChange:true
        }
    },
    updated() {
        this.conversation(lead.additional_data.conversation) !== null &&
        this.conversation(lead.additional_data.conversation) !== undefined
        ? this.scrollToEnd()
        : null;
    },
    computed:{
        users(){
            return this.$store.state.user.users
        },
        currentUser(){
            return this.$store.state.currentUser.user
        },
    },
    components: {
        EmojiPicker,
        //InfiniteLoading
        'leadDetail':leadDetail
    }, 
    props:{
        propData:Object
    }, 
    created(){
        this.lead = this.propData.lead
        this.funnel_phases = this.propData.funnel_phases
        this.scroll
    },
    beforeUpdate(){
        if(this.propData.lead!=undefined && this.pause=='no'){
            this.lead = this.propData.lead
            this.funnel_phases = this.propData.funnel_phases
            this.scroll
            this.pause='si'
        }else if(this.propData.lead==undefined){
            this.tab=null,
            this.asociarDialog=false,
            this.lead='',
            this.funnel_phases='',
            this.editInterest=false,
            this.editPhone=false,
            this.editEmail=false,
            this.page=1
            this.pause='no'
        }
    },
    methods:{
        changePhase(){
            if(!this.pauseChange){
                axios.patch("https://unowipes.com/api/v1/leads/"+this.lead.id, {funnel_phase_id:this.lead.funnel_phase.id}).then(response=>{
                    this.$emit("refresh", true);
                })
            }
            this.pauseChange = false
        },
        conversation(conversation){
            return conversation.replaceAll('cliente: ','∞cliente: ').replaceAll('asesor: ','∞asesor: ').split('∞')
        },
        dateFormat(date){
            // Creamos el objeto fecha instanciándolo con la clase Date
            const fecha = new Date(date.slice(0,10));
            // Creamos array con los días de la semana
            const dias_semana = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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
                interest: this.lead.interest,
                phone: this.lead.phone,
                email: this.lead.email
            }
            axios.patch("https://unowipes.com/api/v1/leads",Object.assign(editedItem)).then(response=>{
                this.editInterest = false
                this.editPhone = false
                this.editEmail = false
            })
        },
        checkPadding(direction){
            if(direction.includes('asesor: ')){
                return '15px!important'
            }else if(direction.includes('cliente: ')){
                return '10px!important'
            }
        },
        scrollToEnd() {
            const content = this.$refs.container;
            if(content!=undefined){
                content.scrollTop = content.scrollHeight;
            }
        },
    },

}
</script>
<style>
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
</style>