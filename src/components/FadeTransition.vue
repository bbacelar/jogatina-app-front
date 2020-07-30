<template>
  <transition-group
    mode="out-in"
    name="fade"
  >
    <slot />
  </transition-group>
</template>

<script>
export default {

};
</script>

<style>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
