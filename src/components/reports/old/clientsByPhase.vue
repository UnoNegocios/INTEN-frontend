<template>
        <div style="background:white;">
            <!-- Header -->
            <v-toolbar class="px-6 py-4 mb-6" flat >
                <v-toolbar-title class="hidden-md-and-down">Clientes por Rango de Consumo</v-toolbar-title>
                <v-toolbar-title class="hidden-md-and-up">Rangos de Consumo</v-toolbar-title>
                <!--v-btn icon>
                    <v-icon @click.stop="filters2 = !filters2">mdi-filter</v-icon>
                </v-btn-->
            </v-toolbar>
            <!-- Filters -->
            <!--v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters2" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <filterSellers/>
            </v-navigation-drawer-->
            <!-- Grafica -->
            <apexchart v-if="renderComponent" type="bar" height="440" :options="optionsCompanies" :series="optionsCompanies.companySeries"></apexchart>
            
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
            companies:'',
            how:'dia',
            startDateFrom:'',
            startDateTo:'',
            filters2: false,
            accumulator:0,
            /* Reporte Vendedores */
            optionsCompanies:{
                xaxis: {
                    labels: {
                        show: false,
                    }
                },
                colors: [],
                companySeries: [],
                plotOptions: {
                    bar: {
                        distributed: true,
                    }
                },
            }
        }
    },
    created () {
        this.companies = this.$store.state.company.companies
        this.optionsCompanies.companySeries = [this.companiesByPhases]
        this.optionsCompanies.colors = this.colorsPhases 
        this.render()
    },
    computed: {
        /* Grafica Ventas por Vendedor */
        companiesByPhases(){
            var clients = this.companies 
            .map(client => {
                return {
                    x: client.phase_id,
                    y: 1,
                }
            })
            var obj = clients.sort(function(b,a){
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
                    x: this.phase(venta.x),
                    y: venta.y,
                }
            })
            var resultado = {
                data: perro,
            }
            return resultado
        },
        /* lista de usuarios */
        phaseLists() {
            return this.$store.state.phase.phases;
        },
        colorsPhases(){
            return this.$store.state.phase.phases.map(phase=>phase.color)
        }
   },
   methods:{
        /* Nombre de vendedor */
        phase(id) {
            if(id==null || id==undefined || id=='' || id=='null' || id=='NULL'){
                return 'No definidio'
            }else{
                return this.phaseLists.filter(phase => phase.id == id).map(phase => phase.name)[0];
            }
        },
        /* cargar info */
        render(){
            this.optionsCompanies.companySeries = [this.companiesByPhases]
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
    },
}
</script>
<style>