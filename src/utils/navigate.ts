let navigateTo: ((path: string) => void) | null = null;

export const setNavigate = (navigate: (path: string) => void) => {
  navigateTo = navigate;
};

export const navigate = (path: string) => {
  if (!navigateTo) {
    throw new Error(
      "Navigation is not ready. Make sure the router has mounted."
    );
  }
  navigateTo(path);
};
