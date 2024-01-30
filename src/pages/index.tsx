import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import type { RouterOutputs, } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image";
import { LoadingPage, LoadingSpinner, } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  // the useUser was defined gobally in _app.tsx
  const { user } = useUser();
  const [input, setInput] = useState("");

  const ctx = api.useUtils();
  // this is for mutations? which im not too sure about
  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: async () => {
      setInput("");
      // i dont know exactly how this works?
      await ctx.post.getAll.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage?.[0]) {
        toast.error(errorMessage[0])

      } else {

        toast.error("Failed to post! Please try again later.")
      }
    }
  });

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <Image width={56} height={56} className="h-14 w-14 rounded-full" src={user.imageUrl} alt="Profile Image" />
      <input
        className="bg-transparent grow outline-none "
        placeholder="Type Some emojis.. "
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            if (input !== ""){
              mutate({content: input})
            }
            
          }
        }}
      />

      {input !== "" && !isPosting && (
        <button disabled={isPosting} onClick={() => mutate({ content: input })}>Post</button>
      )}

      {isPosting &&
        (
          <div className="flex justify-center items-center">
            <LoadingSpinner size={20} />
          </div>

        )
      }

    </div>
  )

}

// omg this is so nice, W trpc
type PostWithUser = RouterOutputs["post"]["getAll"][number]
const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex font-bold border-b border-slate-400 p-4 gap-3">
      <Image width={56} height={56} className="h-14 w-14 rounded-full" src={author.profilePicture} alt="post author pfp" />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-2">
          <Link href={`/@${author.username}`}><span>{`@${author.username} `}</span></Link>
          <Link href={`post/${post.id}`}><span className="font-light">{`  ·  ${dayjs(post.createdAt).fromNow()}`}</span></Link>



        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>

  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();
  
  if (postsLoading) return <LoadingPage />;

  if (!data) return <div> Something went terribly wrong </div>

  return (

    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>

  )
}

export default function Home() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  // never want a user to connect to the database directly, use tRPC to do that


  //starts the fetch, so a later component can use the cache of this fetch?
  api.post.getAll.useQuery();

  //return empty div if both arent loaded, because user should load faster
  if (!userLoaded) return <div />



  return (
    <>
      <Head>
        <title>
          Chirp
        </title>
      </Head>

      <main className="flex justify-center h-screen">

        <div className="w-full md:max-w-2xl border-x border-slate-400">

          <div className="flex border-b border-slate-400 p-4 ">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!isSignedIn && <CreatePostWizard />}
            {!!isSignedIn && <SignOutButton />}
          </div>

          <Feed />



        </div>
      </main>
    </>
  );
}
