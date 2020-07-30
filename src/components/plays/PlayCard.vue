<template>
  <q-card
    :style="cardClass"
  >
    <q-img
      :src="play.bg_image_url"
      basic
      spinner-color="blue_grey"
      v-bind="$attrs"
    >
      <div class="absolute-bottom text-subtitle2 text-center">
        <div class="row">
          <div class="col">
            {{ play.bg_name }}
          </div>
        </div>
        <div class="row ">
          <div class="col">
            <q-chip
              dense
              square
            >
              <q-avatar
                icon="fas fa-calendar"
                color="red"
                text-color="white"
              />
              {{ formatDate(play.play_date) }}
            </q-chip>
          </div>
        </div>
      </div>
    </q-img>
  </q-card>
</template>

<script>
import { date } from 'quasar';
export default {
  name: 'PlayCard',
  props: {
    play: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      cardClass: {
        width: this.$attrs.width,
        'max-width': '250px'
      }
    };
  },
  methods: {
    formatDate (dateToFormat) {
      return date.formatDate(dateToFormat, 'MMM DD');
    }
  }
};
</script>

<style>
.card .img {
  object-fit: cover;
}
</style>
