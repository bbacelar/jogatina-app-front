<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          {{ $state.title }}
        </q-toolbar-title>
        <Locales />
        <q-btn
          flat
          icon="fas fa-sign-out-alt"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-grey-1"
    >
      <q-scroll-area style="height: calc(100% - 130px); margin-top: 130px; border-right: 1px solid #ddd">
        <q-list>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
            :to="link.link"
          />
        </q-list>
      </q-scroll-area>
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 130px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar
            size="56px"
            class="q-mb-sm"
          >
            <img :src="$auth.user.picture">
          </q-avatar>
          <div class="text-weight-bold">
            {{ $auth.user.name }}
          </div>
          <div>{{ $auth.user.email }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <transition
        mode="out-in"
        name="dialog-fade"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink';
import Locales from 'components/Locales';

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    Locales
  },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'play',
          icon: 'fas fa-dice',
          link: '/play-list'
        },
        {
          title: 'group',
          icon: 'fas fa-users',
          link: '/groups'
        }
      ]
    };
  },
  methods: {
    logout () {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>
<style scoped lang="scss">

</style>
