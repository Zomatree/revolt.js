import { ReactiveSet } from "@solid-primitives/set";
import type { Channel as APIChannel, OverrideField } from "stoat-api";

import type { Client } from "../Client.js";
import { File } from "../classes/File.js";
import type { Merge } from "../lib/merge.js";

import type { Hydrate } from "./index.js";

export type HydratedChannel = {
  id: string;
  channelType: APIChannel["channel_type"];

  name: string;
  description?: string;
  icon?: File;

  active: boolean;
  typingIds: ReactiveSet<string>;
  recipientIds: ReactiveSet<string>;

  userId?: string;
  ownerId?: string;
  serverId?: string;

  permissions?: number;
  defaultPermissions?: OverrideField;
  rolePermissions?: Record<string, OverrideField>;
  nsfw: boolean;

  lastMessageId?: string;

  voice: boolean;
};

export const channelHydration: Hydrate<Merge<APIChannel>, HydratedChannel> = {
  keyMapping: {
    _id: "id",
    channel_type: "channelType",
    recipients: "recipientIds",
    user: "userId",
    owner: "ownerId",
    server: "serverId",
    default_permissions: "defaultPermissions",
    role_permissions: "rolePermissions",
    last_message_id: "lastMessageId",
  },
  functions: {
    id: (channel) => channel._id,
    channelType: (channel) => channel.channel_type,
    name: (channel) => channel.name,
    description: (channel) => channel.description!,
    icon: (channel, ctx) => new File(ctx as Client, channel.icon!),
    active: (channel) => channel.active || false,
    typingIds: () => new ReactiveSet(),
    recipientIds: (channel) => new ReactiveSet(channel.recipients),
    userId: (channel) => channel.user,
    ownerId: (channel) => channel.owner,
    serverId: (channel) => channel.server,
    permissions: (channel) => channel.permissions!,
    defaultPermissions: (channel) => channel.default_permissions!,
    rolePermissions: (channel) => channel.role_permissions,
    nsfw: (channel) => channel.nsfw || false,
    lastMessageId: (channel) => channel.last_message_id!,
    voice: (channel) => {
      console.info(channel);
      return typeof (channel as never as { voice: object }).voice === "object";
    },
  },
  initialHydration: () => ({
    typingIds: new ReactiveSet(),
    recipientIds: new ReactiveSet(),
  }),
};
