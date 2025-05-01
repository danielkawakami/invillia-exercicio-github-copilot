class ActivitiesApp {
  constructor() {
    this.activitiesList = document.getElementById("activities-list");
    this.activitySelect = document.getElementById("activity");
    this.signupForm = document.getElementById("signup-form");
    this.messageDiv = document.getElementById("message");

    this.initialize();
  }

  async fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      this.activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div><strong>Participants:</strong></div>
        `;

        const participantsContainer = document.createElement("div");
        participantsContainer.className = "participants-container";

        if (details.participants.length > 0) {
          details.participants.forEach((participant) => {
            const participantBadge = document.createElement("span");
            participantBadge.className = "participant-badge";
            participantBadge.textContent = participant;
            participantsContainer.appendChild(participantBadge);
          });
        } else {
          participantsContainer.textContent = "No participants yet";
        }

        activityCard.appendChild(participantsContainer);
        this.activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        this.activitySelect.appendChild(option);
      });
    } catch (error) {
      this.activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = this.activitySelect.value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        this.messageDiv.textContent = result.message;
        this.messageDiv.className = "success";
        this.signupForm.reset();
      } else {
        this.messageDiv.textContent = result.detail || "An error occurred";
        this.messageDiv.className = "error";
      }

      this.messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        this.messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      this.messageDiv.textContent = "Failed to sign up. Please try again.";
      this.messageDiv.className = "error";
      this.messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  }

  initialize() {
    this.signupForm.addEventListener("submit", (event) => this.handleFormSubmit(event));
    this.fetchActivities();
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  new ActivitiesApp();
});
