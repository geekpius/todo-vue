<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus-circle</v-icon>
        Add Task
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Add Task</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.owner"
                name="owner"
                label="Task owner"
              />
              <!-- <span class="error--text" v-if="isSubmitted">{{
                errors.first("owner")
              }}</span> -->
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Task name"
                v-model="formData.task"
                name="task"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Date"
                type="date"
                v-model="formData.date"
                name="date"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Start time"
                type="time"
                v-model="formData.start_time"
                name="start_time"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="End time"
                type="time"
                v-model="formData.end_time"
                name="end_time"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="addTask">
          Save Task
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddTask",
  data() {
    return {
      dialog: false,
      formData: {
        owner: null,
        task: null,
        date: null,
        start_time: null,
        end_time: null
      },
      isSubmitted: false
    };
  },
  methods: {
    async addTask() {
      let response = await this.$store.dispatch("saveTask", this.formData);
      if (response.error) {
        alert("Something went wrong.");
      }
    }
  }
};
</script>
