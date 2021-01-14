<template>
  <nav>
    <v-app-bar color="purple darken-2" dark app>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">Todo</span> &nbsp;
        <span>App</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn color="white pl-5 pr-5" text>
        <v-icon left>mdi-plus-circle</v-icon>
        Add Task
      </v-btn>
      <v-btn color="white pl-5 pr-5" text>
        <v-icon left>mdi-calendar</v-icon>
        Calendar
      </v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  components: {},
  data: () => ({}),
  methods: {},
  computed: {}
};
</script>

<style scoped>
.border {
  border-left: 4px solid red;
}
</style>
