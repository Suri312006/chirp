import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Post } from "@prisma/client";
// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true
})


const addUserDataToPosts = async (posts: Post[]) => {
  const users = (await clerkClient.users.getUserList({
    userId: posts.map((post) => post.authorId),
    limit: 100,
  })).map(filterUserForClient)
  // whoa what the fuck is that parentesis before the object notation?? oh its an implicit return??
  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId)
    // there was some kind of error here, and i dont know why
    console.log(author)
    if (!author?.username) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Author for message not found" }
    );
    return {
      post,
      author: {
        ...author,
        username: author.username
      },
    }
  });
}



export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
  getPostsByUserId: publicProcedure.input(z.object({
    userId: z.string()
  })).query(async ({ ctx, input }) => {
    const posts = await ctx.db.post.findMany({
      where: {
        authorId: input.userId,
      },
      take: 100,
      orderBy: [{ createdAt: "desc" }]
    })
    return addUserDataToPosts(posts);
  }),
  // public procedure is a trpc thing, not prisma
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      take: 100,
      orderBy: [{
        createdAt: 'desc'
      }]
    }).then(addUserDataToPosts)
  }),

  // using zod to validate the shape of the input
  // this is equivalent to an api endpoint
  create: privateProcedure.input(z.object({
    // custom error message 
    content: z.string().emoji("Only emojis are allowed!").min(1).max(280),
  }))
    .mutation(async ({ ctx, input }) => {
      // since we defined the trpc middle ware in trpc.js, we know that current
      // user must exist if we are calling it here
      // so we get full typesafety without it erroring 
      const authorId = ctx.currentUserId;

      const { success } = await ratelimit.limit(authorId)


      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const post = await ctx.db.post.create({
        data: {
          authorId,
          content: input.content
        }
      });

      return post;


    }),

});
