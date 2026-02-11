import api from '../lib/api';
import type { AdminProperty, PaginationMeta } from './types';

export interface ModerationQueueParams {
    page?: number;
    limit?: number;
    status?: string;
    listingType?: string;
    search?: string;
}

export interface ModerationQueueResponse {
    properties: AdminProperty[];
    pagination: PaginationMeta;
}

export interface ModeratePropertyPayload {
    status: 'active' | 'rejected';
    moderationNotes?: string;
    rejectionReason?: string;
}

/**
 * Fetch moderation queue (pending properties)
 */
export const getModerationQueue = async (params: ModerationQueueParams = {}) => {
    const { data } = await api.get<{ success: boolean; data: ModerationQueueResponse }>(
        '/admin-dashboard/moderation/listings',
        { params }
    );
    return data.data;
};

/**
 * Approve a property
 */
export const approveProperty = async (propertyId: string, notes?: string) => {
    const payload: ModeratePropertyPayload = {
        status: 'active',
        moderationNotes: notes
    };

    const { data } = await api.put<{ success: boolean; message: string; data: AdminProperty }>(
        `/admin-dashboard/properties/${propertyId}/moderate`,
        payload
    );
    return data;
};

/**
 * Reject a property
 */
export const rejectProperty = async (propertyId: string, reason: string, notes?: string) => {
    const payload: ModeratePropertyPayload = {
        status: 'rejected',
        rejectionReason: reason,
        moderationNotes: notes
    };

    const { data } = await api.put<{ success: boolean; message: string; data: AdminProperty }>(
        `/admin-dashboard/properties/${propertyId}/moderate`,
        payload
    );
    return data;
};
