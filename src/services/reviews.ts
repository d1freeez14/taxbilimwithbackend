// src/services/reviewsService.ts
import {CanReviewResponse, CourseReviewsResponse, ReviewItem} from "@/types/reviews";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://89.219.32.91:5001';

export const ReviewsService = {
  /**
   * GET /api/reviews/course/:courseId?page&limit
   * Get reviews for a course (paginated)
   */
  getCourseReviews: async (
    courseId: string | number,
    params?: { page?: number; limit?: number }
  ) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));

    const url = `${BACKEND_URL}/api/reviews/course/${courseId}${
      qs.toString() ? `?${qs.toString()}` : ''
    }`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Error fetching reviews');

    return data as CourseReviewsResponse;
  },

  /**
   * GET /api/reviews/can-review/:courseId
   * Check if current user can leave a review
   */
  canReview: async (courseId: string | number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/reviews/can-review/${courseId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Error checking can-review');

    return data as CanReviewResponse;
  },

  /**
   * POST /api/reviews
   * Create a review (upsert by user_id + course_id)
   */
  createReview: async (
    payload: { courseId: number; rating: number; comment: string },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Error submitting review');

    return data as {
      review: ReviewItem;
      message: string;
    };
  },

  /**
   * GET /api/reviews/my-review/:courseId
   * Get my review for a course
   */
  getMyReview: async (courseId: string | number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/reviews/my-review/${courseId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Error fetching my review');

    return data as { review: ReviewItem | null };
  },

  /**
   * PUT /api/reviews/:id
   * Update a review by review id (must belong to current user)
   */
  updateReview: async (
    reviewId: string | number,
    payload: { rating?: number; comment?: string },
    token: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Error updating review');

    return data as {
      review: ReviewItem;
      message: string;
    };
  },

  /**
   * DELETE /api/reviews/:id
   * Delete a review by review id (must belong to current user)
   */
  deleteReview: async (reviewId: string | number, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.message || 'Error deleting review');

    return data as { message?: string };
  },
};
