<template>
        <div style="background:white;">
            <!-- Header -->
            <v-toolbar class="px-6 py-4 mb-6" flat >
                <v-toolbar-title class="hidden-md-and-down">Ventas por Procedencia vs Mes Pasado</v-toolbar-title>
                <v-toolbar-title class="hidden-md-and-up">Procedencias Mes</v-toolbar-title>
                <v-btn icon>
                    <v-icon @click.stop="filters2 = !filters2">mdi-filter</v-icon>
                </v-btn>
            </v-toolbar>
            <!-- Filters -->
            <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters2" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <filterSellers @filtersQuotation="filtersQuotation" />
            </v-navigation-drawer>
            <!-- Grafica -->
            <apexchart v-if="renderComponent" type="area" height="440" :options="optionsOrigins" :series="optionsOrigins.originSeries"></apexchart>
        </div>
</template>

<script>
import FilterSellers from "../reports/filter"
export default {
    components: {
        'FilterSellers':FilterSellers,
    },
    data: function () {
        return {
            renderComponent:true,
            quotations:'',
            how:'dia',
            startDateFrom:'',
            startDateTo:'',
            filters2: false,
            accumulator:0,
            /* Reporte Vendedores */
            optionsOrigins:{
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
                originSeries: [],
                plotOptions: {
                    bar: {
                        distributed: true,
                    }
                },
                
            }
        }
    },
    created () {
        this.startDateFrom = new Date().getFullYear() + '/' + (new Date().getMonth()+1) + '/1'; //igual mayor que
        this.startDateTo = this.hasta(); //menor que
        this.startDateFromHistory = new Date().getFullYear() + '/' + (new Date().getMonth()) + '/1'
        this.startDateToHistory = this.hastaHistory();

        this.quotations = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>new Date(quotation.updated_at) > new Date(this.startDateFrom)).filter(quotation=>new Date(quotation.updated_at) < new Date(this.startDateTo))
        this.quotations2 = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>new Date(quotation.updated_at) > new Date(this.startDateFromHistory)).filter(quotation=>new Date(quotation.updated_at) < new Date(this.startDateToHistory))
       
        this.optionsOrigins.originSeries = [this.ventasXvendedor, this.ventasXvendedor2]
        this.render()
    },
    computed: {
        /* Grafica Ventas por Vendedor */
        ventasXvendedor(){
            var ventavendedor = this.quotations 
            .map(venta => {
                return {
                    x: this.origins(venta.company_id),
                    y: venta.total,
                }
            })
            var obj = ventavendedor.sort(function(b,a){
                return b.x - a.x;
            });
            var holder = {};
            obj.forEach(function(d) {
                if (holder.hasOwnProperty(d.x)) {
                    holder[d.x] = holder[d.x] + d.y;
                } else {
                    holder[d.x] = d.y;
                }
            });
            var obj2 = [];
            for (var prop in holder) {
                obj2.push({ x: prop, y: holder[prop] });
            }
            var perro = obj2.map(venta => {
                return {
                    x: venta.x,
                    y: venta.y,
                }
            })
            var resultado = {
                name: 'Actual',
                data: perro,
                //type: 'bar'
            }
            return resultado
        },
        /* Grafica Ventas por Vendedor */
        ventasXvendedor2(){
            var ventavendedor = this.quotations2 
            .map(venta => {
                return {
                    x: this.origins(venta.company_id),
                    y: venta.total,
                }
            })
            var obj = ventavendedor.sort(function(b,a){
                return b.x - a.x;
            });
            var holder = {};
            obj.forEach(function(d) {
                if (holder.hasOwnProperty(d.x)) {
                    holder[d.x] = holder[d.x] + d.y;
                } else {
                    holder[d.x] = d.y;
                }
            });
            var obj2 = [];
            for (var prop in holder) {
                obj2.push({ x: prop, y: holder[prop] });
            }
            var perro = obj2.map(venta => {
                return {
                    x: venta.x,
                    y: venta.y,
                }
            })
            var resultado = {
                name: 'Mes Pasado',
                data: perro,
                //type: 'bar'
            }
            return resultado
        },
        /* lista de usuarios */
        originLists() {
            return this.$store.state.origin.origins;
        },
        companyLists() {
            return this.$store.state.company.companies;
        }
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
            }else{
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) > new Date(this.startDateFrom))
            }


            if(params.dateCreateTo!='' && params.dateCreateTo!=null && params.dateCreateTo!=undefined){
                var dateTwo = new Date(new Date(params.dateCreateTo).setDate(new Date(params.dateCreateTo).getDate() + 1))
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) <= dateTwo)
            }else{
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) < new Date(this.startDateTo))
            }


            
            this.quotations = filterQuotation
            this.quotationsPast = filterQuotationHistory
            this.render()
        },
        /* Nombre de vendedor */
        origins(id) {
            var origin_id = this.companyLists.filter(company => company.id == id).map(company => company.origin_id)[0];
            if(origin_id!=null){
                return this.originLists.filter(origin => origin.id == origin_id).map(origin => origin.name)[0];
            }else{
                return 'indefinido'
            }
        },
        /* cargar info */
        render(){
            this.optionsOrigins.originSeries = [this.ventasXvendedor, this.ventasXvendedor2]
            this.renderComponent = false;
            this.$nextTick(() => {
                this.renderComponent = true;
            });
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
        /* Generar mes previo */
        pastMonth(date){
            const fill = (number, len) => "0".repeat(len - number.toString().length) + number.toString();
            var j = new Date(date);
            var o = j.getFullYear();
            var e = j.getMonth()-1;
            var l = j.getDate();
            var pastDate = new Date(o, e, l);
            this.startDateFromHistory = new Date(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate()); 
            pastDate = fill(this.startDateFromHistory.getMonth(), 2)+'-'+fill(this.startDateFromHistory.getDate(),2)+'-'+this.startDateFromHistory.getFullYear()
            return pastDate
        },
    },
}
</script>
<style>