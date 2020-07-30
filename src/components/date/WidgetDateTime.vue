<template>
  <q-icon
    name="far fa-clock"
    class="cursor-pointer"
  >
    <q-popup-proxy
      ref="qDateTimeProxy"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-time
        :value="value"
        :mask="mask"
        format24h
        @input="dateTimeInput($event)"
      >
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn
            v-close-popup
            :label="$t('actions.cancel')"
            color="primary"
            flat
          />
          <q-btn
            v-close-popup
            label="OK"
            color="primary"
            flat
          />
        </div>
      </q-time>
    </q-popup-proxy>
  </q-icon>
</template>

<script>
import MixinDateTimeProps from './MixinPropsDateTime';
export default {
  name: 'WidgetDatetime',
  mixins: [MixinDateTimeProps],
  methods: {
    dateTimeInput (value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style>

</style>
