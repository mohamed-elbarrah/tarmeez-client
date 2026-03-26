import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StoreRole = "OWNER" | "ADMIN" | "EDITOR" | "MARKETER";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";

export interface TeamMember {
  id: string;
  role: StoreRole;
  createdAt: string;
  user: {
    id: string;
    email: string;
  };
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: StoreRole;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}

export interface InviteMemberPayload {
  email: string;
  role: Exclude<StoreRole, "OWNER">;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Team", "Invitations"],
  endpoints: (builder) => ({
    getTeamMembers: builder.query<TeamMember[], void>({
      query: () => "/merchant/team/members",
      providesTags: ["Team"],
    }),

    getInvitations: builder.query<TeamInvitation[], void>({
      query: () => "/merchant/team/invitations",
      providesTags: ["Invitations"],
    }),

    inviteMember: builder.mutation<TeamInvitation, InviteMemberPayload>({
      query: (body) => ({
        url: "/merchant/team/invite",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invitations"],
    }),

    removeMember: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/merchant/team/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),

    cancelInvitation: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/merchant/team/invitations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invitations"],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useGetInvitationsQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useCancelInvitationMutation,
} = teamApi;
