<template>
    <div style="height:60vh;" class="chat__body pl-7 pr-10 pt-5 pb-0" ref="container" v-boserve-visibility="handleScrolledToTop">
        <div class="sticky">
            Scrolled to bottom: {{ scrolledToBottom }}
        </div>
        <!-- Message -->
        <p v-for="(message, index) in messages" :key="index" :class="message.direction === 'OUT' ? 'chat__sender chat__message'
            : 'chat__reciever chat__message'" :style="{'padding-right':checkPadding(message.direction),}"> {{ message.contents.text }}  
            <!-- Hour -->
            <span class="chat__timestamp">{{new Date(message.zenvia_timestamp).getHours()}}:{{new Date(message.zenvia_timestamp).getMinutes()}}</span>
            <!-- Seen -->
            <!--v-icon v-if="message.direction === 'OUT'" x-small :color="seenColor(message.messageId)" class="chat__checkmark">{{seen(message.messageId)}}</v-icon-->
        </p>
    </div>
</template>

<script>
export default {
    props:{
        messages:Array
    },
    data() {
        return {
            scrolledToBottom: false
        }
    },
    updated() {
        this.messages !== null &&
        this.messages !== undefined
        ? this.scrollToEnd()
        : null;
    },
    methods:{
        handleScroll: function(e) {
            if ((e.target.scrollHeight-300) <= e.target.scrollTop) {
                alert('oi sou Eduardo Martins');
            }
        },
        seen(messageId){
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
        seenColor(messageId){
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
        checkPadding(direction){
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
    }
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
    /*
    .space .theme--light.v-input input, .theme--light.v-input textarea {
        padding: 15px 20px;
    }
    .v-input__slot{
        margin-bottom: 0px!important;
    }
    */
    .sticky {
        position: sticky;
        top: 0;
    }
</style>