<template>
  <div>
    <ul class="list-group">
      <li class="list-group-item" v-for="item in items" :key="item.id">
        {{ item.title }} - $ {{ item.price }}
        <button
          @click="$emit('remove-from-cart',item)"
          class="btn badge badge-warning float-right"
        >Remove</button>
      </li>
    </ul>
    <div class="card p-3 my-5">
      <h4 class="text-center">Total Price: ${{total}}</h4>
    </div>
  </div>
</template>
<script>
export default {
  props: ["items"],
  computed: {
    total() {
      return this.items.reduce((acc, item) => acc + item.price, 0);
    }
  }
};
</script>