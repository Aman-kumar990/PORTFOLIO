const header = document.querySelector("[data-header]");
const chatOutput = document.getElementById("floatingChatOutput");
const chatForm = document.getElementById("floatingChatForm");
const chatInput = document.getElementById("floatingChatInput");
const chatLauncher = document.getElementById("floatingChatLauncher");
const chatBox = document.getElementById("floatingChatBox");
const chatClose = document.getElementById("floatingChatClose");
const micButton = document.getElementById("floatingMicButton");
const micStatus = document.getElementById("floatingMicStatus");
const quickButtons = document.querySelectorAll(".floating-chat-widget [data-question]");
const feedbackForm = document.getElementById("feedbackForm");
const feedbackMessage = document.getElementById("feedbackMessage");
const feedbackStatus = document.getElementById("feedbackStatus");
const ratingButtons = document.querySelectorAll("[data-rating]");
let selectedRating = 0;

const portfolio = {
  name: "Aman Kumar",
  role: "MCA student and full-stack developer",
  email: "amank079596@gmail.com",
  phone: "+91 72778 97866",
  location: "Dehradun, Uttarakhand",
  linkedin: "https://www.linkedin.com/in/aman-kumar-ba8663341/",
  github: "https://github.com/Aman-kumar990",
  skills: "Java, Python, C, C++, SQL, HTML, CSS, JavaScript, Node.js, Oracle Database, ADBMS, MS Office, data structures, full-stack development, machine learning, and software engineering.",
  education: "Aman is pursuing MCA at Graphic Era University with 7.52 SGPA. He completed BCA from Patliputra University with 71.4%.",
  experience: "Aman completed a Frontend Web Developer internship at CODTECH IT Solutions from April 2025 to May 2025.",
  certificates: "Java Training, Python Training, and C Training from IIT Bombay; Software Engineering Job Simulation from JPMorgan Chase and Co.; Data Analyst 101 and SQL Analytics and BI on Databricks from Simplilearn; ChatGPT For Everyone from GUVI; and Best Presentation participation certificate.",
  projects: [
    {
      name: "Integrated Library System",
      text: "A full-stack library management project built with HTML, CSS, JavaScript, Node.js, and JSON storage.",
      link: "https://github.com/Aman-kumar990/Integrated-Library-System.git"
    },
    {
      name: "Online Quiz System",
      text: "A web-based quiz application built with HTML, CSS, JavaScript, Node.js, and JSON storage.",
      link: "https://github.com/Aman-kumar990/Online-Quiz-System.git"
    }
  ]
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addMessage(sender, text, type = "bot") {
  const message = document.createElement("div");
  message.className = `${type}-message message`;
  const safeText = escapeHtml(text).replaceAll("\n", "<br>");
  message.innerHTML = `<strong>${escapeHtml(sender)}</strong><p>${safeText}</p>`;
  chatOutput.appendChild(message);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replaceAll("\n", " "));
  utterance.rate = 0.96;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function projectAnswer() {
  return portfolio.projects
    .map((project) => `${project.name}: ${project.text} Link: ${project.link}`)
    .join("\n\n");
}

function getBotAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes("skill") || q.includes("technology") || q.includes("tech stack") || q.includes("programming")) {
    return `Aman's main skills are ${portfolio.skills}`;
  }

  if (q.includes("project") || q.includes("github") || q.includes("work")) {
    return projectAnswer();
  }

  if (q.includes("certificate") || q.includes("certification")) {
    return `${portfolio.certificates} You can open every certificate link from the Certifications section.`;
  }

  if (q.includes("education") || q.includes("college") || q.includes("university") || q.includes("mca") || q.includes("bca")) {
    return portfolio.education;
  }

  if (q.includes("experience") || q.includes("internship") || q.includes("codtech")) {
    return portfolio.experience;
  }

  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("hire")) {
    return `You can contact Aman at ${portfolio.email} or ${portfolio.phone}. He is based in ${portfolio.location}.`;
  }

  if (q.includes("linkedin")) {
    return `Aman's LinkedIn profile is ${portfolio.linkedin}`;
  }


  if (q.includes("about") || q.includes("who") || q.includes("aman")) {
    return `${portfolio.name} is an ${portfolio.role}. He builds practical web applications, database systems, and software projects.`;
  }

  return "I can answer questions about Aman's skills, projects, certificates, education, experience, GitHub, LinkedIn, and contact details. Try asking: What projects has Aman built?";
}

function handleQuestion(question) {
  const cleanQuestion = question.trim();

  if (!cleanQuestion) {
    return;
  }

  addMessage("You", cleanQuestion, "user");
  chatInput.value = "";

  window.setTimeout(() => {
    const answer = getBotAnswer(cleanQuestion);
    addMessage("Portfolio AI", answer, "bot");
    speak(answer);
  }, 220);
}

function openChat() {
  chatBox.hidden = false;
  chatLauncher.setAttribute("aria-expanded", "true");
  window.setTimeout(() => chatInput.focus(), 80);
}

function closeChat() {
  chatBox.hidden = true;
  chatLauncher.setAttribute("aria-expanded", "false");
  window.speechSynthesis?.cancel();
}

function setupMic() {
  if (!SpeechRecognition) {
    micButton.disabled = true;
    micStatus.textContent = "Mic is not supported in this browser. Try Chrome or Edge.";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.addEventListener("start", () => {
    micButton.classList.add("is-listening");
    micButton.textContent = "Listening";
    micStatus.textContent = "Listening... speak your question.";
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    handleQuestion(transcript);
  });

  recognition.addEventListener("error", (event) => {
    micStatus.textContent = `Mic error: ${event.error}. Please allow microphone permission and try again.`;
  });

  recognition.addEventListener("end", () => {
    micButton.classList.remove("is-listening");
    micButton.textContent = "Mic";
    if (micStatus.textContent.startsWith("Listening")) {
      micStatus.textContent = "Mic ready in supported browsers.";
    }
  });
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleQuestion(chatInput.value);
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openChat();
    handleQuestion(button.dataset.question);
  });
});

chatLauncher.addEventListener("click", () => {
  if (chatBox.hidden) {
    openChat();
  } else {
    closeChat();
  }
});

chatClose.addEventListener("click", closeChat);
ratingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRating = Number(button.dataset.rating);
    ratingButtons.forEach((ratingButton) => {
      const isSelected = Number(ratingButton.dataset.rating) <= selectedRating;
      ratingButton.classList.toggle("is-selected", isSelected);
      ratingButton.setAttribute("aria-pressed", String(isSelected));
    });
    feedbackStatus.textContent = `You selected ${selectedRating} out of 5.`;
  });
});

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedRating) {
    feedbackStatus.textContent = "Please select a rating from 1 to 5.";
    return;
  }

  const feedbackEntry = {
    rating: selectedRating,
    message: feedbackMessage.value.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    const savedFeedback = JSON.parse(localStorage.getItem("amanPortfolioFeedback") || "[]");
    savedFeedback.push(feedbackEntry);
    localStorage.setItem("amanPortfolioFeedback", JSON.stringify(savedFeedback));
  } catch {
    // The form remains useful even when browser storage is unavailable.
  }

  feedbackForm.reset();
  selectedRating = 0;
  ratingButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  });
  feedbackStatus.textContent = "Thank you. Your feedback has been recorded.";
});

micButton.addEventListener("click", () => {
  if (recognition) {
    recognition.start();
  }
});

updateHeader();
setupMic();
window.addEventListener("scroll", updateHeader, { passive: true });
