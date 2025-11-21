<template>
  <div>
    <slot v-if="initializing" name="initializing">
      <span>Loading...</span>
    </slot>
    <slot v-else-if="loading" name="loading" />
    <table v-else class="w-full">
      <thead
        v-show="showHeader"
        :class="{
          'hidden md:table-header-group': $scopedSlots['mobileCard'],
          'sticky top-0 !bg-red-600 z-10': stickyHeader
        }"
      >
        <slot name="headers">
          <tr class="w-full">
            <th
              v-for="heading in headers"
              :key="heading.value"
              :class="[headerClasses, getAlignmentClass(heading.align)]"
            >
              {{ heading.text }}
            </th>
          </tr>
        </slot>
      </thead>
      <template v-if="noData">
        <td :colspan="headers?.length">
          <slot name="noData">{{ noDataText }} </slot>
        </td>
      </template>
      <tbody>
        <template v-if="$scopedSlots['mobileCard']">
          <tr
            v-for="(rowItem, key) in slicedItems"
            :key="'mobileCard' + key"
            :class="{
              'md:hidden': $scopedSlots['mobileCard']
            }"
          >
            <td
              class="py-4"
              :class="{
                'border-b border-secondary-100': key !== slicedItems.length - 1
              }"
            >
              <slot name="mobileCard" :item="rowItem" />
            </td>
          </tr>
        </template>
        <tr
          v-for="(rowItem, key) in slicedItems"
          :key="key"
          :class="[
            rowClasses,
            {
              'hidden md:table-row': $scopedSlots['mobileCard']
            }
          ]"
          @click="handleClick(rowItem)"
        >
          <td
            v-for="(rowData, index) in headers"
            :key="index"
            :class="[
              getAlignmentClass(rowData.align),
              'text-white text-xs p-2'
            ]"
            :dir="rowData.dir || undefined"
          >
            <slot :name="rowData.value" :item="rowItem">
              <span>{{ rowItem[rowData.value] }}</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  name: 'CTable',
  props: {
    page: {
      type: [Number, String],
      default: 1,
      validator(value) {
        return !isNaN(value)
      }
    },
    initializing: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    itemsCount: {
      type: [Number, String],
      required: true,
      validator(value) {
        return !isNaN(value)
      }
    },
    itemsPerPage: {
      type: [Number, String],
      default: 10,
      validator(value) {
        return !isNaN(value)
      }
    },
    hoverEffect: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: String,
      default: undefined
    },
    searchModel: {
      type: [Number, String],
      default: undefined
    },
    isRowBordersVisible: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    stickyHeader: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _page: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('paginate', val)
      }
    },
    noData() {
      return !this.items?.length
    },
    slicedItems() {
      if (this.itemsPerPage >= this.items.length || this.searchModel)
        return this.items
      const start = this.itemsPerPage * (this.page - 1)
      const end = start + this.itemsPerPage
      return this.items.slice(start, end)
    },
    headerClasses() {
      const defaultClasses = 'group text-sm font-medium p-2 whitespace-nowrap'
      return [defaultClasses]
    },
    rowClasses() {
      const defaultClasses = this.isRowBordersVisible
        ? 'border-b border-secondary-100 last-of-type:border-0'
        : ''
      const hoverClasses = this.hoverEffect ? 'hover:bg-gray-100' : undefined
      return [defaultClasses, hoverClasses]
    }
  },
  methods: {
    handleClick(item) {
      this.$emit('click', item)
    },
    getAlignmentClass(alignment) {
      switch (alignment) {
        case 'right':
          return 'text-right'
        case 'left':
          return 'text-left'
        case 'center':
          return 'text-center'
        default:
          return 'text-left'
      }
    },
    paginate(value) {
      this._page = value
    }
  }
}
</script>
