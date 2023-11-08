const formatSize = (size) => {
  const suffixes = ["B", "KB", "MB", "GB", "TB", "PB"];
  let suffixIndex = 0;

  while (size >= 1024) {
    size = size / 1024;
    suffixIndex++;
  }

  return `${size.toFixed(2)}${suffixes[suffixIndex]}`;
};

module.exports=formatSize