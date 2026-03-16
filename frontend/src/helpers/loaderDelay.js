//demo loader delay
export const waitForLoader = async () => {
  const delay = Number(import.meta.env.VITE_LOADER_DELAY) || 0;  //uncomment this and remove the upper line once testing is completed

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};