<template>
  <div ref="test"></div>
</template>

<script>
import { ref, onMounted } from "vue";
export default {
  name: "UpdatefileAbout",

  setup() {
    const test = ref(null);

    onMounted(() => {
      console.log(test.value);
    });


    return{test}
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="css" scoped>
</style>