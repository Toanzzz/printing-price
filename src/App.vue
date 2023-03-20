<template>
  <main>
    <section class="paper">
      <span>Select Pager Size</span>
      <select name="paperSize" v-model="paperSize">
        <option v-for="s of paperSizes" :key="s" :value="s">{{ s }}</option>
      </select>
      <button @click="getPriceData(paperSize)" :class="{ loading: isLoading }" :disabled="isLoading">
        Apply
      </button>
    </section>
    <section class="price">
      <span>Price table</span>
      <table :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th :rowspan="2">Quanlity</th>
            <th :colspan="5">Deliver in (business days)</th>
          </tr>
          <tr>
            <th v-for="(_, i) in colNum">{{ i }}</th>
          </tr>
        </thead>
        <tbody @mouseleave="handleHoverCell(-1, -1)">
          <tr v-for="(data, i) of priceData" :key="i">
            <th>{{ data[0].quantity }}</th>
            <td v-for="(_, j) in colNum" :key="j" :class="getCellClases(i, j)" @click="handleSelectCell(i, j)"
              @mouseenter="handleHoverCell(i, j)">
              {{ formatPrice(data[j].price) }}
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="isFullView = true" v-if="!isFullView">See More</button>
    </section>
    <section class="summary">
      <span>Order Price:
        {{ selectedPrice ? `¥${formatPrice(selectedPrice)}` : '' }}</span>
      <button>Cart</button>
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import formatPrice from './helpers/formatPrice'

const API = 'http://us-central1-fe-ws-test.cloudfunctions.net/prices'
const colNum = 5
enum PaperSizes {
  A4 = 'A4',
  A5 = 'A5',
  B4 = 'B4',
  B5 = 'B5',
}
type PriceRawData = Array<
  Array<{
    business_day: number
    price: number
    quantity: number
  }>
>

export default defineComponent({
  name: 'App',
  setup: () => {
    const paperSize = ref(PaperSizes.A4)
    const priceRawData = ref<PriceRawData>([])
    const isFullView = ref(false)
    const isLoading = ref(false)
    const selectedX = ref(-1)
    const selectedY = ref(-1)
    const hoverX = ref(-1)
    const hoverY = ref(-1)
    const selectedPrice = computed<number | null>(() => {
      try {
        return priceRawData.value[selectedX.value][selectedY.value].price
      } catch {
        return null
      }
    })
    const priceData = computed(() =>
      isFullView.value ? priceRawData.value : priceRawData.value.slice(0, 5)
    )
    const getPriceData = async (size: PaperSizes) => {
      isLoading.value = true
      try {
        console.log('loading data for', size)
        const res = await fetch(`${API}?paper_size=${size}`)
        const json = await res.json()
        console.log('Loaded data', json)
        priceRawData.value = json.prices
      } finally {
        isLoading.value = false
      }
    }
    const handleHoverCell = (x: number, y: number) => {
      hoverX.value = x
      hoverY.value = y
    }
    const handleSelectCell = (x: number, y: number) => {
      selectedX.value = x
      selectedY.value = y
    }
    const getCellClases = (x: number, y: number) => ({
      highlight: hoverX.value === x || hoverY.value === y,
      selected: selectedX.value === x && selectedY.value === y,
      hover: hoverX.value === x && hoverY.value === y,
    })

    onMounted(() => getPriceData(paperSize.value))

    return {
      paperSizes: Object.keys(PaperSizes),
      paperSize,
      priceData,
      getPriceData,
      selectedX,
      selectedY,
      handleSelectCell,
      handleHoverCell,
      selectedPrice,
      getCellClases,
      isFullView,
      formatPrice,
      isLoading,
      colNum,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  max-width: calc(100% - 80px);
  margin: 30px auto;
}

#app button,
#app select {
  background: white;
  padding: 8px 16px;
  min-width: 80px;
  border: none;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td,
th {
  background-color: white;
  border: 1px solid #ccc;
  padding: 4px 8px;
  text-align: left;
}

td {
  cursor: pointer;
}
</style>

<style scoped>
main {
  display: grid;
  grid: 1fr / 1fr 3fr;
  gap: 32px;
}

.paper,
.price,
.summary {
  background-color: #eceaea;
  padding: 16px;
}

.paper {
  display: grid;
  grid: min-content 1fr min-content/ 1fr;
  gap: 8px;
}

.paper>select {
  align-self: start;
}

.paper>button {
  justify-self: end;
}

.summary {
  grid-column: 1 / span 2;
  text-align: right;
}

.highlight {
  background-color: #eee;
}

.hover {
  background-color: #ccc;
}

.selected {
  box-shadow: inset 0 0 0 1px blueviolet;
}

.loading {
  opacity: 0.5;
}
</style>