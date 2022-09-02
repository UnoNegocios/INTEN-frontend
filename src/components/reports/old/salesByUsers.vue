<template>
        <div style="background:white;">
            <!-- Header -->
            <v-toolbar class="px-6 py-4 mb-6" flat >
                <v-toolbar-title class="hidden-md-and-down">Reporte de Ventas por Vendedor</v-toolbar-title>
                <v-toolbar-title class="hidden-md-and-up">Vendedores</v-toolbar-title>
                <v-btn icon>
                    <v-icon @click.stop="filters2 = !filters2">mdi-filter</v-icon>
                </v-btn>
            </v-toolbar>
            <!-- Filters -->
            <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters2" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <filterSellers @filtersQuotation="filtersQuotation" />
            </v-navigation-drawer>
            <!-- Grafica -->
            <!--apexchart v-if="renderComponent" type="bar" height="440" :options="optionsUsers" :series="optionsUsers.userSeries"></apexchart-->
            <apexchart type="bar" height="440" :options="chartOptions" :series="series"></apexchart>
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
            startDateFrom:'',
            startDateTo:'',
            filters2: false,
            accumulator:0,
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
            },

            series: [{
                name: 'Vendido',
                data: []//vendido
            }, {
                name: 'Faltante para Meta',
                data: []//vendido - meta
            }],
            chartOptions: {
                tooltip: {
                    y: {
                        formatter: function (value) {
                            return "$" + new Intl.NumberFormat("es-MX").format(value);
                        },
                    }
                },
                chart: {
                    type: 'bar',
                    stacked: true,
                    stackType: '100%'
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
                xaxis: {
                    categories: [],
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'right',
                    offsetX: 0,
                    offsetY: 50
                },
          },
        }
    },
    created () {
        var date = new Date();
        this.startDateFrom = date.getFullYear() + '/' + (date.getMonth()+1) + '/1'; //igual mayor que
        this.startDateTo = this.hasta()


        this.quotations = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>new Date(quotation.updated_at) > new Date(this.startDateFrom)).filter(quotation=>new Date(quotation.updated_at) < new Date(this.startDateTo))
        this.chartOptions.xaxis.categories = this.ventasXvendedor2
        this.series[0].data = this.ventasXvendedor
        this.series[1].data = this.ventasXvendedor3
        this.render()
    },
    computed: {
        ventasXvendedor2(){
            var ventavendedor = this.quotations 
            .map(venta => {
                return {
                    x: venta.user_id,
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
                return this.vendedor(venta.x)
            })
            return perro
        },
        /* Grafica Ventas por Vendedor */
        ventasXvendedor(){
            var ventavendedor = this.quotations 
            .map(venta => {
                return {
                    x: venta.user_id,
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
                return venta.y
            })
            return perro
        },
        ventasXvendedor3(){
            var ventavendedor = this.quotations 
            .map(venta => {
                return {
                    x: venta.user_id,
                    y: venta.amount,
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
                return this.goal(venta.x) - venta.y
            })
            return perro
        },
        /* lista de usuarios */
        userLists() {
            return this.$store.state.user.users;
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
        /* Filtrar grafica de Vendedores */
        /* Filtrar grafica de Ventas */
        filtersQuotation: function(params) {
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
            this.chartOptions.xaxis.categories = this.ventasXvendedor2
            this.series[0].data = this.ventasXvendedor
            this.series[1].data = this.ventasXvendedor3
            this.render()
        },
        /* Nombre de vendedor */
        vendedor(id) {
            return this.userLists.filter(user => user.id == id).map(user => user.name)[0];
        },
        goal(id) {
            return this.userLists.filter(user => user.id == id).map(user => user.goal_amount)[0];
        },
        /* cargar info */
        render(){
            this.chartOptions.xaxis.categories = this.ventasXvendedor2
            this.series[0].data = this.ventasXvendedor
            this.series[1].data = this.ventasXvendedor3
            this.renderComponent = false;
            this.$nextTick(() => {
                this.chartOptions.xaxis.categories = this.ventasXvendedor2
                this.series[0].data = this.ventasXvendedor
                this.series[1].data = this.ventasXvendedor3
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
    },
}
</script>
<style>