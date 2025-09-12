// utils/portfolio.js

export const getPortfolio = () => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("portfolio");
  return saved ? JSON.parse(saved) : [];
};

export const addToPortfolio = (coinId, amount) => {
  const current = getPortfolio();
  const existingIndex = current.findIndex((item) => item.coinId === coinId);
  let updated;
  if (existingIndex !== -1) {
    updated = [...current];
    updated[existingIndex] = {
      ...updated[existingIndex],
      amount: Number(updated[existingIndex].amount) + Number(amount || 0),
    };
  } else {
    updated = [...current, { coinId, amount: Number(amount || 0) }];
  }
  localStorage.setItem("portfolio", JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio:updated", { detail: { action: "add", coinId, amount } }));
  }
  return updated;
};

export const updatePortfolioAmount = (coinId, amount) => {
  const current = getPortfolio();
  const updated = current.map((item) =>
    item.coinId === coinId ? { ...item, amount: Number(amount || 0) } : item
  );
  localStorage.setItem("portfolio", JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio:updated", { detail: { action: "update", coinId, amount } }));
  }
  return updated;
};

export const removeFromPortfolio = (coinId) => {
  const current = getPortfolio();
  const updated = current.filter((item) => item.coinId !== coinId);
  localStorage.setItem("portfolio", JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio:updated", { detail: { action: "remove", coinId } }));
  }
  return updated;
};


