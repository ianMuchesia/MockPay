
import { reviewApi } from '../features/reviews/reviewsApi';
import { store } from '../redux/store';
import { SessionStorageManager, type PendingAction } from './SessionStorageManager';
import { toast } from 'react-toastify';

class PendingActionsServiceClass {
  
  async processPendingActions(): Promise<void> {
    const state = store.getState();
    const { user, token } = state.auth;
    
    // Don't process if not authenticated
    if (!user || !token) {
      return;
    }
    
    const pendingActions = SessionStorageManager.getAllPendingActions();
    
    if (pendingActions.length === 0) {
      return;
    }
    
    console.log(`Processing ${pendingActions.length} pending actions...`);
    
    const results = await Promise.allSettled(
      pendingActions.map(action => this.processSingleAction(action, user))
    );
    
    this.handleResults(results, pendingActions);
  }
  
  private async processSingleAction(action: PendingAction, user: any): Promise<void> {
    const dispatch = store.dispatch;
    
    switch (action.type) {
      case 'review':
        return this.processReviewAction(action, user, dispatch);
      case 'vote':
        return this.processVoteAction(action, user, dispatch);
      case 'flag':
        return this.processFlagAction(action, user, dispatch);
      default:
        throw new Error(`Unknown action type: ${(action as any).type}`);
    }
  }
  
  private async processReviewAction(action: PendingAction, user: any, dispatch: any): Promise<void> {
    const reviewData = action.data as import('./SessionStorageManager').PendingReview;
    
    await dispatch(reviewApi.endpoints.addReview.initiate({
      rating: reviewData.rating,
      comment: reviewData.comment,
      userID: user.id,
      userName: user.name || user.email,
      businessID: reviewData.businessId
    })).unwrap();
    
    // Clear from session storage
    SessionStorageManager.clearPendingReview(reviewData.businessId);
  }
  
  private async processVoteAction(action: PendingAction, user: any, dispatch: any): Promise<void> {
    const voteData = action.data as import('./SessionStorageManager').PendingVote;
    
    await dispatch(reviewApi.endpoints.voteOnReview.initiate({
      reviewId: voteData.reviewId,
      userId: user.id,
      isHelpful: voteData.isHelpful
    })).unwrap();
    
    // Clear from session storage
    SessionStorageManager.clearPendingVote(voteData.reviewId);
  }
  
  private async processFlagAction(action: PendingAction, user: any, dispatch: any): Promise<void> {
    const flagData = action.data as import('./SessionStorageManager').PendingFlag;
    
    const reason = flagData.reason === 'other' ? flagData.customReason || 'Other' : flagData.reason;
    
    await dispatch(reviewApi.endpoints.flagReview.initiate({
      reviewId: flagData.reviewId,
      flagData: { reason }
    })).unwrap();
    
    // Clear from session storage
    SessionStorageManager.clearPendingFlag(flagData.reviewId);
  }
  
  private handleResults(results: PromiseSettledResult<void>[], actions: PendingAction[]): void {
    let successCount = 0;
    let errorCount = 0;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
      } else {
        errorCount++;
        console.error(`Failed to process ${actions[index].type} action:`, result.reason);
      }
    });
    
    // Show notification based on results
    if (successCount > 0 && errorCount === 0) {
      toast.success(`Successfully processed ${successCount} pending action${successCount > 1 ? 's' : ''}!`);
    } else if (successCount > 0 && errorCount > 0) {
      toast.warning(`Processed ${successCount} actions, ${errorCount} failed. Please try again.`);
    } else if (errorCount > 0) {
      toast.error(`Failed to process ${errorCount} pending action${errorCount > 1 ? 's' : ''}. Please try again.`);
    }
  }
  
  // Check and process immediately if user is already logged in
  checkAndProcess(): void {
    const state = store.getState();
    if (state.auth.token && state.auth.user) {
      this.processPendingActions();
    }
  }
}

export const PendingActionsService = new PendingActionsServiceClass();