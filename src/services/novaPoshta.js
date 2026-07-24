// =============================================================
// АВТОПІДКАЗКИ НОВОЇ ПОШТИ (місто + відділення)
// Логіка та ключі API перенесені без змін з оригінального script.js
// =============================================================

const NP_API_KEY = "19e54cdb44686904ce39a69c108061b8";
const NP_API_URL = "https://api.novaposhta.ua/v2.0/json/";

async function npRequest(modelName, calledMethod, methodProperties) {
  try {
    const response = await fetch(NP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: NP_API_KEY,
        modelName,
        calledMethod,
        methodProperties,
      }),
    });
    const data = await response.json();
    if (!data.success) {
      console.warn("Nova Poshta API помилка:", data.errors);
      return [];
    }
    return data.data || [];
  } catch (err) {
    console.error("Помилка запиту до Нової Пошти:", err);
    return [];
  }
}

export async function searchCities(query) {
  if (query.length < 2) return [];
  return await npRequest("Address", "searchSettlements", {
    CityName: query,
    Limit: 10,
  });
}

export async function searchWarehouses(cityRef, query = "") {
  return await npRequest("AddressGeneral", "getWarehouses", {
    CityRef: cityRef,
    FindByString: query,
    Limit: 20,
  });
}
