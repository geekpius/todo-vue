<template>
  <div>
   <div v-show="false">{{ tasks[0].task }}</div>
    <v-sheet height="80">
      <v-toolbar flat>
        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
          Today
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="events"
        :event-color="getEventColor"
        :type="type"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="getEvents"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card color="grey lighten-4" min-width="350px" flat>
          <v-toolbar :color="selectedEvent.color" dark>
            <v-btn icon @click="editEvent(selectedEvent)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <span class="subtitle-1" v-html="`${selectedEvent.owner} is the owner`"></span>
            <v-form v-if="showTaskEditor" class="mt-4">
              <v-text-field
                label="Edit owner name"
                v-model="currentEdittingEvent.owner"
              />
              <v-text-field
              v-model="currentEdittingEvent.name"
              label="Edit task name"
              />
            </v-form>
            
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="primary" v-if="showTaskEditor" @click="updateTask">
              Update
            </v-btn>
            <v-btn text color="error" v-if="!showTaskEditor" @click="deleteTask(selectedEvent.id)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days"
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ["green"],
      showTaskEditor: false,
      currentEdittingEvent: {}
    };
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    editEvent(event){
      this.currentEdittingEvent = event;
      this.showTaskEditor = !this.showTaskEditor;
    },
    showEvent({ nativeEvent, event }) {
      this.showTaskEditor = false;
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    getEvents() {
      const events = [];
      const eventCount = this.tasks.length;

      for (let i = 0; i < eventCount; i++) {
        const first = new Date(`${this.tasks[i].date} ${this.tasks[i].start_time}`);
        const second = new Date(`${this.tasks[i].date} ${this.tasks[i].end_time}`);

        events.push({
          name: this.tasks[i].task,
          start: first,
          end: second,
          color: this.colors[0],
          owner: this.tasks[i].owner,
          id: this.tasks[i].id,
          timed: true
        });
      }
      this.events = events;
    },
    async fetchAllTasks() {
      await this.$store.dispatch("fetchAllTasks");
    },
    async updateTask() {
      if(this.currentEdittingEvent.owner == null || this.currentEdittingEvent.name == null){
        alert("Enter something in filed");
      }
      let response = await this.$store.dispatch("updateTask", {
        id: this.currentEdittingEvent.id,
        owner: this.currentEdittingEvent.owner,
        task: this.currentEdittingEvent.name
      });
      if(response.error){
        alert(response.error);
      }else{
        alert("Updated successful");
      }
      this.fetchAllTasks();
    },
    async deleteTask(id) {
      let response = await this.$store.dispatch("deleteTask", id);
      if(response.error){
        alert(response.error);
      }
      this.getEvents();
      this.selectedOpen= false;
    }
  },
  computed: {
    ...mapGetters({
      tasks: "getTaskList"
    })
  },
  created() {
    this.fetchAllTasks();
  }
};
</script>
