<template>
  <q-card>
    <q-card-section>
      <q-form
        ref="frmPlay"
        autocomplete="off"
        @submit="savePlay"
      >
        <div class="row">
          <div class="col-12">
            <DateTime v-model="currentPlay.play_date" />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
              v-model.number="currentPlay.bg_max_players"
              type="number"
              :label="`Max ${$tc('labels.player', 2)}`"
              :rules="[val => !!val || $t('validation.required')]"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
              v-model="currentPlay.play_location"
              :label="$t('labels.location')"
              :rules="[val => !!val || $t('validation.required')]"
            />
          </div>
        </div>
        <div class="column items-end q-mt-xs">
          <div class="col q-gutter-xs">
            <q-btn
              v-close-popup
              color="secondary"
              unelevated
              :label="$t('actions.cancel')"
            />
            <q-btn
              color="primary"
              unelevated
              :label="$t('actions.save')"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import DateTime from 'src/components/date/DateTime.vue';
import { updatePlay } from 'src/services/plays';
export default {
  components: {
    DateTime
  },
  props: {
    playProp: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentPlay: { ...this.playProp }
    };
  },
  methods: {
    savePlay () {
      this.$refs.frmPlay.validate().then(async success => {
        if (success) {
          try {
            const payLoad = {
              id: this.currentPlay.id,
              play_date: new Date(this.currentPlay.play_date).toISOString(),
              bg_max_players: this.currentPlay.bg_max_players,
              play_location: this.currentPlay.play_location
            };
            await updatePlay(payLoad);
            this.$emit('update:play', payLoad);
          } catch (error) {
            this.$q.notify({ type: 'negative', message: 'Error on update: ' + error });
          }
        }
      });
    }
  }
};
</script>

<style></style>
