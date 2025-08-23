export interface PendingReview {
  rating: number;
  comment: string;
  businessId: string;
  timestamp: number;
}

export interface PendingVote {
  reviewId: number;
  isHelpful: boolean;
  businessId: string;
  timestamp: number;
}

export interface PendingFlag {
  reviewId: number;
  reason: string;
  customReason?: string;
  businessId: string;
  timestamp: number;
}

export interface PendingAction {
  type: 'review' | 'vote' | 'flag';
  data: PendingReview | PendingVote | PendingFlag;
  timestamp: number;
}

class SessionStorageManagerClass {
  private readonly EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes
  private readonly REDIRECT_KEY = 'mockpay_redirect_url';
  private readonly PENDING_PREFIX = 'mockpay_pending_';

  // Redirect URL management
  setRedirectUrl(url: string): void {
    sessionStorage.setItem(this.REDIRECT_KEY, url);
  }

  getAndClearRedirectUrl(): string | null {
    const url = sessionStorage.getItem(this.REDIRECT_KEY);
    if (url) {
      sessionStorage.removeItem(this.REDIRECT_KEY);
    }
    return url;
  }

  // Pending Review Management
  setPendingReview(businessId: string, reviewData: Omit<PendingReview, 'timestamp'>): void {
    const data: PendingReview = {
      ...reviewData,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem(`${this.PENDING_PREFIX}review_${businessId}`, JSON.stringify(data));
    this.scheduleCleanup(businessId, 'review');
  }

  getPendingReview(businessId: string): PendingReview | null {
    return this.getPendingData<PendingReview>(`review_${businessId}`);
  }

  clearPendingReview(businessId: string): void {
    sessionStorage.removeItem(`${this.PENDING_PREFIX}review_${businessId}`);
  }

  // Pending Vote Management
  setPendingVote(reviewId: number, voteData: Omit<PendingVote, 'timestamp'>): void {
    const data: PendingVote = {
      ...voteData,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem(`${this.PENDING_PREFIX}vote_${reviewId}`, JSON.stringify(data));
    this.scheduleCleanup(reviewId.toString(), 'vote');
  }

  getPendingVote(reviewId: number): PendingVote | null {
    return this.getPendingData<PendingVote>(`vote_${reviewId}`);
  }

  clearPendingVote(reviewId: number): void {
    sessionStorage.removeItem(`${this.PENDING_PREFIX}vote_${reviewId}`);
  }

  // Pending Flag Management
  setPendingFlag(reviewId: number, flagData: Omit<PendingFlag, 'timestamp'>): void {
    const data: PendingFlag = {
      ...flagData,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem(`${this.PENDING_PREFIX}flag_${reviewId}`, JSON.stringify(data));
    this.scheduleCleanup(reviewId.toString(), 'flag');
  }

  getPendingFlag(reviewId: number): PendingFlag | null {
    return this.getPendingData<PendingFlag>(`flag_${reviewId}`);
  }

  clearPendingFlag(reviewId: number): void {
    sessionStorage.removeItem(`${this.PENDING_PREFIX}flag_${reviewId}`);
  }

  // Get all pending actions
  getAllPendingActions(): PendingAction[] {
    const actions: PendingAction[] = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key?.startsWith(this.PENDING_PREFIX)) continue;
      
      const data = sessionStorage.getItem(key);
      if (!data) continue;
      
      try {
        const parsedData = JSON.parse(data);
        
        // Check if expired
        if (this.isExpired(parsedData.timestamp)) {
          sessionStorage.removeItem(key);
          continue;
        }
        
        // Determine action type
        if (key.includes('_review_')) {
          actions.push({ type: 'review', data: parsedData, timestamp: parsedData.timestamp });
        } else if (key.includes('_vote_')) {
          actions.push({ type: 'vote', data: parsedData, timestamp: parsedData.timestamp });
        } else if (key.includes('_flag_')) {
          actions.push({ type: 'flag', data: parsedData, timestamp: parsedData.timestamp });
        }
      } catch (error) {
        console.error('Error parsing pending action:', error);
        sessionStorage.removeItem(key);
      }
    }
    
    return actions.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Clear all pending actions
  clearAllPendingActions(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(this.PENDING_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }

  // Helper methods
  private getPendingData<T>(suffix: string): T | null {
    const data = sessionStorage.getItem(`${this.PENDING_PREFIX}${suffix}`);
    if (!data) return null;
    
    try {
      const parsedData = JSON.parse(data);
      
      // Check if expired
      if (this.isExpired(parsedData.timestamp)) {
        sessionStorage.removeItem(`${this.PENDING_PREFIX}${suffix}`);
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('Error parsing session data:', error);
      sessionStorage.removeItem(`${this.PENDING_PREFIX}${suffix}`);
      return null;
    }
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.EXPIRY_TIME;
  }

  private scheduleCleanup(id: string, type: 'review' | 'vote' | 'flag'): void {
    setTimeout(() => {
      sessionStorage.removeItem(`${this.PENDING_PREFIX}${type}_${id}`);
    }, this.EXPIRY_TIME);
  }

  // Clean up expired items
  cleanupExpiredItems(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key?.startsWith(this.PENDING_PREFIX)) continue;
      
      const data = sessionStorage.getItem(key);
      if (!data) continue;
      
      try {
        const parsedData = JSON.parse(data);
        if (this.isExpired(parsedData.timestamp)) {
          keysToRemove.push(key);
        }
      } catch (error) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }
}

export const SessionStorageManager = new SessionStorageManagerClass();