<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-md-6 col-xs-12">
        <q-input
          v-model="searchPattern"
          label="Board Game"
          clearable
          :loading="loadingState"
          @clear="showItems = false"
          @keyup.enter="doSearch"
        >
          <template v-slot:after>
            <q-btn
              color="primary"
              unelevated
              icon="fas fa-search"
              class="self-end"
              @click="doSearch"
            />
          </template>
          <q-menu
            v-model="showItems"
            max-height="400px"
            fit
            no-parent-event
            auto-close
          >
            <q-list
              bordered
              separator
            >
              <q-item
                v-for="bgitem in arrItems"
                :key="bgitem.id"
                v-ripple
                v-close-popup
                clickable
                @click="selectedBoardGame = bgitem"
              >
                <q-item-section avatar>
                  <q-avatar rounded>
                    <img :src="bgitem.images.thumb">
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{ bgitem.name }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-input>
      </div>
    </div>
    <fade-transition>
      <div
        v-if="selectedBoardGame"
        key="card"
        class="row justify-center q-pt-md"
      >
        <div class="col-md-6 col-xs-12 column items-center">
          <q-card class="card">
            <q-card-section horizontal>
              <q-img
                class="col"
                :src="selectedBoardGame.image_url"
                basic
                height="150px"
                spinner-color="blue-grey"
              />
              <q-list class="col">
                <q-item>
                  <q-item-section avatar>
                    <q-icon
                      color="primary"
                      name="fas fa-clock"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $t('play.playing_time') }}</q-item-label>
                    <q-item-label caption>
                      {{ selectedBoardGame.max_playtime }} min
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon
                      color="green"
                      name="fas fa-user"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ `Min. ${$tc('labels.player', 2)}:` }}</q-item-label>
                    <q-item-label caption>
                      {{ selectedBoardGame.min_players }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon
                      color="red"
                      name="fas fa-user-friends"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ `Max. ${$tc('labels.player', 2)}:` }}</q-item-label>
                    <q-item-label caption>
                      {{ selectedBoardGame.max_players }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-separator />
            <q-form ref="frmActions">
              <q-card-actions vertical>
                <date-time v-model="date" />
                <q-input
                  v-model="place"
                  :label="$t('labels.location')"
                  class="q-my-xs"
                  :rules="[val => !!val || $t('validation.required')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-map-marker-alt" />
                  </template>
                </q-input>
                <div class="row q-my-xs">
                  <div class="col">
                    <q-select
                      v-model="selectedGroup"
                      :label="$tc('labels.group', 1)"
                      :options="userGroups"
                      option-value="id"
                      option-label="name"
                      :rules="[val => !!val || $t('validation.required')]"
                    />
                  </div>
                </div>
                <q-btn
                  color="secondary"
                  unelevated
                  @click="addPlay"
                >
                  {{ $t('actions.add') }}
                </q-btn>
              </q-card-actions>
            </q-form>
          </q-card>
        </div>
      </div>
    </fade-transition>
  </q-page>
</template>

<script>
import FadeTransition from 'src/components/FadeTransition.vue';
import DateTime from 'src/components/date/DateTime.vue';
import groupController from 'src/services/groups';
import playController from 'src/services/plays';
import AtlasBg from 'src/services/bgatlas';
export default {
  name: 'AddPlay',
  components: {
    FadeTransition,
    DateTime
  },
  data () {
    return {
      loadingState: false,
      searchPattern: '',
      arrItems: [],
      userGroups: [],
      selectedType: null,
      selectedBoardGame: null,
      selectedGroup: null,
      date: '',
      place: '',
      showItems: false
    };
  },
  watch: {
    selectedBoardGame (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.arrItems = [];
      }
    }
  },
  mounted () {
    this.$state.title = this.$t('play.add');
  },
  async created () {
    const result = await groupController.getGroupsByUser();
    this.userGroups = result.data;
  },
  methods: {
    async doSearch () {
      this.selected = null;
      if (!this.searchPattern) return;
      this.loadingState = true;
      const response = await AtlasBg.searchBoardgame(this.searchPattern);
      this.arrItems = response.data;
      this.showItems = true;
      this.loadingState = false;
    },
    addPlay () {
      this.$refs.frmActions.validate().then(async success => {
        if (success) {
          try {
            const result = await playController.addPlay({
              bg_atlas_id: this.selectedBoardGame.id,
              bg_min_players: this.selectedBoardGame.min_players || 1,
              bg_max_players: this.selectedBoardGame.max_players || 1,
              bg_playing_time: this.selectedBoardGame.max_playtime || 1,
              bg_image_url: this.selectedBoardGame.image_url || '',
              bg_thumb_url: this.selectedBoardGame.images.thumb || '',
              bg_name: this.selectedBoardGame.name,
              user_owner_id: this.$auth.user.user_id,
              play_date: new Date(this.date).toISOString(),
              play_location: this.place,
              groupid: this.selectedGroup.id
            });
            this.$q.notify({
              type: 'positive',
              message: result.data
            });
            this.selectedBoardGame = null;
          } catch (error) {
            this.$q.notify({
              type: 'negative',
              message: 'Error on save: ' + error
            });
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.card {
  width: 100%;
  max-width: 400px;
}
</style>
