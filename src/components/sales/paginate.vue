<template>
  <div class="text-center">
    <v-pagination
      v-model="currentPage"
      :length="lastPage"
      :total-visible="4"
      class="pagination-style"
    ></v-pagination>
  </div>
</template>

<script>
export default {
    props:['store', 'collection', 'list'],
    watch:{
        currentPage(newVal, oldVal){
            this.paginatePage({'pageNumber':newVal});
        }
    },
    computed:{
        currentPage:{
            get(){
                if(this.$store.state[this.store][this.collection].length!=0&&this.$store.state[this.store][this.collection].meta!=undefined){
                    return this.$store.state[this.store][this.collection].meta.current_page;
                }
            },
            set(value){
                this.$store.commit(this.store + '/setCurrentPage', value);
            }
        },
        lastPage:{
            get(){
                if(this.$store.state[this.store][this.collection].length!=0&&this.$store.state[this.store][this.collection].meta!=undefined){
                    return this.$store.state[this.store][this.collection].meta.last_page;
                }
            }
        }
    },
    methods:{
        paginatePage(request){
            this.$store.dispatch(this.store + this.list, request);
        }
    }
}
</script>

<style>
.pagination-style .v-pagination__item, .pagination-style .v-pagination__navigation, .pagination-style .v-pagination__item--active  {
    box-shadow: none;
}
.pagination-style .v-pagination__item.v-pagination__item--active.primary {
    background-color: #3099fe !important;
    border-color: #3099fe !important;
}

</style>