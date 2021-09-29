export function openPopup({ url, name, width, height }) {
  /* eslint-disable no-restricted-globals */
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;

  return window.open(
    url,
    name,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,' +
      `width=${width}, height=${height}, top=${top}, left=${left}`,
  );
}
