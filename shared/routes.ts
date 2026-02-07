import { z } from 'zod';
import { insertUserSchema, insertProfileSchema, insertMessageSchema, profiles, messages, interests } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.object({ id: z.number(), username: z.string() }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: insertUserSchema,
      responses: {
        200: z.object({ id: z.number(), username: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.object({ id: z.number(), username: z.string(), isAdmin: z.boolean().optional() }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  profiles: {
    create: {
      method: 'POST' as const,
      path: '/api/profiles' as const,
      input: insertProfileSchema,
      responses: {
        201: z.custom<typeof profiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/profiles' as const,
      input: z.object({
        ageMin: z.coerce.number().optional(),
        ageMax: z.coerce.number().optional(),
        religion: z.string().optional(),
        city: z.string().optional(),
        gender: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof profiles.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/profiles/:id' as const,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    mine: {
      method: 'GET' as const,
      path: '/api/my-profile' as const,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  interests: {
    send: {
      method: 'POST' as const,
      path: '/api/interests' as const,
      input: z.object({ receiverId: z.number() }),
      responses: {
        201: z.custom<typeof interests.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/interests' as const,
      responses: {
        200: z.array(z.object({
          interest: z.custom<typeof interests.$inferSelect>(),
          profile: z.custom<typeof profiles.$inferSelect>(),
        })),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/interests/:id' as const,
      input: z.object({ status: z.enum(['accepted', 'rejected']) }),
      responses: {
        200: z.custom<typeof interests.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  messages: {
    list: {
      method: 'GET' as const,
      path: '/api/messages/:userId' as const,
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    send: {
      method: 'POST' as const,
      path: '/api/messages' as const,
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/conversations' as const, // List of users we have chatted with
      responses: {
        200: z.array(z.custom<typeof profiles.$inferSelect>()),
      },
    }
  },
  admin: {
    listUsers: {
      method: 'GET' as const,
      path: '/api/admin/users' as const,
      responses: {
        200: z.array(z.object({
          user: z.any(),
          profile: z.any(),
        })),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
