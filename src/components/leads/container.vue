<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filter" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <v-container class="ma-0 pa-0 pb-8">
                <div class="pt-6 px-8 pb-6">
                    <v-row class="ma-0 mb-2">
                        <strong>Filtros</strong>
                        <v-spacer></v-spacer>
                        <v-btn @click="removeFilter()" small class="elevation-0" style="border:solid 1px #dddddd;">
                            <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
                        </v-btn>
                        <v-btn class="hidden-md-and-up elevation-0 ml-4" @click="close()" small>
                            <v-icon class="mr-1">mdi-close</v-icon>
                        </v-btn>
                    </v-row>

                    <v-autocomplete v-model="filters.user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Vendedor(es)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>

                    <v-menu offset-y :close-on-content-click="closeDatePicker(filters.created_at)">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field  clearable  v-model="filters.created_at" label="Fecha" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="filters.created_at" range></v-date-picker>
                    </v-menu>

                    <v-text-field v-model="filters.phone" label="Teléfono"></v-text-field>
                    <v-text-field v-model="filters.email" label="Email"></v-text-field>

                </div>
                <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary">
                    <v-list-item link @click="buscar=true, filter = false" dark>
                        <v-list-item-content>
                            <strong>Filtrar (0)</strong>
                        </v-list-item-content>
                    </v-list-item>    
                </v-card>
            </v-container>
        </v-navigation-drawer>

        <v-dialog v-model="filterMobile" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-container class="ma-0 pa-0 pb-8">
                <div class="pt-6 px-8 pb-6" style="background:white!important; width:100vw!important; height:calc(100vh - 40px);">
                    <v-row class="ma-0 mb-2">
                        <strong>Filtros</strong>
                        <v-spacer></v-spacer>
                        <v-btn @click="removeFilter()" small class="elevation-0" style="border:solid 1px #dddddd;">
                            <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
                        </v-btn>
                        <v-btn class="elevation-0 ml-4" @click="filterMobile=false" small>
                            <v-icon class="mr-1">mdi-close</v-icon>
                        </v-btn>
                    </v-row>

                    <v-autocomplete v-model="filters.user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Vendedor(es)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>

                    <v-menu offset-y :close-on-content-click="closeDatePicker(filters.created_at)">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field  clearable  v-model="filters.created_at" label="Fecha" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="filters.created_at" range></v-date-picker>
                    </v-menu>

                    <v-text-field v-model="filters.phone" label="Teléfono"></v-text-field>
                    <v-text-field v-model="filters.email" label="Email"></v-text-field>

                </div>
                <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary">
                    <v-list-item link @click="buscar=true, filter = false, filterMobile = false" dark>
                        <v-list-item-content>
                            <strong>Filtrar (0)</strong>
                        </v-list-item-content>
                    </v-list-item>    
                </v-card>
            </v-container>
        </v-dialog>

        <div class="py-4 px-12">
            <v-row class="ma-0">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-row class="ma-0">
                            <span v-bind="attrs" v-on="on" style="font-size:21px;"> 
                                🧠 {{funnel.name}}
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                                    </template>
                                    <span>{{funnel.description}}</span>
                                </v-tooltip>
                            </span>
                            <v-btn class="elevation-0 ml-10" color="white" @click="editFunnelDialog=true">Editar Funnel</v-btn>
                        </v-row>
                    </template>
                    <v-list>
                        <v-list-item v-for="(item, index) in funnels" :key="index">
                            <v-tooltip right>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item-title v-bind="attrs" v-on="on" @click="selectFunel(item)">{{ item.name }}</v-list-item-title>
                                </template>
                                <span>{{item.description}}</span>
                            </v-tooltip>
                        </v-list-item>
                        <v-list-item>
                            <v-btn class="elevation-0" small rounded color="primary" @click="createFunnelDialog=true">Agregar Funnel</v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
                
                
                <v-spacer/>
                <v-text-field class="pt-0 mt-0 pb-0 mr-4 buscador" append-icon="mdi-magnify" style="background:white;" @keydown.enter="buscar = true" dense outlined color="white" v-model="search" placeholder="Buscar por Nombre"></v-text-field>
                
                <v-btn icon @click="openFilter()">
                    <v-icon>mdi-filter</v-icon>
                </v-btn>
                <v-btn class="ml-3" @click="only_unread_messages=!only_unread_messages" icon>
                    <v-icon :color="unreadColor">mdi-filter-variant</v-icon>
                </v-btn>
            </v-row>

            <v-card-title v-if="only_unread_messages" class="ml-3 mb-0 pb-0" color="primary" style="font-size:18px; font-weight:400; margin-top:-10px;">FILTRADO POR NO LEIDOS</v-card-title>

            <v-progress-linear v-if="load_funnel_phases" color="primary" class="mt-4" indeterminate rounded height="6"></v-progress-linear>
            <div v-else>
                <vue-horizontal class="ma-6 mt-3">
                    <v-card style="width:20%; margin:15px; background:transparent;" v-for="(funnel_phase, index) in funnel_phases" v-bind:key="index" class="elevation-0 ma-1 item">
                        <v-card-title class="py-1 px-3" :style="'border-bottom: 2px ' + funnel.color + ' solid; font-size:15px;' + 'background:white;'">
                            {{funnel_phase.name}}
                            <v-spacer/>
                            <v-icon small>mdi-message-processing</v-icon> <span class="ml-2">{{leads[index].data.length}}</span><span v-if="leads[index].data.length>0&&((leads[index].data.length%50)==0)">+</span>
                        </v-card-title>
                        <div>
                            <div class="text-center py-6" v-if="leads[index].load_leads">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </div>
                            <draggable :disabled="index<1" id="scroll" v-else @end="changeLeadOfFunnelPhase" :list="leads[index].data" :class="'funnel_phase_id: '+funnel_phase.id" draggable=".item" group="a" :scroll-sensitivity="scrollSensitivity">
                                
                                
                                
                                
                                <div @click="openConversation(element)" v-for="element in leads[index].data" :key="element.id" class="list-group-item item">
                                    <v-tooltip right>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-list-item :class="'mt-2 pl-0 pr-4 elevation-0 ' + mbCondition(element.user)" style="background:white; min-height: 60px;">
                                            
                                           

                                                <v-badge class="icon_style" avatar bordered overlap style="z-index:9!important;">
                                                    <template v-slot:badge>
                                                        <v-avatar v-if="element.conversation!=undefined">
                                                            <v-img v-if="element.conversation.channel == 'whatsapp' " src="https://unocrm.mx/wp-content/uploads/2021/08/whatsapp-icon-seeklogo.com_.svg"></v-img>
                                                            <v-img v-else-if="element.conversation.channel == 'facebook' " src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg"></v-img>
                                                            <v-img v-else-if="element.conversation.channel == 'instagram' " src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"></v-img>
                                                            <v-img v-else-if="element.conversation.channel == 'cliengo' " src="/hand_cliengo.svg"></v-img>
                                                        </v-avatar>
                                                    </template>
                                                    <v-list-item-avatar size="35" color="#ccd2d4" v-bind="attrs" v-on="on">
                                                        <v-img v-if="element.conversation!=undefined && element.conversation.client_picture!=null" :src="element.conversation.client_picture"></v-img>
                                                        <span style="text-transform: uppercase; text-align: center; width: 35px;" class="white--text text-h6" v-else><strong>{{element.name.slice(0,1)}}</strong></span>
                                                    </v-list-item-avatar>
                                                </v-badge>

                                                
                                                <v-list-item-content  v-bind="attrs" v-on="on" style="display: block;">
                                                    <v-list-item-title style="font-size:15px;">
                                                        <div style="font-weight:500;" v-if="element.conversation!=undefined && element.conversation.unread_messages>0">
                                                            {{element.name}} <span v-if="element.last!=null">{{element.last}}</span>
                                                        </div>
                                                        <div v-else>{{element.name}} <span v-if="element.last!=null">{{element.last}}</span></div>
                                                    </v-list-item-title>
                                                    <div style="font-size:12px;" v-if="element.conversation!=undefined && element.conversation!=undefined && element.conversation.latest_message!=null && element.conversation.latest_message.contents.text!=undefined">
                                                        <div style="font-weight:600;" v-if="element.conversation.unread_messages>0">{{element.conversation.latest_message.contents.text.slice(0,45)}}<span v-if="element.conversation.latest_message.contents.text!=undefined && element.conversation.latest_message.contents.text.length>45">...</span></div>
                                                        <div v-else>{{element.conversation.latest_message.contents.text.slice(0,45)}}<span v-if="element.conversation.latest_message.contents.text!=undefined && element.conversation.latest_message.contents.text.length>45">...</span></div>
                                                    </div>
                                                    <div style="font-size:12px;" v-else-if="element.conversation!=undefined && element.conversation!=undefined && element.conversation.latest_message!=null && element.conversation.latest_message.contents.body!=undefined">
                                                        <div style="font-weight:600;" v-if="element.conversation.unread_messages>0">{{element.conversation.latest_message.contents.body.slice(0,45)}}<span v-if="element.conversation.latest_message.contents.text!=undefined && element.conversation.latest_message.contents.text.length>45">...</span></div>
                                                        <div v-else>{{element.conversation.latest_message.contents.body.slice(0,45)}}<span v-if="element.conversation.latest_message.contents.body.length>45">...</span></div>
                                                    </div>
                                                    <div v-else-if="element.conversation!=undefined && element.conversation.latest_message.contents.type=='file'" style="font-size:12px;">
                                                        <div style="font-weight:600;" v-if="element.conversation.unread_messages>0"><v-icon small>mdi-attachment</v-icon><span class="ml-1" style="line-height:19px;">Archivo Adjunto</span></div>
                                                        <div v-else><v-icon small>mdi-attachment</v-icon><span class="ml-1" style="line-height:19px;">Archivo Adjunto</span></div>
                                                    </div>
                                                    <v-list-item-subtitle v-else-if="element.conversation!=undefined && element.conversation.channel == 'cliengo'" style="font-size:12px;">{{element.additional_data.final_question}} </v-list-item-subtitle>
                                                </v-list-item-content>

                                                <v-badge v-bind="attrs" v-on="on" style="transform:scale(0.8); margin-top:-15px; margin-right:5px;" v-if="element.conversation!=undefined && element.conversation.unread_messages>0" :content="element.conversation.unread_messages"></v-badge>

                                            
                                    

                                                <v-row v-bind="attrs" v-on="on" v-if="element.user!=undefined" class="user-label ma-0 py-1 px-2">
                                                    <img v-if="element.additional_data!=null" style="height: 20px!important;" :src="'/logo_'+element.additional_data.interest+'.png'"/>
                                                    <v-spacer/>
                                                    <v-list-item-avatar size="20" class="ma-0" :color="element.user.color">
                                                        <span style="text-transform: uppercase; text-align: center; width: 20px; font-size:12px;" class="white--text"><strong>{{element.user.name.slice(0,1)}}<span v-if="element.user.last!=undefined">{{element.user.last.slice(0,1)}}</span></strong></span>
                                                    </v-list-item-avatar>
                                                </v-row>

                                            </v-list-item>
                                        </template>
                                        <span>{{element.last_message_user}}</span>
                                    </v-tooltip>
                                </div>

                                
                                <infinite-loading v-if="leads[index].data.length>0&&((leads[index].data.length%50)==0)" direction="bottom" :ref="'phase' + funnel_phase.id" @infinite="getMoreLeads(funnel_phase.id)">
                                    <span slot="no-results">
                                        <span class="your-customize-class"></span>
                                    </span>
                                </infinite-loading>
                                                        


                            </draggable>
                        </div>
                    </v-card>
                    <v-btn v-if="permissions('addFunnelPhase')" @click="createFunnelPhaseDialog=true" color="primary" fab class="elevation-0 my-auto ml-3" x-small><v-icon>mdi-plus</v-icon></v-btn>
                </vue-horizontal>
            </div>
            <v-dialog @click:outside="closeDialog" v-model="conversation_dialog" width="1250">
                <conversation v-if="propData.lead!=undefined && propData.lead.channel!='cliengo'" v-bind:propData="propData" @closeConversation="closeConversation"></conversation>
                <cliengo v-else-if="propData.lead!=undefined && propData.lead.channel=='cliengo'" v-bind:propData="propData"></cliengo>
                <v-card v-else>
                    <v-toolbar v-if="propData.lead!=undefined" class="pl-3 pr-6" color="#ededed" dark elevation="0" style="border-bottom:solid #ccd2d4 2px;">
                        <v-list-item-avatar size="30" color="#ccd2d4">
                            <span style="text-transform: uppercase; text-align: center; width: 30px;" class="white--text text-h6"><strong>{{propData.lead.name.slice(0,1)}}</strong></span>
                        </v-list-item-avatar>

                        <div v-if="propData.lead.name!=undefined">
                            <span style="color:black;">{{propData.lead.name}} {{propData.lead.last}}</span> 
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon color="#919191">mdi-dots-vertical</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <detail v-bind:lead="propData.lead"></detail>
                </v-card>
            </v-dialog>
            <v-dialog v-model="createFunnelDialog" max-width="400px">
                <v-card class="pt-3 pb-6 px-8">
                    <div>
                        <v-text-field label="Nombre del Funnel" v-model="created_funnel.name"></v-text-field>
                        <v-textarea label="Descripción" v-model="created_funnel.description"></v-textarea>
                        <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-chip class="ma-2 mt-0" :color="created_funnel.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color Calendario</v-chip>
                            </template>
                            <v-color-picker v-model="created_funnel.color" class="ma-2"></v-color-picker>
                        </v-menu> 
                    </div>
                    <v-row class="ma-0 mt-2">
                        <v-spacer></v-spacer>
                        <v-btn class="elevation-0" text color="grey" @click="closeFunnelDialog()">Cancelar</v-btn>
                        <v-btn class="elevation-0" text color="primary" @click="saveFunnel()">Guardar</v-btn>
                    </v-row>
                </v-card>
            </v-dialog>
            <v-dialog v-model="createDialog" max-width="700px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                    <v-icon color="white">  mdi-plus </v-icon>
                </v-btn> 
            </template>
            <create @closeCreateDialogLead="closeCreateDialogLead"/>
            </v-dialog>

            <v-dialog v-model="editFunnelDialog" max-width="850px">
                <v-row class="px-8 py-4 ma-0" style="background:white;">

                    <v-col cols="6">
                        <div>
                            <v-text-field label="Nombre del Funnel" v-model="funnel.name"></v-text-field>
                            <v-textarea label="Descripción" v-model="funnel.description"></v-textarea>
                            <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                <template v-slot:activator="{ on }">
                                    <v-chip class="ma-2 mt-0" :color="funnel.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color</v-chip>
                                </template>
                                <v-color-picker v-model="funnel.color" class="ma-2"></v-color-picker>
                            </v-menu> 
                        </div>
                        <v-row class="ma-0 mt-2">
                            <v-spacer></v-spacer>
                            <v-btn class="elevation-0" text color="grey" @click="closeFunnelDialog()">Cancelar</v-btn>
                            <v-btn class="elevation-0" text color="primary" @click="saveEditedFunnel()">Guardar</v-btn>
                        </v-row>
                    </v-col>

                    <v-col cols="6">
                        <div style="background:#f4f5fa; max-height:40vh!important; min-height:40vh!important;" class="pa-4 mb-3">
                            <strong>Orden de las Fases</strong>

                            <draggable style="overflow-y:scroll!important; height:230px!important;" class="mt-3" @end="changeFunnelPhaseOrder" :list="funnel_phases" draggable=".item" group="a" :scroll-sensitivity="900">
                                <v-card style="margin:15px; background:transparent;" v-for="(funnel_phase, index) in funnel_phases" v-bind:key="index" :disabled="index==0" class="elevation-0 ma-1 item">
                                    <v-card-title class="py-1 px-3" :style="'border-bottom: 2px ' + funnel.color + ' solid; font-size:15px;' + 'background:white;'">
                                        {{funnel_phase.name}}
                                        <v-spacer/>
                                        <v-icon small>mdi-message-processing</v-icon> <span class="ml-2">{{leads[index].data.length}}</span>
                                    </v-card-title>
                                </v-card>
                            </draggable>
                            
                        </div>
                    </v-col>

                </v-row>
            </v-dialog>

            <v-dialog v-model="createFunnelPhaseDialog" max-width="600px">
                <v-card class="pt-3 pb-6 px-8">
                    <div>
                        <v-text-field label="Nombre del Funnel Phase" v-model="created_funnel_phase.name"></v-text-field>
                        <v-textarea label="Descripción" v-model="created_funnel_phase.description"></v-textarea>
                    </div>
                    <v-row class="ma-0 mt-2">
                        <v-spacer></v-spacer>
                        <v-btn class="elevation-0" text color="grey" @click="closeFunnelPhaseDialog()">Cancelar</v-btn>
                        <v-btn class="elevation-0" text color="primary" @click="saveFunnelPhase()">Guardar</v-btn>
                    </v-row>
                </v-card>
            </v-dialog>
        </div>  
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>


        <v-snackbars
            :messages.sync="notifications"
            color="white"
            :timeout="-1"
            bottom
            right
        >
            <template v-slot:default="{ message }">
                <v-list-item @click="openConversation(message)" class="list-group-item item mt-0 pl-0 pr-4 elevation-0 mb-5" style="background:white; min-height: 60px;">
                    <v-badge class="icon_style" avatar bordered overlap style="z-index:9!important;">
                        <template v-slot:badge>
                            <v-avatar v-if="message.conversation!=undefined">
                                <v-img v-if="message.conversation.channel == 'whatsapp' " src="https://unocrm.mx/wp-content/uploads/2021/08/whatsapp-icon-seeklogo.com_.svg"></v-img>
                                <v-img v-else-if="message.conversation.channel == 'facebook' " src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg"></v-img>
                                <v-img v-else-if="message.conversation.channel == 'instagram' " src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"></v-img>
                                <v-img v-else-if="message.conversation.channel == 'cliengo' " src="/hand_cliengo.svg"></v-img>
                            </v-avatar>
                        </template>
                        <v-list-item-avatar size="35" color="#ccd2d4">
                            <v-img v-if="message.conversation!=undefined && message.conversation.client_picture!=null" :src="message.conversation.client_picture"></v-img>
                            <span style="text-transform: uppercase; text-align: center; width: 35px;" class="white--text text-h6" v-else><strong>{{message.name.slice(0,1)}}</strong></span>
                        </v-list-item-avatar>
                    </v-badge>

                    
                    <v-list-item-content  style="display: block; color:black!important;">
                        <v-list-item-title style="font-size:15px;">
                            <div style="font-weight:500;" v-if="message.conversation!=undefined && message.conversation.unread_messages>0">
                                {{message.name}} <span v-if="message.last!=null">{{message.last}}</span>
                            </div>
                            <div v-else>{{message.name}} <span v-if="message.last!=null">{{message.last}}</span></div>
                        </v-list-item-title>
                        <div style="font-size:12px;" v-if="message.conversation!=undefined && message.conversation!=undefined && message.conversation.latest_message!=null && message.conversation.latest_message.contents.text!=undefined">
                            <div style="font-weight:600;" v-if="message.conversation.unread_messages>0">{{message.conversation.latest_message.contents.text.slice(0,45)}}<span v-if="message.conversation.latest_message.contents.text!=undefined && message.conversation.latest_message.contents.text.length>45">...</span></div>
                            <div v-else>{{message.conversation.latest_message.contents.text.slice(0,45)}}<span v-if="message.conversation.latest_message.contents.text!=undefined && message.conversation.latest_message.contents.text.length>45">...</span></div>
                        </div>
                        <div style="font-size:12px;" v-else-if="message.conversation!=undefined && message.conversation!=undefined && message.conversation.latest_message!=null && message.conversation.latest_message.contents.body!=undefined">
                            <div style="font-weight:600;" v-if="message.conversation.unread_messages>0">{{message.conversation.latest_message.contents.body.slice(0,45)}}<span v-if="message.conversation.latest_message.contents.text!=undefined && message.conversation.latest_message.contents.text.length>45">...</span></div>
                            <div v-else>{{message.conversation.latest_message.contents.body.slice(0,45)}}<span v-if="message.conversation.latest_message.contents.body.length>45">...</span></div>
                        </div>
                        <div v-else-if="message.conversation!=undefined && message.conversation.latest_message.contents.type=='file'" style="font-size:12px;">
                            <div style="font-weight:600;" v-if="message.conversation.unread_messages>0"><v-icon small>mdi-attachment</v-icon><span class="ml-1" style="line-height:19px;">Archivo Adjunto</span></div>
                            <div v-else><v-icon small>mdi-attachment</v-icon><span class="ml-1" style="line-height:19px;">Archivo Adjunto</span></div>
                        </div>
                        <v-list-item-subtitle v-else-if="message.conversation!=undefined && message.conversation.channel == 'cliengo'" style="font-size:12px;">{{message.additional_data.final_question}} </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-badge class="notification-badge" style="transform:scale(0.8); margin-top:-15px; margin-right:5px;" v-if="message.conversation!=undefined && message.conversation.unread_messages>0" :content="message.conversation.unread_messages"></v-badge>
                    
                    <v-row v-if="message.user!=undefined" class="user-label ma-0 py-1 px-2">
                        <img v-if="message.additional_data!=null" style="height: 20px!important;" :src="'/logo_'+message.additional_data.interest+'.png'"/>
                        <v-spacer/>
                        <v-list-item-avatar size="20" class="ma-0" :color="message.user.color">
                            <span style="text-transform: uppercase; text-align: center; width: 20px; font-size:12px;" class="white--text"><strong>{{message.user.name.slice(0,1)}}<span v-if="message.user.last!=undefined">{{message.user.last.slice(0,1)}}</span></strong></span>
                        </v-list-item-avatar>
                    </v-row>
                </v-list-item>
            </template>

            <template v-slot:action="{ close }">
                <v-btn icon text @click="close()"><v-icon small color="black">mdi-close</v-icon></v-btn>
            </template>

        </v-snackbars>


    </v-container>
</template>

<script>
import VSnackbars from "v-snackbars";
import axios from 'axios'
import draggable from 'vuedraggable'
import VueHorizontal from 'vue-horizontal';
import Conversation from '../leads/conversation.vue'
import Cliengo from '../leads/cliengo.vue'
import CreateLead from '../leads/create.vue'
import Detail from '../leads/detail.vue'
export default {
    components: {
        draggable,
        VueHorizontal,
        'conversation':Conversation,
        'cliengo':Cliengo,
        'create':CreateLead,
        'detail': Detail,
        "v-snackbars": VSnackbars,
    },
    data() {
        return {
            notifications:[],
            only_unread_messages:false,
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            leads_links:[{link:'', phase_id:''}],
            filter:false,
            filterMobile:false,
            filters:{
                user_id:'',
                created_at:[],
                id:'',
                phone:'',
                email:''
            },
            buscar:false,
            search:'',
            pause:false,
            funnel:{
                name:'',
                id:''
            },
            created_funnel_phase:{
                days: null,
                description: null,
                name: '',
                time: null,
                funnel_id: ''
            },
            funnel_phases:[],
            load_funnel_phases:true,
            leads:[],
            conversation_dialog:false,
            createFunnelPhaseDialog:false,
            editFunnelDialog:false,
            createFunnelDialog:false,
            createDialog:false,
            propData:{},
            created_funnel:{
                name:'',
                description:'',
                color:'grey'
            },
        };
    },
    created(){
        if(this.$route.params.lead_id!=undefined){
            this.filters.id = this.$route.params.lead_id
        }
        this.$emit("closeDrawer", false);
        this.getFunnelPhasesFromApi()
        this.$store.dispatch('funnel/getPhases')
    },
    computed:{
        unreadColor(){
            if(this.only_unread_messages){
                return 'primary'
            }else{
                return 'grey'
            }
        },
        funnels(){
            var funnels = this.$store.state.funnel.funnels
            if(funnels.length>0){
                this.funnel = funnels[0]
            }
            return funnels
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        userList(){
            return this.$store.state.user.users.map(id => {
                return{
                    id:id.id,
                    name:id.name + id.last,
                }
            })
        },
    },
    mounted() {   
        
        Echo.channel('new_message_status').listen('IncomingMessageRead', (e) => {
            console.log(e)
        })   

        Echo.channel('lead_change').listen('LeadChangeEvent', (e) => {
            if(!this.pause){
                let lead_id = e[0].id//correcto
                let index_phase = this.funnel_phases.indexOf(this.funnel_phases.filter(phase=>phase.id == e[0].funnel_phase.id)[0])//correcto
                let index_lead = this.leads.indexOf(this.leads.filter(lead=>lead.data.filter(dta=>dta.id == lead_id).length>0)[0])//correcto
                let index_conversation = this.leads[index_lead].data.indexOf(this.leads[index_lead].data.filter(dta=>dta.id == lead_id)[0])
                this.leads[index_lead].data.splice(index_conversation, 1)
                if(e[0].user.id == this.currentUser.id || this.currentUser.job_position == 'Administración'){
                    this.leads[index_phase].data.unshift(e[0])
                }
            }else{
                this.pause = false
            }
        })
        Echo.channel('new_lead').listen('BroadcastNewLead', (e) => {
            if(this.funnel.name == 'Prospectos'){
                this.leads[0].data.unshift(e[0])
                new Audio('/mixkit-sci-fi-reject-notification-896.wav').play()
            }else{
                this.notifications.push(e)
            }
        })
        Echo.channel('new_message').listen('NewMessageEvent', (e) => {
            
            let new_message = e[0]
            if(new_message.direction=='OUT'){
                var channelId = new_message.to
            }else if(new_message.direction=='IN'){
                var channelId = new_message.from
            }
            let index_lead = this.leads.indexOf(this.leads.filter(lead=>lead.data.filter(dta=>this.checkmamadas(dta.conversation) == channelId).length>0)[0])
            if(index_lead<0){
                if(new_message.lead!=null){
                    axios.get(process.env.VUE_APP_BACKEND + "api/v1/leads?filter[phone]=" + channelId)
                    .then(resp=>{
                        const response = resp.data.data[0]
                        index_lead = this.leads.indexOf(this.leads.filter(lead=>lead.funnel_phase_id == resp.data.data[0].funnel_phase.id)[0])
                        if(index_lead>=0){
                            this.leads[index_lead].data.unshift(response)
                        }else if(response.funnel_phase.funnel.id != this.funnel.id){
                            this.addNotification(response)
                        }
                    })
                }else if(new_message.client!=null){
                    axios.get(process.env.VUE_APP_BACKEND + "api/v1/clients?filter[id]=" + new_message.client.id)// + '&sort=latest'
                    .then(resp=>{
                        const response = resp.data.data[0]
                        index_lead = this.leads.indexOf(this.leads.filter(lead=>lead.funnel_phase_id == resp.data.data[0].funnel_phase.id)[0])
                        if(index_lead>=0){
                            this.leads[index_lead].data.unshift(response)
                        }else if(response.funnel_phase.funnel.id != this.funnel.id){
                            this.addNotification(response)
                        }
                    })
                }
                
            }else{

                let conversation = this.leads[index_lead].data.filter(lead=>lead.conversation.channelId == channelId)[0]

                let index_conversation = this.leads[index_lead].data.indexOf(conversation)
                
                if(this.leads[index_lead].data.filter(lead=>lead.conversation.channelId == channelId)[0].conversation!=undefined){
                    this.leads[index_lead].data.filter(lead=>lead.conversation.channelId == channelId)
                    [0].conversation.latest_message = new_message
                }

                this.leads[index_lead].data.filter(lead=>lead.conversation.channelId == channelId)
                [0].conversation.latest_session_message_time = new_message.created_at

                this.leads[index_lead].data.filter(lead=>lead.conversation.channelId == channelId)
                [0].conversation.unread_messages = this.leads[index_lead].data.filter(lead=>lead.conversation.channelId == channelId)
                [0].conversation.unread_messages + 1

                this.leads[index_lead].data.splice(index_conversation, 1)
                this.leads[index_lead].data.unshift(conversation)
                /*
                if(resp.data.data[0].funnel_phase.funnel.id != this.funnel.id){
                    this.notifications.push(conversation)
                }
                */

            }

            new Audio('/mixkit-long-pop-2358.wav').play()
        })
    },
    watch: {
        notifications(newQuestion, oldQuestion){
            if(newQuestion.length>=oldQuestion.length){
                setTimeout(() => {
                    this.notifications.splice(0,1)
                }, "7000")
            }
        },
        only_unread_messages: {
            handler(){
                this.getFunnelPhasesFromApi()
            },deep: true
        },
        buscar: {
            handler () {
                this.getFunnelPhasesFromApi()
                this.buscar = false
            },
            deep: true,
        },
    },
    methods: {
        addNotification(response){
            var notification_index = this.notifications.indexOf(this.notifications.filter(notification=>notification.id == response.id)[0])
            if(notification_index>=0){
                this.notifications[notification_index].conversation = response.conversation

                setTimeout(() => {
                    notification_index = this.notifications.filter(notification=>notification.conversation==response.conversation)
                    if(notification_index>=0){
                        this.notifications.splice(notification_index,1)
                    }
                }, "7000")
                
            }else{
                this.notifications.push(response)
            }
        },
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
        getMoreLeads(phase) {
            var getLink = this.leads_links.filter(lead_link=>lead_link.phase_id == phase).map(lead_link=>lead_link.link)[0]
            var index_lead = this.leads.indexOf(this.leads.filter(lead=>lead.funnel_phase_id == phase)[0])
            var index_leads_links = this.leads_links.indexOf(this.leads_links.filter(lead_link=>lead_link.phase_id == phase)[0])

            if(getLink!=undefined){
                axios.get(getLink.replace('http://', 'https://')).then(response=>{
                    this.leads[index_lead].data = (JSON.parse(JSON.stringify(this.leads[index_lead].data))).concat(response.data.data)
                    this.leads_links[index_leads_links].link = response.data.links.next
                    this.$refs['phase' + phase][0].stateChanger.loaded();
                })
            }
            else{
                this.$refs['phase' + phase][0].stateChanger.complete();
            }
        },  
        checkmamadas(conversation){
            if(conversation!=null){
            return conversation.channelId
            }
        },
        mbCondition(element){
            if(element!=undefined){
                return 'mb-7'
            }
        },
        removeFilter(){
            this.filters={
                user_id:'',
                created_at:[]
            }
            this.filter = false
            this.getFunnelPhasesFromApi()
        },
        closeDatePicker(dates){
            if(dates!=undefined && dates.length==2){
                return true
            }else{
                return false
            }
        },
        scrollSensitivity(){
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return 400
            }else{
                return 200
            }
        },
        openFilter(){
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.filterMobile = true
            }else{
                if(this.filter){
                    this.$emit("closeDrawer", true);
                    this.filter = false
                }else{
                    this.$emit("closeDrawer", false);
                    this.filter = true
                }
            }
        },
        getFunnelPhasesFromApi(){
            this.load_funnel_phases = true
            this.funnel_phases = ''
            this.leads = []
            this.getFunnelPhases().then(data => {
                this.funnel_phases = data.items
                for(var i=0; i<this.funnel_phases.length; i++){
                    this.leads.push({
                        load_leads: true, data:[], funnel_phase_id: this.funnel_phases[i].id,
                    })
                    if(this.funnel.name == "Clientes"){
                        this.getClients(i)
                    }
                    if(this.funnel.name == "Prospectos"){
                        this.getLeads(i)
                    }
                }
                this.load_funnel_phases = false
            })
        },
        getFunnelPhases() {
            return new Promise((resolve, reject) => {
                var funnel_id = ''
                if(this.funnel.id!=''){
                    funnel_id = this.funnel.id
                }else{
                    funnel_id = 1
                }
                axios.get(process.env.VUE_APP_BACKEND + "api/v1/funnel_phases?filter[funnel_id]=" + funnel_id)
                .then(response=>{
                    var items = response.data
                    resolve({
                        items
                    })
                })
            })
        },
        closeCreateDialogLead: function(params) {
            this.leads.filter(funnel=>funnel.funnel_phase_id == params.funnel_phase_id)[0].data.push(params)
            this.createDialog = false
        },
        closeDialog(){
            this.propData = {'lead':undefined, 'funnel_phases':undefined, 'pause': 'no', 'reload': 'si'}
            this.conversation_dialog = false
        },
        openNotification(lead){
            //this.pause = true
            let index_lead = this.leads.indexOf(this.leads.filter(element=>element.data.filter(dta=>dta.id == lead.id).length>0)[0])
            if(lead.conversation.channel == 'whatsapp'){
                var server = lead.conversation.zenviaChannelId
            }else if(lead.conversation.channel == 'facebook'){
                var server = process.env.VUE_APP_ZENVIA_FACEBOOK_SERVER
            }
            else if(lead.conversation.channel == 'instagram'){
                var server = process.env.VUE_APP_ZENVIA_INSTAGRAM_SERVER
            }
            
            if((this.leads[index_lead].data.filter(b=>b.conversation.id == lead.conversation.id)[0].conversation.unread_messages>0)
            && this.leads[index_lead].data.filter(dta=>dta.conversation.id == lead.conversation.id).filter(dta=>dta.user == undefined).length>0){

                this.leads[index_lead].data.filter(dta=>dta.conversation.id == lead.conversation.id)[0].user = this.currentUser
                axios.post(process.env.VUE_APP_BACKEND + "api/v1/conversation/agent-first-interaction", {conversation_id:lead.conversation.id, user_id:this.currentUser.id, channel:lead.conversation.channel, sending_server:server, from:lead.conversation.channelId}).then(resp=>{
                    this.propData = {'lead':lead, 'funnel_phases':this.funnel_phases, 'pause': 'no', 'reload': 'no'}
                    this.conversation_dialog = true
                    this.leads[index_lead].data.filter(
                        b=>b.conversation.id == lead.conversation.id
                    )[0].conversation.unread_messages = 0
                    //this.pause = false
                }).catch(errors=>{
                    this.snackbar = {
                        message: errors.response.data.errors.message,
                        color: 'error',
                        show: true
                    }
                    this.getFunnelPhasesFromApi()
                })
            }else if((this.leads[index_lead].data.filter(b=>b.conversation.id == lead.conversation.id)[0].conversation.unread_messages>0)&&!this.permissions('dont_mark_messages_as_read')){
                axios.post(process.env.VUE_APP_BACKEND + "api/v1/conversation/mark_messages_as_read", {conversation_id:lead.conversation.id, user_id:this.currentUser.id}).then(resp=>{
                    this.propData = {'lead':lead, 'funnel_phases':this.funnel_phases, 'pause': 'no', 'reload': 'no'}
                    this.conversation_dialog = true
                    this.leads[index_lead].data.filter(
                        b=>b.conversation.id == lead.conversation.id
                    )[0].conversation.unread_messages = 0
                    //this.pause = false
                })
            }else{
                this.propData = {'lead':lead, 'funnel_phases':this.funnel_phases, 'pause': 'no', 'reload': 'no'}
                this.conversation_dialog = true
                //this.pause = false
            }
        },
        openConversation(lead){
            //this.pause = true
            let index_lead = this.leads.indexOf(this.leads.filter(element=>element.data.filter(dta=>dta.id == lead.id).length>0)[0])
            if(lead.conversation.channel == 'whatsapp'){
                var server = lead.conversation.zenviaChannelId
            }else if(lead.conversation.channel == 'facebook'){
                var server = process.env.VUE_APP_ZENVIA_FACEBOOK_SERVER
            }
            else if(lead.conversation.channel == 'instagram'){
                var server = process.env.VUE_APP_ZENVIA_INSTAGRAM_SERVER
            }
            
            if((this.leads[index_lead].data.filter(b=>b.conversation.id == lead.conversation.id)[0].conversation.unread_messages>0)
                && (this.leads[index_lead].data.filter(dta=>dta.conversation.id == lead.conversation.id).filter(dta=>dta.user == undefined).length>0)
                && (this.currentUser.id!=1&&this.currentUser.id!=2)){
                this.leads[index_lead].data.filter(dta=>dta.conversation.id == lead.conversation.id)[0].user = this.currentUser
                axios.post(process.env.VUE_APP_BACKEND + "api/v1/conversation/agent-first-interaction", {conversation_id:lead.conversation.id, user_id:this.currentUser.id, channel:lead.conversation.channel, sending_server:server, from:lead.conversation.channelId}).then(resp=>{
                    this.propData = {'lead':lead, 'funnel_phases':this.funnel_phases, 'pause': 'no', 'reload': 'no'}
                    this.conversation_dialog = true
                    this.leads[index_lead].data.filter(
                        b=>b.conversation.id == lead.conversation.id
                    )[0].conversation.unread_messages = 0
                    //this.pause = false
                }).catch(errors=>{
                    this.snackbar = {
                        message: errors.response.data.errors.message,
                        color: 'error',
                        show: true
                    }
                    this.getFunnelPhasesFromApi()
                })
            }else if((this.leads[index_lead].data.filter(b=>b.conversation.id == lead.conversation.id)[0].conversation.unread_messages>0)&&!this.permissions('dont_mark_messages_as_read')){
                axios.post(process.env.VUE_APP_BACKEND + "api/v1/conversation/mark_messages_as_read", {conversation_id:lead.conversation.id, user_id:this.currentUser.id}).then(resp=>{
                    this.propData = {'lead':lead, 'funnel_phases':this.funnel_phases, 'pause': 'no', 'reload': 'no'}
                    this.conversation_dialog = true
                    this.leads[index_lead].data.filter(
                        b=>b.conversation.id == lead.conversation.id
                    )[0].conversation.unread_messages = 0
                    //this.pause = false
                })
            }else{
                this.propData = {'lead':lead, 'funnel_phases':this.funnel_phases, 'pause': 'no', 'reload': 'no'}
                this.conversation_dialog = true
                //this.pause = false
            }
        },
        closeConversation: function(params) {
            this.lead = {}
            this.conversation_dialog = params
        },
        changeFunnelPhaseOrder: function (evt) {
            
        },
        changeLeadOfFunnelPhase: function (evt) {
            this.pause = true
            let funnel_phase_id = evt.from._prevClass
            let new_funnel_phase_id = evt.to._prevClass
            let element_id = evt.item._underlying_vm_.id
            if(funnel_phase_id!=new_funnel_phase_id){
                axios.patch(process.env.VUE_APP_BACKEND + "api/v1/leads/" + element_id, {funnel_phase_id: new_funnel_phase_id.slice(17,new_funnel_phase_id.length)}).then(response=>{})
            }
        },
        getClients(i) {
            this.leads_links = []
            var filter = ''
            /*
            if(this.filters.id!=''&&this.filters.id!=null){
                filter = '&filter[id]=' + this.filters.id
            }
            */
            if(this.search!=''&&this.search!=null){
                filter = filter + '&filter[name]=' + this.search
            }
            if(this.filters.user_id!=''&&this.filters.user_id!=null){
                filter = filter + '&filter[user_id]=' + this.filters.user_id
            }
            if(this.filters.created_at!=''&&this.filters.created_at!=null){
                filter = filter + '&filter[created_between]=' + this.filters.created_at
            }
            if(this.filters.phone!=''&&this.filters.phone!=null){
                filter = filter + '&filter[conversation.channelId]=' + this.filters.phone
            }
            if(this.filters.email!=''&&this.filters.email!=null){
                filter = filter + '&filter[email]=' + this.filters.email
            }
            if(this.only_unread_messages){
                filter = filter + '&filter[has_unread_messages]=1'
            }
            axios.get(process.env.VUE_APP_BACKEND + "api/v1/clients?filter[has_conversation]=1&include=conversation&filter[funnel_phase_id]=" + this.leads[i].funnel_phase_id + filter)// + '&sort=latest'
            .then(resp=>{
                
                this.leads[i].data = resp.data.data
                this.leads[i].load_leads = false
                
                this.leads_links.push({link: resp.data.links.next, phase_id: this.leads[i].funnel_phase_id})
            
            })
        },
        getLeads(i) {
            this.leads_links = []
            var filter = ''
            if(this.filters.id!=''&&this.filters.id!=null){
                filter = '&filter[id]=' + this.filters.id
            }
            if(this.search!=''&&this.search!=null){
                filter = filter + '&filter[name]=' + this.search
            }
            if(this.filters.user_id!=''&&this.filters.user_id!=null){
                filter = filter + '&filter[user_id]=' + this.filters.user_id
            }
            if(this.filters.created_at!=''&&this.filters.created_at!=null){
                filter = filter + '&filter[created_between]=' + this.filters.created_at
            }
            if(this.filters.phone!=''&&this.filters.phone!=null){
                filter = filter + '&filter[phone]=' + this.filters.phone
            }
            if(this.filters.email!=''&&this.filters.email!=null){
                filter = filter + '&filter[email]=' + this.filters.email
            }
            if(i==0){//&& this.funnel.id==1
                if(filter!=''){
                    filter = filter.slice(1,filter.length)
                }
                axios.get(process.env.VUE_APP_BACKEND + "api/v1/unassigned_leads?" + filter)
                .then(resp=>{
                    
                    this.leads[i].data = resp.data.data
                    this.leads[i].load_leads = false
                    
                    this.leads_links.push({link: resp.data.links.next, phase_id: this.leads[i].funnel_phase_id})
                
                })
            }else{
                if(this.only_unread_messages){
                    filter = filter + '&filter[has_unread_messages]=1'
                }
                axios.get(process.env.VUE_APP_BACKEND + "api/v1/leads?filter[funnel_phase_id]=" + this.leads[i].funnel_phase_id + filter + '&sort=latest')
                .then(resp=>{
                    
                    this.leads[i].data = resp.data.data//.sort((a, b) => new Date(b.conversation.latest_message.zenvia_timestamp) - new Date(a.conversation.latest_message.zenvia_timestamp))


                    this.leads[i].load_leads = false
                    
                    this.leads_links.push({link: resp.data.links.next, phase_id: this.leads[i].funnel_phase_id})
                
                })
            }
        },
        selectFunel(item){
            this.funnel = item
            this.getFunnelPhasesFromApi()
        },
        saveFunnel(){
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/funnels", this.created_funnel)
            .then(response=>{
                this.closeFunnelDialog()
                this.$store.dispatch('funnel/getFunnels')
            })
        },
        saveEditedFunnel(){
            for(var i=0; i<this.funnel_phases.length; i++){
                axios.put(process.env.VUE_APP_BACKEND + "api/v1/funnel_phases/" + this.funnel_phases[i].id, {'order':i})
            }
            axios.put(process.env.VUE_APP_BACKEND + "api/v1/funnels/" + this.funnel.id, this.funnel)
            .then(response=>{
                this.$store.dispatch('funnel/getFunnels')
                this.editFunnelDialog = false
            })
        },
        saveFunnelPhase(){
            this.created_funnel_phase.funnel_id = this.funnel.id
            
            axios.post(process.env.VUE_APP_BACKEND + "api/v1/funnel_phases", this.created_funnel_phase)
            .then(response=>{
                this.closeFunnelPhaseDialog()
                this.getFunnelPhasesFromApi()
            })
        },
        closeFunnelDialog(){
            this.created_funnel = {
                name:'',
                description:'',
                color:'grey'
            }
            this.createFunnelDialog = false
        },
        closeFunnelPhaseDialog(){
            this.created_funnel_phase = {
                days: null,
                description: null,
                name: '',
                time: null,
                funnel_id: ''
            }
            this.createFunnelPhaseDialog = false
        }
    }
};
</script>
<style>
.v-badge__badge {
    line-height: 1.6;
        font-weight: 700;
}
.v-sheet.v-snack__wrapper:not(.v-sheet--outlined) {
    box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 10%)!important;
    max-width: 200px!important;
}
.theme--dark.v-badge .v-badge__badge::after {
    border-color: rgb(255 255 255)!important;
}
[aria-live="polite"]{
    padding:0px!important;
}
    #scroll{
        overflow-y:scroll!important;
        max-height:70vh!important;
        min-height:70vh!important;
        -overflow-scrolling:touch!important;
        -webkit-overflow-scrolling:touch!important;
    }
    .v-text-field__details {
        display: none;
    }
    .theme--light.v-timeline::before {
        background-image: linear-gradient(#c7c7c7 33%, rgba(255,255,255,0) 0%)!important;
        background-position: right!important;
        background-size: 2px 7px!important;
        background-repeat: repeat-y!important;
        background-color: white!important;
    }
    .v-timeline .mdi-google-maps::before {
        content: "\F05F5"!important;
        color: #1976d2!important;
    }
    .v-timeline-item__dot {
        box-shadow: none!important;
    }
    .icon_style .v-badge__badge.primary{    
        inset: auto auto 0px 5px!important;
    }
    .user-label {
        background: white;
        width: 100%;
        position: absolute;
        bottom: -20px;
    }
</style>