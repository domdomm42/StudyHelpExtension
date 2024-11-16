chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    (async () => {
      const documentClone = document.cloneNode(true);
      const reader = new Readability(documentClone);
      const article = reader.parse();
      const content = article.textContent.replace(/"/g, `\\"`);

      try {
        const response = await fetch(`http://localhost:3001/api/v1/quiz`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "test",
            url: window.location.href,
            content,
          }),
        });

        const data = await response.json();
        const questions = data.questions.map((question) => question.question);

        sendResponse({
          questions,
          title: article.title,
        });
      } catch (error) {
        console.error("Error:", error);
        sendResponse({ error: error.message });
      }
    })();
    return true;
  }
});
