import Head from "next/head";
import Link from "next/link";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  // the useUser was defined gobally in _app.tsx
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <img className="h-14 w-14 rounded-full" src={user.imageUrl} alt="Profile Image" />
      <input className="bg-transparent grow outline-none " placeholder="Type Some emojis.. " />
    </div>
  )

}

// omg this is so nice, W trpc
type PostWithUser = RouterOutputs["post"]["getAll"][number]
const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex font-bold border-b border-slate-400 p-4 gap-3">
      <img className="h-14 w-14 rounded-full" src={author.profilePicture} />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-2">
          <span>{`@${author.username} `}</span>
          <span className="font-light">{`  ·  ${dayjs(post.createdAt).fromNow()}`}</span>


        </div>
        <span>{post.content}</span>
      </div>
    </div>

  )
}

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const user = useUser();
  console.log(user)
  // never want a user to connect to the database directly, use tRPC to do that
  // wait this is so clean than supabase bro omg
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div> Loading.. </div>
  if (!data) return <div> Something went terribly wrong </div>


  return (
    <>
      <Head>
        <title>
          What the fuck gang
        </title>
      </Head>

      <main className="flex justify-center h-screen">

        <div className="w-full md:max-w-2xl border-x border-slate-400">

          <div className="flex border-b border-slate-400 p-4 ">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizard />}
            {!!user.isSignedIn && <SignOutButton />}
          </div>

          <div className="flex flex-col">
            {data?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>


        </div>
      </main>
    </>
  );
}
