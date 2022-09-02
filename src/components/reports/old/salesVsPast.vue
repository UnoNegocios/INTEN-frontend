<template>
    <div style="background:white;">
        <!-- Header -->
        <v-toolbar class="px-6 py-4 mb-6" flat >
            <v-toolbar-title class="hidden-md-and-down">Reporte de Ventas</v-toolbar-title>
            <v-toolbar-title class="hidden-md-and-up">Ventas</v-toolbar-title>
            <v-btn icon>
                <v-icon @click.stop="filters1 = !filters1">mdi-filter</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="how=='dia'" @click="byMonth" class="ml-8">MES</v-btn>
            <v-btn v-else class="ml-8" @click="byDay">DIA</v-btn>
        </v-toolbar>
        <!-- Filters -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters1" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterQuotations @filtersQuotation="filtersQuotation"/>
        </v-navigation-drawer>
        <!-- Grafica -->
        <apexchart v-if="renderComponent" type="area" height="500" :options="optionsSales" :series="optionsSales.salesSeries"></apexchart>
    </div>
</template>

<script>
import Filter from "../reports/filter"
export default {
    components: {
        'filterQuotations':Filter,
    },
    data: function () {
        return {
            renderComponent:true,
            quotations:'',
            quotationsPast:'',
            how:'dia',
            startDateFrom:'',
            startDateTo:'',
            startDateFromHistory:'',
            startDateToHistory:'',
            filters1: false,
            accumulator:0,
            /* Reporte General */
            optionsSales: {
                xaxis: {
                    type: "datetime"
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return "$" + new Intl.NumberFormat("es-MX").format(value);
                        },
                    },
                },
                dataLabels: {
                    formatter: function (value) {
                        return "$" + new Intl.NumberFormat("es-MX").format(value);
                    },
                },
                colors: ['#369ff8', '#f9ba43'],
                salesSeries: [], 
            },
            /* Reporte Vendedores */
            optionsUsers:{
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return "$" + new Intl.NumberFormat("es-MX").format(value);
                        },
                    },
                },
                dataLabels: {
                    formatter: function (value) {
                        return "$" + new Intl.NumberFormat("es-MX").format(value);
                    },
                },
                colors: ['#785dd0', '#ff4560', '#ffb019', '#00e495', '#008ffa'],
                userSeries: [],
                plotOptions: {
                    bar: {
                        distributed: true,
                    }
                },
                
            }
        }
    },
    mounted () {
        this.startDateFrom = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/1'; //igual mayor que
        this.startDateTo = this.hasta(); //menor que
        this.startDateFromHistory = (new Date().getFullYear() - 1) + '/' + (new Date().getMonth() + 1) + '/1'
        this.startDateToHistory = this.hastaHistory()
        this.quotations = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>new Date(quotation.updated_at) > new Date(this.startDateFrom)).filter(quotation=>new Date(quotation.updated_at) < new Date(this.startDateTo))
        this.quotationsPast = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>new Date(quotation.updated_at) > new Date(this.startDateFromHistory)).filter(quotation=>new Date(quotation.updated_at) < new Date(this.startDateToHistory))
        this.render()
    },
    computed: {
        /* Ajustes grafica año pasado */
        history(){
            var history = {
                name: 'Año Pasado',
                data: this.salesPastData('cerrado'),
                type: 'area',
            }
            return history
        },
        /* Ajustes grafica ventas */
        sales(){
            var sales = {
                name: 'Ventas',
                data: this.salesData('cerrado'),
                type: 'bar'
            }
            return sales
        },
    },
    methods:{
        hasta(){
            if((new Date().getMonth()+2)<12){
                return new Date().getFullYear() + '/' + (new Date().getMonth() + 2) + '/1'
            }else{
                return new Date().getFullYear()+1 + '/1/1'
            }
        },
        hastaHistory(){
            if((new Date().getMonth()+2)<12){
                return (new Date().getFullYear() - 1) + '/' + (new Date().getMonth() + 2) + '/1'
            }else{
                return new Date().getFullYear() + '/1/1'
            }
            
        },
        /* Filtrar grafica de Ventas */
        filtersQuotation: function(params) {
            var filterQuotationHistory = ''
            var filterQuotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido')
            if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
                var uno = filterQuotation.filter(quotation=>quotation.company_id == params.company_id[0])
                for(var i=1; i<params.company_id.length; i++){
                    uno=uno.concat(filterQuotation.filter(quotation=>quotation.company_id == params.company_id[i]))   
                }
                filterQuotation = this.removeDuplicates(uno, "id");
            }
            if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
                var dos = filterQuotation.filter(quotation=>quotation.contact_id == params.contact_id[0])
                for(var i=1; i<params.contact_id.length; i++){
                    dos=dos.concat(filterQuotation.filter(quotation=>quotation.contact_id == params.contact_id[i]))   
                }
                filterQuotation = this.removeDuplicates(dos, "id");
            }
            if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                var tres = filterQuotation.filter(quotation=>quotation.user_id == params.user_id[0])
                for(var i=1; i<params.user_id.length; i++){
                    tres=tres.concat(filterQuotation.filter(quotation=>quotation.user_id == params.user_id[i]))   
                }
                filterQuotation = this.removeDuplicates(tres, "id");
            }
            if(params.items!=''&&params.items!=undefined&&params.items!=null){
                var cinco = filterQuotation.filter(quotation=>this.check(quotation.items, params.items[0]) == 'contain')
                for(var i=1; i<params.items.length; i++){
                    cinco=cinco.concat(filterQuotation.filter(quotation=>this.check(quotation.items, params.items[0]) == 'contain'))   
                }
                filterQuotation = this.removeDuplicates(cinco, "id");
            }
            /* text fields */
            if(params.note!=''){
                filterQuotation=filterQuotation.filter(quotation=>this.lowerCase(quotation.note).includes(params.note.toLowerCase()))
            }



            /* Fecha creación */
            if(params.dateCreateFrom!='' && params.dateCreateFrom!=null && params.dateCreateFrom!=undefined){
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) > new Date(params.dateCreateFrom))
                filterQuotationHistory=filterQuotation.filter(quotation=>new Date(quotation.updated_at) > new Date(this.pastYear(params.dateCreateFrom)))
            }else{
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) > new Date(this.startDateFrom))
                filterQuotationHistory=filterQuotation.filter(quotation=>new Date(quotation.updated_at) > new Date(this.startDateFromHistory))
            }


            if(params.dateCreateTo!='' && params.dateCreateTo!=null && params.dateCreateTo!=undefined){
                var dateTwo = new Date(new Date(params.dateCreateTo).setDate(new Date(params.dateCreateTo).getDate() + 1))
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) <= dateTwo)
                filterQuotationHistory=filterQuotation.filter(quotation=>new Date(quotation.updated_at) <= new Date(this.pastYear(dateTwo)))
            }else{
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) < new Date(this.startDateTo))
                filterQuotationHistory=filterQuotation.filter(quotation=>new Date(quotation.updated_at) < new Date(this.startDateToHistory))
            }


            
            this.quotations = filterQuotation
            this.quotationsPast = filterQuotationHistory
            this.render()
        },
        /* Informacion del historico */
        salesPastData(){
            /* Render por dia */
            if(this.how=='dia'){
                var obj = this.quotationsPast.map(venta => {
                    return {
                        x: new Date(venta.updated_at),
                        y: venta.total,
                        estatus: venta.status
                    }
                }).sort(function(b,a){
                    return new Date(b.x) - new Date(a.x);
                });
                var holder = {};
                obj.forEach(function(d) {
                    if (holder.hasOwnProperty(d.x.toISOString().slice(0,10))) {
                        holder[d.x.toISOString().slice(0,10)] = holder[d.x.toISOString().slice(0,10)] + d.y;
                    } else {
                        holder[d.x.toISOString().slice(0,10)] = d.y;
                    }
                });
                var obj2 = [];
                for (var prop in holder) {
                    obj2.push({ x: prop, y: holder[prop] });
                }
                var acumulado = obj2
                acumulado.map(i => {
                    i.y=i.y + this.accumulator
                    this.accumulator = i.y

                    var d = new Date(i.x)
                    var year = d.getFullYear();
                    var month = d.getMonth();
                    var day = d.getDate();
                    var c = new Date(year + 1, month, day);

                    i.x = new Date(c).toISOString().slice(0,10)
                })
                this.accumulator=0
                return acumulado
            }
            /* Render por mes */
            else{
                var obj = this.quotationsPast.map(venta => {
                    return {
                        x: new Date(venta.updated_at),
                        y: venta.total,
                        estatus: venta.status
                    }
                }).sort(function(b,a){
                    return new Date(b.x) - new Date(a.x);
                });
                var holder = {};
                obj.forEach(function(d) {
                    if (holder.hasOwnProperty(d.x.toISOString().slice(0,8))) {
                        holder[d.x.toISOString().slice(0,8)] = holder[d.x.toISOString().slice(0,8)] + d.y;
                    } else {
                        holder[d.x.toISOString().slice(0,8)] = d.y;
                    }
                });
                var obj2 = [];
                for (var prop in holder) {
                    obj2.push({ x: prop, y: holder[prop] });
                }
                var acumulado = obj2
                acumulado.map(i => {
                    i.y=i.y + this.accumulator
                    this.accumulator = i.y

                    var d = new Date(i.x)
                    var year = d.getFullYear();
                    var month = d.getMonth();
                    var c = new Date(year + 1, month);

                    i.x = new Date(c).toISOString().slice(0,8)
                })
                this.accumulator=0
                return acumulado
            }
        },
        /* Informacion para las graficas */
        salesData(){
            /* Render por dia */
            if(this.how=='dia'){
                var obj = this.quotations.map(venta => {
                    return {
                        x: new Date(venta.updated_at),
                        y: venta.total,
                        estatus: venta.status
                    }
                }).sort(function(b,a){
                    return new Date(b.x) - new Date(a.x);
                });
                var holder = {};
                obj.forEach(function(d) {
                    if (holder.hasOwnProperty(d.x.toISOString().slice(0,10))) {
                        holder[d.x.toISOString().slice(0,10)] = holder[d.x.toISOString().slice(0,10)] + d.y;
                    } else {
                        holder[d.x.toISOString().slice(0,10)] = d.y;
                    }
                });
                var obj2 = [];
                for (var prop in holder) {
                    obj2.push({ x: prop, y: holder[prop] });
                }
                var acumulado = obj2
                acumulado.map(i => {
                    i.y=i.y + this.accumulator
                    this.accumulator = i.y
                    i.x = new Date(i.x).toISOString().slice(0,10)
                })
                this.accumulator=0
                return acumulado
            }
            /* Render por mes */
            else{
                var obj = this.quotations.map(venta => {
                    return {
                        x: new Date(venta.updated_at),
                        y: venta.total,
                        estatus: venta.status
                    }
                }).sort(function(b,a){
                    return new Date(b.x) - new Date(a.x);
                });
                var holder = {};
                obj.forEach(function(d) {
                    if (holder.hasOwnProperty(d.x.toISOString().slice(0,8))) {
                        holder[d.x.toISOString().slice(0,8)] = holder[d.x.toISOString().slice(0,8)] + d.y;
                    } else {
                        holder[d.x.toISOString().slice(0,8)] = d.y;
                    }
                });
                var obj2 = [];
                for (var prop in holder) {
                    obj2.push({ x: prop, y: holder[prop] });
                }
                var acumulado = obj2
                acumulado.map(i => {
                    i.y=i.y + this.accumulator
                    this.accumulator = i.y
                    i.x = new Date(i.x).toISOString().slice(0,8)
                })
                this.accumulator=0
                return acumulado
            }
        },
        /* cargar info */
        render(){
            this.optionsSales.salesSeries = [this.sales, this.history,]
            this.renderComponent = false;
            this.$nextTick(() => {
                this.renderComponent = true;
            });
        },
        /* Botón acomodo por mes */
        byMonth(){
            this.how='mes'
            this.render()
        },
        /* Botón acomodo por dia */
        byDay(){
            this.how='dia'
            this.render()
        },
        /* Generar 1 de enero del año previo */
        pastYear(date){
            const fill = (number, len) => "0".repeat(len - number.toString().length) + number.toString();
            var j = new Date(date);
            var o = j.getFullYear();
            var e = j.getMonth();
            var l = j.getDate();
            var pastDate = new Date(o - 1, e, l);
            this.startDateFromHistory = new Date(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate()); 
            pastDate = fill(this.startDateFromHistory.getMonth()+1, 2)+'-'+fill(this.startDateFromHistory.getDate(),2)+'-'+this.startDateFromHistory.getFullYear()
            return pastDate
        },
        /* Filtrar por productos */
        check(items, param){
            if(items!=undefined&&items!=''&&items!=null){
                for(var i=0; i<items.length; i++){
                    if(items[i].item == param){
                        return 'contain'
                    }
                }  
            }
        },
        /* Funcion para elminar duplicados en un arreglo */
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
        /* Funcion para convertir a minusculas */
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
    },
}
</script>