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
          'hidden md:table-header-group': $slots.mobileCard,
          'sticky top-0 !bg-white dark:!bg-[#1e1e1e] z-10': stickyHeader
        }"
      >
        <slot name="headers">
          <tr class="w-full">
            <!--            <th v-if="selectable" :class="[headerClasses]">
            <TCheckbox
              v-model="isAllItemsSelected"
              @input="toggleSelectAll"
            />
          </th>-->
            <th
              v-for="heading in _headers"
              :key="heading.value"
              :class="[
                headerClasses,
                getAlignmentClass(heading.align),
                { 'cursor-pointer': heading.sortable }
              ]"
              :dir="heading.dir || undefined"
              @click="sort(heading.sortable, heading.value)"
            ></th>
          </tr>
        </slot>
      </thead>
      <template v-if="noData">
        <td :colspan="headers?.length">
          <slot name="noData">{{ noDataText }} </slot>
        </td>
      </template>
      <tbody>
        <template v-if="$slots.mobileCard">
          <tr
            v-for="(rowItem, key) in slicedItems"
            :key="'mobileCard' + key"
            :class="{
              'md:hidden': $slots.mobileCard
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
              'hidden md:table-row': $slots.mobileCard
            }
          ]"
          @click="handleClick(rowItem)"
        >
          <td
            v-for="(rowData, index) in _headers"
            :key="index"
            :class="[
              getAlignmentClass(rowData.align),
              sizeClass,
              'text-white text-xs'
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
import { sort } from '~/utils/helpers.js'
import vModel from '~/mixins/vModel.js'

export default {
  name: 'Table',
  mixins: [vModel],
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
    size: {
      type: String,
      validator(value) {
        return ['md', 'sm', 'lg'].includes(value)
      }
    },
    hoverEffect: {
      type: Boolean,
      default: false
    },
    headerColor: {
      type: String,
      validator(value) {
        return ['transparent', 'grey'].includes(value)
      },
      default: 'transparent'
    },
    noDataText: {
      type: String,
      default: undefined
    },
    linkPath: {
      type: String,
      default: undefined
    },
    searchModel: {
      default: undefined
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    isRowBordersVisible: {
      type: Boolean,
      default: true
    },
    defaultSortKey: {
      type: String,
      default: null
    },
    defaultSortType: {
      type: String,
      validator(value) {
        return ['asc', 'desc'].includes(value)
      },
      default: null
    },
    selectable: {
      type: Boolean,
      default: false
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
  data() {
    return {
      sortOptions: {
        sortType: null,
        sortKey: null
      },
      isAllItemsSelected: false
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
    isDefaultSortValueDescendingAndSortTypeIsNull() {
      return this.defaultSortType === 'desc' && !this.sortOptions.sortType
    },
    _headers() {
      return this.$device.isMobile ? this.mobileHeaders : this.headers
    },
    noData() {
      return !this.items?.length
    },
    mobileHeaders() {
      return this.headers.filter((item) => !item.hideInMobile)
    },
    slicedItems() {
      if (
        !this.showPagination ||
        this.itemsPerPage >= this.sortedList.length ||
        this.searchModel
      )
        return this.sortedList
      const start = this.itemsPerPage * (this.page - 1)
      const end = start + this.itemsPerPage
      return this.sortedList.slice(start, end)
    },
    sortedList() {
      const list = [...this.items]
      if (
        !this.sortOptions.sortType &&
        this.defaultSortKey &&
        this.defaultSortType
      )
        return sort(list, this.defaultSortType, this.defaultSortKey)
      if (!this.sortOptions.sortType) return this.items
      return sort(list, this.sortOptions.sortType, this.sortOptions.sortKey)
    },
    headerClasses() {
      const defaultClasses = 'group text-sm font-medium p-2 whitespace-nowrap'
      const bgAndBorderClasses = this.getHeaderClasses(this.headerColor)
      return [defaultClasses, bgAndBorderClasses]
    },
    rowClasses() {
      const defaultClasses = this.isRowBordersVisible
        ? 'border-b border-secondary-100 last-of-type:border-0'
        : ''
      const hoverClasses = this.hoverEffect
        ? 'hover:bg-grey-alpha-50'
        : undefined
      return [defaultClasses, hoverClasses]
    },
    sizeClass() {
      switch (this.size) {
        case 'sm':
          return 'p-2'
        case 'lg':
          return 'py-4 px-2'
        default:
          return 'py-3 px-2'
      }
    }
  },
  methods: {
    toggleSelectAll(val) {
      this.$emit('input', val ? this.items : [])
    },
    checkIfItemIsChecked(item) {
      return this.model.includes(item)
    },
    handleClick(item) {
      this.$emit('click', item)
    },
    getAlignmentClass(alignment) {
      switch (alignment) {
        case 'right':
          return 'text-start'
        case 'left':
          return 'text-end'
        case 'center':
          return 'text-center'
        default:
          return 'text-start'
      }
    },
    getHeaderClasses(color) {
      switch (color) {
        case 'grey':
          return 'text-grey-600 bg-grey-alpha-50 rtl:first-of-type:pr-2 rtl:last-of-type:pl-2 rtl:first-of-type:rounded-tr rtl:first-of-type:rounded-br rtl:last-of-type:rounded-tl rtl:last-of-type:rounded-bl ltr:first-of-type:pl-2  ltr:last-of-type:pr-2  ltr:first-of-type:rounded-tl  ltr:first-of-type:rounded-bl  ltr:last-of-type:rounded-tr  ltr:last-of-type:rounded-br'
        default:
          return 'text-[#ffffff9f] bg-secondary-50'
      }
    },
    sort(isSortable, sortKey) {
      if (!isSortable) return
      this.sortOptions.sortKey = sortKey
      switch (this.sortOptions.sortType) {
        case null:
          return (this.sortOptions.sortType = 'asc')
        case 'asc':
          return (this.sortOptions.sortType = 'desc')
        case 'desc':
          return (this.sortOptions.sortType = null)
      }
    },
    paginate(value) {
      this._page = value
    },
    toggleRowItem(rowItem) {
      if (this.checkIfItemIsChecked(rowItem)) {
        this.model = this.model.filter((item) => item !== rowItem)
      } else {
        this.model.push(rowItem)
      }
      if (this.model.length === 1) {
        this.isAllItemsSelected = false
      }
    }
  }
}
</script>
