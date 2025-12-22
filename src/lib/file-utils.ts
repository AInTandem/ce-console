/**
 * Helper functions for workflow import/export UI operations
 */

/**
 * Create a file input element and trigger file selection
 * @param onFileSelected Callback function to handle the selected file
 * @param accept File types to accept (default: application/json)
 */
export function triggerFileInput(
  onFileSelected: (file: File) => void,
  accept: string = 'application/json'
): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.onchange = (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };
  input.click();
}

/**
 * Download a file to the user's device
 * @param content Content to download
 * @param filename Name of the file to download
 * @param mimeType MIME type of the file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'application/json'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}