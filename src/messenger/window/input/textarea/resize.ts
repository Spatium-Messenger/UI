const resize = function(
    filesCount: number,
    inputShell: HTMLElement,
    textArea: HTMLElement) {
  let inputShellHeight = 0;
  if (filesCount > 0) {
    inputShellHeight += 110;
  }

  inputShellHeight += textArea.offsetHeight;

  inputShell.style.height = inputShellHeight + "px";
};

export default resize;
