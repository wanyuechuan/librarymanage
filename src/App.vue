<template>
  <router-view class="contaienr" />
</template>

<script>


export default {
  name: "App",
  components: {
    
  },
};

// 解决ERROR ResizeObserver loop completed with undelivered notifications.

//问题的

const debounce = (fn, delay) => {

  let timer = null;

  return function () {

    let context = this;

    let args = arguments;

    clearTimeout(timer);

    timer = setTimeout(function () {

      fn.apply(context, args);

    }, delay);

  }

}

// 解决ERROR ResizeObserver loop completed with undelivered notifications.

//问题的

const _ResizeObserver = window.ResizeObserver;

window.ResizeObserver = class ResizeObserver extends _ResizeObserver {

  constructor(callback) {

    callback = debounce(callback, 16);

    super(callback);

  }

}

</script>

<style>

#app{
  width: 100%;
  height: 100%;
}


* {
  margin: 0;
  padding: 0; 
}
a{
  color: #777778;
  text-decoration: none;
}
body {
  width: 100%;
  height: 100vh;
}
.contaienr{
  width: 100%;
  height: 100%;
}

</style>
