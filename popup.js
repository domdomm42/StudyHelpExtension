document.getElementById("quizifyButton").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    const article = await chrome.tabs.sendMessage(tab.id, { action: "scrape" });

    const contentDiv = document.getElementById("content");

    // You can display either HTML or text content
    contentDiv.innerHTML = `
      <h2>${article.title}</h2>
      ${article.questions
        .map(
          (question) =>
            `<p>${question}</p> <input type="text" id="answer-${question}" />`
        )
        .join("")}
    `;

  } catch (error) {
    console.error("Error:", error);
  }
});
