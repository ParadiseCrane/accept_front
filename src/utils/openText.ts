export const openText = (text: string, not_blank?: boolean) => {
  let tab = null;
  if (not_blank) {
    tab = window.open('about:blank');
  } else {
    tab = window.open('about:blank', '_blank');
  }
  tab?.document.write(
    `<html style="width: 100%; height: 100%;background-color: black; color: white; white-space: pre-wrap;font-family: monospace;">${text}</html>`
  );
  tab?.document.close();
};
