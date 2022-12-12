<template>
    <leads v-if="permissions('leads')"/>
    <div v-else>
        <!-- PC slider reporte por mes/semana -->
        <div class="ml-6 hidden-sm-and-down">
            <v-carousel height="200" cycle hide-delimiter-background show-arrows-on-hover >
                <!-- reporte por mes-->
                <v-carousel-item style="background:#1f88fe; border-radius: 10px 0px 0px 10px;">
                    <div class="pa-5" transition="scroll-x-reverse-transition" style="color:white; font-size:16px!important;"><strong>Reporte del mes</strong></div>
                    <v-row class="pa-0">
                        <!-- clientes -->
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto pl-12 px-2 elevation-0 fondo" color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="80"><v-icon x-large color="#fac83c">  mdi-trending-neutral</v-icon></v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title style="color:white; font-weight:300;" class="headline mb-0">
                                        Clientes <strong style="font-weight:900;">{{companiesMonth}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                            {{fecha('mes')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-card-actions>
                                <!--v-btn outlined rounded text>Button</v-btn-->
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <!-- ventas -->
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto px-2 elevation-0 fondo"  color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="80"><v-icon x-large color="#85da60"> mdi-trending-up</v-icon></v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title style="color:white;" class="headline mb-0">
                                        Ventas <strong style="font-weight:900;">{{quotationsMonth.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                            {{fecha('mes')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-card-actions>
                                <!--v-btn outlined rounded text>Button</v-btn-->
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <!-- actividades -->
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto px-2 elevation-0 fondo" max-width="344" color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="80"><v-icon x-large color="rgb(244 67 54 / 80%) !important">  mdi-trending-down</v-icon></v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title style="color:white;" class="headline mb-0">
                                        Actividades <strong style="font-weight:900;">{{calendarMonth}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                        {{fecha('mes')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-card-actions>
                                <!--v-btn outlined rounded text>Button</v-btn-->
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-carousel-item>
                <!-- reporte por semana-->
                <v-carousel-item style="background:#ff8400; border-radius: 10px 0px 0px 10px;">
                    <div class="pa-5" transition="scroll-x-reverse-transition" style="color:white; font-size:16px!important;"><strong>Reporte de la semana</strong></div>
                    <v-row class="pa-0">
                        <!-- clientes -->
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto pl-12 px-2 elevation-0 fondo" color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="80"><v-icon x-large color="#fac83c">  mdi-trending-neutral</v-icon></v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title style="color:white;" class="headline mb-0">
                                        Clientes <strong style="font-weight:900;">{{companiesWeek}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                            {{fecha('semana')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-card-actions>
                                <!--v-btn outlined rounded text>Button</v-btn-->
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <!-- ventas -->
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto px-2 elevation-0 fondo"  color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="80"><v-icon x-large color="#85da60"> mdi-trending-up</v-icon></v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title style="color:white;" class="headline mb-0">
                                        Ventas <strong style="font-weight:900;">{{quotationsWeek.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                            {{fecha('semana')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-card-actions>
                                <!--v-btn outlined rounded text>Button</v-btn-->
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <!-- actividades -->
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto px-2 elevation-0 fondo" max-width="344" color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="80"><v-icon x-large color="red">  mdi-trending-down</v-icon></v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title style="color:white;" class="headline mb-0">
                                        Actividades <strong style="font-weight:900;">{{calendarWeek}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                        {{fecha('semana')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-card-actions>
                                <!--v-btn outlined rounded text>Button</v-btn-->
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-carousel-item>
            </v-carousel>
        </div>
        <!-- MOVIL slider ventas por mes -->
        <div class="mx-3 hidden-md-and-up mt-2" style="background:#ff8400; border-radius: 10px;">
            <!-- cards -->
            <v-carousel height="140" cycle hide-delimiter-background show-arrows-on-hover >
                <div class="pa-5 pb-0" transition="scroll-x-reverse-transition" style="color:white; font-size:16px!important;"><strong>Reporte del mes</strong></div>
                <!-- clientes -->
                <v-carousel-item>
                    <v-card class="mx-auto px-2 elevation-0 fondo" color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="#fac83c">  mdi-trending-neutral</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Clientes <strong style="font-weight:900;">{{companiesMonth}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                    {{fecha('mes')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
                <!-- ventas -->
                <v-carousel-item>    
                    <v-card class="mx-auto px-2 elevation-0 fondo"  color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="#85da60"> mdi-trending-up</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Ventas <strong style="font-weight:900;">{{quotationsMonth.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                    {{fecha('mes')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
                <!-- actividades -->
                <v-carousel-item>
                    <v-card class="mx-auto px-2 elevation-0 fondo" color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="red">  mdi-trending-down</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Actividades <strong style="font-weight:900;">{{calendarMonth}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                {{fecha('mes')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
            </v-carousel>
        </div>
        <!-- MOVIL slider ventas por semana -->
        <div class="mx-3 mt-3 hidden-md-and-up" style="background:#1f88fe; border-radius: 10px;">
            <!-- cards -->
            <v-carousel height="140" cycle hide-delimiter-background show-arrows-on-hover >
                <div class="pa-5 pb-0" transition="scroll-x-reverse-transition" style="color:white; font-size:16px!important;"><strong>Reporte de la semana</strong></div>
                <!-- clientes -->
                <v-carousel-item>
                    <v-card class="mx-auto px-2 elevation-0 fondo" color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="#fac83c">  mdi-trending-neutral</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Clientes <strong style="font-weight:900;">{{companiesWeek}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                    {{fecha('semana')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
                <!-- ventas -->
                <v-carousel-item>    
                    <v-card class="mx-auto px-2 elevation-0 fondo"  color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="#85da60"> mdi-trending-up</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Ventas <strong style="font-weight:900;">{{quotationsWeek.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                    {{fecha('semana')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
                <!-- actividades -->
                <v-carousel-item>
                    <v-card class="mx-auto px-2 elevation-0 fondo" color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="rgb(244 67 54 / 80%) !important">  mdi-trending-down</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Actividades <strong style="font-weight:900;">{{calendarWeek}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                {{fecha('semana')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
            </v-carousel>
        </div>
        <!--Contenido -->
        <div class="pa-6 pb-0">
            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-card elevation="0" class="pa-4" style="border-radius:0px;">
                        <v-img gradient="to bottom, rgba(0,0,0,.55), rgba(0,0,0,.45)" style="cursor: pointer;" @click="video=true" src="https://i.ytimg.com/vi/6kwJIAgfMuw/hq720.jpg?sqp=-oaymwEZCOgCEMoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLAAIQMOtGf4NP_K-z54JvSHo07giw">
                        <v-row class="fill-height" align="center" justify="space-around">
                            <v-icon color="white" x-large> mdi-play-circle-outline</v-icon>
                        </v-row>
                        </v-img>
                        <div style="background-color:#e15101; height:4px; width:100px; margin-top:30px;"></div>
                        <div style="color:#1c256a; margin-top:20px; font-size:21px; line-height:28px;"> <strong>Descubre las nuevas caracteristicas que se agregan a UnoCRM en Enero del 2021 </strong></div>
                        <v-dialog v-model="video" max-width="720px">
                            <iframe width="720" height="400" src="https://www.youtube.com/embed/6kwJIAgfMuw" frameborder="0" autoplay="1" allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </v-dialog>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card elevation="0" class="py-4" style="border-radius:0px; overflow-y:scroll!important; max-height:436px!important; -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important;">
                        <v-row v-for="(post,i) in posts" class="px-4" v-bind:key="i">
                            <v-col cols="4">
                                <v-img height="100" class="white--text align-end" v-bind:src="post._embedded['wp:featuredmedia'][0].source_url"></v-img>
                            </v-col>
                            <v-col cols="8">
                            <v-card elevation="0">
                                <v-card-title style="color:#1c256a!important; font-size:15px;" class="pt-0 pb-0">{{post.title.rendered.toString().slice(0,30)}}...</v-card-title>
                                <v-card-text  style="font-size:13px;" class="py-0">{{post.excerpt.rendered.toString().slice(3,90)}}...</v-card-text>
                                <v-card-actions><v-btn small style="margin:-10px 0px -5px 0px;font-size:10px; color:#e15101!important;" text target="_blank" v-bind:href="post.link">VER MÁS</v-btn></v-card-actions>
                            </v-card>
                            </v-col>
                            <v-divider class="mb-4 mt-0 ml-3 mr-4"></v-divider>
                        </v-row>
                  </v-card>
                </v-col>
              </v-row>  
        </div>
    </div>
</template>

<script>
import Leads from '../leads/container'
import axios from "axios"
  export default {
    components:{
        'leads':Leads,
    },
    data: () => ({
        video:false,
        posts: []
    }),
    created() {
        axios
        .get("https://unocrm.mx/wp-json/wp/v2/posts?_embed")
        .then(response => {this.posts = response.data;})
        .catch( error => {
            window.alert( error );
        });
        this.fecha()
        
    },
    methods:{
        fecha(rango){
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            const date = new Date()
            if(rango=='mes'){
                const mes = date.getMonth()
                const anio = date.getFullYear()
                return meses[mes] + ' ' + anio
            }
            if(rango=='semana'){
                const dia = date.getDate()
                var first = dia - date.getDay();
                var last = first + 6;
                var firstday = new Date(date.setDate(first));
                var lastday = new Date(date.setDate(last));
                return 'del ' + firstday.getDate() + ' de ' + meses[firstday.getMonth()] + ' al ' + lastday.getDate() + ' de ' + meses[lastday.getMonth()]
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
    },
    computed:{
        currentUser(){
            return this.$store.state.currentUser.user
        },
        currentWeek(){
            var date = new Date()
            const dia = date.getDate()
            var first = dia - date.getDay();
            var last = first + 6;
            var week = {start:'', end:''} 
            week.start = new Date(date.setDate(first));
            week.end = new Date(date.setDate(last));
            return week
        },
        calendarMonth(){
            return this.$store.state.calendar.calendars.filter(calendar=>new Date(calendar.date).getMonth() == new Date().getMonth()).length
        },
        companiesMonth(){
            return this.$store.state.company.companies.filter(company=>new Date(company.created_at).getMonth() == new Date().getMonth()).length
        },
        quotationsMonth(){
            var response = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>new Date(quotation.updated_at).getMonth() == new Date().getMonth())
            var responseTotal = response.reduce(function(prev, cur) {
                return prev + cur.total;
            }, 0);
            return responseTotal
        },
        calendarWeek(){
            return this.$store.state.calendar.calendars.filter(calendar=>new Date(calendar.date) <= this.currentWeek.end && new Date(calendar.date) >= this.currentWeek.start).length
        },
        companiesWeek(){
            return this.$store.state.company.companies.filter(company=>new Date(company.created_at) <= this.currentWeek.end && new Date(company.created_at) >= this.currentWeek.start).length
        },
        quotationsWeek(){
            var response = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>new Date(quotation.updated_at) <= this.currentWeek.end && new Date(quotation.updated_at) >= this.currentWeek.start)
            var responseTotal = response.reduce(function(prev, cur) {
                return prev + cur.total;
            }, 0);
            return responseTotal
        }
    },
    mounted() {
        Echo.channel('test').listen('Test', (e) => {
            console.log(e)
        })
    },
  }
</script>

<style scoped>
.fondo:hover{
    background-color: rgba(255, 255, 255, 0.11)!important;
    cursor: pointer;
}
</style>