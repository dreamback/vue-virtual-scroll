<template>
  <div id="app">
    <vue-virtual-scroll :data="data" :size="80" :prerender="20" :variable="true" style="height:400px;width:350px">
        <template v-slot="{item}">
          <div class="scroll-item" :index="item.index">
              {{item.id}}-{{item.title}}
          </div>
        </template>
    </vue-virtual-scroll>
  </div>
</template>

<script>
import VueVirtualScroll from '@/components/vue-virtual-scroll'
export default {
  name: 'App',
  data () {
    return {
      data: []
    }
  },
  components: {
    VueVirtualScroll
  },
  created () {
    this.$http.get('/api/data').then(({data: res}) => {
      this.data = res.data
    })
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.scroll-item{
  padding: 10px;
  border-bottom: 1px solid #f00;
}
</style>
