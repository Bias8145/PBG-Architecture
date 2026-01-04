export const isVideo = (url: string): boolean => {
  if (!url) return false;
  // Check for common video extensions
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
};
