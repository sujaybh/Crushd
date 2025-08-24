import { API_ENDPOINTS } from '../constants/appConfig';
import { UserProfile } from '../constants/ProfileData';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_ENDPOINTS.BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const defaultOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, defaultOptions);
      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Profile API methods
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest<UserProfile>(`${API_ENDPOINTS.PROFILES}/${userId}`);
  }

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest<UserProfile>(`${API_ENDPOINTS.PROFILES}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async createProfile(profileData: Omit<UserProfile, 'id'>): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest<UserProfile>(API_ENDPOINTS.PROFILES, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async deleteProfile(userId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`${API_ENDPOINTS.PROFILES}/${userId}`, {
      method: 'DELETE',
    });
  }

  async getPotentialMatches(userId: string): Promise<ApiResponse<UserProfile[]>> {
    return this.makeRequest<UserProfile[]>(`${API_ENDPOINTS.PROFILES}/matches/${userId}`);
  }

  async uploadPhoto(userId: string, photo: FormData): Promise<ApiResponse<{ url: string }>> {
    return this.makeRequest<{ url: string }>(`${API_ENDPOINTS.PROFILES}/${userId}/photos`, {
      method: 'POST',
      headers: {}, // Remove Content-Type for FormData
      body: photo,
    });
  }

  async deletePhoto(userId: string, photoUrl: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`${API_ENDPOINTS.PROFILES}/${userId}/photos`, {
      method: 'DELETE',
      body: JSON.stringify({ photoUrl }),
    });
  }
}

export default new ApiService();