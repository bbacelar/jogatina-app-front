<template>
  <q-icon
    name="fas fa-calendar-day"
    class="cursor-pointer"
  >
    <q-popup-proxy
      ref="qDateProxy"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-date
        :value="value"
        :mask="mask"
        @input="dateInput"
      />
    </q-popup-proxy>
  </q-icon>
</template>

<script>
import MixinDateTimeProps from './MixinPropsDateTime';
export default {
  name: 'WidgetDate',
  mixins: [MixinDateTimeProps],
  methods: {
    dateInput (value) {
      this.$refs.qDateProxy.hide();
      this.$emit('input', value);
    }
  }
};
</script>

<style>

</style>
