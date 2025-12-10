import api from './api';
import env from '../config/env';
import { isGuestMode } from '../utils/storage';

export interface UploadResponse {
  url: string;
}

/**
 * Convert a relative URL to a full URL
 */
const toFullUrl = (relativeUrl: string): string => {
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }

  // Remove /api/v1 from the base URL to get the root server URL
  const baseUrl = env.apiUrl.replace('/api/v1', '');

  // Ensure no double slashes
  const url = relativeUrl.startsWith('/')
    ? `${baseUrl}${relativeUrl}`
    : `${baseUrl}/${relativeUrl}`;

  return url;
};

export const uploadService = {
  /**
   * Upload a plant photo
   */
  async uploadPlantPhoto(uri: string): Promise<string> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // In guest mode, return the local file URI directly
      // Photos will be stored as local URIs and uploaded during sync
      return uri;
    }

    // In authenticated mode, upload to backend
    const formData = new FormData();

    // Extract filename from URI
    const filename = uri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);

    const response = await api.post<UploadResponse>('/uploads/plant-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Convert relative URL to full URL for image display
    return toFullUrl(response.data.url);
  },

  /**
   * Convert a relative URL to a full URL (useful for displaying images from API)
   */
  toFullUrl,
};
