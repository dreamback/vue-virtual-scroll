<template>
  <div class="vue-virtual-scroll__viewport" ref="viewport" @scroll="handlerScroll">
    <div class="vue-virtual-scroll__scroller" ref="scroller"></div>
    <div class="vue-virtual-scroll__content" ref="items" :style="{transform:'translate3d(0, '+offsetTop+'px, 0)'}">
      <slot
        v-for="item in visibleData"
        :item="item">
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VueVirtualScroll',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    size: Number, // 单条数据的高度, 如果variable为true时，size为预估大小
    prerender: { // 数据上下扩大渲染范围
      type: Number,
      default: 5
    },
    variable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      height: 0, // viewport高度
      visibleData: [], // 渲染数据
      offsetTop: 0, // 偏移量
      startIndex: 0, // 开始索引
      endIndex: 0, // 结束索引
      remain: 10, // 可视区域多少条数据
      cacheData: []
    }
  },
  computed: {

  },
  watch: {
    data (newValue, oldValue) {
      this.init()
      this.initCacheData()
    }
  },
  mounted () {
    const viewport = this.$refs.viewport
    this.height = viewport.clientHeight
    this.remain = Math.ceil(this.height / this.size)
  },
  updated () {
    const items = this.$refs.items.childNodes
    items.forEach((el, index) => {
      index = parseInt(el.getAttribute('index'))
      const { height } = el.getBoundingClientRect()
      if (index) {
        this.cacheData[index].top = this.cacheData[index - 1].bottom
      } else {
        this.cacheData[0].top = 0
      }
      this.cacheData[index].height = height
      this.cacheData[index].bottom = this.cacheData[index].top + height
    })
    if (this.variable) {
      this.$refs.scroller.style.height = this.cacheData[this.cacheData.length - 1].bottom + 'px'
    }
  },
  methods: {
    init () {
      this.$refs.scroller.style.height = (this.data.length * this.size) + 'px'
      this.$nextTick(() => {
        this.handlerScroll()
      })
    },
    handlerScroll () {
      const scrollTop = this.$refs.viewport.scrollTop
      if (!this.variable) { // item 固定高度
        let startIndex = Math.floor(scrollTop / this.size) - this.prerender
        let endIndex = Math.ceil((scrollTop + this.height) / this.size) + this.prerender

        startIndex = startIndex >= 0 ? startIndex : 0
        endIndex = endIndex < this.data.length ? endIndex : this.data.length - 1

        this.offsetTop = startIndex * this.size

        this.startIndex = startIndex
        this.endIndex = endIndex
      } else { // item 不固定高度
        this.startIndex = this.getVariableStartIndex(scrollTop)
        this.endIndex = this.startIndex + this.remain + this.prerender
        this.offsetTop = this.cacheData[this.startIndex].top
      }
      // 返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
      this.visibleData = this.data.slice(this.startIndex, this.endIndex + 1)
    },

    getVariableStartIndex (val) {
      // 二分查找法
      let start = 0
      let end = this.cacheData.length - 1
      let tempIndex = null
      while (start <= end) {
        let midIndex = parseInt((start + end) / 2)
        let midVal = this.cacheData[midIndex].bottom
        if (midVal === val) {
          return midIndex
        } else if (val > midVal) {
          start = midIndex + 1
        } else if (val < midVal) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex
          }
          end = end - 1
        }
      }

      return tempIndex
    },

    initCacheData () {
      this.data.map((el, index) => {
        this.cacheData.push({
          _index: index,
          top: this.size * index,
          height: this.size * (index + 1),
          bottom: this.size * (index + 1)
        })
      })
    }
  }
}
</script>
<style lang='scss'>
  .vue-virtual-scroll__viewport{
    overflow-y:auto;
    background: #eee;
    position: relative;
    .vue-virtual-scroll__scroller{}
    .vue-virtual-scroll__content{
      position: absolute;
      top:0;
      width: 100%;
    }
  }
</style>
