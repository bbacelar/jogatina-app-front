<template>
  <q-page padding>
    <div
      v-if="isLoaded"
      class="row q-pa-md q-col-gutter-md"
    >
      <div class="col-md-4 col-xs-12">
        <HomeCard :header="$t('home.next_play')">
          <template v-if="userStats.playsCount > 0">
            <div class="text-h6 text-center text-secondary">
              {{ nextPlay.bg_name }}
            </div>
            <q-separator />
            <q-card-actions align="center">
              <q-chip
                dense
                square
                outline
                icon="fas fa-map-marker-alt"
                color="primary"
              >
                {{ nextPlay.play_location }}
              </q-chip>
              <q-chip
                dense
                square
                outline
                icon="fas fa-calendar-day"
                color="primary"
              >
                {{ formatDate(nextPlay.play_date) }}
              </q-chip>
            </q-card-actions>
          </template>
          <p v-else>
            --
          </p>
        </HomeCard>
      </div>
      <div class="col-md-4 col-xs-12">
        <HomeCard :header="$t('home.plays', 2)">
          <div class="text-h6 text-center text-secondary">
            {{ userStats.playsCount }}
          </div>
        </HomeCard>
      </div>
      <div class="col-md-4 col-xs-12">
        <HomeCard :header="$t('home.groups', 2)">
          <q-list
            dense
            separator
          >
            <q-item
              v-for="group in userGroups"
              :key="group.id"
              v-ripple
              clickable
              class="text-secondary"
              :to="{ name: 'group-detail', params: { groupId: group.id } }"
            >
              {{ group.name }}
            </q-item>
          </q-list>
        </HomeCard>
      </div>
    </div>
    <q-inner-loading :showing="!isLoaded">
      <q-spinner-gears
        size="50px"
        color="primary"
      />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { updateUser, getStats } from 'src/services/users';
import HomeCard from 'src/components/HomeCard';
export default {
  components: {
    HomeCard
  },
  data () {
    return {
      userStats: {},
      isLoaded: false
    };
  },
  computed: {
    userGroups () {
      return this.userStats.groups;
    },
    nextPlay () {
      return this.userStats.nextPlay;
    }
  },
  async mounted () {
    this.$state.title = 'Jogatina';
    await updateUser({
      id: this.$auth.user.sub,
      name: this.$auth.user.name,
      email: this.$auth.user.email,
      picture: this.$auth.user.picture
    });
    getStats().then(response => {
      this.userStats = response.data;
      this.isLoaded = true;
    });
  },
  methods: {
    formatDate (date) {
      return new Date(date).toLocaleString();
    }
  }
};
</script>

<style></style>
