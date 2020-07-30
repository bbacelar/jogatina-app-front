<template>
  <q-input
    :value="inputValue"
    :label="$t('labels.date_time')"
    :rules="[val => !!val || $t('validation.required')]"
    @input="inputUpdateValue($event)"
  >
    <template v-slot:prepend>
      <WidgetDate
        :format="format"
        :value="inputValue"
        @input="widgetUpdateValue($event)"
      />
    </template>
    <template v-slot:append>
      <WidgetDateTime
        :format="format"
        :value="inputValue"
        @input="widgetUpdateValue($event)"
      />
    </template>
  </q-input>
</template>

<script>
import WidgetDate from './WidgetDate';
import WidgetDateTime from './WidgetDateTime';
import { date } from 'quasar';
import MixinDateTimeProps from './MixinPropsDateTime';
const { formatDate } = date;
export default {
  name: 'DateTime',
  components: {
    WidgetDate,
    WidgetDateTime
  },
  mixins: [MixinDateTimeProps],
  computed: {
    inputValue () {
      const localValue = formatDate(this.value, this.mask);
      if (!localValue) {
        return '';
      }
      return localValue;
    }
  },
  methods: {
    inputUpdateValue (value) {
      const input = formatDate(value, this.mask);
      if (input) {
        this.$emit('input', input);
        return;
      }
      this.$emit('input', '');
    },
    widgetUpdateValue (value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style>

</style>
