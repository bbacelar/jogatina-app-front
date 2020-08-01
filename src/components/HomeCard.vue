<template>
  <q-card>
    <q-card-section class="bg-accent text-white">
      <div class="text-h6">
        {{ header }}
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'HomeCard',
  props: {
    header: {
      type: String,
      default: ''
    }
  }
};
</script>

<style>

</style>
