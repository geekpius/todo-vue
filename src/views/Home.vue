<template>
  <div class="home">
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" class="mb-4">
          <AddTask />
        </v-col>
        <v-col cols="12" sm="12">
          <Calendar />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AddTask from "@/components/AddTask.vue";
import Calendar from "@/components/Calendar.vue";
export default {
  components: { AddTask, Calendar },
  name: "Home",
  data() {
    return {};
  }
};
</script>

<style scoped>
.home {
  margin-top: 20px;
}
</style>
