<template>
  <q-page padding>
    <q-card>
      <template v-if="!loading">
        <q-card-section class="bg-accent text-center text-white">
          <div class="text-h5">
            {{ localPlay.bg_name }}
            <q-btn
              v-if="userIsOwner && !$q.screen.xs"
              round
              :tooltip="$t('actions.edit')"
              size="xs"
              color="primary"
              icon="fas fa-pen"
              @click="editPlay = true"
            >
              <q-tooltip>{{ $t('actions.edit') }}</q-tooltip>
            </q-btn>
            <q-btn
              v-if="userIsOwner && !$q.screen.xs"
              round
              :tooltip="$t('actions.delete')"
              size="xs"
              color="red-10"
              icon="fas fa-trash-alt"
              style="margin-left: 5px"
              @click="deletePlay"
            >
              <q-tooltip>{{ $t('actions.delete') }}</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!userIsOwner && !isUserInPlay && !$q.screen.xs && canEnterInPlay"
              round
              :tooltip="$t('labels.enter')"
              size="xs"
              color="green-10"
              icon="fas fa-sign-in-alt"
              style="margin-left: 5px"
              @click="enterPlay"
            >
              <q-tooltip>{{ $t('labels.enter') }}</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!userIsOwner && isUserInPlay && !$q.screen.xs"
              round
              :tooltip="$t('labels.leave')"
              size="xs"
              color="red-10"
              icon="fas fa-sign-out-alt"
              style="margin-left: 5px"
              @click="leavePlay"
            >
              <q-tooltip>{{ $t('labels.leave') }}</q-tooltip>
            </q-btn>
          </div>
          <div class="text-subtitle-1">
            <i class="fas fa-map-marker-alt" />
            {{ localPlay.play_location }}
            <i class="fas fa-calendar-day" />
            {{ formattedDate }}
          </div>
        </q-card-section>
        <q-separator />
        <q-tabs
          v-model="tab"
          class="text-secondary"
          align="justify"
        >
          <q-tab
            :label="`${$tc('labels.player', 2)} (${players.length}/${currentPlay.bg_max_players})`"
            name="players"
          />
        </q-tabs>
        <q-card-section>
          <q-tab-panels
            v-model="tab"
            animated
          >
            <q-tab-panel
              name="players"
              class="group-panel"
            >
              <div class="text-center truncate-chip-labels fit">
                <q-scroll-area class="fit">
                  <q-chip
                    v-for="player in players"
                    :key="player.id"
                    :removable="canRemoveUser(player.id)"
                    size="15px"
                    @remove="deleteUserFromPlay(player.id)"
                  >
                    <q-avatar>
                      <img :src="player.picture">
                    </q-avatar>
                    <div class="ellipsis">
                      {{ player.name }}
                      <q-tooltip>{{ player.name }}</q-tooltip>
                    </div>
                  </q-chip>
                </q-scroll-area>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </template>
      <q-inner-loading :showing="loading">
        <q-spinner-gears
          size="50px"
          color="primary"
        />
      </q-inner-loading>
    </q-card>
    <q-dialog
      ref="qdialog"
      v-model="editPlay"
      transition-show="scale"
      transition-hide="scale"
    >
      <EditPlay
        :play-prop="localPlay"
        @update:play="playUpdated($event)"
      />
    </q-dialog>
    <q-page-sticky
      v-if="$q.screen.xs"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-fab
        direction="up"
        vertical-actions-align="right"
        icon="fas fa-chevron-up"
        color="primary"
      >
        <q-fab-action
          v-if="userIsOwner"
          icon="fas fa-pen"
          color="primary"
          :label="$t('actions.edit')"
          label-position="left"
          @click="editPlay = true"
        />
        <q-fab-action
          v-else-if="canEnterInPlay"
          icon="fas fa-sign-in-alt"
          color="primary"
          :label="$t('labels.enter')"
          label-position="left"
          @click="enterPlay"
        />
        <q-fab-action
          v-else-if="isUserInPlay"
          icon="fas fa-sign-out-alt"
          color="primary"
          :label="$t('labels.leave')"
          label-position="left"
          @click="leavePlay"
        />
        <q-fab-action
          v-if="userIsOwner"
          icon="fas fa-trash-alt"
          color="red-10"
          :label="$t('actions.delete')"
          label-position="left"
          @click="deletePlay"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import EditPlay from 'src/components/plays/EditPlay.vue';
import usersController from 'src/services/users';
import { addUser, deleteUser, deletePlay } from 'src/services/plays';
import { date } from 'quasar';
const { formatDate } = date;
export default {
  name: 'PlayDetail',
  components: {
    EditPlay
  },
  props: {
    currentPlay: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: true,
      localPlay: { ...this.currentPlay },
      players: [],
      tab: 'players',
      editPlay: false
    };
  },
  computed: {
    userIsOwner () {
      return this.localPlay.user_owner_id === this.$auth.user.sub;
    },
    isUserInPlay () {
      return this.players.findIndex(usr => usr.id === this.$auth.user.sub) !== -1;
    },
    canEnterInPlay () {
      return (
        !this.isUserInPlay && +this.localPlay.bg_max_players > this.players.length
      );
    },
    formattedDate () {
      return formatDate(this.localPlay.play_date, 'YYYY-MM-DD HH:mm');
    }
  },
  async mounted () {
    this.$state.title = 'Play Detail';
    await this.fetchData();
  },
  methods: {
    async fetchData () {
      await this.getPlayers();
    },
    async getPlayers () {
      try {
        const response = await usersController.getUsersByPlayId(this.localPlay.id);
        this.players = response.data;
      } catch {
        this.$q.notify({ type: 'negative', message: 'Error on retrieve play' });
      } finally {
        this.loading = false;
      }
    },
    async deleteUserFromPlay (userId) {
      try {
        await deleteUser(userId, this.localPlay.id);
        await this.getPlayers();
      } catch (error) {}
    },
    async enterPlay () {
      try {
        await addUser(this.$auth.user.sub, this.localPlay.id);
        await this.getPlayers();
      } catch (error) {
        console.log(error);
      }
    },
    async leavePlay () {
      await this.deleteUserFromPlay(this.$auth.user.sub, this.localPlay.id);
    },
    async deletePlay () {
      try {
        await deletePlay(this.localPlay.id);
        this.$q.notify({ type: 'positive', message: 'Play deleted!' });
        this.$emit('update:play');
        this.$router.go(-1);
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error });
      }
    },
    playUpdated (data) {
      this.localPlay = { ...this.localPlay, ...data };
      this.$refs.qdialog.hide();
      this.$emit('update:play');
    },
    canRemoveUser (usrId) {
      return this.userIsOwner && usrId !== this.$auth.user.sub;
    }
  }
};
</script>

<style scoped>
.truncate-chip-labels > .q-chip {
  max-width: 140px;
}

.group-panel {
  padding: 0;
  height: 45vh;
}
</style>
