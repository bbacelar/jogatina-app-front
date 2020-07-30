<template>
  <transition
    mode="out-in"
    name="dialog-fade"
  >
    <template v-if="isParentRoute">
      <q-page padding>
        <q-table
          :data="plays"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="id"
          :grid="isGrid"
          :filter="filter"
          :title="!$q.screen.xs ? 'Plays' : ''"
          :hide-header="isGrid"
          :loading="loading"
        >
          <template v-slot:loading>
            <q-inner-loading
              showing
            >
              <q-spinner-gears
                size="50px"
                color="primary"
              />
            </q-inner-loading>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              class="cursor-pointer"
              @click="goToDetail(props)"
            >
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.value }}
              </q-td>
            </q-tr>
          </template>
          <template v-slot:item="props">
            <div
              class="cursor-pointer col-md-2 col-xs-6 column items-center q-pa-xs"
              @click="goToDetail(props)"
            >
              <play-card
                :play="props.row"
                :height="$q.screen.xs ? '120px' : '150px'"
                width="100%"
              />
            </div>
          </template>
          <template v-slot:top>
            <q-btn
              v-if="!$q.screen.xs"
              color="primary"
              unelevated
              @click="addNewPlay"
            >
              {{ $t('actions.new') }}
            </q-btn>
            <q-space />
            <q-btn
              flat
              round
              dense
              :icon="isGrid ? 'fas fa-th-list' : 'fas fa-th'"
              @click="isGrid = !isGrid"
            >
              <q-tooltip
                v-close-popup
                :disable="$q.platform.is.mobile"
              >
                {{ isGrid ? "List" : "Grid" }}
              </q-tooltip>
            </q-btn>
            <q-input
              v-model="filter"
              dense
              debounce="500"
              :placeholder="$t('labels.search')"
              class="q-pa-md"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
        <q-page-sticky
          v-if="$q.screen.xs"
          position="bottom-right"
          :offset="[18, 18]"
        >
          <q-btn
            fab
            icon="fas fa-plus"
            color="primary"
            @click="addNewPlay"
          />
        </q-page-sticky>
      </q-page>
    </template>
    <router-view
      v-else-if="currentPlay"
      :key="$route.path"
      :current-play="currentPlay"
      @update:play="refreshPlays"
    />
  </transition>
</template>

<script>
import PlayCard from 'src/components/plays/PlayCard.vue';
import playsController from 'src/services/plays';
export default {
  name: 'PlayList',
  components: {
    PlayCard
  },
  data () {
    return {
      loading: true,
      isGrid: false,
      filter: '',
      plays: [],
      visibleColumns: [
        'name',
        'minPlayers',
        'maxPlayers',
        'playingTime',
        'date'
      ],
      columns: [
        { name: 'id', label: 'Id', field: 'id' },
        { name: 'image', label: this.$t('labels.image'), field: 'bg_image_url' },
        { name: 'name', label: this.$t('labels.name'), field: 'bg_name', align: 'left' },
        {
          name: 'date',
          label: this.$t('labels.date'),
          field: 'play_date',
          align: 'left',
          format: val => {
            return new Date(val).toLocaleString();
          }
        },
        {
          name: 'minPlayers',
          label: `Min ${this.$tc('labels.player', 2)}`,
          field: 'bg_min_players',
          align: 'left'
        },
        {
          name: 'maxPlayers',
          label: `Max ${this.$tc('labels.player', 2)}`,
          field: 'bg_max_players',
          align: 'left'
        },
        {
          name: 'playingTime',
          label: this.$t('play.playing_time'),
          field: 'bg_playing_time',
          align: 'left'
        },
        {
          name: 'userOwnerId',
          label: 'userOwnerId',
          field: 'user_owner_id',
          align: 'left'
        }
      ]
    };
  },
  computed: {
    isParentRoute () {
      return this.$route.name === 'play-list';
    },
    currentPlay () {
      return this.plays.find(row => row.id === this.routeParam);
    },
    routeParam () {
      return this.$route.params.playId;
    }
  },
  watch: {
    async '$route.name' (newValue) {
      this.$state.title = newValue === 'play-list' ? this.$tc('labels.play', 2) : this.$state.title;
      await this.getPlays();
    }
  },
  async mounted () {
    this.$state.title = this.$tc('labels.play', 2);
    await this.getPlays();
  },
  methods: {
    async getPlays () {
      try {
        this.loading = true;
        const result = await playsController.getPlays();
        this.plays = result.data;
      } catch {
        this.$q.notify({ type: 'negative', message: 'Error on retrieve plays' });
      } finally {
        this.loading = false;
      }
    },
    goToDetail (playRow) {
      this.$router.push({
        name: 'play-detail',
        params: { playId: playRow.row.id }
      });
    },
    async refreshPlays () {
      await this.getPlays();
    },
    addNewPlay () {
      this.$router.push({
        name: 'add-play'
      });
    }
  }
};
</script>

<style>
</style>
