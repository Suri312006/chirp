import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetStaticProps, } from 'next';
import { db } from '~/server/db';
import { appRouter } from '~/server/api/root';
import superjson from 'superjson';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)


export const generateSSGHelper = () => 

  createServerSideHelpers({
    router: appRouter,
    ctx: { db, currentUserId: null },
    transformer: superjson
  });


