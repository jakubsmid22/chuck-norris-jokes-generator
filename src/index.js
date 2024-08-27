const jokeElement = document.querySelector(".joke");
const nextJokeBtn = document.querySelector(".next-joke-btn");
let language = "cs";
const changeLanguage = document.getElementById("changeLanguage");

async function translateText(text, targetLang) {
  const url = "https://api-free.deepl.com/v2/translate";

  const params = new URLSearchParams();
  params.append("auth_key", import.meta.env.VITE_DEEPL_API_KEY);
  params.append("text", text);
  params.append("target_lang", targetLang);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
}

const generateJoke = async () => {
  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random");

    if (!response.ok) {
      throw new Error("Could not fetch resources");
    }

    const data = await response.json();

    if (language === "cs") {
      try {
        const translatedText = await translateText(data.value, "CS");
        jokeElement.textContent = translatedText;
      } catch (error) {
        console.error("Překlad se nezdařil:", error);
        jokeElement.textContent = data.value;
      }
    } else {
      jokeElement.textContent = data.value;
    }
  } catch (error) {
    console.error("Error fetching joke:", error);
    jokeElement.textContent = "Nelze načíst vtip.";
  }
};

const changeLanguageFunc = async () => {
  if (language === "cs") {
    jokeElement.textContent = await translateText(
      jokeElement.textContent,
      "EN"
    );
    language = "en";
    changeLanguage.textContent = "ZMĚNIT JAZYK";
    nextJokeBtn.textContent = "NEXT JOKE";
  } else {
    jokeElement.textContent = await translateText(
      jokeElement.textContent,
      "CS"
    );
    language = "cs";
    changeLanguage.textContent = "CHANGE LANGUAGE";
    nextJokeBtn.textContent = "DALŠÍ VTIP";
  }
};

changeLanguage.addEventListener("click", () => {
  changeLanguageFunc();
});

generateJoke();

nextJokeBtn.addEventListener("click", generateJoke);
