<template>
  <transition
    name="dialog-fade"
    mode="out-in"
  >
    <div
      v-if="isParentRoute"
      key="div"
    >
      <q-page padding>
        <q-table
          :data="groups"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="id"
          :filter="filter"
          :title="!$q.screen.xs ? $t('labels.group', 2) : ''"
          :loading="loading"
          @row-click="goToGroupDetail"
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
          <template
            v-slot:top
          >
            <q-btn
              v-if="!$q.screen.xs"
              color="primary"
              unelevated
              @click="addNewGroup = true"
            >
              {{ $t('actions.new') }}
            </q-btn>
            <q-space />
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
        <q-dialog
          ref="qdialog"
          v-model="addNewGroup"
          transition-show="scale"
          transition-hide="scale"
        >
          <add-group @hide-dialog="newGroupAdded" />
        </q-dialog>
        <q-page-sticky
          v-if="$q.screen.xs"
          position="bottom-right"
          :offset="[18, 18]"
        >
          <q-btn
            fab
            icon="fas fa-plus"
            color="primary"
            @click="addNewGroup = true"
          />
        </q-page-sticky>
      </q-page>
    </div>
    <router-view
      v-else
      key="router"
      @refresh="getGroups"
    />
  </transition>
</template>

<script>
import groupService from 'src/services/groups';
import AddGroup from 'src/components/groups/CreateEditGroup.vue';
export default {
  name: 'Groups',
  components: {
    AddGroup
  },
  data () {
    return {
      filter: '',
      addNewGroup: false,
      groups: [],
      visibleColumns: ['name', 'uf', 'city'],
      columns: [
        { name: 'id', label: 'id', field: 'id', align: 'left' },
        { name: 'name', label: this.$t('labels.name'), field: 'name', align: 'left', sortable: true },
        { name: 'uf', label: 'UF', field: 'uf', align: 'left' },
        { name: 'city', label: this.$t('labels.city'), field: 'city', align: 'left' }
      ],
      loading: false,
      groupName: ''
    };
  },
  computed: {
    isParentRoute () {
      return this.$route.name === 'groups';
    }
  },
  watch: {
    '$route.name' (newValue) {
      this.$state.title = newValue === 'groups' ? this.$tc('labels.group', 2) : this.$state.title;
    }
  },
  async mounted () {
    this.$state.title = this.$tc('labels.group', 2);
    await this.getGroups();
  },
  methods: {
    goToGroupDetail (evt, row) {
      this.$router.push({
        name: 'group-detail',
        params: { groupId: row.id }
      });
    },
    async getGroups () {
      try {
        this.loading = true;
        const response = await groupService.getGroups();
        this.groups = response.data;
      } catch {
        this.$q.notify({ type: 'negative', message: 'Error on retrieve groups' });
      } finally {
        this.loading = false;
      }
    },
    async newGroupAdded () {
      this.$refs.qdialog.hide();
      await this.getGroups();
    }
  }
};
</script>

<style>

</style>
