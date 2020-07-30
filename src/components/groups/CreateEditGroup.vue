<template>
  <q-card>
    <q-card-section>
      <q-form
        ref="frmGroup"
        autocomplete="off"
        @submit="SaveGroup"
      >
        <div class="row">
          <div class="col-md-6 col-xs-12">
            <q-input
              ref="name"
              v-model="group.name"
              :label="$t('labels.name')"
              :rules="[val=>!!val || $t('validation.required')]"
            />
          </div>
        </div>
        <div class="row q-col-gutter-xs">
          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="selectedUfAPI"
              label="UF"
              use-input
              hide-selected
              fill-input
              clearable
              input-debounce="100"
              :options="ufOptions"
              :option-label="(item)=>item.sigla"
              :rules="[val => !!val || $t('validation.required')]"
              @filter="FilterUf"
              @input="GetCities(selectedUfAPI)"
            />
          </div>
          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="selectedCityAPI"
              use-input
              hide-selected
              fill-input
              clearable
              input-debounce="100"
              :label="$t('labels.city')"
              :options="citiesOptions"
              :option-label="(item)=>item.nome"
              :loading="loadingCities"
              :rules="[val => !!val || $t('validation.required')]"
              @filter="FilterCities"
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
import ibge from 'src/services/ibge';
import groupsService from 'src/services/groups';
export default {
  name: 'CreateEditGroup',
  props: {
    propGroup: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      ufOptions: [],
      citiesOptions: [],
      uf: [],
      cities: [],
      selectedUfAPI: null,
      selectedCityAPI: null,
      loadingCities: false,
      group: {
        id: null,
        name: '',
        uf: null,
        city: null
      }
    };
  },
  watch: {
    selectedUfAPI (newValue, oldValue) {
      this.group.uf = newValue.sigla || null;
    },
    selectedCityAPI (newValue, oldValue) {
      this.group.city = newValue.nome || null;
    }
  },
  async mounted () {
    try {
      const response = await ibge.getUf();
      this.uf = response.data;
      this.ufOptions = [...this.uf.sort((a, b) => a.sigla > b.sigla ? 1 : -1)];
      if (this.propGroup) {
        await this.FillGroupFields();
      }
    } catch {
      this.$q.notify({ type: 'negative', message: 'Error on retrieve states' });
    }
  },
  methods: {
    async FillGroupFields () {
      this.group = { ...this.propGroup };
      this.selectedUfAPI = this.ufOptions.find(({ sigla }) => sigla === this.group.uf);
      await this.GetCities(this.selectedUfAPI);
      this.selectedCityAPI = this.citiesOptions.find(({ nome }) => nome === this.group.city);
    },
    async GetCities (val) {
      if (!val) {
        this.ClearCities();
        return;
      }
      try {
        this.loadingCities = true;
        const response = await ibge.getCities(val.id);
        this.cities = response.data;
        this.citiesOptions = [...this.cities];
        this.loadingCities = false;
      } catch (error) {
        this.loadingCities = false;
      }
    },
    FilterCities (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.citiesOptions = this.cities.filter(v => v.nome.toLowerCase().indexOf(needle) > -1);
      });
    },
    FilterUf (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.ufOptions = this.uf.filter(v => v.sigla.toLowerCase().indexOf(needle) > -1);
      });
    },
    ClearCities () {
      this.citiesOptions = [];
      this.cities = [];
      this.selectedCity = null;
    },
    SaveGroup () {
      this.$refs.frmGroup.validate().then(async (success) => {
        if (success) {
          try {
            const result = this.propGroup
              ? await groupsService.updateGroup({ ...this.group })
              : await groupsService.addGroup({ ...this.group });
            this.$q.notify({
              type: 'positive',
              message: result.data
            });
            if (this.propGroup) this.$emit('update:group', this.group);
            this.$emit('hide-dialog');
          } catch (error) {
            this.$q.notify({
              type: 'negative',
              message: error.response ? error.response.data : 'Error on save.'
            });
          }
        }
      });
    }
  }
};
</script>

<style>

</style>
