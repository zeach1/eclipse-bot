import { FileOptions, MessageAttachment, StringResolvable } from 'discord.js';

/* eslint-disable import/prefer-default-export */

/*
 * Using from discord.js typings (not exported from module) to allow more flexibility
 * for sending messages.
 */
export interface MessageEmbedOptions {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: Date | number;
  color?: number | string;
  fields?: { name: string; value: string; inline?: boolean }[];
  files?: (MessageAttachment | string | FileOptions)[];
  author?: { name?: string; url?: string; icon_url?: string; iconURL?: string };
  thumbnail?: { url?: string; height?: number; width?: number };
  image?: { url?: string; proxy_url?: string; proxyURL?: string; height?: number; width?: number };
  video?: { url?: string; height?: number; width?: number };
  footer?: { text?: string; icon_url?: string; iconURL?: string };
}

// Format for options provided to send images.
export interface ImageOptions {
  url: string;
  content?: StringResolvable;
  delay?: number;
}
