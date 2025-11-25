// Utility function to upload a file to S3 using a presigned URL
export async function uploadToS3(
  presignedUrl: string,
  file: Blob,
  contentType: string,
) {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });
  if (!response.ok) {
    throw new Error('Upload to S3 failed: ' + response.statusText);
  }
}
