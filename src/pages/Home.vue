<template>
  <q-page padding />
</template>

<script>
export default {
  mounted () {
    this.$state.title = 'Jogatina';
  },
  async created () {
    try {
      await this.$axios({
        method: 'PUT',
        url: `${process.env.API_URL}/users`,
        data: {
          id: this.$auth.user.sub,
          name: this.$auth.user.name,
          email: this.$auth.user.email,
          picture: this.$auth.user.picture
        }
      });
    } catch (error) {

    }
  }
};
</script>

<style>

</style>
