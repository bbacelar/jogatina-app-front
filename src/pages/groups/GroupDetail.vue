<template>
  <transition
    name="dialog-fade"
    mode="out-in"
  >
    <div
      v-if="isParentRoute"
      key="grpDetail"
    >
      <q-page padding>
        <q-card>
          <template v-if="!loading">
            <q-card-section
              class="text-center text-white bg-accent"
            >
              <div class="text-h5">
                {{ selectedGroup.name }}
                <q-btn
                  v-if="userIsOwner && !$q.screen.xs"
                  round
                  tooltip="Edit"
                  size="xs"
                  color="primary"
                  icon="fas fa-pen"
                  @click="editGroup = true"
                >
                  <q-tooltip>{{ $t('actions.edit') }}</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="userIsOwner && !$q.screen.xs"
                  round
                  tooltip="Delete"
                  size="xs"
                  color="red-10"
                  icon="fas fa-trash-alt"
                  style="margin-left: 5px"
                  @click="deleteGroup"
                >
                  <q-tooltip>{{ $t('actions.delete') }}</q-tooltip>
                </q-btn>
              </div>
              <div class="text-subtitle-1">
                <i class="fas fa-map-marker-alt" />
                {{ selectedGroup.city }} - {{ selectedGroup.uf }} / {{ $t('labels.members') }}:
                {{ users.length }}
              </div>
            </q-card-section>
            <q-separator />
            <template v-if="isUserInThisGroup">
              <q-tabs
                v-model="tab"
                class="text-secondary"
                align="justify"
              >
                <q-tab
                  :label="$t('labels.members')"
                  name="members"
                />
                <q-tab
                  :label="$tc('labels.play', 2)"
                  name="plays"
                />
              </q-tabs>
              <q-card-section>
                <q-tab-panels
                  ref="panels"
                  v-model="tab"
                  v-touch-swipe.left.right="handleSwipe"
                  animated
                >
                  <q-tab-panel
                    name="members"
                    class="group-panel"
                  >
                    <div class="text-center truncate-chip-labels fit">
                      <q-scroll-area class="fit">
                        <q-chip
                          v-for="user in users"
                          :key="user.id"
                          :dense="$q.screen.xs"
                          :removable="canRemoveUser(user.id)"
                          @remove="deleteUserFromGroup(user.id)"
                        >
                          <q-avatar>
                            <img
                              :src="user.picture"
                              draggable="false"
                            >
                          </q-avatar>
                          <div class="ellipsis">
                            {{ user.name }}
                            <q-tooltip>{{ user.name }}</q-tooltip>
                          </div>
                        </q-chip>
                      </q-scroll-area>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel
                    name="plays"
                    class="group-panel"
                  >
                    <q-scroll-area class="fit">
                      <q-list
                        separator
                        :dense="$q.screen.xs"
                      >
                        <q-item
                          v-for="play in plays"
                          :key="play.id"
                          v-ripple
                          clickable
                          @click="showPlayDetail(play)"
                        >
                          <q-item-section avatar>
                            <q-avatar>
                              <img
                                :src="play.bg_thumb_url"
                                draggable="false"
                              >
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label lines="2">
                              {{ play.bg_name }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label
                              lines="2"
                              style="font-size: small"
                            >
                              {{
                                new Date(play.play_date).toLocaleString(
                                  $q.lang.getLocale(),
                                  {
                                    dateStyle: "short"
                                  }
                                )
                              }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-scroll-area>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card-section>
            </template>
            <q-card-section v-else>
              <div class="text-center">
                <q-btn
                  rounded
                  color="primary"
                  @click="enterGroup"
                >
                  {{ $t('labels.enter') }}
                </q-btn>
              </div>
            </q-card-section>
          </template>
        </q-card>
        <q-dialog
          ref="qdialog"
          v-model="editGroup"
          transition-show="scale"
          transition-hide="scale"
        >
          <edit-group
            :prop-group="selectedGroup"
            @hide-dialog="groupEdited"
            @update:group="selectedGroup = { ...$event }"
          />
        </q-dialog>
        <q-page-sticky
          v-if="$q.screen.xs && userIsOwner"
          position="bottom-right"
          :offset="[18, 18]"
        >
          <q-btn
            fab
            icon="fas fa-pen"
            color="primary"
            @click="editGroup = true"
          />
        </q-page-sticky>
      </q-page>
      <q-inner-loading :showing="loading">
        <q-spinner-gears
          size="50px"
          color="primary"
        />
      </q-inner-loading>
    </div>
    <router-view
      v-else
      :key="$route.path"
      @update:play="refreshPlays()"
    />
  </transition>
</template>

<script>
import usersService from 'src/services/users';
import groupsService from 'src/services/groups';
import { getPlaysByGroupId } from 'src/services/plays';
import EditGroup from 'src/components/groups/CreateEditGroup.vue';
export default {
  name: 'GroupsDetail',
  components: {
    EditGroup
  },
  props: {
    groupId: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      tab: 'members',
      editGroup: false,
      users: [],
      loading: true,
      plays: [],
      selectedGroup: {}
    };
  },
  computed: {
    userIsOwner () {
      return this.selectedGroup.user_owner_id === this.$auth.user.sub;
    },
    isUserInThisGroup () {
      return this.users.findIndex(usr => usr.id === this.$auth.user.sub) !== -1;
    },
    isParentRoute () {
      return this.$route.name === 'group-detail';
    }
  },
  watch: {
    '$route.name' (newValue) {
      this.$state.title =
        newValue === 'group-detail' ? this.$tc('labels.group', 1) : this.$state.title;
    }
  },
  async mounted () {
    this.$state.title = this.$tc('labels.group', 1);
    await this.fetchData();
  },
  methods: {
    async fetchData () {
      try {
        this.loading = true;
        await this.getGroup();
        await this.getUsers();
        await this.getPlays();
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Error on retrieve group detail'
        });
      } finally {
        this.loading = false;
      }
    },
    canRemoveUser (usrId) {
      return this.userIsOwner && usrId !== this.$auth.user.sub;
    },
    showPlayDetail (playToShow) {
      this.$router.push({
        name: 'group-play-detail',
        params: { playId: playToShow.id }
      });
    },
    async getGroup () {
      const response = await groupsService.getGroupById(this.groupId);
      this.selectedGroup = response.data;
    },
    async getUsers () {
      try {
        const response = await usersService.getUsersByGroupId(
          this.selectedGroup.id
        );
        this.users = response.data;
      } catch {
        this.$q.notify({ type: 'negative', message: 'Error on get users.' });
      }
    },
    async getPlays () {
      try {
        const response = await getPlaysByGroupId(this.selectedGroup.id);
        this.plays = response.data;
      } catch {
        this.$q.notify({
          type: 'negative',
          message: 'Error on retrieve plays.'
        });
      }
    },
    groupEdited () {
      this.$refs.qdialog.hide();
    },
    async enterGroup () {
      try {
        await groupsService.addCurrentUserInGroup(this.selectedGroup.id);
        await this.getUsers();
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Error: ' + error });
      }
    },
    async deleteUserFromGroup (usrId) {
      try {
        await groupsService.deleteUserFromGroup(
          usrId,
          this.selectedGroup.id
        );
        this.users.splice(
          this.users.findIndex(usr => usr.id === usrId),
          1
        );
        this.$q.notify({
          type: 'positive',
          message: 'User removed!'
        });
      } catch {
        this.$q.notify({
          type: 'negative',
          message: 'Error when trying to remove user'
        });
      }
    },
    async refreshPlays () {
      await this.getPlays();
    },
    async deleteGroup () {
      try {
        await groupsService.deleteGroup(this.selectedGroup.id);
        this.$q.notify({ type: 'positive', message: 'Group deleted' });
        this.$emit('refresh');
        this.$router.go(-1);
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Error on delete group' });
      }
    },
    handleSwipe ({ direction }) {
      direction === 'right' ? this.$refs.panels.previous() : this.$refs.panels.next();
    }
  }
};
</script>

<style lang="scss" scoped>
.truncate-chip-labels > .q-chip {
  max-width: 140px;
}

.group-panel {
  padding: 0;
  height: 45vh;
}
</style>
